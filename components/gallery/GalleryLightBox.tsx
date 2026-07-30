// app/gallery/components/GalleryLightbox.tsx
"use client";

import { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import Image from "next/image";
import { VideoEmbed } from "../VideoEmbed";
import { GalleryItem } from "@/lib/gallery-data";

interface GalleryLightboxProps {
  open: boolean;
  onClose: () => void;
  items: GalleryItem[];
  currentIndex: number;
}

export function GalleryLightbox({
  open,
  onClose,
  items,
  currentIndex,
}: GalleryLightboxProps) {
  const [index, setIndex] = useState(currentIndex);

  useEffect(() => {
    setIndex(currentIndex);
  }, [currentIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goToPrev();
      if (e.key === "ArrowRight") goToNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, index]);

  if (!open || items.length === 0) return null;

  const currentItem = items[index];

  const goToPrev = () => {
    setIndex((prev) => (prev > 0 ? prev - 1 : items.length - 1));
  };

  const goToNext = () => {
    setIndex((prev) => (prev < items.length - 1 ? prev + 1 : 0));
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-white/70 hover:text-white transition-colors z-10"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Navigation */}
        {items.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToPrev();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 text-white/70 hover:text-white transition-colors"
            >
              <ChevronLeft className="h-8 w-8" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-white/70 hover:text-white transition-colors"
            >
              <ChevronRight className="h-8 w-8" />
            </button>
          </>
        )}

        {/* Content */}
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="max-w-5xl w-full max-h-[90vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative flex-1 min-h-0 bg-black/50 rounded-lg overflow-hidden">
            {currentItem.type === "video" ? (
              <VideoEmbed
                src={currentItem.src}
                thumbnail={currentItem.thumbnail}
                title={currentItem.title}
                className="w-full h-full"
              />
            ) : (
              <Image
                src={currentItem.src}
                alt={currentItem.title}
                width={100}
                height={100}
                className="w-full h-full object-contain"
              />
            )}
          </div>

          {/* Info */}
          <div className="mt-4 text-center text-white">
            <h3 className="text-lg font-semibold">{currentItem.title}</h3>
            {currentItem.description && (
              <p className="text-sm text-white/70 mt-1">
                {currentItem.description}
              </p>
            )}
            <div className="mt-2 flex items-center justify-center gap-4 text-xs text-white/50">
              <span className="capitalize">
                {currentItem.category.replace("-", " ")}
              </span>
              <span className="w-1 h-1 rounded-full bg-white/30" />
              <span>
                {index + 1} of {items.length}
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
