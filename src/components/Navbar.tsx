import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, LayoutDashboard, Shield, School, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, isSchool, signOut } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border shadow-sm">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-display text-lg font-bold">GW</span>
          </div>
          <div className="hidden sm:block leading-tight">
            <span className="font-display text-lg font-bold text-primary block">God's Will</span>
            <span className="text-xs text-muted-foreground">Scholarship Management</span>
          </div>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-5">
          {user ? (
            <>
              <Link to="/dashboard" className={`text-sm font-medium transition-colors hover:text-secondary flex items-center gap-1 ${isActive("/dashboard") ? "text-secondary font-semibold" : "text-foreground"}`}>
                <LayoutDashboard size={16} /> Dashboard
              </Link>
              {isAdmin && (
                <Link to="/admin" className={`text-sm font-medium transition-colors hover:text-secondary flex items-center gap-1 ${isActive("/admin") ? "text-secondary" : "text-foreground"}`}>
                  <Shield size={16} /> Admin
                </Link>
              )}
              {isSchool && (
                <Link to="/school" className={`text-sm font-medium transition-colors hover:text-secondary flex items-center gap-1 ${isActive("/school") ? "text-secondary" : "text-foreground"}`}>
                  <School size={16} /> School Portal
                </Link>
              )}
              <Link to="/register" className={`text-sm font-medium transition-colors hover:text-secondary flex items-center gap-1 ${isActive("/register") ? "text-secondary" : "text-foreground"}`}>
                <FileText size={16} /> New Application
              </Link>
              <Button size="sm" variant="ghost" onClick={signOut} className="gap-1 text-muted-foreground hover:text-foreground">
                <LogOut size={16} /> Sign Out
              </Button>
            </>
          ) : (
            <Link to="/auth">
              <Button size="sm" className="bg-primary text-primary-foreground">Sign In</Button>
            </Link>
          )}
        </div>

        <button className="md:hidden text-foreground" onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-card border-b border-border px-4 pb-4 space-y-3">
          {user ? (
            <>
              <Link to="/dashboard" onClick={() => setOpen(false)} className="block py-2 text-sm font-medium">Dashboard</Link>
              {isAdmin && <Link to="/admin" onClick={() => setOpen(false)} className="block py-2 text-sm font-medium">Admin</Link>}
              {isSchool && <Link to="/school" onClick={() => setOpen(false)} className="block py-2 text-sm font-medium">School Portal</Link>}
              <Link to="/register" onClick={() => setOpen(false)} className="block py-2 text-sm font-medium">New Application</Link>
              <Button variant="ghost" onClick={() => { signOut(); setOpen(false); }} className="w-full justify-start gap-1">
                <LogOut size={16} /> Sign Out
              </Button>
            </>
          ) : (
            <Link to="/auth" onClick={() => setOpen(false)}>
              <Button className="w-full bg-primary text-primary-foreground">Sign In</Button>
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
