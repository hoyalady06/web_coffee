import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

const USER_ID = "7220c444-8a5f-4d2f-b2b5-f47703d1583a";

export async function POST(req: Request) {
  const supabase = supabaseServer();
  const { order_id, amount } = await req.json();

  if (!order_id || !amount) {
    return NextResponse.json({ ok: false, error: "missing_data" });
  }

  const { data: row } = await supabase
    .from("user_bonus")
    .select("balance")
    .eq("user_id", USER_ID)
    .single();

  if (!row || row.balance < amount) {
    return NextResponse.json({ ok: false, error: "not_enough_bonus" });
  }

  await supabase
    .from("user_bonus")
    .update({ balance: row.balance - amount })
    .eq("user_id", USER_ID);

  await supabase.from("bonus_history").insert({
    user_id: USER_ID,
    order_id,
    type: "spend",
    amount,
  });

  return NextResponse.json({ ok: true });
}
