import React, { useState, useEffect } from "react";
import { ArrowUp, ArrowDown, Download, Search, Filter } from "lucide-react";

const STOCK_DATA = [
    {
        symbol: "NIFTY 50",
        open: "25,344.60",
        high: "25,347.95",
        low: "25,043.85",
        prevClose: "25,289.90",
        ltp: "25,059.15",
        change: -230.75,
        percentChange: -0.91,
        volume: "27,49,89,693",
        value: "21,887.57",
        yearHigh: "26,373.20",
        yearLow: "21,743.65",
        monthChange: -3.37,
    },
    {
        symbol: "DRREDDY",
        open: "1,230.00",
        high: "1,250.80",
        low: "1,225.00",
        prevClose: "1,217.50",
        ltp: "1,238.30",
        change: 20.80,
        percentChange: 1.71,
        volume: "33,39,284",
        value: "414.20",
        yearHigh: "1,379.70",
        yearLow: "1,020.00",
        monthChange: -5.13,
    },
    {
        symbol: "HINDUNILVR",
        open: "2,400.00",
        high: "2,434.30",
        low: "2,376.80",
        prevClose: "2,390.80",
        ltp: "2,420.10",
        change: 29.50,
        percentChange: 1.23,
        volume: "9,88,797",
        value: "239.12",
        yearHigh: "2,750.00",
        yearLow: "2,136.00",
        monthChange: 4.42,
    },
    {
        symbol: "ASIANPAINT",
        open: "2,703.80",
        high: "2,782.90",
        low: "2,690.80",
        prevClose: "2,703.80",
        ltp: "2,732.20",
        change: 28.40,
        percentChange: 1.05,
        volume: "13,55,777",
        value: "373.26",
        yearHigh: "2,985.70",
        yearLow: "2,124.75",
        monthChange: -3.70,
    },
    {
        symbol: "TECHM",
        open: "1,689.00",
        high: "1,709.70",
        low: "1,689.20",
        prevClose: "1,687.40",
        ltp: "1,702.50",
        change: 15.10,
        percentChange: 0.89,
        volume: "12,93,952",
        value: "220.23",
        yearHigh: "1,736.40",
        yearLow: "1,209.40",
        monthChange: 2.47,
    },
    {
        symbol: "TITAN",
        open: "4,025.10",
        high: "4,063.30",
        low: "3,980.00",
        prevClose: "4,018.80",
        ltp: "4,051.80",
        change: 33.20,
        percentChange: 0.83,
        volume: "6,23,401",
        value: "251.85",
        yearHigh: "4,312.10",
        yearLow: "2,925.00",
        monthChange: 2.16,
    },
    {
        symbol: "HINDALCO",
        open: "955.00",
        high: "963.90",
        low: "948.50",
        prevClose: "944.45",
        ltp: "950.40",
        change: 5.95,
        percentChange: 0.63,
        volume: "47,15,492",
        value: "451.05",
        yearHigh: "970.80",
        yearLow: "546.45",
        monthChange: 9.24,
    },
    {
        symbol: "ONGC",
        open: "245.30",
        high: "246.30",
        low: "241.55",
        prevClose: "244.01",
        ltp: "245.52",
        change: 1.51,
        percentChange: 0.62,
        volume: "58,33,692",
        value: "142.79",
        yearHigh: "266.39",
        yearLow: "205.00",
        monthChange: 4.20,
    },
    {
        symbol: "BAJAJ-AUTO",
        open: "9,390.00",
        high: "9,548.00",
        low: "9,335.00",
        prevClose: "9,370.00",
        ltp: "9,420.00",
        change: 50.00,
        percentChange: 0.53,
        volume: "1,40,765",
        value: "133.08",
        yearHigh: "9,888.00",
        yearLow: "7,089.35",
        monthChange: 2.25,
    },
    {
        symbol: "TCS",
        open: "3,190.30",
        high: "3,194.50",
        low: "3,156.40",
        prevClose: "3,150.40",
        ltp: "3,156.80",
        change: 6.40,
        percentChange: 0.20,
        volume: "15,36,435",
        value: "488.82",
        yearHigh: "4,191.35",
        yearLow: "2,866.60",
        monthChange: -5.25,
    },
    {
        symbol: "ICICIBANK",
        open: "1,340.50",
        high: "1,355.20",
        low: "1,335.70",
        prevClose: "1,345.50",
        ltp: "1,347.80",
        change: 2.30,
        percentChange: 0.17,
        volume: "98,05,968",
        value: "1,319.37",
        yearHigh: "1,500.00",
        yearLow: "1,186.00",
        monthChange: -1.68,
    },
];

