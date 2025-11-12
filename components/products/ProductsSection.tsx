'use client';

import { useState } from 'react';
import { ProductCard } from './ProductCard';
import { ProductModal } from './ProductModal';
import { allProducts, type Product } from '@/data/products';

interface ProductsSectionProps {
  category: 'cakes' | 'pies' | 'bakery';
}

export function ProductsSection({ category }: ProductsSectionProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const filtered = allProducts.filter((p) => p.category === category);

  return (
    <section className="py-10 bg-[#fff9f5]">
      <div className="container mx-auto px-6 md:px-12">
        <h2 className="text-3xl font-bold text-[#4b2e16] mb-6">
          {category === 'cakes'
            ? 'Наши торты'
            : category === 'pies'
            ? 'Наши пироги'
            : 'Наша выпечка'}
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map((p) => (
            <ProductCard
              key={p.id}
              name={p.name}
              price={p.price}
              image={p.image}
              description={p.description}
              onOrder={() => setSelectedProduct(p)}
            />
          ))}
        </div>
      </div>

      {selectedProduct && (
        <ProductModal
          open={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          name={selectedProduct.name}
          price={selectedProduct.price}
          image={selectedProduct.image}
          description={selectedProduct.description ?? 'Вкусный десерт для вас!'}
        />
      )}
    </section>
  );
}
