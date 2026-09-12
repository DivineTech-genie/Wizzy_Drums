// app/admin/settings/types/index.ts
import { z } from "zod";

export const siteSettingsSchema = z.object({
  // Site info
  siteName: z.string().min(1, "Site name is required"),
  tagline: z.string().optional().default(""),
  logoUrl: z.string().optional().default(""),

  // Bank details
  bankDetails: z.object({
    accountName: z.string().min(1, "Account name is required"),
    bankName: z.string().min(1, "Bank name is required"),
    accountNumber: z
      .string()
      .min(10, "Account number must be at least 10 digits"),
    sortCode: z.string().optional().default(""),
  }),

  // Contact details
  contactDetails: z.object({
    email: z.string().email("Invalid email"),
    phone: z.string().min(5, "Phone is required"),
    location: z.string().min(2, "Location is required"),
    address: z.string().optional().default(""),
  }),

  // Social links
  socials: z.object({
    instagram: z.string().optional().default(""),
    twitter: z.string().optional().default(""),
    youtube: z.string().optional().default(""),
    facebook: z.string().optional().default(""),
  }),

  // Preferences
  emailNotifications: z.boolean().default(true),
  pushNotifications: z.boolean().default(true),
  darkMode: z.boolean().default(false),
  twoFactorEnabled: z.boolean().default(false),
});

export type SiteSettings = z.infer<typeof siteSettingsSchema>;

export const DEFAULT_SETTINGS: SiteSettings = {
  siteName: "StageBook",
  tagline: "Professional Event Entertainment",
  logoUrl: "",
  bankDetails: {
    accountName: "The Booking Co",
    bankName: "Zenith Bank",
    accountNumber: "0123456789",
    sortCode: "",
  },
  contactDetails: {
    email: "hello@stagebook.com",
    phone: "+234 800 000 0000",
    location: "Lagos, Nigeria",
    address: "",
  },
  socials: {
    instagram: "",
    twitter: "",
    youtube: "",
    facebook: "",
  },
  emailNotifications: true,
  pushNotifications: true,
  darkMode: false,
  twoFactorEnabled: false,
};
