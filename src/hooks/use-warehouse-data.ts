import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/use-auth-store';
import { DashboardData } from '@/lib/mock-data';
export function useWarehouseData(month?: string, year?: string) {
  const currentWarehouseId = useAuthStore(s => s.currentWarehouseId);
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    const fetchMetrics = async () => {
      try {
        const query = new URLSearchParams();
        if (month) query.append('month', month);
        if (year) query.append('year', year);
        const response = await fetch(`/api/dashboard/${currentWarehouseId}?${query.toString()}`);
        const result = await response.json();
        if (isMounted) {
          if (result.success) {
            setData(result.data);
          } else {
            setError(result.error || 'Error al cargar datos');
          }
          setIsLoading(false);
        }
      } catch (_err) {
        if (isMounted) {
          setError('Error de conexión con el servidor');
          setIsLoading(false);
        }
      }
    };
    fetchMetrics();
    return () => {
      isMounted = false;
    };
  }, [currentWarehouseId, month, year]);
  return { data, isLoading, error };
}