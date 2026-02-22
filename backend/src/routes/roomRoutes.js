import { Router } from "express";
import Joi from "joi";
import { authRequired, requireRole } from "../middlewares/auth.js";
import { validateBody } from "../middlewares/validate.js";
import {
  getRooms,
  createRoom,
  updateRoom,
  deleteRoom,
} from "../controllers/roomController.js";

const router = Router();

/**
 * @swagger
 * /rooms:
 *   get:
 *     summary: List all rooms
 *     tags: [Rooms]
 *     security: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search rooms by name
 *       - in: query
 *         name: minCapacity
 *         schema:
 *           type: integer
 *         description: Filter by minimum capacity
 *     responses:
 *       200:
 *         description: List of rooms
 */

const roomSchema = Joi.object({
  name: Joi.string().min(1).required(),
  capacity: Joi.number().integer().min(1).required(),
  equipment: Joi.array().items(Joi.string()).default([]),
  description: Joi.string().allow("").default(""),
});

router.get("/", getRooms);

/**
 * @swagger
 * /rooms:
 *   post:
 *     summary: Create a new room (ADMIN only)
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - capacity
 *             properties:
 *               name:
 *                 type: string
 *               capacity:
 *                 type: integer
 *                 minimum: 1
 *               description:
 *                 type: string
 *               equipment:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Room created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not admin)
 */
router.post(
  "/",
  authRequired,
  requireRole("ADMIN"),
  validateBody(roomSchema),
  createRoom,
);

/**
 * @swagger
 * /rooms/{id}:
 *   put:
 *     summary: Update a room (ADMIN only)
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               capacity:
 *                 type: integer
 *               description:
 *                 type: string
 *               equipment:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Room updated successfully
 *       404:
 *         description: Room not found
 */
router.put(
  "/:id",
  authRequired,
  requireRole("ADMIN"),
  validateBody(roomSchema),
  updateRoom,
);

/**
 * @swagger
 * /rooms/{id}:
 *   delete:
 *     summary: Delete a room (ADMIN only)
 *     tags: [Rooms]
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
 *         description: Room deleted successfully
 *       404:
 *         description: Room not found
 */
router.delete(
  "/:id",
  authRequired,
  requireRole("ADMIN"),
  deleteRoom,
);

export default router;


