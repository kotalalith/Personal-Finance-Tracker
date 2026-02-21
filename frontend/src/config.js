const isProduction = window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1";

export const API_BASE_URL = isProduction
    ? "https://personal-finance-tracker-8ezy.onrender.com/api"
    : "http://localhost:5002/api";