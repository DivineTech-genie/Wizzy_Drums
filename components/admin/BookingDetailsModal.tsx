"use client";

import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "./StatusBadge";
import {
  MapPin,
  Calendar,
  Clock,
  Mail,
  Phone,
  User,
  CheckCircle,
  XCircle,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";

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
  eventCountry: string;
  status: "pending" | "confirmed" | "cancelled";
  providesFlight: boolean;
  cannotAffordFlight: boolean;
  requiresAccommodation: boolean;
  flightTicketUrl?: string | null;
  hotelTicketUrl?: string | null;
  depositReceiptUrl?: string | null;
  logisticsVerified: boolean;
  createdAt: string;
}

interface BookingDetailsModalProps {
  booking: Booking | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusChange?: (
    id: string,
    status: Booking["status"],
    note?: string,
  ) => void;
}

const DetailRow = ({
  icon,
  label,
  value,
  className,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  className?: string;
}) => (
  <div className={cn("flex items-start gap-3 py-2", className)}>
    <div className="text-muted-foreground mt-0.5">{icon}</div>
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm">{value || "—"}</p>
    </div>
  </div>
);

export function BookingDetailsModal({
  booking,
  open,
  onOpenChange,
  onStatusChange,
}: BookingDetailsModalProps) {
  const [adminNote, setAdminNote] = useState("");
  const [showNoteInput, setShowNoteInput] = useState(false);

  if (!booking) return null;

  const isOutOfState = booking.eventState?.toLowerCase() !== "enugu";
  const status = booking.status || "pending";

  const handleConfirm = () => {
    if (showNoteInput) {
      onStatusChange?.(booking._id, "confirmed", adminNote);
      setShowNoteInput(false);
      setAdminNote("");
      toast.success("Booking confirmed and email sent");
    } else {
      setShowNoteInput(true);
    }
  };

  const handleCancel = () => {
    if (confirm("Are you sure you want to cancel this booking?")) {
      onStatusChange?.(booking._id, "cancelled", adminNote);
      toast.success("Booking cancelled");
    } else {
      toast.info("Booking cancellation was skipped");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-heading">
              Booking Details
            </DialogTitle>
            <StatusBadge status={status} />
          </div>
          <DialogDescription>
            Booking reference: #{booking._id.slice(-8)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Client Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-lg bg-muted/30">
            <DetailRow
              icon={<User className="h-4 w-4" />}
              label="Client Name"
              value={booking.clientName}
            />
            <DetailRow
              icon={<Mail className="h-4 w-4" />}
              label="Email"
              value={booking.clientEmail}
            />
            <DetailRow
              icon={<Phone className="h-4 w-4" />}
              label="Phone"
              value={booking.clientPhone}
            />
            <DetailRow
              icon={<Calendar className="h-4 w-4" />}
              label="Submitted"
              value={format(new Date(booking.createdAt), "dd MMM yyyy, h:mm a")}
            />
          </div>

          {/* Event Details */}
          <div>
            <h4 className="text-sm font-semibold mb-3">Event Details</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-lg border">
              <DetailRow
                icon={<Calendar className="h-4 w-4" />}
                label="Date"
                value={format(new Date(booking.eventDate), "dd MMMM yyyy")}
              />
              <DetailRow
                icon={<Clock className="h-4 w-4" />}
                label="Time"
                value={booking.eventTime}
              />
              <DetailRow
                icon={<MapPin className="h-4 w-4" />}
                label="Location"
                value={booking.eventLocation}
              />
              <DetailRow
                icon={<MapPin className="h-4 w-4" />}
                label="State / Region"
                value={booking.eventState}
              />
            </div>
          </div>

          {/* Logistics */}
          <div>
            <h4 className="text-sm font-semibold mb-3">Logistics</h4>
            <div className="p-4 rounded-lg border space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge variant={isOutOfState ? "default" : "secondary"}>
                  {isOutOfState ? "Out-of-State" : "Local (Enugu)"}
                </Badge>
              </div>

              {isOutOfState && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Flight Provision
                    </span>
                    <Badge
                      variant={booking.providesFlight ? "default" : "outline"}
                    >
                      {booking.providesFlight
                        ? "Client provides"
                        : "Charged to quote"}
                    </Badge>
                  </div>

                  {booking.flightTicketUrl && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Flight Ticket
                      </span>
                      <a
                        href={booking.flightTicketUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline flex items-center gap-1"
                      >
                        View <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Accommodation
                    </span>
                    <Badge
                      variant={
                        booking.requiresAccommodation ? "default" : "outline"
                      }
                    >
                      {booking.requiresAccommodation
                        ? "Required"
                        : "Not required"}
                    </Badge>
                  </div>

                  {booking.hotelTicketUrl && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Hotel Confirmation
                      </span>
                      <a
                        href={booking.hotelTicketUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline flex items-center gap-1"
                      >
                        View <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  )}
                </>
              )}

              {booking.depositReceiptUrl && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Deposit Receipt
                  </span>
                  <a
                    href={booking.depositReceiptUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline flex items-center gap-1"
                  >
                    View <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t">
                <span className="text-sm text-muted-foreground">
                  Logistics Verified
                </span>
                <Badge
                  variant={booking.logisticsVerified ? "default" : "outline"}
                >
                  {booking.logisticsVerified ? (
                    <span className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" /> Verified
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <XCircle className="h-3 w-3" /> Pending
                    </span>
                  )}
                </Badge>
              </div>
            </div>
          </div>

          {/* Admin Note Input & Actions */}
          {onStatusChange && status === "pending" && (
            <div className="space-y-3">
              {!showNoteInput ? (
                <Button onClick={handleConfirm} className="w-full">
                  Confirm Booking
                </Button>
              ) : (
                <div className="space-y-3">
                  <Textarea
                    placeholder="Add a note for the client (e.g., travel arrangements, special requests)..."
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    rows={3}
                  />
                  <div className="flex gap-3">
                    <Button onClick={handleConfirm} className="flex-1">
                      Confirm
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowNoteInput(false);
                        setAdminNote("");
                      }}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
              <Button
                variant="destructive"
                onClick={handleCancel}
                className="w-full"
              >
                Cancel Booking
              </Button>
            </div>
          )}

          {status === "confirmed" && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-600 text-sm text-center">
              This booking has been confirmed
            </div>
          )}

          {status === "cancelled" && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm text-center">
              This booking has been cancelled
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
