import { type ReactNode, useMemo } from "react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { CommandMenu } from "@/components/command-menu";
import { useAuthStore } from "@/store/use-auth-store";
import { useInventoryStore } from "@/store/use-inventory-store";
import { useOrderStore } from "@/store/use-order-store";
import { cn } from "@/lib/utils";
import { Search, Loader2 } from 'lucide-react';
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
  const isInvLoading = useInventoryStore(s => s.isLoading);
  const isOrdersLoading = useOrderStore(s => s.isLoading);
  const activeWarehouse = useMemo(
    () => warehouses.find(w => w.id === currentWarehouseId),
    [warehouses, currentWarehouseId]
  );
  const accentColor = useMemo(
    () => activeWarehouse?.color || 'bg-red-600',
    [activeWarehouse]
  );
  const isSyncing = isInvLoading || isOrdersLoading;
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <CommandMenu />
      <SidebarInset className={cn("relative overflow-hidden flex flex-col bg-slate-50/50", className)}>
        {/* Superior Branding Sync Bar */}
        <div className={cn(
          "h-1 w-full absolute top-0 left-0 right-0 z-50 transition-all duration-500", 
          accentColor,
          isSyncing && "animate-pulse bg-gradient-to-r from-red-600 via-white/50 to-red-600 bg-[length:200%_100%] animate-shimmer"
        )} />
        {/* Mobile Menu Trigger */}
        <div className="absolute left-4 top-4 z-40 md:hidden">
          <SidebarTrigger className="bg-white/90 backdrop-blur shadow-sm border" />
        </div>
        {/* Floating Context Headers */}
        <div className="hidden md:flex absolute top-1 right-8 h-10 items-center gap-3 z-40">
          {isSyncing && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/80 backdrop-blur-md rounded-b-xl border-x border-b border-slate-200 shadow-sm animate-fade-in">
              <Loader2 className="size-3 text-red-600 animate-spin" />
              <span className="text-[9px] font-black text-red-600 uppercase tracking-[0.2em]">Sync...</span>
            </div>
          )}
          <button 
            className="flex items-center gap-2 px-4 py-1.5 bg-white/80 backdrop-blur-md rounded-b-xl border-x border-b border-slate-200 shadow-sm hover:bg-slate-50 transition-all hover:-translate-y-0.5"
            onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }))}
          >
            <Search className="size-3.5 text-slate-400" />
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">COMANDOS (⌘K)</span>
          </button>
          <div className="flex items-center gap-3 px-4 py-1.5 bg-white/80 backdrop-blur-md rounded-b-xl border-x border-b border-slate-200 shadow-sm">
            <div className="flex items-center gap-1.5 border-r border-slate-100 pr-3">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">ROL:</span>
              <span className="text-[10px] font-black text-red-600 uppercase tracking-tighter">{role}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={cn(
                "size-2 rounded-full ring-4 ring-offset-1 transition-all duration-300", 
                isSyncing ? "bg-red-500 ring-red-100 animate-pulse" : `${accentColor} ring-slate-100`
              )} />
              <span className="text-[10px] font-black text-slate-900 uppercase tracking-tighter">
                {activeWarehouse?.name || 'Cargando...'}
              </span>
            </div>
          </div>
        </div>
        <main className={cn(
          "flex-1 flex flex-col pt-4 pb-16 transition-opacity duration-300",
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