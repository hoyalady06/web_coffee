"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { CatalogLoader } from "@/components/ui/CatalogLoader";

const categories = [
  "all",
  "cakes",
  "pies",
  "bread",
  "bakery",
  "desserts",
  "cookies",
  "icecream",
  "combo",
  "cafe",
];

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔎 фильтры
  const [category, setCategory] = useState("all");
  const [onlyDiscount, setOnlyDiscount] = useState(false);
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadProducts();
  }, [category, onlyDiscount, status, search]);

  async function loadProducts() {
    setLoading(true);

    let query = supabase.from("allproducts").select("*");

    if (category !== "all") {
      query = query.eq("category", category);
    }

    if (onlyDiscount) {
      query = query.gt("discount_percent", 0);
    }

    if (status !== "all") {
      query = query.eq("status", status);
    }

    if (search.trim()) {
      query = query.ilike("name", `%${search}%`);
    }

    const { data, error } = await query.order("created_at", {
      ascending: false,
    });

    if (!error) setProducts(data || []);
    else console.error(error);

    setLoading(false);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Товары</h1>

      {/* 🔎 ФИЛЬТРЫ */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 bg-[#FFFAF9] p-4 rounded-2xl border border-[#FFFAG1]">

        {/* Поиск */}
        <input
          placeholder="Поиск по названию"
          className="border rounded-xl px-4 py-2 text-black"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Категория */}
        <select
          className="border rounded-xl px-4 py-2"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c === "all" ? "Все категории" : c}
            </option>
          ))}
        </select>

        {/* Статус */}
        <select
          className="border rounded-xl px-4 py-2"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="all">Все статусы</option>
           <option value="active">🟢 Активен</option>
          <option value="hidden">Скрыт</option>
          <option value="out_of_stock">Нет в наличии</option>
          <option value="archived">Архив</option>
        </select>

        {/* Скидки */}
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={onlyDiscount}
            onChange={(e) => setOnlyDiscount(e.target.checked)}
          />
          Только со скидкой
        </label>
      </div>

      {/* 📦 СПИСОК */}
      {loading && <CatalogLoader />}


      {!loading &&
        products.map((p) => (
          <div
            key={p.id}
            className="border rounded-2xl p-5 flex justify-between items-center hover:bg-[#FFFAF9]"
          >
            {/* Левая часть */}
            <div className="flex gap-4 items-center">
              <Image
                src={p.image || "/placeholder.png"}
                alt={p.name}
                width={64}
                height={64}
                className="rounded-xl border"
              />

              <div>
                <p className="font-medium">{p.name}</p>
                <p className="text-sm text-gray-500">{p.category}</p>

                {p.discount_percent > 0 && (
                  <p className="text-sm text-red-600">
                    Скидка {p.discount_percent}%
                  </p>
                )}

                {p.status === "archived" && (
                  <p className="text-xs text-gray-400">Архив</p>
                )}
              </div>
            </div>

            {/* Правая часть */}
            <div className="flex items-center gap-6">
              <div className="text-right">
                {p.discount_percent > 0 ? (
                  <>
                    <p className="line-through text-gray-400 text-sm">
                      {p.price} ₸
                    </p>
                    <p className="font-semibold text-red-600">
                      {p.final_price} ₸
                    </p>
                  </>
                ) : (
                  <p className="font-semibold">{p.price} ₸</p>
                )}
              </div>

              <Link
                href={`/admin/products/${p.id}`}
                className="text-[#860120] text-sm underline"
              >
                ✏️ Редактировать
              </Link>
            </div>
          </div>
        ))}
    </div>
  );
}
