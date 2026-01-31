import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    format,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    addMonths,
    subMonths,
    parseISO,
} from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, TrendingUp, TrendingDown, Target } from 'lucide-react';
import { fetchTransactions } from '../store/slices/transactionSlice';
import { fetchGoals } from '../store/slices/goalSlice';
import { fetchInvestmentGoals } from '../store/slices/investmentGoalSlice';

const FinancialCalendar = () => {
    const dispatch = useDispatch();
    const [currentDate, setCurrentDate] = useState(new Date());

    const { transactions } = useSelector((state) => state.transactions);
    const { goals } = useSelector((state) => state.goals);
    const { goals: investmentGoals } = useSelector((state) => state.investmentGoals);
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        if (user?.id) {
            // Fetch all data
            // Ideally we might want to filter by date range, but for now we fetch all
            // as the slices seem to fetch all or have basic filtering.
            // Assuming fetchTransactions supports query params, but default fetch is fine for now.
            dispatch(fetchTransactions());
            dispatch(fetchGoals(user.id));
            dispatch(fetchInvestmentGoals(user.id));
        }
    }, [dispatch, user]);

    const nextMonth = () => {
        setCurrentDate(addMonths(currentDate, 1));
    };

    const prevMonth = () => {
        setCurrentDate(subMonths(currentDate, 1));
    };

    const today = () => {
        setCurrentDate(new Date());
    };

    // Process data into events
    const getEventsForDate = (date) => {
        const events = [];

        // Transactions
        transactions.forEach((t) => {
            const tDate = parseISO(t.date);
            if (isSameDay(tDate, date)) {
                // Check if it's a debt/loan transaction
                const isDebt = t.category === "Debt" || (t.category === "Other" && t.description.includes("Loan"));

                events.push({
                    type: isDebt ? 'debt' : (t.type === 'income' ? 'income' : 'expense'),
                    title: t.category === 'Other' && isDebt ? 'Debt' : t.category, // Show 'Debt' instead of 'Other'
                    amount: t.amount,
                });
            }
        });

        // Goals (Deadlines)
        goals.forEach((g) => {
            if (g.deadline) {
                const gDate = parseISO(g.deadline);
                if (isSameDay(gDate, date)) {
                    events.push({
                        type: 'goal',
                        title: `${g.name} Deadline`,
                        amount: g.targetAmount,
                        isDeadline: true
                    });
                }
            }
        });

        // Investment Goals (Deadlines)
        if (investmentGoals) {
            investmentGoals.forEach((g) => {
                if (g.deadline) {
                    const gDate = parseISO(g.deadline);
                    if (isSameDay(gDate, date)) {
                        events.push({
                            type: 'investment',
                            title: `${g.name} Deadline`,
                            amount: g.targetAmount,
                            isDeadline: true
                        });
                    }
                }
            });
        }

        return events;
    };

    const renderHeader = () => {
        const dateFormat = "MMMM yyyy";

        return (
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                        {format(currentDate, dateFormat)}
                    </h2>
                    <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                        <button onClick={prevMonth} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition">
                            <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                        </button>
                        <button onClick={today} className="px-3 py-1 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition mx-1">
                            Today
                        </button>
                        <button onClick={nextMonth} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition">
                            <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                        </button>
                    </div>
                </div>

                {/* Legend */}
                <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                        <span className="text-gray-600 dark:text-gray-300">Income</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                        <span className="text-gray-600 dark:text-gray-300">Expense / Debt</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                        <span className="text-gray-600 dark:text-gray-300">Goals</span>
                    </div>
                </div>
            </div>
        );
    };

    const renderDays = () => {
        const days = [];
        const dateFormat = "EEEE";
        const startDate = startOfWeek(currentDate);

        for (let i = 0; i < 7; i++) {
            days.push(
                <div className="text-center font-semibold text-gray-500 dark:text-gray-400 py-2 border-b dark:border-gray-700" key={i}>
                    {format(eachDayOfInterval({ start: startDate, end: endOfWeek(currentDate) })[i], dateFormat)}
                </div>
            );
        }

        return <div className="grid grid-cols-7 mb-2">{days}</div>;
    };

    const renderCells = () => {
        const monthStart = startOfMonth(currentDate);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart);
        const endDate = endOfWeek(monthEnd);
        const dateRange = eachDayOfInterval({ start: startDate, end: endDate });

        const rows = [];
        let days = [];
        let day = startDate;
        let formattedDate = "";

        dateRange.forEach((day, index) => {
            formattedDate = format(day, "d");
            const cloneDay = day;
            const events = getEventsForDate(cloneDay);
            const isCurrentMonth = isSameMonth(day, monthStart);
            const isToday = isSameDay(day, new Date());

            days.push(
                <div
                    className={`min-h-[120px] border dark:border-gray-700 p-2 relative group transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50
                    ${!isCurrentMonth ? "text-gray-400 dark:text-gray-600 bg-gray-50/50 dark:bg-gray-900/50" : "text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800"}
                    ${isToday ? "bg-blue-50/30 dark:bg-blue-900/10" : ""}
                `}
                    key={day}
                >
                    <div className={`text-right text-sm font-medium mb-1 ${isToday ? "text-blue-600 dark:text-blue-400" : ""}`}>
                        {isToday && <span className="mr-1 text-xs font-bold text-blue-600 dark:text-blue-400">TODAY</span>}
                        {formattedDate}
                    </div>

                    <div className="space-y-1 overflow-y-auto max-h-[80px] custom-scrollbar">
                        {events.map((event, idx) => (
                            <div
                                key={idx}
                                className={`text-xs p-1 rounded border flex items-center justify-between
                                ${event.type === 'income' ? 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800' :
                                        (event.type === 'expense' || event.type === 'debt') ? 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800' :
                                            'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800'}
                            `}
                            >
                                <span className="truncate max-w-[70%] font-medium">
                                    {event.isDeadline && <Target size={10} className="inline mr-1" />}
                                    {event.title}
                                </span>
                                <span className="font-bold">
                                    {event.type === 'income' || event.type === 'expense' ? '$' : ''}{event.amount}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            );

            if ((index + 1) % 7 === 0) {
                rows.push(
                    <div className="grid grid-cols-7" key={day}>
                        {days}
                    </div>
                );
                days = [];
            }
        });

        return <div className="border-l border-t dark:border-gray-700 rounded-lg overflow-hidden">{rows}</div>;
    };

    return (
        <div className="p-4 h-full flex flex-col">
            {renderHeader()}
            <div className="flex-1 flex flex-col">
                {renderDays()}
                {renderCells()}
            </div>
        </div>
    );
};

export default FinancialCalendar;
