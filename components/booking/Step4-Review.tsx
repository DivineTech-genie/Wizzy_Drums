"use client";

import { UseFormReturn } from "react-hook-form";
import { Check, Calendar, User, Plane } from "lucide-react";
import { BookingFormValues } from "@/app/backend/validators/validators";
import { useBookingPricing } from "@/hooks/useBookingPricing";

interface Step4ReviewProps {
  form: UseFormReturn<BookingFormValues>;
  onConfirm: () => void;
  isLoading: boolean;
}

export function Step4Review({ form, onConfirm, isLoading }: Step4ReviewProps) {
  const data = form.getValues();

  // 🔥 Use the pricing hook
  const {
    eventPrice,
    depositRate,
    depositAmount,
    flightDepositAmount,
    totalDeposit,
    isLoading: pricingLoading,
  } = useBookingPricing(data.eventType, data.cannotAffordFlight);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "Not set";
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const sections = [
    {
      title: "Event Details",
      icon: Calendar,
      items: [
        { label: "Event Type", value: data.eventType || "Not set" },
        { label: "Date", value: formatDate(data.eventDate) },
        { label: "Time", value: data.eventTime || "Not set" },
        { label: "Location", value: data.eventLocation || "Not set" },
        { label: "State", value: data.eventState || "Not set" },
        { label: "Country", value: data.eventCountry || "Not set" },
      ],
    },
    {
      title: "Travel & Logistics",
      icon: Plane,
      items: [
        {
          label: "Flight Arrangement",
          value: data.providesFlight
            ? "I will provide flights"
            : data.cannotAffordFlight
              ? "Charge flights to quote"
              : "Not specified",
        },
        {
          label: "Accommodation",
          value: data.requiresAccommodation
            ? "Overnight stay required"
            : "Not required",
        },
        {
          label: "Flight Ticket",
          value: data.flightTicketUrl ? (
            <span className="inline-flex items-center gap-1">
              <Check className="h-3.5 w-3.5" />
              Uploaded
            </span>
          ) : (
            "Not uploaded"
          ),
        },
        {
          label: "Hotel Confirmation",
          value: data.hotelTicketUrl ? (
            <span className="inline-flex items-center gap-1">
              <Check className="h-3.5 w-3.5" />
              Uploaded
            </span>
          ) : (
            "Not uploaded"
          ),
        },
      ],
    },
    {
      title: "Client Information",
      icon: User,
      items: [
        { label: "Full Name", value: data.clientName || "Not set" },
        { label: "Email", value: data.clientEmail || "Not set" },
        { label: "Phone", value: data.clientPhone || "Not set" },
        { label: "Special Requests", value: data.specialRequests || "None" },
      ],
    },
  ];

  // Loading state
  if (pricingLoading) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-heading font-bold">
            Review Your Booking
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
        <h2 className="text-2xl font-heading font-bold">Review Your Booking</h2>
        <p className="text-muted-foreground text-sm">
          Please verify all details before submitting
        </p>
      </div>

      <div className="rounded-3xl border border-primary/10 bg-primary/5 p-5 text-center">
        <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">
          Estimated event quote
        </p>
        <p className="mt-2 text-3xl font-heading font-bold text-primary">
          ₦{eventPrice.toLocaleString()}
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          Minimum deposit to secure your date: ₦{totalDeposit.toLocaleString()}{" "}
          ({depositRate}%
          {data.cannotAffordFlight
            ? ` + ₦${flightDepositAmount.toLocaleString()} flight deposit`
            : ""}
          )
        </p>
      </div>

      {/* Sections */}
      <div className="space-y-6">
        {sections.map((section) => (
          <div
            key={section.title}
            className="rounded-xl border bg-card overflow-hidden"
          >
            <div className="flex items-center gap-3 p-4 border-b bg-muted/20">
              <section.icon className="h-5 w-5 text-primary" />
              <h3 className="font-heading font-semibold">{section.title}</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-2 p-4">
              {section.items.map((item) => (
                <div
                  key={item.label}
                  className="flex justify-between py-1.5 px-2 rounded-lg hover:bg-muted/30 transition-colors"
                >
                  <span className="text-sm text-muted-foreground">
                    {item.label}
                  </span>
                  <span className="text-sm font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Terms & Submit */}
      <div className="space-y-4 pt-4 border-t">
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="terms"
            className="mt-1 h-4 w-4 rounded border-primary/20 text-primary focus:ring-primary/20"
            onChange={(e) => form.setValue("termsAccepted", e.target.checked)}
          />
          <label htmlFor="terms" className="text-sm text-muted-foreground">
            I confirm that all information provided is accurate. I understand
            that a deposit may be required to secure my booking date, and the
            final quote will be sent within 24-48 hours.
          </label>
        </div>

        <button
          type="button"
          onClick={onConfirm}
          disabled={isLoading || !form.watch("termsAccepted")}
          className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
              Submitting...
            </>
          ) : (
            <>
              <Check className="h-5 w-5" />
              Confirm & Submit Booking
            </>
          )}
        </button>
      </div>
    </div>
  );
}
