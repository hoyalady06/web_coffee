"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { ManagerShell } from "@/components/ManagerShell";

export default function ManagerCareer() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const { data } = await supabase
      .from("career_requests")
      .select("*")
      .order("created_at", { ascending: false });

    setItems(data || []);
  }

  return (
    <ManagerShell>
      <h1 className="text-2xl font-bold mb-8">Карьерные заявки</h1>

      {items.map((c) => (
        <div key={c.id} className="border rounded-2xl p-6 mb-4">
          <p className="font-medium">{c.name}</p>
          <p className="text-sm">{c.phone}</p>
          <p className="text-sm">{c.email}</p>
          <p className="mt-2 text-gray-600">{c.message}</p>
        </div>
      ))}
    </ManagerShell>
  );
}
