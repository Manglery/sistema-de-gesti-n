import React from 'react';
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
  ArrowUpRight,
  MapPin
} from "lucide-react";
export function HomePage() {
  return (
    <AppLayout className="bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12 space-y-8">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard General</h1>
              <div className="flex items-center gap-2 text-muted-foreground mt-1">
                <MapPin className="size-4" />
                <span className="text-sm font-medium">Almacén Central - Zona Logística A</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Select defaultValue="mayo">
                <SelectTrigger className="w-[140px] bg-white">
                  <SelectValue placeholder="Mes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mayo">Mayo</SelectItem>
                  <SelectItem value="junio">Junio</SelectItem>
                  <SelectItem value="julio">Julio</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="2024">
                <SelectTrigger className="w-[100px] bg-white">
                  <SelectValue placeholder="Año" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {/* Top Grid: Welcome + Basic Stats + Alerts */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-2 md:col-span-1">
              <WelcomeCard />
            </div>
            <div className="lg:col-span-1 md:col-span-1">
              <StatCard 
                title="Usuarios Activos" 
                value="115" 
                icon={Users} 
                trend="+12%" 
                trendType="positive"
                subtitle="vs mes anterior"
              />
            </div>
            <div className="lg:col-span-1 md:col-span-1">
              <StatCard 
                title="Pedidos Pendientes" 
                value="03" 
                icon={Clock} 
                trend="Baja prioridad" 
                trendType="neutral"
                subtitle="Requieren atención"
              />
            </div>
            <div className="lg:col-span-2 md:col-span-2 lg:row-start-2">
              <RestockAlertCard />
            </div>
            <div className="lg:col-span-1 lg:row-start-2 md:col-span-1">
              <StatCard 
                title="Despachos Hoy" 
                value="278" 
                icon={Truck} 
                trend="+45" 
                trendType="positive"
                subtitle="Pedidos completados"
              />
            </div>
            <div className="lg:col-span-1 lg:row-start-2 md:col-span-1">
              <StatCard 
                title="Valor de Inventario" 
                value="€1.397.383.617,35" 
                icon={Wallet} 
                trend="Estable" 
                trendType="neutral"
                subtitle="Total activos"
              />
            </div>
            <div className="lg:col-span-1 lg:row-start-2 hidden md:block">
              <StatCard 
                title="Efectividad Operativa" 
                value="94%" 
                icon={TrendingUp} 
                trend="+2.4%" 
                trendType="positive"
                subtitle="KPI de salida"
              />
            </div>
          </div>
          {/* Summary Large Stat Card */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-4">
              <div className="bg-white border rounded-xl p-6 flex items-center justify-between shadow-sm">
                <div>
                  <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">Valor Total de Salidas (Mes Actual)</p>
                  <div className="flex items-end gap-3 mt-2">
                    <h2 className="text-4xl font-extrabold text-slate-900 tracking-tighter">€1.397.383,617.35</h2>
                    <div className="flex items-center text-green-600 bg-green-50 px-2 py-1 rounded-md text-sm font-bold mb-1">
                      <ArrowUpRight className="size-4 mr-1" />
                      14.2%
                    </div>
                  </div>
                </div>
                <div className="hidden md:block text-right">
                  <p className="text-xs text-muted-foreground font-medium">Última actualización</p>
                  <p className="text-sm font-bold text-slate-700">Hoy, 14:32 PM</p>
                </div>
              </div>
            </div>
          </div>
          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-8">
            <MovementChart />
            <OperatorsChart />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}