import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function POST(req: Request) {
  try {
    const supabase = supabaseServer();

    const { userId, brand, card_last4, expiry } = await req.json();

    if (!userId || !brand || !card_last4 || !expiry) {
      return NextResponse.json({ ok: false, error: "missing_fields" });
    }

    // ---- Get existing cards ----
    const { data: existing, error: exError } = await supabase
      .from("payment_methods")
      .select("*")
      .eq("user_id", userId);

    if (exError) {
      console.error("EXISTING ERROR:", exError);
    }

    const existingCards = existing ?? []; // 🔥 null → []

    const is_primary = existingCards.length === 0;

    // ---- Insert new card ----
    const { data, error } = await supabase
      .from("payment_methods")
      .insert({
        user_id: userId,
        brand,
        card_last4,
        expiry,
        is_primary,
      })
      .select()
      .single();

    if (error) {
      console.error("INSERT ERROR:", error);
      return NextResponse.json({ ok: false, error: error.message });
    }

    return NextResponse.json({ ok: true, card: data });

  } catch (e) {
    console.error("ADD PAYMENT ERROR:", e);
    return NextResponse.json({ ok: false, error: "Server error" });
  }
}
