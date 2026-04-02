'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Product } from '@/components/ProductsClient';

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

export default function ProductDetailClient({ product }: { product: Product }) {
  const [message, setMessage] = useState('');

  function addToCart() {
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
    setMessage('Added to cart successfully.');
    window.setTimeout(() => setMessage(''), 2500);
  }

  return (
    <div className="min-h-screen bg-slate-50 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 rounded-3xl bg-white p-8 shadow-sm lg:flex-row lg:items-start lg:gap-12">
          <div className="relative min-h-[420px] flex-1 overflow-hidden rounded-4xl bg-slate-100 lg:min-h-[520px]">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>

          <div className="flex-1">
            <p className="text-sm uppercase tracking-[0.35em] text-cyan-500">
              {product.category}
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900">
              {product.name}
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
              {product.description}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-900">
                ${product.price.toFixed(2)}
              </span>
              <span className="rounded-full bg-cyan-100 px-4 py-2 text-sm font-semibold text-cyan-700">
                {product.rating}★ customer rating
              </span>
            </div>

            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              <Card className="rounded-3xl border-slate-200 p-6">
                <CardHeader>
                  <CardTitle className="text-lg">What you’ll love</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-slate-600">
                  {product.highlights.map((item) => (
                    <p key={item} className="leading-7">
                      {item}
                    </p>
                  ))}
                </CardContent>
              </Card>

              <Card className="rounded-3xl border-slate-200 p-6">
                <CardHeader>
                  <CardTitle className="text-lg">Key specifications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-slate-600">
                  {product.specs.map((spec) => (
                    <div key={spec} className="flex items-center gap-3">
                      <span className="inline-flex h-2.5 w-2.5 shrink-0 rounded-full bg-cyan-500" />
                      <span>{spec}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Button onClick={addToCart} className="w-full sm:w-auto">
                Add to cart
              </Button>
              <Link
                href="/products"
                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-slate-100 px-6 py-3 text-sm font-medium text-slate-900 transition hover:bg-slate-200"
              >
                Back to products
              </Link>
            </div>

            {message ? (
              <div className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700 shadow-sm">
                {message}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
