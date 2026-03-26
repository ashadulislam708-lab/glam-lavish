export interface Customer {
  customerPhone: string;
  customerName: string;
  addresses: string[];
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
}

export interface CustomerOrder {
  invoiceId: string;
  customerName: string;
  customerAddress: string;
  status: string;
  grandTotal: number;
  createdAt: string;
}

export interface FetchCustomersParams {
  page?: number;
  limit?: number;
  search?: string;
  phones?: string;
}

export interface CustomerState {
  customers: Customer[];
  loading: boolean;
  error: string | null;
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
