// app/admin/settings/components/forms/SocialLinksForm.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save } from "lucide-react";
import {
  InstagramLogoIcon,
  TwitterLogoIcon,
  YoutubeLogoIcon,
  FacebookLogoIcon,
} from "@phosphor-icons/react";

interface SocialLinksFormProps {
  initialData: {
    instagram: string;
    twitter: string;
    youtube: string;
    facebook: string;
  };
  onSave: (data: any) => Promise<{ success: boolean }>;
  saving: boolean;
}

export function SocialLinksForm({
  initialData,
  onSave,
  saving,
}: SocialLinksFormProps) {
  const [data, setData] = useState(initialData);

  const fields = [
    {
      key: "instagram",
      label: "Instagram",
      icon: InstagramLogoIcon,
      placeholder: "https://instagram.com/...",
    },
    {
      key: "twitter",
      label: "Twitter / X",
      icon: TwitterLogoIcon,
      placeholder: "https://twitter.com/...",
    },
    {
      key: "youtube",
      label: "YouTube",
      icon: YoutubeLogoIcon,
      placeholder: "https://youtube.com/@...",
    },
    {
      key: "facebook",
      label: "Facebook",
      icon: FacebookLogoIcon,
      placeholder: "https://facebook.com/...",
    },
  ] as const;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Social Links</CardTitle>
        <p className="text-xs text-muted-foreground">
          Displayed in the footer and contact page.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {fields.map((field) => (
          <div key={field.key} className="space-y-2">
            <Label className="flex items-center gap-2">
              <field.icon className="h-4 w-4" />
              {field.label}
            </Label>
            <Input
              value={data[field.key]}
              onChange={(e) =>
                setData({ ...data, [field.key]: e.target.value })
              }
              placeholder={field.placeholder}
            />
          </div>
        ))}

        <Button
          onClick={() => onSave(data)}
          disabled={saving}
          className="gap-2"
        >
          <Save className="h-4 w-4" />
          {saving ? "Saving..." : "Save Social Links"}
        </Button>
      </CardContent>
    </Card>
  );
}
