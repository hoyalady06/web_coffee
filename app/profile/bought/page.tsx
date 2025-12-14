"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";

export default function BoughtPage() {
  const { addToCart } = useCart();

  const [items, setItems] = useState([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const id = localStorage.getItem("user_id");
    setUserId(id);
  }, []);

  useEffect(() => {
    if (userId) loadBoughtItems();
  }, [userId]);

  const loadBoughtItems = async () => {
    const res = await fetch(`/api/orders/list?userId=${userId}`);
    const data = await res.json();

    if (!data.ok) return;

    // берем только доставленные
    const delivered = data.orders.filter((o: any) => o.status === "delivered");

    // все товары
    let allItems: any = delivered.flatMap((o: any) =>
      o.items.map((it: any) => ({
        id: it.product_id,
        title: it.product_name,
        image: it.image,
        price: it.price,
        date: o.created_at.slice(0, 10),
      }))
    );

    // 🔥 ГРУППИРУЕМ ОДИНАКОВЫЕ ТОВАРЫ
    const map = new Map();

    allItems.forEach((item: any) => {
      if (!map.has(item.id)) {
        map.set(item.id, { ...item, count: 1 });
      } else {
        map.get(item.id).count++;
      }
    });

    setItems([...map.values()]);
  };

  const buyAgain = (item: any) => {
    addToCart({
      id: item.id,
      name: item.title,
      price: item.price,
      image: item.image,
      qty: 1,
    });

    alert(`Товар "${item.title}" добавлен в корзину`);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Купленные товары</h1>

      {items.length === 0 && (
        <p className="text-gray-600">У вас пока нет купленных товаров</p>
      )}

      <div className="space-y-6">
        {items.map((item: any) => (
          <div
            key={item.id}
            className="relative border p-5 rounded-xl shadow-sm bg-white"
          >
            <div className="flex gap-4 items-center">

              {/* Фото */}
              <Image
                src={item.image}
                alt={item.title}
                width={70}
                height={70}
                className="rounded-xl border object-cover"
              />

              <div>
                {/* Название */}
                <div className="text-xl font-semibold">{item.title}</div>

                {/* Сколько раз покупали */}
                <div className="text-gray-600 mt-1">
                  Куплено: {item.count} раз(а)
                </div>

                {/* Последняя дата покупки */}
                <div className="text-gray-500 text-sm">
                  Последний раз: {item.date}
                </div>
              </div>
            </div>

            <button
              onClick={() => buyAgain(item)}
              className="text-[#860120] underline mt-4 inline-block"
            >
              Купить снова →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
