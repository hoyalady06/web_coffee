import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ ok: false, error: "No userId" });
  }

  // Загружаем заказы
  const { data: orders, error: ordersError } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (ordersError) return NextResponse.json({ ok: false, error: ordersError });

  // Загружаем товары для каждого заказа
  for (let order of orders) {
    const { data: items } = await supabase
      .from("order_items")
      .select("*")
      .eq("order_id", order.id);

    order.items = items; // прикрепляем массив товаров к заказу
  }

  return NextResponse.json({ ok: true, orders });
}
//Goooo