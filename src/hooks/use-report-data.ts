import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '@/store/use-auth-store';
export function useReportData() {
  const warehouseId = useAuthStore(s => s.currentWarehouseId);
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const fetchReport = useCallback(async () => {
    if (!warehouseId) return;
    setIsLoading(true);
    try {
      const response = await fetch(`/api/reports/${warehouseId}`);
      const result = await response.json();
      if (result.success) {
        setData(result.data);
      }
    } catch (err) {
      console.error('Fetch reports failed', err);
    } finally {
      setIsLoading(false);
    }
  }, [warehouseId]);
  useEffect(() => {
    fetchReport();
  }, [fetchReport]);
  return { data, isLoading, refetch: fetchReport };
}