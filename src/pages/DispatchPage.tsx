import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Truck, 
  Clock, 
  ChevronRight, 
  Package, 
  CheckCircle2,
  Calendar,
  User,
  Box
} from 'lucide-react';
import { useOrderStore } from '@/store/use-order-store';
import { useAuthStore } from '@/store/use-auth-store';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from 'sonner';
export function DispatchPage() {
  const currentWarehouseId = useAuthStore(s => s.currentWarehouseId);
  const orders = useOrderStore(s => s.orders);
  const updateOrderStatus = useOrderStore(s => s.updateOrderStatus);
  const pendingOrders = orders.filter(o => 
    o.warehouseId === currentWarehouseId && o.status === 'PENDING'
  );
  const handleDispatch = (id: string, orderNumber: string) => {
    updateOrderStatus(id, 'DISPATCHED');
    toast.success(`Pedido ${orderNumber} despachado con éxito`);
  };
  return (
    <AppLayout className="bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-xl shadow-slate-200">
                <Truck className="size-7" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight leading-none">Despachar Pedido</h1>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">GESTIÓN DE SALIDAS Y PRIORIDADES DE CARGA</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-slate-200 shadow-sm">
              <Clock className="size-4 text-red-600" />
              <span className="text-xs font-black uppercase tracking-tight text-slate-900">
                {pendingOrders.length} Pendientes
              </span>
            </div>
          </div>
          {pendingOrders.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {pendingOrders.map(order => (
                <Card key={order.id} className="border-slate-200 hover:shadow-lg transition-shadow overflow-hidden group">
                  <CardHeader className="bg-slate-50 border-b p-4">
                    <div className="flex justify-between items-start mb-2">
                      <Badge className="bg-white text-red-600 border-red-100 hover:bg-white font-black text-[9px] uppercase px-2 py-0.5 shadow-sm">
                        {order.orderNumber}
                      </Badge>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                        {format(new Date(order.createdAt), "HH:mm", { locale: es })}
                      </span>
                    </div>
                    <CardTitle className="text-sm font-black text-slate-900 uppercase truncate">
                      {order.customerName}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="p-4 space-y-4">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase">
                          <User className="size-3" /> Solicitado por: {order.createdBy}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase">
                          <Calendar className="size-3" /> Fecha: {format(new Date(order.createdAt), "dd MMM yyyy", { locale: es })}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-900 uppercase border-b border-slate-100 pb-1">
                          <Box className="size-3" /> Artículos ({order.items.length})
                        </div>
                        <div className="space-y-1.5">
                          {order.items.slice(0, 3).map(item => (
                            <div key={item.id} className="flex justify-between items-center text-[11px]">
                              <span className="font-bold text-slate-700 truncate max-w-[180px] uppercase">{item.description}</span>
                              <span className="font-black text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded whitespace-nowrap">
                                x{item.quantity} {item.unit}
                              </span>
                            </div>
                          ))}
                          {order.items.length > 3 && (
                            <div className="text-[9px] font-bold text-slate-400 uppercase text-center pt-1 italic">
                              + {order.items.length - 3} artículos más
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-slate-50 border-t border-slate-100 mt-2">
                      <Button 
                        onClick={() => handleDispatch(order.id, order.orderNumber)}
                        className="w-full bg-slate-900 hover:bg-red-600 text-white font-black text-[10px] uppercase tracking-widest h-10 transition-colors group-hover:shadow-lg flex items-center justify-between px-4"
                      >
                        Despachar Ahora
                        <ChevronRight className="size-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="py-20 flex flex-col items-center justify-center gap-6 bg-white rounded-2xl border-2 border-dashed border-slate-100">
              <div className="size-20 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                <CheckCircle2 className="size-10" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">¡Todo al día!</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">No hay pedidos pendientes de despacho en este almacén</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}