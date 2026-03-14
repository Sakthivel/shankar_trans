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
  X,
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

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { isRole } = useAuth();

  const handleNavClick = () => {
    onClose();
  };

  const navContent = (
    <>
      <div className="flex items-center justify-between px-6 py-5 border-b border-indigo-800/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-400 flex items-center justify-center">
            <Truck size={20} className="text-indigo-950" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white">Shankar Trans</span>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden p-1 rounded-md text-indigo-300 hover:text-white hover:bg-indigo-800 transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={handleNavClick}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                active
                  ? "bg-amber-400 text-indigo-950 shadow-md shadow-amber-400/20"
                  : "text-indigo-200 hover:bg-indigo-800/60 hover:text-white"
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          );
        })}

        <div className="pt-5 pb-2">
          <p className="px-3 text-[11px] font-semibold text-indigo-400 uppercase tracking-widest">
            Master Data
          </p>
        </div>
        {masterItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={handleNavClick}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                active
                  ? "bg-amber-400 text-indigo-950 shadow-md shadow-amber-400/20"
                  : "text-indigo-200 hover:bg-indigo-800/60 hover:text-white"
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          );
        })}

        {isRole("OWNER") && (
          <>
            <div className="pt-5 pb-2">
              <p className="px-3 text-[11px] font-semibold text-indigo-400 uppercase tracking-widest">
                Admin
              </p>
            </div>
            <Link
              href="/dashboard/users"
              onClick={handleNavClick}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                pathname === "/dashboard/users"
                  ? "bg-amber-400 text-indigo-950 shadow-md shadow-amber-400/20"
                  : "text-indigo-200 hover:bg-indigo-800/60 hover:text-white"
              }`}
            >
              <UserCog size={18} />
              Users
            </Link>
          </>
        )}
      </nav>
    </>
  );

  return (
    <>
      <aside className="hidden lg:flex fixed left-0 top-0 z-40 h-screen w-64 bg-gradient-to-b from-indigo-950 via-indigo-900 to-indigo-950 text-white flex-col">
        {navContent}
      </aside>

      {open && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50 transition-opacity"
          onClick={onClose}
        />
      )}

      <aside
        className={`lg:hidden fixed top-0 left-0 z-50 h-screen bg-gradient-to-b from-indigo-950 via-indigo-900 to-indigo-950 text-white flex flex-col transition-transform duration-300 ease-in-out w-full max-[580px]:w-full min-[580px]:w-1/2 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {navContent}
      </aside>
    </>
  );
}
