"use client";

import { useState, useEffect } from "react";
import { BarChart3, Download } from "lucide-react";
import toast from "react-hot-toast";
import { api } from "@/lib/api-client";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { DataTable } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { MONTHS, YEARS } from "@/types";

interface DropdownItem {
  id: number;
  vehicleNumber?: string;
  driverName?: string;
}

export default function ReportsPage() {
  const [type, setType] = useState("lpg-tanker");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [vehicleId, setVehicleId] = useState("");
  const [driverId, setDriverId] = useState("");
  const [data, setData] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(false);
  const [vehicles, setVehicles] = useState<DropdownItem[]>([]);
  const [drivers, setDrivers] = useState<DropdownItem[]>([]);

  useEffect(() => {
    async function fetchDropdowns() {
      try {
        const [v, d] = await Promise.all([
          api.get<{ data: DropdownItem[] }>("/vehicles", { active: "true" }),
          api.get<{ data: DropdownItem[] }>("/drivers", { active: "true" }),
        ]);
        setVehicles(v.data);
        setDrivers(d.data);
      } catch {
        /* silent */
      }
    }
    fetchDropdowns();
  }, []);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = { type };
      if (month) params.month = month;
      if (year) params.year = year;
      if (vehicleId) params.vehicleId = vehicleId;
      if (driverId) params.driverId = driverId;

      const res = await api.get<{ data: Record<string, unknown>[] }>("/reports", params);
      setData(res.data);
      if (res.data.length === 0) toast("No records found for the selected filters");
    } catch {
      toast.error("Failed to generate report");
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (data.length === 0) return;
    const headers = Object.keys(data[0]).filter(k => typeof data[0][k] !== "object");
    const rows = data.map(row =>
      headers.map(h => {
        const val = row[h];
        return typeof val === "string" ? `"${val}"` : String(val ?? "");
      }).join(",")
    );
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `report-${type}-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getColumns = () => {
    const base: { key: string; label: string; render?: (r: Record<string, unknown>) => React.ReactNode }[] = [
      { key: "sno", label: "S.No", render: (_: Record<string, unknown>) => data.indexOf(_) + 1 },
      { key: "month", label: "Month" },
      { key: "year", label: "Year" },
      { key: "vehicle", label: "Vehicle", render: (r: Record<string, unknown>) => {
        const v = r.vehicle as { vehicleNumber?: string } | undefined;
        return v?.vehicleNumber ?? "";
      }},
      { key: "driver", label: "Driver", render: (r: Record<string, unknown>) => {
        const d = r.driver as { driverName?: string } | undefined;
        return d?.driverName ?? "";
      }},
      { key: "tripId", label: "Trip ID" },
      { key: "date", label: "Date", render: (r: Record<string, unknown>) =>
        r.date ? new Date(r.date as string).toLocaleDateString() : ""
      },
    ];

    if (type === "lpg-tanker") {
      base.push(
        { key: "loadQuantityPerTon", label: "Load Qty" },
        { key: "freight", label: "Freight" },
        { key: "totalExpense", label: "Total Expense" },
      );
    } else if (type === "contract-vehicle") {
      base.push(
        { key: "shift", label: "Shift" },
        { key: "startKm", label: "Start KM" },
        { key: "runningKm", label: "Running KM" },
      );
    } else {
      base.push(
        { key: "gcNo", label: "GC No" },
        { key: "quantity", label: "Quantity" },
        { key: "unloadQuantity", label: "Unload Qty" },
      );
    }

    base.push({
      key: "approved",
      label: "Approved",
      render: (r: Record<string, unknown>) => (
        <Badge variant={r.approved ? "success" : "warning"}>
          {r.approved ? "Yes" : "No"}
        </Badge>
      ),
    });

    return base;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <BarChart3 size={28} className="text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-900">Reports</h2>
      </div>

      <div className="bg-white rounded-xl border shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Select
            label="Report Type"
            value={type}
            onChange={(e) => { setType(e.target.value); setData([]); }}
            options={[
              { value: "lpg-tanker", label: "LPG Tanker" },
              { value: "contract-vehicle", label: "Contract Vehicle" },
              { value: "road-trip", label: "Road Trip" },
            ]}
          />
          <Select
            label="Month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            options={MONTHS.map((m) => ({ value: m, label: m }))}
            placeholder="All Months"
          />
          <Select
            label="Year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            options={YEARS.map((y) => ({ value: y, label: y }))}
            placeholder="All Years"
          />
          <Select
            label="Vehicle"
            value={vehicleId}
            onChange={(e) => setVehicleId(e.target.value)}
            options={vehicles.map((v) => ({ value: v.id, label: v.vehicleNumber! }))}
            placeholder="All Vehicles"
          />
          <Select
            label="Driver"
            value={driverId}
            onChange={(e) => setDriverId(e.target.value)}
            options={drivers.map((d) => ({ value: d.id, label: d.driverName! }))}
            placeholder="All Drivers"
          />
        </div>
        <div className="flex gap-3 mt-6">
          <Button onClick={handleGenerate} loading={loading}>
            Generate Report
          </Button>
          {data.length > 0 && (
            <Button variant="secondary" onClick={handleExportCSV}>
              <Download size={16} className="mr-2" />
              Export CSV
            </Button>
          )}
        </div>
      </div>

      {data.length > 0 && (
        <DataTable columns={getColumns()} data={data} />
      )}
    </div>
  );
}
