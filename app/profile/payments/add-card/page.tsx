"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddCardPage() {
  const router = useRouter();

  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [loading, setLoading] = useState(false);

  const isCardValid = cardNumber.replace(/\s/g, "").length === 16;
  const isExpiryValid =
    /^\d{2}\/\d{2}$/.test(expiry) &&
    Number(expiry.slice(0, 2)) >= 1 &&
    Number(expiry.slice(0, 2)) <= 12;

  const isCvcValid = /^\d{3}$/.test(cvc);
  const isFormValid = isCardValid && isExpiryValid && isCvcValid;

  const saveCard = async () => {
    if (!isFormValid) return;

    // ❗ Правильный ключ
    const userId = localStorage.getItem("user_id");
    if (!userId) return alert("Ошибка: вы не авторизованы");

    setLoading(true);

    const clean = cardNumber.replace(/\s/g, "");
    const last4 = clean.slice(-4);
    const brand = clean.startsWith("5") ? "Mastercard" : "Visa";

    // ---------- API SEND ----------
    const res = await fetch("/api/payment-methods/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        card_last4: last4,
        brand,
        expiry,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!data.ok) {
      alert("Ошибка при сохранении карты");
      return;
    }

    // ---------- LOCAL SAVE (ВАЖНО!) ----------
    localStorage.setItem(
      "savedCard",
      JSON.stringify({
        brand,
        number: clean,
        expiry,
      })
    );

    // Redirect
    router.push("/profile/payments");
  };

  return (
    <div className="w-full flex justify-center mt-10">
      <div className="w-full max-w-lg bg-white p-10 rounded-2xl shadow-lg border border-[#eadfd7]">

        <h1 className="text-3xl font-bold text-center text-[#4b2e16] mb-8">
          Привязка банковской карты
        </h1>

        <div className="bg-[#fff5f5] border border-[#ffd4d4] rounded-xl p-4 mb-8 text-[#4b2e16] flex gap-3">
          <span className="text-[#860120] text-xl">ℹ️</span>
          <p>
            Мы спишем и сразу вернём небольшую сумму для проверки карты.
          </p>
        </div>

        <div className="space-y-6">

          {/* CARD NUMBER */}
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
            } rounded-xl p-4 text-lg`}
          />

          {/* EXPIRY + CVC */}
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
              } rounded-xl p-4 text-lg`}
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
              } rounded-xl p-4 text-lg`}
            />
          </div>

          {/* SUBMIT */}
          <button
            disabled={!isFormValid || loading}
            onClick={saveCard}
            className={`w-full mt-5 py-4 rounded-xl text-white text-lg font-medium transition ${
              isFormValid
                ? "bg-[#860120] hover:bg-[#6e0119]"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {loading ? "Добавление..." : "Привязать карту"}
          </button>
        </div>
      </div>
    </div>
  );
}
