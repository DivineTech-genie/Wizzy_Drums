import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/backend/config/db";
import Media from "@/app/backend/models/media.model";
import { verifyAuth } from "@/lib/auth";
import { deleteCloudinaryFile } from "@/lib/cloudinary";

// GET single item
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const { id } = await params;
    const media = await Media.findById(id);

    if (!media) {
      return NextResponse.json({ error: "Media not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: media }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// UPDATE media
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

    const body = await req.json();

    // If setting as hero, unset other hero items
    if (body.isHero) {
      await Media.updateMany(
        { isHero: true, _id: { $ne: id } },
        { isHero: false },
      );
    }

    const existing = await Media.findById(id);
    if (!existing) {
      return NextResponse.json(
        { status: "error", message: "Media not found" },
        { status: 404 },
      );
    }

    if (body.src && body.src !== existing.src) {
      await deleteCloudinaryFile(existing.src);
      if (existing.thumbnail) {
        await deleteCloudinaryFile(existing.thumbnail);
      }
    }

    const updated = await Media.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return NextResponse.json(
        { status: "error", message: "Media not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        status: "success",
        message: "Media updated successfully",
        data: updated,
      },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE media
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

    const existing = await Media.findById(id);
    if (!existing) {
      return NextResponse.json(
        { status: "error", message: "Media not found" },
        { status: 404 },
      );
    }

    await deleteCloudinaryFile(existing.src);
    if (existing.thumbnail) {
      await deleteCloudinaryFile(existing.thumbnail);
    }

    const deleted = await Media.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { status: "error", message: "Media not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { status: "success", message: "Media deleted successfully" },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
