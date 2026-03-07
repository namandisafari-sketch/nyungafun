import { useLocation, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const routeTitles: Record<string, string> = {
  "/": "Kabejja V1.00",
  "/register": "New Application",
  "/auth": "Sign In",
  "/dashboard": "My Dashboard",
  "/admin": "Admin",
  "/school": "School Portal",
};

const PWANavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const title = routeTitles[location.pathname] || "God's Will";

  return (
    <header className="sticky top-0 z-50 bg-primary text-primary-foreground safe-area-top">
      <div className="flex items-center justify-between h-12 px-4">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
          <div className="w-7 h-7 rounded bg-primary-foreground/20 flex items-center justify-center">
            <span className="font-display text-xs font-bold">KB</span>
          </div>
          <span className="font-display text-sm font-bold truncate">{title}</span>
        </div>
        {user && (
          <button onClick={signOut} className="p-2 rounded-full hover:bg-primary-foreground/10 transition-colors">
            <LogOut size={18} />
          </button>
        )}
      </div>
    </header>
  );
};

export default PWANavbar;
