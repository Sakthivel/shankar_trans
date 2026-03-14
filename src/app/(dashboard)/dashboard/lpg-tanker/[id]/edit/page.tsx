"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { api } from "@/lib/api-client";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { MONTHS, YEARS } from "@/types";

interface Vehicle { id: number; vehicleNumber: string }
interface Driver { id: number; driverName: string }
interface LoadingPlant { id: number; loadingPlant: string }
interface DeliveryLocation { id: number; deliveryLocation: string }

interface LpgTankerRecord {
  id: number; month: string; year: string; vehicleId: number; serialNo: number;
  date: string; tripId: string; driverId: number; loadingPlantId: number;
  deliveryLocationId: number; loadQuantityPerTon: number; km: number; fastag: number;
  tripStartDate: string; tripEndDate: string; unloadQuantityPerTon: number;
  shortage: number; wayExpense: number; others: number; dieselGiven: number;
  excessDiesel: number; dieselAmount: number; advance: number; totalExpense: number;
  ratePerTon: number; freight: number;
}

function toYyyyMmDd(d: string | null | undefined): string {
  if (!d) return "";
  try {
    const parsed = new Date(d);
    if (isNaN(parsed.getTime())) return "";
    return `${parsed.getFullYear()}-${String(parsed.getMonth() + 1).padStart(2, "0")}-${String(parsed.getDate()).padStart(2, "0")}`;
  } catch { return ""; }
}

const initialFormData = {
  month: "", year: "", vehicleId: "", serialNo: "", date: "", tripId: "",
  driverId: "", loadingPlantId: "", deliveryLocationId: "", loadQuantityPerTon: "",
  km: "", fastag: "", tripStartDate: "", tripEndDate: "", unloadQuantityPerTon: "",
  shortage: "", wayExpense: "", others: "", dieselGiven: "", excessDiesel: "",
  dieselAmount: "", advance: "", totalExpense: "", ratePerTon: "", freight: "",
};

function SectionHeader({ title, color = "indigo" }: { title: string; color?: string }) {
  const gradients: Record<string, string> = {
    indigo: "from-indigo-600 to-indigo-500",
    emerald: "from-emerald-600 to-emerald-500",
    amber: "from-amber-500 to-amber-400",
  };
  return (
    <div className={`bg-gradient-to-r ${gradients[color] ?? gradients.indigo} px-6 py-3`}>
      <h2 className="text-sm font-semibold text-white tracking-wide">{title}</h2>
    </div>
  );
}

