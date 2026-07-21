import { Schema, model, Document, models } from "mongoose";

export interface IBooking extends Document {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  eventDate: Date;
  eventTime: string;
  eventLocation: string;
  eventType: string;
  status: "pending" | "confirmed" | "cancelled";
  eventCountry: string;
  eventState: string;
  providesFlight: boolean;
  cannotAffordFlight: boolean;
  requiresAccommodation: boolean;
  flightTicketUrl?: string | null;
  hotelTicketUrl?: string | null;
  // logisticsVerified: boolean;
}

const bookingSchema = new Schema<IBooking>(
  {
    clientName: { type: String, required: true },
    clientEmail: { type: String, required: true },
    clientPhone: { type: String, required: true },
    eventDate: { type: Date, required: true },
    eventTime: { type: String, required: true },
    eventLocation: { type: String, required: true },
    eventType: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },

    // Location Fields
    eventCountry: { type: String, required: true },
    eventState: { type: String, required: true },

    // Dynamic Logistics Options
    providesFlight: { type: Boolean, default: false },
    cannotAffordFlight: { type: Boolean, default: false }, // If they check "can't afford/provide flight"
    requiresAccommodation: { type: Boolean, default: false },

    // Secure Document Upload URLs
    flightTicketUrl: { type: String, default: null },
    hotelTicketUrl: { type: String, default: null },

    // Admin Audit Status
    // logisticsVerified: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

const Booking = models.Booking || model<IBooking>("Booking", bookingSchema);

export default Booking;
