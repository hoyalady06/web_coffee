"use client";

import { useCart } from "@/context/CartContext";
import Image from "next/image";
import { IMaskInput } from "react-imask";
import { useEffect, useState } from "react";

export default function CheckoutPage() {
  const { cart, changeQty, removeFromCart, clearCart } = useCart();

  const [cards, setCards] = useState<any[]>([]);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [deliveryType, setDeliveryType] = useState<"delivery" | "pickup">("delivery");

  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");

  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const id = localStorage.getItem("user_id");
    setUserId(id);
  }, []);

  useEffect(() => {
    if (userId) loadCards();
  }, [userId]);


  const isValidPhone = phone.replace(/\D/g, "").length === 11;
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  // === Загружаем карты ===
  const loadCards = async () => {
    if (!userId) return;

    const res = await fetch(`/api/payment-methods/list?userId=${userId}`);
    const data = await res.json();

    if (data.ok) {
      setCards(data.cards);

      const primary = data.cards.find((c: any) => c.is_primary);
      if (primary) setSelectedCard(primary.id);
    }
  };



  // === Отправка заказа ===
  const createOrder = async () => {
    if (!selectedCard) return alert("Выберите карту для оплаты");
    if (!isValidPhone) return alert("Введите корректный телефон");

    const card = cards.find((c: any) => c.id === selectedCard); // ⭐ ВАЖНО

    const res = await fetch("/api/orders/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId,
        items: cart,
        total: totalPrice,
        phone,
        name,
        payment_method: "card",
        payment_last4: card?.card_last4 ?? null, // ⭐ ВОТ ОНО
        delivery_type: deliveryType,
      }),
    });

    const result = await res.json();

    if (!result.ok) return alert("Ошибка создания заказа");

    clearCart();
    window.location.href = "/checkout/success";
  };


  return (
    <div className="container mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-8">Оформление заказа</h1>

      {/* 🧁 ТОВАРЫ */}
      <div className="mb-12">
        <div className="grid grid-cols-12 mb-4 text-gray-600 font-medium px-2">
          <div className="col-span-6">Продукт</div>
          <div className="col-span-3 text-center">Кол-во</div>
          <div className="col-span-3 text-right">Цена</div>
        </div>

        <hr className="mb-6" />

        {cart.map((item) => (
          <div key={item.id} className="grid grid-cols-12 items-center py-4">
            <div className="col-span-6 flex items-center gap-4">
              <Image
                src={item.image}
                alt={item.name || item.product_name || "product"}
                width={90}
                height={90}
                className="rounded-xl"
              />
              <p className="text-lg font-semibold">{item.name}</p>
            </div>

            <div className="col-span-3 flex justify-center">
              <div className="flex items-center border rounded-lg px-4 py-2 gap-4">
                <button onClick={() => changeQty(item.id, item.qty - 1)} className="text-xl">
                  –
                </button>
                <span className="text-lg font-semibold">{item.qty}</span>
                <button onClick={() => changeQty(item.id, item.qty + 1)} className="text-xl">
                  +
                </button>
              </div>
            </div>

            <div className="col-span-3 flex items-center justify-end gap-6">
              <p className="text-lg font-bold">
                {(item.price * item.qty).toLocaleString("ru-RU")} ₸
              </p>

              <button
                onClick={() => removeFromCart(item.id)}
                className="text-2xl text-gray-400 hover:text-black"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 🚚 Доставка */}
      <div className="flex gap-6 border-b mb-6 pb-2">
        <button
          className={
            deliveryType === "delivery"
              ? "border-b-2 border-[#860120] pb-1 font-semibold"
              : "text-gray-500"
          }
          onClick={() => setDeliveryType("delivery")}
        >
          Доставка
        </button>

        <button
          className={
            deliveryType === "pickup"
              ? "border-b-2 border-[#860120] pb-1 font-semibold"
              : "text-gray-500"
          }
          onClick={() => setDeliveryType("pickup")}
        >
          Самовывоз
        </button>
      </div>

      {/* 📍 Адрес */}
      {deliveryType === "delivery" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <input className="border rounded-lg p-3" placeholder="Улица и дом" />
          <input className="border rounded-lg p-3" placeholder="Квартира" />
          <input className="border rounded-lg p-3" placeholder="Подъезд" />
          <input className="border rounded-lg p-3" placeholder="Домофон" />
        </div>
      )}

      {/* 👤 Контакты */}
      <h2 className="text-2xl font-semibold mb-3">Контактная информация</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <input
          className="border rounded-lg p-3"
          placeholder="Ваше имя"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <IMaskInput
          mask="+7 (000) 000-00-00"
          value={phone}
          onAccept={(v: any) => setPhone(v)}
          className="border rounded-lg p-3"
          placeholder="+7 (___) ___-__-__"
        />
      </div>

      {/* 💳 КАРТЫ */}
{/* 💳 КАРТЫ */}
<h2 className="text-2xl font-semibold mb-4">Способ оплаты</h2>

<div className="space-y-4 mb-12">

  {/* --- 1) ЕСЛИ НЕТ КАРТ --- */}
  {cards.length === 0 && (
    <button
      onClick={() => (window.location.href = "/profile/payments/add-card")}
      className="w-full border border-[#860120] text-[#860120] rounded-xl py-3 font-medium"
    >
      Привязать карту
    </button>
  )}

  {/* --- 2) КАРТЫ ЕСТЬ --- */}
  {cards.length > 0 && (
    <>
      {/* Карта тізімі */}
      {cards.map((c) => (
        <button
          key={c.id}
          onClick={() => setSelectedCard(c.id)}
          className={`w-full flex justify-between items-center p-5 rounded-xl border transition ${
            c.id === selectedCard
              ? "border-[#860120] bg-[#fff4f6]"
              : "border-gray-300 bg-white"
          }`}
        >
          <div>
            <p className="text-lg font-semibold">{c.brand} •••• {c.card_last4}</p>
            <p className="text-sm text-gray-600">Действует до: {c.expiry}</p>

            {c.is_primary && (
              <p className="text-sm text-[#860120] font-medium mt-1">
                Основная карта
              </p>
            )}
          </div>

          {/* кастомный radio */}
          <span
            className={`w-5 h-5 rounded-full border flex items-center justify-center ${
              c.id === selectedCard ? "border-[#860120]" : "border-gray-400"
            }`}
          >
            {c.id === selectedCard && (
              <span className="w-3 h-3 bg-[#860120] rounded-full" />
            )}
          </span>
        </button>
      ))}

      {/* Қосымша жаңа карта қосу */}
      <button
        onClick={() => (window.location.href = "/profile/payments/add-card")}
        className="w-full border border-[#860120] text-[#860120] rounded-xl py-3 font-medium"
      >
        + Привязать другую карту
      </button>
    </>
  )}

</div>

      {/* 🧾 Итог */}
      <div className="bg-white shadow p-6 rounded-xl max-w-md">
        <p className="text-xl font-semibold mb-3">Ваш заказ</p>

        <div className="flex justify-between mb-3">
          <span>Сумма</span>
          <span className="font-bold">{totalPrice.toLocaleString("ru-RU")} ₸</span>
        </div>

        <button
          disabled={!isValidPhone || !selectedCard}
          onClick={createOrder}
          className={`w-full py-4 mt-4 rounded-xl text-lg ${
            isValidPhone && selectedCard
              ? "bg-[#860120] text-white hover:bg-[#a4022a]"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Сделать заказ
        </button>
      </div>
    </div>
  );
}
