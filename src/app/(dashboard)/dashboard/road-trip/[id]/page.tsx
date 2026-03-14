"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Pencil } from "lucide-react";
import toast from "react-hot-toast";
import { api } from "@/lib/api-client";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

interface RoadTripRecord {
  id: number;
  month: string;
  year: string;
  vehicleId: number;
  serialNo: number;
  date: string;
  tripId: string;
  gcNo: string;
  driverId: number;
  loadingPlantId: number;
  deliveryLocationId: number;
  quantity: number;
  tripStartDate: string;
  tripStartTime: string;
  tripEndDate: string;
  tripEndTime: string;
  unloadQuantity: number;
  shortage: number;
  startKm: number;
  closeKm: number;
  runningKm: number;
  haltingDaysWithTime: string | null;
  gcReceivedStatus: boolean;
  docUploadUrl: string | null;
  remarks: string | null;
  approved: boolean;
  vehicle: { vehicleNumber: string };
  driver: { driverName: string };
  loadingPlant: { loadingPlant: string };
  deliveryLocation: { deliveryLocation: string };
  approvedBy?: { name: string } | null;
}

function formatDate(val: string | null | undefined): string {
  if (!val) return "-";
  try {
    return new Date(val).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  } catch {
    return String(val);
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

export default function RoadTripViewPage() {
  const params = useParams();
  const router = useRouter();
  const id = String(params?.id);
  const [data, setData] = useState<RoadTripRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get<{ success: boolean; data: RoadTripRecord }>(`/road-trips/${id}`);
        setData(res.data);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to load road trip");
        router.push("/dashboard/road-trip");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-indigo-950">Road Trip Details</h1>
          <p className="text-sm text-slate-500 mt-1">Trip ID: {data.tripId} &middot; GC No: {data.gcNo}</p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/road-trip">
            <Button variant="secondary"><ArrowLeft size={16} className="mr-1" /> Back</Button>
          </Link>
          <Link href={`/dashboard/road-trip/${id}/edit`}>
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
          <Field label="GC No" value={data.gcNo} />
          <Field label="Vehicle" value={data.vehicle?.vehicleNumber} />
          <Field label="Driver" value={data.driver?.driverName} />
          <Field label="Loading Plant" value={data.loadingPlant?.loadingPlant} />
          <Field label="Delivery Location" value={data.deliveryLocation?.deliveryLocation} />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 px-6 py-3">
          <h2 className="text-sm font-semibold text-white tracking-wide">Load & KM Details</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 p-5">
          <Field label="Quantity" value={data.quantity} />
          <Field label="Unload Quantity" value={data.unloadQuantity} />
          <Field label="Shortage" value={data.shortage} />
          <Field label="Start KM" value={data.startKm} />
          <Field label="Close KM" value={data.closeKm} />
          <Field label="Running KM" value={data.runningKm} />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-cyan-600 to-cyan-500 px-6 py-3">
          <h2 className="text-sm font-semibold text-white tracking-wide">Trip Timeline</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 p-5">
          <Field label="Trip Start Date" value={formatDate(data.tripStartDate)} />
          <Field label="Trip Start Time" value={data.tripStartTime} />
          <Field label="Trip End Date" value={formatDate(data.tripEndDate)} />
          <Field label="Trip End Time" value={data.tripEndTime} />
          <Field label="Halting Days With Time" value={data.haltingDaysWithTime} />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-slate-600 to-slate-500 px-6 py-3">
          <h2 className="text-sm font-semibold text-white tracking-wide">Status & Documents</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 p-5">
          <Field label="GC Received" value={<Badge variant={data.gcReceivedStatus ? "success" : "warning"}>{data.gcReceivedStatus ? "Yes" : "No"}</Badge>} />
          <Field label="Approved" value={<Badge variant={data.approved ? "success" : "warning"}>{data.approved ? "Approved" : "Pending"}</Badge>} />
          {data.approved && data.approvedBy && <Field label="Approved By" value={data.approvedBy.name} />}
          <Field label="Doc Upload" value={data.docUploadUrl ? <a href={data.docUploadUrl} className="text-indigo-600 underline" target="_blank" rel="noopener noreferrer">View Document</a> : "-"} />
          <div className="md:col-span-2 lg:col-span-3">
            <Field label="Remarks" value={data.remarks} />
          </div>
        </div>
      </div>
    </div>
  );
}
