"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  ExternalLink,
  Mail,
  MapPin,
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
  updatedAt?: string;
}

export default function BookingDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [adminNote, setAdminNote] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchBooking = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/admin/bookings/${id}`);

        if (!response.ok) {
          throw new Error("Booking not found or unauthorized");
        }

        const result = await response.json();
        setBooking(result.data);
        setAdminNote(result.data?.adminNote || "");
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load booking details",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [id]);

  const handleStatusUpdate = async (status: "confirmed" | "cancelled") => {
    if (!booking || isUpdating) return;

    setUpdateError(null);
    setIsUpdating(true);

    try {
      const response = await fetch(`/api/admin/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          adminNote,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.message || "Failed to update booking");
      }

      setBooking(data.data);
      setAdminNote(data.data?.adminNote || "");
    } catch (err) {
      setUpdateError(
        err instanceof Error ? err.message : "Failed to update booking",
      );
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-muted-foreground">Loading booking details...</div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="space-y-4 rounded-xl border border-destructive/30 bg-destructive/5 p-6">
        <p className="font-medium text-destructive">
          {error || "Booking not found"}
        </p>
        <Button variant="outline" onClick={() => router.push("/admin")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to dashboard
        </Button>
      </div>
    );
  }

  const isOutOfState =
    booking.eventState?.toLowerCase() !== "enugu" &&
    booking.eventCountry?.toLowerCase() === "nigeria";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Booking Reference</p>
          <h1 className="text-2xl font-heading">#{booking._id.slice(-8)}</h1>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={booking.status} />
          <Button variant="outline" onClick={() => router.push("/admin")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-6">
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold">Client information</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <InfoRow
                icon={<User className="h-4 w-4" />}
                label="Client name"
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
            <h2 className="mb-4 text-lg font-semibold">Event request</h2>
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

          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold">Logistics details</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-md bg-muted/40 p-3 text-sm">
                <span>Region</span>
                <Badge variant={isOutOfState ? "default" : "secondary"}>
                  {isOutOfState ? "Out-of-State" : "Local (Enugu)"}
                </Badge>
              </div>
              <div className="flex items-center justify-between rounded-md bg-muted/40 p-3 text-sm">
                <span>Flight coverage</span>
                <span>
                  {booking.providesFlight
                    ? "Client provides"
                    : booking.cannotAffordFlight
                      ? "Charge to quote"
                      : "Not specified"}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-md bg-muted/40 p-3 text-sm">
                <span>Accommodation</span>
                <span>
                  {booking.requiresAccommodation ? "Required" : "Not required"}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-md bg-muted/40 p-3 text-sm">
                <span>Logistics verified</span>
                <span className="flex items-center gap-2">
                  {booking.logisticsVerified ? (
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-amber-500" />
                  )}
                  {booking.logisticsVerified ? "Verified" : "Pending"}
                </span>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              {booking.flightTicketUrl && (
                <DocumentLink
                  href={booking.flightTicketUrl}
                  label="Flight ticket"
                />
              )}
              {booking.hotelTicketUrl && (
                <DocumentLink
                  href={booking.hotelTicketUrl}
                  label="Hotel confirmation"
                />
              )}
              {booking.depositReceiptUrl && (
                <DocumentLink
                  href={booking.depositReceiptUrl}
                  label="Deposit receipt"
                />
              )}
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <h2 className="mb-3 text-lg font-semibold">Status</h2>
            <StatusBadge status={booking.status} />
            {booking.adminNote && (
              <div className="mt-4 rounded-md bg-muted/40 p-3 text-sm">
                <p className="mb-1 text-xs uppercase text-muted-foreground">
                  Admin note
                </p>
                <p>{booking.adminNote}</p>
              </div>
            )}
          </div>

          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <h2 className="mb-3 text-lg font-semibold">Quick actions</h2>
            <div className="space-y-2">
              <a href={`mailto:${booking.clientEmail}`} className="block">
                <Button variant="outline" className="w-full justify-start">
                  <Mail className="mr-2 h-4 w-4" /> Email client
                </Button>
              </a>
              <a href={`tel:${booking.clientPhone}`} className="block">
                <Button variant="outline" className="w-full justify-start">
                  <Phone className="mr-2 h-4 w-4" /> Call client
                </Button>
              </a>
            </div>
          </div>

          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <h2 className="mb-3 text-lg font-semibold">Update booking</h2>
            <div className="space-y-3">
              {updateError && (
                <p
                  role="alert"
                  className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive"
                >
                  {updateError}
                </p>
              )}
              <Textarea
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                placeholder="Add admin note or reply to the client..."
                className="min-h-[110px]"
              />
              <div className="grid gap-2 sm:grid-cols-2">
                <Button
                  onClick={() => handleStatusUpdate("confirmed")}
                  disabled={isUpdating || booking.status === "confirmed"}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  {isUpdating ? "Updating..." : "Confirm booking"}
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleStatusUpdate("cancelled")}
                  disabled={isUpdating || booking.status === "cancelled"}
                >
                  Cancel booking
                </Button>
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

function DocumentLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex w-full items-center justify-between rounded-md border bg-muted/30 px-3 py-2 text-sm text-primary hover:bg-muted/50"
    >
      <span>{label}</span>
      <ExternalLink className="h-4 w-4" />
    </a>
  );
}
