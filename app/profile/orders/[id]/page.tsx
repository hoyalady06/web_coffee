"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useCart } from "@/context/CartContext";
import Link from "next/link";

export default function OrderDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [order, setOrder] = useState<any>(null);

  const loadOrder = async () => {
    const res = await fetch(`/api/orders/get?id=${id}`);
    const data = await res.json();
    if (data.ok) setOrder(data.order);
  };

  useEffect(() => {
    loadOrder();
  }, [id]);

  if (!order) return <p>Загрузка...</p>;

  /* ===== СТАТУС ЗАКАЗА ===== */
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

  /* ===== СТАТУС ВОЗВРАТА ===== */
  const returnStatusLabels: any = {
    pending: "Возврат оформлен",
    approved: "Возврат одобрен",
    rejected: "Возврат отклонён",
  };

  const returnStatusColors: any = {
    pending: "bg-yellow-100 text-yellow-700",
    approved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
  };

  /* ===== ПОВТОР ЗАКАЗА ===== */
  const repeatOrder = () => {
    order.items.forEach((item: any) => {
      addToCart({
        id: item.product_id ?? item.id,
        name: item.name || item.product_name,
        price: Number(item.price),
        image: item.image,
        qty: Number(item.qty) || 1,
      });
    });

    alert("Товары добавлены в корзину");
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Детали заказа</h1>

      {/* ===== ИНФО О ЗАКАЗЕ ===== */}
      <div className="border rounded-2xl p-6 shadow-sm mb-10 relative">
        {/* статус заказа */}
        <div className="absolute top-4 right-4">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status]}`}
          >
            {statusLabels[order.status] || order.status}
          </span>
        </div>

        <p className="text-lg">
          Номер заказа: <b>#{order.id.slice(0, 6)}</b>
        </p>

        <p className="mt-2">
          Дата заказа: {order.created_at.replace("T", " ").slice(0, 16)}
        </p>

        <p className="mt-2">
          Сумма заказа: <b>{order.total.toLocaleString("ru-RU")} ₸</b>
        </p>

        <p className="mt-2">
          Оплата:{" "}
          <b>
            {order.payment_last4
              ? `•••• ${order.payment_last4}`
              : "Наличные / при получении"}
          </b>
        </p>

        <p className="mt-2">
          Тип доставки:{" "}
          {order.delivery_type === "delivery" ? "Доставка" : "Самовывоз"}
        </p>

        <p className="mt-2">Телефон: {order.phone}</p>
      </div>

      {/* ===== ТОВАРЫ ===== */}
      <h2 className="text-2xl font-bold mb-4">Товары в заказе</h2>

<div className="space-y-4">
  {order.items.map((item: any, i: number) => (
    <Link
      key={item.id}               // ← ВОТ ЭТО ОБЯЗАТЕЛЬНО
      href={`/product/${item.product_id}`}
      className="block"
      >
      <div
        className="relative flex gap-4 p-4 border rounded-xl shadow-sm 
                   hover:shadow-md transition cursor-pointer"
      >
        {/* BADGE ВОЗВРАТА */}
        {item.returns?.length > 0 && (
          <div className="absolute top-3 right-3 z-10">
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium
              ${returnStatusColors[item.returns[0].status]}`}
            >
              {returnStatusLabels[item.returns[0].status]}
            </span>
          </div>
        )}

        <Image
          src={item.image}
          alt={item.product_name || "product image"}
          width={70}
          height={70}
          className="rounded-xl border"
        />

        <div>
          <p className="font-semibold text-lg">
            {item.name || item.product_name}
          </p>
          <p className="text-gray-600">Цена: {item.price} ₸</p>
          <p className="text-gray-600">Кол-во: {item.qty}</p>
        </div>
      </div>
    </Link>
  ))}
</div>


      {/* ===== КНОПКИ ===== */}
      <div className="flex gap-4 mt-10">
        <button
          onClick={() => history.back()}
          className="px-6 py-3 rounded-xl border"
        >
          ← Вернуться назад
        </button>

        <button
          onClick={repeatOrder}
          className="px-6 py-3 rounded-xl bg-[#860120] text-white"
        >
          Повторить заказ
        </button>

        <button
          onClick={() =>
            (window.location.href = `/profile/orders/${order.id}/return`)
          }
          className="px-6 py-3 rounded-xl border border-[#860120] text-[#860120]"
        >
          Оформить возврат
        </button>
      </div>
    </div>
  );
}
