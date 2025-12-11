"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useCart } from "@/context/CartContext";

export default function ProductPage() {
  const { id } = useParams(); // ID из URL
  const router = useRouter();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 🔄 Загружаем товар из Supabase
  useEffect(() => {
    async function loadProduct() {
      const { data, error } = await supabase
        .from("allproducts")
        .select("*")
        .eq("id", Number(id))
        .single();

      if (error) {
        console.error("SUPABASE ERROR:", error);
      }

      setProduct(data);
      setLoading(false);
    }

    loadProduct();
  }, [id]);

  // 🕓 Пока идёт загрузка
  if (loading) {
    return (
      <div className="pt-40 text-center text-xl text-gray-600">
        Жүктелуде...
      </div>
    );
  }

  // ❌ Если товара нет
  if (!product) {
    return (
      <div className="pt-40 text-center text-2xl text-gray-600">
        Товар не найден 😢
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 pt-20 pb-10">
      {/* Кнопка назад */}
      <button
        onClick={() => {
          if (window.history.length > 1) router.back();
          else router.push("/");
        }}
        className="inline-flex items-center gap-2 text-lg text-[#4b2e16] hover:text-[#860120] transition mb-6"
      >
        <span className="text-2xl">←</span>
        Назад
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Фото */}
        <div>
          <div className="p-6 rounded-2xl flex items-center justify-center">
            <Image
              src={product.image}
              alt={product.name}
              width={420}
              height={420}
              className="rounded-xl"
            />
          </div>

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
          <h1 className="text-3xl font-bold mb-4 leading-snug">{product.name}</h1>

          <p className="text-gray-700 leading-relaxed whitespace-pre-line mb-4 text-[15px]">
            {product.description}
          </p>

          <h2 className="text-lg font-semibold mb-1">Стоимость:</h2>
          <p className="text-2xl font-bold text-[#860120] mb-6">
            {product.price?.toLocaleString("ru-RU")} ₸
          </p>

          {/* Кнопки */}
          <div className="flex gap-4 mt-4">
            <button className="border border-gray-300 bg-gray-100 text-gray-500 py-3 px-4 rounded-lg w-1/2 text-sm">
              Доступен на самовывоз
            </button>

            <button
              onClick={() => {
                addToCart(product);
                router.push("/checkout");
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
