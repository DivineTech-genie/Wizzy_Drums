// lib/cloudinary.ts
import { v2 as cloudinary } from "cloudinary";

const cloudName =
  process.env.CLOUDINARY_CLOUD_NAME ||
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (!cloudName || !apiKey || !apiSecret) {
  throw new Error(
    "Missing Cloudinary environment variables. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to your .env.local file.",
  );
}

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true,
});

export const getCloudinaryPublicId = (url?: string | null): string | null => {
  if (!url) return null;

  try {
    const parsed = new URL(url);
    const pathname = decodeURIComponent(parsed.pathname);
    const match = pathname.match(
      /\/upload\/(?:v\d+\/)?(.+?)(?:\.[A-Za-z0-9]+)?$/,
    );
    return match?.[1] ?? null;
  } catch {
    return null;
  }
};

export const deleteCloudinaryFile = async (
  url?: string | null,
): Promise<boolean> => {
  if (!url) return true;

  const publicId = getCloudinaryPublicId(url);
  if (!publicId) return false;

  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      invalidate: true,
    });
    return result?.result === "ok" || result?.result === "not found";
  } catch {
    return false;
  }
};

export { cloudinary };
