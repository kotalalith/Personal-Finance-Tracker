import { Coins, TrendingUp, Rocket, PieChart, Landmark, Globe } from "lucide-react";

export const ASSETS = {
    "Indian Stocks": {
        price: 100,
        unit: "share",
        color: "text-blue-600",
        bg: "bg-blue-50",
        icon: Landmark,
        desc: "Invest in Indian Share market starting at INR 100."
    },
    "US Stocks": {
        price: 830,
        unit: "share",
        color: "text-emerald-600",
        bg: "bg-emerald-50",
        icon: Globe,
        desc: "Invest in US stocks directly from India."
    },
    "Mutual Funds": {
        price: 50,
        unit: "units",
        color: "text-purple-600",
        bg: "bg-purple-50",
        icon: PieChart,
        desc: "Zero commission direct mutual funds."
    },
    "IPO": {
        price: 15000,
        unit: "lot",
        color: "text-orange-600",
        bg: "bg-orange-50",
        icon: Rocket,
        desc: "Apply for IPOs. Free Application."
    },
    "Gold": {
        price: 6250,
        unit: "gms",
        color: "text-yellow-500",
        bg: "bg-yellow-50",
        icon: Coins,
        desc: "Secure, 24k gold investment."
    },
};
