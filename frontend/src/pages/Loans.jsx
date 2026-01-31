import React, { useState } from 'react';
import {
    User,
    GraduationCap,
    Car,
    ChevronRight,
    ArrowRight,
    Calculator,
    Percent,
    CreditCard,
    Search,
    BookOpen
} from 'lucide-react';

const Loans = () => {
    const [activeTab, setActiveTab] = useState('personal');

    const tabs = [
        { id: 'personal', label: 'Personal loans', icon: User },
        { id: 'student', label: 'Student loans', icon: GraduationCap },
        { id: 'auto', label: 'Auto loans', icon: Car },
    ];

    const content = {
        personal: {
            title: "Personal Loans",
            description: "Find the best rates and lenders for your personal needs.",
            links: [
                { text: "Pre-qualify for a personal loan", url: "/loans/pre-qualify" },
                { text: "Personal loan reviews", url: "/loans/reviews" },
                { text: "Personal loan calculator", url: "/loans/personal-calculator" },

            ],
            picks: [
                { text: "Best personal loans", url: "#" },
                { text: "Best debt consolidation loans", url: "#" },
                { text: "Best loans for bad credit", url: "#" },
                { text: "Best home improvement loans", url: "#" },
            ]
        },
        student: {
            title: "Student Loans",
            description: "Navigate paying for college and managing student debt.",
            links: [
                { text: "Paying for college", url: "#" },
                { text: "FAFSA and federal student aid", url: "#" },
                { text: "Taking out student loans", url: "#" },
                { text: "Paying off student loans", url: "#" },

            ],
            picks: [
                { text: "Best private student loans", url: "#" },
                { text: "Best graduate school loans", url: "#" },
                { text: "Best student refinance lenders", url: "#" },
                { text: "Best parent loans for college", url: "#" },
            ]
        },
        auto: {
            title: "Auto Loans",
            description: "Get on the road with the right auto loan for you.",
            links: [
                { text: "Best auto loans for good and bad credit", url: "#" },
                { text: "Best auto loans refinance loans", url: "#" },
                { text: "Best lease buyout loans", url: "#" },
            ],
            picks: [
                { text: "Auto loan calculator", url: "#" },
                { text: "Auto loans refinance calculator", url: "#" },
                { text: "Total car cost calculator", url: "#" },
            ]
        }
    };

    const activeContent = content[activeTab];

    return (
        <div className="p-6 md:p-12 max-w-7xl mx-auto min-h-screen">
            {/* Header */}
            <div className="mb-12">
                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
                    Finding the right loan for you
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                    Compare rates, calculate payments, and find the best lenders.
                </p>
            </div>

            <div className="flex flex-col md:flex-row bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden min-h-[600px]">

                {/* Left Sidebar Navigation */}
                <div className="w-full md:w-1/4 bg-gray-50 dark:bg-gray-900/50 border-r border-gray-100 dark:border-gray-700 p-6 flex flex-col gap-2">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 px-3">Loan Types</h3>
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center justify-between w-full px-4 py-4 rounded-xl text-left transition-all duration-300 group ${activeTab === tab.id
                                    ? 'bg-[#004e36] text-white shadow-lg shadow-green-900/20'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800 hover:shadow-md'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <Icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-green-300' : 'text-gray-400 group-hover:text-[#004e36]'}`} />
                                    <span className="font-semibold text-lg">{tab.label}</span>
                                </div>
                                {activeTab === tab.id && <ChevronRight className="w-5 h-5 text-green-300" />}
                            </button>
                        );
                    })}
                </div>

                {/* Right Content Area */}
                <div className="flex-1 p-8 md:p-12 flex flex-col md:flex-row gap-12">

                    {/* Main List */}
                    <div className="flex-1 space-y-8">
                        <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
                                {activeContent.title}
                            </h2>
                            <p className="text-gray-500 dark:text-gray-400 text-lg">{activeContent.description}</p>
                        </div>

                        <div className="space-y-4">
                            {activeContent.links.map((link, index) => (
                                <a
                                    key={index}
                                    href={link.url}
                                    target={link.target || "_self"}
                                    rel={link.target === "_blank" ? "noopener noreferrer" : undefined}
                                    className={`group flex items-center gap-3 text-lg font-medium transition-colors p-2 -ml-2 rounded-lg ${link.highlight
                                        ? 'text-[#004e36] hover:text-[#007a55] dark:text-green-400 font-bold'
                                        : 'text-gray-700 dark:text-gray-300 hover:text-[#004e36] dark:hover:text-green-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                                        }`}
                                >
                                    {link.highlight && <Search className="w-5 h-5" />}
                                    {link.text}
                                </a>
                            ))}

                            <a href="#" className="inline-flex items-center gap-2 mt-4 font-bold text-gray-900 dark:text-white hover:underline decoration-[#004e36] decoration-2 underline-offset-4 pt-4">
                                Explore more {activeTab} loan resources <ArrowRight className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Right Sidebar (Picks) */}
                    <div className="w-full md:w-80 bg-[#e6fbf2] dark:bg-green-900/20 p-8 rounded-2xl h-fit">
                        <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-6">
                            FinanceTracker's Picks
                        </h3>
                        <ul className="space-y-5">
                            {activeContent.picks.map((pick, i) => (
                                <li key={i}>
                                    <a href={pick.url} className="text-[#005e41] dark:text-green-300 font-bold hover:underline text-lg leading-tight block">
                                        {pick.text}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Loans;
