// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "your-jwt-secret-here";

// Paths that don't require authentication
const PUBLIC_PATHS = ["/login", "/api/auth/login", "/api/auth/logout"];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const isPublic = PUBLIC_PATHS.some(
    (p) => path === p || path.startsWith(p + "/"),
  );
  const isApiRoute = path.startsWith("/api/");
  const token = request.cookies.get("admin_token")?.value;

  // ==================================================
  // 1. Handle PUBLIC paths
  // ==================================================
  if (isPublic) {
    // If user is already authenticated and hits /login, send to dashboard
    if (path === "/login" && token) {
      try {
        await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
        return NextResponse.redirect(new URL("/admin", request.url));
      } catch {
        // Token invalid — let them see login page, clear bad cookie
        const response = NextResponse.next();
        response.cookies.delete("admin_token");
        return response;
      }
    }
    return NextResponse.next();
  }

  // ==================================================
  // 2. Handle PROTECTED paths (everything else in matcher)
  // ==================================================
  if (!token) {
    if (isApiRoute) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
    return NextResponse.next();
  } catch {
    // Token invalid or expired
    if (isApiRoute) {
      const response = NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 401 },
      );
      response.cookies.delete("admin_token");
      return response;
    }

    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("admin_token");
    return response;
  }
}

export const config = {
  matcher: [
    // Protected pages
    "/admin/:path*",
    // Protected API routes
    "/api/admin/:path*",
    // Login page (to redirect authenticated users away)
    "/login",
  ],
};
