'use client';

import { useEffect, useState } from 'react';
import type { Product, Category } from '@/data/products';
import { ProductCard } from './ProductCard';
import { supabase } from '@/lib/supabaseClient';

interface Props {
  category: Category;
}

export function ProductsSection({ category }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadProducts() {
    const { data, error } = await supabase
      .from('allproducts')
      .select('*')
      .eq('category', category)
      .eq('is_active', true)
      .neq('status', 'archived');

    if (!error) {
      setProducts(data as Product[]);
    } else {
      console.error(error);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadProducts();

    // 🔴 REALTIME — КЛЮЧЕВОЕ
    const channel = supabase
      .channel('allproducts-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'allproducts' },
        () => {
          loadProducts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [category]);

  if (loading) {
  return (
    <div className="h-[40vh] flex flex-col items-center justify-center">
      <div className="text-6xl animate-pulse mb-4">🍰</div>

      <p className="text-lg text-[#4b2e16] font-medium">
        Готовим ваш десерт
        <span className="inline-block ml-1 animate-bounce">.</span>
        <span className="inline-block ml-1 animate-bounce [animation-delay:150ms]">.</span>
        <span className="inline-block ml-1 animate-bounce [animation-delay:300ms]">.</span>
      </p>

      <p className="text-sm text-gray-500 mt-2">
        Это займёт пару секунд
      </p>
    </div>
  );
}


  if (products.length === 0) {
    return <p className="text-gray-500">Нет товаров</p>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
