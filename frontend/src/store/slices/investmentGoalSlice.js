import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";

const API_URL = "/investment-goals";

// Async Thunks
export const fetchInvestmentGoals = createAsyncThunk(
    "investmentGoals/fetchInvestmentGoals",
    async (userId, { rejectWithValue }) => {
        try {
            const response = await api.get(`${API_URL}/${userId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message
            );
        }
    }
);

export const createInvestmentGoal = createAsyncThunk(
    "investmentGoals/createInvestmentGoal",
    async (goalData, { rejectWithValue }) => {
        try {
            const response = await api.post(API_URL, goalData);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message
            );
        }
    }
);

export const updateInvestmentGoal = createAsyncThunk(
    "investmentGoals/updateInvestmentGoal",
    async ({ id, ...updateData }, { rejectWithValue }) => {
        try {
            const response = await api.put(
                `${API_URL}/${id}`,
                updateData
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message
            );
        }
    }
);

const investmentGoalSlice = createSlice({
    name: "investmentGoals",
    initialState: {
        goals: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch Goals
            .addCase(fetchInvestmentGoals.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchInvestmentGoals.fulfilled, (state, action) => {
                state.loading = false;
                state.goals = action.payload;
            })
            .addCase(fetchInvestmentGoals.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Create Goal
            .addCase(createInvestmentGoal.fulfilled, (state, action) => {
                state.goals.push(action.payload);
            })
            // Update Goal
            .addCase(updateInvestmentGoal.fulfilled, (state, action) => {
                const index = state.goals.findIndex((goal) => goal._id === action.payload._id);
                if (index !== -1) {
                    state.goals[index] = action.payload;
                }
            });
    },
});

export default investmentGoalSlice.reducer;
