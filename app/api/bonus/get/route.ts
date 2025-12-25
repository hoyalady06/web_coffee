import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

const USER_ID = "7220c444-8a5f-4d2f-b2b5-f47703d1583a";

export async function GET() {
  const supabase = supabaseServer();

  // баланс
  const { data: balanceRow } = await supabase
    .from("user_bonus")
    .select("balance")
    .eq("user_id", USER_ID)
    .maybeSingle();

  // история
  const { data: history } = await supabase
    .from("bonus_history")
    .select("*")
    .eq("user_id", USER_ID)
    .order("created_at", { ascending: false });

  return NextResponse.json({
    ok: true,
    balance: balanceRow?.balance ?? 0,
    history: history ?? [],
  });
}
