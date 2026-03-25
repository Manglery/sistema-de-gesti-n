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
  Wallet, 
  TrendingUp, 
  Filter,
  ChevronRight,
  Home,
  Package
} from "lucide-react";
export function HomePage() {
  return (
    <AppLayout className="bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6 md:py-8 space-y-6">
          {/* Top Breadcrumb & Title Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <Home className="size-3" />
                <span>Dashboard</span>
                <ChevronRight className="size-3" />
                <span className="text-red-500">Panel de Control</span>
              </div>
              <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">
                Panel de Control e Indicadores
              </h1>
            </div>
            <div className="text-right hidden md:block">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Almacén Activo</p>
              <p className="text-lg font-black text-slate-800 tracking-tight">Almacén Principal</p>
            </div>
          </div>
          {/* Filters Bar */}
          <div className="bg-white p-3 rounded-xl border border-slate-200 flex flex-wrap items-center gap-3 shadow-sm">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-100">
              <Filter className="size-3.5 text-slate-500" />
              <span className="text-xs font-bold text-slate-700 uppercase tracking-tight">Filtrar por:</span>
            </div>
            <Select defaultValue="mayo">
              <SelectTrigger className="w-[140px] h-9 text-xs font-bold border-slate-200">
                <SelectValue placeholder="Mes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mayo">Mayo</SelectItem>
                <SelectItem value="junio">Junio</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="2024">
              <SelectTrigger className="w-[100px] h-9 text-xs font-bold border-slate-200">
                <SelectValue placeholder="Año" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
              </SelectContent>
            </Select>
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 h-9 rounded-lg text-xs font-black uppercase tracking-widest transition-colors flex items-center gap-2 ml-auto">
              <Filter className="size-3" />
              Filtrado
            </button>
          </div>
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Column 1-2: Welcome & Stats Row 2 */}
            <div className="lg:col-span-2 space-y-4">
              <div className="h-48">
                <WelcomeCard />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <StatCard 
                  title="Total Despachos" 
                  value="546" 
                  icon={Truck} 
                  trend="+12%" 
                  trendType="positive"
                  subtitle="vs mes anterior"
                />
                <StatCard 
                  title="Efectividad" 
                  value="93.3%" 
                  icon={TrendingUp} 
                  trend="+2.1%" 
                  trendType="positive"
                  subtitle="KPI de salida"
                />
              </div>
            </div>
            {/* Column 3: High-Priority Stats */}
            <div className="lg:col-span-1 space-y-4">
              <StatCard 
                title="Usuarios Activos" 
                value="115" 
                icon={Users} 
                trend="+8" 
                trendType="positive"
                subtitle="conectados ahora"
                className="h-[calc(50%-8px)]"
              />
              <StatCard 
                title="Pedidos Pendientes" 
                value="03" 
                icon={Clock} 
                trend="BAJA" 
                trendType="neutral"
                subtitle="Prioridad global"
                className="h-[calc(50%-8px)]"
                colorTheme="red"
              />
            </div>
            {/* Column 4: Alerts Span Vertical */}
            <div className="lg:col-span-1 md:row-span-2 lg:row-span-2">
              <RestockAlertCard />
            </div>
            {/* Full Width Row 2: Large Stats */}
            <div className="lg:col-span-2">
              <StatCard 
                title="Valor Inventario Total" 
                value="€1.397.383.617,35" 
                icon={Package} 
                trend="Estable" 
                trendType="neutral"
                subtitle="Activos en almacén"
              />
            </div>
            <div className="lg:col-span-1">
              <StatCard 
                title="Valor de Salida (Mes)" 
                value="€93.608,47" 
                icon={Wallet} 
                trend="+14.2%" 
                trendType="positive"
                subtitle="vs mes anterior"
                colorTheme="purple"
              />
            </div>
          </div>
          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <MovementChart />
            <OperatorsChart />
          </div>
          {/* Bottom Summary Banner */}
          <div className="bg-slate-900 rounded-xl p-6 text-white flex flex-col md:flex-row items-center justify-between gap-4 border-l-8 border-red-600">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Resumen Mensual de Operaciones</p>
              <h3 className="text-xl font-black tracking-tight">Cierre proyectado al 31 de Mayo: <span className="text-red-500">€145.200,00</span></h3>
            </div>
            <div className="flex gap-4">
              <div className="text-center px-4 border-r border-slate-800">
                <p className="text-[10px] text-slate-500 font-bold uppercase">Entradas</p>
                <p className="font-bold">1,240</p>
              </div>
              <div className="text-center px-4 border-r border-slate-800">
                <p className="text-[10px] text-slate-500 font-bold uppercase">Salidas</p>
                <p className="font-bold">980</p>
              </div>
              <div className="text-center px-4">
                <p className="text-[10px] text-slate-500 font-bold uppercase">Merma</p>
                <p className="font-bold text-red-500">0.2%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}