import { auth } from "@/auth";
import { NextResponse } from "next/server";

const DIRECTOR_ROLES = new Set(["OWNER", "DIRECTOR", "PLATFORM_ADMIN"]);

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  const isProtected = pathname.startsWith("/dashboard") || pathname.startsWith("/learn");
  if (!isProtected) return NextResponse.next();

  if (!session?.user) {
    const loginUrl = new URL("/login", req.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname.startsWith("/dashboard") && !DIRECTOR_ROLES.has(session.user.platformRole)) {
    return NextResponse.redirect(new URL("/learn", req.nextUrl.origin));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*", "/learn/:path*"],
};
