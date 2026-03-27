import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, PlusCircle, Truck, Package, Repeat, BarChart3, Undo2, ShoppingCart, 
  Users as UsersIcon, ChevronRight, ShieldCheck, User as UserIcon, Wrench, Building2, LogOut, Loader2 
} from "lucide-react";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/use-auth-store";
import { useInventoryStore } from "@/store/use-inventory-store";
import { toast } from "sonner";
import { useMemo } from 'react';
const allMenuItems = [
  { title: "Dashboard", icon: LayoutDashboard, roles: ['admin', 'almacenero', 'operario'], url: '/' },
  { title: "Nuevo Pedido", icon: PlusCircle, roles: ['admin', 'almacenero', 'operario'], url: '/new' },
  { title: "Despachar", icon: Truck, roles: ['admin', 'almacenero'], url: '/dispatch' },
  { title: "Devoluciones", icon: Undo2, roles: ['admin', 'almacenero'], url: '/returns' },
  { title: "Compras", icon: ShoppingCart, roles: ['admin'], url: '/purchases' },
  { title: "Stock & Kardex", icon: Package, roles: ['admin', 'almacenero'], url: '/inventory' },
  { title: "Reportes", icon: BarChart3, roles: ['admin', 'almacenero'], url: '/reports' },
  { title: "Almacenes", icon: Building2, roles: ['admin'], url: '/warehouses' },
  { title: "Usuarios", icon: UsersIcon, roles: ['admin'], url: '/users' },
];
export function AppSidebar(): JSX.Element {
  const location = useLocation();
  const role = useAuthStore(s => s.role);
  const userName = useAuthStore(s => s.userName);
  const setRole = useAuthStore(s => s.setRole);
  const currentWarehouseId = useAuthStore(s => s.currentWarehouseId);
  const warehouses = useAuthStore(s => s.warehouses);
  const isSyncing = useInventoryStore(s => s.isLoading);
  const activeWarehouse = useMemo(() => 
    warehouses?.find(w => w.id === currentWarehouseId), 
    [warehouses, currentWarehouseId]
  );
  const filteredItems = allMenuItems.filter(item => item.roles.includes(role));
  const handleRoleChange = (newRole: string) => {
    setRole(newRole as any);
    toast.success(`Perfil cambiado a ${newRole.toUpperCase()}`);
  };
  return (
    <Sidebar className="border-r border-slate-200 bg-white dark:bg-zinc-950">
      <SidebarHeader className="h-20 flex flex-col justify-center border-b px-6 bg-slate-50/50">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-xl shadow-red-200 rotate-6 group-hover:rotate-0 transition-transform">
            <Package className="size-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black tracking-tighter text-slate-900 leading-none">ACCIONA</span>
            <span className="text-[9px] uppercase tracking-[0.3em] text-red-600 font-black">Logistics WMS</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="py-6">
        <SidebarGroup>
          <SidebarMenu className="gap-1.5 px-3">
            {filteredItems.map((item) => {
              const isActive = location.pathname === item.url;
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isActive}
                    className={cn(
                      "h-10 px-4 transition-all font-black text-[10px] uppercase tracking-wider",
                      isActive 
                        ? "bg-red-600 text-white shadow-lg shadow-red-100 hover:bg-red-700 hover:text-white" 
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                    )}
                  >
                    <Link to={item.url} className="flex items-center gap-4">
                      <item.icon className={cn("size-4", isActive ? "text-white" : "text-slate-400")} />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
        <div className="mt-auto px-5 mb-6">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 space-y-4 shadow-inner">
            <div className="flex items-center justify-between">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">SIMULADOR DE ROL</p>
              {isSyncing && <Loader2 className="size-3 text-red-600 animate-spin" />}
            </div>
            <div className="grid grid-cols-1 gap-2">
              {[ 
                {id: 'admin', icon: ShieldCheck, label: 'Administrador'}, 
                {id: 'almacenero', icon: Wrench, label: 'Almacenero'}, 
                {id: 'operario', icon: UserIcon, label: 'Operario'} 
              ].map(r => (
                <button 
                  key={r.id} 
                  onClick={() => handleRoleChange(r.id)} 
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-[10px] font-black uppercase transition-all border", 
                    role === r.id 
                      ? "bg-slate-900 text-white border-slate-900 shadow-lg scale-[1.02]" 
                      : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-white shadow-sm"
                  )}
                >
                  <r.icon className="size-3.5" /> {r.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="px-5 mb-4">
          <Link to="/warehouses" className={cn("block rounded-2xl border p-4 transition-all shadow-sm hover:shadow-md", isSyncing ? "border-red-200 bg-red-50/50 animate-pulse" : "border-slate-200 bg-white")}>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">ALMACÉN ACTIVO</p>
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-900 truncate pr-2 uppercase">{activeWarehouse?.name || 'Seleccionar...'}</span>
              <div className="size-6 rounded-lg bg-slate-50 flex items-center justify-center border">
                <ChevronRight className="size-3 text-slate-400" />
              </div>
            </div>
          </Link>
        </div>
      </SidebarContent>
      <SidebarFooter className="p-5 border-t bg-slate-50/80 backdrop-blur-md flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <div className="size-11 rounded-2xl bg-slate-900 flex items-center justify-center text-white font-black text-sm shadow-xl group-hover:scale-105 transition-transform">
            {userName ? userName.charAt(0) : '?'}
          </div>
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-[11px] font-black text-slate-900 truncate uppercase tracking-tight">{userName}</span>
            <span className="text-[9px] text-red-600 font-black uppercase tracking-widest">{role}</span>
          </div>
        </div>
        <button onClick={() => toast.info("Sesión finalizada")} className="flex items-center gap-3 px-4 py-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all text-[10px] font-black uppercase tracking-widest border border-transparent hover:border-red-100">
          <LogOut className="size-4" /> Salir del Sistema
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}