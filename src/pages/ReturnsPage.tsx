import React, { useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Undo2, History, AlertCircle, Ghost } from "lucide-react";
import { useReturnStore } from '@/store/use-return-store';
import { useAuthStore } from '@/store/use-auth-store';
import { toast } from 'sonner';
export function ReturnsPage() {
  const warehouseId = useAuthStore(s => s.currentWarehouseId);
  const returns = useReturnStore(s => s.returns);
  const isLoading = useReturnStore(s => s.isLoading);
  const fetchReturns = useReturnStore(s => s.fetchReturns);
  const updateReturnStatus = useReturnStore(s => s.updateReturnStatus);
  useEffect(() => {
    if (warehouseId) {
      fetchReturns(warehouseId);
    }
  }, [warehouseId]);
  const handleProcess = async (id: string, nextStatus: 'INSPECTED' | 'RESTOCKED') => {
    await updateReturnStatus(id, nextStatus);
    toast.success(`Devolución actualizada a ${nextStatus}`);
  };
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-xl">
                <Undo2 className="size-7" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight leading-none">Devoluciones</h1>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">GESTIÓN DE MATERIAL RECHAZADO O SOBRANTE</p>
              </div>
            </div>
            <Button className="bg-red-600 hover:bg-red-700 text-xs font-black uppercase">Registrar Devolución</Button>
          </div>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-64 rounded-xl" />)}
            </div>
          ) : returns.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {returns.map((ret) => (
                <Card key={ret.id} className="border-slate-200 shadow-sm hover:shadow-md transition-all">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="outline" className="text-[9px] font-black uppercase border-slate-200">{ret.order_number}</Badge>
                      <Badge className={
                        ret.status === 'PENDING' ? "bg-orange-100 text-orange-600" :
                        ret.status === 'INSPECTED' ? "bg-blue-100 text-blue-600" :
                        "bg-emerald-100 text-emerald-600"
                        + " shadow-none border-none text-[9px] font-black uppercase"}>
                        {ret.status === 'PENDING' ? 'Pendiente' : ret.status === 'INSPECTED' ? 'Inspeccionado' : 'Reingresado'}
                      </Badge>
                    </div>
                    <CardTitle className="text-sm font-black text-slate-900 uppercase">{ret.material_name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Motivo</span>
                      <span className="text-xs font-bold text-slate-700 uppercase">{ret.reason}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase">
                      <History className="size-3" /> {ret.created_at ? new Date(ret.created_at).toLocaleDateString() : '-'}
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2 border-t flex gap-2">
                    {ret.status === 'PENDING' && (
                      <Button onClick={() => handleProcess(ret.id, 'INSPECTED')} variant="secondary" className="flex-1 text-[10px] font-black uppercase">Inspeccionar</Button>
                    )}
                    {ret.status === 'INSPECTED' && (
                      <Button onClick={() => handleProcess(ret.id, 'RESTOCKED')} variant="secondary" className="flex-1 text-[10px] font-black uppercase">Reingresar</Button>
                    )}
                    {ret.status === 'RESTOCKED' && (
                      <Button disabled variant="ghost" className="flex-1 text-[10px] font-black uppercase opacity-40">Procesado</Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="py-20 flex flex-col items-center justify-center gap-5 bg-white rounded-2xl border-2 border-dashed border-slate-100">
              <Ghost className="size-12 text-slate-200" />
              <div className="text-center">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Sin devoluciones activas</p>
                <p className="text-[10px] font-bold text-slate-300 uppercase mt-1">Todas las unidades han sido procesadas</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}