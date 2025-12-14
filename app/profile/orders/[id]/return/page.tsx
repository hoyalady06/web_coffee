"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";

export default function ReturnPage() {
  const { id } = useParams(); // order_id
  const [order, setOrder] = useState<any>(null);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [reason, setReason] = useState("");

  const userId = typeof window !== "undefined" ? localStorage.getItem("user_id") : null;

  useEffect(() => {
    loadOrder();
  }, []);

  const loadOrder = async () => {
    const res = await fetch(`/api/orders/get?id=${id}`);
    const data = await res.json();
    if (data.ok) setOrder(data.order);
  };

  const sendReturn = async () => {
    if (!selectedItem) return alert("Выберите товар");
    if (qty <= 0) return alert("Количество неверно");

    const res = await fetch("/api/returns/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        order_id: id,
        order_item_id: selectedItem,
        user_id: userId,
        qty,
        reason
      }),
    });

    const result = await res.json();

    if (!result.ok) {
      alert("Ошибка запроса");
      return;
    }

    alert("Заявка на возврат отправлена!");
    window.location.href = "/profile/orders";
  };

  if (!order) return <p>Загрузка...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Возврат товара</h1>

      {order.items.map((item: any) => (
        <div
          key={item.id}
          className={`flex gap-4 p-4 border rounded-xl mb-3 cursor-pointer ${
            selectedItem === item.id ? "border-[#860120] bg-[#fff5f7]" : ""
          }`}
          onClick={() => {
            setSelectedItem(item.id);
            setQty(item.qty); // default макс qty
          }}
        >
          <Image
          
            src={item.image}
            alt={item.product_name || "product image"}
            width={70}
            height={70}
            className="rounded-xl border"
            />

          <div>
            <p className="font-semibold">{item.name}</p>
            <p className="text-gray-600">
              Цена: {item.price} ₸ | Кол-во: {item.qty}
            </p>
          </div>
        </div>
      ))}

      {/* Qty */}
      {selectedItem && (
        <div className="mt-4">
          <p className="font-medium mb-1">Количество для возврата</p>
          <input
            type="number"
            value={qty}
            min={1}
            max={order.items.find((i: any) => i.id === selectedItem)?.qty}
            onChange={(e) => setQty(Number(e.target.value))}
            className="border rounded-lg p-3 w-32"
          />
        </div>
      )}

      {/* Reason */}
      <textarea
        className="w-full border rounded-xl p-3 mt-4"
        placeholder="Причина возврата"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
      />

      <button
        onClick={sendReturn}
        className="mt-6 bg-[#860120] text-white py-3 px-6 rounded-xl"
      >
        Отправить заявку
      </button>
    </div>
  );
}

//Gooo