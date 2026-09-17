"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";

interface BookingDetails {
  _id: string;
  eventDate: string;
  eventType: string;
  status: "pending" | "confirmed" | "cancelled";
  createdAt?: string;
}

export default function BookingRequestPage() {
  const params = useParams();
  const id = params?.id as string;
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchBooking = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/bookings/${id}`);

        if (!response.ok) {
          throw new Error("Booking not found");
        }

        const result = await response.json();
        setBooking(result.data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load your booking request",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-muted-foreground">
          Loading your booking request...
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="mx-auto max-w-xl rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center">
        <h1 className="text-2xl font-heading">Request not found</h1>
        <p className="mt-2 text-muted-foreground">
          {error || "We couldn’t find this booking request."}
        </p>
        <Button
          className="mt-4"
          onClick={() => (window.location.href = "/book")}
        >
          Back to booking
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 py-10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Booking request</p>
          <h1 className="text-3xl font-heading">#{booking._id.slice(-8)}</h1>
        </div>
        <Badge
          variant={
            booking.status === "confirmed"
              ? "default"
              : booking.status === "cancelled"
                ? "destructive"
                : "secondary"
          }
        >
          {booking.status}
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold">Your event request</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <InfoRow
                icon={<Calendar className="h-4 w-4" />}
                label="Date"
                value={format(new Date(booking.eventDate), "dd MMMM yyyy")}
              />
              <InfoRow
                label="Event type"
                value={booking.eventType}
              />
              <InfoRow
                icon={<Calendar className="h-4 w-4" />}
                label="Submitted"
                value={
                  booking.createdAt
                    ? format(new Date(booking.createdAt), "dd MMM yyyy")
                    : "—"
                }
              />
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <h2 className="mb-3 text-lg font-semibold">Request status</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between rounded-md bg-muted/40 p-3">
                <span>Current status</span>
                <span className="font-medium capitalize">{booking.status}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
  className,
}: {
  icon?: React.ReactNode;
  label: string;
  value: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="mb-1 flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
        {icon}
        <span>{label}</span>
      </div>
      <div className="text-sm font-medium">{value || "—"}</div>
    </div>
  );
}
