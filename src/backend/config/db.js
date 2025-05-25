import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Get the directory name properly in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// First try to load from src/.env (where we've been putting it)
let envPath = path.resolve(__dirname, '../../.env');
if (!fs.existsSync(envPath)) {
  // Fall back to the root .env if src/.env doesn't exist
  envPath = path.resolve(__dirname, '../../../.env');
}

// Debug the environment loading
console.log(`Trying to load .env from: ${envPath}`);
console.log(`File exists: ${fs.existsSync(envPath)}`);

// Load env vars
dotenv.config({ path: envPath });

// Debug MongoDB connection string
console.log(`MongoDB connection string: ${process.env.URL_CONNECTION ? 'Defined' : 'Undefined'}`);

const connectDB = async () => {
  try {
    if (!process.env.URL_CONNECTION) {
      throw new Error('MongoDB connection string is undefined. Please check your .env file.');
    }
    
    const conn = await mongoose.connect(process.env.URL_CONNECTION);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;