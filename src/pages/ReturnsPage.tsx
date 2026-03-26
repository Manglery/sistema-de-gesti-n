import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Undo2, Search, ClipboardList, CheckCircle2, History } from "lucide-react";
const MOCK_RETURNS = [
  { id: 'R1', order: 'PED-2024-001', material: 'Contador Agua B2', reason: 'Defecto de fábrica', status: 'PENDING', date: '25 Mar 2024' },
  { id: 'R2', order: 'PED-2024-045', material: 'Válvula Esfera 3/4', reason: 'Sobrante de obra', status: 'INSPECTED', date: '24 Mar 2024' },
  { id: 'R3', order: 'PED-2024-112', material: 'Tubería PVC 40mm', reason: 'Error en pedido', status: 'RESTOCKED', date: '22 Mar 2024' },
];
export function ReturnsPage() {
  return (
    <AppLayout className="bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-xl shadow-slate-200">
                <Undo2 className="size-7" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight leading-none">Devoluciones</h1>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">GESTIÓN DE MATERIAL RECHAZADO O SOBRANTE</p>
              </div>
            </div>
            <Button className="bg-red-600 hover:bg-red-700 text-xs font-black uppercase">Registrar Devolución</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_RETURNS.map((ret) => (
              <Card key={ret.id} className="border-slate-200 shadow-sm hover:shadow-md transition-all">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline" className="text-[9px] font-black uppercase border-slate-200">{ret.order}</Badge>
                    {ret.status === 'PENDING' && <Badge className="bg-orange-100 text-orange-600 shadow-none border-none text-[9px] font-black uppercase">Pendiente</Badge>}
                    {ret.status === 'INSPECTED' && <Badge className="bg-blue-100 text-blue-600 shadow-none border-none text-[9px] font-black uppercase">Inspeccionado</Badge>}
                    {ret.status === 'RESTOCKED' && <Badge className="bg-emerald-100 text-emerald-600 shadow-none border-none text-[9px] font-black uppercase">Reingresado</Badge>}
                  </div>
                  <CardTitle className="text-sm font-black text-slate-900 uppercase">{ret.material}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Motivo</span>
                    <span className="text-xs font-bold text-slate-700 uppercase">{ret.reason}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase">
                    <History className="size-3" /> Registrado el {ret.date}
                  </div>
                </CardContent>
                <CardFooter className="pt-2 border-t">
                  <Button variant="ghost" className="w-full text-[10px] font-black uppercase text-slate-600 hover:text-red-600">Procesar Acción</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}