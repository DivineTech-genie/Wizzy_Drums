// app/backend/validators/validators.ts
import { z } from "zod";

export const CreateBookingSchema = z.object({
  clientName: z.string().min(2, "Name must be at least 2 characters long"),
  clientEmail: z
    .string()
    .email("Invalid email address")
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email address format"),
  clientPhone: z.string().min(5, "Phone number must be valid"),
  // 👇 CHANGED: Just a string, no transform
  eventDate: z.string().min(1, "Event date is required"),
  eventTime: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Time must be in HH:MM format"),
  eventLocation: z.string().min(3, "Location description must be valid"),
  eventType: z.string().min(2, "Event type description required"),
  eventCountry: z.string().min(1, "Country is required"),
  eventState: z.string().min(1, "State is required"),
  providesFlight: z.boolean().default(false),
  cannotAffordFlight: z.boolean().default(false),
  requiresAccommodation: z.boolean().default(false),
  // Optional file URLs (not required for validation)
  flightProvision: z.string().optional(),
  flightTicketUrl: z.string().url().optional().nullable(),
  hotelTicketUrl: z.string().url().optional().nullable(),
});
