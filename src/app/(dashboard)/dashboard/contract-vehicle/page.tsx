"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Eye, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import { api } from "@/lib/api-client";
import { DataTable } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useAuth } from "@/context/AuthContext";

interface ContractVehicle {
  id: number;
  month: string;
  year: string;
  date: string;
  tripId: string;
  shift: string;
  startKm: number;
  closeKm: number;
  runningKm: number;
  approved: boolean;
  vehicle: { vehicleNumber: string };
  driver: { driverName: string };
}

interface PaginatedResponse {
  success: boolean;
  data: ContractVehicle[];
  total: number;
  page: number;
  totalPages: number;
}

const PAGE_SIZE = 20;

export default function ContractVehiclePage() {
  const router = useRouter();
  const { isRole } = useAuth();
  const [data, setData] = useState<ContractVehicle[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [approvingId, setApprovingId] = useState<number | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get<PaginatedResponse>("/contract-vehicles", {
        page,
        limit: PAGE_SIZE,
      });
      setData(res.data || []);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to fetch contract vehicles"
      );
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleApprove = async (id: number) => {
    if (!isRole("MANAGER", "OWNER")) return;
    setApprovingId(id);
    try {
      await api.patch<{ success: boolean; data: ContractVehicle }>(
        `/contract-vehicles/${id}/approve`,
        {}
      );
      toast.success("Contract vehicle approved successfully");
      fetchData();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to approve"
      );
    } finally {
      setApprovingId(null);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const enrichedData = data.map((row, i) => ({
    ...row,
    sno: (page - 1) * PAGE_SIZE + i + 1,
  }));

  const columns = [
    { key: "sno", label: "S.No" },
    { key: "month", label: "Month" },
    { key: "year", label: "Year" },
    {
      key: "vehicle",
      label: "Vehicle",
      render: (row: ContractVehicle) => row.vehicle?.vehicleNumber ?? "-",
    },
    {
      key: "driver",
      label: "Driver",
      render: (row: ContractVehicle) => row.driver?.driverName ?? "-",
    },
    { key: "tripId", label: "Trip ID" },
    { key: "shift", label: "Shift" },
    {
      key: "startKm",
      label: "Start KM",
      render: (row: ContractVehicle) => row.startKm?.toFixed(2) ?? "-",
    },
    {
      key: "closeKm",
      label: "Close KM",
      render: (row: ContractVehicle) => row.closeKm?.toFixed(2) ?? "-",
    },
    {
      key: "runningKm",
      label: "Running KM",
      render: (row: ContractVehicle) => row.runningKm?.toFixed(2) ?? "-",
    },
    {
      key: "approved",
      label: "Approved",
      render: (row: ContractVehicle) => (
        <Badge variant={row.approved ? "success" : "warning"}>
          {row.approved ? "Yes" : "No"}
        </Badge>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row: ContractVehicle) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/dashboard/contract-vehicle/${row.id}`);
            }}
          >
            <Eye size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/dashboard/contract-vehicle/${row.id}/edit`);
            }}
          >
            <Pencil size={16} />
          </Button>
          {isRole("MANAGER", "OWNER") && !row.approved && (
            <Button
              variant="ghost"
              size="sm"
              className="text-green-600 hover:text-green-700 hover:bg-green-50"
              onClick={(e) => {
                e.stopPropagation();
                handleApprove(row.id);
              }}
              loading={approvingId === row.id}
            >
              <CheckCircle size={16} />
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Contract Vehicle</h1>
        <Link href="/dashboard/contract-vehicle/add">
          <Button>
            <Plus size={18} className="mr-2" />
            Add New
          </Button>
        </Link>
      </div>

      <DataTable
        columns={columns}
        data={enrichedData}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        loading={loading}
      />
    </div>
  );
}
