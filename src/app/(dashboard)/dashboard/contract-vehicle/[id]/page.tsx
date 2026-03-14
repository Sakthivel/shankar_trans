"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Pencil } from "lucide-react";
import { api } from "@/lib/api-client";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

interface ContractVehicleData {
  id: number;
  month: string;
  year: string;
  vehicleId: number;
  serialNo: number;
  date: string;
  tripId: string;
  driverId: number;
  workPlace: string;
  shift: string;
  workingDetails: string;
  startKm: number;
  closeKm: number;
  runningKm: number;
  diesel: number;
  mileage: number;
  dieselKm: number;
  dieselDebit: number;
  approved?: boolean;
  vehicle?: { vehicleNumber: string };
  driver?: { driverName: string };
  approvedBy?: { name: string };
}

function formatDate(dateStr: string) {
  if (!dateStr) return "-";
  try {
    return new Date(dateStr).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  } catch {
    return "-";
  }
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="bg-slate-50 rounded-lg px-4 py-3">
      <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wide">{label}</p>
      <p className="text-sm font-medium text-slate-800 mt-1">{value ?? "-"}</p>
    </div>
  );
}

export default function ContractVehicleViewPage() {
  const params = useParams();
  const router = useRouter();
  const id = String(params?.id);
  const [data, setData] = useState<ContractVehicleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get<{ success: boolean; data: ContractVehicleData }>(`/contract-vehicles/${id}`);
        if (res.success && res.data) setData(res.data);
        else setError("Failed to load contract vehicle");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load contract vehicle");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="space-y-4">
        <p className="text-red-600">{error || "Contract vehicle not found"}</p>
        <Button variant="secondary" onClick={() => router.push("/dashboard/contract-vehicle")}>Back</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-indigo-950">Contract Vehicle Details</h1>
          <p className="text-sm text-slate-500 mt-1">Trip ID: {data.tripId}</p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/contract-vehicle">
            <Button variant="secondary"><ArrowLeft size={16} className="mr-1" /> Back</Button>
          </Link>
          <Link href={`/dashboard/contract-vehicle/${id}/edit`}>
            <Button><Pencil size={16} className="mr-1" /> Edit</Button>
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 px-6 py-3">
          <h2 className="text-sm font-semibold text-white tracking-wide">Trip Information</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 p-5">
          <Field label="Month" value={data.month} />
          <Field label="Year" value={data.year} />
          <Field label="Serial No" value={data.serialNo} />
          <Field label="Date" value={formatDate(data.date)} />
          <Field label="Trip ID" value={data.tripId} />
          <Field label="Vehicle" value={data.vehicle?.vehicleNumber} />
          <Field label="Driver" value={data.driver?.driverName} />
          <Field label="Work Place" value={data.workPlace} />
          <Field label="Shift" value={<Badge variant={data.shift === "DAY" ? "warning" : "info"}>{data.shift}</Badge>} />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 px-6 py-3">
          <h2 className="text-sm font-semibold text-white tracking-wide">Work & KM Details</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 p-5">
          <div className="md:col-span-2 lg:col-span-3">
            <Field label="Working Details" value={data.workingDetails} />
          </div>
          <Field label="Start KM" value={data.startKm} />
          <Field label="Close KM" value={data.closeKm} />
          <Field label="Running KM" value={data.runningKm} />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-amber-500 to-amber-400 px-6 py-3">
          <h2 className="text-sm font-semibold text-white tracking-wide">Diesel Details</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 p-5">
          <Field label="Diesel" value={data.diesel} />
          <Field label="Mileage" value={data.mileage} />
          <Field label="Diesel KM" value={data.dieselKm} />
          <Field label="Diesel Debit" value={data.dieselDebit} />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-slate-600 to-slate-500 px-6 py-3">
          <h2 className="text-sm font-semibold text-white tracking-wide">Approval Status</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 p-5">
          <Field label="Approved" value={<Badge variant={data.approved ? "success" : "warning"}>{data.approved ? "Approved" : "Pending"}</Badge>} />
          <Field label="Approved By" value={data.approvedBy?.name ?? "-"} />
        </div>
      </div>
    </div>
  );
}
