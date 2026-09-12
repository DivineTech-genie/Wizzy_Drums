// app/gallery/data/gallery-data.ts

export interface GalleryItem {
  id: string;
  type: "image" | "video";
  src: string;
  thumbnail?: string; // For videos
  title: string;
  description?: string;
  category: "photos" | "videos" | "reels" | "behind-the-scenes";
  date?: string;
  width?: number;
  height?: number;
}

export const galleryData: GalleryItem[] = [
  // ===== PHOTOS =====
  {
    id: "1",
    type: "image",
    src: "/images/gallery/performance-1.jpeg",
    title: "Lagos Festival Main Stage",
    description:
      "Headlining performance at the Lagos International Festival 2024.",
    category: "photos",
    date: "2024-12-15",
    width: 1200,
    height: 800,
  },
  {
    id: "2",
    type: "image",
    src: "/images/gallery/performance-2.jpeg",
    title: "Corporate Gala Night",
    description: "Performing at the Annual Corporate Excellence Awards.",
    category: "photos",
    date: "2024-11-20",
    width: 800,
    height: 1200,
  },
  {
    id: "3",
    type: "image",
    src: "/images/gallery/performance-3.jpeg",
    title: "Wedding Reception",
    description: "Intimate performance at a luxury wedding in Abuja.",
    category: "photos",
    date: "2024-10-05",
    width: 1200,
    height: 800,
  },
  {
    id: "4",
    type: "image",
    src: "/images/gallery/performance-4.jpeg",
    title: "Nightclub Experience",
    description: "High-energy set at Club 57, Lagos.",
    category: "photos",
    date: "2024-09-12",
    width: 800,
    height: 800,
  },

  // ===== VIDEOS =====
  {
    id: "7",
    type: "video",
    src: "/video/wizzy-1.mp4",
    thumbnail: "/images/gallery/performance-2.jpeg",
    title: "Behind the Scenes: Festival Prep",
    description: "A day in the life before a major festival show.",
    category: "behind-the-scenes",
    date: "2024-11-10",
  },
  {
    id: "8",
    type: "video",
    src: "/video/wizzy-5.mp4",
    thumbnail: "/images/gallery/performance-3.jpeg",
    title: "Live Performance Reel 2024",
    description: "Highlights from performances across Nigeria.",
    category: "videos",
    date: "2024-12-01",
  },
  {
    id: "9",
    type: "video",
    src: "/video/wizzy-3.mp4",
    thumbnail: "/images/gallery/performance-1.jpeg",
    title: "Short Reel - Energy on Stage",
    description: "60 seconds of pure performance energy.",
    category: "reels",
    date: "2024-10-20",
  },
];

// Category labels for filter
export const categories = [
  { id: "all", label: "All" },
  { id: "photos", label: "Photos" },
  { id: "videos", label: "Videos" },
  { id: "reels", label: "Reels" },
  { id: "behind-the-scenes", label: "Behind the Scenes" },
];
