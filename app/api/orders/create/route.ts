import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req: Request) {
  const body = await req.json();

  const {
    user_id,
    items,
    total,
    phone,
    name,

    payment_method,
    payment_last4,

    delivery_type,
    address,
    apartment,
    entrance,
    intercom,
    floor,
    delivery_date,
    delivery_time,
    comment,
  } = body;

  if (!items || items.length === 0) {
    return NextResponse.json({ ok: false, error: "empty_cart" });
  }

  if (!total || total <= 0) {
    return NextResponse.json({ ok: false, error: "incorrect_total" });
  }

  // 🧾 СОЗДАЁМ ЗАКАЗ (ВСЁ СОХРАНЯЕМ)
  const { data: order, error } = await supabase
    .from("orders")
    .insert({
      user_id,
      name,
      phone,
      total,

      delivery_type,
      address,
      apartment,
      entrance,
      intercom,
      floor,
      delivery_date,
      delivery_time,
      comment,

      payment_method,
      payment_last4,
    })

    .select()
    .single();

  if (error) {
    console.error("ORDER ERROR:", error);
    return NextResponse.json({ ok: false, error });
  }

  // 🛒 ТОВАРЫ ЗАКАЗА
  for (const item of items) {
    const { error: insertError } = await supabase
      .from("order_items")
      .insert({
        order_id: order.id,
        product_id: item.id,
        product_name: item.name,
        image: item.image,
        price: item.price,
        qty: item.qty,
      });

    if (insertError) {
      console.error("ITEM ERROR:", insertError);
      return NextResponse.json({ ok: false, error: insertError });
    }
  }

  return NextResponse.json({ ok: true, order_id: order.id });
}
