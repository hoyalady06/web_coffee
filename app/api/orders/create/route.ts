import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req: Request) {
  const body = await req.json();

  const {
    user_id,
    items,
    total,

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

    recipient_name,
    recipient_phone,
  } = body;

  // ===== ПРОВЕРКИ =====
  if (!user_id) {
    return NextResponse.json({ ok: false, error: "no_user" });
  }

  if (!items || items.length === 0) {
    return NextResponse.json({ ok: false, error: "empty_cart" });
  }

  if (!total || total <= 0) {
    return NextResponse.json({ ok: false, error: "incorrect_total" });
  }
  const FREE_DELIVERY_FROM = 10000;
  const DELIVERY_PRICE = 2000;

  const deliveryPrice =
    delivery_type === "delivery" && total < FREE_DELIVERY_FROM
      ? DELIVERY_PRICE
      : 0;

  const finalTotal = total + deliveryPrice;

  // ===== ПРОФИЛЬ ПОЛЬЗОВАТЕЛЯ =====
  const { data: user, error: userError } = await supabase
    .from("users")
    .select("name, phone")
    .eq("id", user_id)
    .single();

  if (userError || !user) {
    return NextResponse.json({ ok: false, error: "user_not_found" });
  }

  // ===== ВРЕМЯ =====
  const now = new Date().toISOString();

  // ===== СОЗДАНИЕ ЗАКАЗА (ВАЖНО) =====
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id,
      name: recipient_name ?? user.name,
      phone: recipient_phone ?? user.phone,

      recipient_name,
      recipient_phone,

      total: finalTotal,          // 👈 итог с доставкой
      delivery_price: deliveryPrice, // 👈 СОХРАНЯЕМ ДОСТАВКУ

      
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

      // 🔴 КЛЮЧЕВОЕ МЕСТО
      status: "processing",
      status_history: [
        {
          status: "processing",
          created_at: now,
        },
      ],
    })
    .select()
    .single();

  if (orderError || !order) {
    console.error("ORDER CREATE ERROR:", orderError);
    return NextResponse.json({ ok: false, error: "order_create_failed" });
  }

  // ===== ТОВАРЫ ЗАКАЗА =====
  for (const item of items) {
    const { error: itemError } = await supabase
      .from("order_items")
      .insert({
        order_id: order.id,
        product_id: item.id,
        product_name: item.name,
        image: item.image,
        price: item.price,
        qty: item.qty,
      });

    if (itemError) {
      console.error("ORDER ITEM ERROR:", itemError);
      return NextResponse.json({ ok: false, error: "order_item_failed" });
    }
  }

  return NextResponse.json({ ok: true, order_id: order.id });
}
