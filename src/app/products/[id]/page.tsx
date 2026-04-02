import { notFound } from 'next/navigation';
import { getProduct, getProducts } from '@/lib/products';
import ProductDetailClient from '@/components/ProductDetailClient';

export function generateStaticParams() {
  return getProducts().map((product) => ({
    id: product.id,
  }));
}

export default async function ProductDetailPage(props: any) {
  const resolvedParams = await props.params;
  const product = getProduct(resolvedParams.id);

  if (!product) {
    notFound();
  }

  return <ProductDetailClient product={product} />;
}
