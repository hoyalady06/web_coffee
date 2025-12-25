"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { ManagerShell } from "@/components/ManagerShell";
import { CatalogLoader } from "@/components/ui/CatalogLoader";

export default function ManagerReturnDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [managerComment, setManagerComment] = useState("");
  const [isEditingComment, setIsEditingComment] = useState(false);

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
    if (!id) return;
    load();
  }, [id]);

  async function load() {
    setLoading(true);
    const res = await fetch(`/api/manager/returns/get?id=${id}`);
    const json = await res.json();

    if (json.ok) {
      setData(json.return);
      setManagerComment(json.return.manager_comment || "");
    }

    setLoading(false);
  }

  async function updateStatus(newStatus: string) {
    if (
      newStatus === "rejected" &&
      managerComment.trim().length === 0
    ) {
      alert("При отклонении возврата необходимо указать комментарий");
      return;
    }

    await fetch("/api/manager/returns/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        status: newStatus,
        manager_comment: managerComment,
      }),
    });

    setData((prev: any) => ({
      ...prev,
      status: newStatus,
      manager_comment: managerComment,
    }));
  }

  if (loading) return <CatalogLoader />;
  if (!data) return <p>Возврат не найден</p>;

  const item = data.order_items;
  const price = Number(item?.price || 0);
  const qty = Number(data.qty || 0);
  const sum = price * qty;

  return (
    <ManagerShell>
      <div className="space-y-6">

        {/* 🔝 HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              Возврат № {data.id.slice(0, 8)}
            </h1>
            <p className="text-gray-500 mt-1">
              {data.created_at.replace("T", " ").slice(0, 16)}
            </p>
          </div>

          <button
            onClick={() => router.back()}
            className="px-4 py-2 rounded-xl border bg-white hover:bg-gray-50"
          >
            ← Назад
          </button>
        </div>

        {/* 🏷 СТАТУС */}
        <div className="bg-white border rounded-2xl px-6 py-5 flex items-center justify-between">
          <span
            className={`px-4 py-1 rounded-full text-sm font-medium ${statusColors[data.status]}`}
          >
            {statusLabels[data.status]}
          </span>

          <select
            value={data.status}
            onChange={(e) => updateStatus(e.target.value)}
            className="border rounded-xl px-4 py-2 bg-white"
          >
            {Object.keys(statusLabels).map((s) => (
              <option key={s} value={s}>
                {statusLabels[s]}
              </option>
            ))}
          </select>
        </div>

        {/* 👤 КЛИЕНТ */}
        <div className="bg-white border rounded-2xl px-6 py-6">
          <h3 className="text-lg font-semibold mb-4">Клиент</h3>
          <p>
            Имя: <b>{data.users?.name || "—"}</b>
          </p>
          <p className="mt-1">
            Телефон: <b>{data.users?.phone || "—"}</b>
          </p>
        </div>

        {/* 📦 ТОВАР */}
        <div className="bg-white border rounded-2xl px-6 py-6">
          <h3 className="text-lg font-semibold mb-5">Товар</h3>

          <div className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <Image
                src={item?.image || "/placeholder.png"}
                alt={item?.product_name || "Товар"}
                width={72}
                height={72}
                className="rounded-xl border object-cover"
              />

              <div>
                <p className="font-medium">{item?.product_name}</p>
                <p className="text-sm text-gray-500">
                  {qty} × {price} ₸
                </p>
              </div>
            </div>

            <div className="font-semibold text-lg">
              {sum} ₸
            </div>
          </div>
        </div>

        {/* 💬 ПРИЧИНА */}
        <div className="bg-white border rounded-2xl px-6 py-6">
          <h3 className="text-lg font-semibold mb-3">
            Причина возврата
          </h3>
          <p className="text-gray-700 whitespace-pre-line">
            {data.reason || "Причина не указана"}
          </p>
        </div>

        {/* ✍️ КОММЕНТАРИЙ МЕНЕДЖЕРА */}
        <div className="bg-white border rounded-2xl px-6 py-6 space-y-4">
          <h3 className="text-lg font-semibold">
            Комментарий менеджера
          </h3>

          {!isEditingComment && managerComment && (
            <div className="space-y-2">
              <p className="text-gray-800 whitespace-pre-line">
                {managerComment}
              </p>

              <button
                onClick={() => setIsEditingComment(true)}
                className="text-sm text-[#860120] hover:underline"
              >
                Редактировать комментарий
              </button>
            </div>
          )}

          {(isEditingComment || !managerComment) && (
            <div className="space-y-4">
              <textarea
                value={managerComment}
                onChange={(e) => setManagerComment(e.target.value)}
                rows={3}
                className="w-full border rounded-xl p-4 text-sm resize-none focus:ring-1 focus:ring-[#860120]"
                placeholder="Введите комментарий менеджера"
              />

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    updateStatus(data.status);
                    setIsEditingComment(false);
                  }}
                  disabled={!managerComment.trim()}
                  className={`px-5 py-2 rounded-xl text-sm transition
                    ${
                      !managerComment.trim()
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-[#860120] text-white hover:bg-[#a4022a]"
                    }`}
                >
                  Сохранить
                </button>

                {managerComment && (
                  <button
                    onClick={() => setIsEditingComment(false)}
                    className="px-5 py-2 rounded-xl text-sm border bg-white hover:bg-gray-50"
                  >
                    Отмена
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

      </div>
    </ManagerShell>
  );
}
