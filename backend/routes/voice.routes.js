import express from "express";
import Transaction from "../models/Transaction.model.js";

const router = express.Router();

router.post("/query", async (req, res) => {
  const { query } = req.body;
  const q = query.toLowerCase();

  try {
    let category = "";
    if (q.includes("food")) category = "Food";
    else if (q.includes("travel")) category = "Travel";
    else if (q.includes("rent")) category = "Rent";

    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - 7);

    const transactions = await Transaction.find({
      category: category || { $exists: true },
      type: "expense",
      date: { $gte: startOfWeek }
    });

    const total = transactions.reduce((sum, t) => sum + t.amount, 0);

    res.json({
      reply: category
        ? `You spent ₹${total} on ${category} this week.`
        : `Your total spending this week is ₹${total}.`
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "Error processing your query." });
  }
});

export default router;
