import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart3, TrendingUp, PieChart as PieChartIcon, Calendar, FileText } from "lucide-react";
import { useReportData } from '@/hooks/use-report-data';
import { toast } from 'sonner';
const COLORS = ['#ef4444', '#f97316', '#3b82f6', '#10b981', '#64748b', '#8b5cf6'];
const monthNames: Record<string, string> = {
  "01": "Ene", "02": "Feb", "03": "Mar", "04": "Abr",
  "05": "May", "06": "Jun", "07": "Jul", "08": "Ago",
  "09": "Sep", "10": "Oct", "11": "Nov", "12": "Dic"
};
export function ReportsPage() {
  const { data, isLoading } = useReportData();
  const handleExport = () => {
    toast.promise(new Promise(res => setTimeout(res, 2000)), {
      loading: 'Generando informe consolidado...',
      success: 'Informe exportado correctamente',
      error: 'Error al generar el informe'
    });
  };
  const chartData = data?.monthlyTrends || [];
  const categoryData = data?.categories || [];
  return (
    <AppLayout className="bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12 space-y-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="size-14 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-2xl">
                <BarChart3 className="size-8" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Reportes & Analytics</h1>
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] mt-2 flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-red-600 animate-pulse" />
                  Visualización Estratégica de Operaciones
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="h-11 text-[10px] font-black uppercase px-6 border-slate-200 bg-white">
                <Calendar className="mr-2 size-4 text-slate-400" /> Histórico Completo
              </Button>
              <Button onClick={handleExport} className="bg-red-600 hover:bg-red-700 h-11 text-[10px] font-black uppercase px-6 shadow-xl shadow-red-100">
                <FileText className="mr-2 size-4" /> Exportar Reporte
              </Button>
            </div>
          </div>
          <Tabs defaultValue="operativo" className="space-y-8">
            <TabsList className="bg-slate-200/50 p-1 rounded-xl w-fit">
              <TabsTrigger value="operativo" className="rounded-lg text-[10px] font-black uppercase px-8 h-10 data-[state=active]:bg-white data-[state=active]:shadow-sm">Flujo Operativo</TabsTrigger>
              <TabsTrigger value="inventario" className="rounded-lg text-[10px] font-black uppercase px-8 h-10 data-[state=active]:bg-white data-[state=active]:shadow-sm">Distribución Stock</TabsTrigger>
            </TabsList>
            <TabsContent value="operativo" className="space-y-8 animate-fade-in">
              <Card className="border-slate-200 shadow-sm overflow-hidden bg-white">
                <CardHeader className="bg-slate-50/50 border-b py-6 px-8">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-50 rounded-xl">
                      <TrendingUp className="size-5 text-red-600" />
                    </div>
                    <div>
                      <CardTitle className="text-sm font-black uppercase tracking-tight text-slate-900">Tendencia Mensual de Despachos</CardTitle>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Comparativa de carga vs adquisición</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-10 pb-6 px-4 sm:px-8">
                  {isLoading ? <Skeleton className="h-[400px] w-full rounded-xl" /> : (
                    <div className="h-[450px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
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
                          <XAxis 
                            dataKey="month" 
                            axisLine={false} 
                            tickLine={false} 
                            tickFormatter={(val) => monthNames[val] || val}
                            tick={{ fontSize: 10, fontWeight: 800, fill: '#94a3b8' }} 
                            dy={10}
                          />
                          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 800, fill: '#94a3b8' }} />
                          <Tooltip 
                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)', padding: '12px' }} 
                            itemStyle={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase' }}
                            labelStyle={{ marginBottom: '4px', fontSize: '10px', color: '#94a3b8', fontWeight: '800' }}
                          />
                          <Area type="monotone" dataKey="despachos" name="Despachos" stroke="#ef4444" fillOpacity={1} fill="url(#colorDespachos)" strokeWidth={4} />
                          <Area type="monotone" dataKey="compras" name="Compras" stroke="#334155" fillOpacity={1} fill="url(#colorCompras)" strokeWidth={4} strokeDasharray="5 5" />
                          <Legend verticalAlign="top" height={36} wrapperStyle={{ top: -20, right: 0, fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em' }} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="inventario" className="animate-fade-in space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="border-slate-200 shadow-sm bg-white">
                  <CardHeader className="bg-slate-50/50 border-b py-6 px-8">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-red-50 rounded-xl">
                        <PieChartIcon className="size-5 text-red-600" />
                      </div>
                      <CardTitle className="text-sm font-black uppercase text-slate-900">Distribución por Categoría</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-10">
                    {isLoading ? <Skeleton className="h-[400px] w-full rounded-xl" /> : (
                      <div className="h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie 
                              data={categoryData} 
                              cx="50%" 
                              cy="50%" 
                              innerRadius={80} 
                              outerRadius={130} 
                              paddingAngle={6} 
                              dataKey="value" 
                              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                              {categoryData.map((_: any, index: number) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(255,255,255,0.5)" strokeWidth={2} />
                              ))}
                            </Pie>
                            <Tooltip />
                            <Legend 
                              layout="vertical" 
                              verticalAlign="middle" 
                              align="right" 
                              wrapperStyle={{ fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', paddingLeft: '40px' }} 
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </CardContent>
                </Card>
                <Card className="border-slate-200 shadow-sm bg-slate-900 text-white flex flex-col justify-center p-10 overflow-hidden relative">
                   <div className="absolute -right-20 -bottom-20 opacity-5">
                      <BarChart3 className="size-80" />
                   </div>
                   <div className="relative z-10">
                      <span className="text-red-500 text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">Resumen de Activos</span>
                      <h3 className="text-4xl font-black tracking-tighter leading-none mb-8">Estado de<br/>Valorización</h3>
                      <div className="space-y-6">
                        <div className="flex justify-between items-center border-b border-white/10 pb-4">
                           <span className="text-[10px] font-black uppercase text-slate-400">Total en Almacén</span>
                           <span className="text-xl font-black">€1.3M</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-white/10 pb-4">
                           <span className="text-[10px] font-black uppercase text-slate-400">Salida Proyectada</span>
                           <span className="text-xl font-black text-red-500">€245K</span>
                        </div>
                        <div className="flex justify-between items-center">
                           <span className="text-[10px] font-black uppercase text-slate-400">ROI Operativo</span>
                           <span className="text-xl font-black text-emerald-500">12.4%</span>
                        </div>
                      </div>
                   </div>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppLayout>
  );
}