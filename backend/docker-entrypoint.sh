#!/bin/sh
set -e

# Wait for MongoDB to be ready using Node.js
echo "Waiting for MongoDB..."
node -e "
const mongoose = require('mongoose');
const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongo:27017/meetingapp';

async function waitForMongo() {
  let connected = false;
  while (!connected) {
    try {
      await mongoose.connect(MONGO_URI);
      await mongoose.connection.db.admin().ping();
      connected = true;
      console.log('MongoDB is up!');
      await mongoose.connection.close();
    } catch (err) {
      console.log('MongoDB is unavailable - sleeping');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
}

waitForMongo();
"

echo "Checking if database needs seeding..."

# Check if users collection exists and has documents using Node.js
USERS_COUNT=$(node -e "
const mongoose = require('mongoose');
const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongo:27017/meetingapp';

(async () => {
  try {
    await mongoose.connect(MONGO_URI);
    const count = await mongoose.connection.db.collection('users').countDocuments();
    await mongoose.connection.close();
    console.log(count);
  } catch (err) {
    console.log('0');
  }
})();
" 2>/dev/null || echo "0")

if [ "$USERS_COUNT" = "0" ] || [ -z "$USERS_COUNT" ]; then
  echo "Database is empty - running seed script..."
  node src/scripts/seed.js
  echo "Seed completed!"
else
  echo "Database already has data - skipping seed"
fi

# Start the application
echo "Starting application..."
exec node src/server.js
