import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: false } },
);

// Indexes for performance
bookingSchema.index({ room: 1, startTime: 1, endTime: 1 }); // Overlap queries (critical for performance)
bookingSchema.index({ user: 1, startTime: 1 }); // User bookings queries
bookingSchema.index({ endTime: 1 }); // Expired bookings cleanup
bookingSchema.index({ startTime: 1 }); // Sorting by start time

// Prevent overlapping bookings:
// newStart < existingEnd AND newEnd > existingStart
bookingSchema.pre("save", async function checkOverlap(next) {
  try {
    const Booking = this.constructor;

    const overlapping = await Booking.findOne({
      room: this.room,
      _id: { $ne: this._id },
      startTime: { $lt: this.endTime },
      endTime: { $gt: this.startTime },
    });

    if (overlapping) {
      const err = new Error("Booking overlaps with an existing booking");
      err.statusCode = 400;
      return next(err);
    }

    return next();
  } catch (err) {
    return next(err);
  }
});

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;


