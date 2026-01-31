import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const VerifyOtp = () => {
  const navigate = useNavigate();
  const email = new URLSearchParams(useLocation().search).get("email");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);

  // Countdown timer for OTP validity
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ OTP verified successfully!");
        setTimeout(() => navigate(`/reset-password?email=${email}`), 1000);
      } else {
        setError(data.message || "Invalid OTP");
      }
    } catch (err) {
      console.error(err);
      setError("⚠ Server error. Please try again later.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleVerify}
        className="bg-white p-6 rounded-2xl shadow-md w-80"
      >
        <h2 className="text-xl font-bold mb-4 text-center">Verify OTP</h2>

        {message && <p className="text-green-600 text-center mb-2">{message}</p>}
        {error && <p className="text-red-600 text-center mb-2">{error}</p>}

        <input
          type="text"
          placeholder="Enter OTP"
          className="w-full border p-2 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />

        <p className="text-red-500 text-sm mb-2 text-center">
          ⚠ This OTP is valid for {timeLeft} seconds only
        </p>

        <button
          type="submit"
          disabled={timeLeft <= 0}
          className={`w-full py-2 rounded text-white font-semibold ${
            timeLeft > 0
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Verify OTP
        </button>
      </form>
    </div>
  );
};

export default VerifyOtp;
