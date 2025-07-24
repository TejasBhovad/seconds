import mongoose, { Schema, models, model } from "mongoose";

const CountSchema = new Schema(
    {
        name: { type: String, required: true },
        date: { type: Date, required: true },
        image: { type: String, default: "" },
        slug: { type: String, unique: true, lowercase: true, trim: true },
        time: {
            hours: { type: Number, required: true, min: 0, max: 23 },
            minutes: { type: Number, required: true, min: 0, max: 59 },
            seconds: { type: Number, required: true, min: 0, max: 59 }
        }
    },  
    { timestamps: true }
);

const Count = models.Count || model("Count", CountSchema);

export default Count;