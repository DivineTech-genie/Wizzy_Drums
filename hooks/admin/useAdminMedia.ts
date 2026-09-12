// app/admin/media/hooks/useMedia.ts
"use client";

import { MediaItem } from "@/app/backend/validators/media";
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

/** Loads media for a category and exposes administrative mutation helpers. */
export function useMedia(category: string = "photos") {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchMedia = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/media?category=${category}`);
      const data = await res.json();
      setMedia(data.data || []);
    } catch {
      toast.error("Failed to load media");
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  const createMedia = async (data: Omit<MediaItem, "_id">) => {
    try {
      const res = await fetch("/api/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const payload = await res.json();
        toast.success(payload.message || "Media added");
        await fetchMedia();
        return { success: true };
      } else {
        const error = await res.json();
        const message =
          error.message || error.error || "Failed to create media";
        toast.error(message);
        return { success: false, error };
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error creating media";
      toast.error(message);
      return { success: false };
    }
  };

  const updateMedia = async (id: string, data: Partial<MediaItem>) => {
    try {
      const res = await fetch(`/api/media/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const payload = await res.json();
        toast.success(payload.message || "Media updated");
        await fetchMedia();
        return { success: true };
      } else {
        const error = await res.json();
        const message =
          error.message || error.error || "Failed to update media";
        toast.error(message);
        return { success: false, error };
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error updating media";
      toast.error(message);
      return { success: false };
    }
  };

  const deleteMedia = async (id: string) => {
    if (!confirm("Delete this media item?")) {
      toast.info("Media deletion cancelled");
      return { success: false };
    }

    try {
      const res = await fetch(`/api/media/${id}`, { method: "DELETE" });

      if (res.ok) {
        const payload = await res.json();
        toast.success(payload.message || "Media deleted");
        await fetchMedia();
        return { success: true };
      } else {
        const error = await res.json();
        const message =
          error.message || error.error || "Failed to delete media";
        toast.error(message);
        return { success: false };
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to delete media";
      toast.error(message);
      return { success: false };
    }
  };

  const toggleHero = async (id: string, currentHero: boolean) => {
    try {
      const res = await fetch(`/api/media/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isHero: !currentHero }),
      });

      if (res.ok) {
        toast.success(!currentHero ? "Set as hero" : "Removed from hero");
        await fetchMedia();
        return { success: true };
      }
      return { success: false };
    } catch {
      toast.error("Failed to update hero status");
      return { success: false };
    }
  };

  const reorderMedia = async (id: string, direction: "up" | "down") => {
    const currentIndex = media.findIndex((m) => m._id === id);
    if (direction === "up" && currentIndex === 0) return;
    if (direction === "down" && currentIndex === media.length - 1) return;

    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    const newOrder = media[newIndex].order;
    const currentOrder = media[currentIndex].order;

    try {
      await fetch(`/api/media/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: newOrder }),
      });
      await fetch(`/api/media/${media[newIndex]._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: currentOrder }),
      });
      await fetchMedia();
      return { success: true };
    } catch {
      toast.error("Failed to reorder");
      return { success: false };
    }
  };

  const filteredMedia = media.filter((item) => {
    const searchLower = search.toLowerCase();
    return (
      item?.title?.toLowerCase()?.includes(searchLower) ||
      item?.description?.toLowerCase()?.includes(searchLower)
    );
  });

  return {
    media,
    filteredMedia,
    loading,
    search,
    setSearch,
    fetchMedia,
    createMedia,
    updateMedia,
    deleteMedia,
    toggleHero,
    reorderMedia,
  };
}
