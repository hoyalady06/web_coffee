"use client";

import { useState } from "react";
import Image from "next/image";

export function AddCardModal({ open, onClose, onSuccess }: any) {
  if (!open) return null;

  const [number, setNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");

  // определение типа карты
  const brand =
    number.startsWith("5")
      ? "Mastercard"
      : number.startsWith("4")
      ? "Visa"
      : null;

  const valid =
    number.replace(/\s/g, "").length === 16 &&
    /^\d{2}\/\d{2}$/.test(expiry) &&
    /^\d{3}$/.test(cvc);

  const saveCard = () => {
    const card = {
      number,
      expiry,
      brand,
    };

    localStorage.setItem("savedCard", JSON.stringify(card));
    onSuccess?.(card);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[380px] p-6 rounded-2xl shadow-xl border border-[#eadfd7]">

        <h2 className="text-2xl font-bold text-[#4b2e16] text-center mb-5">
          Привязать карту
        </h2>

        {brand && (
          <div className="flex justify-center mb-4">
            <Image
              src={
                brand === "Visa"
                  ? "/payments/ps-visa.svg"
                  : "/payments/ps-mc.svg"
              }
              alt="brand"
              width={70}
              height={40}
            />
          </div>
        )}

        {/* Номер карты */}
        <input
          value={number}
          onChange={(e) =>
            setNumber(
              e.target.value
                .replace(/\D/g, "")
                .slice(0, 16)
                .replace(/(.{4})/g, "$1 ")
                .trim()
            )
          }
          placeholder="Номер карты"
          className="w-full border rounded-xl p-3 mb-3"
        />

        {/* MM/YY + CVC */}
        <div className="flex gap-3 mb-4">
          <input
            value={expiry}
            onChange={(e) => {
              let v = e.target.value.replace(/\D/g, "").slice(0, 4);
              if (v.length >= 3) v = v.slice(0, 2) + "/" + v.slice(2);
              setExpiry(v);
            }}
            placeholder="ММ/ГГ"
            className="w-1/2 border rounded-xl p-3"
          />

          <input
            value={cvc}
            onChange={(e) =>
              setCvc(e.target.value.replace(/\D/g, "").slice(0, 3))
            }
            placeholder="CVC"
            className="w-1/2 border rounded-xl p-3"
          />
        </div>

        <button
          disabled={!valid}
          onClick={saveCard}
          className={`w-full py-3 rounded-xl font-semibold text-white ${
            valid ? "bg-[#860120]" : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Привязать карту
        </button>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl mt-3 border"
        >
          Отмена
        </button>

      </div>
    </div>
  );
}
