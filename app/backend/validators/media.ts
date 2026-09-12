import { z } from "zod";

export const mediaSchema = z.object({
  type: z.enum(["image", "video"]),
  src: z.string().url("Valid URL required"),
  thumbnail: z.string().url().optional().default(""),
  title: z.string().min(1, "Title required"),
  description: z.string().optional().default(""),
  category: z.enum(["photos", "videos", "reels", "behind-the-scenes", "hero"]),
  date: z.string().optional().default(""),
  width: z.coerce.number().default(1200),
  height: z.coerce.number().default(800),
  isHero: z.boolean().default(false),
  order: z.coerce.number().default(0),
});

export type MediaFormData = z.infer<typeof mediaSchema>;

export interface MediaItem extends MediaFormData {
  _id: string;
  createdAt?: string;
  updatedAt?: string;
}

export const categoryLabels: Record<string, string> = {
  photos: "Photos",
  videos: "Videos",
  reels: "Reels",
  "behind-the-scenes": "Behind the Scenes",
  hero: "Hero",
};
