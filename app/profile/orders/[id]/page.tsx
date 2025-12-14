"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useCart } from "@/context/CartContext";   // ← Добавили!

export default function OrderDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();  // ← Получили функцию добавления в корзину

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

  // 🔥 Повторить заказ
// 🔥 Повторить заказ
const repeatOrder = () => {
  order.items.forEach((item: any) => {
    addToCart({
      id: item.product_id ?? item.id ?? item.item_id,
      name: item.name,
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

      <div className="border rounded-2xl p-6 shadow-sm mb-10">
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
          Оплата: <b>•••• {order.payment_last4}</b>
        </p>

        <p className="mt-2">
          Тип доставки:{" "}
          {order.delivery_type === "delivery" ? "Доставка" : "Самовывоз"}
        </p>

        <p className="mt-2">Телефон: {order.phone}</p>

        <p className="mt-2">
          Статус заказа:
          <span className="text-blue-600 ml-1">{order.status}</span>
        </p>
      </div>

      {/* ТОВАРЫ */}
      <h2 className="text-2xl font-bold mb-4">Товары в заказе</h2>

      <div className="space-y-4">
        {order.items.map((item: any, i: number) => (
          <div
            key={i}
            className="flex gap-4 p-4 border rounded-xl shadow-sm"
          >
            <Image
            src={item.image}
            alt={item.product_name || "product image"}
            width={70}
            height={70}
            className="rounded-xl border"
          />

            <div>
              <p className="font-semibold text-lg">{item.name}</p>
              <p className="text-gray-600">Цена: {item.price} ₸</p>
              <p className="text-gray-600">Кол-во: {item.qty}</p>
            </div>
          </div>
        ))}
      </div>

      {/* КНОПКИ */}
      {/* КНОПКИ */}
      <div className="flex gap-4 mt-10">

        {/* Назад */}
        <button
          onClick={() => history.back()}
          className="px-6 py-3 rounded-xl border"
        >
          ← Вернуться назад
        </button>

        {/* Повторить заказ */}
        <button
          onClick={repeatOrder}
          className="px-6 py-3 rounded-xl bg-[#860120] text-white"
        >
          Повторить заказ
        </button>

        {/* 🆕 Оформить возврат */}
        <button
          onClick={() => (window.location.href = `/profile/orders/${order.id}/return`)}
          className="px-6 py-3 rounded-xl border border-[#860120] text-[#860120]"
        >
          Оформить возврат
        </button>

      </div>

    </div>
  );
}
//Gooo