"use client";

import { UseFormReturn } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { EventForm } from "./EventForm";
import { EventFormData } from "@/app/backend/validators/events";
import { toast } from "sonner";
import { uploadFileToCloudinary } from "@/lib/upload-file";
import { useState } from "react";

interface EventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEditing: boolean;
  form: UseFormReturn<EventFormData>;
  onSubmit: (data: EventFormData) => void;
  isSubmitting: boolean;
}

/** Provides the event create/edit form with image upload handling. */
export function EventDialog({
  open,
  onOpenChange,
  isEditing,
  form,
  onSubmit,
  isSubmitting,
}: EventDialogProps) {
  const { register, handleSubmit, setValue, watch, formState } = form;
  const { errors } = formState;

  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    watch("src") || null,
  );

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a valid image (JPEG, PNG, WebP, GIF)");
      e.target.value = "";
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be under 2MB");
      e.target.value = "";
      return;
    }

    // Show local preview
    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);

    setUploading(true);
    try {
      const url = await uploadFileToCloudinary(file);
      setValue("src", url);
      setPreviewUrl(url);
      toast.success("Image uploaded successfully");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to upload image";
      toast.error(message);
      setPreviewUrl(null);
      setValue("src", "");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const removeImage = () => {
    setValue("src", "");
    setPreviewUrl(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Event Type" : "New Event Type"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <EventForm
            register={register}
            errors={errors}
            isEditing={isEditing}
            handleFileUpload={handleFileUpload}
            previewUrl={previewUrl}
            removeImage={removeImage}
            uploading={uploading}
          />
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting
              ? "Saving..."
              : isEditing
                ? "Update Event"
                : "Create Event"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
