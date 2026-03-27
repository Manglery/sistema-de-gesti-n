import React, { type ReactNode, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { CommandMenu } from "@/components/command-menu";
import { useAuthStore } from "@/store/use-auth-store";
import { useInventoryStore } from "@/store/use-inventory-store";
import { useOrderStore } from "@/store/use-order-store";
import { cn } from "@/lib/utils";
import { Search, Loader2, UserCircle } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
type AppLayoutProps = {
  children: ReactNode;
  container?: boolean;
  className?: string;
  contentClassName?: string;
};
export function AppLayout({ children, container = true, className, contentClassName }: AppLayoutProps): JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const currentWarehouseId = useAuthStore(s => s.currentWarehouseId);
  const warehouses = useAuthStore(s => s.warehouses);
  const role = useAuthStore(s => s.role);
  const userName = useAuthStore(s => s.userName);
  const logout = useAuthStore(s => s.logout);
  const fetchWarehouses = useAuthStore(s => s.fetchWarehouses);
  const isInvLoading = useInventoryStore(s => s.isLoading);
  const fetchInventory = useInventoryStore(s => s.fetchInventory);
  const isOrdersLoading = useOrderStore(s => s.isLoading);
  const fetchOrders = useOrderStore(s => s.fetchOrders);
  // Auth Guard
  useEffect(() => {
    if (!isAuthenticated && location.pathname !== '/login') {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, navigate, location]);
  // Initial Data Fetching
  useEffect(() => {
    if (isAuthenticated && warehouses.length === 0) {
      fetchWarehouses();
    }
  }, [isAuthenticated, warehouses, fetchWarehouses]);
  // Sync Data on Warehouse Change
  useEffect(() => {
    if (isAuthenticated && currentWarehouseId) {
      fetchInventory(currentWarehouseId);
      fetchOrders(currentWarehouseId);
    }
  }, [isAuthenticated, currentWarehouseId]);
  const activeWarehouse = useMemo(
    () => warehouses.find(w => w.id === currentWarehouseId),
    [warehouses, currentWarehouseId]
  );
  const accentColor = useMemo(
    () => activeWarehouse?.color || 'bg-red-600',
    [activeWarehouse]
  );
  const isSyncing = isInvLoading || isOrdersLoading;
  if (!isAuthenticated && location.pathname !== '/login') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="size-8 text-red-600 animate-spin" />
      </div>
    );
  }
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <CommandMenu />
      <SidebarInset className={cn("relative overflow-hidden flex flex-col bg-slate-50/50", className)}>
        {/* Superior Sync Indicator */}
        <div className={cn(
          "h-0.5 w-full absolute top-0 left-0 right-0 z-50 transition-all duration-700", 
          accentColor,
          isSyncing ? "animate-pulse opacity-100" : "opacity-0"
        )} />
        {/* Top bar */}
        <div className="flex items-center justify-between px-8 h-16 bg-white/60 backdrop-blur-md border-b border-slate-200 z-40 sticky top-0">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="md:hidden" />
            <button 
              className="flex items-center gap-3 px-4 py-2 bg-slate-100/80 hover:bg-slate-200/80 rounded-xl border border-slate-200/50 transition-all text-slate-500 group"
              onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }))}
            >
              <Search className="size-4 group-hover:text-red-600 transition-colors" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Comandos (⌘K)</span>
            </button>
          </div>
          <div className="flex items-center gap-6">
            {isSyncing && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-red-50 rounded-lg border border-red-100">
                <Loader2 className="size-3 text-red-600 animate-spin" />
                <span className="text-[9px] font-black text-red-600 uppercase tracking-widest">Sincronizando</span>
              </div>
            )}
            <div className="hidden lg:flex items-center gap-2 border-r border-slate-200 pr-6 mr-2">
              <div className={cn("size-2 rounded-full", accentColor)} />
              <span className="text-[10px] font-black text-slate-900 uppercase">
                {activeWarehouse?.name || 'Sede no seleccionada'}
              </span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 group">
                  <div className="flex flex-col items-end hidden sm:flex text-right">
                    <span className="text-xs font-black text-slate-900 uppercase tracking-tight leading-none mb-1">{userName}</span>
                    <span className="text-[9px] font-black text-red-600 uppercase tracking-widest leading-none">{role}</span>
                  </div>
                  <div className="size-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform overflow-hidden">
                    <UserCircle className="size-6" />
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 mt-2 rounded-xl p-2 border-slate-200 shadow-xl">
                <DropdownMenuLabel className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-2 py-3">Mi Cuenta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/support')} className="rounded-lg h-10 text-xs font-bold uppercase cursor-pointer">
                  Perfil de Usuario
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/support')} className="rounded-lg h-10 text-xs font-bold uppercase cursor-pointer">
                  Configuración
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => { logout(); navigate('/login'); }}
                  className="rounded-lg h-10 text-xs font-black uppercase text-red-600 hover:bg-red-50 focus:bg-red-50 cursor-pointer"
                >
                  Cerrar Sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <main className={cn(
          "flex-1 flex flex-col",
          container && "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full",
          contentClassName
        )}>
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}