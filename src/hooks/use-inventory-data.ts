import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/use-auth-store';
import { INVENTORY_BY_WAREHOUSE, InventoryItem } from '@/lib/inventory-data';
export function useInventoryData() {
  const currentWarehouseId = useAuthStore(s => s.currentWarehouseId);
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setIsLoading(true);
    // Simulate API delay for multi-tenancy isolation feel
    const timer = setTimeout(() => {
      const data = INVENTORY_BY_WAREHOUSE[currentWarehouseId] || [];
      setItems(data);
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [currentWarehouseId]);
  return { items, isLoading };
}