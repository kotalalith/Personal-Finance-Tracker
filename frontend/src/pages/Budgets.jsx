import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBudgets,
  addBudget,
  updateBudget,
  deleteBudget,
} from "../store/slices/budgetSlice";
import { fetchTransactions } from "../store/slices/transactionSlice";
import {
  Plus,
  Edit,
  Trash2,
  Target,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { format } from "date-fns";

const expenseCategories = [
  "Food",
  "Travel",
  "Bills",
  "Shopping",
  "Entertainment",
  "Health",
  "Education",
  "Other",
];

const Budgets = () => {
  const dispatch = useDispatch();
  const { budgets, loading } = useSelector((state) => state.budgets);
  const { transactions } = useSelector((state) => state.transactions);

  const [showModal, setShowModal] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [formData, setFormData] = useState({
    category: "Food",
    amount: "",
    period: "monthly",
  });

  const [spendingComparison, setSpendingComparison] = useState(null);

  // ✅ Fetch budgets & transactions
  useEffect(() => {
    dispatch(fetchBudgets({ month: selectedMonth, year: selectedYear }));

    const startDate = new Date(selectedYear, selectedMonth - 1, 1).toISOString();
    const endDate = new Date(
      selectedYear,
      selectedMonth,
      0,
      23,
      59,
      59
    ).toISOString();

    dispatch(fetchTransactions({ startDate, endDate }));
  }, [dispatch, selectedMonth, selectedYear]);

  // ✅ Spending comparison (safe)
  useEffect(() => {
    if (transactions.length === 0) return;

    const currentMonthSpent = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    setSpendingComparison({
      currentMonthSpent,
      lastMonthSpent: 0,
      difference: 0,
      percentageChange: 0,
    });
  }, [transactions]);

  // ✅ FIXED spent calculation
  const getSpentAmount = (category) => {
    return transactions
      .filter(
        (t) =>
          t.type === "expense" &&
          t.category === category
      )
      .reduce((sum, t) => sum + t.amount, 0);
  };

  // ✅ Add / Update Budget
  const handleSubmit = async (e) => {
    e.preventDefault();

    const budgetData = {
      ...formData,
      amount: parseFloat(formData.amount),
      month: selectedMonth,
      year: selectedYear,
    };

    if (editingBudget) {
      await dispatch(updateBudget({ id: editingBudget._id, ...budgetData }));
    } else {
      await dispatch(addBudget(budgetData));
    }

    await dispatch(fetchBudgets({ month: selectedMonth, year: selectedYear }));
    resetForm();
  };

  const resetForm = () => {
    setFormData({ category: "Food", amount: "", period: "monthly" });
    setEditingBudget(null);
    setShowModal(false);
  };

  const handleEdit = (budget) => {
    setEditingBudget(budget);
    setFormData({
      category: budget.category,
      amount: budget.amount.toString(),
      period: budget.period,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this budget?")) {
      await dispatch(deleteBudget(id));
      await dispatch(fetchBudgets({ month: selectedMonth, year: selectedYear }));
    }
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 100) return "bg-red-500";
    if (percentage >= 75) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Budgets
        </h1>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg"
        >
          <Plus className="w-5 h-5" />
          <span>Add Budget</span>
        </button>
      </div>

      {/* Month / Year */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <div className="flex space-x-4">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(+e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {format(new Date(selectedYear, i), "MMMM")}
              </option>
            ))}
          </select>

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(+e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            {Array.from({ length: 5 }, (_, i) => {
              const year = new Date().getFullYear() - 2 + i;
              return (
                <option key={year} value={year}>
                  {year}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {/* Budgets */}
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : budgets.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {budgets.map((budget) => {
            const spent =
              budget.spent !== undefined
                ? budget.spent
                : getSpentAmount(budget.category);

            const remaining = budget.amount - spent;
            const percentage = Math.min(
              (spent / budget.amount) * 100,
              100
            );

            return (
              <div
                key={budget._id}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow"
              >
                <div className="flex justify-between mb-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    {budget.category}
                  </h3>
                  <div className="flex gap-2">
                    <Edit
                      className="w-4 h-4 cursor-pointer text-blue-600"
                      onClick={() => handleEdit(budget)}
                    />
                    <Trash2
                      className="w-4 h-4 cursor-pointer text-red-600"
                      onClick={() => handleDelete(budget._id)}
                    />
                  </div>
                </div>

                <p>Budget: ₹{budget.amount.toFixed(2)}</p>
                <p>Spent: ₹{spent.toFixed(2)}</p>
                <p
                  className={
                    remaining >= 0 ? "text-green-600" : "text-red-600"
                  }
                >
                  Remaining: ₹{remaining.toFixed(2)}
                </p>

                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${getProgressColor(
                        percentage
                      )}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <p className="text-xs mt-1">
                    {percentage.toFixed(1)}%
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-center text-gray-500">
          No budgets set for this month.
        </p>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-96">
            <h2 className="text-xl font-semibold mb-4">
              {editingBudget ? "Edit Budget" : "Add Budget"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full border px-3 py-2 rounded"
              >
                {expenseCategories.map((cat) => (
                  <option key={cat}>{cat}</option>
                ))}
              </select>

              <input
                type="number"
                placeholder="Amount"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                className="w-full border px-3 py-2 rounded"
                required
              />

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  {editingBudget ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Budgets;
