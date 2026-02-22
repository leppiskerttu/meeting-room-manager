import request from "supertest";
import app from "../app.js";
import Room from "../models/Room.js";
import User from "../models/User.js";
import Booking from "../models/Booking.js";
import { signAccessToken } from "../utils/jwt.js";

describe("Bookings API", () => {
  let adminToken;
  let userToken;
  let userId;
  let roomId;

  beforeEach(async () => {
    // Create admin user
    const admin = await User.create({
      email: "admin@test.com",
      passwordHash: "hash",
      role: "ADMIN",
    });
    adminToken = signAccessToken({ sub: admin._id.toString(), role: "ADMIN" });

    // Create regular user
    const user = await User.create({
      email: "user@test.com",
      passwordHash: "hash",
      role: "USER",
    });
    userId = user._id.toString();
    userToken = signAccessToken({ sub: userId, role: "USER" });

    // Create room
    const room = await Room.create({
      name: "Test Room",
      capacity: 10,
    });
    roomId = room._id.toString();
  });

  describe("POST /api/bookings", () => {
    it("should create booking", async () => {
      const startTime = new Date();
      startTime.setHours(startTime.getHours() + 1);
      const endTime = new Date(startTime);
      endTime.setHours(endTime.getHours() + 2);

      const response = await request(app)
        .post("/api/bookings")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          roomId,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
        })
        .expect(201);

      expect(response.body).toHaveProperty("room");
      expect(response.body).toHaveProperty("user");
    });

    it("should prevent overlapping bookings", async () => {
      const startTime = new Date();
      startTime.setHours(startTime.getHours() + 1);
      const endTime = new Date(startTime);
      endTime.setHours(endTime.getHours() + 2);

      // Create first booking
      await Booking.create({
        room: roomId,
        user: userId,
        startTime,
        endTime,
      });

      // Try to create overlapping booking
      await request(app)
        .post("/api/bookings")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          roomId,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
        })
        .expect(400);
    });

    it("should require authentication", async () => {
      await request(app)
        .post("/api/bookings")
        .send({
          roomId,
          startTime: new Date().toISOString(),
          endTime: new Date().toISOString(),
        })
        .expect(401);
    });
  });

  describe("GET /api/bookings/me", () => {
    it("should list user's bookings", async () => {
      const startTime = new Date();
      startTime.setHours(startTime.getHours() + 1);
      const endTime = new Date(startTime);
      endTime.setHours(endTime.getHours() + 2);

      await Booking.create({
        room: roomId,
        user: userId,
        startTime,
        endTime,
      });

      const response = await request(app)
        .get("/api/bookings/me")
        .set("Authorization", `Bearer ${userToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });
});

