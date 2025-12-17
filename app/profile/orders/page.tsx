"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  const statusLabels: any = {
    processing: "В обработке",
    confirmed: "Подтверждён",
    preparing: "Готовится",
    on_way: "Курьер в пути",
    delivered: "Доставлен",
    canceled: "Отменён",
  };

  const statusColors: any = {
    processing: "bg-yellow-100 text-yellow-700",
    confirmed: "bg-blue-100 text-blue-700",
    preparing: "bg-purple-100 text-purple-700",
    on_way: "bg-indigo-100 text-indigo-700",
    delivered: "bg-green-100 text-green-700",
    canceled: "bg-red-100 text-red-700",
  };

  useEffect(() => {
    const id = localStorage.getItem("user_id");
    setUserId(id);
  }, []);

  useEffect(() => {
    if (userId) load();
  }, [userId]);

  const load = async () => {
    const res = await fetch(`/api/orders/list?userId=${userId}`);
    const data = await res.json();
    if (data.ok) setOrders(data.orders);
  };

  return (
    <>
      <h1 className="text-3xl font-bold mb-8">Мои заказы</h1>

      {orders.length === 0 && (
        <p className="text-gray-600">У вас пока нет заказов</p>
      )}

      <div className="space-y-6">
        {orders.map((o: any) => (
          <div
            key={o.id}
            onClick={() => {
              window.location.href = `/profile/orders/${o.id}`;
            }}
            className="border p-5 rounded-xl shadow-sm bg-white relative cursor-pointer hover:shadow-md transition"
          >
            {/* Статус */}
            <div className="absolute top-4 right-4">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[o.status]}`}
              >
                {statusLabels[o.status] || o.status}
              </span>
            </div>

            {/* Номер заказа */}
            <div className="text-xl font-semibold">
              Заказ № {o.id.slice(0, 8)}
            </div>

            {/* Товары */}
            <div className="flex gap-3 mt-4">
              {o.items.slice(0, 3).map((item: any, idx: number) => (
                <Image
                  key={item.order_item_id || item.id || idx}
                  src={item.image}
                  alt={item.product_name || "Товар"}
                  width={70}
                  height={70}
                  className="rounded-xl border object-cover"
                />
              ))}

              {o.items.length > 3 && (
                <div className="w-[70px] h-[70px] rounded-xl bg-gray-100 border flex items-center justify-center text-sm font-semibold text-gray-600">
                  +{o.items.length - 3}
                </div>
              )}
            </div>

            {/* Сумма */}
            <div className="text-gray-800 font-medium mt-4">
              Сумма: {o.total} ₸
            </div>

            {/* Дата */}
            <div className="text-gray-600 mt-2">
              Дата: {o.created_at.replace("T", " ").slice(0, 16)}
            </div>

            {/* Подробнее */}
            <Link
              href={`/profile/orders/${o.id}`}
              onClick={(e) => e.stopPropagation()}
              className="text-[#860120] underline mt-4 inline-block"
            >
              Подробнее →
            </Link>
          </div>
        ))}

      </div>
    </>
  );
}
