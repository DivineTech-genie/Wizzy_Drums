"use client";

import { IBooking } from "@/app/backend/models/booking.model";
import React, { useState } from "react";

type BookingFormData = Pick<
  IBooking,
  | "clientName"
  | "clientEmail"
  | "clientPhone"
  | "eventTime"
  | "eventLocation"
  | "eventType"
> & {
  eventDate: Date;
};

export default function BookingForm() {
  const [formData, setFormData] = useState<BookingFormData>({
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    eventDate: new Date(),
    eventTime: "",
    eventLocation: "",
    eventType: "Wedding",
  });

  const [dateInputString, setDateInputString] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    if (name === "eventDate") {
      setDateInputString(value);
      setFormData((prev) => ({ ...prev, eventDate: new Date(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Clear error highlights when the user starts correcting their inputs
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFieldErrors({});
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 400 && result.errors) {
          setFieldErrors(result.errors);
          setErrorMessage(
            "Validation failed. Please correct the highlighted fields.",
          );
        } else {
          setErrorMessage(result.message || "An unexpected error occurred.");
        }
        return;
      }

      setSuccessMessage(result.message);
      setFormData({
        clientName: "",
        clientEmail: "",
        clientPhone: "",
        eventDate: new Date(),
        eventTime: "",
        eventLocation: "",
        eventType: "Wedding",
      });
      setDateInputString("");
    } catch (error) {
      console.error("Submission error:", error);
      setErrorMessage("Failed to connect to the server.");
    } finally {
      setLoading(false);
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

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Client Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Your Name
          </label>
          <input
            type="text"
            name="clientName"
            value={formData.clientName}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          {fieldErrors.clientName && (
            <p className="text-red-500 text-xs mt-1">
              {fieldErrors.clientName[0]}
            </p>
          )}
        </div>

        {/* Client Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            name="clientEmail"
            value={formData.clientEmail}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          {fieldErrors.clientEmail && (
            <p className="text-red-500 text-xs mt-1">
              {fieldErrors.clientEmail[0]}
            </p>
          )}
        </div>

        {/* Client Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            name="clientPhone"
            value={formData.clientPhone}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          {fieldErrors.clientPhone && (
            <p className="text-red-500 text-xs mt-1">
              {fieldErrors.clientPhone[0]}
            </p>
          )}
        </div>

        {/* Event Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Event Type
          </label>
          <select
            name="eventType"
            value={formData.eventType}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Wedding">Wedding</option>
            <option value="Nightclub">Nightclub</option>
            <option value="Corporate">Corporate Show</option>
            <option value="Festival">Festival</option>
          </select>
        </div>

        {/* Event Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Event Location
          </label>
          <input
            type="text"
            name="eventLocation"
            value={formData.eventLocation}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          {fieldErrors.eventLocation && (
            <p className="text-red-500 text-xs mt-1">
              {fieldErrors.eventLocation[0]}
            </p>
          )}
        </div>

        {/* Date and Time */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Event Date
            </label>
            <input
              type="date"
              name="eventDate"
              value={dateInputString}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {fieldErrors.eventDate && (
              <p className="text-red-500 text-xs mt-1">
                {fieldErrors.eventDate[0]}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Time (HH:MM)
            </label>
            <input
              type="text"
              name="eventTime"
              placeholder="19:30"
              value={formData.eventTime}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {fieldErrors.eventTime && (
              <p className="text-red-500 text-xs mt-1">
                {fieldErrors.eventTime[0]}
              </p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded focus:outline-none transition duration-150 disabled:bg-blue-400"
        >
          {loading ? "Processing Reserve..." : "Submit Booking"}
        </button>
      </form>
    </div>
  );
}
