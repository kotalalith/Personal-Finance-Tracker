import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    ReferenceLine
} from 'recharts';
import { TrendingUp, AlertCircle, CheckCircle, Wallet } from 'lucide-react';
import LifestyleInflation from '../components/LifestyleInflation';

const FinancialHealth = () => {
    const { user } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    /*
# Financial Calculation Enhancements II
- [/] Refine 'Invest' feature: Add custom amount input & remaining balance display <!-- id: 18 -->

# New Feature: Lifestyle Inflation Tracker
    */
    // State for user inputs (default values or could be pre-filled from store if available)
    const [monthlyIncome, setMonthlyIncome] = useState(50000);
    const [monthlyExpenses, setMonthlyExpenses] = useState(30000);
    const [currentSavings, setCurrentSavings] = useState(100000);
    const [totalDebt, setTotalDebt] = useState(0);
    const [years, setYears] = useState(5);
    const [expectedReturn, setExpectedReturn] = useState(12);

    // New: Custom Investment Amount
    const [investmentAmount, setInvestmentAmount] = useState(0);

    const [healthScore, setHealthScore] = useState(0);
    const [projectionData, setProjectionData] = useState([]);
    const [summary, setSummary] = useState({});

    useEffect(() => {
        calculateHealthAndProjection();
        // Default investment amount to 50% of surplus initially or keep within bounds
        const surplus = Math.max(0, monthlyIncome - monthlyExpenses);
        setInvestmentAmount(prev => Math.min(prev || (surplus * 0.5), surplus));
    }, [monthlyIncome, monthlyExpenses, currentSavings, totalDebt, years, expectedReturn]);

    const calculateHealthAndProjection = () => {
        // 1. Calculate Health Score (0-100)
        // Factors: Savings Rate, Debt-to-Income, Emergency Fund coverage

        let score = 50; // Base score
        const monthlySavings = monthlyIncome - monthlyExpenses;
        const savingsRate = monthlyIncome > 0 ? (monthlySavings / monthlyIncome) * 100 : 0;
        const debtRatio = monthlyIncome > 0 ? (totalDebt / (monthlyIncome * 12)) * 100 : 0; // Debt relative to annual income

        // Savings Rate Bonus (up to 30 points)
        if (savingsRate >= 20) score += 30;
        else if (savingsRate >= 10) score += 15;
        else if (savingsRate > 0) score += 5;
        else score -= 10;

        // Debt Penalty (down to -20 points)
        if (debtRatio === 0) score += 20;
        else if (debtRatio < 30) score += 10;
        else if (debtRatio > 100) score -= 20;

        // Cap score 0-100
        score = Math.max(0, Math.min(100, score));
        setHealthScore(Math.round(score));

        // 2. Calculate Projection (SIP style)
        const annualSavings = monthlySavings * 12;
        const rate = expectedReturn / 100;
        let currentCorpus = currentSavings - totalDebt;
        const data = [];

        for (let i = 1; i <= years; i++) {
            // Compound interest formula: A = P(1+r)^t + PMT * (((1+r)^t - 1) / r) * (1+r) (assuming beginning of period)
            // Simplified loop for yearly addition
            const interestOnCorpus = currentCorpus * rate;
            const interestOnNewSavings = annualSavings * (rate / 2); // Avg return on monthly added savings
            const yearGrowth = interestOnCorpus + interestOnNewSavings;

            const investedAmount = (currentSavings - totalDebt) + (annualSavings * i);
            currentCorpus += annualSavings + yearGrowth;

            data.push({
                year: `${i}Y`,
                invested: Math.round(investedAmount),
                value: Math.round(currentCorpus),
                gain: Math.round(currentCorpus - investedAmount)
            });
        }
        setProjectionData(data);
        setSummary({
            totalValue: Math.round(currentCorpus),
            totalInvested: Math.round((currentSavings - totalDebt) + (annualSavings * years)),
            totalGain: Math.round(currentCorpus - ((currentSavings - totalDebt) + (annualSavings * years)))
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const getScoreColor = () => {
        if (healthScore >= 80) return 'text-green-600';
        if (healthScore >= 50) return 'text-yellow-600';
        return 'text-red-600';
    };

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">Financial Health & Wealth Projector</h1>
                <p className="text-gray-600 dark:text-gray-400">Assess your current standing and visualize your future wealth.</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Left Column: Calculator Inputs */}
                <div className="w-full lg:w-1/3 space-y-6 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4 border-b pb-2 dark:border-gray-700">Your Details</h3>

                    {/* Monthly Income */}
                    <div>
                        <div className="flex justify-between mb-2">
                            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Monthly Income</label>
                            <span className="text-green-600 font-bold">{formatCurrency(monthlyIncome)}</span>
                        </div>
                        <input
                            type="range" min="0" max="500000" step="1000"
                            value={monthlyIncome}
                            onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                        />
                    </div>

                    {/* Monthly Expenses */}
                    <div>
                        <div className="flex justify-between mb-2">
                            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Monthly Expenses</label>
                            <span className="text-red-500 font-bold">{formatCurrency(monthlyExpenses)}</span>
                        </div>
                        <input
                            type="range" min="0" max="500000" step="1000"
                            value={monthlyExpenses}
                            onChange={(e) => setMonthlyExpenses(Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-500"
                        />
                    </div>

                    {/* Current Savings */}
                    <div>
                        <div className="flex justify-between mb-2">
                            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Current Savings</label>
                            <span className="text-blue-600 font-bold">{formatCurrency(currentSavings)}</span>
                        </div>
                        <input
                            type="range" min="0" max="5000000" step="5000"
                            value={currentSavings}
                            onChange={(e) => setCurrentSavings(Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                    </div>

                    {/* Total Debt */}
                    <div>
                        <div className="flex justify-between mb-2">
                            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Debt</label>
                            <span className="text-orange-500 font-bold">{formatCurrency(totalDebt)}</span>
                        </div>
                        <input
                            type="range" min="0" max="2000000" step="5000"
                            value={totalDebt}
                            onChange={(e) => setTotalDebt(Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                        />
                    </div>

                    <div className="pt-4 border-t dark:border-gray-700">
                        <div className="flex justify-between mb-2">
                            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Projection Years</label>
                            <span className="font-bold text-gray-700 dark:text-gray-300">{years} Years</span>
                        </div>
                        <input
                            type="range" min="1" max="30" step="1"
                            value={years}
                            onChange={(e) => setYears(Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                        />
                    </div>

                    <div>
                        <div className="flex justify-between mb-2">
                            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Exp. Return (%)</label>
                            <span className="font-bold text-gray-700 dark:text-gray-300">{expectedReturn}%</span>
                        </div>
                        <input
                            type="range" min="2" max="20" step="0.5"
                            value={expectedReturn}
                            onChange={(e) => setExpectedReturn(Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                        />
                    </div>


                </div>

                {/* Right Column: Visualization */}
                <div className="w-full lg:w-2/3 flex flex-col gap-6">

                    {/* Top Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between relative overflow-hidden">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Financial Health Score</p>
                                <h2 className={`text-4xl font-extrabold ${getScoreColor()}`}>{healthScore} <span className="text-lg text-gray-400">/ 100</span></h2>
                                <p className="text-xs text-gray-400 mt-2">{healthScore > 80 ? 'Excellent! Keep it up.' : healthScore > 50 ? 'Good, but room to improve.' : 'Needs attention.'}</p>
                            </div>
                            <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-4 translate-y-4">
                                {healthScore > 70 ? <CheckCircle size={100} /> : <AlertCircle size={100} />}
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Projected Wealth (Approx)</p>
                            <h2 className="text-3xl font-bold text-green-600 dark:text-green-400">{formatCurrency(summary.totalValue)}</h2>
                            <div className="flex justify-between mt-3 text-xs text-gray-500 dark:text-gray-400">
                                <span>Invested: {formatCurrency(summary.totalInvested)}</span>
                                <span className="text-green-600 dark:text-green-400">Est. Returns: {formatCurrency(summary.totalGain)}</span>
                            </div>

                            {/* Investment Input Section */}
                            <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">How much to invest?</label>
                                    <span className="text-indigo-600 font-bold">{formatCurrency(investmentAmount)}</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max={Math.max(0, monthlyIncome - monthlyExpenses)}
                                    step="500"
                                    value={investmentAmount}
                                    onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                                    className="w-full h-2 bg-indigo-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                />
                                <div className="flex justify-between mt-1 text-xs text-gray-400">
                                    <span>0</span>
                                    <span>Max: {formatCurrency(Math.max(0, monthlyIncome - monthlyExpenses))}</span>
                                </div>

                                <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg flex justify-between items-center">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Remaining Wallet Balance:</span>
                                    <span className="font-bold text-gray-800 dark:text-white">
                                        {formatCurrency(Math.max(0, (monthlyIncome - monthlyExpenses) - investmentAmount))}
                                    </span>
                                </div>
                            </div>

                            {/* Invest Button */}
                            <button
                                onClick={() => {
                                    if (investmentAmount < 2000) {
                                        alert(`Minimum investment threshold is ₹2,000. Please increase your investment amount.`);
                                    } else {
                                        navigate('/goal', {
                                            state: {
                                                openModal: true,
                                                goalData: {
                                                    name: "New Investment",
                                                    targetAmount: Math.round(summary.totalValue), // Or user preferred target? Keeping projection for now.
                                                    savedAmount: investmentAmount
                                                }
                                            }
                                        });
                                    }
                                }}
                                className={`w-full mt-4 font-bold py-3 px-4 rounded-xl flex items-center justify-center transition-all shadow-md active:scale-95 ${investmentAmount >= 2000
                                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                    : 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                                    }`}
                                disabled={investmentAmount < 2000}
                            >
                                <Wallet className="w-5 h-5 mr-2" />
                                {investmentAmount < 2000 ? 'Min ₹2,000 to Invest' : `Invest ${formatCurrency(investmentAmount)}`}
                            </button>
                        </div>
                    </div>

                    {/* Chart Area */}
                    <div className="flex-1 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 min-h-[400px]">
                        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-6">Wealth Projection</h3>
                        <ResponsiveContainer width="100%" height={350}>
                            <BarChart data={projectionData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="year" axisLine={false} tickLine={false} />
                                <YAxis hide />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    cursor={{ fill: 'transparent' }}
                                />
                                <Legend iconType="circle" />
                                <Bar stackId="a" dataKey="invested" name="Invested Amount" fill="#6366f1" radius={[0, 0, 4, 4]} barSize={40} />
                                <Bar stackId="a" dataKey="gain" name="Est. Returns" fill="#22c55e" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Lifestyle Inflation Tracker */}
                    <div className="mb-6">
                        <LifestyleInflation />
                    </div>

                    {/* Recommendations */}
                    <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-2xl border border-indigo-100 dark:border-indigo-800">
                        <h4 className="font-semibold text-indigo-900 dark:text-indigo-200 flex items-center mb-3">
                            <TrendingUp className="w-5 h-5 mr-2" />
                            Smart Recommendations
                        </h4>
                        <ul className="text-sm text-indigo-800 dark:text-indigo-300 space-y-2">
                            {monthlyExpenses > monthlyIncome * 0.7 && (
                                <li>• Your expenses are high ({Math.round((monthlyExpenses / monthlyIncome) * 100)}%). Try to reduce them to below 50-60%.</li>
                            )}
                            {totalDebt > 0 && (
                                <li>• Focus on paying down your debt of {formatCurrency(totalDebt)} to unlock more savings potential.</li>
                            )}
                            {monthlyIncome - monthlyExpenses <= 0 && (
                                <li>• You are currently not saving. increasing income or cutting costs is critical.</li>
                            )}
                            <li>• Consistency is key. A monthly saving of {formatCurrency(monthlyIncome - monthlyExpenses)} grows massively over time.</li>
                        </ul>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default FinancialHealth;
