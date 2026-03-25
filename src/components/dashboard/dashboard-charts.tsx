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
const movementData = [
  { name: '45. PRECINTO AZUL', cantidad: 8500, valor: 4600 },
  { name: '15b. JUNTA DE RACO...', cantidad: 4000, valor: 500 },
  { name: '15c. JUNTA DE RACO...', cantidad: 2500, valor: 400 },
  { name: '15a. JUNTA DE RACO...', cantidad: 2400, valor: 300 },
  { name: '29. RACOR LLOBREGA...', cantidad: 2200, valor: 5000 },
  { name: '82b. TUERCA ZINCAD...', cantidad: 2100, valor: 150 },
  { name: '69. BRIDAS (100 UN...', cantidad: 2000, valor: 8000 },
  { name: '81d. TORNILLO ZINC...', cantidad: 1900, valor: 1300 },
  { name: '70c. CLAC VODAFONE', cantidad: 1900, valor: 100 },
  { name: 'CONTADORES DE 20 M...', cantidad: 1700, valor: 100 },
];
const operatorData = [
  { name: 'Mohammed Jadracui', valor: 13500 },
  { name: 'Mohamed Hassoun Benouar', valor: 11800 },
  { name: 'Antonio García', valor: 6500 },
  { name: 'Joseba Gonzalez Aparicio', valor: 6500 },
  { name: 'Ruben Rey Viana', valor: 6300 },
  { name: 'ALFREDO MERINO ACEITUNO', valor: 4500 },
  { name: 'Michele Laiso', valor: 3500 },
  { name: 'Alexander Gutierrez Cangalaya', valor: 3200 },
  { name: 'Daniel Juanito Orosco Toledano', valor: 3200 },
  { name: 'Christian Gutierrez Cangalaya', valor: 2800 },
];
const BRAND_RED = "#ef4444";
const SLATE_DARK = "#334155";
export function MovementChart() {
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
            <BarChart data={movementData} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
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
}
export function OperatorsChart() {
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
              data={operatorData} 
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
                <Cell fill={BRAND_RED} opacity={0.95} />
                <Cell fill={BRAND_RED} opacity={0.90} />
                <Cell fill={BRAND_RED} opacity={0.85} />
                <Cell fill={BRAND_RED} opacity={0.80} />
                <Cell fill={BRAND_RED} opacity={0.75} />
                <Cell fill={BRAND_RED} opacity={0.70} />
                <Cell fill={BRAND_RED} opacity={0.65} />
                <Cell fill={BRAND_RED} opacity={0.60} />
                <Cell fill={BRAND_RED} opacity={0.55} />
                <Cell fill={BRAND_RED} opacity={0.50} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}