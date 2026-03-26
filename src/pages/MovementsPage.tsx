import React, { useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Repeat, ArrowUpRight, ArrowDownLeft, Search, RefreshCw, AlertCircle } from "lucide-react";
import { useActivityStore } from '@/store/use-activity-store';
import { useAuthStore } from '@/store/use-auth-store';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
export function MovementsPage() {
  const warehouseId = useAuthStore(s => s.currentWarehouseId);
  const logs = useActivityStore(s => s.logs);
  const fetchLogs = useActivityStore(s => s.fetchLogs);
  useEffect(() => {
    if (warehouseId) {
      fetchLogs(warehouseId);
    }
  }, [warehouseId]);
  const getTypeStyle = (type: string) => {
    switch (type) {
      case 'ORDER_DISPATCHED':
        return { label: 'SALIDA', color: 'bg-red-50 text-red-600', icon: ArrowUpRight };
      case 'STOCK_ADJUSTED':
        return { label: 'AJUSTE', color: 'bg-orange-50 text-orange-600', icon: AlertCircle };
      case 'ORDER_CREATED':
        return { label: 'REGISTRO', color: 'bg-blue-50 text-blue-600', icon: RefreshCw };
      default:
        return { label: 'ENTRADA', color: 'bg-emerald-50 text-emerald-600', icon: ArrowDownLeft };
    }
  };
  return (
    <AppLayout className="bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-xl">
                <Repeat className="size-7" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight leading-none">Movimientos (Kardex)</h1>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">AUDITORÍA COMPLETA DE TRANSACCIONES</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-slate-200">
              <RefreshCw className="size-4 text-slate-400" />
              <span className="text-[10px] font-black uppercase text-slate-500">Sincronizado: {new Date().toLocaleTimeString()}</span>
            </div>
          </div>
          <Card className="border-slate-200 shadow-sm overflow-hidden">
            <CardHeader className="bg-white border-b p-4">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <Input placeholder="Filtrar por código de material..." className="pl-10 h-10 border-slate-200 text-xs font-bold uppercase" />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow className="border-slate-100">
                    <TableHead className="text-[10px] font-black text-slate-400 uppercase py-4 pl-6">Fecha & Hora</TableHead>
                    <TableHead className="text-[10px] font-black text-slate-400 uppercase py-4">Tipo Operación</TableHead>
                    <TableHead className="text-[10px] font-black text-slate-400 uppercase py-4">Descripción del Suceso</TableHead>
                    <TableHead className="text-[10px] font-black text-slate-400 uppercase py-4">Usuario Responsable</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.length > 0 ? logs.map((log) => {
                    const style = getTypeStyle(log.type);
                    return (
                      <TableRow key={log.id} className="hover:bg-slate-50/50 border-slate-100 group">
                        <TableCell className="py-4 pl-6 text-[11px] font-bold text-slate-500 whitespace-nowrap">
                          {format(new Date(log.timestamp), "dd/MM/yy '—' HH:mm", { locale: es })}
                        </TableCell>
                        <TableCell className="py-4">
                          <Badge className={cn("border-none shadow-none text-[9px] font-black uppercase px-2 py-0.5", style.color)}>
                            {style.icon && React.createElement(style.icon, { className: "size-2.5 mr-1" })} {style.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-4">
                          <span className="text-xs font-bold text-slate-700 uppercase leading-tight group-hover:text-red-600 transition-colors">
                            {log.message}
                          </span>
                        </TableCell>
                        <TableCell className="py-4">
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-tight bg-slate-100 px-2 py-1 rounded">
                            {log.user}
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  }) : (
                    <TableRow>
                      <TableCell colSpan={4} className="py-20 text-center">
                        <AlertCircle className="size-10 text-slate-200 mx-auto mb-4" />
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">No se encontraron movimientos registrados</p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}