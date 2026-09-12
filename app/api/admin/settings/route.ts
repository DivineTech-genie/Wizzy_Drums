import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/backend/config/db";
import { verifyAuth } from "@/lib/auth";
import Setting from "@/app/backend/models/settings.model";
import {
  DEFAULT_SETTINGS,
  siteSettingsSchema,
} from "@/app/backend/validators/settings";

type SettingsRecord = Partial<Record<string, unknown>>;

const mergeSettings = (raw: SettingsRecord = {}) => ({
  ...DEFAULT_SETTINGS,
  ...raw,
  bankDetails: {
    ...DEFAULT_SETTINGS.bankDetails,
    ...(typeof raw.bankDetails === "object" && raw.bankDetails
      ? (raw.bankDetails as Record<string, unknown>)
      : {}),
  },
  contactDetails: {
    ...DEFAULT_SETTINGS.contactDetails,
    ...(typeof raw.contactDetails === "object" && raw.contactDetails
      ? (raw.contactDetails as Record<string, unknown>)
      : {}),
  },
  socials: {
    ...DEFAULT_SETTINGS.socials,
    ...(typeof raw.socials === "object" && raw.socials
      ? (raw.socials as Record<string, unknown>)
      : {}),
  },
});

// GET all settings
export async function GET() {
  try {
    await connectDB();
    const settings = await Setting.find({});
    const data: Record<string, unknown> = {};
    settings.forEach((s) => (data[s.key] = s.value));
    return NextResponse.json({ status: "success", data: mergeSettings(data) });
  } catch {
    return NextResponse.json(
      { status: "error", message: "Failed to fetch settings" },
      { status: 500 },
    );
  }
}

// POST/PUT update settings
export async function PUT(req: NextRequest) {
  try {
    const auth = await verifyAuth(req);
    if (!auth) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const payload = await req.json();
    const settings = siteSettingsSchema.partial().parse(payload);
    const normalized = mergeSettings(settings);

    const operations = Object.entries(normalized).map(([key, value]) =>
      Setting.findOneAndUpdate(
        { key },
        { key, value },
        { upsert: true, new: true },
      ),
    );

    await Promise.all(operations);

    return NextResponse.json({
      status: "success",
      message: "Settings updated",
      data: normalized,
    });
  } catch {
    return NextResponse.json(
      { status: "error", message: "Failed to update settings" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  return PUT(req);
}
