import { type ReactNode, useEffect, useMemo, useState } from "react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { useAuthStore } from "@/store/use-auth-store";
import { cn } from "@/lib/utils";
import { useLocation } from 'react-router-dom';
type AppLayoutProps = {
  children: ReactNode;
  container?: boolean;
  className?: string;
  contentClassName?: string;
};
export function AppLayout({ children, container = false, className, contentClassName }: AppLayoutProps): JSX.Element {
  const currentWarehouseId = useAuthStore(s => s.currentWarehouseId);
  const warehouses = useAuthStore(s => s.warehouses);
  const role = useAuthStore(s => s.role);
  const activeWarehouse = useMemo(
    () => warehouses.find(w => w.id === currentWarehouseId),
    [warehouses, currentWarehouseId]
  );
  const accentColor = useMemo(
    () => activeWarehouse?.color || 'bg-red-600',
    [activeWarehouse]
  );
  const location = useLocation();
  const [isSyncing, setIsSyncing] = useState(false);
  // Show a visual "sync" pulse when warehouse or location changes (simulating API fetch context)
  useEffect(() => {
    setIsSyncing(true);
    const timer = setTimeout(() => setIsSyncing(false), 800);
    return () => clearTimeout(timer);
  }, [currentWarehouseId, location.pathname, setIsSyncing]);
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <SidebarInset className={cn("relative", className)}>
        {/* Warehouse Indicator Bar with Pulse feedback during data fetching */}
        <div className={cn(
          "h-1.5 w-full fixed top-0 left-0 right-0 z-[60] transition-all duration-500", 
          accentColor,
          isSyncing && "animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.5)]"
        )} />
        <div className="absolute left-4 top-4 z-20 md:hidden">
          <SidebarTrigger />
        </div>
        {/* Global Context Banner */}
        <div className="hidden md:flex absolute top-1.5 right-8 h-10 items-center gap-4 z-40">
          <div className="flex items-center gap-2 px-3 py-1 bg-white/90 backdrop-blur rounded-b-lg border-x border-b border-slate-200 shadow-sm">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">PERFIL:</span>
            <span className="text-[10px] font-black text-red-600 uppercase tracking-tight">{role}</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-white/90 backdrop-blur rounded-b-lg border-x border-b border-slate-200 shadow-sm">
            <div className={cn(
              "size-2 rounded-full transition-all duration-300", 
              isSyncing ? "animate-ping bg-red-400" : accentColor
            )} />
            <span className="text-[10px] font-black text-slate-900 uppercase tracking-tight">
              {activeWarehouse?.name}
            </span>
          </div>
        </div>
        <main className={cn(
          "min-h-screen flex flex-col pt-4 transition-opacity duration-300",
          isSyncing ? "opacity-90" : "opacity-100",
          container && "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
          contentClassName
        )}>
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}