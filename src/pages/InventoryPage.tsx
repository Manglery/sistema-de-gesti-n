import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Search, Filter, FileDown, Plus, Package, AlertTriangle, CheckCircle2, XCircle, MapPin, History, LayoutGrid } from 'lucide-react';
import { InventoryItem } from '@/lib/inventory-data';
import { useInventoryData } from '@/hooks/use-inventory-data';
import { cn } from '@/lib/utils';
export function InventoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const { items, isLoading } = useInventoryData();
  const filteredItems = items.filter(item => 
    item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const getStatusBadge = (status: InventoryItem['status']) => {
    switch (status) {
      case 'In Stock':
        return <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200 flex items-center gap-1"><CheckCircle2 className="size-3" /> En Stock</Badge>;
      case 'Low Stock':
        return <Badge className="bg-orange-50 text-orange-700 hover:bg-orange-100 border-orange-200 flex items-center gap-1"><AlertTriangle className="size-3" /> Stock Bajo</Badge>;
      case 'Out of Stock':
        return <Badge className="bg-red-50 text-red-700 hover:bg-red-100 border-red-200 flex items-center gap-1"><XCircle className="size-3" /> Agotado</Badge>;
    }
  };
  return (
    <AppLayout className="bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-xl shadow-slate-200">
                <Package className="size-7" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight leading-none">Stock & Kardex</h1>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">GESTIÓN INTEGRAL DE INVENTARIO</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="text-xs font-bold uppercase tracking-tight h-10 px-6">
                <FileDown className="mr-2 size-4" /> Exportar
              </Button>
              <Button size="sm" className="bg-red-600 hover:bg-red-700 text-xs font-bold uppercase tracking-tight h-10 px-6 shadow-lg shadow-red-100">
                <Plus className="mr-2 size-4" /> Nuevo Item
              </Button>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50/30 flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <Input 
                  placeholder="Buscar por código, descripción o categoría..." 
                  className="pl-10 h-10 text-sm border-slate-200 focus:ring-red-500 bg-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" className="h-10 text-xs font-bold uppercase px-6">
                <Filter className="mr-2 size-4" /> Filtros
              </Button>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow className="border-slate-100">
                    <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest py-4">Código</TableHead>
                    <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest py-4">Descripción</TableHead>
                    <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest py-4">Categoría</TableHead>
                    <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest py-4">Stock Actual</TableHead>
                    <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest py-4 text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, idx) => (
                      <TableRow key={idx}>
                        {Array.from({ length: 5 }).map((_, j) => (
                          <TableCell key={j}><Skeleton className="h-6 w-full" /></TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : filteredItems.length > 0 ? (
                    filteredItems.map((item) => (
                      <TableRow 
                        key={item.id} 
                        className="hover:bg-slate-50/80 transition-colors border-slate-100 cursor-pointer group"
                        onClick={() => setSelectedItem(item)}
                      >
                        <TableCell className="text-xs font-black text-red-600">{item.code}</TableCell>
                        <TableCell className="text-xs font-bold text-slate-700 uppercase">{item.description}</TableCell>
                        <TableCell className="text-[10px] font-bold text-slate-500 uppercase">{item.category}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className={cn("text-xs font-black", item.stock <= item.minStock ? "text-red-600" : "text-slate-900")}>
                              {item.stock} {item.unit}
                            </span>
                            <span className="text-[9px] font-bold text-slate-400 uppercase">Mín: {item.minStock}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" className="text-[10px] font-black uppercase text-slate-400 group-hover:text-red-600">
                            Ver Ficha
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="h-64 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <Package className="size-12 text-slate-200" />
                          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No se encontraron resultados</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
      <Sheet open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
        <SheetContent className="sm:max-w-md bg-white border-l border-slate-200 p-0 overflow-auto">
          {selectedItem && (
            <div className="flex flex-col h-full">
              <SheetHeader className="p-8 bg-slate-900 text-white relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="size-10 rounded-lg bg-slate-800 flex items-center justify-center text-red-500">
                    <Package className="size-6" />
                  </div>
                  <div className="text-left">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{selectedItem.code}</div>
                    <SheetTitle className="text-xl font-black text-white uppercase leading-tight">{selectedItem.description}</SheetTitle>
                  </div>
                </div>
                <div className="flex gap-2">
                  {getStatusBadge(selectedItem.status)}
                  <Badge variant="outline" className="border-slate-700 text-slate-300 text-[9px] font-black uppercase">{selectedItem.category}</Badge>
                </div>
              </SheetHeader>
              <div className="p-8 space-y-8">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">Stock Disponible</span>
                    <span className="text-2xl font-black text-slate-900">{selectedItem.stock} <span className="text-xs text-slate-400">{selectedItem.unit}</span></span>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">Ubicación Actual</span>
                    <div className="flex items-center gap-2">
                      <MapPin className="size-4 text-red-600" />
                      <span className="text-sm font-black text-slate-900 uppercase">{selectedItem.location}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                    <History className="size-4 text-slate-400" />
                    <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Movimientos Recientes</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-lg">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-emerald-600 uppercase">Entrada - Recepción PO-12</span>
                        <span className="text-[9px] text-slate-400 uppercase font-bold">25 Mar 2024</span>
                      </div>
                      <span className="text-xs font-black text-slate-900">+50</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-lg">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-red-600 uppercase">Salida - Pedido PED-2024-001</span>
                        <span className="text-[9px] text-slate-400 uppercase font-bold">24 Mar 2024</span>
                      </div>
                      <span className="text-xs font-black text-slate-900">-10</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                    <LayoutGrid className="size-4 text-slate-400" />
                    <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Stock en otros almacenes</span>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    <div className="flex justify-between items-center text-[11px] p-3 border border-dashed border-slate-200 rounded-lg">
                      <span className="font-bold text-slate-500 uppercase">Almacén Averías</span>
                      <span className="font-black text-slate-900">12 Uds</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px] p-3 border border-dashed border-slate-200 rounded-lg">
                      <span className="font-bold text-slate-500 uppercase">Almacén Acometidas</span>
                      <span className="font-black text-slate-900">0 Uds</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-auto p-8 border-t border-slate-100 bg-slate-50/50 flex gap-3">
                <Button className="flex-1 bg-slate-900 text-[10px] font-black uppercase h-12 shadow-lg shadow-slate-200">Ajustar Stock</Button>
                <Button variant="outline" className="flex-1 text-[10px] font-black uppercase h-12">Transferir</Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </AppLayout>
  );
}