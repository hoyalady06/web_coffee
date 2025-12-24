"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function AdminReturnsPage() {
  const [returns, setReturns] = useState<any[]>([]);
  const [date, setDate] = useState("");

  const router = useRouter();

  /* 🔹 Статусы */
  const statusLabels: any = {
    pending: "В ожидании",
    approved: "Принят",
    rejected: "Отклонён",
  };

  const statusColors: any = {
    pending: "bg-yellow-100 text-yellow-700",
    approved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
  };

  /* 🔹 Фильтр */
  const [filter, setFilter] = useState<
    "all" | "pending" | "approved" | "rejected"
  >("all");

  /* 🔹 Toast */
  const [toast, setToast] = useState<null | {
    message: string;
    type?: "success" | "error";
  }>(null);

  useEffect(() => {
  load();
}, [date]);


  async function load() {
  let query = supabase
    .from("returns")
    .select(`
      id,
      status,
      qty,
      created_at,
      order_id,
      order_items (
        product_name,
        image,
        price
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
  setReturns(data || []);
}


  function getFilteredReturns() {
    if (filter === "all") return returns;
    return returns.filter((r) => r.status === filter);
  }

  /* 🔄 Смена статуса возврата */
  async function changeStatus(returnId: string, status: string) {
    const { error } = await supabase
      .from("returns")
      .update({ status })
      .eq("id", returnId);

    if (!error) {
      setReturns((prev) =>
        prev.map((r) =>
          r.id === returnId ? { ...r, status } : r
        )
      );

      setToast({ message: "Статус возврата обновлён", type: "success" });
      setTimeout(() => setToast(null), 2500);
    } else {
      setToast({ message: "Ошибка при обновлении статуса", type: "error" });
      setTimeout(() => setToast(null), 3000);
    }
  }

  return (
    <>
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold">Возвраты</h1>
        <p className="text-gray-500">Управление возвратами</p>
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


      {/* 🔹 Фильтры */}
      <div className="flex gap-3 mb-8">
        {[
          { key: "all", label: "Все" },
          { key: "pending", label: "В ожидании" },
          { key: "approved", label: "Принятые" },
          { key: "rejected", label: "Отклонённые" },
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

      {returns.length === 0 && (
        <p className="text-gray-600">Пока нет возвратов</p>
      )}

      {/* 🔹 Список возвратов */}
      <div className="space-y-6">
        {getFilteredReturns().map((r) => {
          const total =
            (r.qty || 0) * (r.order_items?.price || 0);

          return (
            <div
              key={r.id}
              className="border rounded-xl shadow-sm bg-white hover:shadow-md transition"
            >
              {/* 🔝 Верхняя панель */}
              <div className="flex items-center justify-between px-5 py-4 border-b">
                <div className="text-lg font-semibold">
                  Возврат № {r.id.slice(0, 8)}
                </div>

                <div className="flex items-center gap-3">
                  {/* Текущий статус */}
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[r.status]}`}
                  >
                    {statusLabels[r.status]}
                  </span>

                  {/* Управление статусом */}
                  <select
                    value={r.status}
                    onChange={(e) =>
                      changeStatus(r.id, e.target.value)
                    }
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

              {/* 📦 Контент */}
              <div className="p-5">
                <div className="flex items-center gap-4">
                  <Image
                    src={r.order_items?.image || "/placeholder.png"}
                    alt={r.order_items?.product_name || "Товар"}
                    width={70}
                    height={70}
                    className="rounded-xl border object-cover"
                  />

                  <div>
                    <p className="font-medium">
                      {r.order_items?.product_name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {r.qty} × {r.order_items?.price} ₸
                    </p>
                  </div>
                </div>

                <div className="mt-4 font-medium">
                  Сумма возврата: {total} ₸
                </div>

                <div className="text-gray-600 mt-2">
                  Дата: {r.created_at.replace("T", " ").slice(0, 16)}
                </div>

                <button
                  onClick={() =>
                    router.push(`/admin/returns/${r.id}`)
                  }
                  className="mt-4 text-sm text-[#860120] underline"
                >
                  Подробнее →
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 🔔 Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50">
          <div
            className={`px-5 py-3 rounded-xl shadow-lg text-white text-sm transition
              ${
                toast.type === "error"
                  ? "bg-red-600"
                  : "bg-[#860120]"
              }`}
          >
            {toast.message}
          </div>
        </div>
      )}
    </>
  );
}
