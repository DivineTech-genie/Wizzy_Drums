"use client";

import { useState } from "react";
import { UseFormReturn, useWatch } from "react-hook-form";
import {
  Plane,
  Hotel,
  MapPin,
  TriangleAlert,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { TravelLogisticsForm } from "../Travel.logistics";
import { uploadFileToCloudinary } from "@/lib/upload-file";
import { isOutsideEast } from "@/lib/eastern-states";
import { BookingFormValues } from "@/app/backend/validators/validators";
import { useBookingPricing } from "@/hooks/useBookingPricing";
import { cn } from "@/lib/utils";

interface Step2LogisticsProps {
  form: UseFormReturn<BookingFormValues>;
}

/** Collects travel logistics and uploads supporting booking documents. */
export function Step2Logistics({ form }: Step2LogisticsProps) {
  const [uploadingFlight, setUploadingFlight] = useState(false);
  const [uploadingHotel, setUploadingHotel] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const eventType =
    useWatch({ control: form.control, name: "eventType" }) || "Wedding";
  const cannotAffordFlight = useWatch({
    control: form.control,
    name: "cannotAffordFlight",
  });
  const providesFlight = useWatch({
    control: form.control,
    name: "providesFlight",
  });
  const requiresAccommodation = useWatch({
    control: form.control,
    name: "requiresAccommodation",
  });
  const flightTicketUrl = useWatch({
    control: form.control,
    name: "flightTicketUrl",
  });
  const hotelTicketUrl = useWatch({
    control: form.control,
    name: "hotelTicketUrl",
  });
  const eventState =
    useWatch({ control: form.control, name: "eventState" }) || "";
  const eventCountry =
    useWatch({ control: form.control, name: "eventCountry" }) || "";
  const eventDate = useWatch({ control: form.control, name: "eventDate" });

  const {
    eventPrice,
    depositRate,
    depositAmount,
    flightDepositAmount,
    isLoading,
  } = useBookingPricing(eventType, Boolean(cannotAffordFlight));

  // const isEastern = isEasternNigeriaState(eventState);
  const outsideEast = isOutsideEast(eventState, eventCountry);

  const requiresFlightUpload = !!providesFlight;
  const shouldShowUploadSection =
    requiresFlightUpload || !!requiresAccommodation;

  const validateBeforeNext = (): boolean => {
    if (!eventState.trim()) return true;

    if (!outsideEast) return true;

    const flightSatisfied = !!providesFlight || !!cannotAffordFlight;
    const accommodationSatisfied = !!requiresAccommodation;

    if (!flightSatisfied && !accommodationSatisfied) {
      toast.error(
        "Please provide both flight and accommodation details to continue.",
      );
      return false;
    }
    if (!flightSatisfied) {
      toast.error(
        "Please provide your flight details or select 'Charge flights to quote' to continue.",
      );
      return false;
    }
    if (!accommodationSatisfied) {
      toast.error("Please provide accommodation details to continue.");
      return false;
    }

    return true;
  };

  const handleFlightFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingFlight(true);
    setUploadError("");
    try {
      const url = await uploadFileToCloudinary(file);
      form.setValue("flightTicketUrl", url, { shouldValidate: true });
      toast.success("Flight ticket uploaded successfully");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to upload flight ticket.";
      setUploadError(message);
      toast.error(message);
    } finally {
      setUploadingFlight(false);
    }
  };

  const handleHotelFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingHotel(true);
    setUploadError("");
    try {
      const url = await uploadFileToCloudinary(file);
      form.setValue("hotelTicketUrl", url, { shouldValidate: true });
      toast.success("Hotel confirmation uploaded successfully");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to upload hotel confirmation.";
      setUploadError(message);
      toast.error(message);
    } finally {
      setUploadingHotel(false);
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-heading font-bold">
            Travel & Logistics
          </h2>
          <p className="text-muted-foreground text-sm">Loading pricing...</p>
        </div>
        <div className="h-40 bg-muted rounded-xl animate-pulse" />
      </div>
    );
  }

  // Visual highlight for missing fields (outside East only)
  const flightMissing = outsideEast && !providesFlight && !cannotAffordFlight;
  const accommodationMissing = outsideEast && !requiresAccommodation;

  return (
    <div className="stack-lg">
      {/* Header */}
      <div className="text-center">
        <h2 className="heading-sm">Travel & Logistics</h2>
        <p className="text-muted-foreground text-sm">
          Help me plan the logistics for your event
        </p>
      </div>

      {/* Event summary */}
      <div className="p-4 rounded-xl bg-mauve-50 border border-primary/10">
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="font-medium">{eventState || "Not set"}</span>
            {eventCountry && (
              <span className="text-muted-foreground">, {eventCountry}</span>
            )}
          </div>
          {eventDate && (
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">•</span>
              <span className="font-medium">{formatDate(eventDate)}</span>
            </div>
          )}
        </div>

        <div className="mt-4 rounded-3xl border border-primary/10 bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Booking quote
          </p>
          <p className="mt-2 text-2xl font-heading font-bold text-primary">
            ₦{eventPrice.toLocaleString()}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Estimated fee. A {depositRate}% deposit of ₦
            {depositAmount.toLocaleString()} will secure your date.
          </p>
        </div>
      </div>

      {/* Logistics section */}
      <TravelLogisticsForm form={form} />

      {/* Missing fields warning */}
      {outsideEast && (flightMissing || accommodationMissing) && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-destructive">
          <p className="flex items-center gap-2 text-sm font-medium">
            <TriangleAlert className="h-4 w-4" />
            Additional details required
          </p>
          <ul className="mt-2 ml-6 list-disc text-xs space-y-1">
            {flightMissing && (
              <li>
                Select a flight arrangement (provide ticket or charge to quote)
              </li>
            )}
            {accommodationMissing && (
              <li>Confirm accommodation for one person</li>
            )}
          </ul>
        </div>
      )}

      {cannotAffordFlight && (
        <div className="rounded-xl bg-mauve-100 border border-primary/10 p-4 text-red-900">
          <p className="font-medium text-sm">Flight deposit included</p>
          <p className="text-xs text-red-900">
            Because you chose to charge flights to the quote, an additional
            deposit of ₦{flightDepositAmount.toLocaleString()} will be added to
            your booking deposit.
          </p>
        </div>
      )}

      {shouldShowUploadSection && (
        <div
          className={cn(
            "stack-md rounded-xl border bg-muted/20 p-4",
            outsideEast &&
              ((requiresFlightUpload && !flightTicketUrl) ||
                (requiresAccommodation && !hotelTicketUrl))
              ? "border-destructive/40"
              : "border-border/60",
          )}
        >
          {uploadError ? (
            <p className="text-sm text-destructive">{uploadError}</p>
          ) : null}

          {requiresFlightUpload && (
            <div>
              <label className="mb-1 block text-sm font-medium">
                Upload flight ticket
              </label>
              <input
                type="file"
                accept=".pdf,image/*"
                onChange={handleFlightFileUpload}
                disabled={uploadingFlight}
                className="block w-full text-sm text-muted-foreground file:mr-4 file:rounded file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-primary-foreground hover:file:bg-primary/90 disabled:opacity-50"
              />
              {uploadingFlight && (
                <p className="mt-1 text-xs text-primary">Uploading...</p>
              )}
              {flightTicketUrl && (
                <p className="mt-1 flex items-center gap-1 text-xs text-green-600">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Flight ticket uploaded
                </p>
              )}
            </div>
          )}

          {requiresAccommodation && (
            <div>
              <label className="mb-1 block text-sm font-medium">
                Upload hotel confirmation
              </label>
              <input
                type="file"
                accept=".pdf,image/*"
                onChange={handleHotelFileUpload}
                disabled={uploadingHotel}
                className="block w-full text-sm text-muted-foreground file:mr-4 file:rounded file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-primary-foreground hover:file:bg-primary/90 disabled:opacity-50"
              />
              {uploadingHotel && (
                <p className="mt-1 text-xs text-primary">Uploading...</p>
              )}
              {hotelTicketUrl && (
                <p className="mt-1 flex items-center gap-1 text-xs text-green-600">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Hotel confirmation uploaded
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Summary cards */}
      <div className="grid md:grid-cols-2 gap-4 pt-4 border-t">
        <div
          className={cn(
            "flex items-start gap-3 p-4 rounded-xl bg-muted/30",
            flightMissing && "border border-destructive/40 bg-destructive/5",
          )}
        >
          <Plane className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium">Flight Arrangement</p>
            <p className="text-xs text-muted-foreground">
              {providesFlight
                ? "You will provide flight tickets"
                : cannotAffordFlight
                  ? "Charge flights to booking quote"
                  : "Not specified"}
            </p>
          </div>
        </div>

        <div
          className={cn(
            "flex items-start gap-3 p-4 rounded-xl bg-muted/30",
            accommodationMissing &&
              "border border-destructive/40 bg-destructive/5",
          )}
        >
          <Hotel className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium">Accommodation</p>
            <p className="text-xs text-muted-foreground">
              {requiresAccommodation
                ? "Required (one person)"
                : "Not confirmed"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
