import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function POST(req: Request) {
  const supabase = supabaseServer();
  const { phone } = await req.json();

  if (!phone) {
    return NextResponse.json({ ok: false, error: "No phone" });
  }

  const code = Math.floor(1000 + Math.random() * 9000).toString();

  await supabase.from("otp_codes").insert({
    phone,
    code,
    expires_at: new Date(Date.now() + 1000 * 60 * 5).toISOString() // 🔥 Дұрыс формат
  });

  console.log("OTP:", code);

  return NextResponse.json({ ok: true, code });
}
