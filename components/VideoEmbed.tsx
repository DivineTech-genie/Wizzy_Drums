// app/gallery/components/VideoEmbed.tsx
"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface VideoEmbedProps {
  src: string;
  thumbnail?: string;
  title: string;
  className?: string;
}

export function VideoEmbed({
  src,
  thumbnail,
  title,
  className,
}: VideoEmbedProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  // Extract YouTube/Vimeo embed URL
  const getEmbedUrl = (url: string) => {
    if (url.includes("youtube.com/watch?v=")) {
      const videoId = url.split("v=")[1]?.split("&")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes("youtu.be/")) {
      const videoId = url.split("youtu.be/")[1]?.split("?")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes("vimeo.com/")) {
      const videoId = url.split("vimeo.com/")[1]?.split("/")[0];
      return `https://player.vimeo.com/video/${videoId}`;
    }
    return url;
  };

  const embedUrl = getEmbedUrl(src);

  if (!isPlaying) {
    return (
      <div
        className={cn(
          "relative aspect-video rounded-lg overflow-hidden cursor-pointer group",
          className,
        )}
        onClick={() => setIsPlaying(true)}
      >
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt={title}
            width={100}
            height={100}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <span className="text-muted-foreground">No preview</span>
          </div>
        )}
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Play className="h-8 w-8 text-foreground ml-1" />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-linear-to-t from-black/60 to-transparent">
          <p className="text-white text-sm font-medium truncate">{title}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("aspect-video rounded-lg overflow-hidden", className)}>
      <iframe
        src={embedUrl}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full"
      />
    </div>
  );
}
