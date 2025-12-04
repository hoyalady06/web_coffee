'use client';

import type { Product, Category } from '@/data/products';
import { ProductCard } from './ProductCard';
import { allProducts } from '@/data/products';

interface ProductsSectionProps {
  category: Category;
}

export function ProductsSection({ category }: ProductsSectionProps) {

  const filtered = allProducts.filter((p) => p.category === category);

  return (
    <section className="py-14 bg-[#fff9f5]">
      <div className="container mx-auto px-6 md:px-12">

        {/* Заголовок — выровнен под стиль категории */}
        <h2 className="text-3xl font-bold text-[#4b2e16] mt-12 mb-10">
          Наши товары
        </h2>

        {/* Сетка товаров */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-10">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

      </div>
    </section>

  );
}
