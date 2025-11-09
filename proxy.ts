// proxy.ts
import { NextResponse } from "next/server";

export function proxy(req: { nextUrl: { pathname: string; }; }) {
  const res = NextResponse.next();

  // Prevent middleware from touching cookies right after logout
  if (req.nextUrl.pathname === "/") {
    res.headers.set("Cache-Control", "no-store");
  }

  return res;
}
