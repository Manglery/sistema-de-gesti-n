import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BarChart3, TrendingUp } from "lucide-react";
import { motion } from 'framer-motion';
export interface MovementDataItem {
  name: string;
  cantidad: number;
  valor: number;
}
export interface OperatorDataItem {
  name: string;
  valor: number;
}
interface MovementChartProps {
  data: MovementDataItem[];
}
interface OperatorsChartProps {
  data: OperatorDataItem[];
}
const BRAND_RED = "#ef4444";
const SLATE_DARK = "#0f172a";
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/95 backdrop-blur-md border border-white/10 p-4 rounded-xl shadow-2xl space-y-2">
        <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center justify-between gap-6">
            <span className="text-[11px] font-bold text-slate-400 uppercase">{entry.name}:</span>
            <span className="text-xs font-black text-white">
              {entry.name.includes('Valor') ? `€${entry.value.toLocaleString()}` : entry.value.toLocaleString()}
            </span>
          </div>
        ))}
        <div className="pt-2 mt-2 border-t border-white/10 flex items-center gap-2">
          <TrendingUp className="size-3 text-emerald-500" />
          <span className="text-[9px] font-black text-emerald-500 uppercase tracking-tighter">Rendimiento Óptimo</span>
        </div>
      </div>
    );
  }
  return null;
};
const MovementChart = React.memo(({ data }: MovementChartProps) => {
  return (
    <Card className="h-full border-slate-200 shadow-sm overflow-hidden bg-white hover:shadow-md transition-shadow">
      <CardHeader className="pb-4 bg-slate-50/50 border-b px-6 pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-50 rounded-xl">
              <BarChart3 className="size-5 text-red-600" />
            </div>
            <div>
              <CardTitle className="text-sm font-black text-slate-900 uppercase tracking-tight">Top Materiales</CardTitle>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Volumen de Movimiento</p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-8">
        <div className="h-[340px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 8, fontWeight: 800 }} 
                angle={-20}
                textAnchor="end"
                interval={0}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 800 }}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
              <Bar 
                name="Cantidad" 
                dataKey="cantidad" 
                fill={BRAND_RED} 
                radius={[4, 4, 0, 0]} 
                barSize={24}
                animationDuration={1500}
              />
              <Bar 
                name="Valor (€)" 
                dataKey="valor" 
                fill={SLATE_DARK} 
                radius={[4, 4, 0, 0]} 
                barSize={24} 
                animationDuration={2000}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
});
MovementChart.displayName = 'MovementChart';
const OperatorsChart = React.memo(({ data }: OperatorsChartProps) => {
  return (
    <Card className="h-full border-slate-200 shadow-sm overflow-hidden bg-white hover:shadow-md transition-shadow">
      <CardHeader className="pb-4 bg-slate-50/50 border-b px-6 pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-900 rounded-xl">
              <Users className="size-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-sm font-black text-slate-900 uppercase tracking-tight">Rendimiento Operarios</CardTitle>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Pedidos despachados (Mes)</p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-8">
        <div className="h-[340px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              layout="vertical" 
              data={data} 
              margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
              <XAxis type="number" hide />
              <YAxis 
                dataKey="name" 
                type="category" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#475569', fontSize: 10, fontWeight: 800 }}
                width={120}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
              <Bar 
                dataKey="valor" 
                name="Pedidos"
                fill={BRAND_RED} 
                radius={[0, 6, 6, 0]} 
                barSize={16}
                animationDuration={1500}
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={BRAND_RED} opacity={1 - (index * 0.1)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
});
OperatorsChart.displayName = 'OperatorsChart';
export { MovementChart, OperatorsChart };