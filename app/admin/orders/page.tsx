"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { CatalogLoader } from "@/components/ui/CatalogLoader";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const [date, setDate] = useState("");

  const [filter, setFilter] = useState<
    "all" | "active" | "done" | "canceled"
  >("all");

  const [toast, setToast] = useState<null | {
    message: string;
    type?: "success" | "error";
  }>(null);

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

    let query = supabase
      .from("orders")
      .select(`
        id,
        status,
        total,
        created_at,
        order_items (
          id,
          product_name,
          image
        )
      `)
      .order("created_at", { ascending: false });

    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);

      const end = new Date(date);
      end.setHours(23, 59, 59, 999);

      query = query
        .gte("created_at", start.toISOString())
        .lte("created_at", end.toISOString());
    }

    const { data } = await query;
    setOrders(data || []);
    setLoading(false);
  }

  async function changeStatus(orderId: string, newStatus: string) {
    const res = await fetch("/api/orders/update-status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        order_id: orderId,
        new_status: newStatus,
      }),
    });

    const data = await res.json();

    if (data.ok) {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, status: newStatus } : o
        )
      );

      setToast({ message: "Статус заказа обновлён", type: "success" });
      setTimeout(() => setToast(null), 2500);
    } else {
      setToast({ message: "Ошибка при обновлении статуса", type: "error" });
      setTimeout(() => setToast(null), 3000);
    }
  }

  function getFilteredOrders() {
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
    <>
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Заказы</h1>
          <p className="text-gray-500 mt-1">
            Управление заказами магазина
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 border rounded-2xl px-6 py-3 bg-white">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="outline-none text-base bg-transparent"
            />
          </div>

          {date && (
            <button
              onClick={() => setDate("")}
              className="text-sm text-gray-500 hover:text-[#860120]"
            >
              Сбросить дату
            </button>
          )}
        </div>
      </div>

      {/* ФИЛЬТР */}
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
            className={`px-4 py-2 rounded-xl border text-sm transition
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

      {/* КОНТЕНТ */}
      {loading && <CatalogLoader />}

      {!loading && getFilteredOrders().length === 0 && (
        <p className="text-gray-600">Заказы не найдены</p>
      )}

      {!loading && getFilteredOrders().length > 0 && (
        <div className="space-y-6">
          {getFilteredOrders().map((o) => (
            <div
              key={o.id}
              className="border rounded-xl shadow-sm bg-white hover:shadow-md transition"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b">
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
                    onChange={(e) => changeStatus(o.id, e.target.value)}
                    className="text-sm border rounded-lg px-3 py-1 bg-white hover:bg-gray-50"
                  >
                    {Object.keys(statusLabels).map((s) => (
                      <option key={s} value={s}>
                        {statusLabels[s]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="p-5">
                <div className="flex gap-3">
                  {o.order_items?.slice(0, 3).map((item: any) => (
                    <Image
                      key={item.id}
                      src={item.image || "/placeholder.png"}
                      alt={item.product_name || "Товар"}
                      width={70}
                      height={70}
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
                  onClick={() => router.push(`/admin/orders/${o.id}`)}
                  className="mt-4 text-sm text-[#860120] underline"
                >
                  Подробнее →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TOAST */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50">
          <div
            className={`px-5 py-3 rounded-xl shadow-lg text-white text-sm
              ${toast.type === "error" ? "bg-red-600" : "bg-[#860120]"}`}
          >
            {toast.message}
          </div>
        </div>
      )}
    </>
  );
}
