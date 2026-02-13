import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { useIsPWA } from "@/hooks/usePWA";
import Navbar from "./components/Navbar";
import PWANavbar from "./components/PWANavbar";
import MobileBottomNav from "./components/MobileBottomNav";
import Footer from "./components/Footer";
import Index from "./pages/Index";
import About from "./pages/About";
import Register from "./pages/Register";
import Auth from "./pages/Auth";
import ParentDashboard from "./pages/ParentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import SchoolDashboard from "./pages/SchoolDashboard";
import Install from "./pages/Install";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1 } },
});

const AppContent = () => {
  const isPWA = useIsPWA();

  return (
    <>
      {isPWA ? <PWANavbar /> : <Navbar />}
      <main className={`min-h-screen ${isPWA ? "pb-20" : ""}`}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/register" element={<Register />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<ParentDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/school" element={<SchoolDashboard />} />
          <Route path="/install" element={<Install />} />
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
