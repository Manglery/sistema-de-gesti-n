import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { WelcomeCard, StatCard, RestockAlertCard } from '@/components/dashboard/stat-cards';
import { MovementChart, OperatorsChart } from '@/components/dashboard/dashboard-charts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Package, 
  Users, 
  Clock, 
  Truck, 
  TrendingUp, 
  Wallet, 
  Calendar, 
  Building2, 
  Activity, 
  ChevronRight 
} from "lucide-react";
import { useAuthStore } from '@/store/use-auth-store';
import { useActivityStore } from '@/store/use-activity-store';
import { useWarehouseData } from '@/hooks/use-warehouse-data';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Link } from 'react-router-dom';
const MESES = [
  { value: "01", label: "Enero" },
  { value: "02", label: "Febrero" },
  { value: "03", label: "Marzo" },
  { value: "04", label: "Abril" },
  { value: "05", label: "Mayo" },
  { value: "06", label: "Junio" },
  { value: "07", label: "Julio" },
  { value: "08", label: "Agosto" },
  { value: "09", label: "Septiembre" },
  { value: "10", label: "Octubre" },
  { value: "11", label: "Noviembre" },
  { value: "12", label: "Diciembre" },
];
const ANIOS = ["2024", "2025", "2026"];
export function HomePage() {
  const role = useAuthStore(s => s.role);
  const currentWarehouseId = useAuthStore(s => s.currentWarehouseId);
  const warehouses = useAuthStore(s => s.warehouses);
  const setWarehouseId = useAuthStore(s => s.setWarehouseId);
  const logs = useActivityStore(s => s.logs);
  const [selectedMonth, setSelectedMonth] = useState("03");
  const [selectedYear, setSelectedYear] = useState("2025");
  const { data: activeData, isLoading } = useWarehouseData(selectedMonth, selectedYear);
  if (isLoading && !activeData) {
    return (
      <AppLayout className="bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
          <Skeleton className="h-12 w-full" />
          <div className="grid grid-cols-4 gap-6">
            <Skeleton className="h-[400px]" />
            <Skeleton className="h-[400px] col-span-3" />
          </div>
        </div>
      </AppLayout>
    );
  }
  return (
    <AppLayout className="bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-xl shadow-red-200">
                <Package className="size-7" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight leading-none">Dashboard</h1>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">INDICADORES EN TIEMPO REAL</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
                <div className="px-3 py-1 flex items-center gap-2 border-r border-slate-100">
                  <Calendar className="size-4 text-slate-400" />
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Periodo</span>
                </div>
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger className="w-[110px] h-9 text-[11px] font-black uppercase border-none focus:ring-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MESES.map(m => (
                      <SelectItem key={m.value} value={m.value} className="text-xs font-bold uppercase">{m.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="w-[80px] h-9 text-[11px] font-black uppercase border-none focus:ring-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ANIOS.map(a => (
                      <SelectItem key={a} value={a} className="text-xs font-bold uppercase">{a}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {role === 'admin' && (
                <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
                  <div className="px-3 py-1 flex items-center gap-2 border-r border-slate-100">
                    <Building2 className="size-4 text-slate-400" />
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sede</span>
                  </div>
                  <Select value={currentWarehouseId} onValueChange={setWarehouseId}>
                    <SelectTrigger className="w-[160px] h-9 text-[11px] font-black uppercase border-none focus:ring-0">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {warehouses.map(w => (
                        <SelectItem key={w.id} value={w.id} className="text-xs font-bold uppercase">{w.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-3 space-y-6">
              <WelcomeCard />
              {activeData && <RestockAlertCard data={activeData} />}
              <Card className="border-slate-200 shadow-sm overflow-hidden">
                <CardHeader className="bg-slate-50/50 border-b p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Activity className="size-4 text-red-600" />
                      <CardTitle className="text-xs font-black uppercase">Actividad Reciente</CardTitle>
                    </div>
                    <Link to="/movements" className="text-[10px] font-black uppercase text-red-600 hover:underline flex items-center gap-1">
                      Ver Todo <ChevronRight className="size-3" />
                    </Link>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="relative p-4 space-y-6 before:absolute before:left-6 before:top-4 before:bottom-4 before:w-[1px] before:bg-slate-100">
                    <AnimatePresence initial={false}>
                      {(logs ?? []).slice(0, 5).map((log) => (
                        <motion.div 
                          key={log.id} 
                          initial={{ opacity: 0, x: -10 }} 
                          animate={{ opacity: 1, x: 0 }} 
                          className="relative pl-8"
                        >
                          <div className="absolute left-[-2.5px] top-1.5 size-2 rounded-full bg-red-600 border-2 border-white" />
                          <div className="flex flex-col gap-1">
                            <span className="text-[9px] font-black text-slate-400 uppercase">
                              {format(new Date(log.timestamp), "HH:mm '·' dd MMM", { locale: es })}
                            </span>
                            <p className="text-[11px] font-bold text-slate-700 uppercase leading-tight line-clamp-2">
                              {log.message}
                            </p>
                            <span className="text-[9px] font-black text-red-600 uppercase tracking-widest">
                              {log.user}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="lg:col-span-9 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="USUARIOS ACTIVOS" value={activeData?.stats?.usuarios ?? 0} icon={Users} iconColor="text-blue-600 bg-blue-50" />
                <StatCard title="PEDIDOS PENDIENTES" value={activeData?.stats?.pendientes ?? 0} icon={Clock} iconColor="text-orange-600 bg-orange-50" />
                <StatCard title="TOTAL DESPACHOS" value={activeData?.stats?.despachos ?? 0} icon={Truck} trend="+12%" trendType="positive" iconColor="text-blue-600 bg-blue-50" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="VALOR INVENTARIO" value={activeData?.stats?.inventario ?? '€0'} icon={Package} iconColor="text-emerald-600 bg-emerald-50" />
                <StatCard title="EFECTIVIDAD" value={activeData?.stats?.efectividad ?? '0%'} icon={TrendingUp} trend="Meta 95%" iconColor="text-orange-600 bg-orange-50" />
                <StatCard title="SALIDA MENSUAL" value={activeData?.stats?.valorSalida ?? '€0'} icon={Wallet} iconColor="text-purple-600 bg-purple-50" />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {activeData && <MovementChart data={activeData.movement ?? []} />}
                {activeData && <OperatorsChart data={activeData.operators ?? []} />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}