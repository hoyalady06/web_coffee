'use client';

import { useState } from 'react';
import { ProductCard } from './ProductCard';
import { ProductModal } from './ProductModal';
import { allProducts, type Product, type Category } from '@/data/products';

interface ProductsSectionProps {
  category: Category;
}

export function ProductsSection({ category }: ProductsSectionProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filtered = allProducts.filter((p) => p.category === category);

  const titles: Record<Category, string> = {
    cakes: 'Наши торты',
    pies: 'Наши пироги',
    bread: 'Наш нан',
    bakery: 'Наша выпечка',
    desserts: 'Наши пирожные',
    cookies: 'Наше печенье',
    icecream: 'Наше мороженое',
    combo: 'Наше комбо меню',
    cafe: 'Наше кафе',   // ← правильная категория
  };

  return (
    <section className="py-10 bg-[#fff9f5]">
      <div className="container mx-auto px-6 md:px-12">

        {/* Заголовок */}
        <h2 className="text-3xl font-bold text-[#4b2e16] mb-6">
          {titles[category]}
        </h2>

        {/* Карточки */}
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

      {/* Модалка */}
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
