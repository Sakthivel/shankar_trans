"use client";

import Link from "next/link";
import { Truck } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function HomePage() {
  return (
    <div
      className="relative min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/login-bg.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/50 z-0" />

      <header className="relative z-10 flex items-center justify-between px-8 py-6">
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

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4">
        <div className="max-w-3xl space-y-8">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight">
            Vehicle Management System
            <span className="block text-blue-400">Made Simple</span>
          </h1>
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
