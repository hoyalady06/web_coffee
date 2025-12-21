"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Order = {
  id: string;
  status: string;
  total: number;
  created_at: string;
};

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState("all");

  const loadOrders = async () => {
    const res = await fetch("/api/admin/orders");
    const data = await res.json();
    if (data.ok) setOrders(data.orders);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const filtered =
    filter === "all"
      ? orders
      : orders.filter((o) => o.status === filter);

  return (
    <div>
      {/* Заголовок */}
      <h1 className="text-3xl font-bold text-[#860120] mb-6">
        Заказы
      </h1>

      {/* Фильтры */}
      <div className="flex gap-3 mb-6">
        {[
          { key: "all", label: "Все" },
          { key: "processing", label: "В обработке" },
          { key: "preparing", label: "Готовится" },
          { key: "delivering", label: "В пути" },
          { key: "delivered", label: "Доставлен" },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-4 py-2 rounded-lg border text-sm
              ${
                filter === f.key
                  ? "bg-[#860120] text-white"
                  : "bg-white hover:bg-gray-50"
              }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Список заказов */}
      <div className="space-y-4">
        {filtered.map((order) => (
          <div
            key={order.id}
            onClick={() => router.push(`/admin/orders/${order.id}`)}
            className="bg-white rounded-xl p-5 shadow hover:shadow-md transition cursor-pointer"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold text-lg">
                  Заказ № {order.id.slice(0, 6).toUpperCase()}
                </p>
                <p className="text-gray-500 text-sm">
                  {new Date(order.created_at).toLocaleString("ru-RU")}
                </p>
                <p className="font-bold mt-1">
                  {order.total.toLocaleString("ru-RU")} ₸
                </p>
              </div>

              <StatusBadge status={order.status} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: any = {
    processing: ["В обработке", "bg-blue-100 text-blue-700"],
    preparing: ["Готовится", "bg-orange-100 text-orange-700"],
    delivering: ["В пути", "bg-purple-100 text-purple-700"],
    delivered: ["Доставлен", "bg-green-100 text-green-700"],
  };

  const [label, color] = map[status] || ["—", "bg-gray-100"];

  return (
    <span className={`px-3 py-1 rounded-full text-sm ${color}`}>
      {label}
    </span>
  );
}
