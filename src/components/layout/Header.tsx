"use client";

import { useRouter } from "next/navigation";
import { LogOut, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/ui/Badge";

export function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white px-6 shadow-sm">
      <h1 className="text-lg font-semibold text-gray-900">
        Shankar Transport Management
      </h1>
      <div className="flex items-center gap-4">
        {user && (
          <>
            <div className="flex items-center gap-2">
              <User size={18} className="text-gray-500" />
              <span className="text-sm font-medium text-gray-700">{user.name}</span>
              <Badge variant={user.role === "OWNER" ? "danger" : user.role === "MANAGER" ? "warning" : "info"}>
                {user.role}
              </Badge>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <LogOut size={16} />
              Logout
            </button>
          </>
        )}
      </div>
    </header>
  );
}
