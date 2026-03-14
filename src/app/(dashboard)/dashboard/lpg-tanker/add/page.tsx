"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { api } from "@/lib/api-client";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { MONTHS, YEARS } from "@/types";

interface Vehicle {
  id: number;
  vehicleNumber: string;
}

interface Driver {
  id: number;
  driverName: string;
}

interface LoadingPlant {
  id: number;
  loadingPlant: string;
}

interface DeliveryLocation {
  id: number;
  deliveryLocation: string;
}

const initialFormData = {
  month: "",
  year: "",
  vehicleId: "",
  serialNo: "",
  date: "",
  tripId: "",
  driverId: "",
  loadingPlantId: "",
  deliveryLocationId: "",
  loadQuantityPerTon: "",
  km: "",
  fastag: "",
  tripStartDate: "",
  tripEndDate: "",
  unloadQuantityPerTon: "",
  shortage: "",
  wayExpense: "",
  others: "",
  dieselGiven: "",
  excessDiesel: "",
  dieselAmount: "",
  advance: "",
  totalExpense: "",
  ratePerTon: "",
  freight: "",
};

export default function AddLpgTankerPage() {
  const router = useRouter();
  const [formData, setFormData] = useState(initialFormData);
  const [submitting, setSubmitting] = useState(false);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loadingPlants, setLoadingPlants] = useState<LoadingPlant[]>([]);
  const [deliveryLocations, setDeliveryLocations] = useState<DeliveryLocation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const [vehiclesRes, driversRes, plantsRes, locationsRes] = await Promise.all([
          api.get<{ success: boolean; data: Vehicle[] }>("/vehicles", { active: "true" }),
          api.get<{ success: boolean; data: Driver[] }>("/drivers", { active: "true" }),
          api.get<{ success: boolean; data: LoadingPlant[] }>("/loading-plants", { active: "true" }),
          api.get<{ success: boolean; data: DeliveryLocation[] }>("/delivery-locations", { active: "true" }),
        ]);
        setVehicles(vehiclesRes.data || []);
        setDrivers(driversRes.data || []);
        setLoadingPlants(plantsRes.data || []);
        setDeliveryLocations(locationsRes.data || []);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to load dropdowns");
      } finally {
        setLoading(false);
      }
    };
    fetchDropdowns();
  }, []);

  const updateField = (key: string, value: string) => {
    setFormData((p) => ({ ...p, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.month ||
      !formData.year ||
      !formData.vehicleId ||
      !formData.driverId ||
      !formData.loadingPlantId ||
      !formData.deliveryLocationId ||
      !formData.serialNo ||
      !formData.date ||
      !formData.tripId ||
      !formData.tripStartDate ||
      !formData.tripEndDate
    ) {
      toast.error("Please fill required fields");
      return;
    }
    setSubmitting(true);
    try {
      await api.post("/lpg-tankers", {
        month: formData.month,
        year: formData.year,
        vehicleId: parseInt(formData.vehicleId),
        serialNo: parseInt(formData.serialNo) || 1,
        date: formData.date,
        tripId: formData.tripId,
        driverId: parseInt(formData.driverId),
        loadingPlantId: parseInt(formData.loadingPlantId),
        deliveryLocationId: parseInt(formData.deliveryLocationId),
        loadQuantityPerTon: parseFloat(formData.loadQuantityPerTon) || 0,
        km: parseFloat(formData.km) || 0,
        fastag: parseFloat(formData.fastag) || 0,
        tripStartDate: formData.tripStartDate,
        tripEndDate: formData.tripEndDate,
        unloadQuantityPerTon: parseFloat(formData.unloadQuantityPerTon) || 0,
        shortage: parseFloat(formData.shortage) || 0,
        wayExpense: parseFloat(formData.wayExpense) || 0,
        others: parseFloat(formData.others) || 0,
        dieselGiven: parseFloat(formData.dieselGiven) || 0,
        excessDiesel: parseFloat(formData.excessDiesel) || 0,
        dieselAmount: parseFloat(formData.dieselAmount) || 0,
        advance: parseFloat(formData.advance) || 0,
        totalExpense: parseFloat(formData.totalExpense) || 0,
        ratePerTon: parseFloat(formData.ratePerTon) || 0,
        freight: parseFloat(formData.freight) || 0,
      });
      toast.success("LPG tanker added successfully");
      router.push("/dashboard/lpg-tanker");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to add LPG tanker");
    } finally {
      setSubmitting(false);
    }
  };

  const numInputProps = { type: "number" as const, step: "0.01" };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-indigo-950">Add LPG Tanker</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Select
            label="Month"
            options={MONTHS.map((m, i) => ({ value: m, label: m }))}
            value={formData.month}
            onChange={(e) => updateField("month", e.target.value)}
            placeholder="Select month"
            required
          />
          <Select
            label="Year"
            options={YEARS.map((y) => ({ value: y, label: y }))}
            value={formData.year}
            onChange={(e) => updateField("year", e.target.value)}
            placeholder="Select year"
            required
          />
          <Select
            label="Vehicle Number"
            options={vehicles.map((v) => ({ value: String(v.id), label: v.vehicleNumber }))}
            value={formData.vehicleId}
            onChange={(e) => updateField("vehicleId", e.target.value)}
            placeholder="Select vehicle"
            required
          />
          <Input
            label="Serial No"
            type="number"
            min={1}
            value={formData.serialNo}
            onChange={(e) => updateField("serialNo", e.target.value)}
            placeholder="Serial number"
            required
          />
          <Input
            label="Date"
            type="date"
            value={formData.date}
            onChange={(e) => updateField("date", e.target.value)}
            required
          />
          <Input
            label="Trip ID"
            value={formData.tripId}
            onChange={(e) => updateField("tripId", e.target.value)}
            placeholder="Trip ID"
            required
          />
          <Select
            label="Driver"
            options={drivers.map((d) => ({ value: String(d.id), label: d.driverName }))}
            value={formData.driverId}
            onChange={(e) => updateField("driverId", e.target.value)}
            placeholder="Select driver"
            required
          />
          <Select
            label="Loading Plant"
            options={loadingPlants.map((p) => ({ value: String(p.id), label: p.loadingPlant }))}
            value={formData.loadingPlantId}
            onChange={(e) => updateField("loadingPlantId", e.target.value)}
            placeholder="Select loading plant"
            required
          />
          <Select
            label="Delivery Location"
            options={deliveryLocations.map((l) => ({ value: String(l.id), label: l.deliveryLocation }))}
            value={formData.deliveryLocationId}
            onChange={(e) => updateField("deliveryLocationId", e.target.value)}
            placeholder="Select delivery location"
            required
          />
          <Input
            label="Load Quantity Per Ton"
            {...numInputProps}
            value={formData.loadQuantityPerTon}
            onChange={(e) => updateField("loadQuantityPerTon", e.target.value)}
          />
          <Input
            label="KM"
            {...numInputProps}
            value={formData.km}
            onChange={(e) => updateField("km", e.target.value)}
          />
          <Input
            label="Fastag"
            {...numInputProps}
            value={formData.fastag}
            onChange={(e) => updateField("fastag", e.target.value)}
          />
          <Input
            label="Trip Start Date"
            type="date"
            value={formData.tripStartDate}
            onChange={(e) => updateField("tripStartDate", e.target.value)}
            required
          />
          <Input
            label="Trip End Date"
            type="date"
            value={formData.tripEndDate}
            onChange={(e) => updateField("tripEndDate", e.target.value)}
            required
          />
          <Input
            label="Unload Quantity Per Ton"
            {...numInputProps}
            value={formData.unloadQuantityPerTon}
            onChange={(e) => updateField("unloadQuantityPerTon", e.target.value)}
          />
          <Input
            label="Shortage"
            {...numInputProps}
            value={formData.shortage}
            onChange={(e) => updateField("shortage", e.target.value)}
          />
          <Input
            label="Way Expense"
            {...numInputProps}
            value={formData.wayExpense}
            onChange={(e) => updateField("wayExpense", e.target.value)}
          />
          <Input
            label="Others"
            {...numInputProps}
            value={formData.others}
            onChange={(e) => updateField("others", e.target.value)}
          />
          <Input
            label="Diesel Given"
            {...numInputProps}
            value={formData.dieselGiven}
            onChange={(e) => updateField("dieselGiven", e.target.value)}
          />
          <Input
            label="Excess Diesel"
            {...numInputProps}
            value={formData.excessDiesel}
            onChange={(e) => updateField("excessDiesel", e.target.value)}
          />
          <Input
            label="Diesel Amount"
            {...numInputProps}
            value={formData.dieselAmount}
            onChange={(e) => updateField("dieselAmount", e.target.value)}
          />
          <Input
            label="Advance"
            {...numInputProps}
            value={formData.advance}
            onChange={(e) => updateField("advance", e.target.value)}
          />
          <Input
            label="Total Expense"
            {...numInputProps}
            value={formData.totalExpense}
            onChange={(e) => updateField("totalExpense", e.target.value)}
          />
          <Input
            label="Rate Per Ton"
            {...numInputProps}
            value={formData.ratePerTon}
            onChange={(e) => updateField("ratePerTon", e.target.value)}
          />
          <Input
            label="Freight"
            {...numInputProps}
            value={formData.freight}
            onChange={(e) => updateField("freight", e.target.value)}
          />
        </div>

        <div className="flex gap-2 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push("/dashboard/lpg-tanker")}
          >
            Cancel
          </Button>
          <Button type="submit" loading={submitting}>
            Add LPG Tanker
          </Button>
        </div>
      </form>
    </div>
  );
}
