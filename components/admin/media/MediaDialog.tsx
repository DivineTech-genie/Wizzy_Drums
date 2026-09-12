// app/admin/media/components/MediaDialog.tsx
"use client";

import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Image as ImageIcon, Upload, Loader2, X } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { uploadFileToCloudinary } from "@/lib/upload-file";
import { MediaFormData } from "@/app/backend/validators/media";

interface MediaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEditing: boolean;
  form: UseFormReturn<MediaFormData>;
  onSubmit: (data: MediaFormData) => Promise<void>;
  isSubmitting: boolean;
}

export function MediaDialog({
  open,
  onOpenChange,
  isEditing,
  form,
  onSubmit,
  isSubmitting,
}: MediaDialogProps) {
  const { register, handleSubmit, setValue, watch, formState } = form;
  const { errors } = formState;

  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    watch("src") || null,
  );

  const watchType = watch("type");
  const watchIsHero = watch("isHero");

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "video/mp4",
      "video/quicktime",
    ];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a valid image or video file");
      e.target.value = "";
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File must be under 10MB");
      e.target.value = "";
      return;
    }

    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);

    setUploading(true);
    try {
      const url = await uploadFileToCloudinary(file);
      setValue("src", url);
      setPreviewUrl(url);
      toast.success("File uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload file");
      setPreviewUrl(null);
      setValue("src", "");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const removeFile = () => {
    setValue("src", "");
    setPreviewUrl(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Media" : "Add Media"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Type + Category */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Type</Label>
              <Select
                value={watchType}
                onValueChange={(val) =>
                  setValue("type", (val ?? "image") as "image" | "video")
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="image">Image</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={watch("category")}
                onValueChange={(val) => setValue("category", val as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="photos">Photos</SelectItem>
                  <SelectItem value="videos">Videos</SelectItem>
                  <SelectItem value="reels">Reels</SelectItem>
                  <SelectItem value="behind-the-scenes">
                    Behind the Scenes
                  </SelectItem>
                  <SelectItem value="hero">Hero</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              {...register("title")}
              className={errors.title ? "border-destructive" : ""}
            />
            {errors.title && (
              <p className="text-xs text-destructive">{errors.title.message}</p>
            )}
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <Label>Media File</Label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-lg border bg-muted/30 overflow-hidden shrink-0 flex items-center justify-center">
                {previewUrl ? (
                  <div className="relative w-full h-full">
                    {watchType === "image" ? (
                      <Image
                        src={previewUrl}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <video
                        src={previewUrl}
                        className="w-full h-full object-cover"
                      />
                    )}
                    <button
                      type="button"
                      onClick={removeFile}
                      className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <ImageIcon className="h-6 w-6 text-muted-foreground" />
                )}
              </div>

              <div className="flex-1">
                <label
                  htmlFor="media-upload"
                  className={`
                    flex items-center justify-center gap-2 px-4 py-2
                    border-2 border-dashed rounded-lg cursor-pointer
                    hover:bg-muted/50 transition-colors
                    ${uploading ? "opacity-50 pointer-events-none" : ""}
                  `}
                >
                  {uploading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      {previewUrl ? "Change File" : "Upload File"}
                    </>
                  )}
                </label>
                <input
                  id="media-upload"
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="hidden"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Images or videos — max 10MB
                </p>
              </div>
            </div>
            <input type="hidden" {...register("src")} />
          </div>

          {/* Thumbnail (for videos) */}
          {/* {watchType === "video" && (
            <div className="space-y-2">
              <Label>Thumbnail URL (optional)</Label>
              <Input {...register("thumbnail")} placeholder="https://..." />
              <p className="text-xs text-muted-foreground">
                Preview image for video
              </p>
            </div>
          )} */}

          {/* Description */}
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              {...register("description")}
              rows={2}
              placeholder="Description..."
            />
          </div>

          {/* Date + Order */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date (optional)</Label>
              <Input {...register("date")} type="date" />
            </div>
            <div className="space-y-2">
              <Label>Order</Label>
              <Input {...register("order")} type="number" placeholder="0" />
            </div>
          </div>

          {/* Width + Height */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Width</Label>
              <Input {...register("width")} type="number" placeholder="1200" />
            </div>
            <div className="space-y-2">
              <Label>Height</Label>
              <Input {...register("height")} type="number" placeholder="800" />
            </div>
          </div>

          {/* Hero Switch */}
          <div className="flex items-center gap-2 pt-2">
            <Switch
              checked={watchIsHero}
              onCheckedChange={(checked) => setValue("isHero", checked)}
            />
            <Label>Mark as Hero</Label>
            <p className="text-xs text-muted-foreground ml-auto">
              (Only one can be hero)
            </p>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || uploading}
            className="w-full"
          >
            {isSubmitting
              ? "Saving..."
              : isEditing
                ? "Update Media"
                : "Add Media"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
