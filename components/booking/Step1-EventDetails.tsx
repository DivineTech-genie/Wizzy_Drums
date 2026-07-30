"use client";

import { UseFormReturn } from "react-hook-form";
import { BoldCalendar } from "./BoldCalendar";
import { Calendar as CalendarIcon } from "lucide-react";
import { CustomInputField } from "../CustomForm";

interface Step1EventDetailsProps {
  form: UseFormReturn<any>;
  bookedDates: Date[];
  onDateSelect: (date: Date) => void;
}

export function Step1EventDetails({
  form,
  bookedDates,
  onDateSelect,
}: Step1EventDetailsProps) {
  const selectedDate = form.watch("eventDate")
    ? new Date(form.watch("eventDate"))
    : null;

  // Format date for display (DD/MM/YYYY)
  const formatDisplayDate = (date: Date | null) => {
    if (!date) return "";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-heading font-bold">Event Details</h2>
        <p className="text-muted-foreground text-sm">
          Tell us about your event so we can prepare the perfect experience
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Left Column - Form Fields */}
        <div className="space-y-4">
          {/* Event Type */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Event Type
            </label>
            <select
              {...form.register("eventType")}
              className="w-full px-4 py-2.5 rounded-xl border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            >
              <option value="Wedding">Wedding</option>
              <option value="Nightclub">Nightclub</option>
              <option value="Corporate">Corporate Show</option>
              <option value="Festival">Festival</option>
            </select>
            {form.formState.errors.eventType && (
              <p className="text-red-500 text-xs mt-1">
                {form.formState.errors.eventType.message}
              </p>
            )}
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
            />
          </div>

          <CustomInputField
            form={form}
            name="eventTime"
            label="Event Time"
            type="time"
            placeholder="19:30"
          />

          {/* Display selected date */}
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
