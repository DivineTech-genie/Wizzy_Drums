"use client";

import Image from "next/image";
import { Image as ImageIcon } from "lucide-react";

interface EventImageProps {
  src?: string;
  alt?: string;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: "w-10 h-10",
  md: "w-16 h-16",
  lg: "w-24 h-24",
};

export function EventImage({
  src,
  alt = "Event",
  size = "sm",
}: EventImageProps) {
  const containerSize = sizeMap[size];

  if (src) {
    return (
      <div
        className={`${containerSize} rounded bg-muted overflow-hidden shrink-0`}
      >
        <Image
          src={src}
          alt={alt}
          width={size === "sm" ? 40 : size === "md" ? 64 : 96}
          height={size === "sm" ? 40 : size === "md" ? 64 : 96}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={`${containerSize} rounded bg-muted/50 flex items-center justify-center shrink-0`}
    >
      <ImageIcon className="h-1/2 w-1/2 text-muted-foreground" />
    </div>
  );
}
