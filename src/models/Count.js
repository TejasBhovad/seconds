import mongoose, { Schema, models, model } from "mongoose";

const CountSchema = new Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    date: { type: Date, required: true },
    theme: { type: String, default: "default" },
    colors: {
      primary: { type: String, default: "#000000" },
      muted: { type: String, default: "#FFFFFF" },
      inverted: { type: String, default: "#000000" },
      background: { type: String, default: "#F0F0F0" },
    },
    image: { type: String, default: "" },
    slug: { type: String, unique: true, lowercase: true, trim: true },
    rsvpLink: { type: String, default: "" },
    emails: { type: [String], default: [] },
    createdAt: { type: Date, default: Date.now },
    creator: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
);

const Count = models.Count || model("Count", CountSchema);

export default Count;