const MarketWatch = () => {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatCurrency = (val) => {
        return val; // Already formatted strings in mockup, in real app use Intl.NumberFormat
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Header Section */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-900 to-blue-800 text-white">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            Market Watch - Equity/Stock
                        </h2>
                        <p className="text-blue-200 text-sm mt-1">
                            Live market data to help you make informed investment decisions.
                        </p>
                    </div>

                    <div className="flex items-center gap-4 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
                        <div className="text-right">
                            <p className="text-xs text-blue-200 uppercase font-semibold">NIFTY 50</p>
                            <div className="flex items-center gap-2">
                                <span className="text-xl font-bold">25,059.15</span>
                                <span className="text-red-400 text-sm font-medium flex items-center">
                                    <ArrowDown className="w-3 h-3" /> 230.75 (0.91%)
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search Bar & Controls */}
                <div className="mt-6 flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search by company name, symbol or keyword"
                            className="w-full pl-10 pr-4 py-2 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                    <div className="flex gap-2 text-sm">
                        <button className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg flex items-center gap-2 transition-colors">
                            <Filter className="w-4 h-4" /> Filter
                        </button>
                        <button className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg flex items-center gap-2 transition-colors">
                            <Download className="w-4 h-4" /> Download CSV
                        </button>
                    </div>
                </div>
            </div>

            {/* Status Bar */}
            <div className="px-6 py-2 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 text-xs flex justify-between items-center text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    Normal Market is Open As on {currentTime.toLocaleString()}
                </div>
                <div className="flex gap-4">
                    <span className="text-green-600 font-semibold">Advances - 13</span>
                    <span className="text-red-600 font-semibold">Declines - 37</span>
                    <span>Unchanged - 1</span>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-700/50">
                        <tr>
                            <th className="px-6 py-3 font-semibold">Symbol</th>
                            <th className="px-6 py-3 font-semibold text-right">Open</th>
                            <th className="px-6 py-3 font-semibold text-right">High</th>
                            <th className="px-6 py-3 font-semibold text-right">Low</th>
                            <th className="px-6 py-3 font-semibold text-right">LTP</th>
                            <th className="px-6 py-3 font-semibold text-right">Chng</th>
                            <th className="px-6 py-3 font-semibold text-right">%Chng</th>
                            <th className="px-6 py-3 font-semibold text-right hidden lg:table-cell">Volume</th>
                            <th className="px-6 py-3 font-semibold text-right hidden lg:table-cell">52W H</th>
                            <th className="px-6 py-3 font-semibold text-right hidden lg:table-cell">52W L</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {STOCK_DATA.map((stock, index) => {
                            const isNegative = stock.change < 0;
                            const colorClass = isNegative ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400";

                            return (
                                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-blue-600 dark:text-blue-400 cursor-pointer hover:underline">
                                        {stock.symbol}
                                    </td>
                                    <td className="px-6 py-4 text-right text-gray-900 dark:text-white">{stock.open}</td>
                                    <td className="px-6 py-4 text-right text-gray-900 dark:text-white">{stock.high}</td>
                                    <td className="px-6 py-4 text-right text-gray-900 dark:text-white">{stock.low}</td>
                                    <td className={`px-6 py-4 text-right font-bold ${stock.symbol === "NIFTY 50" ? "text-gray-900 dark:text-white" : colorClass}`}>
                                        {stock.ltp}
                                        {stock.percentChange > 0 && stock.symbol !== "NIFTY 50" && <ArrowUp className="inline w-3 h-3 ml-1" />}
                                    </td>
                                    <td className={`px-6 py-4 text-right ${colorClass}`}>
                                        {stock.change > 0 ? "+" : ""}{stock.change.toFixed(2)}
                                    </td>
                                    <td className={`px-6 py-4 text-right font-medium ${colorClass}`}>
                                        {stock.percentChange.toFixed(2)}%
                                    </td>
                                    <td className="px-6 py-4 text-right text-gray-600 dark:text-gray-300 hidden lg:table-cell">{stock.volume}</td>
                                    <td className="px-6 py-4 text-right text-gray-600 dark:text-gray-300 hidden lg:table-cell">{stock.yearHigh}</td>
                                    <td className="px-6 py-4 text-right text-gray-600 dark:text-gray-300 hidden lg:table-cell">{stock.yearLow}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-center">
                <button className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center justify-center gap-2 mx-auto">
                    View All Market Data <ArrowUp className="w-4 h-4 rotate-45" />
                </button>
            </div>
        </div>
    );
};

export default MarketWatch;
