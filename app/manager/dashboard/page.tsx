"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { ManagerShell } from "@/components/ManagerShell";

export default function ManagerDashboard() {
  const [stats, setStats] = useState({
    orders: 0,
    delivered: 0,
    processing: 0,
    returns: 0,
    revenue: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    const { data: orders } = await supabase.from("orders").select("status,total");

    const { count: pendingReturns } = await supabase
      .from("returns")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending");

    if (!orders) return;

    const delivered = orders.filter((o) => o.status === "delivered");
    const processing = orders.filter((o) => o.status !== "delivered");

    setStats({
      orders: orders.length,
      delivered: delivered.length,
      processing: processing.length,
      returns: pendingReturns || 0,
      revenue: delivered.reduce((sum, o) => sum + (o.total || 0), 0),
    });
  }

  return (
    <ManagerShell>
      {/* Заголовок */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Обзор</h1>
          <p className="text-gray-500 text-sm">
            Центр управления заказами
          </p>
        </div>

        <div className="flex items-center gap-2 border rounded-xl px-4 py-2 text-sm">
          {new Date().toLocaleDateString("ru-RU")}
        </div>
      </div>

      {/* Карточки */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-10">
        <StatCard title="Заказы" value={stats.orders} />
        <StatCard title="Доставлено" value={stats.delivered} />
        <StatCard title="В обработке" value={stats.processing} />
        <StatCard
          title="Возвраты"
          value={stats.returns}
          highlight={stats.returns > 0}
        />
        <StatCard title="Выручка" value={`${stats.revenue} ₸`} />
      </div>

      {/* Требует внимания */}
      {stats.processing > 0 && (
        <div className="border rounded-2xl p-6 mb-8">
          <p className="font-semibold mb-2">⚠️ Требует внимания</p>
          <p className="text-sm text-red-600">
            {stats.processing} заказ(ов) в обработке
          </p>
        </div>
      )}

      {/* Последние действия (заглушка, как у админа) */}
      <div className="border rounded-2xl p-6">
        <p className="font-semibold mb-4">Последние действия</p>

        <div className="text-sm text-gray-500 space-y-2">
          <p>Новый заказ</p>
          <p>Обновлён статус заказа</p>
          <p>Создан возврат</p>
        </div>
      </div>
    </ManagerShell>
  );
}

function StatCard({
  title,
  value,
  highlight,
}: {
  title: string;
  value: any;
  highlight?: boolean;
}) {
  return (
    <div
      className={`border rounded-2xl p-6 ${
        highlight ? "text-red-600" : ""
      }`}
    >
      <p className="text-sm text-gray-500 mb-1">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
