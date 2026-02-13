import { Link, useLocation } from "react-router-dom";
import { Home, FileText, LayoutDashboard, Shield, School, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const MobileBottomNav = () => {
  const location = useLocation();
  const { user, isAdmin, isSchool } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { to: "/", icon: Home, label: "Home" },
    ...(user
      ? [
          { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
          ...(isAdmin ? [{ to: "/admin", icon: Shield, label: "Admin" }] : []),
          ...(isSchool ? [{ to: "/school", icon: School, label: "School" }] : []),
          { to: "/register", icon: FileText, label: "Apply" },
        ]
      : [
          { to: "/about", icon: User, label: "About" },
          { to: "/auth", icon: LayoutDashboard, label: "Sign In" },
          { to: "/register", icon: FileText, label: "Apply" },
        ]),
  ];

  // Limit to 5 items max
  const displayItems = navItems.slice(0, 5);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-t border-border safe-area-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {displayItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center justify-center gap-0.5 px-2 py-1 rounded-lg transition-colors min-w-[56px] ${
                active
                  ? "text-secondary"
                  : "text-muted-foreground"
              }`}
            >
              <Icon size={20} strokeWidth={active ? 2.5 : 1.5} />
              <span className={`text-[10px] leading-tight ${active ? "font-semibold" : "font-medium"}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
