import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/backend/config/db";
import Booking from "@/app/backend/models/booking.model";
import { verifyAuth } from "@/lib/auth";
import Notification from "@/app/backend/models/notification";

export async function POST(req: NextRequest) {
  try {
    const auth = await verifyAuth(req);
    if (!auth) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const now = new Date();
    const sevenDaysFromNow = new Date(now);
    sevenDaysFromNow.setDate(now.getDate() + 7);

    // Find upcoming events in the next 7 days
    const upcomingBookings = await Booking.find({
      eventDate: { $gte: now, $lte: sevenDaysFromNow },
      status: "confirmed",
    });

    // Create reminders for each
    for (const booking of upcomingBookings) {
      await Notification.findOneAndUpdate(
        {
          userId: "admin",
          title: `Upcoming Event: ${booking.clientName}`,
          type: "reminder",
          link: `/admin/bookings/${booking._id}`,
        },
        {
          userId: "admin",
          title: `Upcoming Event: ${booking.clientName}`,
          message: `${booking.eventType} at ${booking.eventLocation} on ${new Date(booking.eventDate).toLocaleDateString()}`,
          type: "reminder",
          link: `/admin/bookings/${booking._id}`,
          read: false,
        },
        { upsert: true, new: true },
      );
    }

    return NextResponse.json({
      status: "success",
      message: `Created ${upcomingBookings.length} reminders`,
    });
  } catch (error) {
    console.error("Reminder error:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to create reminders" },
      { status: 500 },
    );
  }
}
