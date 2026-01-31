import {
    Target,
    Plane,
    GraduationCap,
    ShieldAlert,
    TrendingUp,
    Coins,
} from "lucide-react";

/**
 * Helper to determine theme based on goal type/name
 */
export const getGoalTheme = (type) => {
    // Normalize type string if needed (e.g. lowercase comparison)
    // For now assuming exact matches from the current dropdown list
    switch (type) {
        case "Vacation":
            return {
                icon: Plane,
                bg: "bg-blue-50 dark:bg-blue-900/20",
                text: "text-blue-600 dark:text-blue-400",
                bar: "bg-blue-500",
                border: "border-blue-100 dark:border-blue-800",
                gradient: "from-blue-600 to-cyan-500",
            };
        case "Education":
            return {
                icon: GraduationCap,
                bg: "bg-indigo-50 dark:bg-indigo-900/20",
                text: "text-indigo-600 dark:text-indigo-400",
                bar: "bg-indigo-500",
                border: "border-indigo-100 dark:border-indigo-800",
                gradient: "from-indigo-600 to-purple-600",
            };
        case "Emergency Fund":
            return {
                icon: ShieldAlert,
                bg: "bg-rose-50 dark:bg-rose-900/20",
                text: "text-rose-600 dark:text-rose-400",
                bar: "bg-rose-500",
                border: "border-rose-100 dark:border-rose-800",
                gradient: "from-rose-600 to-pink-600",
            };
        case "Investment":
            return {
                icon: TrendingUp,
                bg: "bg-purple-50 dark:bg-purple-900/20",
                text: "text-purple-600 dark:text-purple-400",
                bar: "bg-purple-500",
                border: "border-purple-100 dark:border-purple-800",
                gradient: "from-purple-600 to-violet-600",
            };
        case "Gold":
            return {
                icon: Coins,
                bg: "bg-yellow-50 dark:bg-yellow-900/20",
                text: "text-yellow-600 dark:text-yellow-400",
                bar: "bg-yellow-500",
                border: "border-yellow-100 dark:border-yellow-800",
                gradient: "from-yellow-500 to-amber-600",
            }
        case "Savings":
        default:
            return {
                icon: Target,
                bg: "bg-emerald-50 dark:bg-emerald-900/20",
                text: "text-emerald-600 dark:text-emerald-400",
                bar: "bg-emerald-500",
                border: "border-emerald-100 dark:border-emerald-800",
                gradient: "from-emerald-600 to-teal-600",
            };
    }
};
