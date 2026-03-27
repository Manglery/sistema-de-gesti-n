import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  AlertTriangle,
  Package,
  TrendingUp,
  MapPin,
  Ghost
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/use-auth-store";
import { DashboardData } from "@/lib/mock-data";
const fadeInUp = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }
};
export function WelcomeCard() {
  const userName = useAuthStore(s => s.userName);
  const currentWarehouseId = useAuthStore(s => s.currentWarehouseId);
  const warehouses = useAuthStore(s => s.warehouses);
  const activeWarehouse = warehouses?.find(w => w.id === currentWarehouseId);
  return (
    <motion.div {...fadeInUp}>
      <Card className="bg-slate-900 text-white border-none shadow-2xl relative overflow-hidden h-full flex flex-col justify-center px-6 min-h-[180px] group transition-all duration-500 hover:shadow-red-900/10">
        <div className="absolute -top-10 -right-10 p-4 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-700">
          <Package className="w-64 h-64 rotate-12" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 via-transparent to-transparent pointer-events-none" />
        <div className="flex items-center gap-5 relative z-10">
            <div className="size-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-white font-black text-2xl shadow-inner group-hover:scale-105 transition-transform">
              {userName?.charAt(0) || 'U'}
            </div>
          <div>
            <p className="text-[10px] text-red-500 uppercase font-black tracking-[0.25em] mb-1.5">SISTEMA ACCIONA WMS</p>
            <h2 className="text-2xl font-black tracking-tight leading-none truncate max-w-[200px]">
              Hola, {userName ? userName.split(' ')[0] : 'Usuario'}
            </h2>
          </div>
        </div>
        <div className="mt-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm p-4 relative z-10 hover:bg-white/10 transition-colors">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-lg bg-red-600 flex items-center justify-center text-white shadow-lg shadow-red-900/50">
              <MapPin className="size-5" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest leading-none mb-1">ACCESO ACTUAL</span>
              <span className="text-sm font-bold text-white uppercase tracking-tight truncate">
                {activeWarehouse?.name || 'Cargando...'}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
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
  isLoading?: boolean;
}
export function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendType = 'neutral', 
  subtitle, 
  className,
  iconColor = "text-blue-600 bg-blue-50",
  isLoading = false
}: StatCardProps) {
  return (
    <motion.div {...fadeInUp} className="h-full">
      <Card className={cn("hover-lift h-full border-slate-200 group bg-white shadow-sm overflow-hidden", className)}>
        <CardHeader className="flex flex-row items-center justify-between pb-3 pt-6 px-6">
          <CardTitle className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{title}</CardTitle>
          <div className={cn("p-3 rounded-2xl transition-all duration-300 group-hover:rotate-12", iconColor)}>
            <Icon className="w-5 h-5" />
          </div>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          {isLoading ? (
            <Skeleton className="h-10 w-32 mb-4" />
          ) : (
            <div className="text-4xl font-black text-slate-900 tracking-tighter leading-none mb-4 truncate">{value}</div>
          )}
          {(trend || subtitle) && (
            <div className="flex items-center gap-2.5">
              {trend && !isLoading && (
                <span className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter",
                  trendType === 'positive' && "text-emerald-600 bg-emerald-50 border border-emerald-100",
                  trendType === 'negative' && "text-red-600 bg-red-50 border border-red-100 animate-pulse",
                  trendType === 'neutral' && "text-slate-500 bg-slate-100 border border-slate-200"
                )}>
                  {trendType === 'positive' && <TrendingUp className="size-3" />}
                  {trend}
                </span>
              )}
              {subtitle && <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{subtitle}</span>}
              {isLoading && <Skeleton className="h-4 w-20" />}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
export function RestockAlertCard({ data, isLoading = false }: { data: DashboardData | null, isLoading?: boolean }) {
  const alerts = data?.alerts || [];
  return (
    <motion.div {...fadeInUp} className="h-full">
      <Card className="h-full border-slate-200 shadow-sm overflow-hidden flex flex-col bg-white">
        <CardHeader className="pb-4 bg-slate-50/50 border-b px-6 pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn("p-2 rounded-xl", (alerts.length > 0 && !isLoading) ? "bg-red-50 text-red-600 animate-pulse" : "bg-slate-100 text-slate-400")}>
                <AlertTriangle className="size-5" />
              </div>
              <CardTitle className="text-sm font-black text-slate-900 uppercase tracking-tight">
                Reposición Crítica
              </CardTitle>
            </div>
            {alerts.length > 0 && !isLoading && (
              <Badge variant="destructive" className="bg-red-600 hover:bg-red-700 font-black text-[10px] px-2.5 py-1 rounded-lg border-none">
                {alerts.length} ALERTAS
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0 flex-1 overflow-auto max-h-[500px]">
          {isLoading ? (
            <div className="p-6 space-y-6">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-20 w-full rounded-xl" />)}
            </div>
          ) : alerts.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {alerts.map((item) => (
                <div key={item.id} className="p-6 hover:bg-slate-50 transition-colors group relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="flex justify-between items-start mb-4 gap-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-red-600 uppercase tracking-[0.15em] mb-1.5">{item.code}</span>
                      <span className="text-xs font-black text-slate-800 leading-tight uppercase line-clamp-2">{item.name}</span>
                    </div>
                  </div>
                  <div className="space-y-3 mt-4">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-tight">
                      <span className="text-slate-400">Stock Actual</span>
                      <span className={cn(item.current === 0 ? "text-red-600 font-black" : "text-slate-900")}>
                        {item.current} / {item.min} uds
                      </span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={cn("h-full transition-all duration-1000", item.current === 0 ? "bg-red-600" : "bg-red-500")} 
                        style={{ width: `${Math.min((item.current / (item.min || 1)) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center flex flex-col items-center justify-center gap-5 h-full opacity-60">
              <div className="size-20 rounded-full bg-slate-50 flex items-center justify-center">
                <Ghost className="size-10 text-slate-200" />
              </div>
              <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Almacén Abastecido</p>
                <p className="text-[10px] font-bold text-slate-300 uppercase mt-1">No hay alertas de reposición</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}