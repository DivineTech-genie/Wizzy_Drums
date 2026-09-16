"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  CheckCircle,
  Clock,
  MapPin,
  Mail,
  Phone,
  User,
  XCircle,
} from "lucide-react";

interface BookingDetails {
  _id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  eventType: string;
  eventState: string;
  eventCountry: string;
  status: "pending" | "confirmed" | "cancelled";
  providesFlight: boolean;
  cannotAffordFlight: boolean;
  requiresAccommodation: boolean;
  flightTicketUrl?: string | null;
  hotelTicketUrl?: string | null;
  depositReceiptUrl?: string | null;
  logisticsVerified: boolean;
  adminNote?: string;
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

  const isOutOfState =
    booking.eventState?.toLowerCase() !== "enugu" &&
    booking.eventCountry?.toLowerCase() === "nigeria";

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
            <h2 className="mb-4 text-lg font-semibold">Your details</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <InfoRow
                icon={<User className="h-4 w-4" />}
                label="Name"
                value={booking.clientName}
              />
              <InfoRow
                icon={<Mail className="h-4 w-4" />}
                label="Email"
                value={booking.clientEmail}
              />
              <InfoRow
                icon={<Phone className="h-4 w-4" />}
                label="Phone"
                value={booking.clientPhone}
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

          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold">Your event request</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <InfoRow
                icon={<Calendar className="h-4 w-4" />}
                label="Date"
                value={format(new Date(booking.eventDate), "dd MMMM yyyy")}
              />
              <InfoRow
                icon={<Clock className="h-4 w-4" />}
                label="Time"
                value={booking.eventTime}
              />
              <InfoRow
                icon={<MapPin className="h-4 w-4" />}
                label="Venue"
                value={booking.eventLocation}
              />
              <InfoRow
                icon={<MapPin className="h-4 w-4" />}
                label="State"
                value={booking.eventState}
              />
              <InfoRow
                label="Event type"
                value={booking.eventType}
                className="sm:col-span-2"
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
              <div className="flex items-center justify-between rounded-md bg-muted/40 p-3">
                <span>Logistics</span>
                <span>{isOutOfState ? "Out-of-State" : "Local (Enugu)"}</span>
              </div>
              <div className="flex items-center justify-between rounded-md bg-muted/40 p-3">
                <span>Travel support</span>
                <span>
                  {booking.providesFlight
                    ? "Client provides"
                    : booking.cannotAffordFlight
                      ? "Charge to quote"
                      : "Not specified"}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-md bg-muted/40 p-3">
                <span>Accommodation</span>
                <span>
                  {booking.requiresAccommodation ? "Required" : "Not required"}
                </span>
              </div>
            </div>
          </div>

          {booking.adminNote && (
            <div className="rounded-xl border bg-card p-5 shadow-sm">
              <h2 className="mb-3 text-lg font-semibold">Team note</h2>
              <p className="text-sm text-muted-foreground">
                {booking.adminNote}
              </p>
            </div>
          )}
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
