// app/admin/media/page.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MediaHeader } from "./MediaHeader";
import { MediaSearch } from "./MediaSearch";
import { MediaTabs } from "./MediaTabs";
import { MediaGrid } from "./MediaGrid";
import { MediaDialog } from "./MediaDialog";
import { useMedia } from "@/hooks/admin/useAdminMedia";
import {
  mediaSchema,
  MediaFormData,
  MediaItem,
} from "@/app/backend/validators/media";

export default function MediaPage() {
  const [category, setCategory] = useState("photos");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MediaItem | null>(null);

  const {
    filteredMedia,
    loading,
    search,
    setSearch,
    createMedia,
    updateMedia,
    deleteMedia,
    toggleHero,
    reorderMedia,
  } = useMedia(category);

  const form = useForm<MediaFormData>({
    resolver: zodResolver(mediaSchema),
    defaultValues: {
      type: "image",
      src: "",
      // thumbnail: "",
      title: "",
      description: "",
      category: "photos",
      date: "",
      width: 1200,
      height: 800,
      isHero: false,
      order: 0,
    },
  });

  const { reset, setValue } = form;

  const handleOpenCreate = () => {
    setEditingItem(null);
    reset({
      type: "image",
      src: "",
      // thumbnail: "",
      title: "",
      description: "",
      category: category as any,
      date: "",
      width: 1200,
      height: 800,
      isHero: false,
      order: 0,
    });
    setDialogOpen(true);
  };

  const handleOpenEdit = (item: MediaItem) => {
    setEditingItem(item);
    setValue("type", item.type);
    setValue("src", item.src);
    // setValue("thumbnail", item.thumbnail || "");
    setValue("title", item.title);
    setValue("description", item.description || "");
    setValue("category", item.category);
    setValue("date", item.date || "");
    setValue("width", item.width || 1200);
    setValue("height", item.height || 800);
    setValue("isHero", item.isHero);
    setValue("order", item.order || 0);
    setDialogOpen(true);
  };

  const handleSubmit = async (data: MediaFormData) => {
    if (editingItem) {
      const result = await updateMedia(editingItem._id, data);
      if (result.success) {
        setDialogOpen(false);
        setEditingItem(null);
        reset();
      }
    } else {
      const result = await createMedia(data);

      if (result.success) {
        setDialogOpen(false);
        reset();
      }
    }
  };

  const handleDelete = async (id: string) => {
    await deleteMedia(id);
  };

  const handleToggleHero = async (id: string, currentHero: boolean) => {
    await toggleHero(id, currentHero);
  };

  const handleReorder = async (id: string, direction: "up" | "down") => {
    await reorderMedia(id, direction);
  };

  return (
    <div className="space-y-6">
      <MediaHeader onAddClick={handleOpenCreate} />
      <MediaSearch value={search} onChange={setSearch} />
      <MediaTabs value={category} onValueChange={setCategory} />
      <MediaGrid
        media={filteredMedia}
        loading={loading}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
        onToggleHero={handleToggleHero}
        onReorder={handleReorder}
      />
      <MediaDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        isEditing={!!editingItem}
        form={form}
        onSubmit={handleSubmit}
        isSubmitting={form.formState.isSubmitting}
      />
    </div>
  );
}
