"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";

export default function AdminReturnDetailsPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();

  const [ret, setRet] = useState<any>(null);
  const [item, setItem] = useState<any>(null);
  const [user, setUser] = useState<any>(null);

  const [status, setStatus] = useState<string>("");
  const [adminComment, setAdminComment] = useState<string>("");

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
    // 🔹 Возврат
    const { data: r, error } = await supabase
      .from("returns")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !r) return;

    setRet(r);
    setStatus(r.status);
    setAdminComment(r.admin_comment || "");

    // 🔹 Клиент
    const { data: userData } = await supabase
      .from("users")
      .select("name, phone")
      .eq("id", r.user_id)
      .single();

    setUser(userData);

    // 🔹 Товар возврата
    if (r.order_item_id) {
      const { data: itemData } = await supabase
        .from("order_items")
        .select("product_name, image, price")
        .eq("id", r.order_item_id)
        .single();

      setItem(itemData);
    }
  }

  async function updateStatus(newStatus: string) {
    // ⚡ СРАЗУ меняем UI
    setStatus(newStatus);

    await supabase
      .from("returns")
      .update({
        status: newStatus,
        admin_comment: adminComment,
      })
      .eq("id", id);

    setRet((prev: any) => ({
      ...prev,
      status: newStatus,
      admin_comment: adminComment,
    }));
  }

  if (!ret) return <div className="p-6">Загрузка...</div>;

  const total = (item?.price || 0) * (ret.qty || 0);

  return (
    <div className="space-y-6">
      {/* 🔝 Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Возврат № {ret.id.slice(0, 8)}
          </h1>
          <p className="text-gray-500 mt-1">
            {ret.created_at.replace("T", " ").slice(0, 16)}
          </p>
        </div>

        <button
          onClick={() => router.back()}
          className="px-4 py-2 rounded-xl border bg-white hover:bg-gray-50"
        >
          ← Назад
        </button>
      </div>

      {/* 📦 Статус */}
      <div className="bg-white rounded-xl border p-5 flex items-center justify-between">
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[status]}`}
        >
          {statusLabels[status]}
        </span>

        <select
          value={status}
          onChange={(e) => updateStatus(e.target.value)}
          className="border rounded-lg px-3 py-2 bg-white"
        >
          {Object.keys(statusLabels).map((s) => (
            <option key={s} value={s}>
              {statusLabels[s]}
            </option>
          ))}
        </select>
      </div>

      {/* 👤 Клиент */}
      <div className="bg-white rounded-xl border p-5">
        <h2 className="text-xl font-semibold mb-3">Клиент</h2>
        <p>
          Имя: <b>{user?.name || "—"}</b>
        </p>
        <p>
          Телефон: <b>{user?.phone || "—"}</b>
        </p>
      </div>

      {/* 📦 Товар */}
      <div className="bg-white rounded-xl border p-5">
        <h2 className="text-xl font-semibold mb-4">Товар</h2>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Image
              src={item?.image || "/placeholder.png"}
              alt={item?.product_name || "Товар"}
              width={70}
              height={70}
              className="rounded-xl border object-cover"
            />

            <div>
              <p className="font-medium">{item?.product_name}</p>
              <p className="text-sm text-gray-500">
                {ret.qty} × {item?.price} ₸
              </p>
            </div>
          </div>

          <p className="font-semibold">{total} ₸</p>
        </div>
      </div>

      {/* 💬 Причина */}
      <div className="bg-white rounded-xl border p-5">
        <h2 className="text-xl font-semibold mb-2">Причина возврата</h2>
        <p className="text-gray-700">
          {ret.reason || "Причина не указана"}
        </p>
      </div>

      {/* ✍️ Комментарий админа */}
      <div className="bg-white rounded-xl border p-5">
        <h2 className="text-xl font-semibold mb-2">Комментарий администратора</h2>

        <textarea
          value={adminComment}
          onChange={(e) => setAdminComment(e.target.value)}
          rows={3}
          className="w-full border rounded-xl p-3 text-sm resize-none"
          placeholder="Комментарий администратора"
        />
      </div>
    </div>
  );
}
