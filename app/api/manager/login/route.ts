import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { SignJWT } from "jose";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { ok: false, error: "missing_fields" },
        { status: 400 }
      );
    }

    const supabase = supabaseServer();

    // ❗ НЕ используем .single()
    const { data, error } = await supabase
      .from("manager_users")
      .select("*")
      .ilike("email", email.trim())
      .limit(1);

    if (error) {
      console.error("SUPABASE ERROR:", error);
      return NextResponse.json(
        { ok: false, error: "db_error" },
        { status: 500 }
      );
    }

    const manager = data?.[0];

    if (!manager || manager.password !== password.trim()) {
      return NextResponse.json(
        { ok: false, error: "invalid_credentials" },
        { status: 401 }
      );
    }

    // 🔐 JWT (без payload role тоже можно, но оставим)
    const token = await new SignJWT({
      id: manager.id,
      role: "manager",
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("7d")
      .sign(new TextEncoder().encode(process.env.JWT_SECRET));

    const res = NextResponse.json({ ok: true });

    res.cookies.set("manager_token", token, {
      httpOnly: true,
      path: "/manager",
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch (e) {
    console.error("MANAGER LOGIN FATAL ERROR:", e);
    return NextResponse.json(
      { ok: false, error: "server_error" },
      { status: 500 }
    );
  }
}
