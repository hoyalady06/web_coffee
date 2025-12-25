import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE!
);

export async function POST() {
  const userId = "7220c444-8a5f-4d2f-b2b5-f47703d1583a"; // Merey

  await supabase.rpc("add_bonus", {
    uid: userId,
    value: 100,
  });

  await supabase.from("bonus_history").insert({
    user_id: userId,
    type: "earn",
    amount: 100,
  });

  return NextResponse.json({ ok: true });
}
