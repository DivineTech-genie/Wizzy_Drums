// app/api/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cloudinary } from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  try {
    // Get the uploaded file from the form data
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type (allow images and PDFs)
    const validTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "application/pdf",
    ];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error:
            "Invalid file type. Only JPEG, PNG, WebP, and PDF are allowed.",
        },
        { status: 400 },
      );
    }

    // Validate file size (limit to 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File size exceeds 5MB limit." },
        { status: 400 },
      );
    }

    // Convert the file to a buffer for Cloudinary upload
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: process.env.CLOUDINARY_UPLOAD_FOLDER || "bookings",
          resource_type: "auto", // Let Cloudinary detect the type
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        },
      );
      // Write the buffer to the upload stream
      uploadStream.end(buffer);
    });

    // Type assertion – we know the result has secure_url
    const secureUrl = (result as any).secure_url as string;

    return NextResponse.json(
      { secure_url: secureUrl, message: "Upload successful" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// Optionally, limit the API to only handle POST requests
export const config = {
  api: {
    bodyParser: false, // Disable Next.js body parsing so we can handle FormData ourselves
  },
};
