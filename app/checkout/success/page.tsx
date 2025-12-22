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
    <div className="container mx-auto px-6 py-20 text-center">
      <h1 className="text-4xl font-bold text-[#860120] mb-6">
        Заказ успешно оформлен! 🎉
      </h1>

      <p className="text-lg text-gray-700 mb-4">
        Номер вашего заказа:
      </p>

      <p className="text-2xl font-semibold mb-10">
        {orderId}
      </p>

      <a
        href="/profile/orders"
        className="bg-[#860120] text-white px-8 py-4 rounded-xl text-lg hover:bg-[#a4022a] transition"
      >
        Перейти к заказам
      </a>
    </div>
  );
}
