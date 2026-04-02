'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card';

type CartItem = {
  id: string;
  quantity: number;
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

function getCartItems(): CartItem[] {
  if (typeof window === 'undefined') return [];
  const stored = window.localStorage.getItem('digital-shop-cart');
  if (!stored) return [];
  try {
    return Array.isArray(JSON.parse(stored)) ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function getLocalProducts(): Product[] {
  if (typeof window === 'undefined') return [];
  const stored = window.localStorage.getItem('digital-shop-added-products');
  if (!stored) return [];
  try {
    return Array.isArray(JSON.parse(stored)) ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem('digital-shop-cart', JSON.stringify(items));
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    setCartItems(getCartItems());

    async function loadProducts() {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) {
          setProducts(getLocalProducts());
          return;
        }

        const apiProducts: Product[] = await response.json();
        setProducts([...apiProducts, ...getLocalProducts()]);
      } catch {
        setProducts(getLocalProducts());
      }
    }

    loadProducts();
  }, []);

  const mergedProducts = useMemo(() => {
    const available: Record<string, Product> = {};
    products.forEach((product) => {
      available[product.id] = product;
    });
    return cartItems.map((item) => ({
      item,
      product: available[item.id],
    }));
  }, [cartItems, products]);

  const total = mergedProducts.reduce((sum, entry) => {
    const product = entry.product;
    if (!product) return sum;
    return sum + product.price * entry.item.quantity;
  }, 0);

  function updateQuantity(id: string, nextQuantity: number) {
    const nextCart = cartItems
      .map((item) =>
        item.id === id ? { ...item, quantity: nextQuantity } : item,
      )
      .filter((item) => item.quantity > 0);
    setCartItems(nextCart);
    saveCart(nextCart);
  }

  function removeItem(id: string) {
    const nextCart = cartItems.filter((item) => item.id !== id);
    setCartItems(nextCart);
    saveCart(nextCart);
  }

  function clearCart() {
    setCartItems([]);
    saveCart([]);
  }

  return (
    <main className="min-h-screen bg-slate-50 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-cyan-500">
              Shopping cart
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
              Review your selected items.
            </h1>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-slate-100 px-5 py-3 text-sm font-medium text-slate-900 transition hover:bg-slate-200"
            >
              Continue shopping
            </Link>
            <Button variant="outline" onClick={clearCart} size="sm">
              Clear cart
            </Button>
          </div>
        </div>

        {cartItems.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-600 shadow-sm">
            <p className="text-xl font-semibold text-slate-900">
              Your cart is empty.
            </p>
            <p className="mt-3 text-sm leading-6">
              Add products from the shop to keep your checkout ready.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-5">
              {mergedProducts.map((entry) => {
                const product = entry.product;
                if (!product) {
                  return (
                    <Card key={entry.item.id} className="border-slate-200 p-6">
                      <CardTitle className="text-lg">Unknown product</CardTitle>
                      <CardContent className="text-sm text-slate-500">
                        This item is not available anymore.
                      </CardContent>
                    </Card>
                  );
                }

                return (
                  <Card key={product.id} className="border-slate-200 p-6">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div>
                        <p className="text-sm uppercase tracking-[0.35em] text-cyan-500">
                          {product.category}
                        </p>
                        <CardTitle className="mt-3 text-2xl">
                          {product.name}
                        </CardTitle>
                        <p className="mt-2 text-sm text-slate-600">
                          {product.tagline}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            updateQuantity(
                              product.id,
                              Math.max(1, entry.item.quantity - 1),
                            )
                          }
                        >
                          -
                        </Button>
                        <span className="min-w-8 text-center text-lg font-semibold">
                          {entry.item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            updateQuantity(product.id, entry.item.quantity + 1)
                          }
                        >
                          +
                        </Button>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-sm text-slate-500">
                        Unit price: ${product.price.toFixed(2)}
                      </p>
                      <div className="flex items-center gap-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(product.id)}
                        >
                          Remove
                        </Button>
                        <span className="text-sm font-semibold text-slate-900">
                          Subtotal: $
                          {(product.price * entry.item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            <div className="space-y-5">
              <Card className="rounded-3xl border-slate-200 p-6">
                <CardTitle className="text-lg">Order summary</CardTitle>
                <CardContent className="space-y-4 text-sm text-slate-600">
                  <div className="flex items-center justify-between">
                    <span>Items</span>
                    <span>
                      {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Estimated total</span>
                    <span className="font-semibold text-slate-900">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button className="w-full">Proceed to checkout</Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
