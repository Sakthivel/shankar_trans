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
  gcNo: "",
  driverId: "",
  loadingPlantId: "",
  deliveryLocationId: "",
  quantity: "",
  tripStartDate: "",
  tripStartTime: "",
  tripEndDate: "",
  tripEndTime: "",
  unloadQuantity: "",
  shortage: "",
  startKm: "",
  closeKm: "",
  runningKm: "",
  haltingDaysWithTime: "",
  gcReceivedStatus: "",
  remarks: "",
  docUploadUrl: "",
};

const GC_RECEIVED_OPTIONS = [
  { value: "true", label: "Yes" },
  { value: "false", label: "No" },
];

export default function AddRoadTripPage() {
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
      !formData.gcNo ||
      !formData.tripStartDate ||
      !formData.tripStartTime ||
      !formData.tripEndDate ||
      !formData.tripEndTime ||
      formData.gcReceivedStatus === ""
    ) {
      toast.error("Please fill required fields");
      return;
    }
    setSubmitting(true);
    try {
      await api.post("/road-trips", {
        month: formData.month,
        year: formData.year,
        vehicleId: parseInt(formData.vehicleId),
        serialNo: parseInt(formData.serialNo) || 1,
        date: formData.date,
        tripId: formData.tripId,
        gcNo: formData.gcNo,
        driverId: parseInt(formData.driverId),
        loadingPlantId: parseInt(formData.loadingPlantId),
        deliveryLocationId: parseInt(formData.deliveryLocationId),
        quantity: parseFloat(formData.quantity) || 0,
        tripStartDate: formData.tripStartDate,
        tripStartTime: formData.tripStartTime,
        tripEndDate: formData.tripEndDate,
        tripEndTime: formData.tripEndTime,
        unloadQuantity: parseFloat(formData.unloadQuantity) || 0,
        shortage: parseFloat(formData.shortage) || 0,
        startKm: parseFloat(formData.startKm) || 0,
        closeKm: parseFloat(formData.closeKm) || 0,
        runningKm: parseFloat(formData.runningKm) || 0,
        haltingDaysWithTime: formData.haltingDaysWithTime || "",
        gcReceivedStatus: formData.gcReceivedStatus === "true",
        remarks: formData.remarks || undefined,
        docUploadUrl: formData.docUploadUrl || undefined,
      });
      toast.success("Road trip added successfully");
      router.push("/dashboard/road-trip");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to add road trip");
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
      <h1 className="text-2xl font-bold text-indigo-950">Add Road Trip</h1>

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
          <Input
            label="GC No"
            value={formData.gcNo}
            onChange={(e) => updateField("gcNo", e.target.value)}
            placeholder="GC No"
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
            label="Quantity"
            {...numInputProps}
            value={formData.quantity}
            onChange={(e) => updateField("quantity", e.target.value)}
          />
          <Input
            label="Trip Start Date"
            type="date"
            value={formData.tripStartDate}
            onChange={(e) => updateField("tripStartDate", e.target.value)}
            required
          />
          <Input
            label="Trip Start Time"
            type="time"
            value={formData.tripStartTime}
            onChange={(e) => updateField("tripStartTime", e.target.value)}
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
            label="Trip End Time"
            type="time"
            value={formData.tripEndTime}
            onChange={(e) => updateField("tripEndTime", e.target.value)}
            required
          />
          <Input
            label="Unload Quantity"
            {...numInputProps}
            value={formData.unloadQuantity}
            onChange={(e) => updateField("unloadQuantity", e.target.value)}
          />
          <Input
            label="Shortage"
            {...numInputProps}
            value={formData.shortage}
            onChange={(e) => updateField("shortage", e.target.value)}
          />
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
            label="Halting Days With Time"
            value={formData.haltingDaysWithTime}
            onChange={(e) => updateField("haltingDaysWithTime", e.target.value)}
            placeholder="Halting days with time"
          />
          <Select
            label="GC Received Status"
            options={GC_RECEIVED_OPTIONS}
            value={formData.gcReceivedStatus}
            onChange={(e) => updateField("gcReceivedStatus", e.target.value)}
            placeholder="Select"
            required
          />
          <div className="lg:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
            <textarea
              value={formData.remarks}
              onChange={(e) => updateField("remarks", e.target.value)}
              placeholder="Remarks"
              rows={3}
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="lg:col-span-3">
            <Input
              label="Doc Upload (URL)"
              value={formData.docUploadUrl}
              onChange={(e) => updateField("docUploadUrl", e.target.value)}
              placeholder="Document URL (placeholder)"
            />
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push("/dashboard/road-trip")}
          >
            Cancel
          </Button>
          <Button type="submit" loading={submitting}>
            Add Road Trip
          </Button>
        </div>
      </form>
    </div>
  );
}
