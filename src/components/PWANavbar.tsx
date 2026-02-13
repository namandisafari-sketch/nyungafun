import { useLocation, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import logo from "@/assets/nyunga-logo.png";

const routeTitles: Record<string, string> = {
  "/": "Nyunga Foundation",
  "/about": "About Us",
  "/register": "Apply",
  "/auth": "Sign In",
  "/dashboard": "My Dashboard",
  "/admin": "Admin",
  "/school": "School Portal",
  "/install": "Install App",
};

const PWANavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const title = routeTitles[location.pathname] || "Nyunga Foundation";

  return (
    <header className="sticky top-0 z-50 bg-primary text-primary-foreground safe-area-top">
      <div className="flex items-center justify-between h-12 px-4">
        <div className="flex items-center gap-2" onClick={() => navigate("/")}>
          <img src={logo} alt="Nyunga" className="h-7 w-auto rounded-sm" />
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
