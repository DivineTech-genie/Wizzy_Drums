import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/backend/config/db";
import EventsOptions from "@/app/backend/models/eventType.model";
import { verifyAuth } from "@/lib/auth";
import { eventSchema } from "@/app/backend/validators/events";
import { deleteCloudinaryFile } from "@/lib/cloudinary";

// GET single event type
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const { id } = await params;
    const eventType = await EventsOptions.findById(id);

    if (!eventType) {
      return NextResponse.json(
        { status: "error", message: "Event type not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ status: "success", data: eventType });
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: "Failed to fetch event type" },
      { status: 500 },
    );
  }
}

// PUT update event type
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await verifyAuth(req);
    if (!auth) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;
    const rawData = await req.json();
    const validation = eventSchema.partial().safeParse(rawData);

    if (!validation.success) {
      return NextResponse.json(
        { status: "error", errors: validation.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const eventType = await EventsOptions.findByIdAndUpdate(
      id,
      { ...validation.data },
      { new: true, runValidators: true },
    );

    if (!eventType) {
      return NextResponse.json(
        { status: "error", message: "Event type not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ status: "success", data: eventType });
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: "Failed to update event type" },
      { status: 500 },
    );
  }
}

// DELETE event type
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await verifyAuth(req);
    if (!auth) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;

    const existingEvent = await EventsOptions.findById(id);
    if (!existingEvent) {
      return NextResponse.json(
        { status: "error", message: "Event type not found" },
        { status: 404 },
      );
    }

    await deleteCloudinaryFile(existingEvent.src);

    const eventType = await EventsOptions.findByIdAndDelete(id);

    if (!eventType) {
      return NextResponse.json(
        { status: "error", message: "Event type not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      status: "success",
      message: "Event type deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: "Failed to delete event type" },
      { status: 500 },
    );
  }
}
