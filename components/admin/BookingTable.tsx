"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  Eye,
  //   Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { StatusBadge } from "./StatusBadge";

interface Booking {
  _id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  eventType: string;
  eventState: string;
  status: "pending" | "confirmed" | "cancelled";
  providesFlight: boolean;
  requiresAccommodation: boolean;
  logisticsVerified: boolean;
  createdAt: string;
}

interface BookingsTableProps {
  bookings: Booking[];
  onView: (booking: Booking) => void;
  onStatusChange: (id: string, status: Booking["status"]) => void;
  onDelete: (id: string) => void;
  loading?: boolean;
}

export function BookingsTable({
  bookings,
  onView,
  onStatusChange,
  onDelete,
  loading,
}: BookingsTableProps) {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const totalPages = Math.ceil(bookings.length / pageSize);
  const paginatedBookings = bookings.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

  if (loading) {
    return (
      <div className="animate-pulse space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-12 bg-muted rounded" />
        ))}
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No bookings found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Event</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedBookings.map((booking) => (
              <TableRow key={booking._id} className="group">
                <TableCell>
                  <div>
                    <p className="font-medium">{booking.clientName}</p>
                    <p className="text-xs text-muted-foreground">
                      {booking.clientEmail}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="text-sm">{booking.eventType}</p>
                    <p className="text-xs text-muted-foreground">
                      {booking.eventTime}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  {format(new Date(booking.eventDate), "dd MMM yyyy")}
                </TableCell>
                <TableCell>
                  <div>
                    <p className="text-sm">{booking.eventLocation}</p>
                    <p className="text-xs text-muted-foreground">
                      {booking.eventState}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <StatusBadge status={booking.status} />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onView(booking)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-md p-2 hover:bg-accent hover:text-accent-foreground transition-colors">
                        <MoreHorizontal className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onView(booking)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            onStatusChange(booking._id, "confirmed")
                          }
                          disabled={booking.status === "confirmed"}
                        >
                          <span className="h-4 w-4 mr-2 text-emerald-500">
                            ●
                          </span>
                          Mark Confirmed
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            onStatusChange(booking._id, "cancelled")
                          }
                          disabled={booking.status === "cancelled"}
                          className="text-destructive"
                        >
                          <span className="h-4 w-4 mr-2 text-destructive">
                            ●
                          </span>
                          Cancel Booking
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onDelete(booking._id)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {(page - 1) * pageSize + 1} -{" "}
            {Math.min(page * pageSize, bookings.length)} of {bookings.length}
          </p>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
