import { z } from "zod";
import { isEasternNigeriaState } from "../../../lib/eastern-states";

export const CreateBookingSchema = z
  .object({
    clientName: z.string().min(2, "Name must be at least 2 characters long"),
    clientEmail: z
      .string()
      .email("Invalid email address")
      .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email address format"),
    clientPhone: z.string().min(5, "Phone number must be valid"),
    eventDate: z.string().min(1, "Event date is required"),
    eventTime: z
      .string()
      .regex(
        /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
        "Time must be in HH:MM format",
      ),
    eventLocation: z.string().min(3, "Location description must be valid"),
    eventType: z.string().min(2, "Event type description required"),
    eventCountry: z.string().min(1, "Country is required"),
    eventState: z.string().min(1, "State is required"),
    providesFlight: z.boolean().default(false),
    cannotAffordFlight: z.boolean().default(false),
    requiresAccommodation: z.boolean().default(false),
    depositConfirmed: z.boolean().default(false),
    flightTicketUrl: z.string().url().nullable(),
    hotelTicketUrl: z.string().url().nullable(),
  })
  .superRefine((data, ctx) => {
    const eventCountry = data.eventCountry.trim().toLowerCase();
    const eventState = data.eventState.trim().toLowerCase();
    const isEastern = isEasternNigeriaState(eventState);
    const outsideEasternNigeria = eventCountry !== "nigeria" || !isEastern;

    if (data.providesFlight && !data.flightTicketUrl?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["flightTicketUrl"],
        message: "Flight ticket URL is required when you will provide flights",
      });
    }

    // Require a flight arrangement only for bookings outside Eastern Nigeria
    if (
      !isEastern &&
      outsideEasternNigeria &&
      !data.providesFlight &&
      !data.cannotAffordFlight
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["providesFlight"],
        message: "Please choose a flight arrangement option.",
      });
    }

    if (data.requiresAccommodation && !data.hotelTicketUrl?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["hotelTicketUrl"],
        message: "Hotel ticket URL is required when accommodation is required",
      });
    }

    if (!data.depositConfirmed) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["depositConfirmed"],
        message: "Please confirm the deposit to lock your event date.",
      });
    }
  });

// end of CreateBookingSchema.superRefine

export const BookingFormSchema = CreateBookingSchema.extend({
  specialRequests: z.string().default(""),
  termsAccepted: z.boolean().default(false),
  depositReceiptUrl: z.string().url().nullable(),
}).superRefine((data, ctx) => {
  if (data.depositConfirmed && !data.depositReceiptUrl?.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["depositReceiptUrl"],
      message: "Please upload a deposit receipt to secure the booking.",
    });
  }
});

export type BookingFormValues = z.input<typeof BookingFormSchema>;
