import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ ok: false, error: "missing_id" });
  }

  // 1️⃣ Получаем возврат
  const { data: ret, error: retErr } = await supabase
    .from("returns")
    .select("*")
    .eq("id", id)
    .single();

  if (retErr) {
    console.error(retErr);
    return NextResponse.json({ ok: false, error: retErr });
  }

  // 2️⃣ Получаем order_item (ВАЖНО: с price и product_id)
  const { data: item, error: itemErr } = await supabase
    .from("order_items")
    .select("product_id, product_name, image, price")
    .eq("id", ret.order_item_id)
    .single();

  if (itemErr) {
    console.error(itemErr);
    return NextResponse.json({ ok: false, error: itemErr });
  }

  // 3️⃣ Финальный объект (контракт = фронт)
  const formatted = {
    id: ret.id,
    order_id: ret.order_id,
    status: ret.status,
    qty: ret.qty,
    reason: ret.reason,
    created_at: ret.created_at,
    items: [
      {
        product_id: item.product_id,
        product_name: item.product_name,
        image: item.image,
        price: item.price,
        qty: ret.qty,
      },
    ],
  };

  return NextResponse.json({ ok: true, return: formatted });
}
