import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    capacity: {
      type: Number,
      required: true,
      min: 1,
    },
    equipment: {
      type: [String],
      default: [],
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: false } },
);

// Indexes for performance
roomSchema.index({ name: "text" }); // Text search
roomSchema.index({ capacity: 1 }); // Capacity filtering
roomSchema.index({ createdAt: -1 }); // Sorting by creation date

const Room = mongoose.model("Room", roomSchema);

export default Room;


