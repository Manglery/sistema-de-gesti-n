import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Search, Filter, FileDown, Plus, Package, AlertTriangle, CheckCircle2, XCircle, MapPin, History, Settings2, ArrowRight } from 'lucide-react';
import { InventoryItem } from '@/lib/inventory-data';
import { useInventoryData } from '@/hooks/use-inventory-data';
import { useInventoryStore } from '@/store/use-inventory-store';
import { useAuthStore } from '@/store/use-auth-store';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
export function InventoryPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [isAdjusting, setIsAdjusting] = useState(false);
  const [adjustQty, setAdjustQty] = useState('0');
  const [adjustReason, setAdjustReason] = useState('Inventario Cíclico');
  const { items, isLoading } = useInventoryData();
  const adjustStockAction = useInventoryStore(s => s.adjustStock);
  const warehouseId = useAuthStore(s => s.currentWarehouseId);
  const userName = useAuthStore(s => s.userName);
  const filteredItems = (items || []).filter(item => 
    item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleAdjustStock = async () => {
    if (!selectedItem) return;
    const amount = parseInt(adjustQty);
    if (isNaN(amount) || amount === 0) {
      toast.error("Cantidad no válida");
      return;
    }
    try {
      await adjustStockAction(warehouseId, selectedItem.id, amount, adjustReason, userName);
      toast.success("Stock actualizado en base de datos");
      setIsAdjusting(false);
      setSheetOpen(false);
    } catch (err) {
      toast.error("Error al sincronizar con el servidor");
    }
  };
  const getStatusBadge = (status: InventoryItem['status']) => {
    switch (status) {
      case 'In Stock':
        return <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-none font-black text-[9px] uppercase"><CheckCircle2 className="size-2.5 mr-1" /> OK</Badge>;
      case 'Low Stock':
        return <Badge className="bg-orange-50 text-orange-700 hover:bg-orange-100 border-none font-black text-[9px] uppercase"><AlertTriangle className="size-2.5 mr-1" /> Bajo</Badge>;
      case 'Out of Stock':
        return <Badge className="bg-red-50 text-red-700 hover:bg-red-100 border-none font-black text-[9px] uppercase"><XCircle className="size-2.5 mr-1" /> Agotado</Badge>;
    }
  };
  return (
    <AppLayout className="bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-xl">
                <Package className="size-7" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Inventario & Stock</h1>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">MAESTRO DE ARTÍCULOS Y UBICACIONES</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="text-[10px] font-black uppercase h-10 px-6 border-slate-200">
                <FileDown className="mr-2 size-4" /> Exportar CSV
              </Button>
              <Button size="sm" className="bg-red-600 hover:bg-red-700 text-[10px] font-black uppercase h-10 px-6 shadow-lg shadow-red-100">
                <Plus className="mr-2 size-4" /> Nuevo Artículo
              </Button>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-3 border-b border-slate-100 bg-slate-50/30 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <Input 
                  placeholder="Filtrar por código, nombre o categoría..." 
                  className="pl-10 h-9 text-xs border-slate-200 bg-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" className="h-9 text-[10px] font-black uppercase px-4 border-slate-200">
                <Filter className="mr-2 size-3.5" /> Filtros Avanzados
              </Button>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow className="border-slate-100">
                    <TableHead className="text-[9px] font-black text-slate-400 uppercase py-3 pl-6">Código</TableHead>
                    <TableHead className="text-[9px] font-black text-slate-400 uppercase py-3">Descripción / Categoría</TableHead>
                    <TableHead className="text-[9px] font-black text-slate-400 uppercase py-3">Stock Disponible</TableHead>
                    <TableHead className="text-[9px] font-black text-slate-400 uppercase py-3">Ubicación</TableHead>
                    <TableHead className="text-[9px] font-black text-slate-400 uppercase py-3">Estado</TableHead>
                    <TableHead className="text-[9px] font-black text-slate-400 uppercase py-3 text-right pr-6">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, idx) => (
                      <TableRow key={idx}><TableCell colSpan={6}><Skeleton className="h-10 w-full" /></TableCell></TableRow>
                    ))
                  ) : filteredItems.map((item) => (
                    <TableRow 
                      key={item.id} 
                      className={cn(
                        "hover:bg-slate-50/80 transition-colors cursor-pointer group border-slate-100",
                        item.stock === 0 ? "bg-red-50/10" : ""
                      )}
                      onClick={() => { setSelectedItem(item); setSheetOpen(true); }}
                    >
                      <TableCell className="py-3 pl-6 text-[11px] font-black text-red-600">{item.code}</TableCell>
                      <TableCell className="py-3">
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-slate-700 uppercase leading-tight">{item.description}</span>
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{item.category}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-3">
                        <span className={cn("text-xs font-black", item.stock <= item.minStock ? "text-red-600" : "text-slate-900")}>
                          {item.stock} <span className="text-[9px] font-bold text-slate-400">{item.unit}</span>
                        </span>
                      </TableCell>
                      <TableCell className="py-3 text-[10px] font-bold text-slate-600 uppercase">{item.location}</TableCell>
                      <TableCell className="py-3">{getStatusBadge(item.status)}</TableCell>
                      <TableCell className="py-3 text-right pr-6">
                        <Button variant="ghost" size="sm" className="h-7 text-[9px] font-black uppercase text-slate-400 group-hover:text-red-600">
                          Gestionar <ArrowRight className="ml-1 size-3" />
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
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="sm:max-w-md bg-white p-0">
          {selectedItem && (
            <div className="flex flex-col h-full">
              <SheetHeader className="p-8 bg-slate-900 text-white">
                <div className="text-[10px] font-black text-red-500 uppercase tracking-[0.2em] mb-2">{selectedItem.code}</div>
                <SheetTitle className="text-xl font-black text-white uppercase leading-tight">{selectedItem.description}</SheetTitle>
              </SheetHeader>
              <div className="p-8 space-y-8 flex-1">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <span className="text-[9px] font-black text-slate-400 uppercase block mb-1">Stock Actual</span>
                    <span className="text-2xl font-black text-slate-900">{selectedItem.stock} <span className="text-xs text-slate-400">{selectedItem.unit}</span></span>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <span className="text-[9px] font-black text-slate-400 uppercase block mb-1">Mínimo Sugerido</span>
                    <span className="text-2xl font-black text-slate-400">{selectedItem.minStock}</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <Button 
                    className="w-full h-12 bg-slate-900 text-[10px] font-black uppercase tracking-widest"
                    onClick={() => setIsAdjusting(true)}
                  >
                    <Settings2 className="mr-2 size-4" /> Realizar Ajuste Manual
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full h-12 text-[10px] font-black uppercase tracking-widest border-slate-200"
                    onClick={() => navigate(`/movements?code=${selectedItem.code}`)}
                  >
                    <History className="mr-2 size-4" /> Ver Historial (Kardex)
                  </Button>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
      <Dialog open={isAdjusting} onOpenChange={setIsAdjusting}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-black uppercase">Ajuste de Stock</DialogTitle>
            <DialogDescription className="text-xs font-bold uppercase text-slate-400">
              Esta acción quedará registrada permanentemente en el Kardex.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-slate-500">Diferencia (+/-)</Label>
              <Input type="number" value={adjustQty} onChange={(e) => setAdjustQty(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-slate-500">Motivo</Label>
              <select className="w-full h-10 border border-slate-200 rounded-lg px-3 text-sm" value={adjustReason} onChange={(e) => setAdjustReason(e.target.value)}>
                <option>Inventario Cíclico</option>
                <option>Rotura / Merma</option>
                <option>Error Administrativo</option>
                <option>Ajuste Auditoría</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAdjusting(false)} className="text-[10px] font-black uppercase">Cancelar</Button>
            <Button onClick={handleAdjustStock} className="bg-red-600 hover:bg-red-700 text-[10px] font-black uppercase">Confirmar Sincronización</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}