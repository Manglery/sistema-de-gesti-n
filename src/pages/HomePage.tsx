import React from 'react';
import { toast } from "sonner";
import { AppLayout } from '@/components/layout/AppLayout';
import { 
  WelcomeCard, 
  StatCard, 
  RestockAlertCard 
} from '@/components/dashboard/stat-cards';
import { 
  MovementChart, 
  OperatorsChart 
} from '@/components/dashboard/dashboard-charts';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Users, 
  Clock, 
  Truck, 
  Package, 
  TrendingUp, 
  Wallet,
  Calendar,
  Filter,
  Building2
} from "lucide-react";
import { useAuthStore } from '@/store/use-auth-store';
import { WAREHOUSE_DATA } from '@/lib/mock-data';
export function HomePage() {
  const role = useAuthStore(s => s.role);
  const currentWarehouseId = useAuthStore(s => s.currentWarehouseId);
  const warehouses = useAuthStore(s => s.warehouses);
  const setWarehouseId = useAuthStore(s => s.setWarehouseId);
  const activeData = WAREHOUSE_DATA[currentWarehouseId] || WAREHOUSE_DATA.contadores;
  const handleUpdate = () => {
    toast.success("Datos actualizados correctamente");
  };
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
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">PANEL DE CONTROL E INDICADORES OPERATIVOS</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {role === 'admin' && (
                <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-slate-200 shadow-sm mr-2">
                  <div className="px-3 py-1 flex items-center gap-2">
                    <Building2 className="size-4 text-slate-400" />
                    <span className="text-xs font-bold text-slate-600">Almacén:</span>
                  </div>
                  <Select value={currentWarehouseId} onValueChange={setWarehouseId}>
                    <SelectTrigger className="w-[200px] h-9 text-[11px] font-black uppercase border-none focus:ring-0 bg-slate-50">
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
                <div className="flex items-center gap-2 px-3">
                  <Calendar className="size-4 text-slate-400" />
                  <Select defaultValue="marzo">
                    <SelectTrigger className="w-[100px] h-9 text-[11px] font-black uppercase border-none focus:ring-0">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="marzo">Marzo</SelectItem>
                      <SelectItem value="abril">Abril</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-px h-5 bg-slate-200" />
                <div className="flex items-center px-3">
                  <Select defaultValue="2026">
                    <SelectTrigger className="w-[80px] h-9 text-[11px] font-black border-none focus:ring-0">
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
                  className="bg-orange-500 hover:bg-orange-600 text-white px-5 h-9 rounded-md text-[10px] font-black uppercase tracking-widest transition-colors flex items-center gap-2"
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
              <RestockAlertCard />
            </div>
            <div className="lg:col-span-3 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard 
                  title="USUARIOS ACTIVOS" 
                  value={activeData.stats.usuarios} 
                  icon={Users} 
                  iconColor="text-blue-600 bg-blue-50"
                />
                <StatCard 
                  title="PEDIDOS PENDIENTES" 
                  value={activeData.stats.pendientes} 
                  icon={Clock} 
                  iconColor="text-orange-600 bg-orange-50"
                />
                <StatCard 
                  title="TOTAL DESPACHOS" 
                  value={activeData.stats.despachos} 
                  icon={Truck} 
                  trend="+12%" 
                  trendType="positive"
                  iconColor="text-blue-600 bg-blue-50"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard 
                  title="VALOR INVENTARIO" 
                  value={activeData.stats.inventario} 
                  icon={Package} 
                  iconColor="text-emerald-600 bg-emerald-50"
                />
                <StatCard 
                  title="EFECTIVIDAD" 
                  value={activeData.stats.efectividad} 
                  icon={TrendingUp} 
                  trend="Meta 95%"
                  iconColor="text-orange-600 bg-orange-50"
                />
                <StatCard 
                  title="SALIDA MENSUAL" 
                  value={activeData.stats.valorSalida} 
                  icon={Wallet} 
                  iconColor="text-purple-600 bg-purple-50"
                />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <MovementChart data={activeData.movement} />
                <OperatorsChart data={activeData.operators} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}