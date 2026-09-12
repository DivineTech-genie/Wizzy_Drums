import { connectDB } from "@/app/backend/config/db";
import EventsOptions from "@/app/backend/models/eventType.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();

    const newEvent = await EventsOptions.create(body);

    return NextResponse.json(
      { success: true, data: newEvent },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("❌ Events POST Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    await connectDB();

    const events = await EventsOptions.find({}).sort({ label: 1 });

    return NextResponse.json(
      { success: true, results: events.length, data: events },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("❌ Events GET Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
