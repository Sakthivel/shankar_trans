"use client";

import { useEffect, useState } from "react";
import { Fuel, Truck, Route, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api-client";

interface Stats {
  lpgTankers: { total: number; pending: number };
  contractVehicles: { total: number; pending: number };
  roadTrips: { total: number; pending: number };
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [lpg, cv, rt] = await Promise.all([
          api.get<{ total: number }>("/lpg-tankers", { page: "1", limit: "1" }),
          api.get<{ total: number }>("/contract-vehicles", { page: "1", limit: "1" }),
          api.get<{ total: number }>("/road-trips", { page: "1", limit: "1" }),
        ]);
        setStats({
          lpgTankers: { total: lpg.total || 0, pending: 0 },
          contractVehicles: { total: cv.total || 0, pending: 0 },
          roadTrips: { total: rt.total || 0, pending: 0 },
        });
      } catch {
        setStats({
          lpgTankers: { total: 0, pending: 0 },
          contractVehicles: { total: 0, pending: 0 },
          roadTrips: { total: 0, pending: 0 },
        });
      }
    }
    fetchStats();
  }, []);

  const cards = [
    {
      title: "LPG Tankers",
      total: stats?.lpgTankers.total ?? 0,
      icon: Fuel,
      color: "bg-orange-500",
      href: "/dashboard/lpg-tanker",
    },
    {
      title: "Contract Vehicles",
      total: stats?.contractVehicles.total ?? 0,
      icon: Truck,
      color: "bg-blue-500",
      href: "/dashboard/contract-vehicle",
    },
    {
      title: "Road Trips",
      total: stats?.roadTrips.total ?? 0,
      icon: Route,
      color: "bg-green-500",
      href: "/dashboard/road-trip",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Welcome, {user?.name}
        </h2>
        <p className="text-gray-500 mt-1">
          Here&apos;s an overview of your transport operations
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card) => (
          <a
            key={card.title}
            href={card.href}
            className="bg-white rounded-xl border shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{card.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{card.total}</p>
              </div>
              <div className={`${card.color} p-3 rounded-xl`}>
                <card.icon size={24} className="text-white" />
              </div>
            </div>
          </a>
        ))}
      </div>

      {user && (user.role === "MANAGER" || user.role === "OWNER") && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle size={20} className="text-green-600" />
              <h3 className="font-semibold text-gray-900">Approval Queue</h3>
            </div>
            <p className="text-sm text-gray-500">
              Review pending entries that require your approval.
            </p>
          </div>
          <div className="bg-white rounded-xl border shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock size={20} className="text-blue-600" />
              <h3 className="font-semibold text-gray-900">Recent Activity</h3>
            </div>
            <p className="text-sm text-gray-500">
              Latest entries and updates across all forms.
            </p>
          </div>
        </div>
      )}

      {user?.role === "OWNER" && (
        <div className="bg-white rounded-xl border shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle size={20} className="text-purple-600" />
            <h3 className="font-semibold text-gray-900">System Overview</h3>
          </div>
          <p className="text-sm text-gray-500">
            Full system access including user management, all approvals, and configuration.
          </p>
        </div>
      )}
    </div>
  );
}
