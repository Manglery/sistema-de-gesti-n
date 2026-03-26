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
import { Users, BarChart3 } from "lucide-react";

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
const SLATE_DARK = "#334155";

const MovementChart = React.memo(({ data }: MovementChartProps) => {
  return (
    <Card className="h-full border-slate-200">
      <CardHeader className="pb-2 flex flex-row items-center gap-2">
        <div className="p-1.5 bg-red-50 rounded-lg">
          <BarChart3 className="size-4 text-red-600" />
        </div>
        <CardTitle className="text-xs font-black text-slate-800 uppercase tracking-tight">10 Productos Más Movimiento</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[380px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 8, fontWeight: 700 }} 
                angle={-25}
                textAnchor="end"
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
              />
              <Tooltip cursor={{ fill: '#f8fafc' }} />
              <Bar name="Cantidad" dataKey="cantidad" fill={BRAND_RED} radius={[2, 2, 0, 0]} barSize={18} />
              <Bar name="Valor (€)" dataKey="valor" fill={SLATE_DARK} radius={[2, 2, 0, 0]} barSize={18} />
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
    <Card className="h-full border-slate-200">
      <CardHeader className="pb-2 flex flex-row items-center gap-2">
        <div className="p-1.5 bg-red-50 rounded-lg">
          <Users className="size-4 text-red-600" />
        </div>
        <CardTitle className="text-xs font-black text-slate-800 uppercase tracking-tight">Operarios — Mayor valor de pedido del mes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[380px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              layout="vertical" 
              data={data} 
              margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
              <XAxis type="number" hide />
              <YAxis 
                dataKey="name" 
                type="category" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 9, fontWeight: 700 }}
                width={120}
              />
              <Tooltip cursor={{ fill: '#f8fafc' }} />
              <Bar dataKey="valor" fill={BRAND_RED} radius={[0, 4, 4, 0]} barSize={12}>
                {React.useMemo(() => 
                  data.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={BRAND_RED} opacity={1 - (index * 0.05)} />
                  )), [data.length]
                )}
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
//