import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/backend/config/db";
import Media from "@/app/backend/models/media.model";
import { verifyAuth } from "@/lib/auth";

export async function GET() {
  try {
    await connectDB();

    const media = await Media.find({}).sort({ order: 1, createdAt: -1 });

    return NextResponse.json(
      {
        success: true,
        data: media,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error(" Media GET Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

/** Creates a media item and maintains the single-hero constraint. */
export async function POST(request: NextRequest) {
  try {
    const auth = await verifyAuth(request);
    if (!auth) {
      return NextResponse.json(
        { status: "error", message: "Unauthorized" },
        { status: 401 },
      );
    }
    await connectDB();
    const body = await request.json();

    // If this is a hero video, ensure only one exists
    if (body.isHero) {
      await Media.updateMany({ isHero: true }, { isHero: false });
    }

    const newMedia = await Media.create(body);

    return NextResponse.json(
      {
        status: "success",
        message: "Media created successfully",
        data: newMedia,
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error(" Media POST Error:", error);
    return NextResponse.json(
      {
        status: "error",
        message: error?.message || "Failed to create media",
      },
      { status: 500 },
    );
  }
}
