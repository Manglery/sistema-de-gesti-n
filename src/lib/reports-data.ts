export interface MonthlyTrend {
  month: string;
  despachos: number;
  compras: number;
}
export interface CategoryDistribution {
  name: string;
  value: number;
  color: string;
}
export interface EfficiencyMetric {
  subject: string;
  A: number;
  B: number;
  fullMark: number;
}
export const MONTHLY_TRENDS: MonthlyTrend[] = [
  { month: 'Oct', despachos: 400, compras: 240 },
  { month: 'Nov', despachos: 300, compras: 139 },
  { month: 'Dic', despachos: 200, compras: 980 },
  { month: 'Ene', despachos: 278, compras: 390 },
  { month: 'Feb', despachos: 189, compras: 480 },
  { month: 'Mar', despachos: 546, compras: 380 },
];
export const CATEGORY_DISTRIBUTION: CategoryDistribution[] = [
  { name: 'Contadores', value: 45, color: '#ef4444' },
  { name: 'Accesorios', value: 25, color: '#f97316' },
  { name: 'Tubería', value: 15, color: '#3b82f6' },
  { name: 'Herramientas', value: 10, color: '#10b981' },
  { name: 'Otros', value: 5, color: '#64748b' },
];
export const OPERATIONAL_EFFICIENCY: EfficiencyMetric[] = [
  { subject: 'Velocidad', A: 120, B: 110, fullMark: 150 },
  { subject: 'Precisión', A: 98, B: 130, fullMark: 150 },
  { subject: 'Seguridad', A: 86, B: 130, fullMark: 150 },
  { subject: 'Asistencia', A: 99, B: 100, fullMark: 150 },
  { subject: 'Limpieza', A: 85, B: 90, fullMark: 150 },
];