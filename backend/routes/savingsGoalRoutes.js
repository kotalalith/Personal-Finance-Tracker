import express from "express";
import SavingsGoal from "../models/SavingsGoal.js";

const router = express.Router();

// ✅ Create a new savings goal
router.post("/", async (req, res) => {
  try {
    const goal = await SavingsGoal.create(req.body);
    res.status(201).json(goal);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get all goals for a user
router.get("/:userId", async (req, res) => {
  try {
    const goals = await SavingsGoal.find({ userId: req.params.userId });
    res.json(goals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Update goal progress
router.put("/:id", async (req, res) => {
  try {
    const goal = await SavingsGoal.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(goal);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
