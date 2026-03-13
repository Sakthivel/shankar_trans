import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicPaths = ["/", "/login"];

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get("accessToken")?.value;

  if (!token && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
