"use client";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { EventsTableRow } from "./EventsTableRow";
import { EventType } from "@/app/backend/validators/events";

interface EventsTableProps {
  events: EventType[];
  loading: boolean;
  onEdit: (event: EventType) => void;
  onDelete: (id: string) => void;
}

export function EventsTable({
  events,
  loading,
  onEdit,
  onDelete,
}: EventsTableProps) {
  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">Loading...</CardContent>
      </Card>
    );
  }

  if (events.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-muted-foreground">
          No event types found
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Value (Slug)</TableHead>
              <TableHead>Label</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Deposit Rate</TableHead>
              <TableHead>Image</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.map((event) => (
              <EventsTableRow
                key={event._id}
                event={event}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
