import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchGoals } from "../store/slices/goalSlice";
import { fetchInvestmentGoals } from "../store/slices/investmentGoalSlice";
import api from "../utils/api";
import { ArrowLeft, TrendingUp, Info } from "lucide-react"; // Reduced imports as ASSETS handle icons
import { getGoalTheme } from "../utils/goalTheme";
import { ASSETS } from "../utils/assetDefinitions";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

const GoalDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { goals } = useSelector((state) => state.goals);
    const { goals: investmentGoals } = useSelector((state) => state.investmentGoals || { goals: [] });
    const { user } = useSelector((state) => state.auth || {});

    const [goal, setGoal] = useState(null);
    const [amount, setAmount] = useState("");
    const [selectedAsset, setSelectedAsset] = useState("Indian Stocks"); // Default match
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const assets = ASSETS; // Use shared definition
    const currentAsset = assets[selectedAsset] || assets["Gold"]; // Fallback

    const priceData = [
        { date: "1M", price: currentAsset.price * 0.95 },
        { date: "2M", price: currentAsset.price * 0.98 },
        { date: "3M", price: currentAsset.price * 0.92 },
        { date: "4M", price: currentAsset.price * 1.05 },
        { date: "5M", price: currentAsset.price * 0.99 },
        { date: "Today", price: currentAsset.price },
    ];

    useEffect(() => {
        if (user?._id) {
            if (goals.length === 0) dispatch(fetchGoals(user._id));
            dispatch(fetchInvestmentGoals(user._id));
        }
    }, [dispatch, goals.length, user]);

    useEffect(() => {
        const foundGoal = goals.find((g) => g._id === id);
        setGoal(foundGoal);
    }, [goals, id]);

    // Calculate Total Savings for Selected Asset
    const totalAssetSavings = investmentGoals
        .filter(g => g.assetType === selectedAsset)
        .reduce((sum, g) => sum + g.currentAmount, 0);

    const accumulatedUnits = (totalAssetSavings / currentAsset.price).toFixed(4);

    const handleInvest = async () => {
        if (!amount || amount <= 0) return;
        setLoading(true);
        setMessage(null);

        try {
            const response = await api.post("/investment-goals/invest", {
                userId: user._id,
                goalId: goal._id,
                amount: parseFloat(amount),
                assetType: selectedAsset,
                price: currentAsset.price
            });

            setMessage({ type: "success", text: response.data.message });
            setAmount("");
            dispatch(fetchGoals(user._id));
            dispatch(fetchInvestmentGoals(user._id));

        } catch (error) {
            setMessage({ type: "error", text: error.response?.data?.message || "Investment failed" });
        } finally {
            setLoading(false);
        }
    };

    if (!goal) return <div className="p-6 text-center">Loading goal details...</div>;

    const unitsToBuy = amount ? (parseFloat(amount) / currentAsset.price).toFixed(4) : "0.0000";

    // --- New Advanced Features ---
    const theme = getGoalTheme(goal.goalName || goal.name);
    const ThemeIcon = theme.icon || Target;

    const remainingAmount = Math.max(0, goal.targetAmount - goal.currentSaved);
    const currentSaved = goal.currentSaved !== undefined ? goal.currentSaved : (goal.savedAmount || 0);
    const realRemaining = Math.max(0, goal.targetAmount - currentSaved);

    const deadlineDate = goal.endDate || goal.deadline ? new Date(goal.endDate || goal.deadline) : null;
    const daysLeft = deadlineDate
        ? Math.ceil((deadlineDate - new Date()) / (1000 * 60 * 60 * 24))
        : 0;

    const suggestedMonthly = daysLeft > 0
        ? Math.ceil(realRemaining / (daysLeft / 30))
        : 0;

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
                <ArrowLeft className="w-5 h-5 mr-2" /> Back to Goals
            </button>

            {message && (
                <div className={`p-4 rounded-lg text-center font-medium ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {message.text}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column: Education & Price Trend */}
                <div className="space-y-6">
                    {/* Hero Banner - Dynamic Theme */}
                    <div className={`bg-gradient-to-r ${theme.gradient || 'from-indigo-600 to-purple-600'} rounded-2xl p-6 text-white shadow-xl relative overflow-hidden`}>
                        <div className="relative z-10 flex justify-between items-start mb-4">
                            <div>
                                <h1 className="text-2xl font-bold mb-1">{goal.name}</h1>
                                <p className="text-white/80 text-sm">Target: ₹{goal.targetAmount.toLocaleString()} • Saved: ₹{currentSaved.toLocaleString()}</p>
                            </div>
                            <ThemeIcon className="w-10 h-10 text-white opacity-80" />
                        </div>

                        {/* Insights Chips */}
                        <div className="relative z-10 flex gap-4 mt-6">
                            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 flex-1">
                                <p className="text-xs text-white/70 uppercase font-semibold">Remaining</p>
                                <p className="text-xl font-bold">₹{realRemaining.toLocaleString()}</p>
                            </div>
                            {daysLeft > 0 && realRemaining > 0 && (
                                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 flex-1">
                                    <p className="text-xs text-white/70 uppercase font-semibold">Suggested / Mo</p>
                                    <p className="text-xl font-bold">₹{suggestedMonthly.toLocaleString()}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Buying Assets Section Header (Context Switch) */}
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mt-2">Invest in Assets</h3>

                    {/* Asset Selector (Rich Cards) */}
                    <div className="flex space-x-4 overflow-x-auto pb-4 pt-2 -mx-2 px-2 snap-x">
                        {Object.entries(assets).map(([key, asset]) => (
                            <div
                                key={key}
                                onClick={() => { setSelectedAsset(key); setAmount(""); }}
                                className={`min-w-[200px] p-5 rounded-2xl border transition-all cursor-pointer snap-start flex flex-col justify-between h-48 hover:shadow-lg ${selectedAsset === key
                                    ? "bg-blue-50 border-blue-500 ring-1 ring-blue-500 shadow-md"
                                    : "bg-white border-gray-200 hover:border-gray-300"
                                    }`}
                            >
                                <div>
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${selectedAsset === key ? 'bg-white' : 'bg-gray-50'}`}>
                                        <asset.icon className={`w-6 h-6 ${selectedAsset === key ? 'text-blue-600' : 'text-gray-600'}`} />
                                    </div>
                                    <h4 className="font-bold text-gray-900 dark:text-gray-800 text-lg mb-1">{key}</h4>
                                    <p className="text-xs text-gray-500 leading-relaxed font-medium">
                                        {key === "Gold" && "Secure, 24k gold investment starting at ₹10."}
                                        {key === "Silver" && "Diversify with secure silver holdings."}
                                        {key === "Mutual Funds" && "Zero commission direct mutual funds."}
                                        {key === "Real Estate" && "Fractional ownership in premium properties."}
                                    </p>
                                </div>
                                {selectedAsset === key && (
                                    <div className="flex items-center text-blue-600 text-xs font-bold gap-1 mt-2">
                                        Selected <TrendingUp className="w-3 h-3" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Price Chart */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-green-500" />
                                {selectedAsset} Price Trend
                            </h2>
                            <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded">LIVE ₹{currentAsset.price}/{currentAsset.unit}</span>
                        </div>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={priceData}>
                                    <defs>
                                        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                                    <YAxis hide domain={['dataMin - 100', 'dataMax + 100']} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        formatter={(value) => [`₹${value.toFixed(2)}`, "Price"]}
                                    />
                                    <Area type="monotone" dataKey="price" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorPrice)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Asset Holdings Summary */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700 flex justify-between items-center">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Your {selectedAsset}</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{accumulatedUnits} {currentAsset.unit}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Current Value</p>
                            <p className="text-xl font-bold text-green-600">₹{totalAssetSavings.toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                {/* Right Column: Investment Interface */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 md:p-8 border border-gray-200 dark:border-gray-700 h-full">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Buy {selectedAsset}</h2>
                            <div className="text-right">
                                <p className="text-xs text-gray-500">Goal Source</p>
                                <p className="text-sm font-semibold text-blue-600 truncate max-w-[150px]">{goal.name}</p>
                            </div>
                        </div>

                        {/* Amount Input */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Amount to Invest
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-4 text-gray-500 text-lg">₹</span>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="w-full pl-10 pr-4 py-4 text-xl font-semibold border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    placeholder="0"
                                    max={currentSaved}
                                />
                                <span className="absolute right-4 top-5 text-sm font-medium text-gray-400">
                                    {unitsToBuy} {currentAsset.unit}
                                </span>
                            </div>
                            <div className="flex justify-between mt-2">
                                <p className="text-xs text-gray-500">Available in goal: ₹{currentSaved.toLocaleString()}</p>
                                {/* Quick Chips */}
                                <div className="flex gap-2">
                                    {[500, 1000, 2000].map((val) => (
                                        <button
                                            key={val}
                                            onClick={() => setAmount(val.toString())}
                                            disabled={val > currentSaved}
                                            className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded-md transition-colors disabled:opacity-50"
                                        >
                                            +₹{val}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className={`p-4 rounded-lg mb-8 flex items-start gap-3 ${currentAsset.bg}`}>
                            <Info className={`w-5 h-5 ${currentAsset.color} mt-0.5 flex-shrink-0`} />
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                Investing will deduct funds from your <strong>{goal.name}</strong> savings goal and purchase <strong>{selectedAsset}</strong> units at current market rates.
                            </p>
                        </div>

                        <button
                            onClick={handleInvest}
                            disabled={loading || !amount || amount > currentSaved}
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-xl shadow-lg transform transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Processing Securely..." : `Proceed to Buy ${selectedAsset}`}
                        </button>

                        <p className="text-center text-xs text-gray-400 mt-4">
                            All investments are subject to market risk.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GoalDetails;
