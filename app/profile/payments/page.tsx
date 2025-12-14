"use client";

import { useEffect, useState } from "react";
import { Trash2, Star } from "lucide-react";

export default function PaymentsPage() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = typeof window !== "undefined" ? localStorage.getItem("user_id") : null;

  // Load cards
  async function loadCards() {
    if (!userId) return;

    const res = await fetch(`/api/payment-methods/list?userId=${userId}`);
    const data = await res.json();

    if (data.ok) setCards(data.cards);
    setLoading(false);
  }

  useEffect(() => {
    loadCards();
  }, []);

  // Delete card
  async function deleteCard(id: number) {
    await fetch("/api/payment-methods/delete", {
      method: "POST",
      body: JSON.stringify({ cardId: id, userId }),
    });

    loadCards();
  }

  // Set primary card
  async function makePrimary(id: number) {
    await fetch("/api/payment-methods/set-primary", {
      method: "POST",
      body: JSON.stringify({ cardId: id, userId }),
    });

    loadCards();
  }

  if (loading) return <div>Загрузка...</div>;

  return (
    <>
      <h1 className="text-3xl font-bold text-[#4b2e16] mb-10">Способы оплаты</h1>

      {cards.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-2xl font-semibold text-[#4b2e16] mb-6">
            У вас нет сохранённых карт
          </p>

          <button
            className="bg-[#860120] hover:bg-[#6e0119] text-white font-medium px-12 py-4 rounded-xl shadow-md text-[17px]"
            onClick={() => (window.location.href = "/profile/payments/add-card")}
          >
            Добавить карту
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {cards.map((card: any) => (
            <div
              key={card.id}
              className="bg-white border border-[#eadfd7] rounded-2xl p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-5">
                  <img
                    src={
                      card.brand === "Mastercard"
                        ? "/payments/ps-mc.svg"
                        : "/payments/ps-visa.svg"
                    }
                    className="h-9 opacity-90"
                  />

                  <div>
                    <p className="text-lg font-semibold text-[#4b2e16]">
                      {card.brand} •••• {card.card_last4}
                    </p>
                    <p className="text-sm text-[#7a5f4b]">Действует до: {card.expiry}</p>

                    {card.is_primary && (
                      <p className="text-[#860120] font-medium text-sm mt-1">
                        Основная карта
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex gap-3">
                  {!card.is_primary && (
                    <button
                      onClick={() => makePrimary(card.id)}
                      className="p-2 rounded-xl hover:bg-[#fff0f0] text-[#860120]"
                      title="Сделать основной"
                    >
                      <Star size={22} />
                    </button>
                  )}

                  <button
                    onClick={() => deleteCard(card.id)}
                    className="p-2 rounded-xl hover:bg-[#ffe7e7] text-[#b30000]"
                    title="Удалить карту"
                  >
                    <Trash2 size={22} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          <button
            className="w-full bg-[#860120] hover:bg-[#6e0119] text-white font-medium py-4 rounded-xl text-[17px] transition shadow-md"
            onClick={() => (window.location.href = "/profile/payments/add-card")}
          >
            Добавить карту
          </button>
        </div>
      )}
    </>
  );
}
