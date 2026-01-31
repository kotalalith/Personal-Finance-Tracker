import React, { useState, useEffect } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';
import { AlertTriangle, TrendingUp, TrendingDown, Info } from 'lucide-react';

const LifestyleInflation = () => {
    // Simulating historical data comparison or manual entry
    // In a real app, this would fetch 'Last Year' vs 'This Year' from DB
    const [data, setData] = useState({
        previousIncome: 40000,
        currentIncome: 50000,
        previousExpenses: 20000,
        currentExpenses: 35000
    });

    const [metrics, setMetrics] = useState({
        incomeGrowth: 0,
        expenseGrowth: 0,
        lifestyleCreepIndex: 0
    });

    useEffect(() => {
        const incGrowth = ((data.currentIncome - data.previousIncome) / data.previousIncome) * 100;
        const expGrowth = ((data.currentExpenses - data.previousExpenses) / data.previousExpenses) * 100;

        // Lifestyle Creep Index: Ratio of Expense Growth to Income Growth
        // > 1.0 means expenses are growing faster than income (BAD)
        const index = incGrowth !== 0 ? expGrowth / incGrowth : 0;

        setMetrics({
            incomeGrowth: incGrowth,
            expenseGrowth: expGrowth,
            lifestyleCreepIndex: index
        });
    }, [data]);

    const chartData = [
        { name: 'Previous', Income: data.previousIncome, Expenses: data.previousExpenses },
        { name: 'Current', Income: data.currentIncome, Expenses: data.currentExpenses },
        { name: 'Projected', Income: data.currentIncome * 1.1, Expenses: data.currentExpenses * (1 + (metrics.expenseGrowth / 100)) }
    ];

    const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                        <TrendingUp className="w-6 h-6 text-purple-600" />
                        Lifestyle Inflation Tracker
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Detects when expenses rise faster than income ("Lifestyle Creep").
                    </p>
                </div>
                <div className={`px-4 py-2 rounded-xl flex items-center gap-2 font-bold ${metrics.lifestyleCreepIndex > 1 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                    }`}>
                    {metrics.lifestyleCreepIndex > 1 ? <AlertTriangle className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                    {metrics.lifestyleCreepIndex > 1 ? 'High Inflation!' : 'Well Managed'}
                </div>
            </div>

            {/* Input Section (Simulator for now) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 bg-gray-50 dark:bg-gray-700/30 p-4 rounded-xl">
                <div>
                    <label className="block text-xs font-semibold uppercase text-gray-500 mb-2">Comparison Baseline (Previous)</label>
                    <div className="flex gap-4">
                        <div className="w-1/2">
                            <span className="text-xs text-gray-400">Prev. Income</span>
                            <input
                                type="number"
                                value={data.previousIncome}
                                onChange={e => setData({ ...data, previousIncome: parseFloat(e.target.value) || 0 })}
                                className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white"
                            />
                        </div>
                        <div className="w-1/2">
                            <span className="text-xs text-gray-400">Prev. Expenses</span>
                            <input
                                type="number"
                                value={data.previousExpenses}
                                onChange={e => setData({ ...data, previousExpenses: parseFloat(e.target.value) || 0 })}
                                className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white"
                            />
                        </div>
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-semibold uppercase text-gray-500 mb-2">Current Status</label>
                    <div className="flex gap-4">
                        <div className="w-1/2">
                            <span className="text-xs text-gray-400">Curr. Income</span>
                            <input
                                type="number"
                                value={data.currentIncome}
                                onChange={e => setData({ ...data, currentIncome: parseFloat(e.target.value) || 0 })}
                                className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white"
                            />
                        </div>
                        <div className="w-1/2">
                            <span className="text-xs text-gray-400">Curr. Expenses</span>
                            <input
                                type="number"
                                value={data.currentExpenses}
                                onChange={e => setData({ ...data, currentExpenses: parseFloat(e.target.value) || 0 })}
                                className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Metrics */}
                <div className="w-full lg:w-1/3 flex flex-col justify-center space-y-6">
                    <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
                        <span className="text-sm text-blue-600 dark:text-blue-300 block mb-1">Income Growth</span>
                        <span className="text-2xl font-bold text-blue-700 dark:text-blue-200">+{metrics.incomeGrowth.toFixed(1)}%</span>
                    </div>
                    <div className={`p-4 rounded-xl border ${metrics.expenseGrowth > metrics.incomeGrowth ? 'bg-red-50 border-red-100 dark:bg-red-900/20 dark:border-red-800' : 'bg-green-50 border-green-100 dark:bg-green-900/20 dark:border-green-800'}`}>
                        <span className={`text-sm block mb-1 ${metrics.expenseGrowth > metrics.incomeGrowth ? 'text-red-600' : 'text-green-600'}`}>Expense Growth</span>
                        <span className={`text-2xl font-bold ${metrics.expenseGrowth > metrics.incomeGrowth ? 'text-red-700' : 'text-green-700'}`}>+{metrics.expenseGrowth.toFixed(1)}%</span>
                    </div>

                    <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
                        <Info className="w-3 h-3 inline mr-1" />
                        {metrics.lifestyleCreepIndex > 1
                            ? "Warning: Your expenses are growing faster than your income. This is classic lifestyle inflation."
                            : "Good job! You are keeping your expense growth lower than your income growth."
                        }
                    </div>
                </div>

                {/* Chart */}
                <div className="w-full lg:w-2/3 h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#ff7300" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#ff7300" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} />
                            <YAxis hide />
                            <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                            <Legend />
                            <Area type="monotone" dataKey="Income" stroke="#8884d8" fillOpacity={1} fill="url(#colorIncome)" />
                            <Area type="monotone" dataKey="Expenses" stroke="#ff7300" fillOpacity={1} fill="url(#colorExpense)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default LifestyleInflation;
