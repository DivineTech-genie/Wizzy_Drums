import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/backend/config/db";
import { verifyAuth } from "@/lib/auth";
import Notification from "@/app/backend/models/notification";

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

    const notification = await Notification.findByIdAndUpdate(
      id,
      { read: true },
      { new: true },
    );

    if (!notification) {
      return NextResponse.json(
        { status: "error", message: "Notification not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ status: "success", data: notification });
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: "Failed to update notification" },
      { status: 500 },
    );
  }
}

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

    await Notification.findByIdAndDelete(id);

    return NextResponse.json({
      status: "success",
      message: "Notification deleted",
    });
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: "Failed to delete notification" },
      { status: 500 },
    );
  }
}
