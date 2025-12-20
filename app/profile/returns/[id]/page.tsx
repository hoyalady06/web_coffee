"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function ReturnDetailsPage() {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const statusLabels: any = {
    pending: "В обработке",
    approved: "Одобрено",
    rejected: "Отклонено",
  };

  const statusColors: any = {
    pending: "bg-yellow-100 text-yellow-700",
    approved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
  };

  useEffect(() => {
    if (!id) return;

    fetch(`/api/returns/get?id=${id}`)
      .then((r) => r.json())
      .then((json) => {
        if (json.ok) setData(json.return);
        else console.error(json.error);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="p-6">Загрузка…</p>;
  if (!data) return <p className="p-6 text-red-600">Ошибка загрузки</p>;

  const totalSum = data.items.reduce(
    (sum: number, i: any) => sum + (i.price || 0) * (i.qty || 1),
    0
  );

  return (
    <div className="container mx-auto">
      {/* Заголовок */}
      <h1 className="text-3xl font-bold mb-8">Детали возврата</h1>

      {/* Инфо-карточка (как заказ) */}
      <div className="border p-5 rounded-xl shadow-sm bg-white relative hover:shadow-md transition mb-12">
        <div className="absolute top-4 right-4">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[data.status]}`}
          >
            {statusLabels[data.status]}
          </span>
        </div>

        <div className="text-xl font-semibold">
          Возврат № {data.id.slice(0, 8)}
        </div>

        <div className="text-gray-600 mt-2">
          Дата: {data.created_at.replace("T", " ").slice(0, 16)}
        </div>

        <div className="text-gray-800 font-medium mt-4">
          Сумма: {totalSum.toLocaleString("ru-RU")} ₸
        </div>

        {data.reason && (
          <div className="text-gray-600 mt-2">
            Причина: {data.reason}
          </div>
        )}
      </div>

      {/* Товары */}
      <h2 className="text-2xl font-bold mb-6">Товары в возврате</h2>

      <div className="space-y-6">
        {data.items.map((item: any) => (
          <Link
            key={item.product_id}
            href={`/product/${item.product_id}`}
            className="block"
          >
            <div className="border p-5 rounded-xl bg-white hover:shadow-md transition flex gap-5">
              <Image
                src={item.image}
                alt={item.product_name}
                width={70}
                height={70}
                className="rounded-xl border object-cover"
              />

              <div>
                <p className="font-semibold text-lg">
                  {item.product_name}
                </p>

                <p className="text-gray-600">
                  Цена:{" "}
                  {item.price
                    ? `${item.price.toLocaleString("ru-RU")} ₸`
                    : "—"}
                </p>

                <p className="text-gray-600">
                  Кол-во: {item.qty}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Назад */}
      <button
        onClick={() => history.back()}
        className="px-6 py-3 mt-8 rounded-xl border"
      >
        ← Вернуться назад
      </button>
    </div>
  );
}
