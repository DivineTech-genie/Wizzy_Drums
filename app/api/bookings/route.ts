import { connectDB } from "@/app/backend/config/db";
import Booking from "@/app/backend/models/booking.model";
import { BookingFormSchema } from "@/app/backend/validators/validators";
import { NextResponse, NextRequest } from "next/server";

export async function GET() {
  try {
    await connectDB();

    const allBookings = await Booking.find({}).sort({ eventDate: 1 });
    return NextResponse.json(
      { status: "success", results: allBookings.length, data: allBookings },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("GET /api/bookings error:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to fetch bookings",
        error: error.message,
      },
      { status: 500 },
    );
  }
}

// src/app/api/bookings/route.ts

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const rawData = await req.json();
    const validationResult = BookingFormSchema.safeParse(rawData);

    // 1. Validation Fail (HTTP 400 Bad Request)
    if (!validationResult.success) {
      return NextResponse.json(
        {
          status: "error",
          errors: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }, // <--- Pass the REAL HTTP status here!
      );
    }

    const validatedData = validationResult.data;

    // Normalize Date before checking
    const targetDate = new Date(validatedData.eventDate);
    targetDate.setUTCHours(0, 0, 0, 0);

    const existingBooking = await Booking.findOne({ eventDate: targetDate });

    // 2. Duplicate Check Fail (HTTP 409 Conflict)
    if (existingBooking) {
      return NextResponse.json(
        {
          status: "error",
          message:
            "Sorry!, This Date is already booked. Please choose another date.",
        },
        { status: 409 }, // <--- Real HTTP 409 Conflict
      );
    }

    const newBooking = await Booking.create({
      ...validatedData,
      eventDate: targetDate,
    });

    // Send confirmation email (non-blocking)
    fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/send-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clientEmail: newBooking.clientEmail,
        clientName: newBooking.clientName,
        eventType: newBooking.eventType,
        eventDate: newBooking.eventDate,
        eventLocation: newBooking.eventLocation,
      }),
    }).catch((err) => console.error("Failed to send email:", err));

    // Send email to admin
    const adminEmail = process.env.ADMIN_EMAIL || "admin@stagebook.com";
    fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/send-admin-notification`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: adminEmail,
        booking: newBooking,
      }),
    }).catch((err) => console.error("Failed to send admin email:", err));

    // Also create in-app notification
    fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/admin/notifications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "New Booking!",
        message: `${newBooking.clientName} just booked a ${newBooking.eventType} event on ${new Date(newBooking.eventDate).toLocaleDateString()}`,
        type: "booking",
        link: `/admin/bookings/${newBooking._id}`,
      }),
    }).catch((err) => console.error("Failed to create notification:", err));

    // 3. Successful Creation (HTTP 201 Created)
    if (newBooking) {
      return NextResponse.json(
        {
          status: "success",
          message: "Date booked successfully",
          data: newBooking,
        },
        { status: 201 }, // <--- Real HTTP 201 Created
      );
    } else {
      return NextResponse.json(
        {
          status: "error",
          message: "Sorry!, booking failed.",
        },
        { status: 500 }, // <--- Real HTTP 500 Internal Server Error
      );
    }
  } catch (error) {
    console.error("POST /api/bookings error:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Internal server error.",
        error: error instanceof Error ? error.message : String(error),
        // Include stack in development to aid debugging
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }, // <--- Real HTTP 500
    );
  }
}
