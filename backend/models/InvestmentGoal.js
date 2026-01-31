import mongoose from "mongoose";

const investmentGoalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  goalName: { type: String, required: true },
  targetAmount: { type: Number, required: true },
  currentAmount: { type: Number, default: 0 },
  assetType: {
    type: String,
    enum: ["Stocks", "Crypto", "Mutual Funds", "Real Estate", "Gold", "Silver", "Others"],
    default: "Stocks",
  },
  expectedReturnRate: { type: Number, default: 0 }, // In percentage
  deadline: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("InvestmentGoal", investmentGoalSchema);
