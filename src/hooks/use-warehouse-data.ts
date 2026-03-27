import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuthStore } from '@/store/use-auth-store';
import { DashboardData } from '@/lib/mock-data';
export function useWarehouseData(month?: string, year?: string) {
  const currentWarehouseId = useAuthStore(s => s.currentWarehouseId);
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef(true);
  const fetchMetrics = useCallback(async () => {
    if (!currentWarehouseId) return;
    if (!isMountedRef.current) return;
    setIsLoading(true);
    try {
      const query = new URLSearchParams();
      if (month) query.append('month', month);
      if (year) query.append('year', year);
      const response = await fetch(`/api/dashboard/${currentWarehouseId}?${query.toString()}`);
      if (!response.ok) throw new Error('API server error');
      const result = await response.json();
      if (isMountedRef.current) {
        if (result.success && result.data) {
          setData(result.data);
          setError(null);
        } else {
          setError(result.error || 'Failed to load dashboard data');
        }
      }
    } catch (err: any) {
      if (isMountedRef.current) {
        setError(err.message || 'Network or API error');
      }
    } finally {
      if (isMountedRef.current) setIsLoading(false);
    }
  }, [currentWarehouseId, month, year]);
  useEffect(() => {
    isMountedRef.current = true;
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 60000); // 1 minute auto-refresh
    return () => {
      isMountedRef.current = false;
      clearInterval(interval);
    };
  }, [fetchMetrics]);
  return { data, isLoading, error, refetch: fetchMetrics };
}