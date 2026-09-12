// app/gallery/components/GalleryGrid.tsx
"use client";

import { useState, useMemo } from "react";
import { GalleryLightbox } from "./GalleryLightBox";
import { GalleryItem } from "./GalleryItem";
import { CategoryFilter } from "../CategoryFilter";
import { useMedia } from "@/hooks/useMedia";
import { IMedia } from "@/app/backend/models/media.model";

export function GalleryGrid() {
  const { isLoading, error, getMediaByCategory, getCategories } = useMedia();
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedItem, setSelectedItem] = useState<IMedia | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const categories = useMemo(() => {
    const cats = getCategories();
    return [
      { id: "all", label: "All" },
      ...cats.map((c) => ({ id: c, label: c.replace("-", " ") })),
    ];
  }, [getCategories]);

  const filteredItems = useMemo(() => {
    return getMediaByCategory(activeCategory);
  }, [activeCategory, getMediaByCategory]);

  const handleItemClick = (item: IMedia) => {
    setSelectedItem(item);
    setLightboxOpen(true);
  };

  const handleLightboxClose = () => {
    setLightboxOpen(false);
    setSelectedItem(null);
  };

  const allItems = filteredItems;

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex justify-center gap-2">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-10 w-20 bg-muted rounded-full animate-pulse"
            />
          ))}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-fr">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="aspect-square bg-muted rounded-2xl animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-500">
        Failed to load gallery. Please refresh.
      </div>
    );
  }

  return (
    <>
      <div className="space-y-8">
        <CategoryFilter
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-fr">
          {filteredItems.map((item) => (
            <GalleryItem
              key={String(item._id)}
              item={item}
              onClick={() => handleItemClick(item)}
              className={item.type === "video" ? "md:col-span-1" : ""}
            />
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No items in this category yet.
          </div>
        )}
      </div>

      <GalleryLightbox
        key={
          selectedItem ? String(selectedItem._id) : "gallery-lightbox-closed"
        }
        open={lightboxOpen}
        onClose={handleLightboxClose}
        items={allItems}
        currentIndex={
          selectedItem
            ? allItems.findIndex((item) => item._id === selectedItem._id)
            : 0
        }
      />
    </>
  );
}
