"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";


export default function AdminOrderDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [order, setOrder] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

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
  }, []);

  async function load() {
    // Заказ
    const { data: orderData } = await supabase
      .from("orders")
      .select("*")
      .eq("id", id)
      .single();

    if (!orderData) return;

    setOrder(orderData);

    // Клиент
    const { data: userData } = await supabase
      .from("users")
      .select("name, phone")
      .eq("id", orderData.user_id)
      .single();

    setUser(userData);

    // Товары
    const { data: itemsData } = await supabase
      .from("order_items")
      .select("*")
      .eq("order_id", id);

    setItems(itemsData || []);
  }

  async function changeStatus(status: string) {
    await supabase.from("orders").update({ status }).eq("id", id);
    setOrder((prev: any) => ({ ...prev, status }));
  }

  if (!order) return <div>Загрузка...</div>;

  return (
    
    <div className="space-y-6">
      {/* 🔝 Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Заказ № {order.id.slice(0, 8)}
          </h1>
          <p className="text-gray-500 mt-1">
            {order.created_at.replace("T", " ").slice(0, 16)}
          </p>
        </div>

      <button
        onClick={() => router.back()}
        className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-xl border bg-white hover:bg-gray-50 transition"
      >
        ← Вернуться назад
      </button>
      </div>

      {/* 📦 Статус */}
      <div className="bg-white rounded-xl border p-5 flex items-center justify-between">
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status]}`}
        >
          {statusLabels[order.status]}
        </span>

        <select
          value={order.status}
          onChange={(e) => changeStatus(e.target.value)}
          className="border rounded-lg px-3 py-2"
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
          Имя:{" "}
          <b>{order.recipient_name || user?.name || "—"}</b>
        </p>
        <p>
          Телефон:{" "}
          <b>{order.recipient_phone || user?.phone || "—"}</b>
        </p>

        {order.recipient_name && (
          <p className="mt-2 text-sm text-[#860120]">
            🎁 Доставка другому человеку
          </p>
        )}

      </div>


      {/* 🚚 Доставка */}
      <div className="bg-white rounded-xl border p-5 space-y-3">
        <h2 className="text-xl font-semibold">Доставка</h2>

        <p>
          Тип:{" "}
          <b>
            {order.delivery_type === "delivery"
              ? "Доставка"
              : "Самовывоз"}
          </b>
        </p>

        {order.delivery_type === "delivery" && (
          <>
            <p>Адрес: <b>{order.address || "—"}</b></p>
            <p>Квартира: <b>{order.apartment || "—"}</b></p>
            <p>Подъезд: <b>{order.entrance || "—"}</b></p>
            <p>Домофон: <b>{order.intercom || "—"}</b></p>
            <p>Этаж: <b>{order.floor || "—"}</b></p>
          </>
        )}
      </div>

      {/* 🕒 Дата и время */}
      <div className="bg-white rounded-xl border p-5 space-y-2">
        <h2 className="text-xl font-semibold">Дата и время</h2>

        <p>
          Дата: <b>{order.delivery_date || "—"}</b>
        </p>
        <p>
          Время: <b>{order.delivery_time || "—"}</b>
        </p>

        {order.delivery_type === "delivery" && (
          <div className="mt-3 bg-yellow-50 border border-yellow-200 text-sm rounded-lg p-3">
            ⚠️ Доставка производится в двух промежутках:
            <br />
            <b>09:30–14:30</b> и <b>15:00–19:30</b>
            <br />
            Курьер позвонит за 30 минут до приезда.
          </div>
        )}
      </div>

      {/* 💬 Комментарий */}
      <div className="bg-white rounded-xl border p-5">
        <h2 className="text-xl font-semibold mb-2">Комментарий клиента</h2>

        <p className="text-gray-700">
          {order.comment ? order.comment : "Комментарий отсутствует"}
        </p>
      </div>
      {/* 💳 Оплата */}
      <div className="bg-white rounded-xl border p-5 space-y-2">
        <h2 className="text-xl font-semibold">Оплата</h2>

        <p>
          Способ оплаты: <b>{order.payment_method || "—"}</b>
        </p>

        {order.payment_last4 && (
          <p>
            Карта: •••• <b>{order.payment_last4}</b>
          </p>
        )}
      </div>



      {/* 🛒 Товары */}
      <div className="bg-white rounded-xl border p-5">
        <h2 className="text-xl font-semibold mb-4">Состав заказа</h2>

        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center border-b pb-3"
            >
              <div className="flex items-center gap-3">
                <Image
                  src={item.image || "/placeholder.png"}
                  alt={item.product_name || "Товар"}
                  width={60}
                  height={60}
                  className="rounded-lg border object-cover"
                />

                <div>
                  <p className="font-medium">{item.product_name}</p>
                  <p className="text-sm text-gray-500">
                    {item.qty} × {item.price} ₸
                  </p>
                </div>
              </div>

              <p className="font-semibold">
                {item.qty * item.price} ₸
              </p>
            </div>
          ))}
        </div>

        <div className="flex justify-end text-xl font-bold mt-6">
          Итого: {order.total} ₸
        </div>
      </div>
    </div>
    
  );
}
