import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  AlertTriangle,
  ArrowRight,
  Package,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
export function WelcomeCard() {
  return (
    <Card className="bg-[#0f172a] text-white border-none shadow-xl relative overflow-hidden h-full flex flex-col justify-between">
      <div className="absolute top-0 right-0 p-8 opacity-5">
        <Package className="w-48 h-48 rotate-12" />
      </div>
      <CardHeader className="relative z-10 pb-0">
        <div className="flex items-center gap-4">
          <div className="size-14 rounded-full bg-red-600 border-4 border-slate-800 flex items-center justify-center text-white font-bold text-xl shadow-lg">
          </div>
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">BIENVENIDO DE NUEVO</p>
            <CardTitle className="text-2xl font-bold">Mangler Yerren</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="relative z-10 mt-4">
        <div className="rounded-xl bg-slate-800/50 border border-slate-700/50 p-4 flex items-center justify-between group cursor-pointer hover:bg-slate-800 transition-colors">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-lg bg-red-600/10 flex items-center justify-center">
              <Package className="size-5 text-red-500" />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider leading-tight">ESTADO ACTUAL</p>
              <p className="text-sm font-bold text-white">Almacén Principal</p>
            </div>
          </div>
          <ChevronRight className="size-4 text-slate-600 group-hover:text-red-500 transition-colors" />
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
  colorTheme?: 'default' | 'purple' | 'red';
}
export function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendType = 'neutral', 
  subtitle, 
  className,
  colorTheme = 'default' 
}: StatCardProps) {
  const iconColors = {
    default: "text-slate-500 bg-slate-50",
    purple: "text-purple-600 bg-purple-50",
    red: "text-red-600 bg-red-50"
  };
  return (
    <Card className={cn("hover:shadow-md transition-shadow h-full border-slate-100", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{title}</CardTitle>
        <div className={cn("p-2 rounded-lg", iconColors[colorTheme])}>
          <Icon className="w-4 h-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-black text-slate-900 tracking-tight">{value}</div>
        {(trend || subtitle) && (
          <div className="flex items-center gap-2 mt-2">
            {trend && (
              <span className={cn(
                "px-2 py-0.5 rounded-full text-[10px] font-bold",
                trendType === 'positive' && "text-green-700 bg-green-50",
                trendType === 'negative' && "text-red-700 bg-red-50",
                trendType === 'neutral' && "text-slate-600 bg-slate-100"
              )}>
                {trend}
              </span>
            )}
            {subtitle && <span className="text-[10px] font-medium text-slate-400">{subtitle}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
const restockItems = [
  { id: 1, code: "85308", name: "319g. LLAVE COMBINADA", current: 0, min: 5, unit: "uds" },
  { id: 2, code: "85310", name: "319g. LLAVE COMBINADA", current: 2, min: 5, unit: "uds" },
  { id: 3, code: "85312", name: "319g. LLAVE COMBINADA", current: 3, min: 5, unit: "uds" },
  { id: 4, code: "85313", name: "319g. LLAVE COMBINADA", current: 1, min: 5, unit: "uds" },
  { id: 5, code: "85314", name: "319g. LLAVE COMBINADA", current: 0, min: 5, unit: "uds" },
];
export function RestockAlertCard() {
  return (
    <Card className="h-full border-slate-200 shadow-sm overflow-hidden flex flex-col">
      <CardHeader className="pb-3 bg-slate-50/50 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-red-100 rounded text-red-600">
              <AlertTriangle className="size-4" />
            </div>
            <CardTitle className="text-sm font-bold text-slate-900 uppercase tracking-tight">
              Reposición Prioritaria
            </CardTitle>
          </div>
          <Badge variant="destructive" className="bg-red-600 hover:bg-red-700 font-bold px-2 rounded">
            9 alertas
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0 flex-1 overflow-auto">
        <div className="divide-y divide-slate-100">
          {restockItems.map((item) => (
            <div key={item.id} className="p-4 hover:bg-slate-50 transition-colors group">
              <div className="flex justify-between items-start mb-2">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-red-600 uppercase">{item.code}</span>
                  <span className="text-xs font-bold text-slate-800 leading-tight">{item.name}</span>
                </div>
                <button className="text-slate-300 hover:text-red-600 group-hover:translate-x-1 transition-all">
                  <ArrowRight className="size-4" />
                </button>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] font-bold">
                  <span className={cn(item.current === 0 ? "text-red-600" : "text-slate-500")}>
                    STOCK: {item.current} / {item.min} {item.unit}
                  </span>
                  <span className="text-slate-400">{Math.round(Math.min(100, (item.current / (item.min || 1)) * 100))}%</span>
                </div>
                <Progress value={Math.min(100, (item.current / (item.min || 1)) * 100)} className="h-1 bg-slate-100 [&>div]:bg-red-500" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <div className="p-4 bg-slate-50 border-t mt-auto">
        <button className="w-full py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition-colors shadow-sm uppercase tracking-widest">
          Ver todas las alertas
        </button>
      </div>
    </Card>
  );
}