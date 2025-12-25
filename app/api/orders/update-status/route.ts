import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

const BONUS_PERCENT = 0.05;

export async function POST(req: Request) {
  const supabase = supabaseServer();
  const { order_id, new_status } = await req.json();

  if (!order_id || !new_status) {
    return NextResponse.json({ ok: false, error: "missing_data" });
  }

  /* 1️⃣ Получаем заказ */
  const { data: order, error } = await supabase
    .from("orders")
    .select("id, user_id, status, total, delivery_price")
    .eq("id", order_id)
    .single();

  if (error || !order) {
    return NextResponse.json({ ok: false, error: "order_not_found" });
  }

  /* ❌ защита от повторов */
  if (order.status === new_status) {
    return NextResponse.json({ ok: true, skipped: true });
  }

  /* 2️⃣ Обновляем статус */
  await supabase
    .from("orders")
    .update({ status: new_status })
    .eq("id", order_id);

  /* 3️⃣ БОНУСЫ — ТОЛЬКО ПРИ delivered */
  if (new_status === "delivered") {
    const { data: existed } = await supabase
      .from("bonus_history")
      .select("id")
      .eq("order_id", order_id)
      .eq("type", "earn")
      .maybeSingle();

    if (!existed) {
      const productsTotal = Math.max(
        Number(order.total) - Number(order.delivery_price || 0),
        0
      );

      const bonusAmount = Math.floor(productsTotal * BONUS_PERCENT);

      console.log("BONUS PRODUCTS TOTAL:", productsTotal);
      console.log("BONUS AMOUNT:", bonusAmount);

      if (bonusAmount > 0) {
        const { data: row } = await supabase
          .from("user_bonus")
          .select("balance")
          .eq("user_id", order.user_id)
          .maybeSingle();

        if (!row) {
          await supabase.from("user_bonus").insert({
            user_id: order.user_id,
            balance: bonusAmount,
          });
        } else {
          await supabase
            .from("user_bonus")
            .update({
              balance: Number(row.balance) + bonusAmount,
            })
            .eq("user_id", order.user_id);
        }

        await supabase.from("bonus_history").insert({
          user_id: order.user_id,
          order_id,
          type: "earn",
          amount: bonusAmount,
        });
      }
    }
  }

  return NextResponse.json({ ok: true });
}
