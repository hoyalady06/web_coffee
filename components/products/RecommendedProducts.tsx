"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { ProductCard } from "@/components/products/ProductCard";

export default function RecommendedMenu() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from("allproducts")
        .select("*")
        .range(100, 123)

      if (!error && data) setItems(data);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <div className="p-6">Загрузка...</div>;

  return (
    <div>
      <h2 className="text-3xl font-bold text-[#4b2e16] mb-6">
        Рекомендуем вам
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {items.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
