import { Schema, model, Document, models, Model } from "mongoose";

export interface IMedia extends Document {
  type: "image" | "video";
  src: string; // Cloudinary URL
  thumbnail?: string;
  title: string;
  description?: string;
  category: "photos" | "videos" | "reels" | "behind-the-scenes" | "hero";
  date?: string;
  width?: number;
  height?: number;
  isHero: boolean; // Mark if this is the hero section video
  order: number; // For sorting
  createdAt?: Date;
  updatedAt?: Date;
}

const MediaSchema = new Schema<IMedia>(
  {
    type: {
      type: String,
      enum: ["image", "video"],
      required: true,
    },
    src: {
      type: String,
      required: true,
    },
    // thumbnail: {
    //   type: String,
    //   default: "",
    // },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      enum: ["photos", "videos", "reels", "behind-the-scenes", "hero"],
      required: true,
    },
    date: {
      type: String,
      default: "",
    },
    width: {
      type: Number,
      default: 1200,
    },
    height: {
      type: Number,
      default: 800,
    },
    isHero: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

// Ensure only one hero video exists
MediaSchema.pre("save", async function () {
  if (this.isHero && this.isModified("isHero")) {
    const MediaModel = this.constructor as Model<IMedia>;
    await MediaModel.updateMany(
      { isHero: true, _id: { $ne: this._id } },
      { isHero: false },
    );
  }
});

const Media = models.Media || model<IMedia>("Media", MediaSchema);

export default Media;
