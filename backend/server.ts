import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectDB from "./config/db";
import graphRoutes from "./routes/graphRoutes";
import { errorHandler } from "./middleware/errorMiddleware";

// Connect to MongoDB
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Register routes
app.use("/api/graph", graphRoutes);

// Error Handling Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
