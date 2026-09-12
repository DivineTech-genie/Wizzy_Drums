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
      return NextResponse.json({
        status: "error",
        errors: validationResult.error.flatten().fieldErrors,
        statusCode: 400,
      });
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      id,
      { status: validationResult.data.status },
      { new: true, runValidators: true },
    );
    if (!updatedBooking) {
      return NextResponse.json({
        status: "error",
        message: "No booking found with that ID",
        statusCode: 404,
      });
    }

    return NextResponse.json({
      status: "success",
      data: updatedBooking,
      statusCode: 200,
    });
  } catch (error) {
    return NextResponse.json({
      status: "error",
      message: "Update failed.",
      error: error instanceof Error ? error.message : String(error),
      statusCode: 500,
    });
  }
}

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

    await Promise.all([
      deleteCloudinaryFile(existingBooking.flightTicketUrl),
      deleteCloudinaryFile(existingBooking.hotelTicketUrl),
      deleteCloudinaryFile(existingBooking.depositReceiptUrl),
    ]);

    const deletedBooking = await Booking.findByIdAndDelete(id);

    if (!deletedBooking) {
      return NextResponse.json(
        { status: "error", message: "No booking found with that ID to delete" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { status: "success", message: "Booking successfully deleted" },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: "Deletion failed", error: error.message },
      { status: 500 },
    );
  }
}
