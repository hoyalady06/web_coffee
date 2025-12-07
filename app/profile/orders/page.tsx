"use client";

export default function OrdersPage() {
  const orders = [
    {
      id: "A-1055",
      date: "12.11.2024",
      status: "Доставлено",
      amount: 4500
    },
    {
      id: "A-1050",
      date: "05.11.2024",
      status: "В пути",
      amount: 9000
    }
  ];

  return (
    <>
      <h1 className="text-3xl font-bold text-[#4b2e16] mb-10">
        Мои заказы
      </h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id}
               className="bg-[#fffff] rounded-2xl p-6 border border-[#eadfd7] shadow-sm">

            <p className="text-lg font-semibold text-[#4b2e16]">
              Заказ № {order.id}
            </p>
            <p className="text-[#7a5f4b] mt-2">Дата: {order.date}</p>
            <p className="text-[#7a5f4b]">Статус: {order.status}</p>

            <p className="font-bold text-[#4b2e16] text-xl mt-4">
              Сумма: {order.amount} ₸
            </p>

            <button className="mt-4 text-[#860120] underline">
              Подробнее →
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
