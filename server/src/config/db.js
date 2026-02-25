import mongoose from 'mongoose';

export async function connectDatabase() {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error('MONGODB_URI is required in server/.env');
  }

  await mongoose.connect(mongoUri);
  console.log('✅ MongoDB connected');
}
