"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CatalogLoader } from "@/components/ui/CatalogLoader";
import { ManagerShell } from "@/components/ManagerShell";

export default function ManagerReturnsPage() {
  const router = useRouter();

  const [returns, setReturns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState("");

  const [filter, setFilter] = useState<
    "all" | "pending" | "approved" | "rejected"
  >("all");

  /* ===== СТАТУСЫ ===== */
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

  useEffect(() => {
    load();
  }, [date]);

  async function load() {
    setLoading(true);
    const res = await fetch(`/api/manager/returns?date=${date}`);
    const data = await res.json();
    setReturns(data.returns || []);
    setLoading(false);
  }

  async function changeStatus(returnId: string, newStatus: string) {
    await fetch("/api/manager/returns/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: returnId,
        status: newStatus,
      }),
    });

    setReturns((prev) =>
      prev.map((r) =>
        r.id === returnId ? { ...r, status: newStatus } : r
      )
    );
  }

  function filteredReturns() {
    if (filter === "all") return returns;
    return returns.filter((r) => r.status === filter);
  }

  return (
    <ManagerShell>
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Возвраты</h1>
          <p className="text-gray-500 mt-1">
            Управление возвратами клиентов
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
          { key: "pending", label: "В ожидании" },
          { key: "approved", label: "Принятые" },
          { key: "rejected", label: "Отклонённые" },
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

      {!loading && filteredReturns().length === 0 && (
        <p className="text-gray-600">Возвраты не найдены</p>
      )}

      {!loading && filteredReturns().length > 0 && (
        <div className="space-y-6">
          {filteredReturns().map((r) => {
            const item = r.order_items;
            const price = Number(item?.price || 0);
            const qty = Number(r.qty || 0);
            const sum = price * qty;


            return (
              <div
                key={r.id}
                className="border rounded-2xl bg-white shadow-sm hover:shadow-md transition"
              >
                {/* TOP */}
                <div className="flex items-center justify-between px-6 py-4 border-b">
                  <div className="text-lg font-semibold">
                    Возврат № {r.id.slice(0, 8)}
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[r.status]}`}
                    >
                      {statusLabels[r.status]}
                    </span>

                    <select
                      value={r.status}
                      onChange={(e) =>
                        changeStatus(r.id, e.target.value)
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
                  <div className="flex items-center gap-4">
                    <Image
                    src={item?.image || "/placeholder.png"}
                    alt={item?.product_name || "Товар"}
                    width={72}
                    height={72}
                    className="rounded-xl border object-cover"
                  />

                  <div className="font-medium">
                    {item?.product_name || "Товар"}
                  </div>

                  <div className="text-sm text-gray-500">
                    {qty} × {price} ₸
                  </div>

                  </div>

                  <div className="mt-4 font-medium">
                    Сумма возврата: {sum} ₸
                  </div>

                  <div className="text-gray-600 mt-1">
                    Дата: {r.created_at.replace("T", " ").slice(0, 16)}
                  </div>

                  <button
                    onClick={() =>
                      router.push(`/manager/returns/${r.id}`)
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
      )}
    </ManagerShell>
  );
}
