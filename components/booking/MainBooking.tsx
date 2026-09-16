"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  BookingFormSchema,
  BookingFormValues,
} from "@/app/backend/validators/validators";
import { StepIndicator } from "./StepIndicator";
import { Step1EventDetails } from "./Step1-EventDetails";
import { Step2Logistics } from "./Step2-Logistics";
import { Step3ClientInfo } from "./Step3-ClientInfo";
import { Step4Deposit } from "./Step4Deposit";
import { Step4Review } from "./Step4-Review";
import { BookingSuccessModal } from "./BookingSuccessModal";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Check, PartyPopper } from "lucide-react";

const ExtendedBookingSchema = BookingFormSchema;

// Mock booked dates - replace with API call
const mockBookedDates = [
  new Date(2026, 6, 20),
  new Date(2026, 6, 25),
  new Date(2026, 7, 1),
];

// Type for the submitted booking (for the modal)
interface SubmittedBooking {
  _id: string;
  clientName: string;
  clientEmail: string;
  eventType: string;
  eventDate: string | Date;
  eventTime: string;
  eventLocation: string;
  eventState: string;
}

export function MainBooking() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [bookedDates, setBookedDates] = useState<Date[]>(mockBookedDates);

  // Success modal state
  const [showSuccess, setShowSuccess] = useState(false);
  const [submittedBooking, setSubmittedBooking] =
    useState<SubmittedBooking | null>(null);

  const totalSteps = 5;
  const stepLabels = [
    "Event Details",
    "Logistics",
    "Your Info",
    "Deposit",
    "Review",
  ];

  const form = useForm<BookingFormValues>({
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
      depositConfirmed: false,
      depositReceiptUrl: null,
      termsAccepted: false,
    } as BookingFormValues,
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
      } catch {}
    };
    fetchBookedDates();
  }, []);

  const nextStep = async () => {
    const fields = getStepFields(currentStep);
    const isValid = await form.trigger(
      fields as Array<keyof z.infer<typeof ExtendedBookingSchema>>,
    );

    if (!isValid) {
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
        return ["depositConfirmed", "depositReceiptUrl"];
      case 5:
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
        const message =
          (result as any)?.error ||
          (result as any)?.message ||
          "Booking failed";
        toast.error(message);
        throw new Error(message);
      }

      setSubmittedBooking({
        _id: result.data._id,
        clientName: data.clientName,
        clientEmail: data.clientEmail,
        eventType: data.eventType,
        eventDate: data.eventDate,
        eventTime: data.eventTime,
        eventLocation: data.eventLocation,
        eventState: data.eventState,
      });

      // Open the success modal
      setShowSuccess(true);

      toast.success("Booking submitted successfully!", {
        icon: <PartyPopper className="h-4 w-4" />,
      });

      form.reset();
      setCurrentStep(1);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to submit booking. Please try again.";
      form.setError("root", {
        message,
      });
      toast.error(message);
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
        return <Step4Deposit form={form} />;
      case 5:
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
    <div className="md:w-4xl w-full mx-auto px-4 py-8">
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

      {currentStep === totalSteps && (
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

      {/* Success Modal */}
      <BookingSuccessModal
        open={showSuccess}
        onOpenChange={(open) => {
          setShowSuccess(open);
          if (!open) form.reset();
        }}
        booking={submittedBooking}
      />
    </div>
  );
}
