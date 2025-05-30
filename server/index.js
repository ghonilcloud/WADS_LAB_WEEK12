import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import swaggerUi from "swagger-ui-express";
import router from "./routes/authRoutes.js"; 
import swaggerSpec from './utils/swagger.js';
import process from 'process';

import todoRoute from "./routes/todoRoute.js";
import usersRoute from "./routes/usersRoute.js";
dotenv.config();

const app = express();

app.use(express.json());
app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
    exposedHeaders: ['Authorization'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(cookieParser());
app.use("/service", router);

const CONNECTION_URL = process.env.CONNECTION_URL
const PORT = process.env.PORT

app.use("/service/todo", todoRoute)
app.use("/service/user", usersRoute)

// api documentation endpoint
app.use("/todolist/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customSiteTitle: "Todo List Management API",
}))

mongoose.set("strictQuery", true)

// Start the server
mongoose.connect(CONNECTION_URL)
    .then(() => app.listen(PORT, () => console.log(`Server running on port: ${PORT}`)))
    .catch((error) => console.log(error.message));
