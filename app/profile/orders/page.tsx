"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
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
    processing: "bg-yellow-100 text-yellow-700",  // в обработке
    confirmed: "bg-blue-100 text-blue-700",       // подтверждён
    preparing: "bg-purple-100 text-purple-700",   // готовится
    on_way: "bg-indigo-100 text-indigo-700",      // курьер в пути
    delivered: "bg-green-100 text-green-700",     // доставлен
    canceled: "bg-red-100 text-red-700",          // отменён
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

      {orders.length === 0 && <p>У вас пока нет заказов</p>}

      <div className="space-y-6">
        {orders.map((o: any) => (
        <div
          key={o.id}
          className="border p-5 rounded-xl shadow-sm bg-white relative"
        >
          {/* Статус — правый верхний угол */}
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


            {/* Статус */}
            <div className="text-gray-600 mt-2">Статус: {o.status}</div>

            {/* Мини-фотографии товаров */}
            {/* Мини-фотографии товаров */}
            <div className="flex gap-3 mt-4">
              {o.items.slice(0, 3).map((item: any, idx: number) => (
                <Image
                  key={item.order_item_id || item.id || idx}   // 🔥 уникальный key (идеально)
                  src={item.image}
                  alt={item.product_name || "Изображение товара"}
                  width={70}
                  height={70}
                  className="rounded-xl border object-cover"
                />
              ))}

              {/* Если товаров больше 3 — показываем "+N" */}
              {o.items.length > 3 && (
                <div className="w-[70px] h-[70px] rounded-xl bg-gray-100 flex items-center justify-center text-sm font-semibold text-gray-600 border">
                  +{o.items.length - 3}
                </div>
              )}
            </div>


            {/* Цена */}
            <div className="text-gray-800 font-medium mt-4">
              Сумма: {o.total} ₸
            </div>

            {/* Ссылка на детали */}
            <a
              href={`/profile/orders/${o.id}`}
              className="text-[#860120] underline mt-4 inline-block"
            >
              Подробнее →
            </a>
          </div>
        ))}
      </div>
    </>
  );
}
