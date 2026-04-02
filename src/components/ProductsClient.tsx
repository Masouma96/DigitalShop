'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from '@/components/ui/card';

export type Product = {
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

function getStoredProducts(): Product[] {
  if (typeof window === 'undefined') return [];
  const stored = window.localStorage.getItem('digital-shop-added-products');
  if (!stored) return [];
  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function getCartItems() {
  if (typeof window === 'undefined') return [];
  const stored = window.localStorage.getItem('digital-shop-cart');
  if (!stored) return [];
  try {
    return Array.isArray(JSON.parse(stored)) ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveCart(items: Array<{ id: string; quantity: number }>) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem('digital-shop-cart', JSON.stringify(items));
  window.dispatchEvent(new Event('digital-shop-cart-updated'));
}

export default function ProductsClient({
  initialProducts,
  categories,
}: {
  initialProducts: Product[];
  categories: string[];
}) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const localProducts = getStoredProducts();
    setProducts([...initialProducts, ...localProducts]);
    const cartItems = getCartItems();
    setCartCount(
      cartItems.reduce(
        (sum: number, item: { id: string; quantity: number }) =>
          sum + item.quantity,
        0,
      ),
    );
  }, [initialProducts]);

  function addToCart(product: Product) {
    const current = getCartItems();
    const existing = current.find(
      (item: { id: string; quantity: number }) => item.id === product.id,
    );

    const updated = existing
      ? current.map((item: { id: string; quantity: number }) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        )
      : [...current, { id: product.id, quantity: 1 }];

    saveCart(updated);
    setCartCount(
      updated.reduce(
        (sum: number, item: { id: string; quantity: number }) =>
          sum + item.quantity,
        0,
      ),
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-cyan-500">
              Marketplace catalog
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
              Products built for modern shoppers.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
              Explore a polished selection of products with clear pricing,
              premium imagery, and fast navigation.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-slate-100 px-5 py-3 text-sm font-medium text-slate-900 transition hover:bg-slate-200"
            >
              Back to home
            </Link>
            <Link
              href="/cart"
              className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-cyan-500 px-5 py-3 text-sm font-medium text-white transition hover:bg-cyan-600"
            >
              View cart ({cartCount})
            </Link>
          </div>
        </div>

        <div className="mb-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <div
              key={category}
              className="rounded-3xl border border-slate-200 bg-white px-5 py-6 text-center shadow-sm"
            >
              <p className="text-sm uppercase tracking-[0.35em] text-cyan-500">
                Category
              </p>
              <h2 className="mt-3 text-xl font-semibold text-slate-900">
                {category}
              </h2>
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {products.map((product) => (
            <Card
              key={product.id}
              className="overflow-hidden transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative h-72 overflow-hidden bg-slate-100">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="space-y-4 px-6 py-6">
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-cyan-500">
                    {product.category}
                  </p>
                  <CardTitle className="mt-2 text-2xl">
                    {product.name}
                  </CardTitle>
                  <CardDescription>{product.tagline}</CardDescription>
                </div>
                <div className="grid gap-2 text-sm text-slate-600">
                  {product.details.slice(0, 3).map((detail) => (
                    <div key={detail} className="flex items-start gap-3">
                      <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-cyan-500" />
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-3 px-6 pb-6">
                <div className="flex items-center justify-between">
                  <span className="text-xl font-semibold text-slate-900">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-slate-600">
                    {product.rating}★
                  </span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Button onClick={() => addToCart(product)} className="w-full">
                    Add to cart
                  </Button>
                  <Link
                    href={`/products/${product.id}`}
                    className="inline-flex h-11 items-center justify-center rounded-md border border-slate-200 bg-slate-100 text-sm font-medium text-slate-900 transition hover:bg-slate-200"
                  >
                    View details
                  </Link>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
