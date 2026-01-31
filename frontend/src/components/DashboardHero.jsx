import React, { useEffect, useState } from "react";
import { ArrowRight, CheckCircle, TrendingUp, CreditCard, Shield } from "lucide-react";
import { Link } from "react-router-dom";

const DashboardHero = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    return (
        <div className={`relative w-full overflow-hidden bg-gradient-to-br from-[#004e36] to-[#007a55] rounded-3xl p-8 md:p-12 mb-8 transition-all duration-1000 transform ${isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}>

            {/* Background Decorative Circles */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-green-300 opacity-10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">

                {/* Left Content */}
                <div className="flex-1 space-y-6 text-center md:text-left">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight tracking-tight">
                        Smart financial decisions start with <span className="text-[#a8e6cf]">FinanceTracker</span>
                    </h1>
                    <p className="text-lg text-green-50 max-w-xl mx-auto md:mx-0 leading-relaxed font-light">
                        Navigate every money move with guidance you can trust. Track expenses, set goals, and secure your future all in one place.
                    </p>

                    <div className="flex flex-wrap gap-4 justify-center md:justify-start pt-4">
                        <Link
                            to="/goal"
                            className="px-8 py-3 bg-white text-[#004e36] font-bold rounded-full hover:bg-gray-100 transition-transform active:scale-95 shadow-lg flex items-center gap-2"
                        >
                            Get Started <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link
                            to="/insights"
                            className="px-8 py-3 bg-[#006042] text-white font-semibold rounded-full hover:bg-[#005238] transition-colors border border-[#007a55] shadow-md"
                        >
                            View Insights
                        </Link>
                    </div>
                </div>

                {/* Right Content - Visual Elements */}
                <div className="flex-1 relative w-full max-w-md mx-auto perspective-1000">

                    {/* Main Visual - Simulated App Screen/Person Wrapper */}
                    <div className="relative z-10 animate-float-slow">
                        {/* We can use a stylized illustration or abstract representation if no image is available. 
                 Here I will create a glassmorphism 'card' stack that looks premium. */}
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                        <Shield className="w-6 h-6 text-[#007a55]" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-green-200">Financial Health</p>
                                        <p className="text-white font-bold">Excellent</p>
                                    </div>
                                </div>
                                <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">+24%</span>
                            </div>

                            {/* Simulated Chart Area */}
                            <div className="h-32 flex items-end justify-between gap-2">
                                {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                                    <div key={i} className="w-full bg-gradient-to-t from-green-400/50 to-green-300 rounded-t-sm" style={{ height: `${h}%` }}></div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Floating 'Success' Cards */}
                    <div className="absolute -top-6 -right-4 bg-white p-3 pr-5 rounded-lg shadow-xl flex items-center gap-3 animate-float-delayed z-20">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-semibold">Status</p>
                            <p className="text-sm font-bold text-gray-800">Budget Approved!</p>
                        </div>
                    </div>

                    <div className="absolute -bottom-8 -left-4 bg-white p-3 pr-5 rounded-lg shadow-xl flex items-center gap-3 animate-float-reverse z-20">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <CreditCard className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-semibold">Savings</p>
                            <p className="text-sm font-bold text-gray-800">+$2,450.00</p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

// Add custom css for float animation if not present, or standard tailwind arbitrary classes
// perspective-1000 is usually not standard, but we used standard transform utilities.
// We will rely on simple CSS or style injection for the specific 'float' keyframes if they don't exist in tailwind config.

export default DashboardHero;
