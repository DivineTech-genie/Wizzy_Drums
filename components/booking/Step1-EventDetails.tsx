"use client";

import { UseFormReturn, Controller } from "react-hook-form";
import { BoldCalendar } from "./BoldCalendar";
import { parse } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { CustomInputField } from "../CustomForm";
import { BookingFormValues } from "@/app/backend/validators/validators";
import { useBookingPricing } from "@/hooks/useBookingPricing";
import { useEvents } from "@/hooks/useEvents";
import { appendSuffixIfMissing } from "@/lib/form-helpers";

interface Step1EventDetailsProps {
  form: UseFormReturn<BookingFormValues>;
  bookedDates: Date[];
  onDateSelect: (date: Date) => void;
}

export function Step1EventDetails({
  form,
  bookedDates,
  onDateSelect,
}: Step1EventDetailsProps) {
  const eventType = form.watch("eventType") || "Wedding";

  const { events, loading: eventsLoading, error: eventsError } = useEvents();

  const {
    eventPrice,
    depositRate,
    depositAmount,
    isLoading: pricingLoading,
  } = useBookingPricing(eventType);

  const selectedDate = form.watch("eventDate")
    ? parse(form.watch("eventDate"), "yyyy-MM-dd", new Date())
    : null;

  const formatDisplayDate = (date: Date | null) => {
    if (!date) return "";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Combined loading state
  if (eventsLoading || pricingLoading) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-heading font-bold">Event Details</h2>
          <p className="text-muted-foreground text-sm">
            Loading event types...
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="h-12 bg-gray-200 rounded-xl animate-pulse" />
            <div className="h-32 bg-gray-200 rounded-3xl animate-pulse" />
            <div className="h-12 bg-gray-200 rounded-xl animate-pulse" />
            <div className="grid grid-cols-2 gap-4">
              <div className="h-12 bg-gray-200 rounded-xl animate-pulse" />
              <div className="h-12 bg-gray-200 rounded-xl animate-pulse" />
            </div>
            <div className="h-12 bg-gray-200 rounded-xl animate-pulse" />
          </div>
          <div className="flex justify-center">
            <div className="h-80 w-full bg-gray-200 rounded-xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (eventsError) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-heading font-bold">Event Details</h2>
          <p className="text-red-500 text-sm">
            Failed to load event types. Please refresh the page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-heading font-bold">Event Details</h2>
        <p className="text-muted-foreground text-sm">
          Tell us about your event so we can prepare the perfect experience
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Left Column - Form Fields */}
        <div className="space-y-4">
          {/* Event Type - Dynamic from Database */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Event Type
            </label>
            <select
              {...form.register("eventType")}
              className="w-full px-4 py-2.5 rounded-xl border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            >
              {events.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label} — ₦{option.price.toLocaleString()}
                </option>
              ))}
            </select>
            {form.formState.errors.eventType?.message && (
              <p className="text-red-500 text-xs mt-1">
                {String(form.formState.errors.eventType.message)}
              </p>
            )}
          </div>

          {/* Price & Deposit Display */}
          <div className="rounded-3xl border border-primary/10 bg-primary/5 p-4 mt-3">
            <p className="text-sm text-muted-foreground">
              Estimated booking quote
            </p>
            <p className="mt-2 text-3xl font-heading font-bold text-primary">
              ₦{eventPrice.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Secure your date with a {depositRate}% deposit of ₦
              {depositAmount.toLocaleString()}.
            </p>
          </div>

          <CustomInputField
            form={form}
            name="eventLocation"
            label="Venue / Location"
            placeholder="Eko Hotels, Victoria Island, Lagos"
          />

          <div className="grid grid-cols-2 gap-4">
            <CustomInputField
              form={form}
              name="eventCountry"
              label="Country"
              placeholder="Nigeria"
            />

            <CustomInputField
              form={form}
              name="eventState"
              label="State / Region"
              placeholder="Lagos, Enugu, Abuja"
              onBlur={() => appendSuffixIfMissing(form, "eventState", "State")}
            />
          </div>

          <CustomInputField
            form={form}
            name="eventTime"
            label="Event Time"
            type="time"
            placeholder="19:30"
          />

          {selectedDate && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-primary/5 border border-primary/10">
              <CalendarIcon className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Selected Date</p>
                <p className="text-lg font-heading font-bold text-primary">
                  {formatDisplayDate(selectedDate)}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Calendar */}
        <div className="flex justify-center">
          <BoldCalendar
            selectedDate={selectedDate}
            onSelectDate={onDateSelect}
            bookedDates={bookedDates}
            minDate={new Date()}
          />
        </div>
      </div>
    </div>
  );
}
