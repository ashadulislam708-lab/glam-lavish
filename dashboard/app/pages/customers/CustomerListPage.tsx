import { useEffect, useState, useCallback, useRef } from "react";
import { useAppDispatch, useAppSelector } from "~/redux/store/hooks";
import { fetchCustomers } from "~/services/httpServices/customerService";
import { customerService } from "~/services/httpServices/customerService";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import Pagination from "~/components/atoms/Pagination";
import LoadingSpinner from "~/components/atoms/LoadingSpinner";
import EmptyState from "~/components/atoms/EmptyState";
import { cn } from "~/lib/utils";
import { formatBDT, formatDateTime } from "~/utils/formatting";
import { getOrderStatusColor } from "~/utils/badges";
import { ORDER_STATUS_LABELS } from "~/constants/orderStatusLabels";
import { OrderStatusEnum } from "~/enums";
import {
  FileDown,
  Search,
  Loader2,
  X,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";
import type { FormHandleState } from "~/types/common";
import type { CustomerOrder } from "~/types/customer";

interface PhoneOrdersState {
  orders: CustomerOrder[];
  loading: boolean;
}

export default function CustomerListPage() {
  const dispatch = useAppDispatch();
  const { customers, loading, meta } = useAppSelector(
    (state) => state.customers
  );
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [formHandle, setFormHandle] = useState<FormHandleState>({
    isLoading: false,
    loadingButtonType: "",
  });

  // Bulk selection state (keyed by phone number)
  const [selectedPhones, setSelectedPhones] = useState<Set<string>>(new Set());

  // Expand/collapse state
  const [expandedPhones, setExpandedPhones] = useState<Set<string>>(new Set());
  const [phoneOrders, setPhoneOrders] = useState<
    Record<string, PhoneOrdersState>
  >({});

  const loadCustomers = useCallback(() => {
    dispatch(
      fetchCustomers({
        page,
        limit: 25,
        search: search || undefined,
      })
    );
  }, [dispatch, page, search]);

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  // Clear selection and expanded state when filters/page change
  useEffect(() => {
    setSelectedPhones(new Set());
    setExpandedPhones(new Set());
    setPhoneOrders({});
  }, [page, search]);

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setPage(1);
    }, 300);
  }, []);

  const toggleSelect = (phone: string) => {
    setSelectedPhones((prev) => {
      const next = new Set(prev);
      if (next.has(phone)) {
        next.delete(phone);
      } else {
        next.add(phone);
      }
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (
      customers.length > 0 &&
      customers.every((c) => selectedPhones.has(c.customerPhone))
    ) {
      setSelectedPhones(new Set());
    } else {
      setSelectedPhones(new Set(customers.map((c) => c.customerPhone)));
    }
  };

  const allSelected =
    customers.length > 0 &&
    customers.every((c) => selectedPhones.has(c.customerPhone));

  const toggleExpand = useCallback(
    async (phone: string) => {
      if (expandedPhones.has(phone)) {
        setExpandedPhones((prev) => {
          const next = new Set(prev);
          next.delete(phone);
          return next;
        });
        return;
      }

      setExpandedPhones((prev) => new Set(prev).add(phone));

      // Only fetch if not already loaded
      if (!phoneOrders[phone]) {
        setPhoneOrders((prev) => ({
          ...prev,
          [phone]: { orders: [], loading: true },
        }));
        try {
          const result = await customerService.getCustomerOrders(phone);
          setPhoneOrders((prev) => ({
            ...prev,
            [phone]: { orders: result.data, loading: false },
          }));
        } catch {
          setPhoneOrders((prev) => ({
            ...prev,
            [phone]: { orders: [], loading: false },
          }));
          toast.error("Failed to load orders");
        }
      }
    },
    [expandedPhones, phoneOrders]
  );

  const handleExportAll = useCallback(() => {
    setFormHandle({ isLoading: true, loadingButtonType: "exportAll" });
    customerService
      .exportCustomers({ search: search || undefined })
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `customers-${crypto.randomUUID()}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success("CSV exported successfully");
      })
      .catch((err: unknown) => {
        toast.error((err as { message?: string })?.message || "Export failed");
      })
      .finally(() => {
        setFormHandle({ isLoading: false, loadingButtonType: "" });
      });
  }, [search]);

  const handleExportSelected = useCallback(async () => {
    if (selectedPhones.size === 0) {
      toast.warning("No customers selected");
      return;
    }
    setFormHandle({ isLoading: true, loadingButtonType: "exportSelected" });
    try {
      const blob = await customerService.exportCustomers({
        phones: Array.from(selectedPhones).join(","),
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `customers-${crypto.randomUUID()}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success(`Exported ${selectedPhones.size} customers`);
    } catch (err: unknown) {
      toast.error((err as { message?: string })?.message || "Export failed");
    } finally {
      setFormHandle({ isLoading: false, loadingButtonType: "" });
    }
  }, [selectedPhones]);

  const isBusy = formHandle.isLoading;
  const totalColumns = 8; // expand + checkbox + name + phone + addresses + orders + total + last order

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Customers</h1>
        <Button
          variant="outline"
          onClick={handleExportAll}
          disabled={isBusy && formHandle.loadingButtonType === "exportAll"}
        >
          {isBusy && formHandle.loadingButtonType === "exportAll" ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <FileDown className="mr-2 h-4 w-4" />
          )}
          Export CSV
        </Button>
      </div>

      {/* Bulk action bar */}
      <div
        className={cn(
          "flex items-center justify-between rounded-lg border px-4 py-3",
          selectedPhones.size > 0 ? "bg-blue-50" : "bg-muted/30 opacity-60"
        )}
      >
        <span
          className={cn(
            "text-sm font-medium",
            selectedPhones.size > 0
              ? "text-blue-900"
              : "text-muted-foreground"
          )}
        >
          {selectedPhones.size} customer{selectedPhones.size !== 1 ? "s" : ""}{" "}
          selected
        </span>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleExportSelected}
            disabled={
              selectedPhones.size === 0 ||
              (isBusy && formHandle.loadingButtonType === "exportSelected")
            }
          >
            {isBusy && formHandle.loadingButtonType === "exportSelected" ? (
              <Loader2 className="mr-1 h-3 w-3 animate-spin" />
            ) : (
              <FileDown className="mr-1 h-3 w-3" />
            )}
            Export Selected
          </Button>
          {selectedPhones.size > 0 && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setSelectedPhones(new Set())}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1 min-w-[200px] max-w-[400px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by customer name or phone..."
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-9"
              />
            </div>
            {search && (
              <Button
                variant="ghost"
                size="sm"
                type="button"
                className="text-xs h-8 text-muted-foreground hover:text-destructive"
                onClick={() => {
                  setSearch("");
                  setPage(1);
                }}
              >
                <X className="h-3 w-3 mr-1" />
                Clear Search
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <LoadingSpinner className="h-48" text="Loading customers..." />
          ) : customers.length === 0 ? (
            <EmptyState
              title="No customers found"
              description="Customers will appear here once orders are created."
            />
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-8" />
                      <TableHead className="w-10">
                        <input
                          type="checkbox"
                          checked={allSelected}
                          onChange={toggleSelectAll}
                          className="h-4 w-4 rounded border-gray-300"
                        />
                      </TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Addresses</TableHead>
                      <TableHead>Orders</TableHead>
                      <TableHead>Total Spent</TableHead>
                      <TableHead>Last Order</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customers.map((customer) => {
                      const isExpanded = expandedPhones.has(
                        customer.customerPhone
                      );
                      const orderData = phoneOrders[customer.customerPhone];

                      return (
                        <>
                          {/* Main customer row */}
                          <TableRow
                            key={customer.customerPhone}
                            className={cn(
                              "hover:bg-gray-50 cursor-pointer",
                              selectedPhones.has(customer.customerPhone) &&
                                "bg-blue-50/50",
                              isExpanded && "bg-gray-50"
                            )}
                            onClick={() =>
                              toggleExpand(customer.customerPhone)
                            }
                          >
                            <TableCell className="w-8 px-2">
                              {isExpanded ? (
                                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                              )}
                            </TableCell>
                            <TableCell
                              onClick={(e) => e.stopPropagation()}
                            >
                              <input
                                type="checkbox"
                                checked={selectedPhones.has(
                                  customer.customerPhone
                                )}
                                onChange={() =>
                                  toggleSelect(customer.customerPhone)
                                }
                                className="h-4 w-4 rounded border-gray-300"
                              />
                            </TableCell>
                            <TableCell className="font-medium">
                              {customer.customerPhone}
                            </TableCell>
                            <TableCell>
                              {customer.customerName}
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col gap-1 max-w-[350px]">
                                {customer.addresses
                                  .slice(0, 2)
                                  .map((addr, idx) => (
                                    <span
                                      key={idx}
                                      className="text-xs text-muted-foreground leading-snug"
                                      title={addr}
                                    >
                                      {addr}
                                    </span>
                                  ))}
                                {customer.addresses.length > 2 && (
                                  <span
                                    className="text-xs text-blue-600 cursor-default"
                                    title={customer.addresses
                                      .slice(2)
                                      .join("\n")}
                                  >
                                    +{customer.addresses.length - 2} more
                                    address
                                    {customer.addresses.length - 2 > 1
                                      ? "es"
                                      : ""}
                                  </span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>{customer.totalOrders}</TableCell>
                            <TableCell className="font-medium">
                              {formatBDT(customer.totalSpent)}
                            </TableCell>
                            <TableCell className="text-muted-foreground whitespace-nowrap">
                              {formatDateTime(customer.lastOrderDate)}
                            </TableCell>
                          </TableRow>

                          {/* Expanded order sub-rows */}
                          {isExpanded && (
                            <>
                              {orderData?.loading ? (
                                <TableRow key={`${customer.customerPhone}-loading`}>
                                  <TableCell
                                    colSpan={totalColumns}
                                    className="bg-muted/30"
                                  >
                                    <div className="flex items-center justify-center py-3">
                                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground mr-2" />
                                      <span className="text-sm text-muted-foreground">
                                        Loading orders...
                                      </span>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ) : orderData?.orders.length === 0 ? (
                                <TableRow key={`${customer.customerPhone}-empty`}>
                                  <TableCell
                                    colSpan={totalColumns}
                                    className="bg-muted/30 text-center text-sm text-muted-foreground py-3"
                                  >
                                    No orders found
                                  </TableCell>
                                </TableRow>
                              ) : (
                                <>
                                  {/* Sub-header row */}
                                  <TableRow key={`${customer.customerPhone}-header`} className="bg-muted/20">
                                    <TableCell />
                                    <TableCell />
                                    <TableCell className="text-xs font-semibold text-muted-foreground">
                                      Invoice
                                    </TableCell>
                                    <TableCell className="text-xs font-semibold text-muted-foreground">
                                      Name
                                    </TableCell>
                                    <TableCell className="text-xs font-semibold text-muted-foreground">
                                      Address
                                    </TableCell>
                                    <TableCell className="text-xs font-semibold text-muted-foreground">
                                      Status
                                    </TableCell>
                                    <TableCell className="text-xs font-semibold text-muted-foreground">
                                      Amount
                                    </TableCell>
                                    <TableCell className="text-xs font-semibold text-muted-foreground">
                                      Date
                                    </TableCell>
                                  </TableRow>
                                  {orderData?.orders.map((order) => (
                                    <TableRow
                                      key={order.invoiceId}
                                      className="bg-muted/10 hover:bg-muted/20"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <TableCell />
                                      <TableCell />
                                      <TableCell className="text-sm font-medium text-blue-600">
                                        {order.invoiceId}
                                      </TableCell>
                                      <TableCell className="text-sm">
                                        {order.customerName}
                                      </TableCell>
                                      <TableCell className="text-xs text-muted-foreground max-w-[300px]">
                                        {order.customerAddress}
                                      </TableCell>
                                      <TableCell>
                                        <Badge
                                          variant="outline"
                                          className={getOrderStatusColor(
                                            order.status as OrderStatusEnum
                                          )}
                                        >
                                          {ORDER_STATUS_LABELS[
                                            order.status as OrderStatusEnum
                                          ] ?? order.status}
                                        </Badge>
                                      </TableCell>
                                      <TableCell className="text-sm font-medium">
                                        {formatBDT(order.grandTotal)}
                                      </TableCell>
                                      <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                                        {formatDateTime(order.createdAt)}
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </>
                              )}
                            </>
                          )}
                        </>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
              <Pagination
                page={meta.page}
                totalPages={meta.totalPages}
                total={meta.total}
                limit={meta.limit}
                onPageChange={setPage}
              />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
