'use client';

import { useState } from 'react';
import type { Product, Category } from '@/data/products';
import { ProductCard } from './ProductCard';
import { ProductModal } from './ProductModal';
import { allProducts } from '@/data/products';

interface ProductsSectionProps {
  category: Category; // ← тип категории
}

export function ProductsSection({ category }: ProductsSectionProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Фильтруем товары по категории
  const filtered = allProducts.filter((p) => p.category === category);

  return (
    <section className="py-10 bg-[#fff9f5]">
      <div className="container mx-auto px-6 md:px-12">

        {/* Заголовок */}
        <h2 className="text-3xl font-bold text-[#4b2e16] mb-6">
          Наши товары
        </h2>

        {/* Карточки товаров */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onOpenModal={setSelectedProduct}
            />
          ))}
        </div>
      </div>

      {/* Модалка товара */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </section>
  );
}
