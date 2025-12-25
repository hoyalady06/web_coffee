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
  const FREE_DELIVERY_FROM = 10000;
  const DELIVERY_PRICE = 2000;

  const safeTotal = Number(order.total ?? 0);

  const safeDeliveryPrice =
    typeof order.delivery_price === "number"
      ? order.delivery_price
      : order.delivery_type === "delivery" && safeTotal < FREE_DELIVERY_FROM
        ? DELIVERY_PRICE
        : 0;

 const productsTotal =
  safeTotal + (order.used_bonus ?? 0) - safeDeliveryPrice;

  

  const BONUS_PERCENT = 0.05;
  const bonusAmount =
    productsTotal > 0
      ? Math.floor(productsTotal * BONUS_PERCENT)
      : 0;


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

  /* ===== ФОРМАТ ДАТЫ ДЛЯ ИСТОРИИ ===== */
  const formatHistoryDate = (date: string) => {
    const d = new Date(date);
    return d.toLocaleString("ru-RU", {
      day: "numeric",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  /* ===== ТЕКСТ ИСТОРИИ (НАШИ СТАТУСЫ) ===== */
  const historyStatusText: any = {
    processing: "Оформлен",
    confirmed: "Подтверждён",
    preparing: "Готовится",
    on_way: "Курьер в пути",
    delivered: "Доставлен",
    canceled: "Отменён",
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
  <div className="max-w-5xl space-y-8">
    {/* ===== HEADER ===== */}
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <h1 className="text-4xl font-semibold text-gray-900">
        Детали заказа
      </h1>

      <span
        className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${statusColors[order.status]}`}
      >
        {statusLabels[order.status]}
      </span>
    </div>

    {/* ===== ORDER SUMMARY ===== */}
    <div className="bg-white border rounded-2xl px-6 py-5 grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
      <div>
        <p className="text-sm text-gray-500">Номер заказа</p>
        <p className="text-xl font-semibold text-gray-900">
          #{order.id.slice(0, 6)}
        </p>
      </div>

      <div>
        <p className="text-sm text-gray-500">Дата заказа</p>
        <p className="text-lg text-gray-900">
          {order.created_at.replace("T", " ").slice(0, 16)}
        </p>
      </div>

      <div>
        <p className="text-sm text-gray-500">Сумма</p>
        <p className="text-2xl font-semibold text-gray-900">
          {order.total.toLocaleString("ru-RU")} ₸
        </p>
        <p className="text-sm text-gray-600 mt-1">
          Оплата: •••• {order.payment_last4}
        </p>
      </div>
    </div>

  <div className="bg-white border rounded-2xl px-6 py-5 space-y-2">
    <div className="flex justify-between text-gray-600">
      <span>Товары</span>
      <span>
        {productsTotal.toLocaleString("ru-RU")} ₸
      </span>

    </div>

    {order.delivery_type === "delivery" && (
      <div className="flex justify-between text-gray-600">
        <span>Доставка</span>
        <span>
          {safeDeliveryPrice === 0
          ? "Бесплатно"
          : `${safeDeliveryPrice.toLocaleString("ru-RU")} ₸`}

        </span>
      </div>
    )}

    {/* 🎁 Оплата бонусами */}
    {order.used_bonus > 0 && (
      <div className="flex justify-between text-green-700 font-medium">
        <span>Оплачено бонусами</span>
        <span>−{order.used_bonus} Б</span>
      </div>
    )}


    <div className="flex justify-between font-bold text-lg pt-2 border-t">
      <span>Итого</span>
      <span>{order.total.toLocaleString("ru-RU")} ₸</span>
    </div>
   {!order.bonus_credited && bonusAmount > 0 && (
    <div className="text-green-600">
      🎁 После доставки вам будет начислено +{bonusAmount} бонусов
    </div>
  )}

  {order.bonus_credited && (
    <div className="text-blue-600">
      ✅ Начислено +{order.bonus_amount} бонусов
    </div>
  )}



  </div>



    {/* ===== DELIVERY ===== */}
    {order.delivery_type === "delivery" && (
      <div className="bg-white border rounded-2xl p-8 space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-3">
          🚚 Доставка
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <p className="text-sm text-gray-500 mb-1">Дата и время</p>
            <p className="text-lg text-gray-900 font-medium">
              {order.delivery_date}, {order.delivery_time}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-1">Получатель</p>
            <p className="text-lg font-medium text-gray-900">
              {order.recipient_name || "Вы"}
            </p>
            <p className="text-base text-gray-600">
              {order.recipient_phone || order.phone}
            </p>
          </div>

          <div className="md:col-span-2">
            <p className="text-sm text-gray-500 mb-1">Адрес доставки</p>
            <p className="text-lg font-medium text-gray-900">
              {order.address}
            </p>
            <p className="text-base text-gray-600">
              кв. {order.apartment || "—"}, подъезд {order.entrance || "—"}, этаж {order.floor || "—"}
              {order.intercom && `, домофон ${order.intercom}`}
            </p>
          </div>
        </div>
      </div>
    )}

    {/* ===== PRODUCTS ===== */}
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-3">
        📦 Товары в заказе
      </h2>

      {order.items.map((item: any) => (
        <div
          key={item.id}
          className="flex items-center gap-6 bg-white border rounded-2xl p-6"
        >
          <Image
            src={item.image}
            alt={item.product_name}
            width={96}
            height={96}
            className="rounded-xl border"
          />

          <div className="flex-1">
            <p className="text-xl font-medium text-gray-900">
              {item.name || item.product_name}
            </p>
            <p className="text-base text-gray-600 mt-1">
              Цена: {item.price} ₸ · Кол-во: {item.qty}
            </p>
          </div>
        </div>
      ))}
    </div>

    {/* ===== ACTIONS ===== */}
    <div className="flex flex-col md:flex-row gap-4 pt-4">
      <button
        onClick={() => history.back()}
        className="px-7 py-4 rounded-xl border text-base font-medium"
      >
        ← Вернуться назад
      </button>

      <button
        onClick={repeatOrder}
        className="px-7 py-4 rounded-xl bg-[#860120] text-white text-base font-medium"
      >
        Повторить заказ
      </button>

      <button
        onClick={() =>
          (window.location.href = `/profile/orders/${order.id}/return`)
        }
        className="px-7 py-4 rounded-xl border border-[#860120] text-[#860120] text-base font-medium"
      >
        Оформить возврат
      </button>
    </div>
    {order.status_history?.length > 0 && (
      <div className="bg-white border rounded-xl px-6 py-5">
        <h3 className="text-base font-semibold mb-4 text-gray-900">
          История заказа
        </h3>

        <div className="relative pl-4 space-y-4">
          {/* вертикальная линия */}
          <div className="absolute left-1 top-1 bottom-1 w-px bg-gray-200" />

          {order.status_history
              .slice()
              .reverse()
              .map((item: any, i: number) => (
              <div key={i} className="relative flex gap-3">
                {/* точка */}
                <div
                  className={`mt-1 w-2 h-2 rounded-full shrink-0 ${
                    i === 0 ? "bg-[#860120]" : "bg-gray-300"
                  }`}
                />

                {/* текст */}
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500">
                    {formatHistoryDate(item.created_at)}
                  </span>

                  <span className="text-sm font-medium text-gray-900">
                  {historyStatusText[item.status]}
                </span>


                </div>
              </div>
            ))}

        </div>
      </div>
)}

  </div>
);

}