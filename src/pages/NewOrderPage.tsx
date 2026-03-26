import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  PlusCircle, 
  Search, 
  ShoppingCart, 
  Trash2, 
  ChevronRight, 
  Package,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { useInventoryData } from '@/hooks/use-inventory-data';
import { useOrderStore } from '@/store/use-order-store';
import { useAuthStore } from '@/store/use-auth-store';
import { Order, OrderItem } from '@/lib/orders-data';
import { InventoryItem } from '@/lib/inventory-data';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
export function NewOrderPage() {
  const navigate = useNavigate();
  const { items: inventory, isLoading } = useInventoryData();
  const currentWarehouseId = useAuthStore(s => s.currentWarehouseId);
  const userName = useAuthStore(s => s.userName);
  const addOrder = useOrderStore(s => s.addOrder);
  const [searchTerm, setSearchTerm] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [selectedItems, setSelectedItems] = useState<OrderItem[]>([]);
  const filteredInventory = inventory.filter(item => 
    item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.code.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const addItem = (invItem: InventoryItem) => {
    const existing = selectedItems.find(i => i.id === invItem.id);
    if (existing) {
      const newQty = Math.min(existing.quantity + 1, invItem.stock);
      if (newQty === existing.quantity) {
        toast.warning("Stock máximo alcanzado");
        return;
      }
      setSelectedItems(selectedItems.map(i => 
        i.id === invItem.id ? { ...i, quantity: newQty } : i
      ));
    } else {
      if (invItem.stock <= 0) {
        toast.error("Artículo sin existencias");
        return;
      }
      setSelectedItems([...selectedItems, {
        id: invItem.id,
        code: invItem.code,
        description: invItem.description,
        quantity: 1,
        unit: invItem.unit
      }]);
    }
  };
  const removeItem = (id: string) => {
    setSelectedItems(selectedItems.filter(i => i.id !== id));
  };
  const updateQuantity = (id: string, qty: number) => {
    if (qty < 1) return;
    const invItem = inventory.find(i => i.id === id);
    const maxQty = invItem ? invItem.stock : Infinity;
    const safeQty = Math.min(qty, maxQty);
    setSelectedItems(selectedItems.map(i => 
      i.id === id ? { ...i, quantity: safeQty } : i
    ));
    if (qty > maxQty) {
      toast.warning(`Cantidad limitada al stock disponible (${maxQty})`);
    }
  };
  const handleSubmit = () => {
    if (!customerName.trim()) {
      toast.error("Por favor, ingrese el nombre del solicitante");
      return;
    }
    if (selectedItems.length === 0) {
      toast.error("Agregue al menos un producto al pedido");
      return;
    }
    const newOrder: Order = {
      id: uuidv4(),
      orderNumber: `PED-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      warehouseId: currentWarehouseId,
      customerName: customerName.trim(),
      items: selectedItems,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: userName
    };
    addOrder(newOrder);
    toast.success("Pedido creado correctamente");
    navigate('/');
  };
  return (
    <AppLayout className="bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12 space-y-8">
          <div className="flex items-center gap-4">
            <div className="size-12 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-xl shadow-red-200">
              <PlusCircle className="size-7" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight leading-none">Nuevo Pedido</h1>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">SOLICITUD DE MATERIALES Y DESPACHOS</p>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Selector de Inventario */}
            <Card className="lg:col-span-7 border-slate-200 shadow-sm overflow-hidden h-full flex flex-col">
              <CardHeader className="bg-slate-50/50 border-b p-5">
                <div className="flex flex-col gap-4">
                  <CardTitle className="text-sm font-black uppercase text-slate-900">Seleccionar Materiales</CardTitle>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                    <Input 
                      placeholder="Buscar por código o descripción..." 
                      className="pl-10 h-10 border-slate-200 bg-white"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0 flex-1">
                <ScrollArea className="h-[500px]">
                  {isLoading ? (
                    <div className="p-5 space-y-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="flex gap-4">
                          <Skeleton className="size-10 rounded-lg" />
                          <div className="space-y-2 flex-1">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-full" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : filteredInventory.length > 0 ? (
                    <div className="divide-y divide-slate-100">
                      {filteredInventory.map(item => (
                        <div key={item.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                          <div className="flex items-center gap-4">
                            <div className="size-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                              <Package className="size-5" />
                            </div>
                            <div>
                              <div className="text-[10px] font-black text-red-600 uppercase tracking-widest">{item.code}</div>
                              <div className="text-sm font-bold text-slate-900 uppercase">{item.description}</div>
                              <div className="text-[9px] font-bold text-slate-400 uppercase">Stock: {item.stock} {item.unit}</div>
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => addItem(item)}
                            className="text-red-600 hover:bg-red-50 hover:text-red-700 font-bold text-xs"
                            disabled={item.stock <= 0}
                          >
                            Agregar <ChevronRight className="ml-1 size-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-20 text-center flex flex-col items-center gap-4 text-slate-300">
                      <XCircle className="size-12 opacity-20" />
                      <p className="text-xs font-black uppercase tracking-widest">No se encontraron artículos</p>
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
            {/* Resumen del Pedido */}
            <Card className="lg:col-span-5 border-slate-200 shadow-lg sticky top-8">
              <CardHeader className="bg-slate-900 text-white p-5 rounded-t-lg">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-lg bg-slate-800 flex items-center justify-center text-white">
                    <ShoppingCart className="size-5" />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-black uppercase tracking-tight">Resumen de Solicitud</CardTitle>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Confirme los artículos seleccionados</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Solicitante / Cliente</Label>
                  <Input 
                    placeholder="Nombre completo o Código de Obra" 
                    className="border-slate-200"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Artículos ({selectedItems.length})</span>
                    {selectedItems.length > 0 && (
                      <Button variant="ghost" size="sm" onClick={() => setSelectedItems([])} className="h-6 text-[9px] font-black text-red-600 uppercase">Vaciar</Button>
                    )}
                  </div>
                  {selectedItems.length > 0 ? (
                    <div className="space-y-3 max-h-[300px] overflow-auto pr-2">
                      {selectedItems.map(item => (
                        <div key={item.id} className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-100">
                          <div className="flex-1 min-w-0 pr-4">
                            <div className="text-[9px] font-black text-slate-400 uppercase truncate">{item.code}</div>
                            <div className="text-xs font-bold text-slate-900 uppercase truncate leading-tight">{item.description}</div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center bg-white border border-slate-200 rounded-md">
                              <button 
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="px-2 py-1 text-slate-400 hover:text-slate-900"
                              >-</button>
                              <span className="w-8 text-center text-xs font-black">{item.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="px-2 py-1 text-slate-400 hover:text-slate-900"
                              >+</button>
                            </div>
                            <button onClick={() => removeItem(item.id)} className="text-slate-300 hover:text-red-600 transition-colors">
                              <Trash2 className="size-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-32 flex flex-col items-center justify-center text-slate-300 gap-2 border-2 border-dashed border-slate-100 rounded-lg">
                      <ShoppingCart className="size-8 opacity-20" />
                      <p className="text-[9px] font-bold uppercase tracking-widest">Carrito vacío</p>
                    </div>
                  )}
                </div>
                <div className="pt-4 border-t border-slate-100">
                  <Button 
                    onClick={handleSubmit}
                    className="w-full bg-red-600 hover:bg-red-700 h-12 text-xs font-black uppercase tracking-widest shadow-xl shadow-red-100 flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="size-4" /> Finalizar Pedido
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}