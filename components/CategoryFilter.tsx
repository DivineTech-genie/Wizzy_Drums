// app/gallery/components/CategoryFilter.tsx
"use client";

import { categories } from "@/lib/gallery-data";
import { cn } from "@/lib/utils";

interface CategoryFilterProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export function CategoryFilter({
  activeCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          className={cn(
            "px-4 py-2 text-sm font-medium rounded-full border transition-all duration-200",
            activeCategory === category.id
              ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20"
              : "bg-background text-foreground/70 border-border hover:border-primary hover:text-foreground",
          )}
        >
          {category.label}
        </button>
      ))}
    </div>
  );
}
