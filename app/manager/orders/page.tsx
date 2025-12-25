"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CatalogLoader } from "@/components/ui/CatalogLoader";
import { ManagerShell } from "@/components/ManagerShell";

export default function ManagerOrdersPage() {
  const router = useRouter();

  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState("");

  const [filter, setFilter] = useState<
    "all" | "active" | "done" | "canceled"
  >("all");

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
    load();
  }, [date]);

  async function load() {
    setLoading(true);
    const res = await fetch(`/api/manager/orders?date=${date}`);
    const data = await res.json();
    setOrders(data.orders || []);
    setLoading(false);
  }

  async function changeStatus(orderId: string, newStatus: string) {
    await fetch("/api/manager/orders/update-status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        order_id: orderId,
        new_status: newStatus,
      }),
    });

    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, status: newStatus } : o
      )
    );
  }

  function filteredOrders() {
    if (filter === "all") return orders;

    if (filter === "active") {
      return orders.filter((o) =>
        ["processing", "confirmed", "preparing", "on_way"].includes(o.status)
      );
    }

    if (filter === "done") {
      return orders.filter((o) => o.status === "delivered");
    }

    if (filter === "canceled") {
      return orders.filter((o) => o.status === "canceled");
    }

    return orders;
  }

  return (
     <ManagerShell>
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Заказы</h1>
          <p className="text-gray-500 mt-1">
            Управление заказами магазина
          </p>
        </div>

        <div className="flex items-center gap-3 border rounded-2xl px-6 py-3 bg-white">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="outline-none bg-transparent"
          />
        </div>
      </div>

      {/* FILTER */}
      <div className="flex gap-3 mb-8">
        {[
          { key: "all", label: "Все" },
          { key: "active", label: "Активные" },
          { key: "done", label: "Выполненные" },
          { key: "canceled", label: "Отменённые" },
        ].map((f: any) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-5 py-2 rounded-full border text-sm transition
              ${
                filter === f.key
                  ? "bg-[#860120] text-white border-[#860120]"
                  : "bg-white hover:bg-gray-50"
              }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      {loading && <CatalogLoader />}

      {!loading && filteredOrders().length === 0 && (
        <p className="text-gray-600">Заказы не найдены</p>
      )}

      {!loading && filteredOrders().length > 0 && (
        <div className="space-y-6">
          {filteredOrders().map((o) => (
            <div
              key={o.id}
              className="border rounded-2xl bg-white shadow-sm hover:shadow-md transition"
            >
              {/* TOP */}
              <div className="flex items-center justify-between px-6 py-4 border-b">
                <div className="text-lg font-semibold">
                  Заказ № {o.id.slice(0, 8)}
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[o.status]}`}
                  >
                    {statusLabels[o.status]}
                  </span>

                  <select
                    value={o.status}
                    onChange={(e) =>
                      changeStatus(o.id, e.target.value)
                    }
                    className="text-sm border rounded-xl px-3 py-1 bg-white"
                  >
                    {Object.keys(statusLabels).map((s) => (
                      <option key={s} value={s}>
                        {statusLabels[s]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* BODY */}
              <div className="p-6">
                <div className="flex gap-3">
                  {o.order_items?.slice(0, 3).map((item: any) => (
                    <Image
                      key={item.id}
                      src={item.image || "/placeholder.png"}
                      alt={item.product_name || "Товар"}
                      width={72}
                      height={72}
                      className="rounded-xl border object-cover"
                    />
                  ))}
                </div>

                <div className="mt-4 font-medium">
                  Сумма: {o.total} ₸
                </div>

                <div className="text-gray-600 mt-1">
                  Дата: {o.created_at.replace("T", " ").slice(0, 16)}
                </div>

                <button
                  onClick={() =>
                    router.push(`/manager/orders/${o.id}`)
                  }
                  className="mt-4 text-sm text-[#860120] underline"
                >
                  Подробнее →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </ManagerShell>
  );
}
