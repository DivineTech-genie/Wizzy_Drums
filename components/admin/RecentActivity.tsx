"use client";

import { formatDistanceToNow } from "date-fns";
import { Clock,  CheckCircle, XCircle } from "lucide-react";
import { StatusBadge } from "./StatusBadge";

interface Booking {
  _id: string;
  clientName: string;
  eventDate: string;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
}

interface RecentActivityProps {
  bookings: Booking[];
}

export function RecentActivity({ bookings }: RecentActivityProps) {
  const recent = bookings.slice(0, 10);

  return (
    <div className="space-y-4">
      <h3 className="font-heading text-lg font-semibold">Recent Activity</h3>
      <div className="space-y-3">
        {recent.length === 0 ? (
          <p className="text-muted-foreground text-sm">No recent activity</p>
        ) : (
          recent.map((booking) => (
            <div
              key={booking._id}
              className="flex items-start gap-3 p-3 rounded-lg bg-card border"
            >
              <div className="p-2 rounded-full bg-primary/10">
                {booking.status === "confirmed" ? (
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                ) : booking.status === "cancelled" ? (
                  <XCircle className="h-4 w-4 text-red-500" />
                ) : (
                  <Clock className="h-4 w-4 text-amber-500" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-sm truncate">
                    {booking.clientName}
                  </p>
                  <StatusBadge status={booking.status} />
                </div>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(booking.createdAt), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
