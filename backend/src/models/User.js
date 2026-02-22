import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: false } },
);

// Indexes for performance
userSchema.index({ email: 1 }); // Unique index (already exists, but explicit for clarity)

const User = mongoose.model("User", userSchema);

export default User;


