import express from 'express';
import { query, validationResult } from 'express-validator';
import Transaction from '../models/Transaction.model.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// @route   GET /api/insights
// @desc    Get AI-driven financial insights
// @access  Private
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
      const now = new Date();
      const reportMonth = month ? parseInt(month) : now.getMonth() + 1;
      const reportYear = year ? parseInt(year) : now.getFullYear();

      // Get last 3 months of data for comparison
      const monthsToAnalyze = [];
      for (let i = 0; i < 3; i++) {
        const m = reportMonth - i <= 0 ? 12 + (reportMonth - i) : reportMonth - i;
        const y = reportMonth - i <= 0 ? reportYear - 1 : reportYear;
        monthsToAnalyze.push({ month: m, year: y });
      }

      const analysis = await Promise.all(
        monthsToAnalyze.map(async ({ month: m, year: y }) => {
          const startDate = new Date(y, m - 1, 1);
          const endDate = new Date(y, m, 0, 23, 59, 59);

          const transactions = await Transaction.find({
            user: req.user._id,
            date: { $gte: startDate, $lte: endDate },
          });

          const income = transactions
            .filter((t) => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

          const expenses = transactions
            .filter((t) => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

          const categoryExpenses = {};
          transactions
            .filter((t) => t.type === 'expense')
            .forEach((t) => {
              categoryExpenses[t.category] = (categoryExpenses[t.category] || 0) + t.amount;
            });

          return {
            month: m,
            year: y,
            income,
            expenses,
            balance: income - expenses,
            categoryExpenses,
          };
        })
      );

      const currentMonth = analysis[0];
      const previousMonth = analysis[1];
      const twoMonthsAgo = analysis[2];

      // Generate insights
      const insights = [];

      // Spending trend analysis
      if (previousMonth) {
        const spendingChange = currentMonth.expenses - previousMonth.expenses;
        const spendingChangePercent = previousMonth.expenses > 0
          ? ((spendingChange / previousMonth.expenses) * 100).toFixed(1)
          : 0;

        if (spendingChange > 0) {
          insights.push({
            type: 'warning',
            title: 'Spending Increased',
            message: `Your spending increased by ${Math.abs(spendingChangePercent)}% compared to last month ($${Math.abs(spendingChange).toFixed(2)} more).`,
            suggestion: 'Review your expenses and identify areas where you can cut back.',
          });
        } else if (spendingChange < 0) {
          insights.push({
            type: 'success',
            title: 'Great Savings!',
            message: `You reduced your spending by ${Math.abs(spendingChangePercent)}% compared to last month (saved $${Math.abs(spendingChange).toFixed(2)}).`,
            suggestion: 'Keep up the good work! Consider setting a savings goal.',
          });
        }
      }

      // Top spending category
      if (currentMonth.categoryExpenses && Object.keys(currentMonth.categoryExpenses).length > 0) {
        const topCategory = Object.keys(currentMonth.categoryExpenses).reduce(
          (a, b) => (currentMonth.categoryExpenses[a] > currentMonth.categoryExpenses[b] ? a : b),
          null
        );
        const topCategoryAmount = currentMonth.categoryExpenses[topCategory];
        const categoryPercentage = (topCategoryAmount / currentMonth.expenses) * 100;

        if (categoryPercentage > 40) {
          insights.push({
            type: 'info',
            title: 'Top Spending Category',
            message: `${topCategory} accounts for ${categoryPercentage.toFixed(1)}% of your total expenses ($${topCategoryAmount.toFixed(2)}).`,
            suggestion: `Consider creating a budget for ${topCategory} to better manage your spending.`,
          });
        }
      }

      // Balance analysis
      if (currentMonth.balance < 0) {
        insights.push({
          type: 'error',
          title: 'Negative Balance',
          message: `Your expenses exceed your income by $${Math.abs(currentMonth.balance).toFixed(2)} this month.`,
          suggestion: 'Immediate action needed: Reduce expenses or increase income to avoid debt.',
        });
      } else if (currentMonth.balance > 0 && currentMonth.balance / currentMonth.income > 0.3) {
        insights.push({
          type: 'success',
          title: 'Excellent Savings Rate',
          message: `You're saving ${((currentMonth.balance / currentMonth.income) * 100).toFixed(1)}% of your income this month.`,
          suggestion: 'Consider investing your savings or setting up an emergency fund.',
        });
      }

      // Unusual spending pattern detection
      if (previousMonth && twoMonthsAgo) {
        const avgExpenses = (previousMonth.expenses + twoMonthsAgo.expenses) / 2;
        const deviation = Math.abs(currentMonth.expenses - avgExpenses) / avgExpenses;

        if (deviation > 0.25) {
          insights.push({
            type: 'warning',
            title: 'Unusual Spending Pattern',
            message: `Your spending this month is ${(deviation * 100).toFixed(1)}% different from your average.`,
            suggestion: 'Review your transactions to ensure all expenses are accounted for and expected.',
          });
        }
      }

      // Category-specific insights
      Object.keys(currentMonth.categoryExpenses || {}).forEach((category) => {
        const currentAmount = currentMonth.categoryExpenses[category];
        if (previousMonth && previousMonth.categoryExpenses[category]) {
          const prevAmount = previousMonth.categoryExpenses[category];
          const change = ((currentAmount - prevAmount) / prevAmount) * 100;

          if (change > 50) {
            insights.push({
              type: 'warning',
              title: `${category} Spending Spike`,
              message: `Your ${category} spending increased by ${change.toFixed(1)}% compared to last month.`,
              suggestion: `Review your ${category} expenses and see if this increase is expected.`,
            });
          }
        }
      });

      res.json({
        month: reportMonth,
        year: reportYear,
        insights,
        summary: {
          currentMonth: currentMonth,
          previousMonth: previousMonth || null,
          trends: {
            spendingChange: previousMonth
              ? currentMonth.expenses - previousMonth.expenses
              : 0,
            incomeChange: previousMonth
              ? currentMonth.income - previousMonth.income
              : 0,
          },
        },
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

export default router;
