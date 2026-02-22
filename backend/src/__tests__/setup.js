import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// Use test database
const TEST_MONGO_URI = process.env.TEST_MONGO_URI || "mongodb://localhost:27017/meetingapp_test";

// Set test environment variables if not set
if (!process.env.JWT_ACCESS_SECRET) {
  process.env.JWT_ACCESS_SECRET = "test-access-secret";
}
if (!process.env.JWT_REFRESH_SECRET) {
  process.env.JWT_REFRESH_SECRET = "test-refresh-secret";
}

beforeAll(async () => {
  await mongoose.connect(TEST_MONGO_URI);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});
