import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

// порядок статусов — КЛЮЧЕВО
const STATUS_FLOW = [
  "processing",
  "confirmed",
  "preparing",
  "on_way",
  "delivered",
  "canceled",
];

// текст для истории
const STATUS_TEXT: any = {
  processing: "Оформлен",
  confirmed: "Подтверждён",
  preparing: "Готовится",
  on_way: "Курьер в пути",
  delivered: "Доставлен",
  canceled: "Отменён",
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ ok: false, error: "missing_id" });
  }

  const { data: order, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !order) {
    return NextResponse.json({ ok: false, error: "order_not_found" });
  }

  const { data: items } = await supabase
    .from("order_items")
    .select(`
      id,
      product_id,
      product_name,
      image,
      price,
      qty
    `)
    .eq("order_id", id);

  // 🔥 ГЛАВНАЯ ЛОГИКА — ГЕНЕРАЦИЯ ИСТОРИИ
  const currentStatusIndex = STATUS_FLOW.indexOf(order.status);

  let generatedHistory = [];

  if (currentStatusIndex !== -1) {
    for (let i = 0; i <= currentStatusIndex; i++) {
      generatedHistory.push({
        status: STATUS_FLOW[i],
        label: STATUS_TEXT[STATUS_FLOW[i]],
        created_at: order.created_at, // для MVP одинаковое время
      });
    }
  }

  order.status_history = generatedHistory;
  order.items = items ?? [];

  return NextResponse.json({ ok: true, order });
}
