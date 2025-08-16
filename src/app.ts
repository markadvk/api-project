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

// ✅ Parse allowed origins from .env
const allowedOrigins = process.env.CORS_ORIGIN?.split(",") || [];

// ✅ Middleware
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(morgan("dev"));

// ✅ Health check (for Render)
app.get("/", (req, res) => {
  res.json({ message: "API is running ✅" });
});

// ✅ Debug route for DB connection
app.get("/db-test", async (req, res) => {
  try {
    await prisma.$connect();
    const result = await prisma.$queryRawUnsafe(`SELECT NOW();`);
    res.json({ status: "✅ Connected to DB", time: result });
  } catch (err: any) {
    console.error("❌ DB connection failed:", err);
    res.status(500).json({ status: "❌ DB connection failed", error: err.message });
  }
});

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/table", tableRoutes);

// ✅ Error handler
app.use(errorHandler);

export default app;
