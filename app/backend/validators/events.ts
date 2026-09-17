import { z } from "zod";

export const eventSchema = z.object({
  value: z.string().min(1, "Value (slug) is required"),
  label: z.string().min(1, "Label is required"),
  price: z.coerce.number().min(0, "Price must be 0 or greater"),
  description: z.string().min(1, "Description is required"),
  src: z.string().url("Must be a valid URL"),
  depositRate: z.coerce.number().min(0).max(100).default(30),
});

export type EventFormData = z.input<typeof eventSchema>;

export type EventData = z.output<typeof eventSchema>;

export interface EventType extends EventData {
  _id: string;
}
