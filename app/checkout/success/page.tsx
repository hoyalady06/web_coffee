"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import confetti from "canvas-confetti";

export default function SuccessPage() {
  const params = useSearchParams();
  const orderId = params.get("order");

  useEffect(() => {
    // 🎉 первый залп
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
    });

    // ✨ второй — чуть позже (красивее)
    setTimeout(() => {
      confetti({
        particleCount: 60,
        spread: 120,
        origin: { y: 0.4 },
      });
    }, 400);
  }, []);

  return (
  <div className="min-h-[60vh] flex items-center justify-center">
  <div className="container mx-auto px-6 text-center max-s">

    {/* 🎉 Заголовок */}
    <h1 className="text-4xl md:text-5xl font-bold text-[#860120] mb-4">
      Заказ успешно оформлен! 🎉
    </h1>

    {/* 📝 Подзаголовок */}
    <p className="text-lg md:text-xl text-gray-600 mb-10">
      Можете отследить его в личном кабинете
    </p>

    {/* 🔴 Кнопка */}
    <a
      href="/profile/orders"
      className="inline-flex items-center justify-center
                 bg-[#860120] text-white
                 px-10 py-4 rounded-2xl
                 text-lg font-medium
                 hover:bg-[#a4022a]
                 transition shadow-md"
    >
      Перейти к заказам
    </a>

  </div>
</div>

  );
}
