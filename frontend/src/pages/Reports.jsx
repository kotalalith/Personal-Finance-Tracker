import React, { useEffect, useState } from 'react';
import { getMonthlyReport, exportCSV, exportPDF } from '../utils/api';
import { FileText, Download, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import jsPDF from 'jspdf';

const Reports = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchReport();
  }, [selectedMonth, selectedYear]);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const response = await getMonthlyReport(selectedMonth, selectedYear);
      setReport(response.data);
    } catch (error) {
      console.error('Error fetching report:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCSVExport = async () => {
    try {
      const startDate = new Date(selectedYear, selectedMonth - 1, 1).toISOString();
      const endDate = new Date(selectedYear, selectedMonth, 0, 23, 59, 59).toISOString();
      const response = await exportCSV(startDate, endDate);
      
      // Create blob and download
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `transactions_${selectedMonth}_${selectedYear}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error exporting CSV:', error);
      alert('Failed to export CSV');
    }
  };

  const handlePDFExport = async () => {
    try {
      const response = await exportPDF(selectedMonth, selectedYear);
      const data = response.data;

      // Create PDF
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.getWidth();
      let yPos = 20;

      // Title
      pdf.setFontSize(18);
      pdf.text('Monthly Financial Report', pageWidth / 2, yPos, { align: 'center' });
      yPos += 10;

      pdf.setFontSize(12);
      pdf.text(
        `${format(new Date(selectedYear, selectedMonth - 1), 'MMMM yyyy')}`,
        pageWidth / 2,
        yPos,
        { align: 'center' }
      );
      yPos += 15;

      // Summary
      pdf.setFontSize(14);
      pdf.text('Summary', 20, yPos);
      yPos += 8;

      pdf.setFontSize(10);
      pdf.text(`Total Income: $${data.totalIncome.toFixed(2)}`, 20, yPos);
      yPos += 6;
      pdf.text(`Total Expenses: $${data.totalExpenses.toFixed(2)}`, 20, yPos);
      yPos += 6;
      pdf.text(`Balance: $${data.balance.toFixed(2)}`, 20, yPos);
      yPos += 10;

      // Category Expenses
      if (Object.keys(data.categoryExpenses).length > 0) {
        pdf.setFontSize(14);
        pdf.text('Expenses by Category', 20, yPos);
        yPos += 8;

        pdf.setFontSize(10);
        Object.entries(data.categoryExpenses).forEach(([category, amount]) => {
          if (yPos > 280) {
            pdf.addPage();
            yPos = 20;
          }
          pdf.text(`${category}: $${amount.toFixed(2)}`, 20, yPos);
          yPos += 6;
        });
      }

      // Save PDF
      pdf.save(`monthly_report_${selectedMonth}_${selectedYear}.pdf`);
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Failed to export PDF');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Monthly Reports</h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={handleCSVExport}
            className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            <Download className="w-5 h-5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handlePDFExport}
            className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            <FileText className="w-5 h-5" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Month/Year Selector */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-4">
          <Calendar className="w-5 h-5 text-gray-600 dark:text-gray-400" />
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

      {report && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Total Income</h3>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                ${report.totalIncome.toFixed(2)}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Total Expenses</h3>
              <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                ${report.totalExpenses.toFixed(2)}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Balance</h3>
              <p
                className={`text-3xl font-bold ${
                  report.balance >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'
                }`}
              >
                ${report.balance.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
              Expense Breakdown by Category
            </h2>
            {Object.keys(report.categoryExpenses).length > 0 ? (
              <div className="space-y-3">
                {Object.entries(report.categoryExpenses)
                  .sort(([, a], [, b]) => b - a)
                  .map(([category, amount]) => (
                    <div key={category} className="flex items-center justify-between">
                      <span className="text-gray-700 dark:text-gray-300">{category}</span>
                      <span className="font-semibold text-gray-800 dark:text-white">
                        ${amount.toFixed(2)}
                      </span>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No expenses recorded for this month</p>
            )}
          </div>

          {/* Top Spending Category */}
          {report.topSpendingCategory && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Top Spending Category</h2>
              <div className="flex items-center justify-between">
                <span className="text-lg text-gray-700 dark:text-gray-300">{report.topSpendingCategory}</span>
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  ${report.categoryExpenses[report.topSpendingCategory].toFixed(2)}
                </span>
              </div>
            </div>
          )}

          {/* Transaction Count */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Statistics</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Total Transactions: <span className="font-semibold text-gray-800 dark:text-white">{report.transactionCount}</span>
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default Reports;
