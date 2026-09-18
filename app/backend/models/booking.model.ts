import { Schema, model, Document, models } from "mongoose";
import { isOutsideEast } from "../../../lib/eastern-states";

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
  depositReceiptUrl?: string | null;
  logisticsVerified: boolean;
  adminNote?: string;
  createdAt?: Date;
  updatedAt?: Date;
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
    logisticsVerified: { type: Boolean, default: false },
    adminNote: { type: String, default: "" },

    // Secure Document Upload URLs
    flightTicketUrl: { type: String, default: null },
    hotelTicketUrl: { type: String, default: null },
    depositReceiptUrl: { type: String, default: null },
  },
  {
    timestamps: true,
  },
);

bookingSchema.pre("validate", function () {
  const doc = this as IBooking;
  const outsideEast = isOutsideEast(
    doc.eventState || "",
    doc.eventCountry || "",
  );

  if (outsideEast) {
    if (!doc.providesFlight && !doc.cannotAffordFlight) {
      throw new Error(
        "For events outside the East, either providesFlight or cannotAffordFlight must be selected.",
      );
    }
    if (!doc.requiresAccommodation) {
      throw new Error(
        "Accommodation for one person is required for events outside the East.",
      );
    }
  }
});

bookingSchema.index(
  { eventDate: 1 },
  {
    unique: true,
    partialFilterExpression: { status: "confirmed" },
  },
);

const Booking = models.Booking || model<IBooking>("Booking", bookingSchema);

export default Booking;
