import Booking from "../models/Booking.js";
import ApiError from "../utils/ApiError.js";
import { StatusCodes } from "http-status-codes";
import logger from "../utils/logger.js";

export async function createBooking({ roomId, userId, startTime, endTime }) {
  if (new Date(startTime) >= new Date(endTime)) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "startTime must be before endTime",
    );
  }

  const booking = await Booking.create({
    room: roomId,
    user: userId,
    startTime,
    endTime,
  });

  logger.info("Booking created", {
    bookingId: booking._id,
    roomId,
    userId,
    startTime,
    endTime,
  });

  return booking;
}

export async function listUserBookings(userId) {
  // Only show future bookings (endTime >= now)
  const now = new Date();
  return Booking.find({ 
    user: userId,
    endTime: { $gte: now }
  })
    .populate("room")
    .sort({ startTime: 1 });
}

export async function listAllBookings() {
  // Only show future bookings (endTime >= now)
  const now = new Date();
  return Booking.find({ 
    endTime: { $gte: now }
  })
    .populate("room")
    .populate("user", "email role")
    .sort({ startTime: 1 });
}

export async function deleteExpiredBookings() {
  const now = new Date();
  const result = await Booking.deleteMany({
    endTime: { $lt: now }
  });
  
  if (result.deletedCount > 0) {
    logger.info("Deleted expired bookings", { count: result.deletedCount });
  }
  
  return result.deletedCount;
}

export async function cancelBooking({ bookingId, userId, isAdmin }) {
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Booking not found");
  }

  if (!isAdmin && booking.user.toString() !== userId) {
    throw new ApiError(StatusCodes.FORBIDDEN, "Cannot cancel this booking");
  }

  await booking.deleteOne();
  
  logger.info("Booking cancelled", {
    bookingId,
    userId,
    isAdmin,
  });
}


