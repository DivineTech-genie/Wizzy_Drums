"use client";

import { motion } from "framer-motion";
import { Play, Maximize2, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import Image from "next/image";
import { IMedia } from "@/app/backend/models/media.model";

interface GalleryItemProps {
  item: IMedia;
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
        "group relative rounded-2xl overflow-hidden cursor-pointer bg-background border border-border shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl",
        className,
      )}
      onClick={onClick}
    >
      {/* Image/Thumbnail */}
      <div className="relative aspect-4/3 overflow-hidden bg-muted">
        {isVideo ? (
          <video
            src={item.src}
            className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          />
        ) : (
          <Image
            src={item.src}
            alt={item.title}
            width={item.width ?? 1000}
            height={item.height ?? 1000}
            sizes="(min-width:1024px) 25vw, (min-width:768px) 33vw, 50vw"
            className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
        )}

        {/* Video Play Button Overlay */}
        {isVideo && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-white/95 flex items-center justify-center group-hover:scale-125 group-hover:bg-white transition-all shadow-lg">
              <Play className="h-7 w-7 text-foreground ml-1" />
            </div>
          </div>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
          <h3 className="text-white font-semibold text-sm line-clamp-1">
            {item.title}
          </h3>
          {item.description && (
            <p className="text-white/85 text-xs line-clamp-2 mt-1">
              {item.description}
            </p>
          )}
          <div className="flex items-center gap-4 mt-2 text-white/70 text-xs">
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
        <div className="absolute top-3 right-3 z-10">
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-primary text-primary-foreground shadow-md capitalize">
            {item.category.replace("-", " ")}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
