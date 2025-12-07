"use client";

export default function BoughtPage() {
  const items = [
    {
      id: 1,
      title: "Торт Малинка",
      date: "10.11.2024",
      image: "/cake/strawberry.png"
    }
  ];

  return (
    <>
      <h1 className="text-3xl font-bold text-[#4b2e16] mb-10">
        Купленные товары
      </h1>

      <div className="space-y-6">
        {items.map((item) => (
          <div key={item.id}
               className="flex gap-4 bg-[#fffff] p-6 rounded-2xl border border-[#eadfd7] shadow-sm">

            <img src={item.image} className="w-24 h-24 object-cover rounded-xl" />

            <div>
              <p className="text-lg font-semibold text-[#4b2e16]">{item.title}</p>
              <p className="text-[#7a5f4b] mt-2">Дата покупки: {item.date}</p>

              <button className="text-[#860120] underline mt-3">
                Купить снова →
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
