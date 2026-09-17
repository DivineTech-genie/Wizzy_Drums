// app/api/admin/stats/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/backend/config/db";
import Booking from "@/app/backend/models/booking.model";
import { verifyAuth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const auth = await verifyAuth(req);
    if (!auth) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const [total, pending, confirmed, cancelled, thisMonth, lastMonth] =
      await Promise.all([
        Booking.countDocuments(),
        Booking.countDocuments({ status: "pending" }),
        Booking.countDocuments({ status: "confirmed" }),
        Booking.countDocuments({ status: "cancelled" }),
        Booking.countDocuments({
          createdAt: { $gte: startOfMonth, $lt: now },
        }),
        Booking.countDocuments({
          createdAt: { $gte: startOfLastMonth, $lt: startOfMonth },
        }),
      ]);

    const growth =
      lastMonth === 0 ? 0 : ((thisMonth - lastMonth) / lastMonth) * 100;

    return NextResponse.json({
      status: "success",
      data: {
        total,
        pending,
        confirmed,
        cancelled,
        thisMonth,
        growth: Math.round(growth * 10) / 10,
      },
    });
  } catch {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
