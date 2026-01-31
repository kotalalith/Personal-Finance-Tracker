import express from 'express';
import { query, validationResult } from 'express-validator';
import Transaction from '../models/Transaction.model.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// @route   GET /api/reports/monthly
// @desc    Get monthly summary report
// @access  Private
router.get(
  '/monthly',
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
      const now = new Date();
      const reportMonth = month ? parseInt(month) : now.getMonth() + 1;
      const reportYear = year ? parseInt(year) : now.getFullYear();

      const startDate = new Date(reportYear, reportMonth - 1, 1);
      const endDate = new Date(reportYear, reportMonth, 0, 23, 59, 59);

      // Get all transactions for the month
      const transactions = await Transaction.find({
        user: req.user._id,
        date: { $gte: startDate, $lte: endDate },
      });

      // Calculate totals
      const income = transactions
        .filter((t) => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const expenses = transactions
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      const balance = income - expenses;

      // Calculate category-wise expenses
      const categoryExpenses = {};
      transactions
        .filter((t) => t.type === 'expense')
        .forEach((t) => {
          categoryExpenses[t.category] = (categoryExpenses[t.category] || 0) + t.amount;
        });

      // Find top spending category
      const topCategory = Object.keys(categoryExpenses).reduce(
        (a, b) => (categoryExpenses[a] > categoryExpenses[b] ? a : b),
        null
      );

      // Calculate category-wise income
      const categoryIncome = {};
      transactions
        .filter((t) => t.type === 'income')
        .forEach((t) => {
          categoryIncome[t.category] = (categoryIncome[t.category] || 0) + t.amount;
        });

      res.json({
        month: reportMonth,
        year: reportYear,
        totalIncome: income,
        totalExpenses: expenses,
        balance,
        categoryExpenses,
        categoryIncome,
        topSpendingCategory: topCategory || null,
        transactionCount: transactions.length,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// @route   GET /api/reports/export/csv
// @desc    Export transactions as CSV
// @access  Private
router.get(
  '/export/csv',
  [
    query('startDate').optional().isISO8601(),
    query('endDate').optional().isISO8601(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { startDate, endDate } = req.query;
      const filter = { user: req.user._id };

      if (startDate || endDate) {
        filter.date = {};
        if (startDate) filter.date.$gte = new Date(startDate);
        if (endDate) filter.date.$lte = new Date(endDate);
      }

      const transactions = await Transaction.find(filter).sort({ date: -1 });

      // Convert to CSV
      const csvHeader = 'Date,Type,Category,Amount,Description\n';
      const csvRows = transactions.map((t) => {
        const date = new Date(t.date).toISOString().split('T')[0];
        return `${date},${t.type},${t.category},${t.amount},"${t.description || ''}"`;
      });

      const csv = csvHeader + csvRows.join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=transactions.csv');
      res.send(csv);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// @route   GET /api/reports/export/pdf
// @desc    Export monthly report as PDF (returns JSON for frontend to generate PDF)
// @access  Private
router.get(
  '/export/pdf',
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
      const now = new Date();
      const reportMonth = month ? parseInt(month) : now.getMonth() + 1;
      const reportYear = year ? parseInt(year) : now.getFullYear();

      const startDate = new Date(reportYear, reportMonth - 1, 1);
      const endDate = new Date(reportYear, reportMonth, 0, 23, 59, 59);

      const transactions = await Transaction.find({
        user: req.user._id,
        date: { $gte: startDate, $lte: endDate },
      }).sort({ date: -1 });

      const income = transactions
        .filter((t) => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

      const expenses = transactions
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      const balance = income - expenses;

      const categoryExpenses = {};
      transactions
        .filter((t) => t.type === 'expense')
        .forEach((t) => {
          categoryExpenses[t.category] = (categoryExpenses[t.category] || 0) + t.amount;
        });

      // Return data for frontend to generate PDF
      res.json({
        month: reportMonth,
        year: reportYear,
        totalIncome: income,
        totalExpenses: expenses,
        balance,
        categoryExpenses,
        transactions: transactions.map((t) => ({
          date: t.date,
          type: t.type,
          category: t.category,
          amount: t.amount,
          description: t.description,
        })),
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

export default router;
