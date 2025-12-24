"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useCart } from "@/context/CartContext";

export default function ProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProduct() {
      const { data, error } = await supabase
        .from("allproducts")
        .select("*")
        .eq("id", Number(id))
        .single();

      if (error || !data) {
        setProduct(null);
      } else {
        setProduct(data);
      }

      setLoading(false);
    }

    loadProduct();
  }, [id]);

  if (loading) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#ffffff]">
      <div className="text-6xl animate-pulse mb-4">🍰</div>

      <p className="text-lg text-[#4b2e16] font-medium animate-fade-in">
        Готовим ваш десерт
        <span className="animate-ping inline-block ml-1">.</span>
        <span className="animate-ping inline-block ml-1 animation-delay-200">.</span>
        <span className="animate-ping inline-block ml-1 animation-delay-400">.</span>
      </p>

      <p className="text-sm text-gray-500 mt-2">
        Это займёт пару секунд
      </p>
    </div>
  );
}



  // ❌ нет товара
  if (!product) {
    return (
      <div className="pt-40 text-center text-2xl text-gray-600">
        Товар не найден 😢
      </div>
    );
  }

  // ❌ архив / скрыт
  if (product.status === "archived" || product.is_active === false) {
    return (
      <div className="pt-40 text-center">
        <p className="text-2xl font-semibold mb-4">
          Товар недоступен
        </p>
        <button
          onClick={() => router.push("/")}
          className="text-[#860120] underline"
        >
          Вернуться на главную
        </button>
      </div>
    );
  }

  // 💰 цена
  const discount = product.discount_percent ?? 0;
  const hasDiscount = discount > 0;

  const finalPrice = hasDiscount
    ? product.final_price ??
      Math.round(product.price * (1 - discount / 100))
    : product.price;

  return (
    <div className="container mx-auto px-6 pt-20 pb-10">
      {/* Назад */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 text-lg text-[#4b2e16] hover:text-[#860120] transition mb-6"
      >
        <span className="text-2xl">←</span>
        Назад
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Фото */}
        <div className="p-6 flex justify-center">
          <Image
            src={product.image}
            alt={product.name}
            width={420}
            height={420}
            className="rounded-xl"
          />
        </div>

        {/* Описание */}
        <div>
          <h1 className="text-3xl font-bold mb-4">
            {product.name}
          </h1>

          <p className="text-gray-700 mb-4 whitespace-pre-line">
            {product.description}
          </p>

          {/* Цена */}
          <div className="mb-6">
            {hasDiscount ? (
              <>
                <p className="text-gray-400 line-through">
                  {product.price.toLocaleString("ru-RU")} ₸
                </p>
                <p className="text-3xl font-bold text-[#860120]">
                  {finalPrice.toLocaleString("ru-RU")} ₸
                </p>
              </>
            ) : (
              <p className="text-3xl font-bold text-[#860120]">
                {product.price.toLocaleString("ru-RU")} ₸
              </p>
            )}
          </div>

          {/* Кнопки */}
         <div className="flex gap-4 mt-6">
          {/* Самовывоз */}
          <div className="border border-gray-300 bg-gray-100 text-gray-600 py-3 px-4 rounded-lg w-1/2 text-sm text-center cursor-default">
            Самовывоз доступен
          </div>

          {/* Купить */}
          <button
            onClick={() => {
              addToCart({
                ...product,
                price: finalPrice,
              });
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
