import { getProducts } from '@/lib/products';
import ProductsClient, { type Product } from '@/components/ProductsClient';

export default function ProductsPage() {
  const products = getProducts();
  const categories = ['Work tech', 'Audio', 'Mobile', 'Accessories'];

  return (
    <ProductsClient
      initialProducts={products as Product[]}
      categories={categories}
    />
  );
}
