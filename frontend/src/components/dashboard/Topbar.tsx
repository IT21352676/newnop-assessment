import React from "react";
import { toast } from "react-toastify";
import { useAuthStore } from "../../lib/store";
import { useNavigate } from "react-router-dom";
import Logo from "../ui/Logo";
import { IconLogout } from "@tabler/icons-react";
import { User } from "lucide-react";

const Topbar = () => {
  const { userId, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.info("Logged out successfully");
    navigate("/login");
  };
  return (
    <nav className="flex justify-between items-center mb-4 glass-panel px-8 py-4 rounded-2xl">
      <div className="flex items-center gap-3">
        <Logo className="w-8 h-8 text-accent" />
        <h1 className="text-xl font-bold text-primary tracking-tight">
          FlopNop
        </h1>
      </div>
      <div className="flex items-center gap-6">
        <div className="text-right">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-muted" />
            <p className="text-xs font-bold uppercase tracking-widest text-muted">
              Identity
            </p>
          </div>
          <p className="text-sm font-medium text-primary mt-1">{userId}</p>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-red-400 hover:text-red-300 transition-colors"
        >
          <span className="flex items-center gap-2">
            Logout <IconLogout className="w-4 h-4" />
          </span>
        </button>
      </div>
    </nav>
  );
};

export default Topbar;
