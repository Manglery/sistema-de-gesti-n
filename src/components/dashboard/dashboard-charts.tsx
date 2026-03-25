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
  { name: 'P001', cantidad: 400, valor: 240 },
  { name: 'P002', cantidad: 300, valor: 139 },
  { name: 'P003', cantidad: 200, valor: 980 },
  { name: 'P004', cantidad: 278, valor: 390 },
  { name: 'P005', cantidad: 189, valor: 480 },
  { name: 'P006', cantidad: 239, valor: 380 },
  { name: 'P007', cantidad: 349, valor: 430 },
  { name: 'P008', cantidad: 410, valor: 310 },
  { name: 'P009', cantidad: 290, valor: 290 },
  { name: 'P010', cantidad: 380, valor: 190 },
];
const operatorData = [
  { name: 'Mohammed Jadracui', valor: 45000 },
  { name: 'Mohamed Hassoun', valor: 38500 },
  { name: 'Antonio García', valor: 32000 },
  { name: 'Lucía Martínez', valor: 31000 },
  { name: 'Sofía Ruiz', valor: 28000 },
  { name: 'Roberto Pérez', valor: 25000 },
];
const BRAND_RED = "#ef4444";
const SLATE_DARK = "#0f172a";
export function MovementChart() {
  return (
    <Card className="h-full border-slate-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-bold text-slate-800 uppercase tracking-tight">10 Productos con Mayor Movimiento</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={movementData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }}
              />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ paddingBottom: '20px', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' }} />
              <Bar name="Cantidad" dataKey="cantidad" fill={BRAND_RED} radius={[4, 4, 0, 0]} barSize={12} />
              <Bar name="Valor (€)" dataKey="valor" fill={SLATE_DARK} radius={[4, 4, 0, 0]} barSize={12} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
export function OperatorsChart() {
  return (
    <Card className="h-full border-slate-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-bold text-slate-800 uppercase tracking-tight">Operarios por Valor de Pedidos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[320px] w-full">
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
                tick={{ fill: '#334155', fontSize: 11, fontWeight: 600 }}
                width={120}
              />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(value: number) => `€${value.toLocaleString()}`}
              />
              <Bar dataKey="valor" fill={BRAND_RED} radius={[0, 4, 4, 0]} barSize={18}>
                {operatorData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? BRAND_RED : `${BRAND_RED}bb`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}