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
const allMenuItems = [
  { title: "Dashboard", icon: LayoutDashboard, roles: ['admin', 'almacenero', 'operario'], url: '/' },
  { title: "Nuevo Pedido", icon: PlusCircle, roles: ['admin', 'almacenero', 'operario'], url: '/new' },
  { title: "Despachar", icon: Truck, roles: ['admin', 'almacenero'], url: '/dispatch' },
  { title: "Devoluciones", icon: Undo2, roles: ['admin', 'almacenero'], url: '/returns' },
  { title: "Compras", icon: ShoppingCart, roles: ['admin'], url: '/purchases' },
  { title: "Stock & Kardex", icon: Package, roles: ['admin', 'almacenero'], url: '/inventory' },
  { title: "Movimientos", icon: Repeat, roles: ['admin'], url: '/movements' },
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
  const activeWarehouse = warehouses?.find(w => w.id === currentWarehouseId);
  const filteredItems = allMenuItems.filter(item => item.roles.includes(role));
  const handleRoleChange = (newRole: string) => {
    setRole(newRole);
    toast.success(`Perfil cambiado a ${newRole.toUpperCase()}`);
  };
  return (
    <Sidebar className="border-r border-slate-200 bg-white dark:bg-zinc-950">
      <SidebarHeader className="h-16 flex items-center border-b px-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-red-600 flex items-center justify-center text-white shadow-lg shadow-red-100">
            <Package className="size-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-black tracking-tight text-slate-900 leading-none">ACCIONA</span>
            <span className="text-[9px] uppercase tracking-widest text-slate-400 font-bold">Logistics WMS</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="py-4">
        <SidebarGroup>
          <SidebarMenu className="gap-1 px-2">
            {filteredItems.map((item) => {
              const isActive = location.pathname === item.url;
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isActive}
                    className={cn(
                      "h-9 px-3 transition-colors font-bold text-xs uppercase",
                      isActive 
                        ? "bg-red-50 text-red-600 hover:bg-red-100" 
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                    )}
                  >
                    <Link to={item.url} className="flex items-center gap-3">
                      <item.icon className={cn("size-4", isActive ? "text-red-600" : "text-slate-400")} />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
        <div className="mt-auto px-4 mb-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">PERFILES</p>
              {isSyncing && <Loader2 className="size-3 text-red-600 animate-spin" />}
            </div>
            <div className="flex flex-col gap-1.5">
              {[ {id: 'admin', icon: ShieldCheck, label: 'Admin'}, {id: 'almacenero', icon: Wrench, label: 'Almacenero'}, {id: 'operario', icon: UserIcon, label: 'Operario'} ].map(r => (
                <button key={r.id} onClick={() => handleRoleChange(r.id)} className={cn("flex items-center gap-2 px-2 py-1.5 rounded text-[10px] font-bold uppercase transition-all", role === r.id ? "bg-slate-900 text-white shadow-md" : "bg-white border text-slate-600 hover:bg-slate-100")}>
                  <r.icon className="size-3" /> {r.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="px-4 mb-4">
          <Link to="/warehouses" className={cn("block rounded-xl border p-3 transition-all", isSyncing ? "border-red-200 bg-red-50 animate-pulse" : "border-slate-200 bg-white hover:bg-slate-50")}>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">ALMACÉN ACTIVO</p>
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-900 truncate pr-2 uppercase">{activeWarehouse?.name || 'Seleccione...'}</span>
              <ChevronRight className="size-3.5 text-slate-400" />
            </div>
          </Link>
        </div>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t bg-slate-50/50 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-full bg-slate-900 flex items-center justify-center text-white font-black text-xs shadow-md">
            {userName ? userName.charAt(0) : '?'}
          </div>
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-xs font-black text-slate-900 truncate uppercase">{userName}</span>
            <span className="text-[9px] text-red-600 font-bold uppercase tracking-widest">{role}</span>
          </div>
        </div>
        <button onClick={() => toast.info("Sesión finalizada")} className="flex items-center gap-2 px-3 py-1.5 text-slate-500 hover:text-red-600 transition-colors text-[10px] font-black uppercase tracking-widest">
          <LogOut className="size-3.5" /> Salir del Sistema
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}