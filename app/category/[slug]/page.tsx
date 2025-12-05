"use client";

import { allProducts } from "@/data/products";
import { useParams, useRouter } from "next/navigation";
import { CategoryTabs } from "@/components/catalog/CategoryTabs";
import { useState, useEffect } from "react";
import type { Category } from "@/data/products";
import { ProductCard } from "@/components/products/ProductCard";
const categoryNames = {
  cakes:     "Наши торты",
  pies:      "Наши пироги",
  bread:     "Наш хлеб",
  bakery:    "Наша выпечка",
  desserts:  "Наши пирожные",
  cookies:   "Наше печенье",
  icecream:  "Наше мороженое",
  combo:     "Наше комбо меню",
  cafe:      "Наше кафе"
};


export default function CategoryPage() {
  const { slug } = useParams();
  const router = useRouter();
  const currentCategory = slug as Category;

  const [active, setActive] = useState<Category>(currentCategory);

  useEffect(() => {
    setActive(currentCategory);
  }, [currentCategory]);

  const filtered = allProducts.filter((p) => p.category === currentCategory);

  return (
    <main className="w-full   pb-20">

      {/* ==== Tabs (как на главной) ==== */}
      <div className="container mx-auto px-6 mt-8">
        <CategoryTabs
          active={active}
          onSelect={(cat) => router.push(`/category/${cat}`)}
        />
      </div>

      {/* ==== Заголовок (как на главной) ==== */}
      <div className="container mx-auto px-6 mt-10">
        <h1 className="text-3xl font-bold text-[#4b2e16] mb-10">
  {categoryNames[currentCategory]}
</h1>


{/* Сетка товаров */}
<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-10 gap-y-16">
  {filtered.map((item) => (
    <ProductCard key={item.id} product={item} />
  ))}
</div>

      </div>

    </main>
  );
}
