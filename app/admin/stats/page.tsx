"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { CatalogLoader } from "@/components/ui/CatalogLoader";

export default function AdminStatsPage() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    todayOrders: 0,
    todayRevenue: 0,
    totalRevenue: 0,
    pendingReturns: 0,
  });
const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
  setLoading(true);

  const today = new Date().toISOString().slice(0, 10);


    // Всего заказов + общая выручка
    const { data: allOrders } = await supabase
      .from("orders")
      .select("total, created_at");

    // Заказы сегодня
    const todayOrders = allOrders?.filter(
      (o) => o.created_at?.startsWith(today)
    ) || [];

    // Возвраты в ожидании
    const { count: pendingReturns } = await supabase
      .from("returns")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending");

    setStats({
      totalOrders: allOrders?.length || 0,
      todayOrders: todayOrders.length,
      todayRevenue: todayOrders.reduce((s, o) => s + (o.total || 0), 0),
      totalRevenue: allOrders?.reduce((s, o) => s + (o.total || 0), 0) || 0,
      pendingReturns: pendingReturns || 0,
    });
    setLoading(false);

  }
  if (loading) {
    return <CatalogLoader />;
  }


  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">Статистика</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        <StatCard title="Всего заказов" value={stats.totalOrders} />
        <StatCard title="Заказов сегодня" value={stats.todayOrders} />
        <StatCard title="Выручка сегодня" value={`${stats.todayRevenue} ₸`} />
        <StatCard title="Общая выручка" value={`${stats.totalRevenue} ₸`} />
        <StatCard
          title="Возвраты в ожидании"
          value={stats.pendingReturns}
          highlight
        />
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  highlight,
}: {
  title: string;
  value: string | number;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-6 bg-white shadow-sm ${
        highlight ? "border-red-200 bg-red-50" : ""
      }`}
    >
      <p className="text-sm text-gray-500">{title}</p>
      <p className="mt-2 text-3xl font-semibold text-[#860120]">{value}</p>
    </div>
  );
}
