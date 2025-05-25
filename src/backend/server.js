import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import taskRoutes from './routes/taskRoutes.js';

// Get the directory name properly in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the root .env file
const envPath = path.resolve(__dirname, '../../.env');
console.log(`Loading .env from: ${envPath}`);
dotenv.config({ path: envPath });

// Connect to MongoDB
connectDB();

const app = express();
const port = process.env.PORT || 5000;

// Log all incoming requests for debugging
app.use((req, res, next) => {
  console.log('=== Incoming Request ===');
  console.log(`${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  console.log('==================');
  next();
});

// Simple CORS setup
app.use(
  cors({
    origin: '*',
    credentials: false,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin'],
  })
);

// Debug middleware to check if CORS headers are applied
app.use((req, res, next) => {
  console.log('CORS headers set on response:', {
    'access-control-allow-origin': res.getHeader('Access-Control-Allow-Origin'),
    'access-control-allow-methods': res.getHeader('Access-Control-Allow-Methods'),
    'access-control-allow-headers': res.getHeader('Access-Control-Allow-Headers')
  });
  next();
});

app.use(express.json());

// Routes
app.use('/api/auth', userRoutes);
app.use('/api/tasks', taskRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});