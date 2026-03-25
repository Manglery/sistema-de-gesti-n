import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Clock, 
  Truck, 
  Wallet, 
  TrendingUp, 
  AlertTriangle,
  ArrowRight,
  Package
} from "lucide-react";
import { cn } from "@/lib/utils";
export function WelcomeCard() {
  return (
    <Card className="bg-slate-900 text-white border-none shadow-xl relative overflow-hidden h-full flex flex-col justify-between">
      <div className="absolute top-0 right-0 p-8 opacity-10">
        <Package className="w-32 h-32 rotate-12" />
      </div>
      <CardHeader className="relative z-10 pb-2">
        <CardTitle className="text-2xl font-bold">¡Hola de nuevo, Admin!</CardTitle>
        <p className="text-slate-400 text-sm mt-1">Aquí tienes el resumen de hoy en el almacén central.</p>
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="flex items-center gap-4 mt-4">
          <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm">
            <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Estado de Red</p>
            <p className="text-xl font-bold text-green-400">Excelente</p>
          </div>
          <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm">
            <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Sincronización</p>
            <p className="text-xl font-bold">Hace 2m</p>
          </div>
        </div>
      </CardContent>
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
}
export function StatCard({ title, value, icon: Icon, trend, trendType = 'neutral', subtitle, className }: StatCardProps) {
  return (
    <Card className={cn("hover:shadow-md transition-shadow", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-tight">{title}</CardTitle>
        <div className="p-2 bg-slate-50 rounded-lg">
          <Icon className="w-4 h-4 text-slate-500" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        {(trend || subtitle) && (
          <div className="flex items-center gap-2 mt-1">
            {trend && (
              <span className={cn(
                "text-xs font-semibold",
                trendType === 'positive' && "text-green-600",
                trendType === 'negative' && "text-red-600",
                trendType === 'neutral' && "text-slate-500"
              )}>
                {trend}
              </span>
            )}
            {subtitle && <span className="text-xs text-muted-foreground">{subtitle}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
const restockItems = [
  { id: 1, name: "Cable Coaxial RG6", stock: 12, min: 50 },
  { id: 2, name: "Router 5G Enterprise", stock: 5, min: 20 },
  { id: 3, name: "Conector RJ45 CAT7", stock: 85, min: 200 },
];
export function RestockAlertCard() {
  return (
    <Card className="h-full border-red-100 bg-red-50/30">
      <CardHeader className="pb-3 border-b border-red-100/50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-bold text-red-900 flex items-center gap-2 uppercase tracking-tighter">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            Alertas de Reposición
          </CardTitle>
          <Badge variant="outline" className="bg-red-100 text-red-700 border-red-200">
            {restockItems.length} Críticos
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-4 px-0">
        <div className="space-y-1">
          {restockItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between px-4 py-2 hover:bg-red-50 transition-colors group">
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-slate-800">{item.name}</span>
                <span className="text-[10px] text-red-600 font-bold uppercase tracking-wider">Stock: {item.stock} / Min: {item.min}</span>
              </div>
              <button className="p-1.5 bg-white rounded-md border border-red-200 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight className="w-3.5 h-3.5 text-red-600" />
              </button>
            </div>
          ))}
        </div>
        <div className="px-4 mt-4">
          <button className="w-full py-2 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700 transition-colors shadow-sm">
            GESTIONAR TODO
          </button>
        </div>
      </CardContent>
    </Card>
  );
}