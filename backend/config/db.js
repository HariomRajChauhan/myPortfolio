import mongoose from 'mongoose';
import { config } from './env.js';

const connectDB = async () => {
  if (!config.mongoUri) {
    throw new Error('MONGODB_URI is required');
  }

  try {
    const conn = await mongoose.connect(config.mongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw error;
  }
};

export default connectDB;
