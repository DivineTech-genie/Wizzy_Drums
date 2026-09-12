"use client";

import { Pencil, Trash2 } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { EventImage } from "./EventImage";
import { EventType } from "@/app/backend/validators/events";

interface EventsTableRowProps {
  event: EventType;
  onEdit: (event: EventType) => void;
  onDelete: (id: string) => void;
}

export function EventsTableRow({
  event,
  onEdit,
  onDelete,
}: EventsTableRowProps) {
  return (
    <TableRow>
      <TableCell className="font-mono text-xs">{event.value}</TableCell>
      <TableCell className="font-medium">{event.label}</TableCell>
      <TableCell className="text-right">
        {event.price ? `₦${event.price.toLocaleString()}` : "—"}
      </TableCell>
      <TableCell className="text-right">{event.depositRate}%</TableCell>
      <TableCell>
        <EventImage src={event.src} alt={event.label} size="sm" />
      </TableCell>
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onEdit(event)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive"
            onClick={() => onDelete(event._id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
