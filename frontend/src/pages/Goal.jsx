import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchGoals,
  addGoal,
  updateGoal,
  deleteGoal,
} from "../store/slices/goalSlice";
import { fetchTransactions } from "../store/slices/transactionSlice";
import { Plus, Target, Wallet, TrendingUp } from "lucide-react";
import GoalCard from "../components/GoalCard";
import MarketWatch from "../components/MarketWatch";
import MarketTrends from "../components/MarketTrends";
import GoldSilverRates from "../components/GoldSilverRates";

import { ASSETS } from "../utils/assetDefinitions";

const goalTypes = [
  "Savings",
  "Vacation",
  "Education",
  "Emergency Fund",
  "Investment",
  ...Object.keys(ASSETS),
  "Other",
];

const Goals = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation(); // ✅ Get location state
  const { goals, loading } = useSelector((state) => state.goals);
  const { transactions } = useSelector((state) => state.transactions || { transactions: [] });
  const { user } = useSelector((state) => state.auth || {});

  const [showModal, setShowModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [filter, setFilter] = useState("All");

  const [formData, setFormData] = useState({
    name: "Savings",
    targetAmount: "",
    savedAmount: "",
    deadline: "",
  });

  useEffect(() => {
    if (user?._id) {
      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();

      dispatch(fetchGoals(user._id));
      dispatch(
        fetchTransactions({
          startDate: new Date(currentYear, currentMonth - 1, 1).toISOString(),
          endDate: new Date(currentYear, currentMonth, 0, 23, 59, 59).toISOString(),
        })
      );
    }

    // ✅ Check for incoming navigation state (e.g. from Financial Health)
    if (location.state?.openModal && location.state?.goalData) {
      setFormData({
        ...formData,
        ...location.state.goalData,
        name: location.state.goalData.name || "Savings"
      });
      setShowModal(true);
      // Clear state to prevent reopening on refresh (optional, but good practice usually involves more complex state management or replacing history)
      window.history.replaceState({}, document.title);
    }
  }, [dispatch, user, location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const goalData = {
      userId: user._id,
      goalName: formData.name,
      targetAmount: parseFloat(formData.targetAmount),
      currentSaved: parseFloat(formData.savedAmount || 0),
      endDate: formData.deadline ? new Date(formData.deadline).toISOString() : null,
    };

    if (editingGoal) {
      await dispatch(updateGoal({ id: editingGoal._id, ...goalData }));
    } else {
      await dispatch(addGoal(goalData));
    }

    // Optional: Fetch goals again to stay in sync, though slice should handle it. 
    // Kept to ensure consistency if backend response differs.
    dispatch(fetchGoals(user._id));
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: "Savings",
      targetAmount: "",
      savedAmount: "",
      deadline: "",
    });
    setEditingGoal(null);
    setShowModal(false);
  };

  const handleEdit = (goal) => {
    setEditingGoal(goal);
    setFormData({
      name: goal.goalName || goal.name, // Handle both for safety
      targetAmount: goal.targetAmount.toString(),
      savedAmount: (goal.currentSaved || goal.savedAmount || 0).toString(),
      deadline: (goal.endDate || goal.deadline || "").slice(0, 10),
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this goal?")) {
      await dispatch(deleteGoal(id));
      dispatch(fetchGoals(user._id));
    }
  };

  // --- Statistics Calculation ---
  const totalGoals = goals.length;
  const totalSaved = goals.reduce((sum, goal) => sum + (goal.currentSaved || goal.savedAmount || 0), 0);
  const totalTarget = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const overallProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

  // --- Balance Calculation (Context for Saving) ---
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const monthTransactions = transactions.filter((t) => {
    const date = new Date(t.date);
    return date.getMonth() + 1 === currentMonth && date.getFullYear() === currentYear;
  });

  const income = monthTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const expenses = monthTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const currentBalance = income - expenses;

  // --- Filtering ---
  const filteredGoals = goals.filter((goal) => {
    if (filter === "All") return true;
    const saved = goal.currentSaved || goal.savedAmount || 0;
    const isCompleted = saved >= goal.targetAmount;
    if (filter === "Completed") return isCompleted;
    if (filter === "Active") return !isCompleted;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-4 md:p-0">

      {/* 1. Header & Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Saved</p>
              <h3 className="text-3xl font-bold mt-1">₹{totalSaved.toLocaleString()}</h3>
            </div>
            <div className="p-2 bg-white/20 rounded-lg">
              <Wallet className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="w-full bg-blue-900/40 rounded-full h-1.5 mt-2">
            <div
              className="bg-white h-1.5 rounded-full"
              style={{ width: `${Math.min(overallProgress, 100)}%` }}
            />
          </div>
          <p className="text-xs text-blue-200 mt-2">{overallProgress.toFixed(1)}% of total target achieved</p>
        </div>

        {/* Balance Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-semibold">Available Balance</p>
              <h3 className={`text-3xl font-bold mt-1 ${currentBalance >= 0 ? "text-green-600" : "text-red-600"}`}>
                ₹{currentBalance.toLocaleString()}
              </h3>
            </div>
            <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <Wallet className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">Based on this month's activity</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-semibold">Active Goals</p>
              <h3 className="text-3xl font-bold text-gray-800 dark:text-white mt-1">
                {goals.filter(g => (g.currentSaved || g.savedAmount || 0) < g.targetAmount).length}
              </h3>
            </div>
            <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
              <Target className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">Keep pushing towards your targets!</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-semibold">Total Remaining</p>
              <h3 className="text-3xl font-bold text-gray-800 dark:text-white mt-1">
                ₹{(totalTarget - totalSaved).toLocaleString()}
              </h3>
            </div>
            <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <p className="text-xs text-purple-600 mt-2 font-medium">
            Targeting ₹{totalTarget.toLocaleString()} total
          </p>
        </div>
      </div>

      {/* 2. Controls & Filter */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="bg-gray-100 dark:bg-gray-800 p-1 rounded-xl flex space-x-1">
          {["All", "Active", "Completed"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === tab
                ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all w-full md:w-auto justify-center"
        >
          <Plus className="w-5 h-5" />
          <span>New Goal</span>
        </button>
      </div>

      {/* Explore Assets Carousel (New Addition) */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white">Explore Investment Oppurtunities</h3>
        <div className="flex space-x-4 overflow-x-auto pb-4 pt-2 -mx-2 px-2 snap-x">
          {Object.entries(ASSETS).map(([key, asset]) => (
            <div
              key={key}
              onClick={() => {
                setFormData({ ...formData, name: key });
                setShowModal(true);
              }}
              className="min-w-[200px] p-5 rounded-2xl border transition-all cursor-pointer snap-start flex flex-col justify-between h-48 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-700 group"
            >
              <div>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${asset.bg}`}>
                  <asset.icon className={`w-6 h-6 ${asset.color}`} />
                </div>
                <h4 className="font-bold text-gray-900 dark:text-white text-lg mb-1">{key}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                  {asset.desc}
                </p>
              </div>
              <div className="flex items-center text-blue-600 text-xs font-bold gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                Start Investing <TrendingUp className="w-3 h-3" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Goals Grid */}
      {loading ? (
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading your goals...</p>
        </div>
      ) : filteredGoals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGoals.map((goal) => (
            <GoalCard
              key={goal._id}
              goal={goal}
              onClick={() => navigate(`/goals/${goal._id}`)}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-gray-50 dark:bg-gray-800/50 rounded-3xl border border-dashed border-gray-300 dark:border-gray-700">
          <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
            <Target className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">No goals found</h3>
          <p className="text-gray-500 mt-2 max-w-sm text-center">
            {filter === "All"
              ? "Start your financial journey by creating your first goal."
              : `You don't have any ${filter.toLowerCase()} goals yet.`}
          </p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md p-8 shadow-2xl transform transition-all scale-100">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
              {editingGoal ? "Edit Goal" : "Create New Goal"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Goal Type</label>
                <select
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 dark:bg-gray-700 dark:text-white transition-all"
                >
                  {goalTypes.map((g) => (
                    <option key={g}>{g}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Target Amount (₹)</label>
                <input
                  type="number"
                  placeholder="e.g. 50000"
                  value={formData.targetAmount}
                  onChange={(e) =>
                    setFormData({ ...formData, targetAmount: e.target.value })
                  }
                  required
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 dark:bg-gray-700 dark:text-white transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Already Saved (₹)</label>
                <input
                  type="number"
                  placeholder="e.g. 5000"
                  value={formData.savedAmount}
                  onChange={(e) =>
                    setFormData({ ...formData, savedAmount: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 dark:bg-gray-700 dark:text-white transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Target Deadline</label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) =>
                    setFormData({ ...formData, deadline: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 dark:bg-gray-700 dark:text-white transition-all"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2.5 text-gray-700 font-medium hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  {editingGoal ? "Save Changes" : "Create Goal"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Market Watch Section (Indian Stocks) */}
      <MarketWatch />

      {/* US Stocks / Market Trends Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">US Stocks</h2>
        <MarketTrends />
      </div>

      {/* Gold & Silver Section */}
      <div className="mt-12">
        <GoldSilverRates />
      </div>
    </div>
  );
};

export default Goals;
