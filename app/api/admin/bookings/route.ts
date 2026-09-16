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

    const searchParams = req.nextUrl.searchParams;
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status");
    const type = searchParams.get("type");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const query: any = {};
    if (status && status !== "all") query.status = status;
    if (type && type !== "all") query.eventType = type;
    if (search) {
      query.$or = [
        { clientName: { $regex: search, $options: "i" } },
        { clientEmail: { $regex: search, $options: "i" } },
        { eventLocation: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;
    const [bookings, total] = await Promise.all([
      Booking.find(query).sort({ eventDate: -1 }).skip(skip).limit(limit),
      Booking.countDocuments(query),
    ]);

    return NextResponse.json({
      status: "success",
      data: bookings,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
