import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/backend/config/db";
import EventsOptions from "@/app/backend/models/eventType.model"; 
import { verifyAuth } from "@/lib/auth";
import { eventSchema } from "@/app/backend/validators/events";


// GET all event types
export async function GET() {
  try {
    await connectDB();
    const types = await EventsOptions.find({}).sort({ value: 1 }); 
    return NextResponse.json({ status: "success", data: types });
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: "Failed to fetch event types" },
      { status: 500 },
    );
  }
}

// POST create new event type
export async function POST(req: NextRequest) {
  try {
    const auth = await verifyAuth(req);
    if (!auth) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const rawData = await req.json();
    const validation = eventSchema.safeParse(rawData);

    if (!validation.success) {
      return NextResponse.json(
        { status: "error", errors: validation.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    // Check if value already exists
    const existing = await EventsOptions.findOne({
      value: validation.data.value,
    });
    if (existing) {
      return NextResponse.json(
        { status: "error", message: "Event type already exists" },
        { status: 409 },
      );
    }

    const eventType = await EventsOptions.create(validation.data);
    return NextResponse.json(
      { status: "success", data: eventType },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: "Failed to create event type" },
      { status: 500 },
    );
  }
}
