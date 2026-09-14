"use client";

import {
  Image as ImageIcon,
  Film,
  ExternalLink,
  Pencil,
  Trash2,
  Star,
  StarOff,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { MediaItem } from "@/app/backend/validators/media";

interface MediaCardProps {
  item: MediaItem;
  isFirst: boolean;
  isLast: boolean;
  onEdit: (item: MediaItem) => void;
  onDelete: (id: string) => void;
  onToggleHero: (id: string, currentHero: boolean) => void;
  onReorder: (id: string, direction: "up" | "down") => void;
}

const getTypeColor = (type: string) => {
  return type === "image"
    ? "bg-blue-500/10 text-blue-500"
    : "bg-purple-500/10 text-purple-500";
};

export function MediaCard({
  item,
  isFirst,
  isLast,
  onEdit,
  onDelete,
  onToggleHero,
  onReorder,
}: MediaCardProps) {
  return (
    <Card className="group overflow-hidden">
      <CardContent className="p-0">
        {/* Preview */}
        <div className="relative aspect-video bg-muted/30 overflow-hidden">
          {item.type === "image" ? (
            <div className="w-full h-full flex items-center justify-center bg-muted/20">
              {item.src ? (
                <Image
                  src={item.src}
                  alt={item.title}
                  width={item.width || 1200}
                  height={item.height || 800}
                  className="w-full h-full object-cover"
                />
              ) : (
                <ImageIcon className="h-12 w-12 text-muted-foreground/30" />
              )}
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted/20">
              {item.src ? (
                <video
                  src={item.src}
                  className="w-full h-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                />
              ) : (
                <Film className="h-12 w-12 text-muted-foreground/30" />
              )}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-black/50 flex items-center justify-center">
                  <div className="w-0 h-0 border-y-8 border-y-transparent border-l-14 border-l-white ml-1" />
                </div>
              </div>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-2 left-2 flex gap-1">
            <Badge variant="secondary" className="text-[10px]">
              {item.type}
            </Badge>
            {item.isHero && (
              <Badge className="text-[10px] bg-amber-500 hover:bg-amber-500">
                <Star className="h-3 w-3 mr-1 fill-current" />
                Hero
              </Badge>
            )}
          </div>

          {/* Actions Overlay */}
          <div className="absolute inset-0 bg-black/60 transition-opacity flex items-center justify-center gap-2">
            <Button size="sm" variant="secondary" className="h-8 gap-1">
              <a href={item.src} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3 w-3" />
                View
              </a>
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="h-8 gap-1"
              onClick={() => onEdit(item)}
            >
              <Pencil className="h-3 w-3" />
              Edit
            </Button>
            <Button
              size="sm"
              variant="destructive"
              className="h-8"
              onClick={() => onDelete(item._id)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Info */}
        <div className="p-3 space-y-1">
          <div className="flex items-start justify-between gap-2">
            <p className="font-medium text-sm truncate">{item.title}</p>
            <div className="flex items-center gap-1 shrink-0">
              {item.category === "hero" && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => onToggleHero(item._id, item.isHero ?? false)}
                >
                  {item.isHero ? (
                    <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                  ) : (
                    <StarOff className="h-3 w-3 text-muted-foreground" />
                  )}
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => onReorder(item._id, "up")}
                disabled={isFirst}
              >
                <ArrowUp className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => onReorder(item._id, "down")}
                disabled={isLast}
              >
                <ArrowDown className="h-3 w-3" />
              </Button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground truncate">
            {item.description || "No description"}
          </p>
          <div className="flex items-center gap-2 pt-1">
            <span
              className={`text-[10px] px-2 py-0.5 rounded ${getTypeColor(item.type)}`}
            >
              {item.type}
            </span>
            {item.date && (
              <span className="text-[10px] text-muted-foreground">
                {item.date}
              </span>
            )}
            <span className="text-[10px] text-muted-foreground">
              {item.width}×{item.height}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
