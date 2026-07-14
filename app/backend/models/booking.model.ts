import {Schema, model, Document, models} from 'mongoose';

export interface IBooking extends Document {
    clientName: string,
    clientEmail: string,
    clientPhone: string,
    eventDate: Date,
    eventTime: string,
    eventLocation: string,
    eventType: string,
    status: "pending" | "confirmed" | "cancelled",
}

const bookingSchema = new Schema<IBooking>({
    clientName: { type: String, required: true },
    clientEmail: { type: String, required: true },
    clientPhone: { type: String, required: true },
    eventDate: { type: Date, required: true },
    eventTime: { type: String, required: true },
    eventLocation: { type: String, required: true },
    eventType: { type: String, required: true },
    status: { type: String, enum: ["pending", "confirmed", "cancelled"], default: "pending" },
}, {
    timestamps: true,
});

const Booking = models.Booking || model<IBooking>('Booking', bookingSchema);

export default Booking;