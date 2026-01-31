import React, { useEffect, useState } from 'react';
import { getInsights } from '../utils/api';
import { Lightbulb, TrendingUp, TrendingDown, AlertTriangle, Info } from 'lucide-react';
import { format } from 'date-fns';

const Insights = () => {
  const [insightsData, setInsightsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchInsights();
  }, [selectedMonth, selectedYear]);

  const fetchInsights = async () => {
    setLoading(true);
    try {
      const response = await getInsights(selectedMonth, selectedYear);
      setInsightsData(response.data);
    } catch (error) {
      console.error('Error fetching insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const getInsightIcon = (type) => {
    switch (type) {
      case 'success':
        return TrendingUp;
      case 'warning':
        return AlertTriangle;
      case 'error':
        return AlertTriangle;
      default:
        return Info;
    }
  };

  const getInsightColor = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-100 dark:bg-green-900 border-green-400 dark:border-green-600 text-green-800 dark:text-green-200';
      case 'warning':
        return 'bg-yellow-100 dark:bg-yellow-900 border-yellow-400 dark:border-yellow-600 text-yellow-800 dark:text-yellow-200';
      case 'error':
        return 'bg-red-100 dark:bg-red-900 border-red-400 dark:border-red-600 text-red-800 dark:text-red-200';
      default:
        return 'bg-blue-100 dark:bg-blue-900 border-blue-400 dark:border-blue-600 text-blue-800 dark:text-blue-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600 dark:text-gray-400">Loading insights...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Lightbulb className="w-8 h-8 text-yellow-500" />
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">AI Financial Insights</h1>
      </div>

      {/* Month/Year Selector */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Month</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {format(new Date(selectedYear, i), 'MMMM')}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Year</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              {Array.from({ length: 5 }, (_, i) => {
                const year = new Date().getFullYear() - 2 + i;
                return (
                  <option key={year} value={year}>
                    {year}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
      </div>

      {insightsData && (
        <>
          {/* Insights Cards */}
          {insightsData.insights && insightsData.insights.length > 0 ? (
            <div className="space-y-4">
              {insightsData.insights.map((insight, index) => {
                const Icon = getInsightIcon(insight.type);
                return (
                  <div
                    key={index}
                    className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-2 ${getInsightColor(insight.type)}`}
                  >
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-2">{insight.title}</h3>
                        <p className="mb-2">{insight.message}</p>
                        {insight.suggestion && (
                          <p className="text-sm opacity-90 italic">💡 {insight.suggestion}</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 border border-gray-200 dark:border-gray-700 text-center">
              <Info className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                No insights available. Add more transactions to get personalized financial insights.
              </p>
            </div>
          )}

          {/* Summary Statistics */}
          {insightsData.summary && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Summary Statistics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Current Month</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-700 dark:text-gray-300">Income:</span>
                      <span className="font-semibold text-green-600 dark:text-green-400">
                        ${insightsData.summary.currentMonth?.income.toFixed(2) || '0.00'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700 dark:text-gray-300">Expenses:</span>
                      <span className="font-semibold text-red-600 dark:text-red-400">
                        ${insightsData.summary.currentMonth?.expenses.toFixed(2) || '0.00'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700 dark:text-gray-300">Balance:</span>
                      <span
                        className={`font-semibold ${
                          (insightsData.summary.currentMonth?.balance || 0) >= 0
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-red-600 dark:text-red-400'
                        }`}
                      >
                        ${(insightsData.summary.currentMonth?.balance || 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
                {insightsData.summary.previousMonth && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Previous Month</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-700 dark:text-gray-300">Income:</span>
                        <span className="font-semibold text-green-600 dark:text-green-400">
                          ${insightsData.summary.previousMonth.income.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700 dark:text-gray-300">Expenses:</span>
                        <span className="font-semibold text-red-600 dark:text-red-400">
                          ${insightsData.summary.previousMonth.expenses.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700 dark:text-gray-300">Balance:</span>
                        <span
                          className={`font-semibold ${
                            insightsData.summary.previousMonth.balance >= 0
                              ? 'text-blue-600 dark:text-blue-400'
                              : 'text-red-600 dark:text-red-400'
                          }`}
                        >
                          ${insightsData.summary.previousMonth.balance.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Trends */}
              {insightsData.summary.trends && (
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-4">Trends</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 dark:text-gray-300">Spending Change:</span>
                      <span
                        className={`font-semibold flex items-center space-x-1 ${
                          insightsData.summary.trends.spendingChange >= 0
                            ? 'text-red-600 dark:text-red-400'
                            : 'text-green-600 dark:text-green-400'
                        }`}
                      >
                        {insightsData.summary.trends.spendingChange >= 0 ? (
                          <TrendingUp className="w-4 h-4" />
                        ) : (
                          <TrendingDown className="w-4 h-4" />
                        )}
                        <span>${Math.abs(insightsData.summary.trends.spendingChange).toFixed(2)}</span>
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 dark:text-gray-300">Income Change:</span>
                      <span
                        className={`font-semibold flex items-center space-x-1 ${
                          insightsData.summary.trends.incomeChange >= 0
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-red-600 dark:text-red-400'
                        }`}
                      >
                        {insightsData.summary.trends.incomeChange >= 0 ? (
                          <TrendingUp className="w-4 h-4" />
                        ) : (
                          <TrendingDown className="w-4 h-4" />
                        )}
                        <span>${Math.abs(insightsData.summary.trends.incomeChange).toFixed(2)}</span>
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Insights;
