import request from "supertest";
import app from "../app.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

describe("Auth API", () => {
  describe("POST /api/auth/register", () => {
    it("should register a new user", async () => {
      const response = await request(app)
        .post("/api/auth/register")
        .send({
          email: "test@example.com",
          password: "password123",
        })
        .expect(201);

      expect(response.body).toHaveProperty("email", "test@example.com");
      expect(response.body).toHaveProperty("role", "USER");
      expect(response.body).not.toHaveProperty("passwordHash");
    });

    it("should reject duplicate email", async () => {
      await User.create({
        email: "duplicate@example.com",
        passwordHash: "hash",
        role: "USER",
      });

      await request(app)
        .post("/api/auth/register")
        .send({
          email: "duplicate@example.com",
          password: "password123",
        })
        .expect(400);
    });

    it("should validate email format", async () => {
      await request(app)
        .post("/api/auth/register")
        .send({
          email: "invalid-email",
          password: "password123",
        })
        .expect(400);
    });

    it("should validate password length", async () => {
      await request(app)
        .post("/api/auth/register")
        .send({
          email: "test@example.com",
          password: "12345",
        })
        .expect(400);
    });
  });

  describe("POST /api/auth/login", () => {
    beforeEach(async () => {
      const passwordHash = await bcrypt.hash("password123", 10);
      await User.create({
        email: "user@example.com",
        passwordHash,
        role: "USER",
      });
    });

    it("should login with valid credentials", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "user@example.com",
          password: "password123",
        })
        .expect(200);

      expect(response.body).toHaveProperty("accessToken");
      expect(response.body).toHaveProperty("user");
      expect(response.headers["set-cookie"]).toBeDefined();
    });

    it("should reject invalid credentials", async () => {
      await request(app)
        .post("/api/auth/login")
        .send({
          email: "user@example.com",
          password: "wrongpassword",
        })
        .expect(401);
    });
  });
});

