"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddCardPage() {
  const router = useRouter();

  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");

  // === Проверки ===
  const isCardValid = cardNumber.replace(/\s/g, "").length === 16;
  const isExpiryValid =
    /^\d{2}\/\d{2}$/.test(expiry) &&
    Number(expiry.slice(0, 2)) >= 1 &&
    Number(expiry.slice(0, 2)) <= 12;

  const isCvcValid = /^\d{3}$/.test(cvc);

  const isFormValid = isCardValid && isExpiryValid && isCvcValid;

  // === Обработка отправки ===
  const saveCard = () => {
    const data = {
      number: cardNumber,
      expiry,
      brand: cardNumber.startsWith("5") ? "Mastercard" : "Visa"
    };

    localStorage.setItem("savedCard", JSON.stringify(data));

    router.push("/profile/payments/success");
  };

  return (
    <div>
      <div className="w-full max-w-lg bg-white p-10 rounded-2xl shadow-sm border border-[#eadfd7]">

        <h1 className="text-3xl font-bold text-center text-[#4b2e16] mb-10">
          Привязка банковской карты
        </h1>

        {/* INFO */}
        <div className="bg-[#fdf4ef] border border-[#eadfd7] rounded-xl p-4 mb-8 text-[15px] text-[#4b2e16] flex items-start gap-2">
          <span className="text-[#860120] text-xl">ℹ️</span>
          <p>
            Мы спишем и сразу вернём небольшую сумму для проверки карты.
            Это безопасно и занимает несколько секунд.
          </p>
        </div>

        {/* FORM */}
        <div className="space-y-5">

          {/* Номер карты */}
          <input
            type="text"
            placeholder="Номер карты"
            value={cardNumber}
            onChange={(e) => {
              let v = e.target.value.replace(/\D/g, "").slice(0, 16);
              v = v.replace(/(.{4})/g, "$1 ").trim();
              setCardNumber(v);
            }}
            className={`w-full border ${
              cardNumber && !isCardValid ? "border-red-500" : "border-[#eadfd7]"
            } focus:border-[#860120] focus:ring-2 focus:ring-[#f7d9dd] outline-none p-4 rounded-xl text-[17px] text-[#4b2e16]`}
          />

          {/* MM/YY + CVC */}
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="MM/ГГ"
              value={expiry}
              maxLength={5}
              onChange={(e) => {
                let v = e.target.value.replace(/\D/g, "").slice(0, 4);
                if (v.length >= 3) v = v.slice(0, 2) + "/" + v.slice(2);
                setExpiry(v);
              }}
              className={`w-1/2 border ${
                expiry && !isExpiryValid ? "border-red-500" : "border-[#eadfd7]"
              } focus:border-[#860120] focus:ring-2 focus:ring-[#f7d9dd] outline-none p-4 rounded-xl text-[17px] text-[#4b2e16]`}
            />

            <input
              type="text"
              placeholder="CVC/CVV"
              maxLength={3}
              value={cvc}
              onChange={(e) =>
                setCvc(e.target.value.replace(/\D/g, "").slice(0, 3))
              }
              className={`w-1/2 border ${
                cvc && !isCvcValid ? "border-red-500" : "border-[#eadfd7]"
              } focus:border-[#860120] focus:ring-2 focus:ring-[#f7d9dd] outline-none p-4 rounded-xl text-[17px] text-[#4b2e16]`}
            />
          </div>

          {/* ICONS */}
          <div className="flex justify-center gap-5 opacity-90 pt-3">
            <img src="/payments/ps-visa.svg" className="h-7 object-contain" />
            <img src="/payments/ps-mc.svg" className="h-7 object-contain" />
          </div>

          <p className="text-center text-gray-600 text-[14px] pt-3 flex items-center justify-center gap-2">
            <span className="text-xl">🔒</span>
            Данные передаются по защищённому протоколу
          </p>

          {/* BUTTON */}
          <button
            disabled={!isFormValid}
            onClick={saveCard}
            className={`w-full mt-4 py-4 rounded-xl text-white font-medium text-[17px] transition ${
              isFormValid
                ? "bg-[#860120] hover:bg-[#6e0119]"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            Привязать карту
          </button>

        </div>
      </div>
    </div>
  );
}
