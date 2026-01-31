import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ArrowLeftRight,
  Target,
  FileText,
  TrendingUp,
  Lightbulb,
  LogOut,
  Calendar,
  Briefcase,
  Home,
  CreditCard
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';

const Sidebar = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    window.location.href = '/login';
  };

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/transactions', icon: ArrowLeftRight, label: 'Transactions' },
    { path: '/budgets', icon: Target, label: 'Budgets' },
    { path: '/goal', icon: Target, label: 'Goals' },
    { path: '/calendar', icon: Calendar, label: 'Calendar' },
    { path: '/financial-health', icon: TrendingUp, label: 'Health Score' }, // ✅ Added Health Score Link
    { path: '/retirement', icon: Briefcase, label: 'Retirement' },
    { path: '/home-loan', icon: Home, label: 'Home Loan' },
    { path: '/loans', icon: CreditCard, label: 'Loans' },
    { path: '/reports', icon: FileText, label: 'Reports' },
    { path: '/insights', icon: Lightbulb, label: 'Insights' },
  ];

  return (
    <div className="w-64 h-screen bg-white dark:bg-gray-800 shadow-lg flex flex-col sticky top-0 left-0">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-xl font-bold text-gray-800 dark:text-white">
          Finance Tracker
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {user?.name || 'User'}
        </p>
      </div>
      <nav className="flex-1 p-4 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 mb-2 rounded-lg transition-colors ${isActive
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 px-4 py-3 w-full rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
