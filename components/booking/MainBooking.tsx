"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CreateBookingSchema } from "@/app/backend/validators/validators";
import { StepIndicator } from "./StepIndicator";
import { Step1EventDetails } from "./Step1-EventDetails";
import { Step2Logistics } from "./Step2-Logistics";
import { Step3ClientInfo } from "./Step3-ClientInfo";
import { Step4Review } from "./Step4-Review";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

// Extend the schema to include specialRequests and termsAccepted
const ExtendedBookingSchema = CreateBookingSchema.extend({
  specialRequests: z.string().optional(),
  termsAccepted: z.boolean().default(false),
});

// Mock booked dates - replace with API call
const mockBookedDates = [
  new Date(2026, 6, 20),
  new Date(2026, 6, 25),
  new Date(2026, 7, 1),
];

export function MainBooking() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [bookedDates, setBookedDates] = useState<Date[]>(mockBookedDates);

  const totalSteps = 4;
  const stepLabels = ["Event Details", "Logistics", "Your Info", "Review"];

  const form = useForm<z.input<typeof ExtendedBookingSchema>>({
    resolver: zodResolver(ExtendedBookingSchema),
    defaultValues: {
      clientName: "",
      clientEmail: "",
      clientPhone: "",
      eventDate: "",
      eventTime: "",
      eventLocation: "",
      eventType: "Wedding",
      eventCountry: "",
      eventState: "",
      providesFlight: false,
      cannotAffordFlight: false,
      requiresAccommodation: false,
      flightTicketUrl: null,
      hotelTicketUrl: null,
      specialRequests: "",
      termsAccepted: false,
    },
  });

  // Fetch booked dates from API
  useEffect(() => {
    const fetchBookedDates = async () => {
      try {
        const response = await fetch("/api/bookings");
        if (response.ok) {
          const data = await response.json();
          if (data.data) {
            const dates = data.data.map(
              (booking: { eventDate: string }) => new Date(booking.eventDate),
            );
            setBookedDates(dates);
          }
        }
      } catch (error) {
        console.error("Failed to fetch booked dates:", error);
      }
    };
    fetchBookedDates();
  }, []);

  const nextStep = async () => {
    const fields = getStepFields(currentStep);
    const isValid = await form.trigger(
      fields as Array<keyof z.infer<typeof ExtendedBookingSchema>>,
    );

    if (!isValid) {
      console.log("Form is invalid");
      return;
    }

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const getStepFields = (step: number): string[] => {
    switch (step) {
      case 1:
        return [
          "eventType",
          "eventDate",
          "eventTime",
          "eventLocation",
          "eventCountry",
          "eventState",
        ];
      case 2:
        return [
          "providesFlight",
          "cannotAffordFlight",
          "requiresAccommodation",
          "flightTicketUrl",
          "hotelTicketUrl",
        ];
      case 3:
        return ["clientName", "clientEmail", "clientPhone"];
      case 4:
        return ["termsAccepted"];
      default:
        return [];
    }
  };

  const handleDateSelect = (date: Date) => {
    form.setValue("eventDate", date.toISOString().split("T")[0]);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const data = form.getValues();
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Booking failed");
      }

      setSuccessMessage("Booking submitted successfully! 🎉");
      form.reset();
      setCurrentStep(1);
    } catch (error) {
      console.error("Submission error:", error);
      form.setError("root", {
        message: "Failed to submit booking. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1EventDetails
            form={form}
            bookedDates={bookedDates}
            onDateSelect={handleDateSelect}
          />
        );
      case 2:
        return <Step2Logistics form={form} />;
      case 3:
        return <Step3ClientInfo form={form} />;
      case 4:
        return (
          <Step4Review
            form={form}
            onConfirm={handleSubmit}
            isLoading={isLoading}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Success Message */}
      {successMessage && (
        <div className="mb-6 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 text-center">
          {successMessage}
        </div>
      )}

      {/* Step Indicator */}
      <div className="mb-8">
        <StepIndicator
          currentStep={currentStep}
          totalSteps={totalSteps}
          labels={stepLabels}
        />
      </div>

      {/* Step Content */}
      <div className="bg-card rounded-2xl border shadow-lg p-6 md:p-8">
        {renderStep()}
      </div>

      {/* Navigation */}
      {currentStep < totalSteps && (
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <Button onClick={() => void nextStep()} className="gap-2">
            Continue
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {currentStep === totalSteps && !successMessage && (
        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={prevStep} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <Button
            onClick={() => {
              const terms = form.getValues("termsAccepted");
              if (!terms) {
                form.setError("termsAccepted", {
                  message: "Please accept the terms",
                });
                return;
              }
              handleSubmit();
            }}
            disabled={isLoading}
            className="gap-2 bg-primary hover:bg-primary/90"
          >
            <Check className="h-4 w-4" />
            {isLoading ? "Submitting..." : "Submit Booking"}
          </Button>
        </div>
      )}
    </div>
  );
}
