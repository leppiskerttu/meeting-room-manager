import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Room from "../models/Room.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/meetingapp";

const rooms = [
  {
    name: "Executive Conference Room",
    capacity: 20,
    description: "Premium meeting room with panoramic city views",
    equipment: ["Projector", "Whiteboard", "Video Conferencing", "Coffee Machine"],
  },
  {
    name: "Innovation Lab",
    capacity: 15,
    description: "Creative space for brainstorming and collaboration",
    equipment: ["Smart Board", "Video Conferencing", "Wireless Charging"],
  },
  {
    name: "Small Meeting Room A",
    capacity: 4,
    description: "Intimate space for small team meetings",
    equipment: ["TV Screen", "Whiteboard"],
  },
  {
    name: "Small Meeting Room B",
    capacity: 4,
    description: "Cozy room for quick discussions",
    equipment: ["TV Screen"],
  },
  {
    name: "Training Room",
    capacity: 30,
    description: "Large space for workshops and training sessions",
    equipment: ["Projector", "Sound System", "Whiteboard", "Microphones"],
  },
  {
    name: "Boardroom",
    capacity: 12,
    description: "Formal meeting space for executive discussions",
    equipment: ["Video Conferencing", "Projector", "Conference Phone"],
  },
  {
    name: "Collaboration Hub",
    capacity: 8,
    description: "Flexible space for team collaboration",
    equipment: ["Smart Board", "Video Conferencing"],
  },
  {
    name: "Quiet Room",
    capacity: 2,
    description: "Small space for one-on-one meetings",
    equipment: ["TV Screen"],
  },
  {
    name: "Presentation Hall",
    capacity: 50,
    description: "Large auditorium-style room for presentations",
    equipment: ["Projector", "Sound System", "Stage", "Microphones", "Recording Equipment"],
  },
  {
    name: "Team Room Alpha",
    capacity: 6,
    description: "Medium-sized room for team meetings",
    equipment: ["Projector", "Whiteboard", "Video Conferencing"],
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    // Clear existing data (optional - comment out if you want to keep existing data)
    await User.deleteMany({});
    await Room.deleteMany({});
    console.log("Cleared existing data");

    // Create admin user
    const adminPassword = "admin123";
    const adminPasswordHash = await bcrypt.hash(adminPassword, 10);
    const admin = await User.create({
      email: "admin@example.com",
      passwordHash: adminPasswordHash,
      role: "ADMIN",
    });
    console.log(`✅ Created admin user: ${admin.email} (password: ${adminPassword})`);

    // Create regular user
    const userPassword = "user123";
    const userPasswordHash = await bcrypt.hash(userPassword, 10);
    const user = await User.create({
      email: "user@example.com",
      passwordHash: userPasswordHash,
      role: "USER",
    });
    console.log(`✅ Created user: ${user.email} (password: ${userPassword})`);

    // Create rooms
    const createdRooms = await Room.insertMany(rooms);
    console.log(`✅ Created ${createdRooms.length} rooms`);

    console.log("\n🎉 Seeding completed successfully!");
    console.log("\nTest credentials:");
    console.log("Admin: admin@example.com / admin123");
    console.log("User:  user@example.com / user123");

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seed();

