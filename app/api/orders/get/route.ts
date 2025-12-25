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

  /* ================== ЗАКАЗ ================== */
  const { data: order, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !order) {
    return NextResponse.json({ ok: false, error: "order_not_found" });
  }

  /* ================== ТОВАРЫ ================== */
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

  /* ================== БОНУСЫ ================== */
  const { data: bonus } = await supabase
    .from("bonus_history")
    .select("amount")
    .eq("order_id", id)
    .eq("type", "earn")
    .single();

  /* ================== ИСТОРИЯ СТАТУСОВ ================== */
  const currentStatusIndex = STATUS_FLOW.indexOf(order.status);
  const generatedHistory: any[] = [];

  if (currentStatusIndex !== -1) {
    for (let i = 0; i <= currentStatusIndex; i++) {
      generatedHistory.push({
        status: STATUS_FLOW[i],
        label: STATUS_TEXT[STATUS_FLOW[i]],
        created_at: order.created_at, // MVP — одно время
      });
    }
  }

  /* ================== ФИНАЛ ================== */
  order.items = items ?? [];
  order.status_history = generatedHistory;

  // 🔥 ВАЖНО: бонусы приходят ЯВНО
  order.bonus_credited = !!bonus;
  order.bonus_amount = bonus?.amount ?? 0;

  return NextResponse.json({ ok: true, order });
}
