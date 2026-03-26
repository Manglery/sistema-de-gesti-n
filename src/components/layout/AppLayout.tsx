import { type ReactNode, useEffect, useMemo, useState } from "react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { CommandMenu } from "@/components/command-menu";
import { useAuthStore } from "@/store/use-auth-store";
import { useInventoryStore } from "@/store/use-inventory-store";
import { useOrderStore } from "@/store/use-order-store";
import { cn } from "@/lib/utils";
import { useLocation } from 'react-router-dom';
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
  const location = useLocation();
  const isSyncing = isInvLoading || isOrdersLoading;
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <CommandMenu />
      <SidebarInset className={cn("relative overflow-hidden flex flex-col", className)}>
        {/* Superior sync accent bar */}
        <div className={cn(
          "h-1.5 w-full absolute top-0 left-0 right-0 z-50 transition-all duration-500", 
          accentColor,
          isSyncing && "animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.5)] bg-gradient-to-r from-red-600 via-red-400 to-red-600 bg-[length:200%_100%] animate-shimmer"
        )} />
        {/* Mobile Menu Trigger */}
        <div className="absolute left-4 top-4 z-40 md:hidden">
          <SidebarTrigger />
        </div>
        {/* Floating Context Headers */}
        <div className="hidden md:flex absolute top-1.5 right-8 h-10 items-center gap-4 z-40">
          {isSyncing && (
            <div className="flex items-center gap-2 px-3 py-1 bg-white/90 backdrop-blur rounded-b-lg border-x border-b border-slate-200 shadow-sm animate-fade-in">
              <Loader2 className="size-3 text-red-600 animate-spin" />
              <span className="text-[9px] font-black text-red-600 uppercase tracking-widest">Sincronizando...</span>
            </div>
          )}
          <button 
            className="flex items-center gap-2 px-3 py-1 bg-white/90 backdrop-blur rounded-b-lg border-x border-b border-slate-200 shadow-sm hover:bg-slate-50 transition-colors"
            onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }))}
          >
            <Search className="size-3 text-slate-400" />
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">BUSCAR (⌘K)</span>
          </button>
          <div className="flex items-center gap-2 px-3 py-1 bg-white/90 backdrop-blur rounded-b-lg border-x border-b border-slate-200 shadow-sm">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">PERFIL:</span>
            <span className="text-[10px] font-black text-red-600 uppercase tracking-tight">{role}</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-white/90 backdrop-blur rounded-b-lg border-x border-b border-slate-200 shadow-sm">
            <div className={cn(
              "size-2 rounded-full transition-all duration-300", 
              isSyncing ? "bg-red-500 animate-pulse" : accentColor
            )} />
            <span className="text-[10px] font-black text-slate-900 uppercase tracking-tight">
              {activeWarehouse?.name || 'Cargando...'}
            </span>
          </div>
        </div>
        <main className={cn(
          "flex-1 flex flex-col pt-8 pb-12 transition-opacity duration-300",
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