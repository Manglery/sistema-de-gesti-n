import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { 
  Package, 
  LayoutDashboard, 
  Truck, 
  History, 
  Users, 
  Building2,
  PlusCircle,
  BarChart3,
  Undo2,
  ShoppingCart,
  Zap
} from "lucide-react";
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/use-auth-store';
import { useInventoryStore } from '@/store/use-inventory-store';
export function CommandMenu() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const currentWarehouseId = useAuthStore(s => s.currentWarehouseId);
  const warehouses = useAuthStore(s => s.warehouses);
  const setWarehouseId = useAuthStore(s => s.setWarehouseId);
  const inventoryByWarehouse = useInventoryStore(s => s.inventory);
  const currentItemsUnmemoized = React.useMemo(
    () => inventoryByWarehouse[currentWarehouseId] || [],
    [inventoryByWarehouse, currentWarehouseId]
  );
  const currentItems = React.useMemo(
    () => currentItemsUnmemoized.slice(0, 5), 
    [currentItemsUnmemoized]
  );
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);
  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };
  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput 
        placeholder="Buscar materiales, acciones o almacenes..." 
        className="border-none focus:ring-0 text-sm font-bold uppercase tracking-tight" 
      />
      <CommandList className="max-h-[450px]">
        <CommandEmpty className="py-12 text-center">
          <p className="text-xs font-black uppercase text-slate-400">Sin resultados para esta búsqueda</p>
        </CommandEmpty>
        <CommandGroup heading={<span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] px-2 py-2 block">Acciones Rápidas</span>}>
          <CommandItem onSelect={() => runCommand(() => navigate('/new'))} className="h-12 flex items-center gap-3 px-4">
            <div className="size-8 rounded-lg bg-red-50 flex items-center justify-center text-red-600">
              <PlusCircle className="size-4" />
            </div>
            <div className="flex items-center justify-between w-full">
              <span className="text-xs font-black uppercase">Crear Nuevo Pedido</span>
              <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              </kbd>
            </div>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate('/dispatch'))} className="h-12 flex items-center gap-3 px-4">
            <div className="size-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-900">
              <Truck className="size-4" />
            </div>
            <div className="flex items-center justify-between w-full">
              <span className="text-xs font-black uppercase">Despachar Pendientes</span>
              <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              </kbd>
            </div>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate('/reports'))} className="h-12 flex items-center gap-3 px-4">
            <div className="size-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <BarChart3 className="size-4" />
            </div>
            <span className="text-xs font-black uppercase">Ver Reporte Mensual</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading={<span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] px-2 py-2 block">Materiales en Stock</span>}>
          {currentItems.map((item) => (
            <CommandItem
              key={item.id}
              onSelect={() => runCommand(() => navigate('/inventory'))}
              className="h-14 flex items-center gap-4 px-4"
            >
              <div className="size-9 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100">
                <Package className="size-4 text-slate-400" />
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-xs font-black uppercase truncate">{item.description}</span>
                <span className="text-[9px] font-bold text-red-600 tracking-widest">{item.code} · {item.stock} {item.unit}</span>
              </div>
              <Zap className="size-3 text-slate-200" />
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading={<span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] px-2 py-2 block">Cambiar Almacén</span>}>
          {(warehouses ?? []).map((w) => (
            <CommandItem
              key={w.id}
              onSelect={() => runCommand(() => setWarehouseId(w.id))}
              className="h-12 flex items-center gap-3 px-4"
            >
              <Building2 className={cn("size-4", currentWarehouseId === w.id ? "text-red-600" : "text-slate-400")} />
              <span className={cn("text-xs font-bold uppercase", currentWarehouseId === w.id && "text-red-600 font-black")}>
                {w.name}
              </span>
              {currentWarehouseId === w.id && <div className="ml-auto size-2 rounded-full bg-red-600" />}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading={<span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] px-2 py-2 block">Navegación</span>}>
          {[
            { path: '/', icon: LayoutDashboard, label: 'Dashboard Central' },
            { path: '/inventory', icon: Package, label: 'Kardex & Stock' },
            { path: '/users', icon: Users, label: 'Gestión Personal' },
            { path: '/returns', icon: Undo2, label: 'Devoluciones' },
            { path: '/purchases', icon: ShoppingCart, label: 'Ordenes de Compra' },
          ].map((nav) => (
            <CommandItem key={nav.path} onSelect={() => runCommand(() => navigate(nav.path))} className="h-10 px-4">
              <nav.icon className="mr-3 size-4 text-slate-400" />
              <span className="text-xs font-bold uppercase">{nav.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}