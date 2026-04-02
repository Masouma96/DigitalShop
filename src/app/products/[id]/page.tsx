import { notFound } from 'next/navigation';
import { getProduct, getProducts } from '@/lib/products';
import ProductDetailClient from '@/components/ProductDetailClient';

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({
    id: product.id,
  }));
}

export default async function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const product = await getProduct(params.id);

  if (!product) {
    notFound();
  }

  return <ProductDetailClient product={product} />;
}
