import React, { useEffect, useMemo } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingCart, Truck, Calendar, MoreVertical, Package } from "lucide-react";
import { usePurchaseStore } from '@/store/use-purchase-store';
import { useAuthStore } from '@/store/use-auth-store';
import { toast } from "sonner";
export function PurchasesPage() {
  const warehouseId = useAuthStore(s => s.currentWarehouseId);
  const userName = useAuthStore(s => s.userName);
  const purchases = usePurchaseStore(s => s.purchases);
  const isLoading = usePurchaseStore(s => s.isLoading);
  const fetchPurchases = usePurchaseStore(s => s.fetchPurchases);
  const receivePurchase = usePurchaseStore(s => s.receivePurchase);
  useEffect(() => {
    if (warehouseId) fetchPurchases(warehouseId);
  }, [warehouseId]);
  const stats = useMemo(() => {
    const arriving = purchases.filter(p => p.status === 'ARRIVING').length;
    const totalMonth = purchases.reduce((acc, p) => acc + Number(p.total_amount), 0);
    const vendors = new Set(purchases.map(p => p.vendor_name)).size;
    return { arriving, totalMonth, vendors };
  }, [purchases]);
  const handleReceive = async (id: string) => {
    await receivePurchase(id, warehouseId, userName);
    toast.success(`Orden de compra ${id} recibida en inventario`);
  };
  const formatter = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' });
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-xl">
                <ShoppingCart className="size-7" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight leading-none">Gestión de Compras</h1>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">ORDENES DE COMPRA Y RECEPCIÓN DE MATERIAL</p>
              </div>
            </div>
            <Button className="bg-red-600 hover:bg-red-700 text-xs font-black uppercase px-6">Nueva Orden de Compra</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-slate-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-orange-50 rounded-lg text-orange-600"><Truck className="size-5" /></div>
                  <Badge className="bg-orange-50 text-orange-600 shadow-none border-none font-black text-[9px] uppercase">En Tránsito</Badge>
                </div>
                <div className="text-2xl font-black text-slate-900">{stats.arriving}</div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Envíos próximos</div>
              </CardContent>
            </Card>
            <Card className="border-slate-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600"><Calendar className="size-5" /></div>
                  <Badge className="bg-emerald-50 text-emerald-600 shadow-none border-none font-black text-[9px] uppercase">Gasto Total</Badge>
                </div>
                <div className="text-2xl font-black text-slate-900">{formatter.format(stats.totalMonth)}</div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Inversión acumulada</div>
              </CardContent>
            </Card>
            <Card className="border-slate-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-slate-900 rounded-lg text-white"><Package className="size-5" /></div>
                  <Badge className="bg-slate-100 text-slate-600 shadow-none border-none font-black text-[9px] uppercase">Proveedores</Badge>
                </div>
                <div className="text-2xl font-black text-slate-900">{stats.vendors}</div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fuentes activas</div>
              </CardContent>
            </Card>
          </div>
          <Card className="border-slate-200 shadow-sm overflow-hidden">
            {isLoading ? (
              <div className="p-6 space-y-4">
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-12 w-full" />)}
              </div>
            ) : (
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="text-[10px] font-black text-slate-400 uppercase py-4">Orden #</TableHead>
                    <TableHead className="text-[10px] font-black text-slate-400 uppercase py-4">Proveedor</TableHead>
                    <TableHead className="text-[10px] font-black text-slate-400 uppercase py-4">Entrega Estimada</TableHead>
                    <TableHead className="text-[10px] font-black text-slate-400 uppercase py-4">Monto</TableHead>
                    <TableHead className="text-[10px] font-black text-slate-400 uppercase py-4">Estado</TableHead>
                    <TableHead className="text-[10px] font-black text-slate-400 uppercase py-4 text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {purchases.map((po) => (
                    <TableRow key={po.id} className="hover:bg-slate-50/50">
                      <TableCell className="text-xs font-black text-red-600 uppercase">{po.id}</TableCell>
                      <TableCell className="text-xs font-bold text-slate-900 uppercase">{po.vendor_name}</TableCell>
                      <TableCell className="text-xs font-bold text-slate-500 uppercase">{po.delivery_date}</TableCell>
                      <TableCell className="text-xs font-black text-slate-900">{formatter.format(po.total_amount)}</TableCell>
                      <TableCell>
                        <Badge className={`${po.status === 'ARRIVING' ? "bg-orange-50 text-orange-600" : "bg-emerald-50 text-emerald-600"} shadow-none border-none text-[9px] font-black uppercase`}>
                          {po.status === 'ARRIVING' ? 'En Camino' : 'Completado'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {po.status === 'ARRIVING' ? (
                          <Button onClick={() => handleReceive(po.id)} size="sm" className="bg-slate-900 text-[10px] font-black uppercase h-8 px-4">Recibir</Button>
                        ) : (
                          <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="size-4 text-slate-400" /></Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}