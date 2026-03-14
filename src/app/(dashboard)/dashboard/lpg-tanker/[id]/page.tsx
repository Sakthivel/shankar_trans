"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Pencil } from "lucide-react";
import { api } from "@/lib/api-client";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

interface LpgTankerRecord {
  id: number;
  month: string;
  year: string;
  vehicleId: number;
  serialNo: number;
  date: string;
  tripId: string;
  driverId: number;
  loadingPlantId: number;
  deliveryLocationId: number;
  loadQuantityPerTon: number;
  km: number;
  fastag: number;
  tripStartDate: string;
  tripEndDate: string;
  unloadQuantityPerTon: number;
  shortage: number;
  wayExpense: number;
  others: number;
  dieselGiven: number;
  excessDiesel: number;
  dieselAmount: number;
  advance: number;
  totalExpense: number;
  ratePerTon: number;
  freight: number;
  approved?: boolean;
  vehicle?: { vehicleNumber: string };
  driver?: { driverName: string };
  loadingPlant?: { loadingPlant: string };
  deliveryLocation?: { deliveryLocation: string };
  approvedBy?: { name: string };
}

function formatDate(d: string | null | undefined): string {
  if (!d) return "-";
  try {
    const parsed = new Date(d);
    if (isNaN(parsed.getTime())) return "-";
    return parsed.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  } catch {
    return "-";
  }
}

function formatNum(n: number | null | undefined): string {
  if (n == null) return "-";
  return String(n);
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="bg-slate-50 rounded-lg px-4 py-3">
      <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wide">{label}</p>
      <p className="text-sm font-medium text-slate-800 mt-1">{value ?? "-"}</p>
    </div>
  );
}

export default function ViewLpgTankerPage() {
  const params = useParams();
  const id = String(params?.id);
  const [data, setData] = useState<LpgTankerRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get<{ success: boolean; data: LpgTankerRecord }>(`/lpg-tankers/${id}`);
        setData(res.data ?? null);
      } catch {
        setData(null);
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

  if (!data) {
    return (
      <div className="space-y-4">
        <p className="text-slate-600">Record not found.</p>
        <Link href="/dashboard/lpg-tanker">
          <Button variant="secondary">Back</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-indigo-950">LPG Tanker Details</h1>
          <p className="text-sm text-slate-500 mt-1">Trip ID: {data.tripId}</p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/lpg-tanker">
            <Button variant="secondary"><ArrowLeft size={16} className="mr-1" /> Back</Button>
          </Link>
          <Link href={`/dashboard/lpg-tanker/${id}/edit`}>
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
          <Field label="Serial No" value={formatNum(data.serialNo)} />
          <Field label="Date" value={formatDate(data.date)} />
          <Field label="Trip ID" value={data.tripId} />
          <Field label="Vehicle" value={data.vehicle?.vehicleNumber} />
          <Field label="Driver" value={data.driver?.driverName} />
          <Field label="Loading Plant" value={data.loadingPlant?.loadingPlant} />
          <Field label="Delivery Location" value={data.deliveryLocation?.deliveryLocation} />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 px-6 py-3">
          <h2 className="text-sm font-semibold text-white tracking-wide">Load & Trip Details</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 p-5">
          <Field label="Load Quantity Per Ton" value={formatNum(data.loadQuantityPerTon)} />
          <Field label="KM" value={formatNum(data.km)} />
          <Field label="Fastag" value={formatNum(data.fastag)} />
          <Field label="Trip Start Date" value={formatDate(data.tripStartDate)} />
          <Field label="Trip End Date" value={formatDate(data.tripEndDate)} />
          <Field label="Unload Quantity Per Ton" value={formatNum(data.unloadQuantityPerTon)} />
          <Field label="Shortage" value={formatNum(data.shortage)} />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-amber-500 to-amber-400 px-6 py-3">
          <h2 className="text-sm font-semibold text-white tracking-wide">Financial Details</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 p-5">
          <Field label="Way Expense" value={formatNum(data.wayExpense)} />
          <Field label="Others" value={formatNum(data.others)} />
          <Field label="Diesel Given" value={formatNum(data.dieselGiven)} />
          <Field label="Excess Diesel" value={formatNum(data.excessDiesel)} />
          <Field label="Diesel Amount" value={formatNum(data.dieselAmount)} />
          <Field label="Advance" value={formatNum(data.advance)} />
          <Field label="Total Expense" value={formatNum(data.totalExpense)} />
          <Field label="Rate Per Ton" value={formatNum(data.ratePerTon)} />
          <Field label="Freight" value={formatNum(data.freight)} />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-slate-600 to-slate-500 px-6 py-3">
          <h2 className="text-sm font-semibold text-white tracking-wide">Approval Status</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 p-5">
          <Field label="Approved" value={<Badge variant={data.approved ? "success" : "warning"}>{data.approved ? "Approved" : "Pending"}</Badge>} />
          {data.approvedBy && <Field label="Approved By" value={data.approvedBy.name} />}
        </div>
      </div>
    </div>
  );
}
