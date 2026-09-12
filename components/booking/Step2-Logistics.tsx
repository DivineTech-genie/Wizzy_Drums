"use client";

import { useState } from "react";
import { UseFormReturn, useWatch } from "react-hook-form";
import { Plane, Hotel, MapPin } from "lucide-react";
import { TravelLogisticsForm } from "../Travel.logistics";
import { uploadFileToCloudinary } from "@/lib/upload-file";
import { isEasternNigeriaState } from "@/lib/eastern-states";
import { BookingFormValues } from "@/app/backend/validators/validators";
import { useBookingPricing } from "@/hooks/useBookingPricing";

interface Step2LogisticsProps {
  form: UseFormReturn<BookingFormValues>;
}

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
  const providesFlight = form.watch("providesFlight");
  const eventState =
    useWatch({ control: form.control, name: "eventState" }) || "";
  const eventCountry =
    useWatch({ control: form.control, name: "eventCountry" }) || "";
  const eventDate = useWatch({ control: form.control, name: "eventDate" });

  // 🔥 Use the pricing hook
  const {
    eventPrice,
    depositRate,
    depositAmount,
    flightDepositAmount,
    totalDeposit,
    isLoading,
  } = useBookingPricing(eventType, cannotAffordFlight);

  const isEastern = isEasternNigeriaState(eventState);
  const requiresFlightUpload = !!providesFlight;

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
    } catch (error) {
      console.error("Flight upload error:", error);
      setUploadError("Failed to upload flight ticket.");
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
    } catch (error) {
      console.error("Hotel upload error:", error);
      setUploadError("Failed to upload hotel confirmation.");
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

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-heading font-bold">
            Travel & Logistics
          </h2>
          <p className="text-muted-foreground text-sm">Loading pricing...</p>
        </div>
        <div className="h-40 bg-gray-200 rounded-xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-heading font-bold">Travel & Logistics</h2>
        <p className="text-muted-foreground text-sm">
          Help us plan the logistics for your event
        </p>
      </div>

      {/* Dynamic Message - Shows event summary */}
      <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
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

      {/* Logistics Section */}
      <TravelLogisticsForm form={form} />

      {eventState.trim() !== "" &&
        !isEastern &&
        !providesFlight &&
        !cannotAffordFlight && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
            ⚠️ Please choose a flight arrangement option. If you cannot provide
            flights, select &quot;Charge flights to quote&quot; and an
            additional flight deposit will be included.
          </div>
        )}

      {cannotAffordFlight && (
        <div className="rounded-xl border border-primary/10 bg-primary/5 p-4 text-primary-900">
          <p className="font-medium">Flight deposit included</p>
          <p className="text-sm text-muted-foreground">
            Because you chose to charge flights to the quote, an additional
            deposit of ₦{flightDepositAmount.toLocaleString()} will be added to
            your booking deposit.
          </p>
        </div>
      )}

      {requiresFlightUpload && (
        <div className="space-y-4 rounded-xl border border-border/60 bg-muted/20 p-4">
          {uploadError ? (
            <p className="text-sm text-destructive">{uploadError}</p>
          ) : null}

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
            {form.watch("flightTicketUrl") && (
              <p className="mt-1 text-xs text-green-600">
                ✅ Flight ticket uploaded
              </p>
            )}
          </div>

          {(form.watch("requiresAccommodation") || requiresFlightUpload) && (
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
              {form.watch("hotelTicketUrl") && (
                <p className="mt-1 text-xs text-green-600">
                  ✅ Hotel confirmation uploaded
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid md:grid-cols-2 gap-4 pt-4 border-t">
        <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/30">
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

        <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/30">
          <Hotel className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium">Accommodation</p>
            <p className="text-xs text-muted-foreground">
              {form.watch("requiresAccommodation")
                ? "Overnight stay required"
                : "Not required"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
