"use client";

import { UseFormRegister, FieldErrors } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { EventFormData } from "@/app/backend/validators/events";
import Image from "next/image";
import { ImageIcon, Loader2, Upload, X } from "lucide-react";

interface EventFormProps {
  register: UseFormRegister<EventFormData>;
  errors: FieldErrors<EventFormData>;
  isEditing: boolean;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  previewUrl: string | null;
  removeImage: () => void;
  uploading: boolean;
}

export function EventForm({ register, errors, isEditing, handleFileUpload, previewUrl, removeImage, uploading }: EventFormProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="value">Value (Slug)</Label>
        <Input
          id="value"
          {...register("value")}
          placeholder="wedding"
          className={errors.value ? "border-destructive" : ""}
          disabled={isEditing}
        />
        {errors.value && (
          <p className="text-xs text-destructive">{errors.value.message}</p>
        )}
        <p className="text-xs text-muted-foreground">
          Unique identifier used in URLs (lowercase, no spaces)
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="label">Label</Label>
        <Input
          id="label"
          {...register("label")}
          placeholder="Wedding"
          className={errors.label ? "border-destructive" : ""}
        />
        {errors.label && (
          <p className="text-xs text-destructive">{errors.label.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Base Price (₦)</Label>
          <Input
            id="price"
            {...register("price")}
            type="number"
            placeholder="500000"
            className={errors.price ? "border-destructive" : ""}
          />
          {errors.price && (
            <p className="text-xs text-destructive">{errors.price.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="depositRate">Deposit Rate (%)</Label>
          <Input
            id="depositRate"
            {...register("depositRate")}
            type="number"
            placeholder="30"
            className={errors.depositRate ? "border-destructive" : ""}
          />
          {errors.depositRate && (
            <p className="text-xs text-destructive">
              {errors.depositRate.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Image / Icon</Label>
        <div className="flex items-center gap-4">
          {/* Preview */}
          <div className="w-16 h-16 rounded-lg border bg-muted/30 overflow-hidden shrink-0 flex items-center justify-center">
            {previewUrl ? (
              <div className="relative w-full h-full">
                <Image
                  src={previewUrl}
                  alt="Preview"
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ) : (
              <ImageIcon className="h-6 w-6 text-muted-foreground" />
            )}
          </div>

          {/* Upload Button */}
          <div className="flex-1">
            <label
              htmlFor="image-upload"
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
                  {previewUrl ? "Change Image" : "Upload Image"}
                </>
              )}
            </label>
            <input
              id="image-upload"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleFileUpload}
              disabled={uploading}
              className="hidden"
            />
            <p className="text-xs text-muted-foreground mt-1">
              JPEG, PNG, WebP, GIF — max 2MB
            </p>
          </div>
        </div>

        {/* Hidden field for src */}
        <input type="hidden" {...register("src")} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          {...register("description")}
          placeholder="Description..."
          rows={2}
        />
      </div>
    </div>
  );
}
