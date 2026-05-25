'use client';

import { Product } from '@/types';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  requestItemIds: Set<string>;
  onAddToRequest: (product: Product) => void;
}

export function ProductGrid({
  products,
  requestItemIds,
  onAddToRequest,
}: ProductGridProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          inRequest={requestItemIds.has(product.id)}
          onAddToRequest={onAddToRequest}
        />
      ))}
    </div>
  );
}