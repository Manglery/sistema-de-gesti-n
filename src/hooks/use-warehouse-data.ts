import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '@/store/use-auth-store';
import { DashboardData } from '@/lib/mock-data';
export function useWarehouseData(month?: string, year?: string) {
  const currentWarehouseId = useAuthStore(s => s.currentWarehouseId);
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchMetrics = useCallback(async (isMounted: boolean) => {
    if (!currentWarehouseId) return;
    setIsLoading(true);
    try {
      const query = new URLSearchParams();
      if (month) query.append('month', month);
      if (year) query.append('year', year);
      const response = await fetch(`/api/dashboard/${currentWarehouseId}?${query.toString()}`);
      if (!response.ok) throw new Error('Network response was not ok');
      const result = await response.json();
      if (isMounted) {
        if (result.success) {
          const dashboardData: DashboardData = {
            stats: {
              usuarios: result.data.stats?.usuarios ?? 0,
              pendientes: result.data.stats?.pendientes ?? 0,
              despachos: result.data.stats?.despachos ?? 0,
              inventario: result.data.stats?.inventario ?? '€0.00',
              efectividad: result.data.stats?.efectividad ?? '0%',
              valorSalida: result.data.stats?.valorSalida ?? '€0.00'
            },
            movement: result.data.movement || [],
            operators: result.data.operators || [],
            alerts: result.data.alerts || []
          };
          setData(dashboardData);
          setError(null);
        } else {
          setError(result.error || 'Error al cargar indicadores');
        }
      }
    } catch (err) {
      if (isMounted) {
        setError('Servicio no disponible momentáneamente');
        console.error('Dashboard fetch error:', err);
      }
    } finally {
      if (isMounted) setIsLoading(false);
    }
  }, [currentWarehouseId, month, year]);
  useEffect(() => {
    let isMounted = true;
    fetchMetrics(isMounted);
    // Poll for updates every 2 minutes
    const interval = setInterval(() => fetchMetrics(isMounted), 120000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [fetchMetrics]);
  return { data, isLoading, error, refetch: () => fetchMetrics(true) };
}