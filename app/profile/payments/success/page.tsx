"use client";

import { useRouter } from "next/navigation";

export default function PaymentSuccessPage() {
  const router = useRouter();

  return (
    <div className="flex justify-center py-20">
      <div className="bg-white p-10 rounded-2xl shadow-sm border border-[#eadfd7] max-w-lg w-full text-center">

        <h1 className="text-3xl font-bold text-[#4b2e16] mb-6">
          Карта успешно привязана!
        </h1>

        <p className="text-[#4b2e16] text-lg mb-8">
          Ваша банковская карта была успешно добавлена в способы оплаты.
        </p>

        <button
          onClick={() => router.push("/profile/payments")}
          className="bg-[#860120] hover:bg-[#6e0119] text-white font-medium px-10 py-4 rounded-xl text-[17px]"
        >
          Вернуться к способам оплаты
        </button>

      </div>
    </div>
  );
}
