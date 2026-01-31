import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchTransactions } from "../store/slices/transactionSlice";
import { fetchBudgets } from "../store/slices/budgetSlice";
import { fetchGoals } from "../store/slices/goalSlice";
import { fetchInvestmentGoals } from "../store/slices/investmentGoalSlice";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { DollarSign, TrendingUp, TrendingDown, Target, Briefcase } from "lucide-react";
import { format } from "date-fns";
import VoiceAssistant from "../components/VoiceAssistant";
import SmartSuggestions from "../components/SmartSuggestions";
import DashboardHero from "../components/DashboardHero";
import api from "../utils/api";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { transactions, loading } = useSelector((state) => state.transactions);
  const { budgets } = useSelector((state) => state.budgets);
  const { goals = [] } = useSelector((state) => state.goals || {});
  const { goals: investmentGoals = [] } = useSelector((state) => state.investmentGoals || {});

  // ✅ RazorpayX Integration States
  const [bankData, setBankData] = useState(null);
  const [bankError, setBankError] = useState("");

  const { user } = useSelector((state) => state.auth || {});

  useEffect(() => {
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    // ✅ Fetch RazorpayX Data
    const fetchBankData = async () => {
      try {
        const res = await api.get("/bank/bank-data");
        setBankData(res.data);
      } catch (error) {
        setBankError("Unable to fetch bank data");
      }
    };

    fetchBankData();

    // ✅ Dispatch Finance Data
    dispatch(
      fetchTransactions({
        startDate: new Date(currentYear, currentMonth - 1, 1).toISOString(),
        endDate: new Date(currentYear, currentMonth, 0, 23, 59, 59).toISOString(),
      })
    );
    dispatch(fetchBudgets({ month: currentMonth, year: currentYear }));

    if (user?._id) {
      dispatch(fetchGoals(user._id));
      dispatch(fetchInvestmentGoals(user._id));
    }
  }, [dispatch, user]);

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  // ✅ Monthly Calculations
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

  const balance = income - expenses;

  // ✅ Category Expense Data
  const categoryExpenses = {};
  monthTransactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      categoryExpenses[t.category] = (categoryExpenses[t.category] || 0) + t.amount;
    });

  const pieData = Object.entries(categoryExpenses).map(([name, value]) => ({
    name,
    value: parseFloat(value.toFixed(2)),
  }));

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884D8",
    "#82CA9D",
    "#FFC658",
    "#FF7C7C",
  ];

  // ✅ Monthly Trend Data
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const trendData = Array.from({ length: 6 }).map((_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - i));
    const monthNum = date.getMonth() + 1;
    const year = date.getFullYear();

    const monthTxs = transactions.filter((t) => {
      const tDate = new Date(t.date);
      return tDate.getMonth() + 1 === monthNum && tDate.getFullYear() === year;
    });

    return {
      month: monthNames[monthNum - 1],
      income: monthTxs.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0),
      expenses: monthTxs.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0),
    };
  });

  /* ✅ Calculate Total Debt */
  const totalDebt = monthTransactions
    .filter((t) => (t.category === "Debt" || (t.category === "Other" && t.description.includes("Loan"))) && t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const stats = [
    {
      title: "Total Income",
      value: `$${income.toFixed(2)}`,
      icon: TrendingUp,
      color: "text-green-700 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-900",
      link: "/transactions?type=income",
    },
    {
      title: "Total Expenses",
      value: `$${expenses.toFixed(2)}`,
      icon: TrendingDown,
      color: "text-red-700 dark:text-red-400",
      bgColor: "bg-red-50 dark:bg-red-900",
      link: "/transactions?type=expense",
    },
    {
      title: "Total Debt",
      value: `$${totalDebt.toFixed(2)}`,
      icon: Briefcase, // Using Briefcase for Loan/Debt representation
      color: "text-red-700 dark:text-red-400",
      bgColor: "bg-red-50 dark:bg-red-900",
      border: "border-red-200 dark:border-red-800", // Optional extra styling
      link: "/loans",
    },
    {
      title: "Balance",
      value: `$${balance.toFixed(2)}`,
      icon: DollarSign,
      color: balance >= 0 ? "text-blue-700 dark:text-blue-400" : "text-red-700 dark:text-red-400",
      bgColor: balance >= 0 ? "bg-blue-50 dark:bg-blue-900" : "bg-red-50 dark:bg-red-900",
      link: "/transactions",
    },
    {
      title: "Active Budgets",
      value: budgets.length,
      icon: Target,
      color: "text-purple-700 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-900",
      link: "/budgets",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-700 dark:text-gray-300">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ✅ Hero Section */}
      <DashboardHero />

      {/* ✅ Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard - {format(new Date(), "MMMM yyyy")}
        </h1>
        <VoiceAssistant />
      </div>

      {/* ✅ Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              onClick={() => stat.link && navigate(stat.link)}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 cursor-pointer hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-400">{stat.title}</p>
                  <p className={`text-2xl font-bold mt-2 ${stat.color}`}>{stat.value}</p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-full`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ✅ Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Expense Pie Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Category-wise Spending
          </h2>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-700 dark:text-gray-400">
              No expense data available
            </div>
          )}
        </div>

        {/* Monthly Trend Bar Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Monthly Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" stroke="#374151" />
              <YAxis stroke="#374151" />
              <Tooltip />
              <Legend />
              <Bar dataKey="income" fill="#22c55e" name="Income" />
              <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ✅ Smart Savings Suggestions */}
      <SmartSuggestions income={income} expenses={expenses} categoryExpenses={categoryExpenses} />

      {/* ✅ RazorpayX Bank Account Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          🏦 Bank Account Summary (RazorpayX)
        </h2>

        {bankError && <p className="text-red-500">{bankError}</p>}

        {!bankData ? (
          <p className="text-gray-500 dark:text-gray-400">Fetching bank data...</p>
        ) : (
          <>
            <p className="text-gray-800 dark:text-gray-300 mb-2">
              <strong>Available Balance:</strong> ₹
              {(bankData.balance.balance / 100).toFixed(2)}
            </p>
            <p className="text-gray-800 dark:text-gray-300 mb-4">
              <strong>Currency:</strong> {bankData.balance.currency}
            </p>

            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              💸 Recent Payouts
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-300 dark:border-gray-700">
                    <th className="py-2">Payout ID</th>
                    <th className="py-2">Amount</th>
                    <th className="py-2">Status</th>
                    <th className="py-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {bankData.payouts.map((tx) => (
                    <tr key={tx.id} className="border-b border-gray-200 dark:border-gray-700">
                      <td className="py-2 text-gray-800 dark:text-gray-200">{tx.id}</td>
                      <td className="py-2 text-gray-800 dark:text-gray-200">
                        ₹{(tx.amount / 100).toFixed(2)}
                      </td>
                      <td
                        className={`py-2 font-semibold ${tx.status === "processed" ? "text-green-500" : "text-yellow-500"
                          }`}
                      >
                        {tx.status}
                      </td>
                      <td className="py-2 text-gray-600 dark:text-gray-400">
                        {new Date(tx.created_at * 1000).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* ✅ Gamified Budgeting Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Your Savings Goals</h2>

        {goals.length > 0 ? (
          <div className="grid gap-4">
            {goals.map((goal) => {
              const progress = (goal.currentSaved / goal.targetAmount) * 100;
              const badge =
                progress >= 100
                  ? "🏆 Budget Master"
                  : progress >= 75
                    ? "🥈 Saver Pro"
                    : progress >= 50
                      ? "🥉 Smart Saver"
                      : "🌱 Getting Started";

              return (
                <div
                  key={goal._id}
                  className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  onClick={() => navigate(`/goals/${goal._id}`)}
                >
                  <div className="flex justify-between items-center">
                    <p className="font-semibold text-gray-900 dark:text-white">{goal.goalName}</p>
                    <span className="text-sm text-gray-600 dark:text-gray-300">{badge}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3 mt-2">
                    <div
                      className="bg-green-500 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                    You saved {progress.toFixed(1)}% of your goal!
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-600 dark:text-gray-300">No goals yet. Start saving today!</p>
        )}
      </div>

      {/* ✅ Investment Goals Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Investment Goals</h2>
        {investmentGoals.length > 0 ? (
          <div className="grid gap-4">
            {investmentGoals.map((goal) => {
              const progress = (goal.currentAmount / goal.targetAmount) * 100;
              return (
                <div key={goal._id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{goal.goalName}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{goal.assetType} • Target: ${goal.targetAmount}</p>
                    </div>
                    <span className="text-sm font-bold text-green-600">{progress.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3 mt-2">
                    <div
                      className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                    Current: ${goal.currentAmount}
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-600 dark:text-gray-300">No investment goals yet. Start investing today!</p>
        )}
      </div>

      {/* ✅ Recent Transactions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Recent Transactions</h2>
        {monthTransactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 text-gray-800 dark:text-gray-300">Date</th>
                  <th className="text-left py-3 px-4 text-gray-800 dark:text-gray-300">Type</th>
                  <th className="text-left py-3 px-4 text-gray-800 dark:text-gray-300">Category</th>
                  <th className="text-left py-3 px-4 text-gray-800 dark:text-gray-300">Description</th>
                  <th className="text-right py-3 px-4 text-gray-800 dark:text-gray-300">Amount</th>
                </tr>
              </thead>
              <tbody>
                {monthTransactions.slice(0, 5).map((transaction) => (
                  <tr
                    key={transaction._id}
                    className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="py-3 px-4 text-gray-800 dark:text-gray-400">
                      {format(new Date(transaction.date), "MMM dd, yyyy")}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${transaction.type === "income"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          }`}
                      >
                        {transaction.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-800 dark:text-gray-400">
                      {transaction.category}
                    </td>
                    <td className="py-3 px-4 text-gray-800 dark:text-gray-400">
                      {transaction.description || "-"}
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-gray-900 dark:text-white">
                      ${transaction.amount.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-700 dark:text-gray-400">No transactions found</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
