import React from 'react';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Truck, 
  Package, 
  Repeat, 
  BarChart3, 
  LogOut,
  Undo2,
  ShoppingCart,
  Database,
  Users as UsersIcon,
  LifeBuoy,
  Globe,
  Moon,
  DatabaseZap,
  ChevronRight,
  ShieldCheck,
  User as UserIcon,
  Wrench
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/use-auth-store";
const allMenuItems = [
  { title: "Dashboard", icon: LayoutDashboard, roles: ['admin', 'almacenero', 'operario'], active: true },
  { title: "Nuevo Pedido", icon: PlusCircle, roles: ['admin', 'almacenero', 'operario'], active: false },
  { title: "Despachar Pedido", icon: Truck, roles: ['admin', 'almacenero'], active: false },
  { title: "Devoluciones", icon: Undo2, roles: ['admin', 'almacenero'], active: false },
  { title: "Compras", icon: ShoppingCart, roles: ['admin'], active: false },
  { title: "Stock & Kardex", icon: Package, roles: ['admin', 'almacenero'], active: false },
  { title: "Movimientos", icon: Repeat, roles: ['admin'], active: false },
  { title: "Reportes", icon: BarChart3, roles: ['admin', 'almacenero'], active: false },
  { title: "Reportes Data", icon: DatabaseZap, roles: ['admin', 'almacenero'], active: false },
  { title: "Tablas Maestras", icon: Database, roles: ['admin'], active: false },
  { title: "Usuarios", icon: UsersIcon, roles: ['admin'], active: false },
];
export function AppSidebar(): JSX.Element {
  const role = useAuthStore(s => s.role);
  const userName = useAuthStore(s => s.userName);
  const setRole = useAuthStore(s => s.setRole);
  const currentWarehouseId = useAuthStore(s => s.currentWarehouseId);
  const warehouses = useAuthStore(s => s.warehouses);
  const activeWarehouse = warehouses.find(w => w.id === currentWarehouseId);
  const filteredItems = allMenuItems.filter(item => item.roles.includes(role));
  return (
    <Sidebar className="border-r border-border bg-white">
      <SidebarHeader className="h-16 flex items-center justify-between border-b px-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-red-600 flex items-center justify-center text-white">
            <Package className="size-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-black tracking-tight text-foreground leading-none">ACCIONA</span>
            <span className="text-[9px] uppercase tracking-widest text-muted-foreground font-semibold">Logistics WMS</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="py-4">
        <SidebarGroup>
          <SidebarMenu className="gap-1 px-2">
            {filteredItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton 
                  asChild 
                  isActive={item.active}
                  className={cn(
                    "h-9 px-3 transition-colors font-bold text-xs uppercase tracking-tight",
                    item.active 
                      ? "bg-red-50 text-red-600 hover:bg-red-100" 
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  <a href="#" className="flex items-center gap-3">
                    <item.icon className={cn("size-4", item.active ? "text-red-600" : "text-slate-400")} />
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        <div className="mt-auto px-4 mb-4">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">SIMULADOR DE PERFIL</p>
            <div className="flex flex-col gap-1.5">
              <button onClick={() => setRole('admin')} className={cn("flex items-center gap-2 px-2 py-1.5 rounded text-[10px] font-bold uppercase transition-colors", role === 'admin' ? "bg-slate-900 text-white" : "bg-white border text-slate-600 hover:bg-slate-100")}>
                <ShieldCheck className="size-3" /> Administrador
              </button>
              <button onClick={() => setRole('almacenero')} className={cn("flex items-center gap-2 px-2 py-1.5 rounded text-[10px] font-bold uppercase transition-colors", role === 'almacenero' ? "bg-slate-900 text-white" : "bg-white border text-slate-600 hover:bg-slate-100")}>
                <Wrench className="size-3" /> Almacenero
              </button>
              <button onClick={() => setRole('operario')} className={cn("flex items-center gap-2 px-2 py-1.5 rounded text-[10px] font-bold uppercase transition-colors", role === 'operario' ? "bg-slate-900 text-white" : "bg-white border text-slate-600 hover:bg-slate-100")}>
                <UserIcon className="size-3" /> Operario
              </button>
            </div>
          </div>
        </div>
        <div className="px-4 mb-4">
          <div className="rounded-lg border border-red-200 bg-red-50 p-2.5">
            <p className="text-[9px] font-black text-red-600 uppercase tracking-widest mb-1">ALMACÉN ACTIVO</p>
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-900 truncate pr-2">{activeWarehouse?.name || 'Sin almacén'}</span>
              <div className="size-4 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <ChevronRight className="size-2.5 text-red-600" />
              </div>
            </div>
          </div>
        </div>
        <SidebarGroup className="pt-0">
          <SidebarMenu className="px-2 gap-1">
            <SidebarMenuItem>
              <SidebarMenuButton asChild className="h-9 px-3 text-slate-600 hover:bg-slate-50 text-xs font-bold">
                <a href="#" className="flex items-center gap-3">
                  <LifeBuoy className="size-4 text-slate-400" />
                  <span>Soporte</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild className="h-9 px-3 text-slate-600 hover:bg-slate-50 text-xs font-bold">
                <a href="#" className="flex items-center gap-3">
                  <Moon className="size-4 text-slate-400" />
                  <span>Modo Oscuro</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-full bg-slate-900 flex items-center justify-center text-white font-black text-xs">
            {userName.charAt(0) || 'U'}
          </div>
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-xs font-black text-slate-900 truncate">{userName}</span>
            <span className="text-[9px] text-red-600 truncate font-bold uppercase tracking-widest">{role}</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}