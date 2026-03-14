"use client";

import { useRouter } from "next/navigation";
import { LogOut, Menu, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/ui/Badge";

interface HeaderProps {
  onMenuToggle: () => void;
}

export function Header({ onMenuToggle }: HeaderProps) {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-indigo-100 bg-white px-4 sm:px-6 shadow-sm">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-lg text-indigo-600 hover:bg-indigo-50 transition-colors"
          aria-label="Toggle menu"
        >
          <Menu size={22} />
        </button>
        <h1 className="text-lg font-semibold text-indigo-950 truncate">
          Shankar Transport Management
        </h1>
      </div>
      <div className="flex items-center gap-3">
        {user && (
          <>
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                <User size={16} className="text-indigo-600" />
              </div>
              <span className="text-sm font-medium text-indigo-900">{user.name}</span>
              <Badge variant={user.role === "OWNER" ? "danger" : user.role === "MANAGER" ? "warning" : "info"}>
                {user.role}
              </Badge>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-indigo-600 hover:bg-indigo-50 transition-colors"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </>
        )}
      </div>
    </header>
  );
}
