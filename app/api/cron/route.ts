import { NextResponse } from "next/server";

// This will be triggered by Vercel Cron Jobs
export async function GET() {
  try {
    // Trigger reminders creation
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/admin/reminders`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      },
    );

    const data = await response.json();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