export default function EditLpgTankerPage() {
  const params = useParams();
  const router = useRouter();
  const id = String(params?.id);
  const [formData, setFormData] = useState(initialFormData);
  const [submitting, setSubmitting] = useState(false);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loadingPlants, setLoadingPlants] = useState<LoadingPlant[]>([]);
  const [deliveryLocations, setDeliveryLocations] = useState<DeliveryLocation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [recordRes, vehiclesRes, driversRes, plantsRes, locationsRes] = await Promise.all([
          api.get<{ success: boolean; data: LpgTankerRecord }>(`/lpg-tankers/${id}`),
          api.get<{ success: boolean; data: Vehicle[] }>("/vehicles", { active: "true" }),
          api.get<{ success: boolean; data: Driver[] }>("/drivers", { active: "true" }),
          api.get<{ success: boolean; data: LoadingPlant[] }>("/loading-plants", { active: "true" }),
          api.get<{ success: boolean; data: DeliveryLocation[] }>("/delivery-locations", { active: "true" }),
        ]);
        const r = recordRes.data;
        if (r) {
          setFormData({
            month: r.month ?? "", year: r.year ?? "",
            vehicleId: String(r.vehicleId ?? ""), serialNo: String(r.serialNo ?? ""),
            date: toYyyyMmDd(r.date), tripId: r.tripId ?? "",
            driverId: String(r.driverId ?? ""), loadingPlantId: String(r.loadingPlantId ?? ""),
            deliveryLocationId: String(r.deliveryLocationId ?? ""),
            loadQuantityPerTon: String(r.loadQuantityPerTon ?? ""),
            km: String(r.km ?? ""), fastag: String(r.fastag ?? ""),
            tripStartDate: toYyyyMmDd(r.tripStartDate), tripEndDate: toYyyyMmDd(r.tripEndDate),
            unloadQuantityPerTon: String(r.unloadQuantityPerTon ?? ""),
            shortage: String(r.shortage ?? ""), wayExpense: String(r.wayExpense ?? ""),
            others: String(r.others ?? ""), dieselGiven: String(r.dieselGiven ?? ""),
            excessDiesel: String(r.excessDiesel ?? ""), dieselAmount: String(r.dieselAmount ?? ""),
            advance: String(r.advance ?? ""), totalExpense: String(r.totalExpense ?? ""),
            ratePerTon: String(r.ratePerTon ?? ""), freight: String(r.freight ?? ""),
          });
        }
        setVehicles(vehiclesRes.data || []);
        setDrivers(driversRes.data || []);
        setLoadingPlants(plantsRes.data || []);
        setDeliveryLocations(locationsRes.data || []);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to load data");
      } finally { setLoading(false); }
    };
    fetchData();
  }, [id]);

  const updateField = (key: string, value: string) => setFormData((p) => ({ ...p, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.month || !formData.year || !formData.vehicleId || !formData.driverId ||
        !formData.loadingPlantId || !formData.deliveryLocationId || !formData.serialNo ||
        !formData.date || !formData.tripId || !formData.tripStartDate || !formData.tripEndDate) {
      toast.error("Please fill required fields");
      return;
    }
    setSubmitting(true);
    try {
      await api.put(`/lpg-tankers/${id}`, {
        month: formData.month, year: formData.year,
        vehicleId: parseInt(formData.vehicleId), serialNo: parseInt(formData.serialNo) || 1,
        date: formData.date, tripId: formData.tripId, driverId: parseInt(formData.driverId),
        loadingPlantId: parseInt(formData.loadingPlantId),
        deliveryLocationId: parseInt(formData.deliveryLocationId),
        loadQuantityPerTon: parseFloat(formData.loadQuantityPerTon) || 0,
        km: parseFloat(formData.km) || 0, fastag: parseFloat(formData.fastag) || 0,
        tripStartDate: formData.tripStartDate, tripEndDate: formData.tripEndDate,
        unloadQuantityPerTon: parseFloat(formData.unloadQuantityPerTon) || 0,
        shortage: parseFloat(formData.shortage) || 0, wayExpense: parseFloat(formData.wayExpense) || 0,
        others: parseFloat(formData.others) || 0, dieselGiven: parseFloat(formData.dieselGiven) || 0,
        excessDiesel: parseFloat(formData.excessDiesel) || 0,
        dieselAmount: parseFloat(formData.dieselAmount) || 0,
        advance: parseFloat(formData.advance) || 0, totalExpense: parseFloat(formData.totalExpense) || 0,
        ratePerTon: parseFloat(formData.ratePerTon) || 0, freight: parseFloat(formData.freight) || 0,
      });
      toast.success("LPG tanker updated successfully");
      router.push("/dashboard/lpg-tanker");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update LPG tanker");
    } finally { setSubmitting(false); }
  };

  const numInputProps = { type: "number" as const, step: "0.01" };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-indigo-950">Edit LPG Tanker</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <SectionHeader title="Trip Information" color="indigo" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-5">
            <Select label="Month" options={MONTHS.map((m) => ({ value: m, label: m }))} value={formData.month} onChange={(e) => updateField("month", e.target.value)} placeholder="Select month" required />
            <Select label="Year" options={YEARS.map((y) => ({ value: y, label: y }))} value={formData.year} onChange={(e) => updateField("year", e.target.value)} placeholder="Select year" required />
            <Select label="Vehicle Number" options={vehicles.map((v) => ({ value: String(v.id), label: v.vehicleNumber }))} value={formData.vehicleId} onChange={(e) => updateField("vehicleId", e.target.value)} placeholder="Select vehicle" required />
            <Input label="Serial No" type="number" min={1} value={formData.serialNo} onChange={(e) => updateField("serialNo", e.target.value)} placeholder="Serial number" required />
            <Input label="Date" type="date" value={formData.date} onChange={(e) => updateField("date", e.target.value)} required />
            <Input label="Trip ID" value={formData.tripId} onChange={(e) => updateField("tripId", e.target.value)} placeholder="Trip ID" required />
            <Select label="Driver" options={drivers.map((d) => ({ value: String(d.id), label: d.driverName }))} value={formData.driverId} onChange={(e) => updateField("driverId", e.target.value)} placeholder="Select driver" required />
            <Select label="Loading Plant" options={loadingPlants.map((p) => ({ value: String(p.id), label: p.loadingPlant }))} value={formData.loadingPlantId} onChange={(e) => updateField("loadingPlantId", e.target.value)} placeholder="Select loading plant" required />
            <Select label="Delivery Location" options={deliveryLocations.map((l) => ({ value: String(l.id), label: l.deliveryLocation }))} value={formData.deliveryLocationId} onChange={(e) => updateField("deliveryLocationId", e.target.value)} placeholder="Select delivery location" required />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <SectionHeader title="Load & Trip Details" color="emerald" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-5">
            <Input label="Load Quantity Per Ton" {...numInputProps} value={formData.loadQuantityPerTon} onChange={(e) => updateField("loadQuantityPerTon", e.target.value)} />
            <Input label="KM" {...numInputProps} value={formData.km} onChange={(e) => updateField("km", e.target.value)} />
            <Input label="Fastag" {...numInputProps} value={formData.fastag} onChange={(e) => updateField("fastag", e.target.value)} />
            <Input label="Trip Start Date" type="date" value={formData.tripStartDate} onChange={(e) => updateField("tripStartDate", e.target.value)} required />
            <Input label="Trip End Date" type="date" value={formData.tripEndDate} onChange={(e) => updateField("tripEndDate", e.target.value)} required />
            <Input label="Unload Quantity Per Ton" {...numInputProps} value={formData.unloadQuantityPerTon} onChange={(e) => updateField("unloadQuantityPerTon", e.target.value)} />
            <Input label="Shortage" {...numInputProps} value={formData.shortage} onChange={(e) => updateField("shortage", e.target.value)} />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <SectionHeader title="Financial Details" color="amber" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-5">
            <Input label="Way Expense" {...numInputProps} value={formData.wayExpense} onChange={(e) => updateField("wayExpense", e.target.value)} />
            <Input label="Others" {...numInputProps} value={formData.others} onChange={(e) => updateField("others", e.target.value)} />
            <Input label="Diesel Given" {...numInputProps} value={formData.dieselGiven} onChange={(e) => updateField("dieselGiven", e.target.value)} />
            <Input label="Excess Diesel" {...numInputProps} value={formData.excessDiesel} onChange={(e) => updateField("excessDiesel", e.target.value)} />
            <Input label="Diesel Amount" {...numInputProps} value={formData.dieselAmount} onChange={(e) => updateField("dieselAmount", e.target.value)} />
            <Input label="Advance" {...numInputProps} value={formData.advance} onChange={(e) => updateField("advance", e.target.value)} />
            <Input label="Total Expense" {...numInputProps} value={formData.totalExpense} onChange={(e) => updateField("totalExpense", e.target.value)} />
            <Input label="Rate Per Ton" {...numInputProps} value={formData.ratePerTon} onChange={(e) => updateField("ratePerTon", e.target.value)} />
            <Input label="Freight" {...numInputProps} value={formData.freight} onChange={(e) => updateField("freight", e.target.value)} />
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={() => router.push("/dashboard/lpg-tanker")}>Cancel</Button>
          <Button type="submit" loading={submitting}>Update LPG Tanker</Button>
        </div>
      </form>
    </div>
  );
}
