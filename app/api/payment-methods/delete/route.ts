import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function POST(req: Request) {
  const supabase = supabaseServer();
  const { cardId, userId } = await req.json();

  if (!cardId || !userId)
    return NextResponse.json({ ok: false, error: "Missing params" });

  // 1) Remove card
  await supabase.from("payment_methods").delete().eq("id", cardId);

  // 2) Load user cards
  const { data: cardsRaw, error } = await supabase
    .from("payment_methods")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    console.error("LOAD CARDS ERROR:", error);
    return NextResponse.json({ ok: false, error: error.message });
  }

  // 🔥 Fix: convert null → []
  const cards = cardsRaw ?? [];

  // 3) If there are cards but no primary → assign one automatically
  if (cards.length > 0 && !cards.some(c => c.is_primary)) {
    await supabase
      .from("payment_methods")
      .update({ is_primary: true })
      .eq("id", cards[0].id);
  }

  return NextResponse.json({ ok: true });
}
