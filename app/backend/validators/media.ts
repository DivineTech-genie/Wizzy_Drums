import { z } from "zod";

export const mediaSchema = z.object({
  type: z.enum(["image", "video"]),
  src: z.string().min(1, "Media file is required"),
  thumbnail: z.string().default(""),
  title: z.string().min(1, "Title required"),
  description: z.string().default(""),
  category: z.enum(["photos", "videos", "reels", "behind-the-scenes", "hero"]),
  date: z.string().default(""),
  width: z.number().default(1200),
  height: z.number().default(800),
  isHero: z.boolean().default(false),
  order: z.number().default(0),
});

export type MediaFormData = z.input<typeof mediaSchema>;

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
