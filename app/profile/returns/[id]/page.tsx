"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";

export default function ReturnDetailsPage() {
  const { id } = useParams(); // ID возврата
  const [data, setData] = useState<any>(null);

  // Перевод статусов
  const statusLabels: any = {
    pending: "В обработке",
    approved: "Одобрено",
    rejected: "Отклонено",
  };

  // Загружаем возврат
  const load = async () => {
    const res = await fetch(`/api/returns/get?id=${id}`);
    const json = await res.json();
    if (json.ok) setData(json.return);
  };

  useEffect(() => {
    load();
  }, [id]);

  if (!data) return <p>Загрузка...</p>;

  return (
    <div className="container mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-8">Детали возврата</h1>

      <div className="border rounded-2xl p-6 shadow-sm mb-10 bg-white">
        {/* Номер */}
        <p className="text-lg">
          Возврат: <b>#{data.id.slice(0, 8)}</b>
        </p>

        {/* Статус */}
        <p className="mt-2">
          Статус:{" "}
          <span className="text-[#860120] font-semibold">
            {statusLabels[data.status] || data.status}
          </span>
        </p>

        {/* Дата */}
        <p className="mt-2">
          Дата: {data.created_at.replace("T", " ").slice(0, 16)}
        </p>

        {/* Причина */}
        {data.reason && (
          <p className="mt-4 text-gray-800">
            <b>Причина:</b> {data.reason}
          </p>
        )}
      </div>

      {/* ТОВАРЫ */}
      <h2 className="text-2xl font-bold mb-4">Товары</h2>

      <div className="space-y-4">
        {data.items.map((item: any, i: number) => (
          <div
            key={i}
            className="flex gap-4 p-4 border rounded-xl shadow-sm bg-white"
          >
            <Image
              src={item.image}
              alt={item.product_name || "product image"}
              width={70}
              height={70}
              className="rounded-xl border"
            />

            <div>
              <p className="font-semibold text-lg">{item.product_name}</p>
              <p className="text-gray-600">Кол-во: {item.qty}</p>
            </div>
          </div>
        ))}
      </div>

      {/* КНОПКИ */}
      <button
        onClick={() => history.back()}
        className="px-6 py-3 mt-8 rounded-xl border"
      >
        ← Вернуться назад
      </button>
    </div>
  );
}

//Goooo