import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, TrendingUp, PieChart as PieChartIcon, Target, Calendar } from "lucide-react";
import { MONTHLY_TRENDS, CATEGORY_DISTRIBUTION, OPERATIONAL_EFFICIENCY } from '@/lib/reports-data';
export function ReportsPage() {
  return (
    <AppLayout className="bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-xl shadow-slate-200">
                <BarChart3 className="size-7" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight leading-none">Reportes Avanzados</h1>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">INTELIGENCIA DE DATOS Y MÉTRICAS OPERATIVAS</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
              <Calendar className="size-4 text-slate-400" />
              <span className="text-xs font-black uppercase text-slate-900">Últimos 6 meses</span>
            </div>
          </div>
          <Tabs defaultValue="operativo" className="space-y-6">
            <TabsList className="bg-slate-100 p-1 rounded-xl">
              <TabsTrigger value="operativo" className="rounded-lg text-xs font-black uppercase px-6">Flujo Operativo</TabsTrigger>
              <TabsTrigger value="inventario" className="rounded-lg text-xs font-black uppercase px-6">Distribución Stock</TabsTrigger>
              <TabsTrigger value="rendimiento" className="rounded-lg text-xs font-black uppercase px-6">KPIs Personal</TabsTrigger>
            </TabsList>
            <TabsContent value="operativo" className="space-y-6">
              <Card className="border-slate-200 shadow-sm">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="size-4 text-red-600" />
                    <CardTitle className="text-sm font-black uppercase">Tendencia de Movimientos</CardTitle>
                  </div>
                  <CardDescription className="text-[10px] font-bold uppercase">Comparativa mensual de Despachos vs Compras</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={MONTHLY_TRENDS} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorDespachos" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorCompras" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#334155" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="#334155" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }} />
                        <Tooltip />
                        <Area type="monotone" dataKey="despachos" stroke="#ef4444" fillOpacity={1} fill="url(#colorDespachos)" strokeWidth={3} />
                        <Area type="monotone" dataKey="compras" stroke="#334155" fillOpacity={1} fill="url(#colorCompras)" strokeWidth={3} />
                        <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="inventario">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-slate-200 shadow-sm">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <PieChartIcon className="size-4 text-orange-600" />
                      <CardTitle className="text-sm font-black uppercase">Valor por Categoría</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="flex justify-center">
                    <div className="h-[350px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={CATEGORY_DISTRIBUTION}
                            cx="50%"
                            cy="50%"
                            innerRadius={80}
                            outerRadius={120}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {CATEGORY_DISTRIBUTION.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-slate-200 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-sm font-black uppercase">Resumen Ejecutivo</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {CATEGORY_DISTRIBUTION.map((cat) => (
                      <div key={cat.name} className="space-y-2">
                        <div className="flex justify-between text-[10px] font-black uppercase">
                          <span>{cat.name}</span>
                          <span className="text-slate-400">{cat.value}% del total</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full" style={{ width: `${cat.value}%`, backgroundColor: cat.color }} />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="rendimiento">
              <Card className="border-slate-200 shadow-sm">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Target className="size-4 text-emerald-600" />
                    <CardTitle className="text-sm font-black uppercase">Eficiencia de Equipos</CardTitle>
                  </div>
                  <CardDescription className="text-[10px] font-bold uppercase">Análisis comparativo de objetivos vs rendimiento real</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <div className="h-[450px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={OPERATIONAL_EFFICIENCY}>
                        <PolarGrid stroke="#e2e8f0" />
                        <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fontWeight: 900, fill: '#64748b', textTransform: 'uppercase' }} />
                        <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                        <Radar name="Equipo Tarde" dataKey="A" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} />
                        <Radar name="Equipo Mañana" dataKey="B" stroke="#334155" fill="#334155" fillOpacity={0.6} />
                        <Legend wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }} />
                        <Tooltip />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppLayout>
  );
}