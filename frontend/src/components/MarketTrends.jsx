import React, { useState } from 'react';
import { ArrowUp, ArrowDown, ChevronRight, ChevronDown, Plus, MoreHorizontal, ChevronUp, Bot, ExternalLink } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

const Sparkline = ({ color = "#ef4444", data }) => (
    <div className="h-12 w-24">
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
                <Area
                    type="monotone"
                    dataKey="value"
                    stroke={color}
                    fill="url(#colorGradient)" // simplified, or just transparent
                    fillOpacity={0.1}
                    strokeWidth={2}
                    isAnimationActive={false}
                />
            </AreaChart>
        </ResponsiveContainer>
    </div>
);

const generateData = (trend) => {
    const data = [];
    let val = 100;
    for (let i = 0; i < 20; i++) {
        val = trend === 'up' ? val + Math.random() * 10 - 3 : val - Math.random() * 10 + 3;
        data.push({ value: val });
    }
    return data;
};

const MarketTrends = () => {
    const [activeTab, setActiveTab] = useState('US');

    const marketData = {
        'US': {
            indices: [
                { name: 'S&P 500', value: '5,789.24', change: '+12.45', percent: '+0.22%', trend: 'up', data: generateData('up') },
                { name: 'Dow Jones', value: '42,356.12', change: '+145.23', percent: '+0.34%', trend: 'up', data: generateData('up') },
                { name: 'Nasdaq 100', value: '19,892.45', change: '-45.12', percent: '-0.23%', trend: 'down', data: generateData('down') },
                { name: 'Russell 2000', value: '2,245.67', change: '+8.90', percent: '+0.40%', trend: 'up', data: generateData('up') },
                { name: 'VIX', value: '15.45', change: '-0.56', percent: '-3.50%', trend: 'down', data: generateData('down') }
            ],
            sectors: [
                { code: 'XLK', name: 'Technology', value: '189.45', percent: '+1.20%', trend: 'up', data: generateData('up') },
                { code: 'XLF', name: 'Financials', value: '45.67', percent: '+0.56%', trend: 'up', data: generateData('up') },
                { code: 'XLV', name: 'Healthcare', value: '145.23', percent: '-0.34%', trend: 'down', data: generateData('down') },
                { code: 'XLE', name: 'Energy', value: '92.34', percent: '+0.12%', trend: 'up', data: generateData('up') },
                { code: 'XLI', name: 'Industrials', value: '120.56', percent: '-0.20%', trend: 'down', data: generateData('down') },
                { code: 'XLP', name: 'Staples', value: '80.12', percent: '+0.10%', trend: 'up', data: generateData('up') }
            ],
            news: [
                {
                    title: "Fed Signals Potential Rate Cuts Amid Cooling Inflation",
                    summary: "Federal Reserve officials have hinted at a possible rate cut in the upcoming quarter as inflation metrics show sustained improvement toward the 2% target.",
                    sources: 8,
                    expanded: true
                },
                {
                    title: "Tech Giants Rally on AI Breakthroughs",
                    summary: "Major technology stocks surged today following announcements of new generative AI capabilities, driving the Nasdaq higher.",
                    sources: 12,
                    expanded: false
                }
            ]
        },
        'India': {
            indices: [
                { name: 'NIFTY 50', value: '25,078.65', change: '-211.25', percent: '-0.84%', trend: 'down', data: generateData('down') },
                { name: 'SENSEX', value: '81,633.68', change: '-673.69', percent: '-0.82%', trend: 'down', data: generateData('down') },
                { name: 'Nifty Bank', value: '58,592.40', change: '-607.70', percent: '-1.03%', trend: 'down', data: generateData('down') },
                { name: 'Nifty IT', value: '38,287.95', change: '-13.80', percent: '-0.04%', trend: 'down', data: generateData('down') },
                { name: 'S&P BSE SmallCap', value: '47,022.24', change: '-853.81', percent: '-1.78%', trend: 'down', data: generateData('down') },
            ],
            sectors: [
                { code: 'SIXB', name: 'Materials', value: '1,052.23', percent: '+0.56%', trend: 'up', data: generateData('up') },
                { code: 'SIXC', name: 'Communications', value: '607.12', percent: '+1.43%', trend: 'up', data: generateData('up') },
                { code: 'SIXE', name: 'Energy', value: '1,029.98', percent: '+0.31%', trend: 'up', data: generateData('up') },
                { code: 'SIXI', name: 'Industrials', value: '1,669.67', percent: '-0.51%', trend: 'down', data: generateData('down') },
                { code: 'SIXM', name: 'Financials', value: '662.72', percent: '+0.68%', trend: 'up', data: generateData('up') },
                { code: 'SIXR', name: 'Staples', value: '832.48', percent: '-0.16%', trend: 'down', data: generateData('down') },
            ],
            news: [
                {
                    title: "Indian Rupee Reaches Record Low Against US Dollar",
                    summary: "The Indian rupee depreciated to an all-time low against the US dollar, closing near 91.7. This weakness is primarily driven by continuous foreign portfolio investor outflows from the domestic equity market and escalating global geopolitical tensions.",
                    sources: 3,
                    expanded: true
                },
                {
                    title: "RBI Report Highlights Sustained Domestic Growth Momentum",
                    summary: "Recent RBI data indicates a strong uptick in domestic consumption and rural demand, suggesting the economy is resilient despite global headwinds.",
                    sources: 5,
                    expanded: false
                }
            ]
        }
    };

    // Fallback for other tabs (Europe, etc.) - simplified for demo
    const currentData = marketData[activeTab] || marketData['India'];

    return (
        <div className="bg-[#121212] text-gray-300 rounded-xl overflow-hidden font-sans border border-gray-800">
            <div className="flex flex-col lg:flex-row">

                {/* Left Sidebar - Watchlist & Sectors */}
                <div className="lg:w-1/4 border-r border-gray-800 p-4 bg-[#141414]">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-2 cursor-pointer hover:text-white">
                            <span className="text-xl font-semibold text-white">Lists</span>
                            <ChevronDown className="w-4 h-4" />
                        </div>
                        <div className="flex gap-2 text-gray-400">
                            <Plus className="w-5 h-5 hover:text-white cursor-pointer" />
                            <MoreHorizontal className="w-5 h-5 hover:text-white cursor-pointer" />
                        </div>
                    </div>

                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-2 px-2">
                            <span className="text-sm font-medium text-white">Watchlist</span>
                            <Plus className="w-4 h-4 hover:text-white cursor-pointer" />
                        </div>
                        <div className="text-sm text-gray-500 px-2 py-4 text-center border border-dashed border-gray-800 rounded-lg">
                            This list is empty
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-4 px-2">
                            <span className="text-sm font-medium text-white">Sectors</span>
                            <ChevronUp className="w-4 h-4 cursor-pointer" />
                        </div>
                        <div className="space-y-1">
                            {currentData.sectors.map((sector) => (
                                <div key={sector.code} className="flex items-center justify-between p-2 hover:bg-[#1f1f1f] rounded-lg cursor-pointer transition-colors group">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-gray-200 text-sm group-hover:text-blue-400">{sector.code}</span>
                                        <span className="text-xs text-gray-500">{sector.name}</span>
                                    </div>
                                    <Sparkline
                                        color={sector.trend === 'up' ? '#4ade80' : '#f87171'}
                                        data={sector.data}
                                    />
                                    <div className="text-right">
                                        <div className="text-sm font-medium text-gray-200">{sector.value}</div>
                                        <div className={`text-xs flex items-center justify-end ${sector.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                                            {sector.percent}
                                            {sector.trend === 'up' ? <ArrowUp className="w-3 h-3 ml-0.5" /> : <ArrowDown className="w-3 h-3 ml-0.5" />}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="lg:w-3/4 p-6 bg-[#0f0f0f]">
                    {/* Tabs */}
                    <div className="flex gap-8 mb-8 text-sm font-medium text-gray-500 border-b border-gray-800 pb-2 overflow-x-auto">
                        {['US', 'Europe', 'India', 'Currencies', 'Crypto', 'Futures'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`pb-2 whitespace-nowrap transition-colors ${activeTab === tab
                                    ? 'text-white border-b-2 border-white -mb-2.5'
                                    : 'hover:text-gray-300'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Indices Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-10">
                        {currentData.indices.map((index) => (
                            <div key={index.name} className="bg-[#1a1a1a] rounded-xl p-4 border border-gray-800 hover:border-gray-700 transition-all cursor-pointer">
                                <h3 className="text-gray-100 font-bold mb-1 truncate" title={index.name}>{index.name}</h3>
                                <div className="text-xl font-bold text-gray-200 mb-1">{index.value}</div>
                                <div className="text-xs text-gray-400 mb-3 flex items-center">
                                    ({index.change})
                                </div>
                                <div className={`text-lg font-bold flex items-center mb-2 ${index.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                                    {index.percent}
                                    {index.trend === 'up' ? <ArrowUp className="w-4 h-4 ml-1" /> : <ArrowDown className="w-4 h-4 ml-1" />}
                                </div>
                                <div className="h-10 w-full opacity-60">
                                    <Sparkline
                                        color={index.trend === 'up' ? '#4ade80' : '#f87171'}
                                        data={index.data}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Market Summary News */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-white mb-4">{activeTab} Market Summary</h2>

                        {currentData.news.map((item, idx) => (
                            <div key={idx} className="bg-[#161616] rounded-2xl p-6 border border-gray-800">
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="text-lg font-semibold text-gray-100">{item.title}</h3>
                                    <div className="flex items-center space-x-3">
                                        <span className="text-xs text-gray-400">{item.sources} sites</span>
                                        <button className="p-1 hover:bg-gray-800 rounded-full transition-colors">
                                            {item.expanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                                        </button>
                                    </div>
                                </div>

                                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                                    {item.summary}
                                </p>

                                <div className="flex items-center text-blue-400 text-sm font-medium cursor-pointer hover:text-blue-300 transition-colors gap-2">
                                    <Bot className="w-4 h-4" />
                                    Dive deeper on this topic with AI
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default MarketTrends;
