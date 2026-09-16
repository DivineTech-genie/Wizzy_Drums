import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/backend/config/db";
import Booking from "@/app/backend/models/booking.model";
import { verifyAuth } from "@/lib/auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const token = req.cookies.get("admin_token")?.value;
    const auth = await verifyAuth(req);
    if (!auth) {
      return NextResponse.json(
        {
          message: token
            ? "Unauthorized: invalid token"
            : "Unauthorized: missing admin_token",
        },
        { status: 401 },
      );
    }

    await connectDB();

    const { id } = await params;
    const body = await req.json();

    const update: any = {};
    if (typeof body.logisticsVerified === "boolean") {
      update.logisticsVerified = body.logisticsVerified;
    }
    if (typeof body.adminNote === "string") {
      update.adminNote = body.adminNote;
    }
    if (typeof body.status === "string") {
      update.status = body.status;
    }

    if (Object.keys(update).length === 0) {
      return NextResponse.json(
        { status: "error", message: "No updatable fields provided" },
        { status: 400 },
      );
    }

    const updated = await Booking.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return NextResponse.json(
        { status: "error", message: "Booking not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { status: "success", data: updated },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: error?.message || "Update failed" },
      { status: 500 },
    );
  }
}

export async function DELETE() {
  return NextResponse.json({ message: "Not implemented" }, { status: 405 });
}
