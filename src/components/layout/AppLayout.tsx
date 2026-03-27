import React, { type ReactNode, useMemo } from "react";
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
  container?: boolean; // Defaults to true for consistent spacing
  className?: string;
  contentClassName?: string;
};
export function AppLayout({ children, container = true, className, contentClassName }: AppLayoutProps): JSX.Element {
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
        {/* Superior Sync Indicator */}
        <div className={cn(
          "h-0.5 w-full absolute top-0 left-0 right-0 z-50 transition-all duration-700", 
          accentColor,
          isSyncing && "animate-pulse opacity-100",
          !isSyncing && "opacity-40"
        )} />
        {/* Mobile Menu Trigger */}
        <div className="absolute left-4 top-4 z-40 md:hidden">
          <SidebarTrigger className="bg-white/90 backdrop-blur shadow-sm border" />
        </div>
        {/* Global Context Bar */}
        <div className="hidden md:flex absolute top-0 right-8 h-10 items-center gap-3 z-40">
          {isSyncing && (
            <div className="flex items-center gap-2 px-3 py-1 bg-white/90 backdrop-blur rounded-b-lg border-x border-b border-slate-200 shadow-sm">
              <Loader2 className="size-2.5 text-red-600 animate-spin" />
              <span className="text-[8px] font-black text-red-600 uppercase tracking-widest">Sincronizando...</span>
            </div>
          )}
          <button 
            className="flex items-center gap-2 px-4 py-1.5 bg-white/90 backdrop-blur rounded-b-lg border-x border-b border-slate-200 shadow-sm hover:bg-slate-50 transition-all"
            onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }))}
          >
            <Search className="size-3 text-slate-400" />
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">COMANDOS (⌘K)</span>
          </button>
          <div className="flex items-center gap-3 px-4 py-1.5 bg-white/90 backdrop-blur rounded-b-lg border-x border-b border-slate-200 shadow-sm">
             <div className="flex items-center gap-1.5 border-r border-slate-100 pr-3">
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">PERFIL:</span>
              <span className="text-[9px] font-black text-red-600 uppercase">{role}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={cn("size-1.5 rounded-full", accentColor)} />
              <span className="text-[9px] font-black text-slate-900 uppercase">
                {activeWarehouse?.name || 'Sede no seleccionada'}
              </span>
            </div>
          </div>
        </div>
        <main className={cn(
          "flex-1 flex flex-col py-8 md:py-10 lg:py-12 transition-opacity duration-300",
          isSyncing ? "opacity-95" : "opacity-100",
          container && "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
          contentClassName
        )}>
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}