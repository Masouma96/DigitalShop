'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card';
import { type Product } from '@/lib/products';

type LoginForm = {
  email: string;
  password: string;
};

type ProductForm = {
  name: string;
  category: string;
  price: string;
  tagline: string;
  description: string;
};

export default function AdminPanel() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loginForm, setLoginForm] = useState<LoginForm>({
    email: '',
    password: '',
  });
  const [productForm, setProductForm] = useState<ProductForm>({
    name: '',
    category: '',
    price: '',
    tagline: '',
    description: '',
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    checkAuth();
    loadProducts();
  }, []);

  async function checkAuth() {
    try {
      const response = await fetch('/api/auth/me');
      const data = await response.json();
      setAuthenticated(Boolean(data.authenticated));
    } catch {
      setAuthenticated(false);
    }
  }

  async function loadProducts() {
    try {
      const response = await fetch('/api/products');
      if (!response.ok) return;
      const data = await response.json();
      setProducts(data);
    } catch {
      setProducts([]);
    }
  }

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginForm),
    });

    if (response.ok) {
      setAuthenticated(true);
      setMessage('Admin signed in successfully.');
      setLoginForm({ email: '', password: '' });
      loadProducts();
      window.dispatchEvent(new Event('digital-shop-auth-updated'));
      return;
    }

    const payload = await response.json().catch(() => null);
    setMessage(payload?.error || 'Invalid credentials');
  }

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    setAuthenticated(false);
    setMessage('Logged out successfully.');
    window.dispatchEvent(new Event('digital-shop-auth-updated'));
  }

  async function handleAddProduct(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');

    const payload = {
      product: {
        name: productForm.name,
        category: productForm.category,
        price: Number(productForm.price || 0),
        tagline: productForm.tagline,
        description: productForm.description,
        rating: 4.8,
        image: '/image1.jpg',
        details: [
          'Admin-created product',
          'Added through panel',
          'Ready to list',
        ],
        specs: ['Live inventory', 'Secure API', 'Fast creation'],
        highlights: [
          'Published from admin',
          'Available immediately',
          'Backend stored',
        ],
      },
    };

    const response = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      setMessage(data?.error || 'Could not add product.');
      return;
    }

    const created = await response.json();
    setProducts((current) => [created, ...current]);
    setMessage('Product added successfully.');
    setProductForm({
      name: '',
      category: '',
      price: '',
      tagline: '',
      description: '',
    });
  }

  function updateLoginForm(field: keyof LoginForm, value: string) {
    setLoginForm((current) => ({ ...current, [field]: value }));
  }

  function updateProductForm(field: keyof ProductForm, value: string) {
    setProductForm((current) => ({ ...current, [field]: value }));
  }

  return (
    <main className="min-h-screen bg-slate-50 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-cyan-500">
                Admin panel
              </p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
                Manage your storefront from the backend.
              </h1>
            </div>
            <div className="flex gap-3">
              <a
                href="/products"
                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-slate-100 px-5 py-3 text-sm font-medium text-slate-900 transition hover:bg-slate-200"
              >
                View storefront
              </a>
              {authenticated ? (
                <Button variant="secondary" size="sm" onClick={handleLogout}>
                  Sign out
                </Button>
              ) : null}
            </div>
          </div>
        </div>

        {!authenticated ? (
          <Card className="rounded-3xl border-slate-200 p-8">
            <CardTitle className="text-2xl">Admin login</CardTitle>
            <CardDescription className="mt-3 text-slate-600">
              Enter your credentials to sign in and manage products.
            </CardDescription>
            <form className="mt-8 grid gap-4" onSubmit={handleLogin}>
              <label className="grid gap-2 text-sm text-slate-700">
                Email
                <input
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
                  value={loginForm.email}
                  onChange={(event) =>
                    updateLoginForm('email', event.target.value)
                  }
                  placeholder="admin@digitalshop.com"
                />
              </label>
              <label className="grid gap-2 text-sm text-slate-700">
                Password
                <input
                  type="password"
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
                  value={loginForm.password}
                  onChange={(event) =>
                    updateLoginForm('password', event.target.value)
                  }
                  placeholder="Shop2026"
                />
              </label>
              <Button type="submit">Sign in</Button>
            </form>
            {message ? (
              <p className="mt-4 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-700">
                {message}
              </p>
            ) : null}
          </Card>
        ) : (
          <div className="space-y-8">
            <Card className="rounded-3xl border-slate-200 p-8">
              <CardTitle className="text-2xl">Add a new product</CardTitle>
              <CardContent className="mt-6 grid gap-4">
                <form className="grid gap-4" onSubmit={handleAddProduct}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="grid gap-2 text-sm text-slate-700">
                      Product name
                      <input
                        className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
                        value={productForm.name}
                        onChange={(event) =>
                          updateProductForm('name', event.target.value)
                        }
                      />
                    </label>
                    <label className="grid gap-2 text-sm text-slate-700">
                      Category
                      <input
                        className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
                        value={productForm.category}
                        onChange={(event) =>
                          updateProductForm('category', event.target.value)
                        }
                      />
                    </label>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="grid gap-2 text-sm text-slate-700">
                      Price
                      <input
                        type="number"
                        className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
                        value={productForm.price}
                        onChange={(event) =>
                          updateProductForm('price', event.target.value)
                        }
                        placeholder="49"
                      />
                    </label>
                    <label className="grid gap-2 text-sm text-slate-700">
                      Tagline
                      <input
                        className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
                        value={productForm.tagline}
                        onChange={(event) =>
                          updateProductForm('tagline', event.target.value)
                        }
                      />
                    </label>
                  </div>
                  <label className="grid gap-2 text-sm text-slate-700">
                    Description
                    <textarea
                      rows={4}
                      className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
                      value={productForm.description}
                      onChange={(event) =>
                        updateProductForm('description', event.target.value)
                      }
                    />
                  </label>
                  <Button type="submit">Add product</Button>
                </form>
              </CardContent>
            </Card>

            <div className="grid gap-6 lg:grid-cols-2">
              {products.length === 0 ? (
                <Card className="rounded-3xl border-slate-200 p-8">
                  <CardTitle className="text-xl">No products yet</CardTitle>
                  <CardDescription className="mt-3 text-slate-600">
                    Newly created products will appear here after you submit the
                    form.
                  </CardDescription>
                </Card>
              ) : (
                products.map((product) => (
                  <Card
                    key={product.id}
                    className="rounded-3xl border-slate-200 p-6"
                  >
                    <CardTitle className="text-xl">{product.name}</CardTitle>
                    <CardDescription className="mt-2 text-slate-600">
                      {product.tagline}
                    </CardDescription>
                    <CardContent className="mt-4 space-y-3 text-sm text-slate-600">
                      <p>{product.description}</p>
                      <p className="font-semibold text-slate-900">
                        ${product.price.toFixed(2)}
                      </p>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        )}

        {message ? (
          <p className="mt-8 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {message}
          </p>
        ) : null}
      </div>
    </main>
  );
}
