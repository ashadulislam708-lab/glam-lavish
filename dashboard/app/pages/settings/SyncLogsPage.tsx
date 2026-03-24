import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router";
import { settingsService } from "~/services/httpServices/settingsService";
import AdminGuard from "~/components/guards/AdminGuard";
import { Card, CardContent } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
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
import { formatDateTime } from "~/utils/formatting";
import { SyncDirectionEnum, SyncLogStatusEnum } from "~/enums";
import { cn } from "~/lib/utils";
import { ArrowDown, ArrowUp, ArrowLeft } from "lucide-react";
import type { SyncLog } from "~/types/settings";

export default function SyncLogsPage() {
  return (
    <AdminGuard>
      <SyncLogsContent />
    </AdminGuard>
  );
}

function SyncLogsContent() {
  const [syncLogs, setSyncLogs] = useState<SyncLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState({
    page: 1,
    limit: 25,
    total: 0,
    totalPages: 0,
  });
  const [page, setPage] = useState(1);
  const [directionFilter, setDirectionFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const loadSyncLogs = useCallback(() => {
    setLoading(true);
    const params: { page: number; limit: number; direction?: string; status?: string } = {
      page,
      limit: 25,
    };
    if (directionFilter !== "all") params.direction = directionFilter;
    if (statusFilter !== "all") params.status = statusFilter;

    settingsService
      .getSyncLogs(params)
      .then((res) => {
        setSyncLogs(res.data);
        setMeta(res.meta);
      })
      .catch(() => setSyncLogs([]))
      .finally(() => setLoading(false));
  }, [page, directionFilter, statusFilter]);

  useEffect(() => {
    loadSyncLogs();
  }, [loadSyncLogs]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [directionFilter, statusFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/settings">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Sync Logs</h1>
          <p className="text-sm text-muted-foreground">
            WooCommerce synchronization history
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-3">
        <Select value={directionFilter} onValueChange={setDirectionFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Direction" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Directions</SelectItem>
            <SelectItem value={SyncDirectionEnum.INBOUND}>Inbound</SelectItem>
            <SelectItem value={SyncDirectionEnum.OUTBOUND}>Outbound</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value={SyncLogStatusEnum.SUCCESS}>Success</SelectItem>
            <SelectItem value={SyncLogStatusEnum.FAILED}>Failed</SelectItem>
            <SelectItem value={SyncLogStatusEnum.SKIPPED}>Skipped</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="pt-6">
          {loading ? (
            <LoadingSpinner />
          ) : syncLogs.length === 0 ? (
            <EmptyState
              title="No sync logs"
              description="Sync logs will appear after sync operations."
            />
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Direction</TableHead>
                      <TableHead>Entity Type</TableHead>
                      <TableHead>Entity ID</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Error</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {syncLogs.map((log) => (
                      <TableRow
                        key={log.id}
                        className={cn(
                          log.status === SyncLogStatusEnum.FAILED &&
                            "border-l-4 border-l-red-500"
                        )}
                      >
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              log.direction === SyncDirectionEnum.INBOUND
                                ? "bg-blue-50 text-blue-700"
                                : "bg-purple-50 text-purple-700"
                            }
                          >
                            {log.direction === SyncDirectionEnum.INBOUND ? (
                              <ArrowDown className="mr-1 h-3 w-3" />
                            ) : (
                              <ArrowUp className="mr-1 h-3 w-3" />
                            )}
                            {log.direction}
                          </Badge>
                        </TableCell>
                        <TableCell>{log.entityType}</TableCell>
                        <TableCell className="font-mono text-xs text-muted-foreground">
                          {log.entityId ?? "-"}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              log.status === SyncLogStatusEnum.SUCCESS
                                ? "bg-green-50 text-green-700"
                                : log.status === SyncLogStatusEnum.FAILED
                                  ? "bg-red-50 text-red-700"
                                  : "bg-yellow-50 text-yellow-700"
                            }
                          >
                            {log.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-xs truncate text-red-500">
                          {log.error ?? "-"}
                        </TableCell>
                        <TableCell className="text-muted-foreground whitespace-nowrap">
                          {formatDateTime(log.createdAt)}
                        </TableCell>
                      </TableRow>
                    ))}
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
