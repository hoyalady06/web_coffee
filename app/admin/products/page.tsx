"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    const { data } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    setProducts(data || []);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Товары</h1>

        <Link
          href="/admin/products/new"
          className="bg-[#860120] text-white px-6 py-2 rounded-full hover:opacity-90 transition"
        >
          + Добавить товар
        </Link>
      </div>

      {/* List */}
      <div className="space-y-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="border rounded-2xl p-5 flex items-center justify-between hover:bg-[#FFFAF9] transition"
          >
            <div className="flex items-center gap-4">
              <Image
                src={product.image || "/placeholder.png"}
                alt={product.name}
                width={64}
                height={64}
                className="rounded-xl object-cover border"
              />

              <div>
                <p className="font-medium">{product.name}</p>
                <p className="text-sm text-gray-500">
                  {product.category || "Без категории"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <p className="font-semibold">{product.price} ₸</p>

              <Link
                href={`/admin/products/${product.id}`}
                className="text-[#860120] hover:underline text-sm"
              >
                Редактировать
              </Link>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <p className="text-gray-500">Товаров пока нет</p>
      )}
    </div>
  );
}
