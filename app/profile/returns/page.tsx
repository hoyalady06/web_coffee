"use client";

export default function ReturnsPage() {
  const returns = [
    {
      id: "R-301",
      order: "A-1050",
      status: "В обработке",
      date: "14.11.2024"
    }
  ];

  return (
    <>
      <h1 className="text-3xl font-bold text-[#4b2e16] mb-10">
        Мои возвраты
      </h1>

      {returns.length === 0 ? (
        <p className="text-[#7a5f4b]">Нет возвратов</p>
      ) : (
        <div className="space-y-6">
          {returns.map((r) => (
            <div key={r.id}
                 className="bg-[#ffffff] border border-[#eadfd7] rounded-2xl p-6 shadow-sm">

              <p className="text-[#4b2e16] font-semibold text-lg">Возврат № {r.id}</p>
              <p className="text-[#7a5f4b] mt-2">Заказ: {r.order}</p>
              <p className="text-[#7a5f4b]">Дата: {r.date}</p>

              <p className="text-[#860120] font-semibold mt-4">
                Статус: {r.status}
              </p>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
