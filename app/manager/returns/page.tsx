"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { ManagerShell } from "@/components/ManagerShell";

export default function ManagerReturns() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const { data } = await supabase
      .from("returns")
      .select("*")
      .order("created_at", { ascending: false });

    setItems(data || []);
  }

  async function setStatus(id: string, status: string) {
    await supabase.from("returns").update({ status }).eq("id", id);
    load();
  }

  return (
    <ManagerShell>
      <h1 className="text-2xl font-bold mb-8">Возвраты</h1>

      {items.map((r) => (
        <div key={r.id} className="border rounded-2xl p-6 mb-4">
          <p>Заказ: {r.order_id}</p>
          <p className="text-sm text-gray-500 mb-3">{r.reason}</p>

          <div className="flex gap-3">
            <button
              onClick={() => setStatus(r.id, "approved")}
              className="px-4 py-2 bg-green-100 text-green-700 rounded-lg"
            >
              Принять
            </button>
            <button
              onClick={() => setStatus(r.id, "rejected")}
              className="px-4 py-2 bg-red-100 text-red-700 rounded-lg"
            >
              Отклонить
            </button>
          </div>
        </div>
      ))}
    </ManagerShell>
  );
}
