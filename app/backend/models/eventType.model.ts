import { Schema, model, Document, models } from "mongoose";

export interface IEvents extends Document {
  value: string;
  label: string;
  price: number;
  description: string;
  src: string;
  depositRate: number;
}

const EventTypeSchema = new Schema<IEvents>({
  value: { type: String, required: true, unique: true },
  label: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, default: "" },
  src: { type: String, default: "" },
  depositRate: { type: Number, default: 30 },
});

const EventsOptions =
  models.EventOptions || model<IEvents>("EventOptions", EventTypeSchema);

export default EventsOptions;
