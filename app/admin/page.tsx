"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { CatalogLoader } from "@/components/ui/CatalogLoader";

export default function AdminDashboardPage() {
  const [date, setDate] = useState(
    new Date().toISOString().slice(0, 10)
  );

  const [stats, setStats] = useState({
    totalOrders: 0,
    deliveredOrders: 0,
    processingOrders: 0,
    pendingReturns: 0,
    revenue: 0,
  });

  const [attention, setAttention] = useState({
    returns: 0,
    noDeliveryDate: 0,
    oldProcessing: 0,
  });

  const [activity, setActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, [date]);

 async function loadDashboard() {
  setLoading(true);
    const start = new Date(date); 
    start.setHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    const startISO = start.toISOString();
    const endISO = end.toISOString();

    // ===== STATISTICS =====
    const { data: orders } = await supabase
      .from("orders")
      .select("id,status,total,created_at,delivery_date")
      .gte("created_at", startISO)
      .lte("created_at", endISO);

    const { data: allProcessing } = await supabase
      .from("orders")
      .select("created_at")
      .eq("status", "processing");

    const { count: pendingReturns } = await supabase
      .from("returns")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending");

    const delivered = orders?.filter(o => o.status === "delivered") || [];

    setStats({
      totalOrders: orders?.length || 0,
      deliveredOrders: delivered.length,
      processingOrders: allProcessing?.length || 0,
      pendingReturns: pendingReturns || 0,
      revenue: delivered.reduce((s, o) => s + (o.total || 0), 0),
    });

    // ===== ATTENTION =====
    const oldProcessing =
      allProcessing?.filter(o => {
        const created = new Date(o.created_at);
        return Date.now() - created.getTime() > 24 * 60 * 60 * 1000;
      }).length || 0;

    const noDeliveryDate =
      orders?.filter(o => !o.delivery_date).length || 0;

    setAttention({
      returns: pendingReturns || 0,
      noDeliveryDate,
      oldProcessing,
    
    });

    // ===== ACTIVITY =====
    const { data: recentOrders } = await supabase
      .from("orders")
      .select("id,created_at,status")
      .order("created_at", { ascending: false })
      .limit(5);

    const { data: recentReturns } = await supabase
      .from("returns")
      .select("id,created_at")
      .order("created_at", { ascending: false })
      .limit(5);

    const activityLog = [
      ...(recentOrders || []).map(o => ({
        type: "order",
        id: o.id,
        date: o.created_at,
        label: `Новый заказ`,
      })),
      ...(recentReturns || []).map(r => ({
        type: "return",
        id: r.id,
        date: r.created_at,
        label: `Создан возврат`,
      })),
    ]
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 6);

     setActivity(activityLog);
    setLoading(false);
  }
    if (loading) {
      return <CatalogLoader />;
    }
  return (
    <div className="space-y-10">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Обзор</h1>
          <p className="text-gray-500">
            Центр управления магазином
          </p>
        </div>

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border rounded-xl px-4 py-2"
        />
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card title="Заказы" value={stats.totalOrders} />
        <Card title="Доставлено" value={stats.deliveredOrders} />
        <Card title="В обработке" value={stats.processingOrders} />
        <Card
          title="Возвраты"
          value={stats.pendingReturns}
          danger
        />
        <Card
          title="Выручка"
          value={`${stats.revenue.toLocaleString()} ₸`}
        />
      </div>

      {/* ATTENTION */}
      <div className="bg-white border rounded-2xl p-6 space-y-3">
        <h2 className="font-semibold text-lg">Требует внимания</h2>

        {attention.returns > 0 && (
          <Alert
            text={`${attention.returns} возврат(а) ожидают решения`}
            href="/admin/returns"
          />
        )}

        {attention.noDeliveryDate > 0 && (
          <Alert
            text={`${attention.noDeliveryDate} заказ(а) без даты доставки`}
            href="/admin/orders"
          />
        )}

        {attention.oldProcessing > 0 && (
          <Alert
            text={`${attention.oldProcessing} заказ(а) в обработке более 24ч`}
            href="/admin/orders"
          />
        )}

        {attention.returns === 0 &&
          attention.noDeliveryDate === 0 &&
          attention.oldProcessing === 0 && (
            <p className="text-sm text-gray-500">
              Всё в порядке 🎉
            </p>
          )}
      </div>

      {/* ACTIVITY */}
      <div className="bg-white border rounded-2xl p-6">
        <h2 className="font-semibold text-lg mb-4">
          Последние действия
        </h2>

        <div className="space-y-3">
          {activity.map((a, i) => (
            <div
              key={i}
              className="flex justify-between text-sm"
            >
              <span>{a.label}</span>
              <span className="text-gray-500">
                {a.date.replace("T", " ").slice(0, 16)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Card({
  title,
  value,
  danger,
}: {
  title: string;
  value: string | number;
  danger?: boolean;
}) {
  return (
    <div className="bg-white rounded-2xl border shadow-sm p-6">
      <p className="text-sm text-gray-500">{title}</p>
      <p
        className={`text-2xl font-bold mt-2 ${
          danger ? "text-red-600" : ""
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function Alert({
  text,
  href,
}: {
  text: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="block text-sm text-[#860120] hover:underline"
    >
      ⚠️ {text}
    </Link>
  );
}
