"use client";

import { useEffect, useState } from "react";

export default function BonusesPage() {
  const [balance, setBalance] = useState(0);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBonuses();
  }, []);

  async function loadBonuses() {
    const res = await fetch("/api/bonus/get");
    const data = await res.json();

    console.log("BONUS API RESPONSE:", data);

    if (data.ok) {
      setBalance(data.balance);
      setHistory(data.history);
    }

    setLoading(false);
  }

  if (loading) return <p>Загрузка…</p>;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Баллы и бонусы</h1>

      <div className="bg-white p-6 rounded-xl shadow">
        <p className="text-lg">Ваши баллы</p>
        <p className="text-3xl font-bold">Б {balance}</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        <p className="text-lg mb-3">История</p>

        {history.length === 0 ? (
          <p className="text-gray-500">Пока нет операций</p>
        ) : (
          history.map((h) => (
            <div key={h.id} className="flex justify-between text-sm">
              <span>
                {h.type === "earn" && "Начисление"}
                {h.type === "spend" && "Списание"}
              </span>
              <span
                className={
                  h.type === "spend" ? "text-red-600" : "text-green-600"
                }
              >
                {h.type === "spend" ? "-" : "+"}
                {h.amount} Б
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
