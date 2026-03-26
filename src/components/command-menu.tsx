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
  Search, 
  LayoutDashboard, 
  Truck, 
  History, 
  Users, 
  Building2,
  Undo2,
  ShoppingCart
} from "lucide-react";
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
      <CommandInput placeholder="Buscar materiales, páginas o almacenes... (⌘K)" className="border-none focus:ring-0 text-sm font-bold uppercase" />
      <CommandList className="max-h-[400px]">
        <CommandEmpty className="py-10 text-center text-xs font-black uppercase text-slate-400">No se encontraron resultados.</CommandEmpty>
        <CommandGroup heading={<span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Materiales (Stock Actual)</span>}>
          {currentItems.map((item) => (
            <CommandItem
              key={item.id}
              onSelect={() => runCommand(() => navigate('/inventory'))}
              className="flex items-center gap-3 px-4 py-3"
            >
              <Package className="size-4 text-red-600" />
              <div className="flex flex-col">
                <span className="text-xs font-black uppercase">{item.description ?? 'Sin descripción'}</span>
                <span className="text-[9px] font-bold text-slate-400">
                  {item.code ?? 'N/A'} · {item.stock ?? 0} {item.unit ?? 'un'}
                </span>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading={<span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Navegación Rápida</span>}>
          <CommandItem onSelect={() => runCommand(() => navigate('/'))}>
            <LayoutDashboard className="mr-2 size-4 text-slate-400" />
            <span className="text-xs font-bold uppercase">Dashboard</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate('/dispatch'))}>
            <Truck className="mr-2 size-4 text-slate-400" />
            <span className="text-xs font-bold uppercase">Despachar Pedidos</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate('/inventory'))}>
            <Package className="mr-2 size-4 text-slate-400" />
            <span className="text-xs font-bold uppercase">Inventario & Kardex</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate('/movements'))}>
            <History className="mr-2 size-4 text-slate-400" />
            <span className="text-xs font-bold uppercase">Movimientos</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading={<span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Almacenes</span>}>
          {(warehouses ?? []).map((w) => (
            <CommandItem
              key={w.id}
              onSelect={() => runCommand(() => setWarehouseId(w.id))}
              className="flex items-center gap-2"
            >
              <Building2 className="mr-2 size-4 text-slate-400" />
              <span className="text-xs font-bold uppercase">{w.name ?? 'Sin nombre'}</span>
              {currentWarehouseId === w.id && <span className="ml-auto text-[9px] font-black uppercase text-red-600">Activo</span>}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}