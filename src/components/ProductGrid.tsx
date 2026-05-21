// src/components/ProductGrid.tsx
'use client';

import { Product } from '@/types';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  requestItemIds: Set<string>;
  onAddToRequest: (product: Product) => void;
}

export function ProductGrid({ products, requestItemIds, onAddToRequest }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-20 text-slate-500">
        <div className="text-5xl mb-4">📭</div>
        <p>Товары не найдены. Попробуйте изменить параметры поиска.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-5">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          isInRequest={requestItemIds.has(product.id)}
          onAddToRequest={onAddToRequest}
        />
      ))}
    </div>
  );
}