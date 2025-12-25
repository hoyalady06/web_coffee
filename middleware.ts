import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAdminToken } from "@/lib/adminToken";
import { jwtVerify } from "jose";

const managerSecret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  /* =======================
     🔐 ADMIN ZONE
  ======================= */
  if (path.startsWith("/admin") && !path.startsWith("/admin-login")) {
    const token = req.cookies.get("admin_token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/admin-login", req.url));
    }

    const payload = await verifyAdminToken(token);

    if (!payload || payload.role !== "admin") {
      return NextResponse.redirect(new URL("/admin-login", req.url));
    }
  }

  /* =======================
     🔐 MANAGER ZONE
  ======================= */
  if (path.startsWith("/manager")) {
    const token = req.cookies.get("manager_token")?.value;

    if (!token) {
      return NextResponse.redirect(
        new URL("/manager-login", req.url)
      );
    }

    try {
      const { payload } = await jwtVerify(token, managerSecret);

      if (payload.role !== "manager") {
        return NextResponse.redirect(
          new URL("/manager-login", req.url)
        );
      }
    } catch (e) {
      return NextResponse.redirect(
        new URL("/manager-login", req.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/manager/:path*"],
};
