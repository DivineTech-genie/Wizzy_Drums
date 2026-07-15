import { NextResponse, NextRequest } from "next/server";
import { SignJWT } from "jose";

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    const adminPassword = process.env.ADMIN_PASSWORD;
    const jwtSecret = process.env.JWT_SECRET;

    if (!adminPassword || !jwtSecret) {
      return NextResponse.json(
        { message: "Server configuration missing security keys." },
        { status: 500 },
      );
    }

    // 1. Verify password using bcrypt
    if (password !== adminPassword) {
      return NextResponse.json(
        { message: "Invalid administrator password." },
        { status: 401 },
      );
    }

    // 2. Cryptographically sign the JWT using jose
    const secretKey = new TextEncoder().encode(jwtSecret);
    const token = await new SignJWT({ role: "admin" })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("2h")
      .sign(secretKey);

    // 3. Create response and bake the JWT into a highly secure, HttpOnly cookie
    const response = NextResponse.json(
      { message: "Authentication successful." },
      { status: 200 },
    );

    response.cookies.set({
      name: "admin_token",
      value: token,
      httpOnly: true, // Prevents Javascript from reading the cookie (protects against XSS)
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 2,
      path: "/",
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { message: "Internal server error during login.", error: error.message },
      { status: 500 },
    );
  }
}
