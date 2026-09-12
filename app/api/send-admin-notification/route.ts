import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { to, booking } = await request.json();

    const { data, error } = await resend.emails.send({
      from: "Wizzy Drum <onboarding@resend.dev>",
      to: [to],
      subject: `📅 New Booking: ${booking.clientName} - ${booking.eventType}`,
      html: `
        <h2>New Booking Received!</h2>
        <p><strong>Client:</strong> ${booking.clientName}</p>
        <p><strong>Email:</strong> ${booking.clientEmail}</p>
        <p><strong>Phone:</strong> ${booking.clientPhone}</p>
        <p><strong>Event:</strong> ${booking.eventType}</p>
        <p><strong>Date:</strong> ${new Date(booking.eventDate).toLocaleDateString()}</p>
        <p><strong>Location:</strong> ${booking.eventLocation}</p>
        <p><strong>State:</strong> ${booking.eventState}</p>
        <hr />
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/bookings/${booking._id}">View Booking →</a>
      `,
    });

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
