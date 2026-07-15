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
    // Since the ADMIN_PASSWORD in .env is plain text, we hash it on the fly to match industry validation patterns,
    // or compare it directly. For single-user convenience, we compare the incoming text to the env variable.
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
      .setExpirationTime("2h") // Token expires automatically in 2 hours
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
      maxAge: 60 * 60 * 2, // 2 hours in seconds
      path: "/", // Valid across the whole site
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { message: "Internal server error during login.", error: error.message },
      { status: 500 },
    );
  }
}
