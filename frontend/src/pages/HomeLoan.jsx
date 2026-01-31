import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Home, DollarSign, Wallet, PlusCircle } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addTransaction } from '../store/slices/transactionSlice';

const HomeLoan = () => {
    const dispatch = useDispatch();

    // --- State for Calculator Inputs ---
    const [homePrice, setHomePrice] = useState(425000);
    const [downPayment, setDownPayment] = useState(85000);
    const [downPaymentPercent, setDownPaymentPercent] = useState(20);
    const [loanTerm, setLoanTerm] = useState(30);
    const [interestRate, setInterestRate] = useState(5.0);
    const [propertyTax, setPropertyTax] = useState(280); // Monthly
    const [insurance, setInsurance] = useState(66); // Monthly

    // --- State for "Purse Impact" ---
    const [monthlyIncome, setMonthlyIncome] = useState(5000);

    // --- State for Results ---
    const [monthlyPrincipalInterest, setMonthlyPrincipalInterest] = useState(0);
    const [totalMonthlyPayment, setTotalMonthlyPayment] = useState(0);
    const [chartData, setChartData] = useState([]);

    const handleAddExpense = async () => {
        if (!totalMonthlyPayment || totalMonthlyPayment <= 0) {
            alert("Invalid EMI amount.");
            return;
        }

        if (window.confirm(`Add monthly EMI of ${formatCurrency(totalMonthlyPayment)} to your expenses?`)) {
            console.log("Attempting to add expense:", { amount: totalMonthlyPayment, category: 'Bills' });
            try {
                const result = await dispatch(addTransaction({
                    type: 'expense',
                    amount: Number(totalMonthlyPayment),
                    category: 'Bills',
                    description: 'Home Loan EMI',
                    date: new Date().toISOString()
                })).unwrap();

                console.log("Expense added result:", result);
                alert(`Successfully added EMI of ${formatCurrency(totalMonthlyPayment)} to expenses!`);
            } catch (error) {
                console.error("Failed to add expense:", error);
                const errorMessage = typeof error === 'string' ? error : (error?.message || "Unknown server error");
                alert(`Error adding expense: ${errorMessage}`);
            }
        }
    };

    // --- Calculations ---
    useEffect(() => {
        // 1. Calculate Loan Amount
        const loanAmount = homePrice - downPayment;

        // 2. Calculate Monthly Principal & Interest (EMI)
        // Formula: M = P [ i(1 + i)^n ] / [ (1 + i)^n – 1 ]
        // P = Loan Amount
        // i = Monthly Interest Rate (Annual Rate / 12 / 100)
        // n = Total Number of Payments (Loan Term * 12)

        if (loanAmount > 0 && interestRate > 0 && loanTerm > 0) {
            const monthlyRate = interestRate / 100 / 12;
            const numberOfPayments = loanTerm * 12;

            const numerator = monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments);
            const denominator = Math.pow(1 + monthlyRate, numberOfPayments) - 1;

            const emi = loanAmount * (numerator / denominator);
            setMonthlyPrincipalInterest(Math.round(emi));

            const total = Math.round(emi + propertyTax + insurance);
            setTotalMonthlyPayment(total);

            // Chart Data
            setChartData([
                { name: 'Principal & Interest', value: Math.round(emi), color: '#3b82f6' }, // Blue-500
                { name: 'Property Tax', value: propertyTax, color: '#86efac' }, // Green-300
                { name: "Homeowner's Insurance", value: insurance, color: '#a855f7' }, // Purple-500
            ]);
        } else {
            setMonthlyPrincipalInterest(0);
            setTotalMonthlyPayment(0);
            setChartData([]);
        }

    }, [homePrice, downPayment, loanTerm, interestRate, propertyTax, insurance]);

    // Update Down Payment Amount when Percent changes
    const handleDownPaymentPercentChange = (percent) => {
        setDownPaymentPercent(percent);
        setDownPayment(Math.round(homePrice * (percent / 100)));
    };

    // Update Down Payment Percent when Amount changes
    const handleDownPaymentAmountChange = (amount) => {
        setDownPayment(amount);
        setDownPaymentPercent(Math.round((amount / homePrice) * 100));
    };

    const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);


    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                    <Home className="w-8 h-8 text-blue-600" />
                    Mortgage Calculator
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">Estimate your monthly mortgage payments and see how it fits your budget.</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Left Column: Calculator Inputs */}
                <div className="w-full lg:w-1/3 space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Home price</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
                            <input
                                type="number"
                                value={homePrice}
                                onChange={(e) => {
                                    setHomePrice(Number(e.target.value));
                                    // Update down payment amount to keep percentage ratio, or keep amount? Usually keep percent logic or static amount. 
                                    // Let's keep check:
                                    setDownPayment(Math.round(Number(e.target.value) * (downPaymentPercent / 100)));
                                }}
                                className="w-full pl-8 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white font-bold text-lg"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Down payment</label>
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
                                <input
                                    type="number"
                                    value={downPayment}
                                    onChange={(e) => handleDownPaymentAmountChange(Number(e.target.value))}
                                    className="w-full pl-8 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white font-bold"
                                />
                            </div>
                            <div className="relative w-24">
                                <input
                                    type="number"
                                    value={downPaymentPercent}
                                    onChange={(e) => handleDownPaymentPercentChange(Number(e.target.value))}
                                    className="w-full pl-3 pr-8 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white font-bold text-center"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold">%</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Loan term</label>
                        <select
                            value={loanTerm}
                            onChange={(e) => setLoanTerm(Number(e.target.value))}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white font-bold appearance-none"
                        >
                            <option value={15}>15 years</option>
                            <option value={20}>20 years</option>
                            <option value={30}>30 years</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Interest rate</label>
                        <div className="relative">
                            <input
                                type="number"
                                step="0.1"
                                value={interestRate}
                                onChange={(e) => setInterestRate(Number(e.target.value))}
                                className="w-full pl-4 pr-8 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white font-bold"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold">%</span>
                        </div>
                    </div>

                    {/* Optional: Simple Zip Code Input for visual matching */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">ZIP code</label>
                        <input
                            type="text"
                            defaultValue="522213"
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                        />
                    </div>

                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-lg transition-colors">
                        Update
                    </button>
                </div>

                {/* Right Column: Results & Purse Impact */}
                <div className="w-full lg:w-2/3 space-y-8">

                    {/* Mortgage Breakdown Card */}
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="flex flex-col md:flex-row justify-between items-start mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Monthly payment breakdown</h2>
                                <p className="text-sm text-gray-500">Based on national average rates</p>
                            </div>
                            <div className="text-right mt-4 md:mt-0">
                                <div className="text-4xl font-extrabold text-gray-900 dark:text-white">
                                    {formatCurrency(totalMonthlyPayment)}<span className="text-lg text-gray-500 font-medium">/mo</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row items-center gap-12">
                            {/* Donut Chart */}
                            <div className="relative w-48 h-48 shrink-0">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={chartData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={2}
                                            dataKey="value"
                                        >
                                            {chartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value) => formatCurrency(value)} />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                    <span className="text-xl font-bold text-gray-900 dark:text-white">{formatCurrency(totalMonthlyPayment)}</span>
                                    <span className="text-xs text-gray-500">/mo</span>
                                </div>
                            </div>

                            {/* Legend / Breakdown List */}
                            <div className="flex-1 w-full space-y-4">
                                <div className="flex justify-between items-center pb-2 border-b border-gray-100 dark:border-gray-700">
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                        <span className="text-gray-700 dark:text-gray-300 font-medium">Principal & interest</span>
                                    </div>
                                    <span className="font-bold text-gray-900 dark:text-white">{formatCurrency(monthlyPrincipalInterest)}</span>
                                </div>
                                <div className="flex justify-between items-center pb-2 border-b border-gray-100 dark:border-gray-700">
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 rounded-full bg-green-300"></div>
                                        <span className="text-gray-700 dark:text-gray-300 font-medium">Property tax</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-400 text-xs">+</span>
                                        <div className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-20 text-right">
                                            <span className="font-bold text-gray-900 dark:text-white">$ {propertyTax}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center pb-2 border-b border-gray-100 dark:border-gray-700">
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                                        <span className="text-gray-700 dark:text-gray-300 font-medium">Homeowner's insurance</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-400 text-xs">+</span>
                                        <div className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-20 text-right">
                                            <span className="font-bold text-gray-900 dark:text-white">$ {insurance}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Purse Impact Section */}
                    <div className="bg-indigo-50 dark:bg-indigo-900/20 p-8 rounded-2xl border border-indigo-100 dark:border-indigo-800">
                        <h2 className="text-2xl font-bold text-indigo-900 dark:text-indigo-200 mb-6 flex items-center gap-2">
                            <Wallet className="w-6 h-6" />
                            Purse Impact
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                            <div>
                                <label className="block text-sm font-bold text-indigo-800 dark:text-indigo-300 mb-2">Your Monthly Income</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500 font-bold">$</span>
                                    <input
                                        type="number"
                                        value={monthlyIncome}
                                        onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                                        className="w-full pl-8 pr-4 py-3 border border-indigo-200 dark:border-indigo-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white font-bold text-xl text-indigo-700"
                                    />
                                </div>
                                <p className="text-sm text-indigo-600 dark:text-indigo-400 mt-2">
                                    See how your mortgage cuts into your monthly budget.
                                </p>
                            </div>

                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-indigo-100 dark:border-indigo-800">
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-gray-500 font-medium">Monthly Income</span>
                                    <span className="text-gray-900 dark:text-white font-bold">{formatCurrency(monthlyIncome)}</span>
                                </div>
                                <div className="flex justify-between items-end mb-4">
                                    <span className="text-red-500 font-medium">Mortgage (EMI)</span>
                                    <span className="text-red-500 font-bold">- {formatCurrency(totalMonthlyPayment)}</span>
                                </div>
                                <div className="h-px bg-gray-200 dark:bg-gray-700 mb-4"></div>
                                <div className="flex justify-between items-end">
                                    <span className="text-lg font-bold text-indigo-900 dark:text-indigo-200">Remaining in Purse</span>
                                    <span className={`text-2xl font-extrabold ${monthlyIncome - totalMonthlyPayment >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {formatCurrency(monthlyIncome - totalMonthlyPayment)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Visual Bar */}
                        <div className="mt-8">
                            <div className="w-full h-6 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden flex">
                                <div
                                    className="h-full bg-red-500"
                                    style={{ width: `${Math.min(100, (totalMonthlyPayment / (monthlyIncome || 1)) * 100)}%` }}
                                ></div>
                                <div className="h-full bg-green-500 flex-1"></div>
                            </div>
                            <div className="flex justify-between text-xs font-bold mt-2">
                                <span className="text-red-500">Mortgage: {Math.round((totalMonthlyPayment / (monthlyIncome || 1)) * 100)}%</span>
                                <span className="text-green-600">Free: {Math.max(0, 100 - Math.round((totalMonthlyPayment / (monthlyIncome || 1)) * 100))}%</span>
                            </div>
                        </div>

                        {/* Add to Expenses CTA */}
                        <div className="mt-8 pt-6 border-t border-indigo-200 dark:border-indigo-800 flex justify-end">
                            <button
                                onClick={handleAddExpense}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-indigo-500/20 flex items-center gap-2 transform active:scale-95 transition-all"
                            >
                                <PlusCircle className="w-5 h-5" />
                                Confirm Add to Expenses
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomeLoan;
