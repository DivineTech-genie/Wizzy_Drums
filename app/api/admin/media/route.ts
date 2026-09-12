import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/backend/config/db";
import Media from "@/app/backend/models/media.model";
import { verifyAuth } from "@/lib/auth";
import { mediaSchema } from "@/app/backend/validators/media";

// GET all media
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const searchParams = req.nextUrl.searchParams;
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");

    const query: any = {};
    if (category) query.category = category;
    if (featured === "true") query.featured = true;

    const media = await Media.find(query).sort({ order: 1, createdAt: -1 });
    return NextResponse.json({ status: "success", data: media });
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: "Failed to fetch media" },
      { status: 500 },
    );
  }
}

// POST create new media
export async function POST(req: NextRequest) {
  try {
    const auth = await verifyAuth(req);
    if (!auth) {
      return NextResponse.json(
        { status: "error", message: "Unauthorized" },
        { status: 401 },
      );
    }

    await connectDB();
    const rawData = await req.json();
    const validation = mediaSchema.safeParse(rawData);

    if (!validation.success) {
      return NextResponse.json(
        {
          status: "error",
          message: "Please correct the media form and try again.",
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const media = await Media.create(validation.data);
    return NextResponse.json(
      { status: "success", message: "Media created successfully", data: media },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message:
          error instanceof Error ? error.message : "Failed to create media",
      },
      { status: 500 },
    );
  }
}
