import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// Routes
import authRoutes from "./routes/auth.routes.js";
import transactionRoutes from "./routes/transaction.routes.js";
import budgetRoutes from "./routes/budget.routes.js";
import reportRoutes from "./routes/report.routes.js";
import insightRoutes from "./routes/insight.routes.js";
import voiceRoutes from "./routes/voice.routes.js";
import savingsGoalRoutes from "./routes/savingsGoalRoutes.js";
import investmentGoalRoutes from "./routes/investmentGoalRoutes.js";
import bankRoutes from "./routes/bank.routes.js";
import ocrRoutes from "./routes/ocr.routes.js";

// Load env
dotenv.config();

const app = express();

/* ==========================================
   TRUST PROXY (Required for Render / Vercel)
========================================== */
app.set("trust proxy", 1);

/* ==========================================
   CORS CONFIG (Production Ready)
========================================== */

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:3000",
  "http://localhost:3001",
  "https://personal-finance-tracker-kappa-ten.vercel.app",
  "https://personal-finance-tracker-038lie8m1-lalithkotas-projects.vercel.app",
  "https://personal-finance-tracker-8ezy.onrender.com"
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests without origin (Postman, mobile apps)
      if (!origin) return callback(null, true);

      // Allow exact allowed origins
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Allow all Vercel and Render preview/production deployments
      if (origin.endsWith(".vercel.app") || origin.endsWith(".onrender.com")) {
        return callback(null, true);
      }

      // Reject others
      return callback(new Error("❌ Not allowed by CORS: " + origin));
    },

    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],

    credentials: true,
  })
);

/* ==========================================
   ✅ MIDDLEWARE
 ========================================== */

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

/* ==========================================
   ✅ API ROUTES
 ========================================== */

app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/insights", insightRoutes);
app.use("/api/voice", voiceRoutes);
app.use("/api/savings-goals", savingsGoalRoutes);
app.use("/api/investment-goals", investmentGoalRoutes);
app.use("/api/bank", bankRoutes);
app.use("/api/ocr", ocrRoutes);

/* ==========================================
   ✅ HEALTH CHECK ROUTE
 ========================================== */

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "🚀 Server is running",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  });
});

/* ==========================================
   ❌ GLOBAL ERROR HANDLER
 ========================================== */

app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);

  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

/* ==========================================
   ✅ 404 HANDLER
 ========================================== */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

/* ==========================================
   ✅ MONGODB CONNECTION
 ========================================== */

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb://127.0.0.1:27017/personal-finance-tracker";

const PORT = process.env.PORT || 5002;

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("✅ MongoDB connected successfully");

    /* Handle server errors */
    const server = app.listen(PORT, () => {
      console.log(`🔥 Server running on port ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
    });

    server.on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        console.error(`❌ Port ${PORT} already in use`);
        process.exit(1);
      } else {
        console.error("❌ Server error:", err);
      }
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });

/* ==========================================
   GRACEFUL SHUTDOWN
========================================== */

process.on("SIGINT", async () => {
  console.log("🛑 Shutting down server...");
  await mongoose.connection.close();
  console.log("✅ MongoDB disconnected");
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("🛑 SIGTERM received");
  await mongoose.connection.close();
  process.exit(0);
});
