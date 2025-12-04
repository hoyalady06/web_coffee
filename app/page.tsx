'use client';

import { useState } from "react";
import { Slider } from "@/components/shared/slider/Slider";
import { CategoryTabs } from "@/components/catalog/CategoryTabs";
import { ProductsSection } from "@/components/products/ProductsSection";
import type { Category } from "@/data/products";

export default function HomePage() {
  const [category, setCategory] = useState<Category>("cakes");

  return (
<main className="w-full bg-[#fff9f5]">

  <Slider />



</main>

  );
}
