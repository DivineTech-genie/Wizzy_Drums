"use client";

import { useState } from "react";
import { SubmitHandler, useForm, useWatch } from "react-hook-form"; // 👈 IMPORT useWatch
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CreateBookingSchema } from "@/app/backend/validators/validators";
import { uploadFileToCloudinary } from "@/lib/upload-file";
import { CustomInputField } from "./CustomForm";
import { TravelLogisticsForm } from "./Travel.logistics";

type BookingFormData = z.infer<typeof CreateBookingSchema>;

export default function BookingForm() {
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [uploadingFlight, setUploadingFlight] = useState(false);
  const [uploadingHotel, setUploadingHotel] = useState(false);

  const form = useForm<z.input<typeof CreateBookingSchema>>({
    resolver: zodResolver(CreateBookingSchema),
    defaultValues: {
      clientName: "",
      clientEmail: "",
      clientPhone: "",
      eventDate: new Date().toISOString().split("T")[0],
      eventTime: "",
      eventLocation: "",
      eventType: "Wedding",
      eventCountry: "",
      eventState: "",
      providesFlight: false,
      cannotAffordFlight: false,
      flightProvision: "",
      requiresAccommodation: false,
      flightTicketUrl: null,
      hotelTicketUrl: null,
    },
  });

  // 👇 FIX: Use useWatch to avoid React Compiler warning
  const eventState = useWatch({ control: form.control, name: "eventState" });

  const onSubmit: SubmitHandler<BookingFormData> = async (data) => {
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 400 && result.errors) {
          const fieldErrors: Record<string, { message: string }> = {};
          for (const [key, messages] of Object.entries(result.errors)) {
            if (Array.isArray(messages) && messages.length > 0) {
              fieldErrors[key] = { message: messages[0] };
            }
          }
          Object.entries(fieldErrors).forEach(([name, error]) => {
            form.setError(name as any, error);
          });
          setErrorMessage(
            "Validation failed. Please correct the highlighted fields.",
          );
        } else {
          setErrorMessage(result.message || "An unexpected error occurred.");
        }
        return;
      }

      setSuccessMessage("Booking submitted successfully! 🎉");
      form.reset();
    } catch (error) {
      console.error("Submission error:", error);
      setErrorMessage("Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  // File upload handlers (same as before)
  const handleFlightFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingFlight(true);
    try {
      const url = await uploadFileToCloudinary(file);
      form.setValue("flightTicketUrl", url);
    } catch (error) {
      console.error("Flight upload error:", error);
      setErrorMessage("Failed to upload flight ticket.");
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
    try {
      const url = await uploadFileToCloudinary(file);
      form.setValue("hotelTicketUrl", url);
    } catch (error) {
      console.error("Hotel upload error:", error);
      setErrorMessage("Failed to upload hotel confirmation.");
    } finally {
      setUploadingHotel(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md border border-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
        Book Your Performance
      </h2>

      {successMessage && (
        <div className="mb-4 p-3 bg-green-50 text-green-700 border border-green-200 rounded text-center font-medium">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded text-center font-medium">
          {errorMessage}
        </div>
      )}

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Use CustomInputField for all basic fields */}
        <CustomInputField
          form={form}
          name="clientName"
          label="Your Name"
          placeholder="Enter your full name"
        />
        <CustomInputField
          form={form}
          name="clientEmail"
          label="Email Address"
          type="email"
          placeholder="your@email.com"
        />
        <CustomInputField
          form={form}
          name="clientPhone"
          label="Phone Number"
          type="tel"
          placeholder="080 1234 5678"
        />

        {/* Event Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Event Type
          </label>
          <select
            {...form.register("eventType")}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          label="Event Location (Venue/Address)"
          placeholder="e.g., Eko Hotels, Lagos"
        />

        {/* Country and State */}
        <div className="grid grid-cols-2 gap-4">
          <CustomInputField
            form={form}
            name="eventCountry"
            label="Country"
            placeholder="e.g., Nigeria"
          />
          <CustomInputField
            form={form}
            name="eventState"
            label="State/Region"
            placeholder="e.g., Enugu, Lagos"
          />
        </div>

        {/* Date and Time */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Event Date
            </label>
            <input
              type="date"
              {...form.register("eventDate")}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {form.formState.errors.eventDate && (
              <p className="text-red-500 text-xs mt-1">
                {form.formState.errors.eventDate.message}
              </p>
            )}
          </div>
          <CustomInputField
            form={form}
            name="eventTime"
            label="Time (HH:MM)"
            placeholder="19:30"
          />
        </div>

        {/* Travel Logistics Section - only shows if state is entered */}
        {eventState && eventState.trim() !== "" && (
          <TravelLogisticsForm form={form} />
        )}

        {/* 👇 FILE UPLOADS - HANDLED IN MAIN FORM (Option 1) */}
        {eventState && eventState.trim().toLowerCase() !== "enugu" && (
          <div className="space-y-4 border-t border-gray-200 pt-4">
            {/* Flight upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload Flight Ticket (if you&apos;re providing it)
              </label>
              <input
                type="file"
                accept=".pdf,image/*"
                onChange={handleFlightFileUpload}
                disabled={uploadingFlight}
                className="block w-full text-xs text-gray-400 file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer disabled:opacity-50"
              />
              {uploadingFlight && (
                <p className="text-xs text-blue-500 mt-1">Uploading...</p>
              )}
              {form.watch("flightTicketUrl") && (
                <p className="text-xs text-green-600 mt-1">
                  ✅ Flight ticket uploaded
                </p>
              )}
            </div>

            {/* Hotel upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload Hotel Reservation Confirmation
              </label>
              <input
                type="file"
                accept=".pdf,image/*"
                onChange={handleHotelFileUpload}
                disabled={uploadingHotel}
                className="block w-full text-xs text-gray-400 file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer disabled:opacity-50"
              />
              {uploadingHotel && (
                <p className="text-xs text-blue-500 mt-1">Uploading...</p>
              )}
              {form.watch("hotelTicketUrl") && (
                <p className="text-xs text-green-600 mt-1">
                  ✅ Hotel confirmation uploaded
                </p>
              )}
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded focus:outline-none transition duration-150 disabled:bg-blue-400"
        >
          {loading ? "Processing..." : "Submit Booking"}
        </button>
      </form>
    </div>
  );
}
