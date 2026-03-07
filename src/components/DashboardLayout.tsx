import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import dataCentreBg from "@/assets/data-centre-bg.png";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full relative">
        {/* Background watermark */}
        <div
          className="fixed inset-0 z-0 pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage: `url(${dataCentreBg})`,
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "40%",
          }}
        />
        <AppSidebar />
        <main className="flex-1 flex flex-col relative z-[1]">
          <header className="h-14 border-b border-border flex items-center px-4 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
            <SidebarTrigger className="mr-4" />
            <h2 className="font-sans text-sm font-medium text-muted-foreground">Kabejja V1.00 — Data Management System</h2>
          </header>
          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
