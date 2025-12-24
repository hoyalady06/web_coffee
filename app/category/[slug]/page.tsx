"use client";

import { useParams, useRouter } from "next/navigation";
import { CategoryTabs } from "@/components/catalog/CategoryTabs";
import { useState, useEffect } from "react";
import type { Category } from "@/data/products";
import { ProductsSection } from "@/components/products/ProductsSection";

const categoryNames: Record<Category, string> = {
  cakes: "Наши торты",
  pies: "Наши пироги",
  bread: "Наш хлеб",
  bakery: "Наша выпечка",
  desserts: "Наши пирожные",
  cookies: "Наше печенье",
  icecream: "Наше мороженое",
  combo: "Наше комбо меню",
  cafe: "Наше кафе",
  hidden: "Сертификаты",
};

export default function CategoryPage() {
  const { slug } = useParams();
  const router = useRouter();
  const currentCategory = slug as Category;

  const [active, setActive] = useState<Category>(currentCategory);

  useEffect(() => {
    setActive(currentCategory);
  }, [currentCategory]);

  return (
    <main className="w-full pb-20">
      {/* Tabs */}
      <div className="container mx-auto px-6 mt-8">
        <CategoryTabs
          active={active}
          onSelect={(cat) => router.push(`/category/${cat}`)}
        />
      </div>

      {/* Заголовок */}
      <div className="container mx-auto px-6 mt-10">
        <h1 className="text-3xl font-bold text-[#4b2e16] mb-10">
          {categoryNames[currentCategory]}
        </h1>

        {/* 🔥 ТОВАРЫ ИЗ SUPABASE */}
        <ProductsSection category={currentCategory} />
      </div>
    </main>
  );
}
