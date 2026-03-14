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

interface RoadTrip {
  id: number;
  month: string;
  year: string;
  date: string;
  tripId: string;
  gcNo: string;
  approved: boolean;
  vehicle: { vehicleNumber: string };
  driver: { driverName: string };
  loadingPlant: { loadingPlant: string };
  deliveryLocation: { deliveryLocation: string };
}

interface PaginatedResponse {
  success: boolean;
  data: RoadTrip[];
  total: number;
  page: number;
  totalPages: number;
}

const PAGE_SIZE = 20;

export default function RoadTripPage() {
  const router = useRouter();
  const { isRole } = useAuth();
  const [data, setData] = useState<RoadTrip[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [approvingId, setApprovingId] = useState<number | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get<PaginatedResponse>("/road-trips", {
        page,
        limit: PAGE_SIZE,
      });
      setData(res.data || []);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to fetch road trips"
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
      await api.patch<{ success: boolean; data: RoadTrip }>(
        `/road-trips/${id}/approve`,
        {}
      );
      toast.success("Road trip approved successfully");
      fetchData();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to approve"
      );
    } finally {
      setApprovingId(null);
    }
  };

  const enrichedData = data.map((row, i) => ({
    ...row,
    sno: (page - 1) * PAGE_SIZE + i + 1,
  }));

  const columns = [
    { key: "sno", label: "S.No" },
    { key: "tripId", label: "Trip ID" },
    {
      key: "vehicle",
      label: "Vehicle",
      render: (row: RoadTrip) => row.vehicle?.vehicleNumber ?? "-",
    },
    {
      key: "driver",
      label: "Driver",
      render: (row: RoadTrip) => row.driver?.driverName ?? "-",
    },
    {
      key: "approved",
      label: "Approved",
      render: (row: RoadTrip) => (
        <Badge variant={row.approved ? "success" : "warning"}>
          {row.approved ? "Yes" : "No"}
        </Badge>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row: RoadTrip) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/dashboard/road-trip/${row.id}`);
            }}
          >
            <Eye size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/dashboard/road-trip/${row.id}/edit`);
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
        <h1 className="text-2xl font-bold text-indigo-950">Road Trip</h1>
        <Link href="/dashboard/road-trip/add">
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
