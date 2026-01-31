import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";

const API_URL = "/budgets"; // ✅ Backend route

// 🧩 Fetch budgets (with month/year query)
export const fetchBudgets = createAsyncThunk(
  "budgets/fetchBudgets",
  async ({ month, year }, { rejectWithValue }) => {
    try {
      const res = await api.get(API_URL, {
        params: { month, year },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch budgets");
    }
  }
);

// 🧩 Add new budget
export const addBudget = createAsyncThunk(
  "budgets/addBudget",
  async (budgetData, { rejectWithValue }) => {
    try {
      const res = await api.post(API_URL, budgetData);
      return res.data; // ✅ make sure backend returns the created budget
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to add budget");
    }
  }
);

// 🧩 Update budget
export const updateBudget = createAsyncThunk(
  "budgets/updateBudget",
  async ({ id, ...budgetData }, { rejectWithValue }) => {
    try {
      const res = await api.put(`${API_URL}/${id}`, budgetData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to update budget");
    }
  }
);

// 🧩 Delete budget
export const deleteBudget = createAsyncThunk(
  "budgets/deleteBudget",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`${API_URL}/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to delete budget");
    }
  }
);

// 🧩 Slice definition
const budgetSlice = createSlice({
  name: "budgets",
  initialState: {
    budgets: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ✅ FETCH
      .addCase(fetchBudgets.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBudgets.fulfilled, (state, action) => {
        state.loading = false;
        state.budgets = action.payload;
      })
      .addCase(fetchBudgets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ ADD
      .addCase(addBudget.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && action.payload._id) {
          state.budgets.push(action.payload); // add new budget to list
        }
      })
      .addCase(addBudget.pending, (state) => {
        state.loading = true;
      })
      .addCase(addBudget.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ UPDATE
      .addCase(updateBudget.fulfilled, (state, action) => {
        const index = state.budgets.findIndex(
          (b) => b._id === action.payload._id
        );
        if (index !== -1) {
          state.budgets[index] = action.payload;
        }
      })
      .addCase(updateBudget.rejected, (state, action) => {
        state.error = action.payload;
      })

      // ✅ DELETE
      .addCase(deleteBudget.fulfilled, (state, action) => {
        state.budgets = state.budgets.filter((b) => b._id !== action.payload);
      })
      .addCase(deleteBudget.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default budgetSlice.reducer;
