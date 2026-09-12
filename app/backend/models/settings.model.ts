import { Schema, model, Document, models } from "mongoose";

export interface ISetting extends Document {
  key: string;
  value: unknown;
}

const settingSchema = new Schema<ISetting>(
  {
    key: { type: String, required: true, unique: true, index: true },
    value: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: true },
);

const Setting = models.Setting || model<ISetting>("Setting", settingSchema);
export default Setting;
