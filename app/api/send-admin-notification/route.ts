import AdminEmail from "@/components/emails/AdminEmail";
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { to, booking } = await request.json();

    const { data, error } = await resend.emails.send({
      from: "Wizzy Drums <onboarding@resend.dev>",
      to: [to],
      subject: `📅 New Booking: ${booking.clientName} - ${booking.eventType}`,
      react: AdminEmail({ booking }),
    });

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
