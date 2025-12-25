import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req: Request) {
  const body = await req.json();

  const {
    user_id,
    items,
    total,
    use_bonus = 0,

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

  /* ===== ПРОВЕРКИ ===== */
  if (!user_id) {
    return NextResponse.json({ ok: false, error: "no_user" });
  }

  if (!items || items.length === 0) {
    return NextResponse.json({ ok: false, error: "empty_cart" });
  }

  if (!total || total <= 0) {
    return NextResponse.json({ ok: false, error: "incorrect_total" });
  }

  /* ===== ДОСТАВКА ===== */
  const FREE_DELIVERY_FROM = 10000;
  const DELIVERY_PRICE = 2000;

  const deliveryPrice =
    delivery_type === "delivery" && total < FREE_DELIVERY_FROM
      ? DELIVERY_PRICE
      : 0;

  const finalTotal = total + deliveryPrice;

  /* ===== ПОЛЬЗОВАТЕЛЬ ===== */
  const { data: user } = await supabase
    .from("users")
    .select("name, phone")
    .eq("id", user_id)
    .single();

  if (!user) {
    return NextResponse.json({ ok: false, error: "user_not_found" });
  }

  /* ===== БОНУСЫ ===== */
  const { data: bonusRow } = await supabase
    .from("user_bonus")
    .select("balance")
    .eq("user_id", user_id)
    .maybeSingle();

  const bonusBalance = bonusRow?.balance || 0;

  // бонусами нельзя оплачивать доставку
  const productsTotal = total;

  const bonusToUse = Math.min(
    Number(use_bonus),
    bonusBalance,
    productsTotal
  );

  const finalTotalWithBonus = finalTotal - bonusToUse;

  /* ===== ВРЕМЯ ===== */
  const now = new Date().toISOString();

  /* ===== СОЗДАНИЕ ЗАКАЗА ===== */
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id,
      name: recipient_name ?? user.name,
      phone: recipient_phone ?? user.phone,

      recipient_name,
      recipient_phone,

      total: finalTotalWithBonus,
      delivery_price: deliveryPrice,
      used_bonus: bonusToUse,

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

  /* ===== ТОВАРЫ ===== */
  for (const item of items) {
    const { error } = await supabase.from("order_items").insert({
      order_id: order.id,
      product_id: item.id,
      product_name: item.name,
      image: item.image,
      price: item.price,
      qty: item.qty,
    });

    if (error) {
      console.error("ORDER ITEM ERROR:", error);
      return NextResponse.json({ ok: false, error: "order_item_failed" });
    }
  }

  /* ===== СПИСАНИЕ БОНУСОВ ===== */
  if (bonusToUse > 0) {
    await supabase
      .from("user_bonus")
      .update({ balance: bonusBalance - bonusToUse })
      .eq("user_id", user_id);

    await supabase.from("bonus_history").insert({
      user_id,
      order_id: order.id,
      type: "spend",
      amount: bonusToUse,
    });
  }

  return NextResponse.json({ ok: true, order_id: order.id });
}
