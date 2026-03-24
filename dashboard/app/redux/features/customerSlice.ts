import { createSlice } from "@reduxjs/toolkit";
import type { CustomerState } from "~/types/customer";
import { fetchCustomers } from "~/services/httpServices/customerService";

const initialState: CustomerState = {
  customers: [],
  loading: false,
  error: null,
  meta: {
    page: 1,
    limit: 25,
    total: 0,
    totalPages: 0,
  },
};

const customerSlice = createSlice({
  name: "customers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = action.payload.data;
        state.meta = action.payload.meta;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default customerSlice.reducer;
