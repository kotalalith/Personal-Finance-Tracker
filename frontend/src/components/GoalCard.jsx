import { getGoalTheme } from "../utils/goalTheme";
import { Edit2, Trash2, CheckCircle, Calendar, MoreHorizontal, TrendingUp } from "lucide-react";

const GoalCard = ({ goal, onClick, onEdit, onDelete }) => {
    // Determine fields with fallbacks for backward compatibility
    const name = goal.goalName || goal.name;
    const saved = goal.currentSaved !== undefined ? goal.currentSaved : (goal.savedAmount || 0);
    const target = goal.targetAmount;
    const deadline = goal.endDate || goal.deadline;

    const theme = getGoalTheme(name);
    const Icon = theme.icon;
    const percentage = Math.min((saved / target) * 100, 100);
    const isCompleted = percentage >= 100;

    const daysLeft = deadline
        ? Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24))
        : null;

    return (
        <div
            onClick={onClick}
            className={`relative group bg-white dark:bg-gray-800 rounded-2xl p-6 border transition-all duration-300 hover:shadow-xl cursor-pointer ${theme.border} hover:-translate-y-1`}
        >
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${theme.bg} ${theme.text}`}>
                    <Icon className="w-6 h-6" />
                </div>
                <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit(goal);
                        }}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-500 transition-colors"
                    >
                        <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(goal._id);
                        }}
                        className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full text-red-500 transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="mb-4">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">
                    {name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Target: ₹{target.toLocaleString()}
                </p>
            </div>

            {/* Progress Section */}
            <div className="space-y-4">
                <div className="flex justify-between items-end">
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Saved</p>
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">
                            ₹{saved.toLocaleString()}
                        </span>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Remaining</p>
                        <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                            ₹{(target - saved).toLocaleString()}
                        </span>
                    </div>
                </div>

                <div className="h-3 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                        className={`h-full rounded-full transition-all duration-1000 ease-out ${isCompleted ? "bg-green-500" : theme.bar
                            }`}
                        style={{ width: `${percentage}%` }}
                    />
                </div>

                {/* Suggestion / Insight */}
                {!isCompleted && daysLeft > 0 && (
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 flex items-center gap-3 text-sm">
                        <div className={`p-1.5 rounded-full ${theme.bg} ${theme.text}`}>
                            <TrendingUp className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="text-gray-500 dark:text-gray-400 text-xs">Suggested Monthly</p>
                            <p className="font-semibold text-gray-800 dark:text-white">
                                ₹{Math.ceil((target - saved) / (daysLeft / 30)).toLocaleString()}<span className="text-xs font-normal text-gray-500">/mo</span>
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer Info */}
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center text-xs font-medium text-gray-500">
                <div className="flex items-center gap-1.5">
                    {isCompleted ? (
                        <span className="flex items-center text-green-600 gap-1">
                            <CheckCircle className="w-3.5 h-3.5" /> Completed
                        </span>
                    ) : daysLeft !== null ? (
                        <span className={`flex items-center gap-1 ${daysLeft < 0 ? 'text-red-500' : ''}`}>
                            <Calendar className="w-3.5 h-3.5" />
                            {daysLeft < 0 ? `${Math.abs(daysLeft)} days overdue` : `${daysLeft} days left`}
                        </span>
                    ) : (
                        <span className="flex items-center gap-1">
                            <MoreHorizontal className="w-3.5 h-3.5" /> No deadline
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GoalCard;
