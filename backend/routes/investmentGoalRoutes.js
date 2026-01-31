import express from "express";
import InvestmentGoal from "../models/InvestmentGoal.js";

const router = express.Router();

// ✅ Create a new investment goal
router.post("/", async (req, res) => {
    try {
        const goal = await InvestmentGoal.create(req.body);
        res.status(201).json(goal);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ Get all investment goals for a user
router.get("/:userId", async (req, res) => {
    try {
        const goals = await InvestmentGoal.find({ userId: req.params.userId });
        res.json(goals);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ Update investment goal progress
router.put("/:id", async (req, res) => {
    try {
        const goal = await InvestmentGoal.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(goal);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ Delete an investment goal
router.delete("/:id", async (req, res) => {
    try {
        await InvestmentGoal.findByIdAndDelete(req.params.id);
        res.json({ message: "Investment goal deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ Generic Invest Endpoint (Gold, Silver, etc.)
router.post("/invest", async (req, res) => {
    const { userId, goalId, amount, assetType, price } = req.body;

    try {
        // 1. Find the Savings Goal
        const SavingsGoal = (await import("../models/SavingsGoal.js")).default;
        const Transaction = (await import("../models/Transaction.model.js")).default; // Import Transaction

        const savingsGoal = await SavingsGoal.findById(goalId);

        if (!savingsGoal) {
            return res.status(404).json({ message: "Savings goal not found" });
        }

        if (savingsGoal.currentSaved < amount) {
            return res.status(400).json({ message: "Insufficient funds in savings goal" });
        }

        // 2. Deduct from Savings Goal
        savingsGoal.currentSaved -= amount;
        await savingsGoal.save();

        // 3. Create or Update Investment Goal
        const investment = await InvestmentGoal.create({
            userId,
            goalName: `${assetType} Investment from ${savingsGoal.goalName}`,
            targetAmount: amount,
            currentAmount: amount,
            assetType: assetType, // "Gold", "Silver", "Mutual Funds", etc.
            deadline: new Date(new Date().setFullYear(new Date().getFullYear() + 1)) // Default 1 year
        });

        // 4. Create Expense Transaction (To reduce Available Balance)
        await Transaction.create({
            userId,
            type: "expense",
            category: "Investment",
            amount: amount,
            description: `Invested in ${assetType} via ${savingsGoal.goalName}`,
            date: new Date()
        });

        res.json({
            message: `Successfully invested in ${assetType}`,
            savingsGoal,
            investment
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

export default router;
