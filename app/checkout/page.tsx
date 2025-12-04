"use client";

import { useCart } from "@/context/CartContext";
import Image from "next/image";
import { useState } from "react";

import { IMaskInput } from "react-imask";


export default function CheckoutPage() {
  // подключаем корзину правильно
  const { cart, changeQty, removeFromCart } = useCart();

  // итоговая сумма
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const [deliveryType, setDeliveryType] =
    useState<"delivery" | "pickup">("delivery");

  const [phone, setPhone] = useState("");
  const isValidPhone = phone.replace(/\D/g, "").length === 11;

  return (
    <div className="container mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-8">Оплата</h1>

      {/* 🧁 СПИСОК ТОВАРОВ */}
      <div className="mb-12">
        <div className="grid grid-cols-12 mb-4 text-gray-600 font-medium px-2">
          <div className="col-span-6">Продукт</div>
          <div className="col-span-3 text-center">Кол-во</div>
          <div className="col-span-3 text-right">Цена</div>
        </div>

        <hr className="mb-6" />

        {cart.length === 0 ? (
          <p className="text-gray-600 text-lg">Корзина пуста</p>
        ) : (
          cart.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-12 items-center py-4"
            >
              <div className="col-span-6 flex items-center gap-4">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={90}
                  height={90}
                  className="rounded-xl"
                />
                <p className="text-lg font-semibold">{item.name}</p>
              </div>

              <div className="col-span-3 flex justify-center">
                <div className="flex items-center border rounded-lg px-4 py-2 gap-4">
                  <button
                    onClick={() => changeQty(item.id, item.qty - 1)}
                    className="text-xl"
                  >
                    –
                  </button>
                  <span className="text-lg font-semibold">{item.qty}</span>
                  <button
                    onClick={() => changeQty(item.id, item.qty + 1)}
                    className="text-xl"
                  >
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
          ))
        )}
      </div>

      {/* 🚚 Доставка / Самовывоз */}
      <div className="flex gap-6 border-b mb-6 pb-2">
        <button
          className={
            deliveryType === "delivery"
              ? "border-b-2 border-red-600 pb-1 font-semibold"
              : "text-gray-500"
          }
          onClick={() => setDeliveryType("delivery")}
        >
          Доставка
        </button>

        <button
          className={
            deliveryType === "pickup"
              ? "border-b-2 border-red-600 pb-1 font-semibold"
              : "text-gray-500"
          }
          onClick={() => setDeliveryType("pickup")}
        >
          Самовывоз
        </button>
      </div>

      {/* 📅 Дата + время */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div>
          <p className="mb-2 font-medium">Выберите дату</p>
          <input type="date" className="w-full border rounded-lg p-3" />
        </div>
        <div>
          <p className="mb-2 font-medium">Выберите время</p>
          <select className="w-full border rounded-lg p-3">
            <option>09:30 - 14:30</option>
            <option>15:00 - 18:00</option>
            <option>18:00 - 22:00</option>
          </select>
        </div>
      </div>

      {/* 🏠 Адрес */}
      {deliveryType === "delivery" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <div>
            <p className="mb-2 font-medium">Улица и дом</p>
            <input className="w-full border p-3 rounded-lg" placeholder="Адрес" />
          </div>
          <div>
            <p className="mb-2 font-medium">Квартира</p>
            <input
              className="w-full border p-3 rounded-lg"
              placeholder="Номер квартиры"
            />
          </div>
          <div>
            <p className="mb-2 font-medium">Подъезд</p>
            <input
              className="w-full border p-3 rounded-lg"
              placeholder="Подъезд"
            />
          </div>
          <div>
            <p className="mb-2 font-medium">Домофон</p>
            <input
              className="w-full border p-3 rounded-lg"
              placeholder="Домофон"
            />
          </div>
        </div>
      )}

      {/* 📞 Контакты */}
      <h2 className="text-2xl font-semibold mb-4">Контактная информация</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        <div>
          <p className="mb-2 font-medium">Ваше имя *</p>
          <input className="w-full border p-3 rounded-lg" />
        </div>

        <div>
          <p className="mb-2 font-medium">Номер телефона *</p>

          <IMaskInput
            mask="+7 (000) 000-00-00"
            value={phone}
            onAccept={(value: any) => setPhone(value)}
            className="w-full border p-3 rounded-lg"
            placeholder="+7 (___) ___-__-__"
          />


          {!isValidPhone && phone.length > 0 && (
            <p className="text-red-500 text-sm mt-1">
              Введите корректный номер
            </p>
          )}


        </div>
      </div>

      {/* 💳 Оплата */}
      <h2 className="text-2xl font-semibold mb-4">Способ оплаты</h2>
      <div className="flex gap-4 mb-16">
        <button className="border rounded-lg px-6 py-3">Kaspi</button>
        <button className="border rounded-lg px-6 py-3">
          Оплатить картой
        </button>
      </div>

      {/* 🧾 Итог */}
      <div className="bg-white shadow p-6 rounded-xl mb-10 max-w-md">
        <p className="text-xl font-semibold mb-2">Ваш заказ</p>

        <div className="flex justify-between mb-2">
          <p>Сумма к оплате</p>
          <p className="font-bold">
            {totalPrice.toLocaleString("ru-RU")} ₸
          </p>
        </div>

      <button
        disabled={!isValidPhone}
        className={`w-full py-4 rounded-xl text-lg mt-4
          ${isValidPhone
            ? "bg-[#860120] hover:bg-[#a4022a] text-white"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
      >
        Сделать заказ
      </button>

      </div>
    </div>
  );
}
