'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

function getCartCount() {
  if (typeof window === 'undefined') return 0;
  const stored = window.localStorage.getItem('digital-shop-cart');
  if (!stored) return 0;
  try {
    const items = JSON.parse(stored);
    return Array.isArray(items)
      ? items.reduce((sum, item) => sum + Number(item.quantity || 0), 0)
      : 0;
  } catch {
    return 0;
  }
}

async function isAdminLoggedIn() {
  if (typeof window === 'undefined') return false;
  try {
    const response = await fetch('/api/auth/me');
    if (!response.ok) return false;
    const data = await response.json();
    return Boolean(data.authenticated);
  } catch {
    return false;
  }
}

export default function ShopHeader() {
  const [cartCount, setCartCount] = useState(0);
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    const handleUpdate = async () => {
      setCartCount(getCartCount());
      setAdmin(await isAdminLoggedIn());
    };

    handleUpdate();
    window.addEventListener('storage', handleUpdate);
    window.addEventListener('digital-shop-cart-updated', handleUpdate);
    window.addEventListener('digital-shop-auth-updated', handleUpdate);

    return () => {
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('digital-shop-cart-updated', handleUpdate);
      window.removeEventListener('digital-shop-auth-updated', handleUpdate);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/95 backdrop-blur-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-sm">
            D
          </div>
          <div>
            <p className="text-sm font-semibold tracking-[0.22em] text-slate-900">
              Digital Shop
            </p>
            <p className="text-xs text-slate-500">Smart marketplace UI</p>
          </div>
        </div>

        <nav className="hidden items-center gap-3 md:flex">
          <Link
            href="/"
            className="text-sm font-medium text-slate-700 transition hover:text-slate-900"
          >
            Home
          </Link>
          <Link
            href="/products"
            className="text-sm font-medium text-slate-700 transition hover:text-slate-900"
          >
            Products
          </Link>
          <Link
            href="/cart"
            className="text-sm font-medium text-slate-700 transition hover:text-slate-900"
          >
            Cart
          </Link>
          <Link
            href="/admin"
            className="text-sm font-medium text-slate-700 transition hover:text-slate-900"
          >
            Admin
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/cart">
            <Button variant="outline" size="sm" className="relative">
              Cart
              {cartCount > 0 ? (
                <span className="absolute -right-2 -top-2 inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-cyan-500 px-2 text-xs font-semibold text-white">
                  {cartCount}
                </span>
              ) : null}
            </Button>
          </Link>
          <span className="hidden rounded-2xl bg-slate-100 px-3 py-2 text-xs font-medium text-slate-700 sm:inline-flex">
            {admin ? 'Admin signed in' : 'Guest shopper'}
          </span>
        </div>
      </div>
    </header>
  );
}
