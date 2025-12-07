"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { allProducts } from "@/data/products";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [focus, setFocus] = useState(false);

  // Фильтруем товары
  const results =
    query.length > 1
      ? allProducts.filter((p) =>
          p.name.toLowerCase().includes(query.toLowerCase())
        )
      : [];

  return (
    <div className="relative w-full">
      {/* Поле поиска */}
      <div className="flex items-center bg-white border border-[#eadfd7] rounded-xl px-4 py-2 shadow-sm">
        <Search size={18} className="text-gray-500" />
        <input
          type="text"
          placeholder="Поиск..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocus(true)}
          onBlur={() => setTimeout(() => setFocus(false), 200)} 
          className="flex-1 ml-3 outline-none text-[#4b2e16]"
        />
      </div>

      {/* Выпадающий список результатов */}
      {focus && results.length > 0 && (
        <div className="absolute left-0 right-0 mt-2 bg-white border border-[#eadfd7] rounded-xl shadow-xl max-h-80 overflow-y-auto z-50">

          {results.map((item) => (
            <Link
              key={item.id}
              href={`/product/${item.id}`}
              className="flex items-center gap-3 p-3 hover:bg-[#fff4ee] transition"
            >
              <Image
                src={item.image}
                width={50}
                height={50}
                alt={item.name}
                className="rounded-lg object-cover"
              />

              <div>
                <p className="font-medium text-[#4b2e16]">{item.name}</p>
                <p className="text-[#860120] text-sm font-semibold">
                  {item.price.toLocaleString("ru-RU")} ₸
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Нет результатов */}
      {focus && query.length > 1 && results.length === 0 && (
        <div className="absolute left-0 right-0 mt-2 bg-white border border-[#eadfd7] rounded-xl shadow-xl p-3 text-gray-500">
          Ничего не найдено
        </div>
      )}
    </div>
  );
}
