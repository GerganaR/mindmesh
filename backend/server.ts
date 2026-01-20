import express from "express";
import cors from "cors";
import connectDB from "./db";
import graphRoutes from "./routes/graphRoutes";

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Register routes
app.use("/api/graph", graphRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));