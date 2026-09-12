import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const auth = await verifyAuth(req);
  if (!auth) {
    return NextResponse.json(
      { authenticated: false, message: "Unauthorized" },
      { status: 401 },
    );
  }
  return NextResponse.json({ authenticated: true, role: auth.role });
}
