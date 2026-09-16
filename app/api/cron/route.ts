import { NextResponse } from "next/server";
import { connectDB } from "@/app/backend/config/db";
import Booking from "@/app/backend/models/booking.model";
import Notification from "@/app/backend/models/notification";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET() {
  try {
    await connectDB();

    const now = new Date();
    const sevenDaysFromNow = new Date(now);
    sevenDaysFromNow.setDate(now.getDate() + 7);

    // Find upcoming confirmed bookings in the next 7 days
    const upcomingBookings = await Booking.find({
      eventDate: { $gte: now, $lte: sevenDaysFromNow },
      status: "confirmed",
    });

    let emailsSent = 0;
    let notificationsCreated = 0;

    for (const booking of upcomingBookings) {
      const shortDate = new Date(booking.eventDate).toLocaleDateString("en-GB");

      // ✅ Check if this reminder already exists (so we don't spam)
      const existingReminder = await Notification.findOne({
        userId: "admin",
        type: "reminder",
        link: `/admin/bookings/${booking._id}`,
      });

      const isNewReminder = !existingReminder;

      // Create or update the in-app reminder
      await Notification.findOneAndUpdate(
        {
          userId: "admin",
          type: "reminder",
          link: `/admin/bookings/${booking._id}`,
        },
        {
          userId: "admin",
          title: `Upcoming: ${booking.clientName}`,
          message: `${booking.eventType} at ${booking.eventLocation} on ${shortDate}`,
          type: "reminder",
          link: `/admin/bookings/${booking._id}`,
          read: false,
        },
        { upsert: true, new: true },
      );
      notificationsCreated++;

      // ✅ Send email ONLY if it's a new reminder (first time seeing it)
      if (isNewReminder) {
        try {
          await resend.emails.send({
            from: "Wizzy Drums <onboarding@resend.dev>",
            to: [process.env.ADMIN_EMAIL!],
            subject: `Reminder: ${booking.clientName} — ${shortDate}`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: #0f172a; padding: 24px; border-radius: 12px 12px 0 0; text-align: center;">
                  <h1 style="color: #d4a548; margin: 0; font-size: 20px;">Event Reminder</h1>
                </div>
                <div style="background: #ffffff; padding: 24px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px;">
                  <p style="color: #64748b; font-size: 14px; margin: 0 0 16px;">You have an upcoming event in less than 7 days.</p>
                  
                  <table style="width: 100%; font-size: 14px; color: #0f172a;">
                    <tr><td style="padding: 6px 0; color: #64748b; width: 100px;">Client</td><td style="padding: 6px 0; font-weight: 600;">${booking.clientName}</td></tr>
                    <tr><td style="padding: 6px 0; color: #64748b;">Event</td><td style="padding: 6px 0;">${booking.eventType}</td></tr>
                    <tr><td style="padding: 6px 0; color: #64748b;">Date</td><td style="padding: 6px 0;">${shortDate}</td></tr>
                    <tr><td style="padding: 6px 0; color: #64748b;">Time</td><td style="padding: 6px 0;">${booking.eventTime}</td></tr>
                    <tr><td style="padding: 6px 0; color: #64748b;">Venue</td><td style="padding: 6px 0;">${booking.eventLocation}</td></tr>
                    <tr><td style="padding: 6px 0; color: #64748b;">Location</td><td style="padding: 6px 0;">${booking.eventState}, ${booking.eventCountry}</td></tr>
                  </table>
                  
                  <div style="text-align: center; margin-top: 24px;">
                    <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/bookings/${booking._id}" 
                       style="display: inline-block; background: #d4a548; color: #0f172a; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 600;">
                      View Booking →
                    </a>
                  </div>
                </div>
              </div>
            `,
          });
          emailsSent++;
        } catch (err) {
          console.error(
            `Failed to send reminder email for ${booking._id}:`,
            err,
          );
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Processed ${upcomingBookings.length} upcoming events`,
      emailsSent,
      notificationsCreated,
    });
  } catch (error) {
    console.error("Cron reminders error:", error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 },
    );
  }
}
