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
    <nav className="flex sm:justify-between items-center mb-4 glass-panel px-2 sm:px-8 py-4 rounded-2xl flex-wrap justify-center w-full gap-8">
      <div className="flex items-center gap-3">
        <Logo className="w-8 h-8 text-accent" />
        <h1 className="text-lg sm:text-xl font-bold text-primary tracking-tight">
          FlopNop
        </h1>
      </div>
      <div className="flex items-center gap-6 flex-wrap justify-center sm:justify-end">
        <div className="text-right">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-muted" />
            <p className="text-[9px] sm:text-xs font-bold uppercase tracking-widest text-muted">
              Identity
            </p>
          </div>
          <p className="text-xs sm:text-sm font-medium text-primary mt-1">
            {userId}
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-[9px] sm:text-xs font-bold uppercase tracking-widest text-red-400 hover:text-red-300 transition-colors"
        >
          <span className="flex items-center gap-2">
            Logout <IconLogout className="w-3 h-3 sm:w-4 sm:h-4" />
          </span>
        </button>
      </div>
    </nav>
  );
};

export default Topbar;
