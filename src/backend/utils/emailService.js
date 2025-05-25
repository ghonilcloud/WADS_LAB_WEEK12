import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name properly in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Make sure environment variables are loaded
const envPath = path.resolve(__dirname, '../../../.env');
dotenv.config({ path: envPath });

// Create reusable transporter using SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

export const sendVerificationEmail = async (userEmail, verificationToken) => {
  // Debug email credentials
  console.log('Email service using credentials:', { 
    user: process.env.EMAIL_USER, 
    passSet: !!process.env.EMAIL_PASSWORD 
  });
  
  const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify?token=${verificationToken}`;
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: 'Verify Your Email - ToDoSome',
    html: `
      <h1>Welcome to ToDoSome!</h1>
      <p>Please click the link below to verify your email address:</p>
      <a href="${verificationUrl}">Verify Email</a>
      <p>If you didn't create this account, you can ignore this email.</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
};