"use client";

import { MediaItem } from "@/app/backend/validators/media";
import { MediaCard } from "./MediaCard";
import { MediaEmptyState } from "./MediaEmptyState";

interface MediaGridProps {
  media: MediaItem[];
  loading: boolean;
  onEdit: (item: MediaItem) => void;
  onDelete: (id: string) => void;
  onToggleHero: (id: string, currentHero: boolean) => void;
  onReorder: (id: string, direction: "up" | "down") => void;
}

export function MediaGrid({
  media,
  loading,
  onEdit,
  onDelete,
  onToggleHero,
  onReorder,
}: MediaGridProps) {
  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (media.length === 0) {
    return <MediaEmptyState />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {media.map((item, index) => (
        <MediaCard
          key={item._id}
          item={item}
          isFirst={index === 0}
          isLast={index === media.length - 1}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleHero={onToggleHero}
          onReorder={onReorder}
        />
      ))}
    </div>
  );
}
