// src/app.ts
import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

import authRoutes from "./routes/authRoutes";
import tableRoutes from "./routes/tableRoutes";
import { errorHandler } from "./middleware/errorHandler";

dotenv.config();

const app = express();
const prisma = new PrismaClient();

// ✅ Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(",") || "*",
  credentials: true,
}));
app.use(express.json());
app.use(morgan("dev"));

// ✅ Health check route (needed for Render)
app.get("/", (req, res) => {
  res.json({ message: "API is running ✅" });
});

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/table", tableRoutes);

// ✅ Error handler
app.use(errorHandler);

// ✅ Connect Prisma (log DB status)
(async () => {
  try {
    await prisma.$connect();
    console.log("✅ Connected to DB");
  } catch (err) {
    console.error("❌ DB Connection failed:", err);
  }
})();

export default app;
