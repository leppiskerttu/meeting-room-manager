import request from "supertest";
import app from "../app.js";
import Room from "../models/Room.js";
import User from "../models/User.js";
import { signAccessToken } from "../utils/jwt.js";

describe("Rooms API", () => {
  let adminToken;
  let userToken;

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
    userToken = signAccessToken({ sub: user._id.toString(), role: "USER" });
  });

  describe("GET /api/rooms", () => {
    beforeEach(async () => {
      await Room.create([
        { name: "Room 1", capacity: 10 },
        { name: "Room 2", capacity: 20 },
      ]);
    });

    it("should list rooms without authentication", async () => {
      const response = await request(app)
        .get("/api/rooms")
        .expect(200);

      expect(response.body).toHaveProperty("items");
      expect(response.body).toHaveProperty("total");
      expect(response.body.items).toHaveLength(2);
    });

    it("should support pagination", async () => {
      const response = await request(app)
        .get("/api/rooms?page=1&limit=1")
        .expect(200);

      expect(response.body.items).toHaveLength(1);
      expect(response.body.pageSize).toBe(1);
    });

    it("should support search", async () => {
      const response = await request(app)
        .get("/api/rooms?search=Room 1")
        .expect(200);

      expect(response.body.items).toHaveLength(1);
      expect(response.body.items[0].name).toBe("Room 1");
    });

    it("should filter by capacity", async () => {
      const response = await request(app)
        .get("/api/rooms?minCapacity=15")
        .expect(200);

      expect(response.body.items).toHaveLength(1);
      expect(response.body.items[0].capacity).toBeGreaterThanOrEqual(15);
    });
  });

  describe("POST /api/rooms", () => {
    it("should create room as admin", async () => {
      const response = await request(app)
        .post("/api/rooms")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "New Room",
          capacity: 15,
          description: "Test room",
          equipment: ["Projector"],
        })
        .expect(201);

      expect(response.body).toHaveProperty("name", "New Room");
      expect(response.body).toHaveProperty("capacity", 15);
    });

    it("should reject non-admin users", async () => {
      await request(app)
        .post("/api/rooms")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          name: "New Room",
          capacity: 15,
        })
        .expect(403);
    });

    it("should require authentication", async () => {
      await request(app)
        .post("/api/rooms")
        .send({
          name: "New Room",
          capacity: 15,
        })
        .expect(401);
    });
  });
});

