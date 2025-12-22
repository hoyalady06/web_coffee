import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAdminToken } from "@/lib/adminToken";

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // 🔐 Защищаем ТОЛЬКО админку
  if (path.startsWith("/admin") && !path.startsWith("/admin/login")) {
    // 👉 Берём токен ТОЛЬКО из cookies
    const token = req.cookies.get("admin_token")?.value;

    // ❌ Нет токена — на логин
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }

    // ❌ Невалидный токен или не админ — на логин
    const payload = await verifyAdminToken(token);

    if (!payload || payload.role !== "admin") {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  // ✅ Всё ок — пускаем дальше
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
