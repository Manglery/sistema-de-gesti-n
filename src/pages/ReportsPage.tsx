import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart3, TrendingUp, PieChart as PieChartIcon, Target, Calendar, FileText } from "lucide-react";
import { MONTHLY_TRENDS, CATEGORY_DISTRIBUTION, OPERATIONAL_EFFICIENCY } from '@/lib/reports-data';
import { toast } from 'sonner';
export function ReportsPage() {
  const [isLoading, setIsLoading] = React.useState(true);
  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);
  const handleExport = () => {
    toast.promise(new Promise(res => setTimeout(res, 2000)), {
      loading: 'Generando informe PDF consolidado...',
      success: 'Informe exportado correctamente a su carpeta de descargas',
      error: 'Error al generar el informe'
    });
  };
  return (
    <AppLayout className="bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-xl">
                <BarChart3 className="size-7" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Reportes & Analytics</h1>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">INDICADORES ESTRATÉGICOS DE OPERACIÓN</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="h-10 text-[10px] font-black uppercase px-6 border-slate-200">
                <Calendar className="mr-2 size-4 text-slate-400" /> Histórico 6 Meses
              </Button>
              <Button onClick={handleExport} className="bg-red-600 hover:bg-red-700 h-10 text-[10px] font-black uppercase px-6 shadow-lg shadow-red-100">
                <FileText className="mr-2 size-4" /> Exportar PDF
              </Button>
            </div>
          </div>
          <Tabs defaultValue="operativo" className="space-y-6">
            <TabsList className="bg-slate-200/50 p-1 rounded-xl w-fit">
              <TabsTrigger value="operativo" className="rounded-lg text-[10px] font-black uppercase px-6 h-9">Flujo Operativo</TabsTrigger>
              <TabsTrigger value="inventario" className="rounded-lg text-[10px] font-black uppercase px-6 h-9">Distribución Stock</TabsTrigger>
              <TabsTrigger value="rendimiento" className="rounded-lg text-[10px] font-black uppercase px-6 h-9">KPI Personal</TabsTrigger>
            </TabsList>
            <TabsContent value="operativo" className="space-y-6 animate-fade-in">
              <Card className="border-slate-200 shadow-sm overflow-hidden">
                <CardHeader className="bg-slate-50/50 border-b">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="size-4 text-red-600" />
                    <CardTitle className="text-xs font-black uppercase">Tendencia Mensual Despachos</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  {isLoading ? <Skeleton className="h-[400px] w-full" /> : (
                    <div className="h-[400px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={MONTHLY_TRENDS}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 800, fill: '#94a3b8' }} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 800, fill: '#94a3b8' }} />
                          <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                          <Area type="monotone" dataKey="despachos" stroke="#ef4444" fill="#ef4444" fillOpacity={0.05} strokeWidth={3} />
                          <Area type="monotone" dataKey="compras" stroke="#0f172a" fill="#0f172a" fillOpacity={0.05} strokeWidth={3} />
                          <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="inventario" className="animate-fade-in">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-slate-200 shadow-sm">
                  <CardHeader className="bg-slate-50/50 border-b">
                    <div className="flex items-center gap-2">
                      <PieChartIcon className="size-4 text-red-600" />
                      <CardTitle className="text-xs font-black uppercase">Valor de Activos por Categoría</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    {isLoading ? <Skeleton className="h-[350px] w-full" /> : (
                      <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie data={CATEGORY_DISTRIBUTION} cx="50%" cy="50%" innerRadius={80} outerRadius={120} paddingAngle={8} dataKey="value">
                              {CATEGORY_DISTRIBUTION.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                            </Pie>
                            <Tooltip />
                            <Legend layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', paddingLeft: '20px' }} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </CardContent>
                </Card>
                <div className="space-y-6">
                  <Card className="border-slate-200 shadow-sm h-full">
                    <CardHeader><CardTitle className="text-xs font-black uppercase">Métricas de Almacenamiento</CardTitle></CardHeader>
                    <CardContent className="space-y-8 pt-4">
                      {CATEGORY_DISTRIBUTION.map((cat) => (
                        <div key={cat.name} className="space-y-2">
                          <div className="flex justify-between items-end">
                            <span className="text-[10px] font-black uppercase text-slate-500">{cat.name}</span>
                            <span className="text-[10px] font-black text-slate-900">{cat.value}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full transition-all duration-1000" style={{ width: `${cat.value}%`, backgroundColor: cat.color }} />
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppLayout>
  );
}