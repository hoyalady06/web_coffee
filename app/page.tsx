'use client';

import { Slider } from '@/components/shared/slider/Slider';
import { ProductsSection } from '@/components/products/ProductsSection';
import { CategoryTabs } from '@/components/catalog/CategoryTabs';
import { useState } from 'react';

export default function Home() {
  const [category, setCategory] = useState('cakes');

  return (
    <main className="w-full bg-[#fff9f5]">
      <Slider />

      <div className="container mx-auto mt-8 px-6">
        <CategoryTabs category={category} onSelect={setCategory} />
      </div>

      {/* ✅ Секция с товарами */}
      <ProductsSection category={category} />
    </main>
  );
}
