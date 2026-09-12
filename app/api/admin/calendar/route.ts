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
    const year = parseInt(
      searchParams.get("year") || new Date().getFullYear().toString(),
    );
    const month = parseInt(
      searchParams.get("month") || (new Date().getMonth() + 1).toString(),
    );

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);

    const bookings = await Booking.find({
      eventDate: {
        $gte: startDate,
        $lt: endDate,
      },
    }).select("eventDate status clientName eventType");

    // Group bookings by date
    const grouped = bookings.reduce((acc: any, booking) => {
      const dateKey = booking.eventDate.toISOString().split("T")[0];
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(booking);
      return acc;
    }, {});

    return NextResponse.json({
      status: "success",
      data: grouped,
    });
  } catch (error) {
    console.error("Error fetching calendar data:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
