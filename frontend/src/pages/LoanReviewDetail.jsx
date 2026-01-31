import React from 'react';
import { ArrowLeft, Star, Trophy, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LoanReviewDetail = () => {
    const navigate = useNavigate();

    // Data matching the screenshot exactly
    const loanData = {
        name: 'upgrade',
        rating: 5.0,
        apr: '7.74 - 35.99%',
        minScore: '600',
        timeToFund: '1 day',
        amount: '$1K - $50K',
        term: '2 to 7 years',
        originationFee: '1.85% to 9.99%',
        badge: '2026 Best Personal Loan Overall'
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans">
            {/* Green Header Background - Half height */}
            <div className="bg-[#004e36] h-64 w-full absolute top-0 left-0 z-0"></div>

            {/* Content Container */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-12">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/loans/reviews')}
                    className="flex items-center text-green-100 hover:text-white transition-colors mb-8"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" /> Back to Reviews
                </button>

                {/* Main Card */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
                    <div className="p-8 md:p-10 flex flex-col md:flex-row gap-8 md:gap-12">

                        {/* Left Column: Logo & CTA */}
                        <div className="w-full md:w-1/3 flex flex-col items-center md:items-start space-y-8 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700 pb-8 md:pb-0 md:pr-8">
                            {/* Logo */}
                            <div className="transform scale-125 origin-left">
                                <div className="flex items-center text-green-700 dark:text-green-400 font-bold text-3xl tracking-tighter">
                                    <div className="w-8 h-10 border-l-[6px] border-green-700 dark:border-green-400 mr-1.5 rounded-sm"></div>
                                    upgrade
                                </div>
                            </div>

                            {/* CTA Button */}
                            <button
                                onClick={() => navigate('/loans/pre-qualify')}
                                className="w-full bg-[#008F4C] hover:bg-[#00703c] text-white font-bold py-4 px-6 rounded-md uppercase tracking-wide transition-all shadow-sm hover:shadow-md text-sm">
                                Get My Rate
                            </button>

                            {/* Award Badge */}
                            <div className="flex items-center text-xs text-gray-700 dark:text-gray-300">
                                <Trophy className="w-4 h-4 text-yellow-600 mr-2" />
                                <span>{loanData.badge}</span>
                            </div>
                        </div>

                        {/* Right Column: Details */}
                        <div className="w-full md:w-2/3">
                            {/* Rating Header */}
                            <div className="flex items-center mb-10">
                                <div className="flex text-green-700 dark:text-green-400 space-x-1 mr-3">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star key={star} className="w-6 h-6 fill-current" />
                                    ))}
                                </div>
                                <span className="text-xl font-bold text-gray-900 dark:text-white mr-2">{loanData.rating}</span>
                                <span className="text-gray-500 dark:text-gray-400 text-sm flex items-center">
                                    FinanceTracker Rating <Info className="w-3.5 h-3.5 ml-1" />
                                </span>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-8 gap-x-4">
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Est. APR</p>
                                    <p className="font-bold text-lg text-gray-900 dark:text-gray-100">{loanData.apr}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Min. credit score</p>
                                    <p className="font-bold text-lg text-gray-900 dark:text-gray-100">{loanData.minScore}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Time to fund</p>
                                    <p className="font-bold text-lg text-gray-900 dark:text-gray-100">{loanData.timeToFund}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Loan amount</p>
                                    <p className="font-bold text-lg text-gray-900 dark:text-gray-100">{loanData.amount}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Loan term</p>
                                    <p className="font-bold text-lg text-gray-900 dark:text-gray-100">{loanData.term}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Origination fee</p>
                                    <p className="font-bold text-lg text-gray-900 dark:text-gray-100">{loanData.originationFee}</p>
                                </div>
                            </div>

                            {/* Disclosures Link */}
                            <div className="mt-8 pt-4 border-t border-gray-100 dark:border-gray-700">
                                <a href="#" className="text-xs text-blue-600 hover:underline">Disclosures from Upgrade</a>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoanReviewDetail;
