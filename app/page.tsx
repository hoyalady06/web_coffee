'use client';


import { Slider } from "@/components/shared/slider/Slider";

import { RecommendedProducts } from "@/components/products/RecommendedProducts";

export default function HomePage() {
  return (
    <main className="w-full pt-10">
      {/* Слайдер */}
      <Slider />

      {/* Рекомендуемые товары */}
      <div className="container mx-auto px-6 mt-14 mb-20">
        <h2 className="text-3xl font-bold text-[#4b2e16] mb-6">
           
        </h2>

        <RecommendedProducts />
      </div>
    </main>
  );
}
