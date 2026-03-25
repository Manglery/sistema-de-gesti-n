import { 
  LayoutDashboard, 
  PlusCircle, 
  Truck, 
  Package, 
  Repeat, 
  BarChart3, 
  Settings,
  LogOut,
  User,
  Undo2,
  ShoppingCart,
  Database,
  Users as UsersIcon,
  LifeBuoy,
  Globe,
  Moon,
  DatabaseZap,
  ChevronRight
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
  { title: "Devoluciones", icon: Undo2 },
  { title: "Compras", icon: ShoppingCart },
  { title: "Stock & Kardex", icon: Package },
  { title: "Movimientos", icon: Repeat },
  { title: "Reportes", icon: BarChart3 },
  { title: "Reportes Data", icon: DatabaseZap },
  { title: "Tablas Maestras", icon: Database },
  { title: "Usuarios", icon: UsersIcon },
];
export function AppSidebar(): JSX.Element {
  return (
    <Sidebar className="border-r border-border bg-white">
      <SidebarHeader className="h-16 flex items-center justify-center border-b px-4">
        <div className="flex items-center gap-2 w-full">
          <div className="h-8 w-8 rounded bg-red-600 flex items-center justify-center text-white font-bold text-lg">
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight text-foreground leading-none">ACCIONA</span>
            <span className="text-[9px] uppercase tracking-widest text-muted-foreground font-semibold">Logistics WMS</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="py-4">
        <SidebarGroup>
          <SidebarMenu className="gap-1 px-2">
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton 
                  asChild 
                  isActive={item.active}
                  className={cn(
                    "h-9 px-3 transition-colors font-medium text-sm",
                    item.active 
                      ? "bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700" 
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
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
        <SidebarSeparator className="my-4 mx-4 opacity-50" />
        <div className="px-4 mb-4">
          <div className="rounded-lg border border-red-100 bg-red-50/50 p-3">
            <p className="text-[10px] font-bold text-red-600 uppercase tracking-wider mb-1">Almacén Activo</p>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">Almacén Central</span>
              <ChevronRight className="size-3 text-red-400" />
            </div>
          </div>
        </div>
        <SidebarGroup>
          <SidebarMenu className="px-2 gap-1">
            <SidebarMenuItem>
              <SidebarMenuButton asChild className="h-9 px-3 text-slate-600 hover:bg-slate-50 text-sm">
                <a href="#" className="flex items-center gap-3">
                  <Globe className="size-4 text-slate-400" />
                  <span>English</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild className="h-9 px-3 text-slate-600 hover:bg-slate-50 text-sm">
                <a href="#" className="flex items-center gap-3">
                  <Moon className="size-4 text-slate-400" />
                  <span>Modo Oscuro</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild className="h-9 px-3 text-slate-600 hover:bg-slate-50 text-sm">
                <a href="#" className="flex items-center gap-3">
                  <LifeBuoy className="size-4 text-slate-400" />
                  <span>Soporte</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild className="h-9 px-3 text-slate-600 hover:bg-slate-50 text-sm">
                <a href="#" className="flex items-center gap-3">
                  <Settings className="size-4 text-slate-400" />
                  <span>Configuración</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-xs">
          </div>
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-xs font-bold text-foreground truncate">Mangler Yerren</span>
            <span className="text-[10px] text-muted-foreground truncate font-medium uppercase">Admin</span>
          </div>
          <button className="text-slate-400 hover:text-red-600 transition-colors">
            <LogOut className="size-4" />
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}