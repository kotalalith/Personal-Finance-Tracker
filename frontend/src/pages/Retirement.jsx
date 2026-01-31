import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calculator, Info, Wallet, TrendingUp, DollarSign } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addTransaction } from '../store/slices/transactionSlice';

const Retirement = () => {
    // --- State for Inputs ---
    const [currentAge, setCurrentAge] = useState('24');
    const [retirementAge, setRetirementAge] = useState('68');
    const [annualIncome, setAnnualIncome] = useState('70000');
    const [incomeIncrease, setIncomeIncrease] = useState('5'); // %
    const [currentSavings, setCurrentSavings] = useState('0');
    const [savingsPercent, setSavingsPercent] = useState('10'); // %
    const [expectedReturn, setExpectedReturn] = useState('8'); // % (Hidden or Advanced, default 8%)
    const [withdrawalAmount, setWithdrawalAmount] = useState('');

    // --- State for Results ---
    const [totalSavings, setTotalSavings] = useState(0);
    const [totalDeposits, setTotalDeposits] = useState(0);
    const [totalInterest, setTotalInterest] = useState(0);
    const [chartData, setChartData] = useState([]);
    const [needed, setNeeded] = useState(0);

    const dispatch = useDispatch();

    const handleWithdraw = async () => {
        if (withdrawalAmount <= 0) return;
        if (Number(withdrawalAmount) > Number(currentSavings)) {
            alert("Cannot withdraw more than current savings!");
            return;
        }

        try {
            await dispatch(addTransaction({
                type: 'income',
                amount: withdrawalAmount,
                category: 'Investment', // Or 'Other'
                description: 'Retirement Withdrawal',
                date: new Date().toISOString()
            })).unwrap();

            // Update local state to reflect withdrawal
            setCurrentSavings(String(Math.max(0, Number(currentSavings) - Number(withdrawalAmount))));
            setWithdrawalAmount('');
            alert(`Successfully withdrew $${withdrawalAmount} to your wallet!`);
        } catch (error) {
            console.error("Withdrawal failed:", error);
            alert("Failed to process withdrawal. Please try again.");
        }
    };

    // --- Calculation Logic ---
    useEffect(() => {
        // Basic Assumptions for "Needed": 
        // Usually people need ~70-80% of their pre-retirement income annually.
        // Using 4% Withdrawal Rule: Needed Corpus = (Final Salary * 0.8) * 25

        let balance = Math.max(0, Number(currentSavings) - Number(withdrawalAmount));
        let investedCapital = balance; // Initial capital
        let income = Number(annualIncome);
        const data = [];
        const numRetirementAge = Number(retirementAge);
        const numCurrentAge = Number(currentAge);

        for (let age = numCurrentAge; age <= numRetirementAge; age++) {
            if (age > numCurrentAge) {
                // Add returns on previous balance
                balance += balance * (Number(expectedReturn) / 100);

                // Add new savings from this year's income
                const yearlySavings = income * (Number(savingsPercent) / 100);
                balance += yearlySavings;
                investedCapital += yearlySavings;

                // Increase income for next year
                income += income * (Number(incomeIncrease) / 100);
            }

            data.push({
                age: age,
                savings: Math.round(balance),
                salary: Math.round(income)
            });
        }

        setTotalSavings(balance);
        setTotalDeposits(investedCapital);
        setTotalInterest(balance - investedCapital);
        setChartData(data);

        // Estimate Needed Corpus (Rough Estimation)
        // Assume final salary is the one at retirement age
        const finalSalary = data[data.length - 1]?.salary || Number(annualIncome);
        const annualRetirementExpenses = finalSalary * 0.70; // 70% of final salary
        // Rule of 25 (inverse of 4% rule)
        const estimatedCorpusNeeded = annualRetirementExpenses * 25;
        setNeeded(estimatedCorpusNeeded);

    }, [currentAge, retirementAge, annualIncome, incomeIncrease, currentSavings, savingsPercent, expectedReturn, withdrawalAmount]);

    const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

    const formatCompactCurrency = (val) => {
        if (Math.abs(val) >= 1_000_000_000_000) { // Trillions
            return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: "compact", maximumFractionDigits: 2 }).format(val);
        }
        if (Math.abs(val) >= 1_000_000_000) { // Billions
            return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: "compact", maximumFractionDigits: 2 }).format(val);
        }
        return formatCurrency(val);
    };

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2 flex items-center gap-3">
                    <Calculator className="w-8 h-8 text-blue-600" />
                    Retirement Calculator
                </h1>
                <p className="text-gray-600 dark:text-gray-400">Plan your future by estimating your retirement savings.</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">

                {/* Left Column: Inputs */}
                <div className="w-full lg:w-1/3 space-y-6 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">

                    {/* Current Age */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">What's your current age?</label>
                        <input
                            type="number"
                            value={currentAge}
                            onChange={(e) => setCurrentAge(e.target.value)}
                            className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-semibold text-gray-900 dark:text-white"
                        />
                    </div>

                    {/* Retirement Age */}
                    <div>
                        <div className="flex justify-between">
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">What age do you plan to retire?</label>
                            <Info className="w-4 h-4 text-gray-400 cursor-pointer" />
                        </div>
                        <input
                            type="number"
                            value={retirementAge}
                            onChange={(e) => setRetirementAge(e.target.value)}
                            className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-semibold text-gray-900 dark:text-white"
                        />
                    </div>

                    {/* Annual Income */}
                    <div>
                        <div className="flex justify-between">
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Current annual household income?</label>
                            <Info className="w-4 h-4 text-gray-400 cursor-pointer" />
                        </div>
                        <div className="relative">
                            <span className="absolute left-3 top-3 text-gray-500 font-bold">$</span>
                            <input
                                type="number"
                                value={annualIncome}
                                onChange={(e) => setAnnualIncome(e.target.value)}
                                className="w-full p-3 pl-8 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-semibold text-gray-900 dark:text-white"
                            />
                        </div>
                    </div>

                    {/* Income Increase % */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Expected annual income increase (%)</label>
                        <div className="relative">
                            <input
                                type="number"
                                min="0"
                                max="100"
                                value={incomeIncrease}
                                onChange={(e) => setIncomeIncrease(e.target.value)}
                                className="w-full p-3 pr-8 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-semibold text-gray-900 dark:text-white"
                            />
                            <span className="absolute right-3 top-3 text-gray-500 font-bold">%</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Average is usually 2-5%</p>
                    </div>

                    {/* Current Savings */}
                    <div>
                        <div className="flex justify-between">
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Saved for retirement so far?</label>
                            <Info className="w-4 h-4 text-gray-400 cursor-pointer" />
                        </div>
                        <div className="relative">
                            <span className="absolute left-3 top-3 text-gray-500 font-bold">$</span>
                            <input
                                type="number"
                                min="0"
                                value={currentSavings}
                                onChange={(e) => setCurrentSavings(e.target.value)}
                                className="w-full p-3 pl-8 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-semibold text-gray-900 dark:text-white"
                            />
                        </div>
                    </div>

                    {/* One-time Withdrawal (Simulation) */}
                    <div>
                        <div className="flex justify-between">
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Withdrawal Amount</label>
                            <Info className="w-4 h-4 text-gray-400 cursor-pointer" title="Simulate taking out money today" />
                        </div>
                        <div className="relative">
                            <span className="absolute left-3 top-3 text-gray-700 font-bold">$</span>
                            <input
                                type="number"
                                min="0"
                                value={withdrawalAmount}
                                onChange={(e) => setWithdrawalAmount(e.target.value)}
                                placeholder="0"
                                className="w-full p-3 pl-8 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-semibold text-gray-900 dark:text-white"
                            />
                        </div>
                        {Number(withdrawalAmount) > Number(currentSavings) && (
                            <p className="text-xs text-red-500 mt-1">Cannot withdraw more than current savings.</p>
                        )}

                        <button
                            onClick={handleWithdraw}
                            disabled={Number(withdrawalAmount) <= 0 || Number(withdrawalAmount) > Number(currentSavings)}
                            className={`mt-2 w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl font-semibold transition-colors text-sm ${Number(withdrawalAmount) > 0 && Number(withdrawalAmount) <= Number(currentSavings)
                                ? 'bg-red-100 text-red-600 hover:bg-red-200'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                }`}
                        >
                            <DollarSign className="w-4 h-4" />
                            Confirm Withdrawal
                        </button>
                    </div>

                    {/* Savings % */}
                    <div>
                        <div className="flex justify-between">
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Annual savings %?</label>
                            <Info className="w-4 h-4 text-gray-400 cursor-pointer" />
                        </div>
                        <div className="relative">
                            <input
                                type="number"
                                min="0"
                                max="100"
                                value={savingsPercent}
                                onChange={(e) => setSavingsPercent(e.target.value)}
                                className="w-full p-3 pr-8 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-semibold text-gray-900 dark:text-white"
                            />
                            <span className="absolute right-3 top-3 text-gray-500 font-bold">%</span>
                        </div>
                    </div>

                </div>

                {/* Right Column: Results */}
                <div className="w-full lg:w-2/3 space-y-6">

                    {/* Summary Card / Dashboard matching the new design */}
                    <div className="bg-gray-900 p-8 rounded-2xl shadow-xl border border-gray-800 text-left">
                        <h2 className="text-2xl font-medium text-orange-500 mb-8 border-b border-gray-800 pb-4">
                            Calculation for {Number(retirementAge) - Number(currentAge)} years
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                            {/* Future Investment Value */}
                            <div>
                                <p className="text-gray-400 text-sm mb-1">Future investment value</p>
                                <h3 className="text-3xl lg:text-4xl font-bold text-green-500 tracking-tight break-all">
                                    {formatCompactCurrency(totalSavings)}
                                </h3>
                            </div>

                            {/* Additional Deposits */}
                            <div>
                                <p className="text-gray-400 text-sm mb-1">Additional deposits</p>
                                <h3 className="text-3xl lg:text-4xl font-bold text-blue-400 tracking-tight break-all">
                                    {formatCompactCurrency(totalDeposits)}
                                </h3>
                            </div>

                            {/* Total Interest Earned */}
                            <div>
                                <p className="text-gray-400 text-sm mb-1">Total interest earned</p>
                                <h3 className="text-3xl lg:text-4xl font-bold text-orange-500 tracking-tight break-all">
                                    {formatCompactCurrency(totalInterest)}
                                </h3>
                            </div>

                            {/* Nominal Rate */}
                            <div>
                                <p className="text-gray-400 text-sm mb-1">Nominal rate (Expected Return)</p>
                                <h3 className="text-3xl lg:text-4xl font-bold text-yellow-500 tracking-tight flex items-baseline gap-2">
                                    {expectedReturn}%
                                </h3>
                            </div>

                            {/* Initial Balance */}
                            <div>
                                <p className="text-gray-400 text-sm mb-1">Initial balance</p>
                                <h3 className="text-3xl lg:text-4xl font-bold text-blue-400 tracking-tight break-all">
                                    {formatCurrency(Math.max(0, Number(currentSavings) - Number(withdrawalAmount)))}
                                </h3>
                            </div>

                            {/* Withdrawal Amount (Show only if > 0) */}
                            {withdrawalAmount > 0 && (
                                <div>
                                    <p className="text-gray-400 text-sm mb-1">Withdrawal Amount</p>
                                    <h3 className="text-3xl lg:text-4xl font-bold text-red-500 tracking-tight break-all">
                                        - {formatCurrency(withdrawalAmount)}
                                    </h3>
                                </div>
                            )}

                            {/* Time-weighted return */}
                            <div>
                                <p className="text-gray-400 text-sm mb-1">Time-weighted return</p>
                                <h3 className="text-3xl lg:text-4xl font-bold text-gray-200 tracking-tight flex items-center gap-2">
                                    <TrendingUp className="w-8 h-8 text-green-500 bg-green-500/20 p-1 rounded-full" />
                                    {((totalInterest / (totalDeposits || 1)) * 100).toFixed(2)}%
                                </h3>
                            </div>
                        </div>
                    </div>

                    {/* Chart */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6">Your Retirement Projection</h3>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="age" />
                                    <YAxis
                                        tickFormatter={(value) => `$${value / 1000}k`}
                                        domain={['auto', 'auto']}
                                    />
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <Tooltip
                                        formatter={(value) => formatCurrency(value)}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Area type="monotone" dataKey="savings" stroke="#3b82f6" fillOpacity={1} fill="url(#colorSavings)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                        <p className="text-center text-xs text-gray-500 mt-4">
                            Assumes an average annual market return of {expectedReturn}% and salary growth of {incomeIncrease}%.
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Retirement;
