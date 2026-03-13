"use client";

import Link from "next/link";
import { Truck } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      <header className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-8 py-6">
        <div className="flex items-center gap-3">
          <Truck size={32} className="text-blue-400" />
          <span className="text-xl font-bold text-white tracking-tight">
            Shankar Transport
          </span>
        </div>
        <Link href="/login">
          <Button size="lg">Login</Button>
        </Link>
      </header>

      <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
        <div className="max-w-3xl space-y-8">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight">
            Fleet Management
            <span className="block text-blue-400">Made Simple</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Track LPG tankers, contract vehicles, and road trips. Manage your
            transport fleet with real-time data, approvals, and comprehensive
            reports.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/login">
              <Button size="lg">Get Started</Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/30 to-transparent" />
    </div>
  );
}
