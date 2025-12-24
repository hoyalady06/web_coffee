"use client";

import { useCart } from "@/context/CartContext";
import Image from "next/image";
import { IMaskInput } from "react-imask";
import { useEffect, useState } from "react";
import { AddCardForm } from "@/components/payments/AddCardForm";


export default function CheckoutPage() {
  const { cart, changeQty, removeFromCart, clearCart } = useCart();

  const [cards, setCards] = useState<any[]>([]);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [deliveryType, setDeliveryType] = useState<"delivery" | "pickup">("delivery");

    
  const [showAddCard, setShowAddCard] = useState(false);
  const [showCardList, setShowCardList] = useState(false);
 

  const [userId, setUserId] = useState<string | null>(null);
  const [address, setAddress] = useState("");
  const [apartment, setApartment] = useState("");
  const [entrance, setEntrance] = useState("");
  const [intercom, setIntercom] = useState("");
  const [floor, setFloor] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");
  const [comment, setComment] = useState("");
    function getAvailableTimes(selectedDate: string) {
      if (!selectedDate) return [];

      const now = new Date();
      const today = new Date().toISOString().split("T")[0];

      // если дата не сегодня — оба интервала
      if (selectedDate !== today) {
        return ["09:30–14:30", "15:00–19:30"];
      }

      const currentTime = now.getHours() + now.getMinutes() / 60;
      const times: string[] = [];

      if (currentTime < 14.5) times.push("09:30–14:30");
      if (currentTime < 15) times.push("15:00–19:30");

      return times;
    }




  const availableTimes = getAvailableTimes(deliveryDate);


  const today = new Date().toISOString().split("T")[0];
  useEffect(() => {
    if (!userId) return;

    const loadProfile = async () => {
      const res = await fetch(`/api/users/get?id=${userId}`);
      const data = await res.json();

      if (data.ok && data.user) {
        
      }
    };

    loadProfile();
  }, [userId]);

  useEffect(() => {
    const id = localStorage.getItem("user_id");
    setUserId(id);
  }, []);

  useEffect(() => {
    if (userId) loadCards();
  }, [userId]);

    useEffect(() => {
      if (!deliveryDate) return;

      const times = getAvailableTimes(deliveryDate);

      if (times.length > 0 && !deliveryTime) {
        setDeliveryTime(times[0]);
      }
    }, [deliveryDate]);

 
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const canSubmit =

    selectedCard &&
    (deliveryType === "pickup" || deliveryTime);

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


    async function selectAsPrimary(cardId: string) {
      setSelectedCard(cardId);

      await fetch("/api/payment-methods/set-primary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          cardId,
        }),
      });

      loadCards(); // 🔥 перезагружаем и пересортировываем
    }
  // === Отправка заказа ===
  const createOrder = async () => {
    if (!selectedCard) return alert("Выберите карту для оплаты");
   

    if (deliveryType === "delivery" && !address) {
      return alert("Введите адрес доставки");
    }

    const card = cards.find((c) => c.id === selectedCard);

    const res = await fetch("/api/orders/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId,
        items: cart,
        total: totalPrice,

     

        delivery_type: deliveryType,
        address,
        apartment,
        entrance,
        intercom,
        floor,
        delivery_date: deliveryDate,
        delivery_time: deliveryTime,
        comment,

        payment_method: "card",
        payment_last4: card?.card_last4 ?? null,
      }),
    });

    const result = await res.json();
    if (!result.ok) return alert("Ошибка создания заказа");

    clearCart();
    window.location.href = `/checkout/success?order=${result.order_id}`;
  };



  const selected = cards.find((c) => c.id === selectedCard);
  const others = cards.filter((c) => c.id !== selectedCard);

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-6 py-20 text-center">
        <h2 className="text-2xl font-semibold mb-2">
          Корзина пуста
        </h2>

        <p className="text-gray-500 mb-6">
          Воспользуйтесь поиском, чтобы найти всё, что нужно
        </p>

        <a
          href="/"
          className="inline-block bg-[#860120] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#6e0119]"
        >
          Начать покупки
        </a>
      </div>
    );
  }
  



  function getNextDays(days: number) {
    const result = [];
    const today = new Date();
    
    for (let i = 0; i < days; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      
      const iso = date.toISOString().split("T")[0];
      const display = date.toLocaleDateString("ru-RU", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
      
      result.push({ iso, display });
    }
    
    return result;
  }

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

            {/* 📍 Доставка */}
      {deliveryType === "delivery" && (
        <>
          {/* Адрес */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <input
              className="border rounded-lg p-3"
              placeholder="Улица и дом"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />

            <input
              className="border rounded-lg p-3"
              placeholder="Квартира"
              value={apartment}
              onChange={(e) => setApartment(e.target.value)}
            />

            <input
              className="border rounded-lg p-3"
              placeholder="Подъезд"
              value={entrance}
              onChange={(e) => setEntrance(e.target.value)}
            />

            <input
              className="border rounded-lg p-3"
              placeholder="Домофон"
              value={intercom}
              onChange={(e) => setIntercom(e.target.value)}
            />

            <input
              className="border rounded-lg p-3"
              placeholder="Этаж"
              value={floor}
              onChange={(e) => setFloor(e.target.value)}
            />
          </div>

          {/* 📅 Дата и время */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* ℹ️ Инфо */}
            <div className="md:col-span-2 flex gap-3 items-start bg-[#fff7f8] border border-[#f3c1cc] rounded-xl p-4 text-sm text-gray-700">
              <span className="text-[#860120] text-lg leading-none">ℹ️</span>
              <p>
                <b>Внимание!</b> Доставка производится в двух временных промежутках:
                <br />
                <b>09:30–14:30</b> и <b>15:00–19:30</b>.
                <br />
                Точного времени нет — курьер позвонит за <b>30 минут</b> до приезда.
              </p>
            </div>

            {/* Дата */}
            <select
              className="border rounded-lg p-3"
              value={deliveryDate}
              onChange={(e) => {
                setDeliveryDate(e.target.value);
                setDeliveryTime("");
              }}
            >
              <option value="">Выберите дату</option>
              {getNextDays(7).map((d) => (
                <option key={d.iso} value={d.iso}>
                  {d.display}
                </option>
              ))}
            </select>

            {/* Время */}
            <select
              className="border rounded-lg p-3"
              value={deliveryTime}
              onChange={(e) => setDeliveryTime(e.target.value)}
              disabled={!deliveryDate || getAvailableTimes(deliveryDate).length === 0}
            >
              <option value="">Выберите время</option>
              {getAvailableTimes(deliveryDate).map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>

            {/* Ошибка */}
            {deliveryDate && getAvailableTimes(deliveryDate).length === 0 && (
              <p className="md:col-span-2 text-red-600 text-sm">
                На выбранную дату доставка уже недоступна
              </p>
            )}
          </div>
        </>
      )}








     
      {/* 💳 КАРТЫ */}
      <h2 className="text-2xl font-semibold mb-4">Способ оплаты</h2>

      <div className="flex gap-4 overflow-x-auto pb-3 mb-12">

        {/* 💳 Сохранённые карты */}
        {cards.map((c) => (
          <button
            key={c.id}
            onClick={() => selectAsPrimary(c.id)}

            className={`min-w-[180px] rounded-xl border p-4 text-left transition
              ${
                selectedCard === c.id
                  ? "border-[#860120] bg-[#fff4f6]"
                  : "border-gray-300 bg-white"
              }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">{c.brand}</span>
              {selectedCard === c.id && (
                <span className="w-3 h-3 rounded-full bg-[#860120]" />
              )}
            </div>

            <p className="text-lg font-semibold">•••• {c.card_last4}</p>
            <p className="text-xs text-gray-500">до {c.expiry}</p>

            {c.is_primary && (
              <p className="text-xs text-[#860120] mt-1">Основная</p>
            )}
          </button>
        ))}

        {/* ➕ Новая карта */}
        <button
          onClick={() => setShowAddCard(true)}
          className="min-w-[180px] rounded-xl border-2 border-dashed border-[#860120]
                    flex flex-col items-center justify-center text-[#860120]
                    hover:bg-[#fff4f6] transition"
        >
          <span className="text-3xl leading-none">＋</span>
          <span className="text-sm mt-1">Новой картой</span>
        </button>



      {showAddCard && (
      <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-xl relative">

          {/* ❌ закрыть */}
          <button
            onClick={() => setShowAddCard(false)}
            className="absolute top-4 right-4 text-2xl text-gray-400 hover:text-black"
          >
            ×
          </button>

          {/* 🏷 Заголовок */}
          <h2 className="text-2xl font-semibold mb-4">
            Привязка банковской карты
          </h2>

          {/* ℹ️ Инфо */}
          <div className="bg-[#fff4f6] border border-[#f3c1cc] text-sm rounded-xl p-4 mb-6 flex gap-3">
            <span className="text-[#860120] font-bold">i</span>
            <p>
              Мы спишем и сразу вернём небольшую сумму для проверки карты.
            </p>
          </div>

          {/* 🧾 Форма */}
          <AddCardForm
            onSuccess={() => {
              setShowAddCard(false);
              loadCards();
            }}
          />
        </div>
      </div>
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
          disabled={!canSubmit}
          onClick={createOrder}
          className={`w-full py-4 mt-4 rounded-xl text-lg ${
            canSubmit
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
