// app/gallery/components/GalleryGrid.tsx
"use client";

import { useState, useMemo } from "react";
import { GalleryLightbox } from "./GalleryLightBox";

import {
  GalleryItem as GalleryItemType,
  galleryData,
} from "@/lib/gallery-data";
import { GalleryItem } from "./GalleryItem";
import { CategoryFilter } from "../CategoryFilter";

export function GalleryGrid() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedItem, setSelectedItem] = useState<GalleryItemType | null>(
    null,
  );
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const filteredItems = useMemo(() => {
    if (activeCategory === "all") return galleryData;
    return galleryData.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  const handleItemClick = (item: GalleryItemType) => {
    setSelectedItem(item);
    setLightboxOpen(true);
  };

  const handleLightboxClose = () => {
    setLightboxOpen(false);
    setSelectedItem(null);
  };

  // Get all items for lightbox navigation
  const allItems = filteredItems;

  return (
    <>
      <div className="space-y-8">
        <CategoryFilter
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-auto">
          {filteredItems.map((item) => (
            <GalleryItem
              key={item.id}
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
        open={lightboxOpen}
        onClose={handleLightboxClose}
        items={allItems}
        currentIndex={allItems.findIndex(
          (item) => item.id === selectedItem?.id,
        )}
      />
    </>
  );
}
