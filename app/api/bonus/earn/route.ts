import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  const { order_id } = await req.json();

  if (!order_id) {
    return NextResponse.json({ ok: false, error: "missing_order_id" });
  }

  /* 1️⃣ Проверяем — уже начисляли? */
  const { data: existed } = await supabaseAdmin
    .from("bonus_history")
    .select("id")
    .eq("order_id", order_id)
    .eq("type", "earn")
    .maybeSingle();

  if (existed) {
    return NextResponse.json({ ok: true, skipped: true });
  }

  /* 2️⃣ Берём заказ */
  const { data: order, error } = await supabaseAdmin
    .from("orders")
    .select("id, status, items, user_id")
    .eq("id", order_id)
    .single();

  if (error || !order) {
    return NextResponse.json({ ok: false, error: "order_not_found" });
  }

  if (order.status !== "delivered") {
    return NextResponse.json({ ok: false, error: "not_delivered" });
  }

  /* 3️⃣ Считаем бонусы */
  let bonusSum = 0;

  for (const item of order.items ?? []) {
    if (item?.bonus && item?.qty) {
      bonusSum += item.bonus * item.qty;
    }
  }

  if (bonusSum <= 0) {
    return NextResponse.json({ ok: true, bonus: 0 });
  }

  /* 4️⃣ Обновляем баланс */
  const { data: row } = await supabaseAdmin
    .from("user_bonus")
    .select("balance")
    .eq("user_id", order.user_id)
    .maybeSingle();

  if (!row) {
    await supabaseAdmin.from("user_bonus").insert({
      user_id: order.user_id,
      balance: bonusSum,
    });
  } else {
    await supabaseAdmin
      .from("user_bonus")
      .update({ balance: row.balance + bonusSum })
      .eq("user_id", order.user_id);
  }

  /* 5️⃣ История */
  await supabaseAdmin.from("bonus_history").insert({
    user_id: order.user_id,
    order_id,
    type: "earn",
    amount: bonusSum,
    expires_at: new Date(
      Date.now() + 180 * 24 * 60 * 60 * 1000
    ).toISOString(),
  });

  return NextResponse.json({ ok: true, bonus: bonusSum });
}
