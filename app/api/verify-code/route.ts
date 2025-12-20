import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function POST(req: Request) {
  const supabase = supabaseServer();
  const { phone, code } = await req.json();

  console.log("VERIFY INPUT PHONE:", phone);
  console.log("VERIFY INPUT CODE:", code);

  const codeStr = String(code).trim();

  // 1) Найти OTP
  const { data: otp } = await supabase
    .from("otp_codes")
    .select("*")
    .eq("phone", phone.trim())
    .eq("code", codeStr)
    .single();

  if (!otp) {
    return NextResponse.json({ ok: false, error: "invalid" });
  }

  // 2) Удаляем OTP
  await supabase.from("otp_codes").delete().eq("id", otp.id);

  // 3) Поиск пользователя
  let { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("phone", phone.trim())
    .single();

  // 4) Создать пользователя если нет
  if (!user) {
    const { data: created } = await supabase
      .from("users")
      .insert({ phone: phone.trim(), role: "user" })
      .select()
      .single();

    user = created;
  }

  // 5) Вернуть user + userId
  return NextResponse.json({
    ok: true,
    user,
    userId: user.id,
    role: user.role
  });
}
