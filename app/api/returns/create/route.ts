import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req: Request) {
  const body = await req.json();

  const { order_id, order_item_id, qty, reason } = body;

  if (!order_id || !order_item_id || !qty) {
    return NextResponse.json({ ok: false, error: "missing_fields" });
  }

  // 🔹 Берём заказ и получателя
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("user_id, recipient_name, recipient_phone")
    .eq("id", order_id)
    .single();

  if (orderError || !order) {
    return NextResponse.json({ ok: false, error: "order_not_found" });
  }

  // 🔁 Создаём возврат
  const { data, error } = await supabase
    .from("returns")
    .insert({
      order_id,
      order_item_id,
      user_id: order.user_id,
      qty,
      reason,
      status: "pending",

      recipient_name: order.recipient_name,
      recipient_phone: order.recipient_phone,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ ok: false, error });
  }

  return NextResponse.json({ ok: true, return_request: data });
}
