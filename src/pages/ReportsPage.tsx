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
export function ReportsPage() {
  const { data, isLoading } = useReportData();
  const handleExport = () => {
    toast.promise(new Promise(res => setTimeout(res, 2000)), {
      loading: 'Generando informe PDF consolidado...',
      success: 'Informe exportado correctamente',
      error: 'Error al generar el informe'
    });
  };
  const chartData = data?.monthlyTrends || [];
  const categoryData = data?.categories || [];
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
                <Calendar className="mr-2 size-4 text-slate-400" /> Histórico
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
                        <AreaChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 800, fill: '#94a3b8' }} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 800, fill: '#94a3b8' }} />
                          <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                          <Area type="monotone" dataKey="despachos" stroke="#ef4444" fill="#ef4444" fillOpacity={0.05} strokeWidth={3} />
                          <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="inventario" className="animate-fade-in">
              <Card className="border-slate-200 shadow-sm">
                <CardHeader className="bg-slate-50/50 border-b">
                  <div className="flex items-center gap-2">
                    <PieChartIcon className="size-4 text-red-600" />
                    <CardTitle className="text-xs font-black uppercase">Distribución por Categoría</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  {isLoading ? <Skeleton className="h-[350px] w-full" /> : (
                    <div className="h-[350px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={categoryData} cx="50%" cy="50%" innerRadius={80} outerRadius={120} paddingAngle={8} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                            {categoryData.map((_: any, index: number) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                          </Pie>
                          <Tooltip />
                          <Legend layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', paddingLeft: '20px' }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppLayout>
  );
}