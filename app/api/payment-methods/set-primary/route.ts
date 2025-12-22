import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function POST(req: Request) {
  const supabase = supabaseServer();
  const { userId, cardId } = await req.json();

  if (!userId || !cardId)
    return NextResponse.json({ ok: false, error: "Missing params" });

 // 1. снять primary со всех карт
await supabase
  .from("payment_methods")
  .update({ is_primary: false })
  .eq("user_id", userId);

// 2. поставить primary выбранной
await supabase
  .from("payment_methods")
  .update({ is_primary: true })
  .eq("id", cardId);

  return NextResponse.json({ ok: true });
}
