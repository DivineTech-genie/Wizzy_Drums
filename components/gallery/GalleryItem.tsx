// app/gallery/components/GalleryItem.tsx
"use client";

import { motion } from "framer-motion";
import { Play, Maximize2, Calendar } from "lucide-react";
import { GalleryItem as GalleryItemType } from "@/lib/gallery-data";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import Image from "next/image";

interface GalleryItemProps {
  item: GalleryItemType;
  onClick: () => void;
  className?: string;
}

export function GalleryItem({ item, onClick, className }: GalleryItemProps) {
  const isVideo = item.type === "video";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true }}
      className={cn(
        "group relative rounded-lg overflow-hidden cursor-pointer bg-muted",
        className,
      )}
      onClick={onClick}
    >
      {/* Image/Thumbnail */}
      <div className="relative aspect-4/3 overflow-hidden">
        <Image
          src={isVideo ? item.thumbnail || item.src : item.src}
          alt={item.title}
          width={100}
          height={100}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Video Play Button Overlay */}
        {isVideo && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Play className="h-6 w-6 text-foreground ml-1" />
            </div>
          </div>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
          <h3 className="text-white font-semibold text-sm line-clamp-1">
            {item.title}
          </h3>
          {item.description && (
            <p className="text-white/80 text-xs line-clamp-2 mt-1">
              {item.description}
            </p>
          )}
          <div className="flex items-center gap-4 mt-2 text-white/60 text-xs">
            {item.date && (
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {format(new Date(item.date), "dd MMM yyyy")}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Maximize2 className="h-3 w-3" />
              View
            </span>
          </div>
        </div>

        {/* Category Badge */}
        <div className="absolute top-3 right-3">
          <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-black/50 text-white backdrop-blur-sm capitalize">
            {item.category.replace("-", " ")}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
