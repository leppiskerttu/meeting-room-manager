import { Router } from "express";
import Joi from "joi";
import { authRequired, requireRole } from "../middlewares/auth.js";
import { validateBody } from "../middlewares/validate.js";
import {
  createBooking,
  getMyBookings,
  getAllBookings,
  cancelBooking,
} from "../controllers/bookingController.js";

const router = Router();

/**
 * @swagger
 * /bookings:
 *   post:
 *     summary: Create a new booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - roomId
 *               - startTime
 *               - endTime
 *             properties:
 *               roomId:
 *                 type: string
 *               startTime:
 *                 type: string
 *                 format: date-time
 *               endTime:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Booking created successfully
 *       400:
 *         description: Validation error or overlapping booking
 */

const createBookingSchema = Joi.object({
  roomId: Joi.string().required(),
  startTime: Joi.date().iso().required(),
  endTime: Joi.date().iso().required(),
});

router.post(
  "/",
  authRequired,
  validateBody(createBookingSchema),
  createBooking,
);

/**
 * @swagger
 * /bookings/me:
 *   get:
 *     summary: Get current user's bookings
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's bookings
 */
router.get("/me", authRequired, getMyBookings);

/**
 * @swagger
 * /bookings:
 *   get:
 *     summary: Get all bookings (ADMIN only)
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all bookings
 *       403:
 *         description: Forbidden (not admin)
 */
router.get(
  "/",
  authRequired,
  requireRole("ADMIN"),
  getAllBookings,
);

/**
 * @swagger
 * /bookings/{id}:
 *   delete:
 *     summary: Cancel/delete a booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Booking cancelled successfully
 *       403:
 *         description: Forbidden (can only cancel own bookings unless admin)
 *       404:
 *         description: Booking not found
 */
router.delete("/:id", authRequired, cancelBooking);

export default router;


