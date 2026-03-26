import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Search, 
  Filter, 
  FileDown, 
  Plus,
  Package,
  AlertTriangle,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { InventoryItem } from '@/lib/inventory-data';
import { useInventoryData } from '@/hooks/use-inventory-data';
import { cn } from '@/lib/utils';
export function InventoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
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
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">GESTIÓN INTEGRAL DE INVENTARIO Y UBICACIONES</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="text-xs font-bold uppercase tracking-tight">
                <FileDown className="mr-2 size-4" /> Exportar
              </Button>
              <Button size="sm" className="bg-red-600 hover:bg-red-700 text-xs font-bold uppercase tracking-tight">
                <Plus className="mr-2 size-4" /> Nuevo Item
              </Button>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <Input 
                  placeholder="Buscar por código, descripción o categoría..." 
                  className="pl-10 h-10 text-sm border-slate-200 focus:ring-red-500 bg-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" className="h-10 text-xs font-bold uppercase">
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
                    <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest py-4">Ubicación</TableHead>
                    <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest py-4">Estado</TableHead>
                    <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest py-4 text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, idx) => (
                      <TableRow key={idx}>
                        {Array.from({ length: 7 }).map((_, j) => (
                          <TableCell key={j}><Skeleton className="h-6 w-full" /></TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : filteredItems.length > 0 ? (
                    filteredItems.map((item) => (
                      <TableRow key={item.id} className="hover:bg-slate-50/80 transition-colors border-slate-100">
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
                        <TableCell>
                          <span className="text-[10px] font-black text-slate-600 uppercase bg-slate-100 px-2 py-1 rounded">
                            {item.location}
                          </span>
                        </TableCell>
                        <TableCell>{getStatusBadge(item.status)}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" className="text-xs font-bold text-slate-400 hover:text-slate-900">
                            Ver Detalle
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="h-64 text-center">
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
    </AppLayout>
  );
}