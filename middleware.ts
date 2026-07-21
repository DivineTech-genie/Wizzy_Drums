import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("admin_token")?.value;
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
      // Cryptographically verify the token signature
      const secretKey = new TextEncoder().encode(process.env.JWT_SECRET || "");
      await jwtVerify(token, secretKey);

      return NextResponse.next();
    } catch (error) {
      // Token was manipulated or is expired! Redirect to login
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

// Configure the middleware to only run on admin routes (keeps public pages fast!)
export const config = {
  matcher: ["/admin/:path*"],
};
