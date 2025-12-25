import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

export async function GET(
  _: Request,
  context: { params: Promise<{ id: string }> }
) {
  const supabase = supabaseServer();

  // ✅ ВАЖНО: await params
  const { id } = await context.params;

  // 1️⃣ Заказ
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .single();

  if (orderError || !order) {
    return NextResponse.json({ ok: false });
  }

  // 2️⃣ Товары
  const { data: items } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", id);

  // 3️⃣ Клиент
  const { data: user } = await supabase
    .from("users")
    .select("name, phone")
    .eq("id", order.user_id)
    .single();

  return NextResponse.json({
    ok: true,
    order,
    items: items || [],
    user: user || null,
  });
}
