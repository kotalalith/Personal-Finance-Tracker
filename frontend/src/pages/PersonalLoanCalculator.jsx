import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addTransaction } from '../store/slices/transactionSlice';
import { Calculator, IndianRupee, Wallet, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';

const PersonalLoanCalculator = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // --- State for Calculator Inputs ---
    const [loanAmount, setLoanAmount] = useState(750000);
    const [tenure, setTenure] = useState(1); // Years
    const [interestRate, setInterestRate] = useState(9.99); // % PA

    // --- State for Results ---
    const [monthlyEMI, setMonthlyEMI] = useState(0);
    const [totalPayable, setTotalPayable] = useState(0);
    const [totalInterest, setTotalInterest] = useState(0);

    // --- Helper Options ---
    const minLoan = 25000;
    const maxLoan = 5000000;
    const minTenure = 1;
    const maxTenure = 7;
    const minRate = 9.99;
    const maxRate = 24.00;

    // --- Calculations ---
    useEffect(() => {
        // Formula: E = P * r * (1+r)^n / ((1+r)^n - 1)
        // P = Principal Amount
        // r = Monthly Interest Rate (Annual Rate / 12 / 100)
        // n = Total Number of Payments (Tenure * 12)

        const P = loanAmount;
        const R = interestRate / 12 / 100;
        const N = tenure * 12;

        let emi = 0;
        if (P > 0 && R > 0 && N > 0) {
            emi = (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
        }

        const emiRounded = Math.round(emi);
        const totalPayableCalc = emiRounded * N;
        const totalInterestCalc = totalPayableCalc - P;

        setMonthlyEMI(emiRounded);
        setTotalPayable(totalPayableCalc);
        setTotalInterest(totalInterestCalc);

    }, [loanAmount, tenure, interestRate]);

    const formatCurrency = (val) => new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(val);

    const handleAddExpense = async () => {
        if (!monthlyEMI || monthlyEMI <= 0) {
            alert("Invalid EMI amount.");
            return;
        }

        if (window.confirm(`Add monthly EMI of ${formatCurrency(monthlyEMI)} to your expenses?`)) {
            try {
                // Dispatch logic to add the transaction (expense)
                // Note: The Dashboard looks for 'Debt' category or 'Loan' in description for "Total Debt"
                await dispatch(addTransaction({
                    type: 'expense',
                    amount: Number(monthlyEMI), // Store as number
                    category: 'Debt', // Important for dashboard calculation
                    description: 'Personal Loan EMI',
                    date: new Date().toISOString()
                })).unwrap();

                alert(`Successfully added EMI of ${formatCurrency(monthlyEMI)} to expenses!`);
                navigate('/'); // Redirect to dashboard to see impact? Or stay here? User said "display amount in dashbord", often checking it is good.
            } catch (error) {
                console.error("Failed to add expense:", error);
                alert("Failed to add expense. Please try again.");
            }
        }
    };

    const handleApply = () => {
        // 1. Simulate Application Submission
        if (window.confirm(`Submit loan application for ${formatCurrency(loanAmount)}?`)) {
            alert(`Loan Application Submitted Successfully! We will contact you shortly.`);

            // 2. Prompt to Add EMI
            // We reuse the existing logic which already asks for confirmation.
            // This fulfills "should apply and also ask you to add emi"
            handleAddExpense();
        }
    };

    // Slider Background Helper
    const getBackgroundSize = (value, min, max) => {
        return { backgroundSize: `${((value - min) * 100) / (max - min)}% 100%` };
    };

    return (
        <div className="p-6 md:p-12 max-w-7xl mx-auto min-h-screen space-y-8">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2">
                    Personal Loan EMI Calculator
                </h1>
                <p className="text-gray-500 dark:text-gray-400">
                    Take Out the Guess Work from Financial Planning. Calculate your EMIs now!
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* --- Left Panel: Inputs --- */}
                <div className="bg-blue-50 dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-blue-100 dark:border-gray-700 space-y-8">

                    {/* Loan Amount */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <label className="font-bold text-gray-700 dark:text-gray-300">Loan Amount</label>
                            <div className="bg-white dark:bg-gray-900 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center font-bold text-gray-900 dark:text-white min-w-[150px]">
                                <span className="mr-2 text-gray-500 dark:text-gray-400">₹</span>
                                <input
                                    type="number"
                                    value={loanAmount}
                                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                                    className="bg-transparent outline-none w-full text-right font-bold text-gray-900 dark:text-white placeholder-gray-400"
                                    placeholder="Amount"
                                />
                            </div>
                        </div>
                        <input
                            type="range"
                            min={minLoan}
                            max={maxLoan}
                            step={5000}
                            value={loanAmount}
                            onChange={(e) => setLoanAmount(Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#004e36]"
                        />
                        <div className="flex justify-between text-sm font-semibold text-gray-500 dark:text-gray-400">
                            <span>₹ {minLoan.toLocaleString()}</span>
                            <span>₹ {maxLoan.toLocaleString()}</span>
                        </div>
                    </div>

                    {/* Loan Tenure */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <label className="font-bold text-gray-700 dark:text-gray-300">Loan Tenure</label>
                            <div className="bg-white dark:bg-gray-900 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center font-bold text-gray-900 dark:text-white min-w-[120px] justify-end">
                                <input
                                    type="number"
                                    value={tenure}
                                    onChange={(e) => setTenure(Number(e.target.value))}
                                    className="bg-transparent outline-none w-12 text-right mr-2 font-bold text-gray-900 dark:text-white"
                                />
                                <span className="text-gray-500 dark:text-gray-400">Years</span>
                            </div>
                        </div>
                        <input
                            type="range"
                            min={minTenure}
                            max={maxTenure}
                            step={1}
                            value={tenure}
                            onChange={(e) => setTenure(Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#004e36]"
                        />
                        <div className="flex justify-between text-sm font-semibold text-gray-500 dark:text-gray-400">
                            <span>{minTenure} year</span>
                            <span>{maxTenure} years</span>
                        </div>
                    </div>

                    {/* Interest Rate */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <label className="font-bold text-gray-700 dark:text-gray-300">Interest Rate</label>
                            <div className="bg-white dark:bg-gray-900 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center font-bold text-gray-900 dark:text-white min-w-[100px] justify-end">
                                <input
                                    type="number"
                                    value={interestRate}
                                    onChange={(e) => setInterestRate(Number(e.target.value))}
                                    className="bg-transparent outline-none w-16 text-right mr-1 font-bold text-gray-900 dark:text-white"
                                />
                                <span className="text-gray-500 dark:text-gray-400">%</span>
                            </div>
                        </div>
                        <input
                            type="range"
                            min={minRate}
                            max={maxRate}
                            step={0.1}
                            value={interestRate}
                            onChange={(e) => setInterestRate(Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#004e36]"
                        />
                        <div className="flex justify-between text-sm font-semibold text-gray-500 dark:text-gray-400">
                            <span>{minRate}% PA</span>
                            <span>{maxRate}% PA</span>
                        </div>
                    </div>
                </div>

                {/* --- Right Panel: Results --- */}
                <div className="bg-blue-100 dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-blue-200 dark:border-gray-700 flex flex-col justify-between">

                    <div className="text-center pt-8 pb-12 border-b border-blue-200 dark:border-gray-700">
                        <p className="text-gray-600 dark:text-gray-300 font-medium mb-2">Your Monthly EMI will be</p>
                        <h2 className="text-5xl font-extrabold text-[#003d79] dark:text-blue-400">
                            {formatCurrency(monthlyEMI)}
                        </h2>
                    </div>

                    <div className="space-y-6 mt-8">
                        <div className="flex justify-between items-center text-lg">
                            <span className="text-gray-600 dark:text-gray-400 font-medium">Amount Payable</span>
                            <span className="font-bold text-gray-900 dark:text-white">{formatCurrency(totalPayable)}</span>
                        </div>
                        <div className="flex justify-between items-center text-lg">
                            <span className="text-gray-600 dark:text-gray-400 font-medium">Interest Amount</span>
                            <span className="font-bold text-gray-900 dark:text-white">{formatCurrency(totalInterest)}</span>
                        </div>
                        <div className="flex justify-between items-center text-lg">
                            <span className="text-gray-600 dark:text-gray-400 font-medium">Principal Amount</span>
                            <span className="font-bold text-gray-900 dark:text-white">{formatCurrency(loanAmount)}</span>
                        </div>
                    </div>

                    <div className="mt-12 space-y-4">
                        <button
                            onClick={handleApply}
                            className="w-full bg-[#004e36] hover:bg-[#003d2b] text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-lg"
                        >
                            Apply Now <ArrowRight className="w-5 h-5" />
                        </button>

                        <button
                            onClick={handleAddExpense}
                            className="w-full bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-[#004e36] dark:text-white font-bold py-4 rounded-xl shadow-sm border border-[#004e36] dark:border-gray-600 transition-all flex items-center justify-center gap-2 text-lg"
                        >
                            <Wallet className="w-5 h-5" />
                            Add EMI to Dashboard
                        </button>
                    </div>

                </div>
            </div>

            {/* Disclaimer or Footer Info */}
            <div className="text-center text-gray-400 text-sm mt-8">
                * Rates and terms are subject to change. This calculator provides estimates only.
            </div>
        </div>
    );
};

export default PersonalLoanCalculator;
