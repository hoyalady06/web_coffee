"use client";

export default function BonusesPage() {
  return (
    <div className="space-y-10">

      {/* Заголовок */}
      <h1 className="text-3xl font-bold text-[#4b2e16]">
        Баллы и бонусы
      </h1>

      {/* Баллы */}
      <div className="bg-[#FFFAF9] border border-[#eadfd7] rounded-2xl p-6 shadow-sm">

        <p className="text-[#4b2e16] text-xl font-semibold mb-3">
          Ваши баллы
        </p>

        <div className="flex items-center gap-3">
          <div className="bg-[#860120] text-white w-8 h-8 flex items-center justify-center rounded-full">
            Б
          </div>

          <p className="text-2xl font-bold text-[#4b2e16]">0</p>
        </div>
      </div>


      {/* История */}
      <div className="bg-[#FFFAF9] border border-[#eadfd7] rounded-2xl p-6 shadow-sm">
        <p className="text-xl font-semibold text-[#4b2e16] mb-3">
          История
        </p>

        <p className="text-[#7a5f4b] text-sm">
          У вас пока нет операций с бонусами.
        </p>
      </div>


      {/* Частые вопросы */}
      <div className="bg-[#FFFAF9] border border-[#eadfd7] rounded-2xl p-6 shadow-sm space-y-6">

        <p className="text-xl font-semibold text-[#4b2e16]">
          Частые вопросы
        </p>

        {/* Вопрос 1 */}
        <details className="bg-white p-4 rounded-xl border border-[#eadfd7]">
          <summary className="cursor-pointer text-[#4b2e16] font-medium">
            Как получить баллы?
          </summary>
          <p className="mt-3 text-[#7a5f4b] text-sm">
            Баллы начисляются при покупке определённых товаров и при участии в акциях.
          </p>
        </details>

        {/* Вопрос 2 */}
        <details className="bg-white p-4 rounded-xl border border-[#eadfd7]">
          <summary className="cursor-pointer text-[#4b2e16] font-medium">
            Как списать баллы?
          </summary>
          <p className="mt-3 text-[#7a5f4b] text-sm">
            Баллами можно оплачивать часть заказа в корзине.
          </p>
        </details>

      </div>

    </div>
  );
}
