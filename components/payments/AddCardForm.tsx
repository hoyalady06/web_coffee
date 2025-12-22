"use client";

import { useState } from "react";

export function AddCardForm({
  onSuccess,
}: {
  onSuccess?: () => void;
}) {
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

    const userId = localStorage.getItem("user_id");
    if (!userId) return alert("Вы не авторизованы");

    setLoading(true);

    const clean = cardNumber.replace(/\s/g, "");
    const last4 = clean.slice(-4);
    const brand = clean.startsWith("5") ? "Mastercard" : "Visa";

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

    onSuccess?.(); // 🔥 ВАЖНО
  };

  return (
    <div className="space-y-6">
      <input
        placeholder="Номер карты"
        value={cardNumber}
        onChange={(e) => {
          let v = e.target.value.replace(/\D/g, "").slice(0, 16);
          v = v.replace(/(.{4})/g, "$1 ").trim();
          setCardNumber(v);
        }}
        className="w-full border rounded-xl p-4 text-lg"
      />

      <div className="flex gap-4">
        <input
          placeholder="MM/ГГ"
          value={expiry}
          maxLength={5}
          onChange={(e) => {
            let v = e.target.value.replace(/\D/g, "").slice(0, 4);
            if (v.length >= 3) v = v.slice(0, 2) + "/" + v.slice(2);
            setExpiry(v);
          }}
          className="w-1/2 border rounded-xl p-4 text-lg"
        />

        <input
          placeholder="CVC/CVV"
          maxLength={3}
          value={cvc}
          onChange={(e) =>
            setCvc(e.target.value.replace(/\D/g, "").slice(0, 3))
          }
          className="w-1/2 border rounded-xl p-4 text-lg"
        />
      </div>

      <button
        disabled={!isFormValid || loading}
        onClick={saveCard}
        className={`w-full py-4 rounded-xl text-lg text-white ${
          isFormValid
            ? "bg-[#860120] hover:bg-[#6e0119]"
            : "bg-gray-400 cursor-not-allowed"
        }`}
      >
        {loading ? "Добавление..." : "Привязать карту"}
      </button>
    </div>
  );
}
