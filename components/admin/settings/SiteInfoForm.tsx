"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, Upload, Loader2, X } from "lucide-react";
import { uploadFileToCloudinary } from "@/lib/upload-file";
import Image from "next/image";

interface SiteInfoFormProps {
  initialData: {
    siteName: string;
    tagline: string;
    logoUrl: string;
  };
  onSave: (data: {
    siteName: string;
    tagline: string;
    logoUrl: string;
  }) => Promise<{ success: boolean }>;
  saving: boolean;
}

export function SiteInfoForm({
  initialData,
  onSave,
  saving,
}: SiteInfoFormProps) {
  const [data, setData] = useState(initialData);
  const [uploading, setUploading] = useState(false);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image");
      return;
    }

    setUploading(true);
    try {
      const url = await uploadFileToCloudinary(file);
      setData({ ...data, logoUrl: url });
      toast.success("Logo uploaded");
    } catch {
      toast.error("Failed to upload logo");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Site Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Logo */}
        <div className="space-y-2">
          <Label>Logo</Label>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-lg border bg-muted/30 flex items-center justify-center overflow-hidden shrink-0">
              {data.logoUrl ? (
                <div className="relative w-full h-full">
                  <Image
                    src={data.logoUrl}
                    alt="Logo"
                    fill
                    className="object-contain"
                  />
                  <button
                    type="button"
                    onClick={() => setData({ ...data, logoUrl: "" })}
                    className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <Upload className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
            <label
              htmlFor="logo-upload"
              className={`flex items-center gap-2 px-3 py-2 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 text-sm ${
                uploading ? "opacity-50 pointer-events-none" : ""
              }`}
            >
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />{" "}
                  {data.logoUrl ? "Change" : "Upload"}
                </>
              )}
            </label>
            <input
              id="logo-upload"
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              disabled={uploading}
              className="hidden"
            />
          </div>
        </div>

        {/* Site Name */}
        <div className="space-y-2">
          <Label htmlFor="siteName">Site Name</Label>
          <Input
            id="siteName"
            value={data.siteName}
            onChange={(e) => setData({ ...data, siteName: e.target.value })}
            placeholder="StageBook"
          />
        </div>

        {/* Tagline */}
        <div className="space-y-2">
          <Label htmlFor="tagline">Tagline</Label>
          <Input
            id="tagline"
            value={data.tagline}
            onChange={(e) => setData({ ...data, tagline: e.target.value })}
            placeholder="Professional Event Entertainment"
          />
        </div>

        <Button
          onClick={() => onSave(data)}
          disabled={saving || uploading}
          className="gap-2"
        >
          <Save className="h-4 w-4" />
          {saving ? "Saving..." : "Save Site Info"}
        </Button>
      </CardContent>
    </Card>
  );
}
