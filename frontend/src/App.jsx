import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setTheme } from './store/slices/themeSlice';

import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Budgets from './pages/Budgets';
import Goals from './pages/Goals';
import Goal from './pages/Goal';
import GoalDetails from './pages/GoalDetails';
import Reports from './pages/Reports';
import Insights from './pages/Insights';
import FinancialCalendar from './pages/FinancialCalendar';
import FinancialHealth from './pages/FinancialHealth'; // ✅ Import Health Score
import Retirement from './pages/Retirement';
import HomeLoan from './pages/HomeLoan';
import Loans from './pages/Loans';
import LoanApplication from './pages/LoanApplication';
import PersonalLoanReviews from './pages/PersonalLoanReviews';
import LoanReviewDetail from './pages/LoanReviewDetail';
import PersonalLoanCalculator from './pages/PersonalLoanCalculator';

import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import ForgotPassword from './pages/Forgotpassword';
import VerifyOtp from "./pages/VerifyOtp";
import ResetPassword from "./pages/ResetPassword";

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { mode } = useSelector((state) => state.theme);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    dispatch(setTheme(savedTheme));
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  }, [dispatch]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', mode === 'dark');
  }, [mode]);

  return (
    <div className={mode === 'dark' ? 'dark' : ''}>
      <Routes>

        {/* Public routes */}
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
        <Route path="/signup" element={!isAuthenticated ? <Signup /> : <Navigate to="/" />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Protected routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="budgets" element={<Budgets />} />
          <Route path="goal" element={<Goal />} />   {/* ✅ ADD THIS */}
          <Route path="goals/:id" element={<GoalDetails />} /> {/* ✅ New Route */}
          <Route path="calendar" element={<FinancialCalendar />} /> {/* ✅ Calendar Route */}
          <Route path="financial-health" element={<FinancialHealth />} /> {/* ✅ Health Score Route */}
          <Route path="retirement" element={<Retirement />} />
          <Route path="home-loan" element={<HomeLoan />} />
          <Route path="loans" element={<Loans />} />
          <Route path="loans/pre-qualify" element={<LoanApplication />} />
          <Route path="reports" element={<Reports />} />
          <Route path="insights" element={<Insights />} />
        </Route>

        {/* Full Page Protected Routes (No Sidebar) */}
        <Route path="/loans/reviews" element={
          <ProtectedRoute>
            <PersonalLoanReviews />
          </ProtectedRoute>
        } />
        <Route path="/loans/reviews/upgrade" element={
          <ProtectedRoute>
            <LoanReviewDetail />
          </ProtectedRoute>
        } />
        {/* Loan Calculator */}
        <Route path="/loans/personal-calculator" element={
          <ProtectedRoute>
            <PersonalLoanCalculator />
          </ProtectedRoute>
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;
