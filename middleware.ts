import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAdminToken } from "@/lib/adminToken";

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Protect admin routes except login page
  if (path.startsWith("/admin") && !path.startsWith("/admin/login")) {
    const token =
      req.cookies.get("admin_token")?.value ||
      req.headers.get("admin_token") ||
      null;

    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }

    const payload = await verifyAdminToken(token);

    if (!payload || payload.role !== "admin") {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
