"use client";

import Image from "next/image";
import { allProducts } from "@/data/products";
import { use } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

export default function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const search = useSearchParams();
  const from = search.get("from"); // например: "cakes" или "salads"
  const product = allProducts.find((p) => p.id === Number(id));
  const router = useRouter();
  const { addToCart } = useCart();  
  if (!product) {
    return (
      <div className="pt-32 text-center text-3xl text-gray-600">
        Товар не найден 😢
      </div>
    );
  }

  return (
   <div className="container mx-auto px-6 pt-20 pb-10">

<button
  onClick={() => {
    if (window.history.length > 1) {
      router.back();    // Вернуться НАСТОЯЩИМ образом назад
    } else {
      router.push("/"); // А если истории нет — на главную
    }
  }}
  className="inline-flex items-center gap-2 text-lg text-[#4b2e16] hover:text-[#860120] transition mb-6"
>
  <span className="text-2xl">←</span>
  Назад
</button>



      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

        {/* Фото */}
        <div>
          <div className=" p-6 rounded-2xl flex items-center justify-center">
            <Image
              src={product.image}
              alt={product.name}
              width={420}
              height={420}
              className="rounded-xl"
            />
          </div>

          {/* Мини-картинка */}
          <div className="mt-3">
            <Image
              src={product.image}
              alt="thumb"
              width={70}
              height={70}
              className="rounded-lg border"
            />
          </div>
        </div>

        {/* Правая часть */}
        <div className="flex flex-col">

          <h1 className="text-3xl font-bold mb-4 leading-snug">
            {product.name}
          </h1>

          <p className="text-gray-700 leading-relaxed whitespace-pre-line mb-4 text-[15px]">
            {product.description}
          </p>

          <h2 className="text-lg font-semibold mb-1">Стоимость:</h2>

          <p className="text-2xl font-bold text-[#860120] mb-6">
            {product.price.toLocaleString("ru-RU")} ₸ / шт
          </p>

          {/* Кнопки */}
          <div className="flex gap-4 mt-4">
  <button className="border border-gray-300 bg-gray-100 text-gray-500 py-3 px-4 rounded-lg w-1/2 text-sm">
    Доступен на самовывоз
  </button>

{/* 🎯 КНИПКА КУПИТЬ СРАЗУ — добавляет товар */}
            <button
              onClick={() => {
                addToCart(product);     // ✅ добавляем товар
                router.push("/checkout"); // ➡ переходим в чекаут
              }}
              className="bg-[#860120] hover:bg-[#a4022a] text-white py-3 px-4 rounded-lg w-1/2 text-sm"
            >
              Купить сразу
            </button>
</div>

            
        </div>
      </div>
    </div>
  );
}
