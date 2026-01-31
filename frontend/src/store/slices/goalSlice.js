import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";

const API_URL = "/savings-goals"; // Backend route

// 🧩 1. Fetch all goals
export const fetchGoals = createAsyncThunk(
  "goals/fetchGoals",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await api.get(`${API_URL}/${userId}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch goals");
    }
  }
);

// 🧩 2. Add a new goal
export const addGoal = createAsyncThunk(
  "goals/addGoal",
  async (goal, { rejectWithValue }) => {
    try {
      const res = await api.post(API_URL, goal);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to add goal");
    }
  }
);

// 🧩 3. Update an existing goal
export const updateGoal = createAsyncThunk(
  "goals/updateGoal",
  async (goal, { rejectWithValue }) => {
    try {
      const res = await api.put(`${API_URL}/${goal._id}`, goal);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to update goal");
    }
  }
);

// 🧩 4. Delete a goal
export const deleteGoal = createAsyncThunk(
  "goals/deleteGoal",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`${API_URL}/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to delete goal");
    }
  }
);

// 🧩 Slice definition
const goalSlice = createSlice({
  name: "goals",
  initialState: {
    goals: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchGoals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGoals.fulfilled, (state, action) => {
        state.loading = false;
        state.goals = action.payload;
      })
      .addCase(fetchGoals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add
      .addCase(addGoal.fulfilled, (state, action) => {
        state.goals.push(action.payload);
      })
      .addCase(addGoal.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Update
      .addCase(updateGoal.fulfilled, (state, action) => {
        const index = state.goals.findIndex(
          (g) => g._id === action.payload._id
        );
        if (index !== -1) state.goals[index] = action.payload;
      })
      .addCase(updateGoal.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Delete
      .addCase(deleteGoal.fulfilled, (state, action) => {
        state.goals = state.goals.filter((g) => g._id !== action.payload);
      })
      .addCase(deleteGoal.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default goalSlice.reducer;
