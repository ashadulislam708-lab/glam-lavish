import { createAsyncThunk } from "@reduxjs/toolkit";
import { httpService } from "~/services/httpService";
import type { Customer, CustomerOrder, FetchCustomersParams } from "~/types/customer";
import type { PaginatedResponse } from "~/types/common";

export const customerService = {
  getCustomers: (params?: FetchCustomersParams) =>
    httpService.get<PaginatedResponse<Customer>>("/customers", { params }),

  getCustomerOrders: (phone: string) =>
    httpService.get<PaginatedResponse<CustomerOrder>>(
      `/customers/${encodeURIComponent(phone)}/orders`
    ),

  exportCustomers: (params?: FetchCustomersParams) =>
    httpService.getBlob("/customers/export", { params }),
};

export const fetchCustomers = createAsyncThunk(
  "customers/fetchCustomers",
  async (params: FetchCustomersParams | undefined, { rejectWithValue }) => {
    try {
      return await customerService.getCustomers(params);
    } catch (error: unknown) {
      return rejectWithValue(
        (error as { message?: string }).message ?? "Failed to fetch customers"
      );
    }
  }
);
