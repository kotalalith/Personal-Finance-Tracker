import express from 'express';
import { body, validationResult, query } from 'express-validator';
import Budget from '../models/Budget.model.js';
import Transaction from '../models/Transaction.model.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// ✅ All routes require authentication
router.use(protect);

/* -------------------------------------------
   GET /api/budgets
   Fetch all budgets for the logged-in user
------------------------------------------- */
router.get(
  '/',
  [
    query('month').optional().isInt({ min: 1, max: 12 }),
    query('year').optional().isInt(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { month, year } = req.query;
      const filter = { user: req.user._id };

      const now = new Date();

      // ✅ FIX: convert query params to numbers
      const currentMonth = month ? Number(month) : now.getMonth() + 1;
      const currentYear = year ? Number(year) : now.getFullYear();

      filter.month = currentMonth;
      filter.year = currentYear;

      const budgets = await Budget.find(filter);

      // ✅ Calculate spent, remaining & percentage
      const budgetsWithProgress = await Promise.all(
        budgets.map(async (budget) => {
          const startDate = new Date(currentYear, currentMonth - 1, 1);
          const endDate = new Date(
            currentYear,
            currentMonth,
            0,
            23,
            59,
            59
          );

          const expenses = await Transaction.find({
            user: req.user._id,
            type: 'expense',
            category: budget.category,
            date: { $gte: startDate, $lte: endDate },
          });

          const spent = expenses.reduce((sum, t) => sum + t.amount, 0);
          const remaining = budget.amount - spent;
          const percentage = (spent / budget.amount) * 100;

          return {
            ...budget.toObject(),
            spent,
            remaining,
            percentage: percentage.toFixed(2),
          };
        })
      );

      res.json(budgetsWithProgress);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

/* -------------------------------------------
   POST /api/budgets
   Create or update a budget
------------------------------------------- */
router.post(
  '/',
  [
    body('category').notEmpty().withMessage('Category is required'),
    body('amount').isFloat({ min: 0 }).withMessage('Amount must be positive'),
    body('period').optional().isIn(['weekly', 'monthly']),
    body('month').optional().isInt({ min: 1, max: 12 }),
    body('year').optional().isInt(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { category, amount, period = 'monthly', month, year } = req.body;

      const now = new Date();
      const budgetMonth = month ? Number(month) : now.getMonth() + 1;
      const budgetYear = year ? Number(year) : now.getFullYear();

      // ✅ Check if budget already exists
      const existingBudget = await Budget.findOne({
        user: req.user._id,
        category,
        period,
        month: budgetMonth,
        year: budgetYear,
      });

      if (existingBudget) {
        existingBudget.amount = amount;
        await existingBudget.save();
        return res.status(200).json(existingBudget);
      }

      // ✅ Create new budget
      const budget = await Budget.create({
        user: req.user._id,
        category,
        amount,
        period,
        month: budgetMonth,
        year: budgetYear,
      });

      res.status(201).json(budget);
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).json({
          message: 'Budget already exists for this category and period',
        });
      }
      res.status(500).json({ message: error.message });
    }
  }
);

/* -------------------------------------------
   PUT /api/budgets/:id
   Update a budget
------------------------------------------- */
router.put(
  '/:id',
  [body('amount').optional().isFloat({ min: 0 })],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const budget = await Budget.findOne({
        _id: req.params.id,
        user: req.user._id,
      });

      if (!budget) {
        return res.status(404).json({ message: 'Budget not found' });
      }

      if (req.body.amount !== undefined) {
        budget.amount = req.body.amount;
      }

      await budget.save();
      res.json(budget);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

/* -------------------------------------------
   DELETE /api/budgets/:id
   Delete a budget
------------------------------------------- */
router.delete('/:id', async (req, res) => {
  try {
    const budget = await Budget.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    await Budget.deleteOne({ _id: req.params.id });
    res.json({ message: 'Budget deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
