import React from "react";

const SmartSuggestions = ({ income, expenses, categoryExpenses }) => {
  const totalSpent = Object.values(categoryExpenses).reduce((a, b) => a + b, 0);
  const suggestions = [];

  // Suggest saving if expenses are high
  if (expenses > income * 0.8) {
    suggestions.push("⚠️ You are spending over 80% of your income. Try to cut down non-essential expenses.");
  } else if (income - expenses > income * 0.3) {
    suggestions.push("💰 Great job! You’re saving more than 30% of your income — consider investing in mutual funds or SIPs.");
  }

  // Check category overspending
  for (const [category, amount] of Object.entries(categoryExpenses)) {
    const percentage = (amount / expenses) * 100;
    if (percentage > 25) {
      suggestions.push(`💡 You’re spending ${percentage.toFixed(1)}% on ${category}. Reducing it slightly could save ₹${Math.round(amount * 0.1)} this month.`);
    }
  }

  if (suggestions.length === 0) {
    suggestions.push("✅ Your spending habits look balanced. Keep it up!");
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Smart Savings Suggestions</h2>
      <ul className="list-disc ml-5 text-gray-700 dark:text-gray-300 space-y-2">
        {suggestions.map((tip, index) => (
          <li key={index}>{tip}</li>
        ))}
      </ul>
    </div>
  );
};

export default SmartSuggestions;
