"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function Dashboard() {
  const [stats, setStats] = useState({
    todayOrders: 0,
    processing: 0,
    revenue: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 1️⃣ Заказы сегодня
    const { data: todayOrders } = await supabase
      .from("orders")
      .select("id", { count: "exact" })
      .gte("created_at", today.toISOString());

    // 2️⃣ В обработке
    const { data: processingOrders } = await supabase
      .from("orders")
      .select("id", { count: "exact" })
      .eq("status", "processing");

    // 3️⃣ Выручка сегодня
    const { data: revenueOrders } = await supabase
      .from("orders")
      .select("total")
      .gte("created_at", today.toISOString());

    const revenue =
      revenueOrders?.reduce((sum, o) => sum + (o.total || 0), 0) || 0;

    setStats({
      todayOrders: todayOrders?.length || 0,
      processing: processingOrders?.length || 0,
      revenue,
    });
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-[#860120] mb-6">
        Добро пожаловать 👋
      </h1>

      <div className="grid grid-cols-3 gap-6">
        <Card title="Заказов сегодня" value={stats.todayOrders} />
        <Card title="В обработке" value={stats.processing} />
        <Card title="Выручка сегодня" value={`${stats.revenue.toLocaleString()} ₸`} />
      </div>
    </div>
  );
}

function Card({ title, value }: { title: string; value: any }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow">
      <p className="text-gray-500">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
