import { connectDB } from "@/app/backend/config/db";
import Booking from "@/app/backend/models/booking.model";
import Notification from "@/app/backend/models/notification";
import { BookingFormSchema } from "@/app/backend/validators/validators";
import { BookingConfirmation } from "@/components/emails/BookingConfirmation";
import AdminEmail from "@/components/emails/AdminEmail";
import { NextResponse, NextRequest } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// ✅ PUBLIC GET — only returns confirmed bookings (for calendar blocking)
export async function GET() {
  try {
    await connectDB();

    const confirmedBookings = await Booking.find({ status: "confirmed" })
      .select("eventDate status")
      .sort({ eventDate: 1 });

    return NextResponse.json(
      {
        status: "success",
        results: confirmedBookings.length,
        data: confirmedBookings,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("GET /api/bookings error:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to fetch bookings",
        error: "Unable to load bookings",
      },
      { status: 500 },
    );
  }
}

// POST — create new booking
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const rawData = await req.json();
    const validationResult = BookingFormSchema.safeParse(rawData);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          status: "error",
          errors: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const validatedData = validationResult.data;

    // Normalize Date
    const targetDate = new Date(validatedData.eventDate);
    targetDate.setUTCHours(0, 0, 0, 0);

    // Only CONFIRMED bookings block a date
    const existingBooking = await Booking.findOne({
      eventDate: targetDate,
      status: "confirmed",
    });

    if (existingBooking) {
      return NextResponse.json(
        {
          status: "error",
          message:
            "Sorry! This date is already booked. Please choose another date.",
        },
        { status: 409 },
      );
    }

    const newBooking = await Booking.create({
      ...validatedData,
      eventDate: targetDate,
    });

    const shortDate = new Date(newBooking.eventDate).toLocaleDateString(
      "en-GB",
    );

    const notificationResults = await Promise.allSettled([
      // 1. Client confirmation email
      resend.emails.send({
        from: "Wizzy Drums <onboarding@resend.dev>",
        to: [newBooking.clientEmail],
        subject: `Booking Request Received — ${shortDate}`,
        react: BookingConfirmation({
          bookingId: String(newBooking._id),
          clientName: newBooking.clientName,
          eventType: newBooking.eventType,
          eventDate: shortDate,
          eventLocation: newBooking.eventLocation,
          eventTime: newBooking.eventTime,
          status: "pending",
        }),
      }),

      // 2. Admin notification email
      resend.emails.send({
        from: "Wizzy Drums <onboarding@resend.dev>",
        to: [process.env.ADMIN_EMAIL!],
        subject: `📅 New Booking: ${newBooking.clientName} — ${newBooking.eventType}`,
        react: AdminEmail({ booking: newBooking }),
      }),

      // 3. In-app notification (direct DB write — no auth needed)
      Notification.create({
        userId: "admin",
        title: "New Booking!",
        message: `${newBooking.clientName} just booked a ${newBooking.eventType} event on ${shortDate}`,
        type: "booking",
        link: `/admin/bookings/${newBooking._id}`,
      }),
    ]);

    const notificationOperations = [
      "client confirmation email",
      "admin notification email",
      "in-app notification",
    ];

    notificationResults.forEach((result, index) => {
      if (result.status === "rejected") {
        console.error(
          `Failed to send ${notificationOperations[index]} for booking ${newBooking._id}:`,
          result.reason,
        );
      }
    });

    return NextResponse.json(
      {
        status: "success",
        message: "Booking request submitted successfully",
        data: newBooking,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST /api/bookings error:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Internal server error.",
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    );
  }
}
