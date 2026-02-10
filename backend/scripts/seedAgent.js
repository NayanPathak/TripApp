require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/trip-itinerary';

async function seed() {
  await mongoose.connect(MONGODB_URI);
  const existing = await User.findOne({ email: 'agent@example.com' });
  if (existing) {
    console.log('Agent already exists:', existing.email);
    process.exit(0);
    return;
  }
  await User.create({
    email: 'agent@example.com',
    password: 'agent123',
    role: 'agent',
    name: 'Travel Agent',
  });
  console.log('Created agent: agent@example.com / agent123');
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
