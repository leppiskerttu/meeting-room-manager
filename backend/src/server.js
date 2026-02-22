import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./app.js";
import { deleteExpiredBookings } from "./services/bookingService.js";
import logger from "./utils/logger.js";

dotenv.config();

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/meetingapp";

// Validate required environment variables
function validateEnv() {
  const required = ["JWT_ACCESS_SECRET", "JWT_REFRESH_SECRET"];
  const missing = required.filter((key) => !process.env[key]);
  
  if (missing.length > 0) {
    logger.error("Missing required environment variables", { missing });
    logger.error("Please create a .env file in the backend/ directory with:");
    logger.error("JWT_ACCESS_SECRET=your-secret-here");
    logger.error("JWT_REFRESH_SECRET=your-refresh-secret-here");
    process.exit(1);
  }
}

// Clean up expired bookings every hour (3600000 ms)
const CLEANUP_INTERVAL = 60 * 60 * 1000; // 1 hour

async function cleanupExpiredBookings() {
  try {
    const deletedCount = await deleteExpiredBookings();
    if (deletedCount > 0) {
      logger.info("Cleaned up expired bookings", { deletedCount });
    }
  } catch (err) {
    logger.error("Error cleaning up expired bookings", { error: err.message, stack: err.stack });
  }
}

async function start() {
  validateEnv();
  
  try {
    await mongoose.connect(MONGO_URI);
    logger.info("Connected to MongoDB", { uri: MONGO_URI.replace(/\/\/.*@/, "//***@") });

    // Start cleanup job: runs every hour
    setInterval(cleanupExpiredBookings, CLEANUP_INTERVAL);
    logger.info("Expired bookings cleanup scheduled", { interval: "1 hour" });

    app.listen(PORT, () => {
      logger.info("API server started", { port: PORT, env: process.env.NODE_ENV || "development" });
    });
  } catch (err) {
    logger.error("Failed to start server", { error: err.message, stack: err.stack });
    process.exit(1);
  }
}

start();


