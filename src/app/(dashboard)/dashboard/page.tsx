"use client";

import { useEffect, useState } from "react";
import { Fuel, Truck, Route, Clock, CheckCircle, AlertCircle, ArrowRight } from "lucide-react";
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
      gradient: "from-amber-500 to-orange-500",
      iconBg: "bg-amber-600",
      href: "/dashboard/lpg-tanker",
    },
    {
      title: "Contract Vehicles",
      total: stats?.contractVehicles.total ?? 0,
      icon: Truck,
      gradient: "from-indigo-500 to-blue-500",
      iconBg: "bg-indigo-600",
      href: "/dashboard/contract-vehicle",
    },
    {
      title: "Road Trips",
      total: stats?.roadTrips.total ?? 0,
      icon: Route,
      gradient: "from-emerald-500 to-teal-500",
      iconBg: "bg-emerald-600",
      href: "/dashboard/road-trip",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-indigo-950">
          Welcome, {user?.name}
        </h2>
        <p className="text-slate-500 mt-1">
          Here&apos;s an overview of your transport operations
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card) => (
          <a
            key={card.title}
            href={card.href}
            className="group relative overflow-hidden rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
            <div className="relative p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">{card.title}</p>
                  <p className="text-3xl font-bold text-indigo-950 mt-2">{card.total}</p>
                </div>
                <div className={`bg-gradient-to-br ${card.gradient} p-3.5 rounded-xl shadow-lg`}>
                  <card.icon size={24} className="text-white" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-4 text-sm font-medium text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
                View all <ArrowRight size={14} />
              </div>
            </div>
          </a>
        ))}
      </div>

      {user && (user.role === "MANAGER" || user.role === "OWNER") && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                <CheckCircle size={20} className="text-emerald-600" />
              </div>
              <h3 className="font-semibold text-indigo-950">Approval Queue</h3>
            </div>
            <p className="text-sm text-slate-500">
              Review pending entries that require your approval.
            </p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                <Clock size={20} className="text-indigo-600" />
              </div>
              <h3 className="font-semibold text-indigo-950">Recent Activity</h3>
            </div>
            <p className="text-sm text-slate-500">
              Latest entries and updates across all forms.
            </p>
          </div>
        </div>
      )}

      {user?.role === "OWNER" && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <AlertCircle size={20} className="text-purple-600" />
            </div>
            <h3 className="font-semibold text-indigo-950">System Overview</h3>
          </div>
          <p className="text-sm text-slate-500">
            Full system access including user management, all approvals, and configuration.
          </p>
        </div>
      )}
    </div>
  );
}
