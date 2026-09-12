import { NextRequest, NextResponse } from "next/server";
import { cloudinary } from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "bookings";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type - support images, videos, and PDFs
    const validTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "video/mp4",
      "video/webm",
      "video/quicktime",
      "application/pdf",
    ];

    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error:
            "Invalid file type. Only images, videos, and PDFs are allowed.",
        },
        { status: 400 },
      );
    }

    // Validate file size - 20MB for videos, 5MB for images
    const maxSize = file.type.startsWith("video/")
      ? 20 * 1024 * 1024
      : 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `File size exceeds ${maxSize / (1024 * 1024)}MB limit.` },
        { status: 400 },
      );
    }

    // Convert the file to a buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folder,
          resource_type: "auto",
          // For videos, generate a thumbnail
          eager: file.type.startsWith("video/")
            ? [
                {
                  format: "jpg",
                  transformation: [{ width: 600, crop: "fill" }],
                },
              ]
            : undefined,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        },
      );
      uploadStream.end(buffer);
    });

    const uploadResult = result as {
      secure_url?: string;
      eager?: [{ secure_url: string }];
    };
    const secureUrl = uploadResult?.secure_url;

    // Get thumbnail URL if it's a video
    let thumbnailUrl = undefined;
    if (
      file.type.startsWith("video/") &&
      uploadResult?.eager?.[0]?.secure_url
    ) {
      thumbnailUrl = uploadResult.eager[0].secure_url;
    }

    if (!secureUrl) {
      throw new Error("Cloudinary upload did not return a secure URL.");
    }

    return NextResponse.json(
      {
        secure_url: secureUrl,
        thumbnail_url: thumbnailUrl,
        message: "Upload successful",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Upload error:", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
