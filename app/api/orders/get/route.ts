import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ ok: false, error: "missing_id" });
  }

  // 1️⃣ Сам заказ
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .single();

  if (orderError) {
    return NextResponse.json({ ok: false, error: orderError });
  }

  // 2️⃣ Товары заказа — ВАЖНО: product_id
  const { data: items, error: itemsError } = await supabase
    .from("order_items")
    .select(`
      id,
      product_id,
      product_name,
      image,
      price,
      qty,
      returns (
        id,
        status
      )
    `)
    .eq("order_id", id);

  if (itemsError) {
    return NextResponse.json({ ok: false, error: itemsError });
  }

  order.items = items ?? [];

  return NextResponse.json({ ok: true, order });
}

//Goooo