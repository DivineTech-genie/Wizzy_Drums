import { BookingConfirmation } from "@/components/emails/BookingConfirmation";
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    // Extract booking data from the request body

    const {
      clientName,
      clientEmail,
      eventType,
      eventDate,
      eventLocation,
      status,
      adminNote,
      eventTime,
    } = await request.json();

    // Build a dynamic subject based on booking status
    const shortDate = eventDate ? `${eventDate}` : "your date";
    let subject = `Booking Update — ${eventType || "your event"} on ${shortDate}`;
    if (status === "confirmed") {
      subject = "Booking Confirmation ";
    } else if (status === "cancelled") {
      subject = "Booking Cancelled ";
    } else if (status === "pending") {
      subject = "Booking Confirmation Pending ";
    }

    const { data, error } = await resend.emails.send({
      from: "Wizzy Drums <onboarding@resend.dev>", // Replace with your sender address
      to: [clientEmail],
      subject,
      react: BookingConfirmation({
        clientName,
        eventType,
        eventDate,
        eventLocation,
        status,
        adminNote,
        eventTime,
      }),
    });

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
