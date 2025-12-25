import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

const USER_ID = "a9548a07-4e70-4155-b047-f7c101ce8042";

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
