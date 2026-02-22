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

// Note: email index is automatically created by unique: true in schema

const User = mongoose.model("User", userSchema);

export default User;


