import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  AlertTriangle,
  Package,
  TrendingUp,
  MapPin
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/use-auth-store";
import { WAREHOUSE_DATA } from "@/lib/mock-data";
export function WelcomeCard() {
  const userName = useAuthStore(s => s.userName);
  const currentWarehouseId = useAuthStore(s => s.currentWarehouseId);
  const warehouses = useAuthStore(s => s.warehouses);
  const activeWarehouse = warehouses.find(w => w.id === currentWarehouseId);
  return (
    <Card className="bg-slate-900 text-white border-none shadow-xl relative overflow-hidden h-full flex flex-col justify-center px-6 min-h-[160px]">
      <div className="absolute top-0 right-0 p-4 opacity-5">
        <Package className="w-32 h-32 rotate-12" />
      </div>
      <div className="flex items-center gap-4 relative z-10">
        <div className="size-14 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-white font-black text-xl shadow-inner">
          {userName.charAt(0)}
        </div>
        <div>
          <p className="text-[10px] text-slate-400 uppercase font-black tracking-[0.2em] mb-1">BIENVENIDO DE NUEVO</p>
          <h2 className="text-2xl font-black tracking-tight">{userName.split(' ')[0]}</h2>
        </div>
      </div>
      <div className="mt-6 rounded-xl bg-slate-800/60 border border-slate-700/50 p-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded bg-slate-900 flex items-center justify-center text-red-500 shadow-lg">
            <MapPin className="size-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest leading-none mb-1">ACCESO ACTUAL</span>
            <span className="text-sm font-bold text-white uppercase tracking-tight">{activeWarehouse?.name || 'Almacén Principal'}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: string;
  trendType?: 'positive' | 'negative' | 'neutral';
  subtitle?: string;
  className?: string;
  iconColor?: string;
}
export function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendType = 'neutral', 
  subtitle, 
  className,
  iconColor = "text-blue-600 bg-blue-50"
}: StatCardProps) {
  return (
    <Card className={cn("hover:shadow-lg transition-all duration-300 h-full border-slate-200 group bg-white", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-3 pt-5 px-5">
        <CardTitle className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</CardTitle>
        <div className={cn("p-2.5 rounded-xl transition-transform group-hover:scale-110", iconColor)}>
          <Icon className="w-5 h-5" />
        </div>
      </CardHeader>
      <CardContent className="px-5 pb-5">
        <div className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-3 truncate">{value}</div>
        {trend && (
          <div className="flex items-center gap-2">
            <span className={cn(
              "flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase",
              trendType === 'positive' && "text-emerald-600 bg-emerald-50",
              trendType === 'negative' && "text-red-600 bg-red-50",
              trendType === 'neutral' && "text-slate-500 bg-slate-100"
            )}>
              {trendType === 'positive' && <TrendingUp className="size-3" />}
              {trend}
            </span>
            {subtitle && <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{subtitle}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
export function RestockAlertCard() {
  const currentWarehouseId = useAuthStore(s => s.currentWarehouseId);
  const activeData = WAREHOUSE_DATA[currentWarehouseId] || WAREHOUSE_DATA.contadores;
  const alerts = activeData.alerts;
  return (
    <Card className="h-full border-slate-200 shadow-sm overflow-hidden flex flex-col bg-white">
      <CardHeader className="pb-4 bg-slate-50/50 border-b px-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-red-50 rounded-lg text-red-600">
              <AlertTriangle className="size-5" />
            </div>
            <CardTitle className="text-sm font-black text-slate-900 uppercase tracking-tight">
              Reposición Prioritaria
            </CardTitle>
          </div>
          <Badge variant="destructive" className="bg-red-600 hover:bg-red-700 font-black text-[10px] px-2.5 py-0.5 rounded-md border-none">
            {alerts.length} alertas
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0 flex-1 overflow-auto max-h-[500px]">
        {alerts.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {alerts.map((item) => (
              <div key={item.id} className="p-5 hover:bg-slate-50 transition-colors group">
                <div className="flex justify-between items-start mb-3 gap-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-1">{item.code}</span>
                    <span className="text-[11px] font-bold text-slate-700 leading-tight uppercase line-clamp-2">{item.name}</span>
                  </div>
                </div>
                <div className="space-y-2.5 mt-4">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-tight">
                    <span className="text-slate-400">Stock Actual</span>
                    <span className={cn(item.current === 0 ? "text-red-600" : "text-slate-900")}>
                      {item.current} / {item.min} uds
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={cn("h-full transition-all duration-1000", item.current === 0 ? "bg-red-600" : "bg-red-500")} 
                      style={{ width: `${Math.min((item.current / item.min) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-10 text-center flex flex-col items-center justify-center gap-4 h-full">
            <Package className="size-12 text-slate-200" />
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sin alertas pendientes</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}