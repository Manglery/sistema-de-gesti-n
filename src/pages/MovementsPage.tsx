import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Repeat, ArrowUpRight, ArrowDownLeft, Filter, Search } from "lucide-react";
const MOCK_MOVEMENTS = [
  { id: 'M1', date: '2024-03-25 08:45', type: 'EXIT', code: 'ACC-001', desc: 'Contador Agua A1', qty: 15, warehouse: 'Contadores', operator: 'M. Jadracui' },
  { id: 'M2', date: '2024-03-25 09:12', type: 'ENTRY', code: 'ACC-052', desc: 'Válvula Esfera', qty: 100, warehouse: 'Contadores', operator: 'A. García' },
  { id: 'M3', date: '2024-03-25 10:05', type: 'EXIT', code: 'ACC-003', desc: 'Tubo PVC 110mm', qty: 4, warehouse: 'Contadores', operator: 'R. Rey' },
  { id: 'M4', date: '2024-03-24 16:30', type: 'ADJUST', code: 'ACC-010', desc: 'Precintos (100u)', qty: -2, warehouse: 'Contadores', operator: 'Admin' },
  { id: 'M5', date: '2024-03-24 14:15', type: 'ENTRY', code: 'ACC-001', desc: 'Contador Agua A1', qty: 50, warehouse: 'Contadores', operator: 'M. Jadracui' },
];
export function MovementsPage() {
  return (
    <AppLayout className="bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-xl shadow-slate-200">
                <Repeat className="size-7" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight leading-none">Movimientos (Kardex)</h1>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">HISTORIAL CRONOLÓGICO DE ENTRADAS Y SALIDAS</p>
              </div>
            </div>
          </div>
          <Card className="border-slate-200 shadow-sm overflow-hidden">
            <CardHeader className="bg-white border-b p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                  <Input placeholder="Buscar por código o descripción..." className="pl-10 h-10 border-slate-200" />
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline" className="cursor-pointer bg-slate-50 border-slate-200 text-[10px] font-black uppercase px-3 py-1">Todos</Badge>
                  <Badge variant="outline" className="cursor-pointer bg-emerald-50 border-emerald-100 text-emerald-600 text-[10px] font-black uppercase px-3 py-1">Entradas</Badge>
                  <Badge variant="outline" className="cursor-pointer bg-red-50 border-red-100 text-red-600 text-[10px] font-black uppercase px-3 py-1">Salidas</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="text-[10px] font-black text-slate-400 uppercase py-4">Fecha & Hora</TableHead>
                    <TableHead className="text-[10px] font-black text-slate-400 uppercase py-4">Tipo</TableHead>
                    <TableHead className="text-[10px] font-black text-slate-400 uppercase py-4">Código / Material</TableHead>
                    <TableHead className="text-[10px] font-black text-slate-400 uppercase py-4">Cantidad</TableHead>
                    <TableHead className="text-[10px] font-black text-slate-400 uppercase py-4">Operario</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_MOVEMENTS.map((m) => (
                    <TableRow key={m.id} className="hover:bg-slate-50/50">
                      <TableCell className="text-[11px] font-bold text-slate-500">{m.date}</TableCell>
                      <TableCell>
                        {m.type === 'ENTRY' && (
                          <Badge className="bg-emerald-50 text-emerald-600 border-none shadow-none text-[9px] font-black uppercase">
                            <ArrowDownLeft className="size-3 mr-1" /> Entrada
                          </Badge>
                        )}
                        {m.type === 'EXIT' && (
                          <Badge className="bg-red-50 text-red-600 border-none shadow-none text-[9px] font-black uppercase">
                            <ArrowUpRight className="size-3 mr-1" /> Salida
                          </Badge>
                        )}
                        {m.type === 'ADJUST' && (
                          <Badge className="bg-orange-50 text-orange-600 border-none shadow-none text-[9px] font-black uppercase">
                            Ajuste
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black text-red-600 uppercase">{m.code}</span>
                          <span className="text-xs font-bold text-slate-800 uppercase">{m.desc}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm font-black text-slate-900">{m.qty > 0 ? `+${m.qty}` : m.qty} Uds</TableCell>
                      <TableCell className="text-[10px] font-black text-slate-600 uppercase tracking-tight">{m.operator}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}