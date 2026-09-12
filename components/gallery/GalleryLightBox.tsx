// app/gallery/components/GalleryLightbox.tsx
"use client";

import { useCallback, useEffect, useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import Image from "next/image";
import { IMedia } from "@/app/backend/models/media.model";
import { VideoEmbed } from "../VideoEmbed";

interface GalleryLightboxProps {
  open: boolean;
  onClose: () => void;
  items: IMedia[];
  currentIndex: number;
}

export function GalleryLightbox({
  open,
  onClose,
  items,
  currentIndex,
}: GalleryLightboxProps) {
  const safeIndex =
    currentIndex >= 0 && currentIndex < items.length ? currentIndex : 0;

  const [index, setIndex] = useState(() => safeIndex);

  const goToPrev = useCallback(() => {
    setIndex((prev) => (prev > 0 ? prev - 1 : items.length - 1));
  }, [items.length]);

  const goToNext = useCallback(() => {
    setIndex((prev) => (prev < items.length - 1 ? prev + 1 : 0));
  }, [items.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goToPrev();
      if (e.key === "ArrowRight") goToNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose, goToPrev, goToNext]);

  if (!open || items.length === 0) return null;

  const currentItem = items[index] ?? items[0];

  if (!currentItem) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/98 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all duration-200 z-10"
          aria-label="Close gallery"
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
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all duration-200"
              aria-label="Previous item"
            >
              <ChevronLeft className="h-8 w-8" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all duration-200"
              aria-label="Next item"
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
          <div className="relative flex-1 min-h-0 bg-black/40 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
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
                width={currentItem.width ?? 1000}
                height={currentItem.height ?? 1000}
                sizes="1000px"
                className="w-full h-full object-contain object-center"
              />
            )}
          </div>

          {/* Info */}
          <div className="mt-6 text-center text-white">
            <h3 className="text-xl font-semibold">{currentItem.title}</h3>
            {currentItem.description && (
              <p className="text-sm text-white/75 mt-2 max-w-2xl mx-auto">
                {currentItem.description}
              </p>
            )}
            <div className="mt-4 flex items-center justify-center gap-4 text-sm text-white/60">
              <span className="capitalize px-3 py-1 rounded-full bg-white/10">
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
