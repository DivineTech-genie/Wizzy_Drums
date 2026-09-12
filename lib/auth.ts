import { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "your-jwt-secret-here";

export async function verifyAuth(req: NextRequest) {
  const token = req.cookies.get("admin_token")?.value;

  if (!token) return null;

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(JWT_SECRET),
    );
    return payload;
  } catch {
    return null;
  }
}
