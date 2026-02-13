import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { useIsPWA } from "@/hooks/usePWA";
import Navbar from "./components/Navbar";
import PWANavbar from "./components/PWANavbar";
import MobileBottomNav from "./components/MobileBottomNav";
import Footer from "./components/Footer";
import Auth from "./pages/Auth";
import ParentDashboard from "./pages/ParentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import SchoolDashboard from "./pages/SchoolDashboard";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1 } },
});

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" /></div>;
  if (!user) return <Navigate to="/auth" replace />;
  return <>{children}</>;
};

const AppContent = () => {
  const isPWA = useIsPWA();
  const { user } = useAuth();

  return (
    <>
      {isPWA ? <PWANavbar /> : <Navbar />}
      <main className={`min-h-screen ${isPWA ? "pb-20" : ""}`}>
        <Routes>
          <Route path="/auth" element={user ? <Navigate to="/dashboard" replace /> : <Auth />} />
          <Route path="/dashboard" element={<ProtectedRoute><ParentDashboard /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/school" element={<ProtectedRoute><SchoolDashboard /></ProtectedRoute>} />
          <Route path="/register" element={<ProtectedRoute><Register /></ProtectedRoute>} />
          <Route path="/" element={<Navigate to={user ? "/dashboard" : "/auth"} replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {isPWA ? <MobileBottomNav /> : <Footer />}
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
