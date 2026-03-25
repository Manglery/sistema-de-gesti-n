import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend,
  Cell
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
const movementData = [
  { name: 'P001', entradas: 400, salidas: 240 },
  { name: 'P002', entradas: 300, salidas: 139 },
  { name: 'P003', entradas: 200, salidas: 980 },
  { name: 'P004', entradas: 278, salidas: 390 },
  { name: 'P005', entradas: 189, salidas: 480 },
  { name: 'P006', entradas: 239, salidas: 380 },
  { name: 'P007', entradas: 349, salidas: 430 },
  { name: 'P008', entradas: 410, salidas: 310 },
  { name: 'P009', entradas: 290, salidas: 290 },
  { name: 'P010', entradas: 380, salidas: 190 },
];
const operatorData = [
  { name: 'M. García', valor: 45000 },
  { name: 'J. López', valor: 38500 },
  { name: 'L. Martínez', valor: 32000 },
  { name: 'A. Ruiz', valor: 31000 },
  { name: 'S. Pérez', valor: 28000 },
  { name: 'R. Sánchez', valor: 25000 },
];
const BRAND_RED = "#ef4444";
const SLATE_DARK = "#0f172a";
export function MovementChart() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-slate-800 uppercase tracking-tight">10 Productos con Mayor Movimiento</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={movementData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 12 }} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 12 }}
              />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ paddingBottom: '20px' }} />
              <Bar dataKey="entradas" fill={SLATE_DARK} radius={[4, 4, 0, 0]} barSize={20} />
              <Bar dataKey="salidas" fill={BRAND_RED} radius={[4, 4, 0, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
export function OperatorsChart() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-slate-800 uppercase tracking-tight">Operarios por Valor de Pedidos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              layout="vertical" 
              data={operatorData} 
              margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
              <XAxis type="number" hide />
              <YAxis 
                dataKey="name" 
                type="category" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#334155', fontSize: 12, fontWeight: 600 }}
                width={100}
              />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                formatter={(value: number) => `€${value.toLocaleString()}`}
              />
              <Bar dataKey="valor" fill={BRAND_RED} radius={[0, 4, 4, 0]} barSize={25}>
                {operatorData.map((entry, index) => {
                  const fillColor = index === 0 ? BRAND_RED : `${BRAND_RED}cc`;
                  return <Cell key={`cell-${index}`} fill={fillColor} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}