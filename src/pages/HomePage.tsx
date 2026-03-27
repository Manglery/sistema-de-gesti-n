import React, { useState, useEffect } from 'react';
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
  ChevronRight,
  RefreshCw
} from "lucide-react";
import { useAuthStore } from '@/store/use-auth-store';
import { useActivityStore } from '@/store/use-activity-store';
import { useWarehouseData } from '@/hooks/use-warehouse-data';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
const MESES = [
  { value: "01", label: "Enero" }, { value: "02", label: "Febrero" },
  { value: "03", label: "Marzo" }, { value: "04", label: "Abril" },
  { value: "05", label: "Mayo" }, { value: "06", label: "Junio" },
  { value: "07", label: "Julio" }, { value: "08", label: "Agosto" },
  { value: "09", label: "Septiembre" }, { value: "10", label: "Octubre" },
  { value: "11", label: "Noviembre" }, { value: "12", label: "Diciembre" },
];
const ANIOS = ["2024", "2025", "2026"];
export function HomePage() {
  const role = useAuthStore(s => s.role);
  const currentWarehouseId = useAuthStore(s => s.currentWarehouseId);
  const warehouses = useAuthStore(s => s.warehouses);
  const setWarehouseId = useAuthStore(s => s.setWarehouseId);
  const logs = useActivityStore(s => s.logs);
  const fetchLogs = useActivityStore(s => s.fetchLogs);
  const [selectedMonth, setSelectedMonth] = useState("03");
  const [selectedYear, setSelectedYear] = useState("2025");
  const { data: activeData, isLoading, refetch } = useWarehouseData(selectedMonth, selectedYear);
  useEffect(() => {
    if (currentWarehouseId) {
      fetchLogs(currentWarehouseId);
    }
  }, [currentWarehouseId, fetchLogs]);
  useEffect(() => {
    refetch();
  }, [selectedMonth, selectedYear, currentWarehouseId, refetch]);
  return (
    <AppLayout className="bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12 space-y-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="size-14 rounded-2xl bg-red-600 flex items-center justify-center text-white shadow-2xl shadow-red-200 rotate-3 hover:rotate-0 transition-transform duration-300">
                <Package className="size-8" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none">Dashboard Central</h1>
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2 flex items-center gap-2">
                  <span className={cn("size-1.5 rounded-full bg-emerald-500", isLoading ? "animate-ping" : "animate-pulse")} />
                  {isLoading ? 'Actualizando Métricas...' : 'Monitoreo de Operaciones en Tiempo Real'}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur p-1.5 rounded-xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
                <div className="px-3 py-1.5 flex items-center gap-2 border-r border-slate-100">
                  <Calendar className="size-4 text-slate-400" />
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Periodo</span>
                </div>
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger className="w-[120px] h-9 text-[11px] font-black uppercase border-none focus:ring-0 bg-transparent">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MESES.map(m => (
                      <SelectItem key={m.value} value={m.value} className="text-xs font-bold uppercase">{m.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="w-[90px] h-9 text-[11px] font-black uppercase border-none focus:ring-0 bg-transparent">
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
                <div className="flex items-center gap-2 bg-white/80 backdrop-blur p-1.5 rounded-xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
                  <div className="px-3 py-1.5 flex items-center gap-2 border-r border-slate-100">
                    <Building2 className="size-4 text-slate-400" />
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sede</span>
                  </div>
                  <Select value={currentWarehouseId} onValueChange={setWarehouseId}>
                    <SelectTrigger className="w-[180px] h-9 text-[11px] font-black uppercase border-none focus:ring-0 bg-transparent">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(warehouses ?? []).map(w => (
                        <SelectItem key={w.id} value={w.id} className="text-xs font-bold uppercase">{w.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <button 
                onClick={() => refetch()}
                className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-red-600 hover:shadow-md transition-all active:scale-95"
              >
                <RefreshCw className={cn("size-5", isLoading && "animate-spin")} />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-3 space-y-8">
              <WelcomeCard />
              <RestockAlertCard data={activeData} isLoading={isLoading} />
              <Card className="border-slate-200 shadow-sm overflow-hidden bg-white hover:shadow-md transition-shadow">
                <CardHeader className="bg-slate-50/50 border-b p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-red-50 rounded-lg">
                        <Activity className="size-4 text-red-600" />
                      </div>
                      <CardTitle className="text-xs font-black uppercase tracking-tight text-slate-800">Actividad</CardTitle>
                    </div>
                    <Link to="/movements" className="text-[10px] font-black uppercase text-red-600 hover:text-red-700 flex items-center gap-1 transition-colors">
                      Ver Todo <ChevronRight className="size-3" />
                    </Link>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="relative p-5 space-y-7 before:absolute before:left-[27px] before:top-6 before:bottom-6 before:w-[1px] before:bg-slate-100">
                    <AnimatePresence initial={false}>
                      {(logs ?? []).length > 0 ? (logs ?? []).slice(0, 4).map((log) => (
                        <motion.div key={log.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="relative pl-9">
                          <div className="absolute left-[2px] top-1.5 size-2 rounded-full bg-red-600 border-2 border-white ring-4 ring-red-50" />
                          <div className="flex flex-col gap-1.5 min-w-0">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">
                              {log.timestamp ? format(new Date(log.timestamp), "HH:mm '·' dd MMM", { locale: es }) : '-'}
                            </span>
                            <p className="text-[11px] font-bold text-slate-700 uppercase leading-tight line-clamp-2">
                              {log.message}
                            </p>
                            <span className="text-[9px] font-black text-red-600 uppercase tracking-widest bg-red-50 w-fit px-1.5 py-0.5 rounded">
                              {log.user}
                            </span>
                          </div>
                        </motion.div>
                      )) : (
                        <div className="py-10 text-center">
                          <p className="text-[10px] font-black text-slate-300 uppercase">Sin actividad reciente</p>
                        </div>
                      )}
                    </AnimatePresence>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="lg:col-span-9 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard isLoading={isLoading} title="USUARIOS ACTIVOS" value={activeData?.stats?.usuarios ?? 0} icon={Users} iconColor="text-blue-600 bg-blue-50" subtitle="En las últimas 24h" />
                <StatCard isLoading={isLoading} title="PEDIDOS PENDIENTES" value={activeData?.stats?.pendientes ?? 0} icon={Clock} iconColor="text-orange-600 bg-orange-50" trend="Prioridad Alta" trendType="negative" />
                <StatCard isLoading={isLoading} title="TOTAL DESPACHOS" value={activeData?.stats?.despachos ?? 0} icon={Truck} trend="+12.4%" trendType="positive" iconColor="text-blue-600 bg-blue-50" subtitle="vs mes anterior" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard isLoading={isLoading} title="VALOR INVENTARIO" value={activeData?.stats?.inventario ?? '€0'} icon={Package} iconColor="text-emerald-600 bg-emerald-50" subtitle="Valorización Stock" />
                <StatCard isLoading={isLoading} title="EFECTIVIDAD" value={activeData?.stats?.efectividad ?? '0%'} icon={TrendingUp} trend="Meta 95%" trendType="neutral" iconColor="text-orange-600 bg-orange-50" />
                <StatCard isLoading={isLoading} title="SALIDA MENSUAL" value={activeData?.stats?.valorSalida ?? '€0'} icon={Wallet} iconColor="text-purple-600 bg-purple-50" trend="En curso" trendType="positive" />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {isLoading ? (
                  <>
                    <Skeleton className="h-[400px] rounded-2xl" />
                    <Skeleton className="h-[400px] rounded-2xl" />
                  </>
                ) : (
                  <>
                    <MovementChart data={activeData?.movement ?? []} />
                    <OperatorsChart data={activeData?.operators ?? []} />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}