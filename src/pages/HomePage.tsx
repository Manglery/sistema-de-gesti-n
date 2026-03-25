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
  Filter
} from "lucide-react";
export function HomePage() {
  return (
    <AppLayout className="bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6 space-y-6">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-lg bg-red-600 flex items-center justify-center text-white shadow-lg shadow-red-200">
                <Package className="size-6" />
              </div>
              <div>
                <h1 className="text-xl font-black text-slate-900 uppercase tracking-tight leading-none">Dashboard</h1>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">PANEL DE CONTROL E INDICADORES</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden lg:flex flex-col items-end mr-4">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none mb-1">SISTEMA DE GESTION DE ALMACEN</p>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg shadow-sm">
                  <div className="size-2 rounded-full bg-red-600 animate-pulse" />
                  <span className="text-xs font-black text-slate-700">Almacén Principal</span>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 px-3">
                  <Calendar className="size-3.5 text-slate-400" />
                  <span className="text-xs font-bold text-slate-600">Mes</span>
                </div>
                <Select defaultValue="marzo">
                  <SelectTrigger className="w-[110px] h-8 text-[11px] font-black uppercase border-none focus:ring-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="marzo">Marzo</SelectItem>
                    <SelectItem value="abril">Abril</SelectItem>
                  </SelectContent>
                </Select>
                <div className="w-px h-4 bg-slate-200" />
                <div className="flex items-center gap-2 px-3">
                  <span className="text-xs font-bold text-slate-600">Año</span>
                </div>
                <Select defaultValue="2026">
                  <SelectTrigger className="w-[80px] h-8 text-[11px] font-black border-none focus:ring-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2026">2026</SelectItem>
                    <SelectItem value="2025">2025</SelectItem>
                  </SelectContent>
                </Select>
                <button className="bg-[#f97316] hover:bg-orange-600 text-white px-4 h-8 rounded-md text-[10px] font-black uppercase tracking-widest transition-colors flex items-center gap-2">
                  <Filter className="size-3" />
                  Filtrado
                </button>
              </div>
            </div>
          </div>
          {/* Main Statistics Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Left column: 4 stat cards */}
            <div className="lg:grid lg:grid-cols-1 lg:gap-4 space-y-4 lg:space-y-0">
              <div className="h-32">
                <WelcomeCard />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <StatCard 
                  title="USUARIOS ACTIVOS" 
                  value="115" 
                  icon={Users} 
                  iconColor="text-blue-600 bg-blue-50"
                />
                <StatCard 
                  title="PEDIDOS PENDIENTES" 
                  value="3" 
                  icon={Clock} 
                  iconColor="text-orange-600 bg-orange-50"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <StatCard 
                  title="TOTAL DE DESPACHOS" 
                  value="546" 
                  icon={Truck} 
                  trend="vs mes anterior" 
                  trendType="positive"
                  iconColor="text-blue-600 bg-blue-50"
                />
                <StatCard 
                  title="VALOR TOTAL INVENTARIO" 
                  value="€1.397.383.617,35" 
                  icon={Package} 
                  trend="vs mes anterior" 
                  trendType="positive"
                  iconColor="text-emerald-600 bg-emerald-50"
                />
              </div>
              <StatCard 
                title="EFECTIVIDAD DESPACHO" 
                value="93.3%" 
                icon={TrendingUp} 
                iconColor="text-orange-600 bg-orange-50"
              />
              <StatCard 
                title="VALOR SALIDA AL MES" 
                value="€93.608,47" 
                icon={Wallet} 
                iconColor="text-purple-600 bg-purple-50"
              />
            </div>
            {/* Right column: Tall alerts card spanning full height */}
            <div className="hidden lg:block">
              <RestockAlertCard />
            </div>
          </div>
          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <MovementChart />
            <OperatorsChart />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}