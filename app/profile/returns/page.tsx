"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function ReturnsPage() {
  const [returnsList, setReturnsList] = useState([]);
  const [userId, setUserId] = useState<string | null>(null);

  // Перевод статусов
  const statusLabels: any = {
    pending: "В обработке",
    approved: "Одобрено",
    rejected: "Отклонено",
  };

  // Цвета как в "Мои заказы"
  const statusColors: any = {
    pending: "bg-yellow-100 text-yellow-700",
    approved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
  };

  useEffect(() => {
    const id = localStorage.getItem("user_id");
    setUserId(id);
  }, []);

  useEffect(() => {
    if (userId) loadReturns();
  }, [userId]);

  const loadReturns = async () => {
    const res = await fetch(`/api/returns/list?userId=${userId}`);
    const data = await res.json();

    if (data.ok) setReturnsList(data.returns);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Мои возвраты</h1>

      {returnsList.length === 0 && (
        <p className="text-gray-600">У вас пока нет возвратов</p>
      )}

      <div className="space-y-6">
        {returnsList.map((r: any) => (
          <div
            key={r.id}
            className="border p-5 rounded-xl shadow-sm bg-white relative"
          >
            {/* Статус в правом верхнем углу */}
            <div className="absolute top-4 right-4">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[r.status]}`}
              >
                {statusLabels[r.status] || r.status}
              </span>
            </div>

            {/* Номер возврата */}
            <div className="text-xl font-semibold">
              Возврат № {r.id.slice(0, 8)}
            </div>

            {/* Фотографии товаров */}
            {r.items && r.items.length > 0 && (
              <div className="flex gap-3 mt-4">
                {r.items.slice(0, 3).map((item: any, idx: number) => (
                  <Image
                    key={idx}
                    src={item.image}
                    alt={item.product_name || "product image"}
                    width={70}
                    height={70}
                    className="rounded-xl border object-cover"
                  />
                ))}

                {r.items.length > 3 && (
                  <div className="w-[70px] h-[70px] rounded-xl bg-gray-100 border flex items-center justify-center text-sm font-semibold text-gray-600">
                    +{r.items.length - 3}
                  </div>
                )}
              </div>
            )}

            {/* Дата возврата */}
            <div className="text-gray-600 mt-3">
              Дата: {r.created_at.replace("T", " ").slice(0, 16)}
            </div>

            {/* Подробнее */}
            <a
              href={`/profile/returns/${r.id}`}
              className="text-[#860120] underline mt-4 inline-block"
            >
              Подробнее →
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
