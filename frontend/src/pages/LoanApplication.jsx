import React, { useState } from 'react';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addTransaction } from '../store/slices/transactionSlice';

const LoanApplication = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [step, setStep] = useState(1);
    const [loanType, setLoanType] = useState('Debt consolidation');
    const [debtAmount, setDebtAmount] = useState(10000);

    const handleContinue = async () => {
        if (step === 1) {
            setStep(2);
        } else if (step === 2) {
            // Apply logic: Add the debt as a transaction of type expense (or special type) to be visible on dashboard/calendar
            const newTransaction = {
                type: 'expense',
                amount: Number(debtAmount),
                category: 'Other', // Using 'Other' to ensure it works without backend restart
                description: `${loanType} - Loan Balance`,
                date: new Date().toISOString(), // Today's date
            };

            try {
                // Dispatch action to add transaction
                // Assuming addTransaction is an async thunk
                await dispatch(addTransaction(newTransaction)).unwrap();

                // Navigate to dashboard or calendar as requested, user said "dashboard and calender will apear"
                // Let's go to Dashboard first
                navigate('/');
            } catch (error) {
                console.error("Failed to add debt transaction:", error);
                alert("Failed to process loan application. Please try again.");
            }
        }
    };

    const handleBack = () => {
        if (step === 2) {
            setStep(1);
        } else {
            navigate('/loans');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col font-sans">
            {/* Simple centered header matching screenshot */}
            <div className="bg-white dark:bg-gray-800 py-6 border-b border-gray-100 dark:border-gray-700 flex justify-center sticky top-0 z-10">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-sm bg-[#008f52]"></div> {/* Simple Logo Placeholder */}
                    <span className="text-xl font-bold tracking-tight text-gray-700 dark:text-gray-200">
                        finance<span className="text-gray-900 dark:text-white">tracker</span>
                    </span>
                </div>
            </div>

            <div className="flex-1 flex flex-col items-center pt-8 md:pt-16 pb-12 px-4">
                <div className="w-full max-w-[600px]">
                    {step === 1 && (
                        <div className="animate-fade-in-up">
                            <h1 className="text-4xl md:text-[2.75rem] font-serif text-center text-gray-900 dark:text-white mb-12 leading-tight">
                                How are you going to use the money?
                            </h1>
                            <div className="space-y-4">
                                {['Debt consolidation', 'Medical', 'Home improvement'].map((option) => (
                                    <div
                                        key={option}
                                        onClick={() => setLoanType(option)}
                                        className={`group relative p-4 rounded-md border cursor-pointer flex items-center gap-4 transition-all duration-200 bg-white dark:bg-gray-800
                                            ${loanType === option
                                                ? 'border-gray-900 dark:border-white shadow-sm ring-1 ring-gray-900 dark:ring-white'
                                                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                                            }
                                        `}
                                    >
                                        {/* Radio Circle */}
                                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0
                                            ${loanType === option ? 'border-gray-900 dark:border-white' : 'border-gray-400 dark:border-gray-500 group-hover:border-gray-600'}
                                        `}>
                                            {loanType === option && <div className="w-2.5 h-2.5 rounded-full bg-gray-900 dark:bg-white" />}
                                        </div>

                                        <span className="text-lg font-semibold text-gray-900 dark:text-white">
                                            {option}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="animate-fade-in-up text-center w-full max-w-lg mx-auto">
                            <h1 className="text-4xl md:text-[2.75rem] font-serif text-gray-900 dark:text-white mb-8 leading-tight">
                                What’s your estimated debt balance?
                            </h1>

                            <div className="mb-12 mt-12">
                                <div className="text-5xl font-bold text-[#008f52] mb-12 tabular-nums">
                                    ${Number(debtAmount).toLocaleString()}
                                </div>

                                <div className="relative w-full h-6 flex items-center">
                                    <input
                                        type="range"
                                        min="2000"
                                        max="100000"
                                        step="500"
                                        value={debtAmount}
                                        onChange={(e) => setDebtAmount(e.target.value)}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#008f52] outline-none z-20 relative"
                                    />
                                    {/* Custom Track (optional for webkit styling, but pure CSS accent is mostly fine) */}
                                </div>

                                <div className="flex justify-between text-xs font-bold text-gray-900 dark:text-white mt-6 uppercase tracking-wider">
                                    <span>$2,000</span>
                                    <span>$100,000</span>
                                </div>
                            </div>
                        </div>
                    )}

                    <button
                        onClick={handleContinue}
                        className="w-full mt-8 bg-[#008f52] hover:bg-[#007a46] text-white font-bold text-sm tracking-widest py-4 rounded-[4px] shadow-sm uppercase transition-colors duration-200"
                    >
                        Continue
                    </button>

                </div>
            </div>
        </div>
    );
};

export default LoanApplication;
