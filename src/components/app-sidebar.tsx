import React from 'react';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Truck, 
  Package, 
  Repeat, 
  BarChart3, 
  Settings,
  LogOut,
  User
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
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
const menuItems = [
  { title: "Dashboard", icon: LayoutDashboard, active: true },
  { title: "Nuevo Pedido", icon: PlusCircle },
  { title: "Despachar Pedido", icon: Truck },
  { title: "Inventario", icon: Package },
  { title: "Movimientos", icon: Repeat },
  { title: "Reportes", icon: BarChart3 },
];
export function AppSidebar(): JSX.Element {
  return (
    <Sidebar className="border-r border-border bg-white">
      <SidebarHeader className="h-20 flex items-center justify-center border-b">
        <div className="flex items-center gap-2 px-4 w-full">
          <div className="h-10 w-10 rounded-lg bg-red-600 flex items-center justify-center text-white font-bold text-xl">
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-foreground">ACCIONA</span>
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Logistics WMS</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="py-6">
        <SidebarGroup>
          <SidebarMenu className="gap-2 px-2">
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton 
                  asChild 
                  isActive={item.active}
                  className={cn(
                    "h-11 px-4 transition-colors font-medium",
                    item.active 
                      ? "bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700" 
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  <a href="#" className="flex items-center gap-3">
                    <item.icon className={cn("size-5", item.active ? "text-red-600" : "text-slate-400")} />
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarSeparator className="my-4 mx-4 opacity-50" />
        <SidebarGroup>
          <SidebarMenu className="px-2">
            <SidebarMenuItem>
              <SidebarMenuButton asChild className="h-11 px-4 text-slate-600 hover:bg-slate-50 font-medium">
                <a href="#" className="flex items-center gap-3">
                  <Settings className="size-5 text-slate-400" />
                  <span>Configuración</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t bg-slate-50/50">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="size-9 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden">
            <User className="size-5 text-slate-500" />
          </div>
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-sm font-semibold text-foreground truncate">Admin Usuario</span>
            <span className="text-[11px] text-muted-foreground truncate font-medium uppercase">Administrador</span>
          </div>
          <button className="text-slate-400 hover:text-red-600 transition-colors">
            <LogOut className="size-4" />
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}