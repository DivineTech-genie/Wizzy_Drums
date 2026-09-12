import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/backend/config/db";
import { verifyAuth } from "@/lib/auth";
import Notification from "@/app/backend/models/notification";

// GET notifications
export async function GET(req: NextRequest) {
  try {
    const auth = await verifyAuth(req);
    if (!auth) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const searchParams = req.nextUrl.searchParams;
    const unreadOnly = searchParams.get("unread") === "true";

    const query: any = { userId: "admin" };
    if (unreadOnly) query.read = false;

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(50);

    const unreadCount = await Notification.countDocuments({
      userId: "admin",
      read: false,
    });

    return NextResponse.json({
      status: "success",
      data: notifications,
      unreadCount,
    });
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: "Failed to fetch notifications" },
      { status: 500 },
    );
  }
}

// POST create notification (for system events)
export async function POST(req: NextRequest) {
  try {
    const auth = await verifyAuth(req);
    if (!auth) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { title, message, type, link } = await req.json();

    const notification = await Notification.create({
      userId: "admin",
      title,
      message,
      type: type || "system",
      link: link || "",
    });

    return NextResponse.json(
      { status: "success", data: notification },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: "Failed to create notification" },
      { status: 500 },
    );
  }
}
