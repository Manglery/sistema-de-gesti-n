import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  AlertTriangle,
  ArrowRight,
  Package,
  Users,
  Clock,
  TrendingUp,
  Wallet,
  Truck
} from "lucide-react";
import { cn } from "@/lib/utils";
export function WelcomeCard() {
  return (
    <Card className="bg-[#111827] text-white border-none shadow-xl relative overflow-hidden h-full flex flex-col justify-center px-6">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <Package className="w-32 h-32 rotate-12" />
      </div>
      <div className="flex items-center gap-4">
        <div className="size-12 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-white font-black text-lg shadow-inner">
        </div>
        <div>
          <p className="text-[9px] text-slate-400 uppercase font-black tracking-[0.2em]">BIENVENIDO</p>
          <h2 className="text-xl font-black tracking-tight">Mangler</h2>
        </div>
      </div>
      <div className="mt-4 rounded-xl bg-slate-800/40 border border-slate-700/50 p-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-8 rounded bg-slate-900 flex items-center justify-center">
            <Package className="size-4 text-slate-400" />
          </div>
          <div className="flex flex-col">
            <span className="text-[8px] text-slate-500 font-black uppercase tracking-widest leading-none mb-1">ALMACÉN ACTIVO</span>
            <span className="text-xs font-bold text-white">Almacén Principal</span>
          </div>
        </div>
      </div>
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
  iconColor?: string;
}
export function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendType = 'neutral', 
  subtitle, 
  className,
  iconColor = "text-blue-600 bg-blue-50"
}: StatCardProps) {
  return (
    <Card className={cn("hover:shadow-md transition-shadow h-full border-slate-200", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-4">
        <CardTitle className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{title}</CardTitle>
        <div className={cn("p-2 rounded-xl", iconColor)}>
          <Icon className="w-4 h-4" />
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <div className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-2">{value}</div>
        {trend && (
          <div className="flex items-center gap-2">
            <span className={cn(
              "flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-black uppercase",
              trendType === 'positive' && "text-emerald-600 bg-emerald-50",
              trendType === 'negative' && "text-red-600 bg-red-50",
              trendType === 'neutral' && "text-slate-500 bg-slate-100"
            )}>
              {trendType === 'positive' && <TrendingUp className="size-2.5" />}
              {trend}
            </span>
            {subtitle && <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">{subtitle}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
const restockItems = [
  { id: 1, code: "85308", name: "319g. LLAVE COMBINADA CARRACA REVERSIBLE 24-24", current: 0, min: 5 },
  { id: 2, code: "85306", name: "319d. LLAVE COMBINADA CARRACA REVERSIBLE 19-19", current: 2, min: 5 },
];
export function RestockAlertCard() {
  return (
    <Card className="h-full border-slate-200 shadow-sm overflow-hidden flex flex-col">
      <CardHeader className="pb-3 bg-white border-b px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-red-50 rounded-lg text-red-600">
              <AlertTriangle className="size-4" />
            </div>
            <CardTitle className="text-xs font-black text-slate-900 uppercase tracking-tight">
              Reposición Prioritaria
            </CardTitle>
          </div>
          <Badge variant="destructive" className="bg-red-600 hover:bg-red-700 font-black text-[9px] px-2 rounded-sm border-none">
            9 alertas
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0 flex-1 overflow-auto">
        <div className="divide-y divide-slate-100">
          {restockItems.map((item) => (
            <div key={item.id} className="p-4 hover:bg-slate-50 transition-colors group">
              <div className="flex justify-between items-start mb-2 gap-4">
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-red-600 uppercase tracking-widest mb-0.5">{item.code}</span>
                  <span className="text-[10px] font-bold text-slate-700 leading-tight uppercase">{item.name}</span>
                </div>
              </div>
              <div className="space-y-1.5 mt-3">
                <div className="flex justify-between text-[9px] font-black">
                  <span className="text-slate-400 uppercase tracking-tight">
                    <span className={cn(item.current === 0 ? "text-red-600" : "text-slate-900")}>{item.current}</span> / {item.min} uds
                  </span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={cn("h-full transition-all", item.current === 0 ? "bg-red-600" : "bg-red-500")} 
                    style={{ width: `${(item.current / item.min) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}