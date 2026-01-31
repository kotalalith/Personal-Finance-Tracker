import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// Route imports
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

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Routes
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

// ✅ Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Server is running 🚀",
  });
});

// MongoDB connection
const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb://127.0.0.1:27017/personal-finance-tracker";

const PORT = process.env.PORT || 5000;

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("✅ MongoDB connected successfully");
    app.listen(PORT, () =>
      console.log(`🔥 Server running on port ${PORT}`)
    );
  })
  .catch((error) => {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  });
