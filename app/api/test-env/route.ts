import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    email: process.env.ADMIN_EMAIL,
    pass: process.env.ADMIN_PASS,
  });
}
