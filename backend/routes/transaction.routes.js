import express from 'express';
import { body, validationResult, query } from 'express-validator';
import Transaction from '../models/Transaction.model.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// @route   GET /api/transactions
// @desc    Get all transactions for logged in user
// @access  Private
router.get(
  '/',
  [
    query('type').optional().isIn(['income', 'expense']),
    query('category').optional().isString(),
    query('startDate').optional().isISO8601(),
    query('endDate').optional().isISO8601(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { type, category, startDate, endDate } = req.query;
      const filter = { user: req.user._id };

      if (type) filter.type = type;
      if (category) filter.category = category;
      if (startDate || endDate) {
        filter.date = {};
        if (startDate) filter.date.$gte = new Date(startDate);
        if (endDate) filter.date.$lte = new Date(endDate);
      }

      const transactions = await Transaction.find(filter).sort({ date: -1 });

      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// @route   GET /api/transactions/:id
// @desc    Get a single transaction
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/transactions
// @desc    Create a new transaction
// @access  Private
router.post(
  '/',
  [
    body('type').isIn(['income', 'expense']).withMessage('Type must be income or expense'),
    body('amount').isFloat({ min: 0 }).withMessage('Amount must be a positive number'),
    body('category').notEmpty().withMessage('Category is required'),
    body('date').optional().isISO8601().withMessage('Date must be valid ISO8601 format'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { type, amount, category, description, date } = req.body;

      const transaction = await Transaction.create({
        user: req.user._id,
        type,
        amount,
        category,
        description: description || '',
        date: date || new Date(),
      });

      res.status(201).json(transaction);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// @route   PUT /api/transactions/:id
// @desc    Update a transaction
// @access  Private
router.put(
  '/:id',
  [
    body('type').optional().isIn(['income', 'expense']),
    body('amount').optional().isFloat({ min: 0 }),
    body('date').optional().isISO8601(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const transaction = await Transaction.findOne({
        _id: req.params.id,
        user: req.user._id,
      });

      if (!transaction) {
        return res.status(404).json({ message: 'Transaction not found' });
      }

      const { type, amount, category, description, date } = req.body;

      if (type) transaction.type = type;
      if (amount !== undefined) transaction.amount = amount;
      if (category) transaction.category = category;
      if (description !== undefined) transaction.description = description;
      if (date) transaction.date = date;

      await transaction.save();

      res.json(transaction);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// @route   DELETE /api/transactions/:id
// @desc    Delete a transaction
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    await Transaction.deleteOne({ _id: req.params.id });

    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
