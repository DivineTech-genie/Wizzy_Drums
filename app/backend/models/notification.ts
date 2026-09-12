import { Schema, model, Document, models } from "mongoose";

export interface INotification extends Document {
  userId: string; // admin ID
  title: string;
  message: string;
  type: "booking" | "logistics" | "reminder" | "system";
  read: boolean;
  link?: string;
  createdAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    userId: { type: String, required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ["booking", "logistics", "reminder", "system"],
      default: "system",
    },
    read: { type: Boolean, default: false },
    link: { type: String },
  },
  { timestamps: true },
);

const Notification =
  models.Notification ||
  model<INotification>("Notification", notificationSchema);
export default Notification;
