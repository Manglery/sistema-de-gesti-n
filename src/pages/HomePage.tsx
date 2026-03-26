import React, { useState } from 'react';
import { toast } from "sonner";
import { AppLayout } from '@/components/layout/AppLayout';
import { WelcomeCard, StatCard, RestockAlertCard } from '@/components/dashboard/stat-cards';
import { MovementChart, OperatorsChart } from '@/components/dashboard/dashboard-charts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Clock, Truck, Package, TrendingUp, Wallet, Calendar, Filter, Building2 } from "lucide-react";
import { useAuthStore } from '@/store/use-auth-store';
import { useWarehouseData } from '@/hooks/use-warehouse-data';
export function HomePage() {
  const role = useAuthStore(s => s.role);
  const currentWarehouseId = useAuthStore(s => s.currentWarehouseId);
  const warehouses = useAuthStore(s => s.warehouses);
  const setWarehouseId = useAuthStore(s => s.setWarehouseId);
  const [selectedMonth, setSelectedMonth] = useState("marzo");
  const [selectedYear, setSelectedYear] = useState("2026");
  const { data: activeData, isLoading } = useWarehouseData(selectedMonth, selectedYear);
  const handleUpdate = () => {
    toast.success(`Datos de ${selectedMonth} ${selectedYear} actualizados`);
  };
  if (isLoading && !activeData) {
    return (
      <AppLayout className="bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          <div className="flex justify-between items-center">
            <Skeleton className="h-12 w-48" />
            <Skeleton className="h-12 w-64" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <Skeleton className="h-[400px] col-span-1" />
            <div className="col-span-3 space-y-6">
              <div className="grid grid-cols-3 gap-6">
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
              </div>
              <Skeleton className="h-[400px]" />
            </div>
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
              {role === 'admin' && (
                <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-slate-200 shadow-sm mr-2">
                  <div className="px-3 py-1 flex items-center gap-2 border-r border-slate-100">
                    <Building2 className="size-4 text-slate-400" />
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Almacén</span>
                  </div>
                  <Select value={currentWarehouseId} onValueChange={setWarehouseId}>
                    <SelectTrigger className="w-[180px] h-9 text-[11px] font-black uppercase border-none focus:ring-0 bg-transparent">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {warehouses?.map(w => (
                        <SelectItem key={w.id} value={w.id} className="text-xs font-bold uppercase">{w.name}</SelectItem>
                      )) || []}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 px-3 border-r border-slate-100">
                  <Calendar className="size-4 text-slate-400" />
                  <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                    <SelectTrigger className="w-[90px] h-9 text-[11px] font-black uppercase border-none focus:ring-0">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="enero">Enero</SelectItem>
                      <SelectItem value="febrero">Febrero</SelectItem>
                      <SelectItem value="marzo">Marzo</SelectItem>
                      <SelectItem value="abril">Abril</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center px-3">
                  <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger className="w-[70px] h-9 text-[11px] font-black border-none focus:ring-0">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2026">2026</SelectItem>
                      <SelectItem value="2025">2025</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <button 
                  onClick={handleUpdate}
                  className="bg-slate-900 hover:bg-red-600 text-white px-5 h-9 rounded-md text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2"
                >
                  <Filter className="size-3.5" />
                  Actualizar
                </button>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1 space-y-6">
              <WelcomeCard />
              {activeData && <RestockAlertCard data={activeData} />}
            </div>
            <div className="lg:col-span-3 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard 
                  title="USUARIOS ACTIVOS" 
                  value={activeData?.stats?.usuarios ?? 0} 
                  icon={Users} 
                  iconColor="text-blue-600 bg-blue-50"
                />
                <StatCard 
                  title="PEDIDOS PENDIENTES" 
                  value={activeData?.stats?.pendientes ?? 0} 
                  icon={Clock} 
                  iconColor="text-orange-600 bg-orange-50"
                />
                <StatCard 
                  title="TOTAL DESPACHOS" 
                  value={activeData?.stats?.despachos ?? 0} 
                  icon={Truck} 
                  trend="+12%" 
                  trendType="positive"
                  iconColor="text-blue-600 bg-blue-50"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard 
                  title="VALOR INVENTARIO" 
                  value={activeData?.stats?.inventario ?? '€0.00'} 
                  icon={Package} 
                  iconColor="text-emerald-600 bg-emerald-50"
                />
                <StatCard 
                  title="EFECTIVIDAD" 
                  value={activeData?.stats?.efectividad ?? '0%'} 
                  icon={TrendingUp} 
                  trend="Meta 95%"
                  iconColor="text-orange-600 bg-orange-50"
                />
                <StatCard 
                  title="SALIDA MENSUAL" 
                  value={activeData?.stats?.valorSalida ?? '€0.00'} 
                  icon={Wallet} 
                  iconColor="text-purple-600 bg-purple-50"
                />
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