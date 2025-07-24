import mongoose, { Schema, models, model } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    image: { type: String, default: "" },
    slug: { type: String, unique: true, lowercase: true, trim: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

export default models.User || model("User", UserSchema);
