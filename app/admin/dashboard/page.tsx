export default function Dashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-[#860120] mb-6">
        Добро пожаловать 👋
      </h1>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow">
          <p className="text-gray-500">Заказов сегодня</p>
          <p className="text-2xl font-bold">12</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow">
          <p className="text-gray-500">В обработке</p>
          <p className="text-2xl font-bold">5</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow">
          <p className="text-gray-500">Выручка</p>
          <p className="text-2xl font-bold">125 000 ₸</p>
        </div>
      </div>
    </div>
  );
}
