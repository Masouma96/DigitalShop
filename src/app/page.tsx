import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getFeaturedProducts } from '@/lib/products';

export default async function Home() {
  const featured = await getFeaturedProducts();

  return (
    <main className="overflow-hidden">
      <section className="relative overflow-hidden bg-slate-900 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.24),transparent_18%)]" />
        <div className="relative mx-auto flex max-w-7xl flex-col gap-16 px-4 py-20 sm:px-6 lg:flex-row lg:items-center lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">
              Marketplace made modern
            </p>
            <h1 className="mt-6 text-5xl font-semibold tracking-tight text-white sm:text-6xl">
              Discover top products in a smart, polished storefront.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
              Browse curated categories, compare deals, and shop with confidence
              through a clean, responsive experience.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Button asChild>
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center px-6 py-3"
                >
                  Shop products
                </Link>
              </Button>
              <Link
                href="#featured"
                className="inline-flex items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/15"
              >
                Explore featured
              </Link>
            </div>
          </div>

          <div className="relative mx-auto aspect-4/3 w-full max-w-2xl overflow-hidden rounded-4xl border border-white/10 bg-slate-800 shadow-2xl shadow-slate-950/20">
            <Image
              src="/images.jpg"
              alt="Marketplace hero image"
              fill
              className="object-cover brightness-110"
              priority
            />
            <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-slate-950/90 to-transparent px-6 py-6 text-white">
              <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">
                Fast delivery
              </p>
              <h2 className="mt-2 text-2xl font-semibold">
                Premium products delivered swiftly
              </h2>
            </div>
          </div>
        </div>
      </section>

      <section
        id="featured"
        className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"
      >
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-cyan-500">
              Featured selection
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Best-selling products for every lifestyle.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
              Hand-picked items that combine elegant design, practical
              performance, and everyday value.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                title: 'Trusted checkout',
                description:
                  'Secure payments and reliable order confirmation for every purchase.',
              },
              {
                title: 'Fast delivery',
                description:
                  'Quick shipping options and transparent order tracking.',
              },
              {
                title: 'Premium quality',
                description:
                  'Only top-rated products selected for the marketplace.',
              },
              {
                title: 'Dedicated support',
                description:
                  'Help is available for every customer question or issue.',
              },
            ].map((item) => (
              <Card
                key={item.title}
                className="border-slate-200 bg-white p-6 shadow-sm"
              >
                <CardTitle className="text-base font-semibold text-slate-900">
                  {item.title}
                </CardTitle>
                <CardDescription className="mt-2 text-sm text-slate-600">
                  {item.description}
                </CardDescription>
              </Card>
            ))}
          </div>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {featured.map((product) => (
            <Card key={product.id} className="overflow-hidden">
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
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      ${product.price.toFixed(2)}
                    </p>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                      {product.rating}★ rating
                    </p>
                  </div>
                  <Button asChild size="sm">
                    <Link href={`/products/${product.id}`}>View</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-slate-950 text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">
                Why Digital Shop
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                An elevated shopping experience with clear product discovery.
              </h2>
              <p className="mt-6 max-w-xl text-base leading-8 text-slate-300">
                We built the store to keep your customers focused on product
                value, quality, and fast decision-making.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  title: 'Clear categories',
                  description:
                    'Shop by product type with intuitive browsing and filtering.',
                },
                {
                  title: 'Balanced visuals',
                  description:
                    'Clean cards and strong imagery create a premium marketplace feel.',
                },
                {
                  title: 'Fast browsing',
                  description:
                    'Minimal load overhead keeps the storefront snappy on every device.',
                },
                {
                  title: 'Product confidence',
                  description:
                    'Helpful details and clear pricing build customer trust.',
                },
              ].map((item) => (
                <Card
                  key={item.title}
                  className="border-slate-700 bg-slate-900/80 p-6 shadow-none"
                >
                  <CardTitle className="text-base text-white">
                    {item.title}
                  </CardTitle>
                  <CardDescription className="mt-3 text-sm leading-6 text-slate-300">
                    {item.description}
                  </CardDescription>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
          <div className="grid gap-6 lg:grid-cols-[1.5fr_0.9fr] lg:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-cyan-500">
                Quick actions
              </p>
              <h2 className="mt-4 text-3xl font-semibold text-slate-900">
                Start shopping, manage inventory, or check your cart anytime.
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-600">
                Use the top navigation to jump directly to the storefront, cart,
                or admin panel for quick management.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center rounded-2xl bg-cyan-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-cyan-600"
                >
                  Browse products
                </Link>
                <Link
                  href="/cart"
                  className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                >
                  View cart
                </Link>
                <Link
                  href="/admin"
                  className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-slate-100 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-200"
                >
                  Admin login
                </Link>
              </div>
            </div>
            <div className="rounded-4xl bg-slate-950 p-8 text-white shadow-xl">
              <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">
                Manage store flow
              </p>
              <ul className="mt-6 space-y-4 text-sm leading-7 text-slate-300">
                <li>• Explore featured products and quick action buttons.</li>
                <li>• Add product selections directly into the cart.</li>
                <li>• Use the admin panel to sign in and create new items.</li>
                <li>
                  • Keep your checkout ready with an interactive cart page.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
