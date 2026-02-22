import { StatusCodes } from "http-status-codes";
import * as bookingService from "../services/bookingService.js";

export async function createBooking(req, res, next) {
  try {
    const { roomId, startTime, endTime } = req.body;
    const booking = await bookingService.createBooking({
      roomId,
      userId: req.user.id,
      startTime,
      endTime,
    });
    return res.status(StatusCodes.CREATED).json(booking);
  } catch (err) {
    return next(err);
  }
}

export async function getMyBookings(req, res, next) {
  try {
    const bookings = await bookingService.listUserBookings(req.user.id);
    return res.status(StatusCodes.OK).json(bookings);
  } catch (err) {
    return next(err);
  }
}

export async function getAllBookings(req, res, next) {
  try {
    const bookings = await bookingService.listAllBookings();
    return res.status(StatusCodes.OK).json(bookings);
  } catch (err) {
    return next(err);
  }
}

export async function cancelBooking(req, res, next) {
  try {
    await bookingService.cancelBooking({
      bookingId: req.params.id,
      userId: req.user.id,
      isAdmin: req.user.role === "ADMIN",
    });
    return res.status(StatusCodes.NO_CONTENT).send();
  } catch (err) {
    return next(err);
  }
}


