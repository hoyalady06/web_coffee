"use client";

import { ProductCard } from "@/components/products/ProductCard";
import { allProducts } from "@/data/products";

export function RecommendedProducts() {
  // Берём первые 6 товаров
  const recommended = allProducts.slice(20, 36);

  return (
    <section className="py-14 bg-white">
      <div className="container mx-auto px-6 md:px-12">

        <h2 className="text-3xl font-bold text-[#4b2e16] mb-10">
         ⭐ Топ лучших продаже ⭐
        </h2>

        {/* Сетка товаров */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
          {recommended.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

      </div>
    </section>
  );
}
