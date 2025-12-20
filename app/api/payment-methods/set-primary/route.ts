import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function POST(req: Request) {
  const supabase = supabaseServer();
  const { userId, cardId } = await req.json();

  if (!userId || !cardId)
    return NextResponse.json({ ok: false, error: "Missing params" });

  // Remove primary from all cards
  await supabase
    .from("payment_methods")
    .update({ is_primary: false })
    .eq("user_id", userId);

  // Set primary
  await supabase
    .from("payment_methods")
    .update({ is_primary: true })
    .eq("id", cardId);

  return NextResponse.json({ ok: true });
}
