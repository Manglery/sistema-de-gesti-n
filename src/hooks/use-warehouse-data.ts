import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/use-auth-store';
import { WAREHOUSE_DATA, DashboardData } from '@/lib/mock-data';
export function useWarehouseData() {
  const currentWarehouseId = useAuthStore(s => s.currentWarehouseId);
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    // Simulate async API fetch
    const fetchMetrics = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 600));
        if (isMounted) {
          const warehouseData = WAREHOUSE_DATA[currentWarehouseId] || WAREHOUSE_DATA.contadores;
          setData(warehouseData);
          setIsLoading(false);
        }
      } catch (_err) {
        if (isMounted) {
          setError('Error al cargar datos del almacén');
          setIsLoading(false);
        }
      }
    };
    fetchMetrics();
    return () => {
      isMounted = false;
    };
  }, [currentWarehouseId]);
  return { data, isLoading, error };
}