import { connectDB } from "@/app/backend/config/db";
import Booking from "@/app/backend/models/booking.model";
import { verifyAuth } from "@/lib/auth";
import { deleteCloudinaryFile } from "@/lib/cloudinary";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const updateStatusSchema = z.object({
  status: z.enum(["pending", "confirmed", "cancelled"], {
    message: "Status must be 'pending', 'confirmed', or 'cancelled'",
  }),
});

function isDuplicateKeyError(error: unknown): error is { code: number } {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === 11000
  );
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const { id } = await params;
    const booking = await Booking.findById(id)
      .select("_id eventDate eventType status createdAt")
      .lean();

    if (!booking) {
      return NextResponse.json(
        { status: "error", message: "Booking not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { status: "success", data: booking },
      { status: 200 },
    );
  } catch (error) {
    console.error("GET /api/bookings/[id] error:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to fetch booking",
      },
      { status: 500 },
    );
  }
}

export async function PATCH(
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
    const validationResult = updateStatusSchema.safeParse(rawData);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          status: "error",
          errors: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }, // ✅ Real HTTP status
      );
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      id,
      { status: validationResult.data.status },
      { new: true, runValidators: true },
    );

    if (!updatedBooking) {
      return NextResponse.json(
        { status: "error", message: "No booking found with that ID" },
        { status: 404 }, // ✅ Real HTTP status
      );
    }

    return NextResponse.json(
      { status: "success", data: updatedBooking },
      { status: 200 }, // ✅ Real HTTP status
    );
  } catch (error) {
    console.error("PATCH /api/bookings/[id] error:", error);

    if (isDuplicateKeyError(error)) {
      return NextResponse.json(
        {
          status: "error",
          message:
            "Sorry! This date is already booked. Please choose another date.",
        },
        { status: 409 },
      );
    }

    return NextResponse.json(
      {
        status: "error",
        message: "Update failed.",
        error: "Failed to update booking",
      },
      { status: 500 }, // ✅ Real HTTP status
    );
  }
}

/** Deletes an authenticated booking and its uploaded supporting documents. */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await verifyAuth(request);
    if (!auth) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;

    const existingBooking = await Booking.findById(id);
    if (!existingBooking) {
      return NextResponse.json(
        { status: "error", message: "No booking found with that ID to delete" },
        { status: 404 },
      );
    }

    // Clean up Cloudinary files
    await Promise.all([
      deleteCloudinaryFile(existingBooking.flightTicketUrl),
      deleteCloudinaryFile(existingBooking.hotelTicketUrl),
      deleteCloudinaryFile(existingBooking.depositReceiptUrl),
    ]);

    await Booking.findByIdAndDelete(id);

    return NextResponse.json(
      { status: "success", message: "Booking successfully deleted" },
      { status: 200 },
    );
  } catch (error) {
    console.error("DELETE /api/bookings/[id] error:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Deletion failed",
        error: "Failed to delete booking",
      },
      { status: 500 },
    );
  }
}
