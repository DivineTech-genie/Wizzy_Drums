"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MediaHeaderProps {
  onAddClick: () => void;
}

export function MediaHeader({ onAddClick }: MediaHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-heading font-bold">Media Management</h1>
        <p className="text-sm text-muted-foreground">
          Manage photos, videos, and hero content
        </p>
      </div>
      <Button onClick={onAddClick} className="gap-2 w-full sm:w-auto">
        <Plus className="h-4 w-4" />
        Add Media
      </Button>
    </div>
  );
}
