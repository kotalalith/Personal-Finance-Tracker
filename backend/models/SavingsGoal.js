import mongoose from "mongoose";

const savingsGoalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  goalName: { type: String, required: true },
  targetAmount: { type: Number, required: true },
  currentSaved: { type: Number, default: 0 },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date, required: true },
  achieved: { type: Boolean, default: false },
});

export default mongoose.model("SavingsGoal", savingsGoalSchema);
