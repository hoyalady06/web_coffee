"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";

export default function PaymentsPage() {
  const [card, setCard] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem("savedCard");
    if (saved) setCard(JSON.parse(saved));
  }, []);

  const removeCard = () => {
    localStorage.removeItem("savedCard");
    setCard(null);
  };

  return (
    <>
      <h1 className="text-3xl font-bold text-[#4b2e16] mb-10">
        Способы оплаты
      </h1>

      {card ? (
        <div className="space-y-8">

          {/* Карта */}
          <div className="bg-[#fffff] border border-[#eadfd7] rounded-2xl p-6 shadow-sm">

            <div className="flex items-center justify-between">

              {/* Card info */}
              <div className="flex items-center gap-4">
                <img
                  src={
                    card.brand === "Mastercard"
                      ? "/payments/ps-mc.svg"
                      : "/payments/ps-visa.svg"
                  }
                  className="h-9 opacity-90"
                />

                <div className="space-y-1">
                  <p className="text-[20px] font-semibold text-[#4b2e16]">
                    {card.brand} •••• {card.number.slice(-4)}
                  </p>

                  <p className="text-[#7a5f4b] text-sm">
                    Действует до: {card.expiry}
                  </p>
                </div>
              </div>

              {/* Delete */}
              <button
                onClick={removeCard}
                className="p-2 rounded-xl hover:bg-[#ffecec] transition text-[#a30000]"
              >
                <Trash2 size={22} />
              </button>
            </div>
          </div>

          {/* Добавить карту */}
          <button
            className="w-full bg-[#860120] hover:bg-[#6e0119] text-white font-medium py-4 rounded-xl text-[17px] transition shadow-md"
            onClick={() => (window.location.href = "/profile/payments/add-card")}
          >
            Добавить карту
          </button>

        </div>
      ) : (
        /* Если карты нет */
        <div className="text-center py-20">

          <p className="text-2xl font-semibold text-[#4b2e16] mb-6">
            У вас нет сохранённых карт
          </p>

          <button
            className="bg-[#860120] hover:bg-[#6e0119] text-white font-medium px-10 py-4 rounded-xl shadow-md text-[17px]"
            onClick={() => (window.location.href = "/profile/payments/add-card")}
          >
            Добавить карту
          </button>
        </div>
      )}
    </>
  );
}
