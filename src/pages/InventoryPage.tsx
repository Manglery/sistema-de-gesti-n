import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Search, Filter, FileDown, Plus, Package, AlertTriangle, CheckCircle2, XCircle, MapPin, History, LayoutGrid, Settings2 } from 'lucide-react';
import { InventoryItem } from '@/lib/inventory-data';
import { useInventoryData } from '@/hooks/use-inventory-data';
import { useInventoryStore } from '@/store/use-inventory-store';
import { useActivityStore } from '@/store/use-activity-store';
import { useAuthStore } from '@/store/use-auth-store';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
export function InventoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [isAdjusting, setIsAdjusting] = useState(false);
  const [adjustQty, setAdjustQty] = useState('0');
  const [adjustReason, setAdjustReason] = useState('Inventario Cíclico');
  const { items, isLoading } = useInventoryData();
  const adjustStockAction = useInventoryStore(s => s.adjustStock);
  const addLog = useActivityStore(s => s.addLog);
  const warehouseId = useAuthStore(s => s.currentWarehouseId);
  const userName = useAuthStore(s => s.userName);
  const filteredItems = (items || []).filter(item => 
    item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleAdjustStock = () => {
    if (!selectedItem) return;
    const amount = parseInt(adjustQty);
    if (isNaN(amount) || amount === 0) {
      toast.error("Por favor ingrese una cantidad válida");
      return;
    }
    adjustStockAction(warehouseId, selectedItem.id, amount);
    addLog({
      type: 'STOCK_ADJUSTED',
      message: `Stock ajustado para ${selectedItem.code}: ${amount > 0 ? '+' : ''}${amount} unidades. Motivo: ${adjustReason}`,
      user: userName,
      warehouseId: warehouseId,
      metadata: { itemId: selectedItem.id, amount, reason: adjustReason }
    });
    toast.success("Stock actualizado correctamente");
    setIsAdjusting(false);
    setAdjustQty('0');
    setAdjustReason('Inventario Cíclico');
    setSheetOpen(false);
    setSelectedItem(null);
  };
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
                  className="pl-10 h-10 text-sm border-slate-200 bg-white"
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
                    <TableHead className="text-[10px] font-black text-slate-400 uppercase py-4">Código</TableHead>
                    <TableHead className="text-[10px] font-black text-slate-400 uppercase py-4">Descripción</TableHead>
                    <TableHead className="text-[10px] font-black text-slate-400 uppercase py-4">Categoría</TableHead>
                    <TableHead className="text-[10px] font-black text-slate-400 uppercase py-4">Stock</TableHead>
                    <TableHead className="text-[10px] font-black text-slate-400 uppercase py-4 text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, idx) => (
                      <TableRow key={idx}>
                        <TableCell colSpan={5}><Skeleton className="h-6 w-full" /></TableCell>
                      </TableRow>
                    ))
                  ) : filteredItems.map((item) => (
                    <TableRow 
                      key={item.id} 
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                      onClick={() => {
                        setSelectedItem(item);
                        setSheetOpen(true);
                      }}
                    >
                      <TableCell className="text-xs font-black text-red-600">{item.code}</TableCell>
                      <TableCell className="text-xs font-bold text-slate-700 uppercase">{item.description}</TableCell>
                      <TableCell className="text-[10px] font-bold text-slate-500 uppercase">{item.category}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className={cn("text-xs font-black", item.stock <= item.minStock ? "text-red-600" : "text-slate-900")}>
                            {item.stock} {item.unit}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="text-[10px] font-black uppercase text-slate-400 group-hover:text-red-600">
                          Ver Detalle
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
      <Sheet open={sheetOpen} onOpenChange={(open) => {
        setSheetOpen(open);
        if (!open) {
          setSelectedItem(null);
        }
      }}>
        <SheetContent className="sm:max-w-md bg-white border-l p-0 overflow-auto">
          {selectedItem && (
            <div className="flex flex-col h-full">
              <SheetHeader className="p-8 bg-slate-900 text-white relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="size-10 rounded-lg bg-slate-800 flex items-center justify-center text-red-500">
                    <Package className="size-6" />
                  </div>
                  <div className="text-left">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{selectedItem.code}</div>
                    <SheetTitle className="text-xl font-black text-white uppercase">{selectedItem.description}</SheetTitle>
                  </div>
                </div>
                <div className="flex gap-2">
                  {getStatusBadge(selectedItem.status)}
                </div>
              </SheetHeader>
              <div className="p-8 space-y-8">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <span className="text-[9px] font-black text-slate-400 uppercase block mb-2">Stock Disponible</span>
                    <span className="text-2xl font-black text-slate-900">{selectedItem.stock} <span className="text-xs text-slate-400">{selectedItem.unit}</span></span>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <span className="text-[9px] font-black text-slate-400 uppercase block mb-2">Ubicación</span>
                    <div className="flex items-center gap-2">
                      <MapPin className="size-4 text-red-600" />
                      <span className="text-sm font-black text-slate-900 uppercase">{selectedItem.location}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b pb-2">
                    <History className="size-4 text-slate-400" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Historial Reciente</span>
                  </div>
                  <p className="text-[10px] text-slate-400 italic">No hay registros de movimientos en esta sesión.</p>
                </div>
              </div>
              <div className="mt-auto p-8 border-t bg-slate-50/50 flex gap-3">
                <Button 
                  onClick={() => setIsAdjusting(true)}
                  className="flex-1 bg-slate-900 text-[10px] font-black uppercase h-12"
                >
                  <Settings2 className="mr-2 size-4" /> Ajustar Stock
                </Button>
                <Button variant="outline" className="flex-1 text-[10px] font-black uppercase h-12">Transferir</Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
      <Dialog open={isAdjusting} onOpenChange={setIsAdjusting}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-black uppercase">Ajuste de Inventario</DialogTitle>
            <DialogDescription className="text-xs uppercase font-bold text-slate-400">
              Modifique el stock manualmente para {selectedItem?.code ?? 'este item'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase">Cantidad a ajustar (+/-)</Label>
              <Input 
                type="number" 
                value={adjustQty} 
                onChange={(e) => setAdjustQty(e.target.value)} 
                placeholder="Ej: -5 o 10"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase">Motivo del Ajuste</Label>
              <select 
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                value={adjustReason}
                onChange={(e) => setAdjustReason(e.target.value)}
              >
                <option>Inventario Cíclico</option>
                <option>Merma / Daño</option>
                <option>Error de Ingreso</option>
                <option>Ajuste de Auditoría</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAdjusting(false)} className="text-[10px] font-black uppercase">Cancelar</Button>
            <Button onClick={handleAdjustStock} className="bg-red-600 hover:bg-red-700 text-[10px] font-black uppercase">Confirmar Ajuste</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}