import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import transactionReducer from './slices/transactionSlice';
import budgetReducer from './slices/budgetSlice';
import themeReducer from './slices/themeSlice';
import goalReducer from './slices/goalSlice';
import investmentGoalReducer from './slices/investmentGoalSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    transactions: transactionReducer,
    budgets: budgetReducer,
    theme: themeReducer,
    goals: goalReducer,
    investmentGoals: investmentGoalReducer,
  },
});
