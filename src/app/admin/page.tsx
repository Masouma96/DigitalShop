'use client';

import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card';

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

type Product = {
  id: string;
  category: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  rating: number;
  image: string;
  details: string[];
  specs: string[];
  highlights: string[];
};

const ADMIN_KEY = 'digital-shop-admin';
const PRODUCTS_KEY = 'digital-shop-added-products';

const defaultAdmin = {
  email: 'admin@digitalshop.com',
  password: 'Shop2026',
};

function getSavedProducts(): Product[] {
  if (typeof window === 'undefined') return [];
  const stored = window.localStorage.getItem(PRODUCTS_KEY);
  if (!stored) return [];
  try {
    return Array.isArray(JSON.parse(stored)) ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveProducts(items: Product[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(PRODUCTS_KEY, JSON.stringify(items));
}

function getAdminStatus() {
  if (typeof window === 'undefined') return false;
  return Boolean(window.localStorage.getItem(ADMIN_KEY));
}

function createProductFromForm(form: ProductForm): Product {
  return {
    id: `custom-${Date.now()}`,
    category: form.category || 'New category',
    name: form.name || 'New product',
    tagline: form.tagline || 'A freshly added product.',
    description:
      form.description || 'A brand new product added through the admin panel.',
    price: Number(form.price) || 49,
    rating: 4.8,
    image: '/image1.jpg',
    details: ['Custom entry', 'Admin created', 'Ready to sell'],
    specs: ['Admin-managed product', 'Live preview', 'Simple layout'],
    highlights: [
      'Added in admin view',
      'Ready for quick cart',
      'Shop instantly',
    ],
  };
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [message, setMessage] = useState('');
  const [loginForm, setLoginForm] = useState<LoginForm>({
    email: '',
    password: '',
  });
  const [form, setForm] = useState<ProductForm>({
    name: '',
    category: '',
    price: '',
    tagline: '',
    description: '',
  });
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    setIsAuthenticated(getAdminStatus());
    setProducts(getSavedProducts());
  }, []);

  function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (
      loginForm.email.trim() === defaultAdmin.email &&
      loginForm.password.trim() === defaultAdmin.password
    ) {
      window.localStorage.setItem(ADMIN_KEY, 'true');
      setIsAuthenticated(true);
      setMessage('Admin signed in successfully.');
      setLoginForm({ email: '', password: '' });
      return;
    }

    setMessage(
      'Invalid credentials. Please use admin@digitalshop.com / Shop2026',
    );
  }

  function handleLogout() {
    window.localStorage.removeItem(ADMIN_KEY);
    setIsAuthenticated(false);
    setMessage('Logged out successfully.');
  }

  function handleAddProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const newProduct = createProductFromForm(form);
    const nextProducts = [newProduct, ...products];
    saveProducts(nextProducts);
    setProducts(nextProducts);
    setMessage('Product added successfully.');
    setForm({
      name: '',
      category: '',
      price: '',
      tagline: '',
      description: '',
    });
  }

  function updateLoginField(field: keyof LoginForm, value: string) {
    setLoginForm((prev) => ({ ...prev, [field]: value }));
  }

  function updateField(field: keyof ProductForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
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
                Manage products and inventory.
              </h1>
            </div>
            <div className="flex gap-3">
              <Button asChild variant="outline" size="sm">
                <a href="/products">View storefront</a>
              </Button>
              {isAuthenticated ? (
                <Button variant="secondary" size="sm" onClick={handleLogout}>
                  Sign out
                </Button>
              ) : null}
            </div>
          </div>
        </div>

        {!isAuthenticated ? (
          <Card className="rounded-3xl border-slate-200 p-8">
            <CardTitle className="text-2xl">Admin login</CardTitle>
            <CardDescription className="mt-3 text-slate-600">
              Use credentials admin@digitalshop.com / Shop2026 to access the
              product manager.
            </CardDescription>
            <form className="mt-8 grid gap-4" onSubmit={handleLogin}>
              <label className="grid gap-2 text-sm text-slate-700">
                Email
                <input
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
                  value={loginForm.email}
                  onChange={(event) =>
                    updateLoginField('email', event.target.value)
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
                    updateLoginField('password', event.target.value)
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
                        value={form.name}
                        onChange={(event) =>
                          updateField('name', event.target.value)
                        }
                      />
                    </label>
                    <label className="grid gap-2 text-sm text-slate-700">
                      Category
                      <input
                        className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
                        value={form.category}
                        onChange={(event) =>
                          updateField('category', event.target.value)
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
                        value={form.price}
                        onChange={(event) =>
                          updateField('price', event.target.value)
                        }
                        placeholder="49"
                      />
                    </label>
                    <label className="grid gap-2 text-sm text-slate-700">
                      Tagline
                      <input
                        className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
                        value={form.tagline}
                        onChange={(event) =>
                          updateField('tagline', event.target.value)
                        }
                      />
                    </label>
                  </div>
                  <label className="grid gap-2 text-sm text-slate-700">
                    Description
                    <textarea
                      rows={4}
                      className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
                      value={form.description}
                      onChange={(event) =>
                        updateField('description', event.target.value)
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
                  <CardTitle className="text-xl">
                    No custom products yet
                  </CardTitle>
                  <CardDescription className="mt-3 text-slate-600">
                    Add products using the form above and they will be saved for
                    this browser.
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
