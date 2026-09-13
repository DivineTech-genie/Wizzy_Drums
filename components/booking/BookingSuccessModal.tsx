"use client";

import { motion } from "framer-motion";
import {
  CheckCircle,
  Calendar,
  MapPin,
  Clock,
  Mail,
  ArrowRight,
  Home,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { format } from "date-fns";

interface BookingSuccessModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking: {
    clientName: string;
    clientEmail: string;
    eventType: string;
    eventDate: string | Date;
    eventTime: string;
    eventLocation: string;
    eventState: string;
    _id: string;
  } | null;
}

export function BookingSuccessModal({
  open,
  onOpenChange,
  booking,
}: BookingSuccessModalProps) {
  if (!booking) return null;

  const eventDate = new Date(booking.eventDate);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto p-0">
        {/* Top Gold Banner */}
        <div className="relative bg-linear-to-br from-primary/20 via-primary/10 to-transparent p-6 pb-8 rounded-t-lg">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 15,
              delay: 0.1,
            }}
            className="mx-auto w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-lg"
          >
            <CheckCircle className="h-9 w-9 text-primary-foreground" />
          </motion.div>
        </div>

        <div className="px-6 pb-6 -mt-4 space-y-5">
          {/* Header */}
          <DialogHeader className="space-y-2 text-center">
            <DialogTitle className="text-2xl font-heading">
              Booking Submitted!
            </DialogTitle>
            <DialogDescription className="text-sm">
              Thank you,{" "}
              <span className="font-medium text-foreground">
                {booking.clientName}
              </span>
              . We&apos;ve received your request.
            </DialogDescription>
          </DialogHeader>

          {/* Booking Reference */}
          <div className="flex items-center justify-center">
            <Badge variant="outline" className="text-xs font-mono">
              Ref: #{booking._id.slice(-8).toUpperCase()}
            </Badge>
          </div>

          {/* Event Summary */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-xl border bg-muted/30 p-4 space-y-3"
          >
            <div className="flex items-start gap-3">
              <div className="p-1.5 rounded-md bg-primary/10 mt-0.5">
                <Calendar className="h-3.5 w-3.5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">Event</p>
                <p className="text-sm font-medium">{booking.eventType}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-start gap-2">
                <div className="p-1.5 rounded-md bg-primary/10 mt-0.5">
                  <Clock className="h-3.5 w-3.5 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">Date & Time</p>
                  <p className="text-xs font-medium truncate">
                    {format(eventDate, "dd MMM yyyy")}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {booking.eventTime}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <div className="p-1.5 rounded-md bg-primary/10 mt-0.5">
                  <MapPin className="h-3.5 w-3.5 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">Location</p>
                  <p className="text-xs font-medium truncate">
                    {booking.eventLocation}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {booking.eventState}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Info Message */}
          <div className="rounded-lg bg-primary/5 border border-primary/10 p-3 flex items-start gap-2">
            <Mail className="h-4 w-4 text-primary mt-0.5 shrink-0" />
            <p className="text-xs text-muted-foreground">
              A confirmation email has been sent to{" "}
              <span className="font-medium text-foreground">
                {booking.clientEmail}
              </span>
              . Our team will review your request and send a personalised quote
              within 24-48 hours.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <Link href="/" className="flex  gap-2">
              <Button className="flex-1">
                <Home className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 gap-2"
            >
              Close
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
