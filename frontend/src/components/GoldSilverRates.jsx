import React, { useState } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const GoldSilverRates = () => {
    const [activeMetal, setActiveMetal] = useState('GOLD');
    const [timeRange, setTimeRange] = useState('1Y');

    // Mock Data Generators
    const generateChartData = (metal, range) => {
        const data = [];
        const basePrice = metal === 'GOLD' ? 76000 : 92000; // Approx prices
        const points = range === '1M' ? 30 : range === '1Y' ? 12 : 50;

        for (let i = 0; i < points; i++) {
            const variation = Math.random() * 2000 - 1000;
            data.push({
                date: `Point ${i + 1}`,
                price: basePrice + (i * 100) + variation
            });
        }
        return data;
    };

    const chartData = generateChartData(activeMetal, timeRange);

    const goldRates = [
        { purity: "Gold 24 Karat", per1g: "7,820", per10g: "78,195", per100g: "7,81,950" },
        { purity: "Gold 22 Karat", per1g: "7,169", per10g: "71,688", per100g: "7,16,875" },
        { purity: "Gold 18 Karat", per1g: "5,865", per10g: "58,646", per100g: "5,86,463" },
    ];

    const silverRates = [
        { purity: "Silver 999 Fine", per1g: "92.50", per10g: "925.00", per1kg: "92,500" },
        { purity: "Silver 925 Sterling", per1g: "85.60", per10g: "856.00", per1kg: "85,600" },
    ];

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-8">India Bullion Rates</h2>

            {/* Top Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                {/* GOLD Summary */}
                <div
                    onClick={() => setActiveMetal('GOLD')}
                    className={`cursor-pointer transition-all rounded-xl p-6 border-2 ${activeMetal === 'GOLD' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/10' : 'border-transparent hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                >
                    <div className="text-center">
                        <h3 className="text-xl font-bold text-gray-700 dark:text-gray-200 mb-2">GOLD</h3>
                        <div className="flex items-center justify-center gap-2 text-3xl font-extrabold text-red-600">
                            <ArrowDown className="w-8 h-8" />
                            156,390.00
                        </div>
                        <p className="text-red-500 font-medium mt-1">-880.00 (-0.560%)</p>
                        <p className="text-gray-500 text-sm mt-1">Rs ₹ / 10gm</p>
                    </div>
                </div>

                {/* SILVER Summary */}
                <div
                    onClick={() => setActiveMetal('SILVER')}
                    className={`cursor-pointer transition-all rounded-xl p-6 border-2 ${activeMetal === 'SILVER' ? 'border-gray-400 bg-gray-50 dark:bg-gray-700/30' : 'border-transparent hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                >
                    <div className="text-center">
                        <h3 className="text-xl font-bold text-gray-700 dark:text-gray-200 mb-2">SILVER</h3>
                        <div className="flex items-center justify-center gap-2 text-3xl font-extrabold text-green-600">
                            <ArrowUp className="w-8 h-8" />
                            330,890.00
                        </div>
                        <p className="text-green-500 font-medium mt-1">+3610.00 (+1.100%)</p>
                        <p className="text-gray-500 text-sm mt-1">Rs ₹ / 1kg</p>
                    </div>
                </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
                <h3 className="text-xl font-bold text-yellow-600 dark:text-yellow-500 mb-2">
                    {activeMetal === 'GOLD' ? 'Gold' : 'Silver'} Rate Today in India
                </h3>
                <p className="text-xs text-gray-500 mb-6">Last Update: {new Date().toLocaleString()}</p>

                {/* Rates Table */}
                <div className="overflow-x-auto mb-8">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                            <tr>
                                <th className="px-4 py-3 rounded-l-lg">Name</th>
                                <th className="px-4 py-3 text-right">1 Gram</th>
                                <th className="px-4 py-3 text-right">10 Gram</th>
                                <th className="px-4 py-3 text-right rounded-r-lg">{activeMetal === 'GOLD' ? '100 Gram' : '1 Kilogram'}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {(activeMetal === 'GOLD' ? goldRates : silverRates).map((rate, idx) => (
                                <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                    <td className="px-4 py-3 font-semibold text-gray-800 dark:text-gray-200">{rate.purity}</td>
                                    <td className="px-4 py-3 text-right font-medium text-gray-600 dark:text-gray-400">₹{rate.per1g}</td>
                                    <td className="px-4 py-3 text-right font-medium text-gray-600 dark:text-gray-400">₹{rate.per10g}</td>
                                    <td className="px-4 py-3 text-right font-medium text-gray-600 dark:text-gray-400">₹{activeMetal === 'GOLD' ? rate.per100g : rate.per1kg}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Chart Section */}
                <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                        <h4 className="font-semibold text-gray-700 dark:text-gray-300">
                            {activeMetal === 'GOLD' ? 'Gold' : 'Silver'} Price Trend
                        </h4>
                        <div className="flex bg-white dark:bg-gray-800 rounded-lg p-1 shadow-sm border border-gray-200 dark:border-gray-700">
                            {['1M', '2M', '6M', '1Y', '2Y', '5Y', 'Max'].map((range) => (
                                <button
                                    key={range}
                                    onClick={() => setTimeRange(range)}
                                    className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${timeRange === range
                                            ? 'bg-yellow-500 text-white shadow'
                                            : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                                        }`}
                                >
                                    {range}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#eab308" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#eab308" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#9CA3AF', fontSize: 10 }}
                                    hide={true} // Simplify view
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#9CA3AF', fontSize: 11 }}
                                    domain={['auto', 'auto']}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="price"
                                    stroke="#eab308"
                                    strokeWidth={2}
                                    fillOpacity={1}
                                    fill="url(#colorPrice)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GoldSilverRates;
