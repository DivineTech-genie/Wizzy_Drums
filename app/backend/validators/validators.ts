import { z } from "zod";

export const CreateBookingSchema = z.object({
  clientName: z.string().min(2, "Name must be at least 2 characters long"),
  clientEmail: z
    .string()
    .email("Invalid email address")
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email address format"),
  clientPhone: z.string().min(5, "Phone number must be valid"),
  eventDate: z.string().transform((str) => new Date(str)), // Automatically converts incoming date string to a real JS Date object
  eventTime: 
    z.string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Time must be in HH:MM format"),
  eventLocation: z.string().min(3, "Location description must be valid"),
  eventType: z.string().min(2, "Event type description required"),
});
