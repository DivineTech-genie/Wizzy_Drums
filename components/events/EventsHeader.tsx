"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EventsHeaderProps {
  onAddClick: () => void;
}

export function EventsHeader({ onAddClick }: EventsHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-heading font-bold">Event Types</h1>
        <p className="text-sm text-muted-foreground">
          Manage event types, pricing, and deposit rates
        </p>
      </div>
      <Button onClick={onAddClick} className="gap-2 w-full sm:w-auto">
        <Plus className="h-4 w-4" />
        New Event Type
      </Button>
    </div>
  );
}
