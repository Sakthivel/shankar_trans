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

const initialFormData = {
  month: "",
  year: "",
  vehicleId: "",
  serialNo: "",
  date: "",
  tripId: "",
  driverId: "",
  workPlace: "",
  shift: "",
  workingDetails: "",
  startKm: "",
  closeKm: "",
  runningKm: "",
  diesel: "",
  mileage: "",
  dieselKm: "",
  dieselDebit: "",
};

const SHIFT_OPTIONS = [
  { value: "DAY", label: "DAY" },
  { value: "NIGHT", label: "NIGHT" },
];

export default function AddContractVehiclePage() {
  const router = useRouter();
  const [formData, setFormData] = useState(initialFormData);
  const [submitting, setSubmitting] = useState(false);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const [vehiclesRes, driversRes] = await Promise.all([
          api.get<{ success: boolean; data: Vehicle[] }>("/vehicles", { active: "true" }),
          api.get<{ success: boolean; data: Driver[] }>("/drivers", { active: "true" }),
        ]);
        setVehicles(vehiclesRes.data || []);
        setDrivers(driversRes.data || []);
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
      !formData.serialNo ||
      !formData.date ||
      !formData.tripId ||
      !formData.workPlace ||
      !formData.shift ||
      !formData.workingDetails
    ) {
      toast.error("Please fill required fields");
      return;
    }
    setSubmitting(true);
    try {
      await api.post("/contract-vehicles", {
        month: formData.month,
        year: formData.year,
        vehicleId: parseInt(formData.vehicleId),
        serialNo: parseInt(formData.serialNo) || 1,
        date: formData.date,
        tripId: formData.tripId,
        driverId: parseInt(formData.driverId),
        workPlace: formData.workPlace,
        shift: formData.shift,
        workingDetails: formData.workingDetails,
        startKm: parseFloat(formData.startKm) || 0,
        closeKm: parseFloat(formData.closeKm) || 0,
        runningKm: parseFloat(formData.runningKm) || 0,
        diesel: parseFloat(formData.diesel) || 0,
        mileage: parseFloat(formData.mileage) || 0,
        dieselKm: parseFloat(formData.dieselKm) || 0,
        dieselDebit: parseFloat(formData.dieselDebit) || 0,
      });
      toast.success("Contract vehicle added successfully");
      router.push("/dashboard/contract-vehicle");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to add contract vehicle");
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
      <h1 className="text-2xl font-bold text-gray-900">Add Contract Vehicle</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Select
            label="Month"
            options={MONTHS.map((m) => ({ value: m, label: m }))}
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
          <Input
            label="Work Place"
            value={formData.workPlace}
            onChange={(e) => updateField("workPlace", e.target.value)}
            placeholder="Work place"
            required
          />
          <Select
            label="Shift"
            options={SHIFT_OPTIONS}
            value={formData.shift}
            onChange={(e) => updateField("shift", e.target.value)}
            placeholder="Select shift"
            required
          />
          <div className="lg:col-span-3">
            <Input
              label="Working Details"
              value={formData.workingDetails}
              onChange={(e) => updateField("workingDetails", e.target.value)}
              placeholder="Working details"
              required
            />
          </div>
          <Input
            label="Start KM"
            {...numInputProps}
            value={formData.startKm}
            onChange={(e) => updateField("startKm", e.target.value)}
          />
          <Input
            label="Close KM"
            {...numInputProps}
            value={formData.closeKm}
            onChange={(e) => updateField("closeKm", e.target.value)}
          />
          <Input
            label="Running KM"
            {...numInputProps}
            value={formData.runningKm}
            onChange={(e) => updateField("runningKm", e.target.value)}
          />
          <Input
            label="Diesel"
            {...numInputProps}
            value={formData.diesel}
            onChange={(e) => updateField("diesel", e.target.value)}
          />
          <Input
            label="Mileage"
            {...numInputProps}
            value={formData.mileage}
            onChange={(e) => updateField("mileage", e.target.value)}
          />
          <Input
            label="Diesel KM"
            {...numInputProps}
            value={formData.dieselKm}
            onChange={(e) => updateField("dieselKm", e.target.value)}
          />
          <Input
            label="Diesel Debit"
            {...numInputProps}
            value={formData.dieselDebit}
            onChange={(e) => updateField("dieselDebit", e.target.value)}
          />
        </div>

        <div className="flex gap-2 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push("/dashboard/contract-vehicle")}
          >
            Cancel
          </Button>
          <Button type="submit" loading={submitting}>
            Add Contract Vehicle
          </Button>
        </div>
      </form>
    </div>
  );
}
