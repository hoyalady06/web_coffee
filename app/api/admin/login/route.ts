import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { createAdminToken } from "@/lib/adminToken";

export async function POST(req: Request) {
  try {
    const supabase = supabaseServer();
    const { email, password } = await req.json();

    // 1️⃣ Ищем админа
    const { data: admin, error } = await supabase
      .from("admin_users")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !admin) {
      return NextResponse.json({ ok: false, error: "Admin not found" });
    }

    // 2️⃣ Проверяем пароль
    if (admin.password !== password) {
      return NextResponse.json({ ok: false, error: "Invalid password" });
    }

    // 3️⃣ Создаём token
    const token = await createAdminToken({
      id: admin.id,
      email: admin.email,
      role: "admin",
      ts: Date.now(),
    });

    // 4️⃣ ОТВЕТ + COOKIE (ВОТ ЭТО БЫЛО НУЖНО)
    const response = NextResponse.json({ ok: true });

    response.cookies.set({
      name: "admin_token",
      value: token,
      httpOnly: true,
      path: "/",
      sameSite: "lax",
    });

    return response;

  } catch (e) {
    console.error("SERVER ERROR:", e);
    return NextResponse.json({ ok: false, error: "Server error" });
  }
}
