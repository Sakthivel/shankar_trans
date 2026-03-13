"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Fuel,
  Truck,
  Route,
  BarChart3,
  Users,
  CarFront,
  Factory,
  MapPin,
  UserCog,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/lpg-tanker", label: "LPG Tanker", icon: Fuel },
  { href: "/dashboard/contract-vehicle", label: "Contract Vehicle", icon: Truck },
  { href: "/dashboard/road-trip", label: "Road Trip", icon: Route },
  { href: "/dashboard/reports", label: "Reports", icon: BarChart3 },
];

const masterItems = [
  { href: "/dashboard/masters/drivers", label: "Drivers", icon: Users },
  { href: "/dashboard/masters/vehicles", label: "Vehicles", icon: CarFront },
  { href: "/dashboard/masters/plants", label: "Loading Plants", icon: Factory },
  { href: "/dashboard/masters/locations", label: "Delivery Locations", icon: MapPin },
];

export function Sidebar() {
  const pathname = usePathname();
  const { isRole } = useAuth();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-gray-900 text-white flex flex-col">
      <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-800">
        <Truck size={28} className="text-blue-400" />
        <span className="text-lg font-bold tracking-tight">Shankar Trans</span>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          );
        })}

        <div className="pt-4 pb-2">
          <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Master Data
          </p>
        </div>
        {masterItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          );
        })}

        {isRole("OWNER") && (
          <>
            <div className="pt-4 pb-2">
              <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Admin
              </p>
            </div>
            <Link
              href="/dashboard/users"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                pathname === "/dashboard/users"
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <UserCog size={18} />
              Users
            </Link>
          </>
        )}
      </nav>
    </aside>
  );
}
