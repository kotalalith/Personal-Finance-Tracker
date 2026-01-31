import axios from "axios";

const API_URL = "http://localhost:5000/api/investment-goals";
const USER_ID = "USER_ID_HERE"; // Matching the hardcoded ID in Dashboard.jsx

const initialGoals = [
    {
        userId: USER_ID,
        goalName: "Tesla Stocks",
        targetAmount: 15000,
        currentAmount: 5000,
        assetType: "Stocks",
        deadline: "2025-12-31",
    },
    {
        userId: USER_ID,
        goalName: "Bitcoin Holdings",
        targetAmount: 50000,
        currentAmount: 32000,
        assetType: "Crypto",
        deadline: "2030-01-01",
    },
    {
        userId: USER_ID,
        goalName: "Vanguard S&P 500",
        targetAmount: 100000,
        currentAmount: 45000,
        assetType: "Mutual Funds",
        deadline: "2040-06-01",
    },
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function populateInitialData() {
    console.log("🌱 Populating initial investment goals...");
    try {
        // optional: clear existing for this user (not implemented in API but fine)

        for (const goal of initialGoals) {
            await axios.post(API_URL, goal);
            console.log(`✅ Created goal: ${goal.goalName}`);
        }
    } catch (error) {
        console.error("⚠️ Error populating data (might already exist or server down):", error.message);
    }
}

async function simulateRealTimeUpdates() {
    console.log("\n🚀 Starting Real-Time Market Simulation...");
    console.log("Press Ctrl+C to stop.\n");

    while (true) {
        try {
            // 1. Fetch current goals
            const response = await axios.get(`${API_URL}/${USER_ID}`);
            const goals = response.data;

            if (goals.length === 0) {
                console.log("No goals found via API. Populating...");
                await populateInitialData();
                continue;
            }

            // 2. Pick a random goal to update
            const randomGoal = goals[Math.floor(Math.random() * goals.length)];

            // 3. Calculate simulated fluctuation (-2% to +2%)
            const fluctuationPercent = (Math.random() * 4 - 2) / 100;
            const changeAmount = randomGoal.currentAmount * fluctuationPercent;
            const newAmount = Math.max(0, randomGoal.currentAmount + changeAmount); // Prevent negative

            // 4. Update the goal
            await axios.put(`${API_URL}/${randomGoal._id}`, {
                currentAmount: newAmount,
            });

            const symbol = fluctuationPercent >= 0 ? "📈" : "📉";
            console.log(
                `${symbol} ${randomGoal.goalName}: $${randomGoal.currentAmount.toFixed(2)} -> $${newAmount.toFixed(2)}`
            );

        } catch (error) {
            console.error("❌ Simulation Error:", error.message);
        }

        // Wait for 2-4 seconds before next update
        await sleep(Math.random() * 2000 + 2000);
    }
}

// Check if we need to populate first
(async () => {
    const check = await axios.get(`${API_URL}/${USER_ID}`).catch(() => ({ data: [] }));
    if (check.data.length === 0) {
        await populateInitialData();
    }
    await simulateRealTimeUpdates();
})();
