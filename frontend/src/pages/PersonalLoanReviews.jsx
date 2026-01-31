import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PersonalLoanReviews = () => {
    const navigate = useNavigate();

    const reviews = [
        {
            id: 1,
            name: 'Upgrade',
            logoText: 'upgrade',
            logoColor: 'text-green-700',
            logoIcon: 'U', // Simple placeholder logic
            title: 'Upgrade 2026 Personal Loan Review',
            author: 'by Jackie Veling',
            rating: 5.0
        },
        {
            id: 2,
            name: 'Discover',
            logoText: 'DISCOVER',
            logoColor: 'text-orange-500',
            logoIcon: 'D',
            title: 'Discover 2026 Personal Loan Review',
            author: 'by Jackie Veling, Nicole Dow',
            rating: 5.0
        },
        {
            id: 3,
            name: 'LightStream',
            logoText: 'LightStream',
            logoColor: 'text-blue-600',
            logoSub: 'by Truist',
            logoIcon: 'L',
            title: 'LightStream 2026 Personal Loan Review',
            author: 'by Nicole Dow',
            rating: 5.0
        },
        {
            id: 4,
            name: 'Happy Money',
            logoText: 'Happy Money',
            logoColor: 'text-pink-500',
            logoIcon: 'H',
            title: 'Happy Money 2026 Personal Loan Review',
            author: 'by Ronita Choudhuri-Wade, Jackie Veling',
            rating: 4.5
        }
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 font-sans">

            {/* Green Header Section */}
            <div className="bg-[#004e36] text-white px-6 md:px-12 py-12 md:py-16 relative">
                <button
                    onClick={() => navigate('/loans')}
                    className="absolute top-6 left-6 md:left-12 flex items-center text-green-100 hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" /> Back
                </button>

                <div className="max-w-4xl mx-auto mt-6">
                    <h1 className="text-4xl md:text-5xl font-serif mb-6 tracking-tight">Personal Loan Reviews</h1>
                    <p className="text-lg md:text-xl leading-relaxed text-green-50 max-w-3xl">
                        Read FinanceTracker reviews of personal loans, plus cash advance and buy now, pay later apps. Compare loans from multiple lenders to get one with costs and features that match your needs.
                    </p>
                </div>

                {/* Decorative green triangle/shape in top left corner if we wanted to be exact, but plain green is fine */}
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
                <h2 className="text-3xl md:text-4xl font-serif text-gray-900 dark:text-white mb-12">
                    FinanceTracker's top-rated personal loans
                </h2>

                <div className="grid grid-col-1 md:grid-cols-2 gap-x-16 gap-y-16">
                    {reviews.map((review) => (
                        <div key={review.id}
                            onClick={() => review.name === 'Upgrade' ? navigate('/loans/reviews/upgrade') : null}
                            className="flex flex-col sm:flex-row gap-6 items-start sm:items-center group cursor-pointer">
                            {/* Logo Area */}
                            <div className="w-40 sm:w-48 flex-shrink-0">
                                {/* Simulated Logo */}
                                <div className="font-bold text-2xl flex items-center gap-2">
                                    {/* Simple icon or text representation */}
                                    {review.name === 'Upgrade' && (
                                        <div className="flex items-center text-green-700 dark:text-green-400">
                                            <div className="w-6 h-8 border-l-4 border-green-700 dark:border-green-400 mr-1"></div>
                                            <span className="tracking-tighter">upgrade</span>
                                        </div>
                                    )}
                                    {review.name === 'Discover' && (
                                        <div className="text-gray-900 dark:text-gray-100 font-sans tracking-wide">
                                            DISC<span className="text-orange-500">O</span>VER
                                        </div>
                                    )}
                                    {review.name === 'LightStream' && (
                                        <div className="text-gray-800 dark:text-gray-200 leading-none">
                                            <span className="text-yellow-500 text-3xl">✴</span> LightStream
                                            <span className="block text-[10px] text-right text-gray-500">by Truist</span>
                                        </div>
                                    )}
                                    {review.name === 'Happy Money' && (
                                        <div className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
                                            <div className="w-6 h-6 rounded-full border-2 border-gray-800 dark:border-gray-200 flex items-center justify-center text-xs">:)</div>
                                            Happy Money.
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Text Content */}
                            <div>
                                <h3 className="text-xl font-medium text-gray-900 dark:text-white group-hover:underline underline-offset-4 decoration-[#004e36] decoration-2 transition-all">
                                    {review.title}
                                </h3>
                                <div className="mt-3 flex items-center gap-3">
                                    {/* Author Avatar Placeholder */}
                                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                                        <img src={`https://ui-avatars.com/api/?name=${review.author.split(' ')[1]}&background=random`} alt="Author" className="w-full h-full object-cover" />
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {review.author}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default PersonalLoanReviews;
