import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Plus, Truck, Calendar, MoreVertical } from "lucide-react";
import { toast } from "sonner";
const MOCK_PURCHASES = [
  { id: 'PO-1', vendor: 'Ibercont S.L.', amount: '€12,450.00', status: 'ARRIVING', date: '28 Mar 2024', items: 45 },
  { id: 'PO-2', vendor: 'Valvulería Sur', amount: '€3,120.00', status: 'COMPLETED', date: '20 Mar 2024', items: 120 },
  { id: 'PO-3', vendor: 'Logística Total', amount: '€5,600.00', status: 'ARRIVING', date: '29 Mar 2024', items: 12 },
];
export function PurchasesPage() {
  const handleReceive = (id: string) => {
    toast.success(`Orden de compra ${id} recibida correctamente en inventario`);
  };
  return (
    <AppLayout className="bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-xl shadow-slate-200">
                <ShoppingCart className="size-7" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight leading-none">Gestión de Compras</h1>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">ORDENES DE COMPRA Y RECEPCIÓN DE MATERIAL</p>
              </div>
            </div>
            <Button className="bg-red-600 hover:bg-red-700 text-xs font-black uppercase">Nueva Orden de Compra</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-slate-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-orange-50 rounded-lg text-orange-600"><Truck className="size-5" /></div>
                  <Badge className="bg-orange-50 text-orange-600 shadow-none border-none font-black text-[9px] uppercase">En Tránsito</Badge>
                </div>
                <div className="text-2xl font-black text-slate-900">4</div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Envíos próximos</div>
              </CardContent>
            </Card>
            <Card className="border-slate-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600"><Calendar className="size-5" /></div>
                  <Badge className="bg-emerald-50 text-emerald-600 shadow-none border-none font-black text-[9px] uppercase">Mes Actual</Badge>
                </div>
                <div className="text-2xl font-black text-slate-900">€24,560.00</div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Inversión mensual</div>
              </CardContent>
            </Card>
            <Card className="border-slate-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-slate-900 rounded-lg text-white"><Plus className="size-5" /></div>
                  <Badge className="bg-slate-100 text-slate-600 shadow-none border-none font-black text-[9px] uppercase">Proveedores</Badge>
                </div>
                <div className="text-2xl font-black text-slate-900">12</div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Activos en sistema</div>
              </CardContent>
            </Card>
          </div>
          <Card className="border-slate-200 shadow-sm overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="text-[10px] font-black text-slate-400 uppercase py-4">Orden #</TableHead>
                  <TableHead className="text-[10px] font-black text-slate-400 uppercase py-4">Proveedor</TableHead>
                  <TableHead className="text-[10px] font-black text-slate-400 uppercase py-4">Fecha Entrega</TableHead>
                  <TableHead className="text-[10px] font-black text-slate-400 uppercase py-4">Monto</TableHead>
                  <TableHead className="text-[10px] font-black text-slate-400 uppercase py-4">Estado</TableHead>
                  <TableHead className="text-[10px] font-black text-slate-400 uppercase py-4 text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_PURCHASES.map((po) => (
                  <TableRow key={po.id} className="hover:bg-slate-50/50">
                    <TableCell className="text-xs font-black text-red-600">{po.id}</TableCell>
                    <TableCell className="text-xs font-bold text-slate-900 uppercase">{po.vendor}</TableCell>
                    <TableCell className="text-xs font-bold text-slate-500 uppercase">{po.date}</TableCell>
                    <TableCell className="text-xs font-black text-slate-900">{po.amount}</TableCell>
                    <TableCell>
                      {po.status === 'ARRIVING' ? (
                        <Badge className="bg-orange-50 text-orange-600 shadow-none border-none text-[9px] font-black uppercase">En Camino</Badge>
                      ) : (
                        <Badge className="bg-emerald-50 text-emerald-600 shadow-none border-none text-[9px] font-black uppercase">Completado</Badge>
                      )}
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
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}