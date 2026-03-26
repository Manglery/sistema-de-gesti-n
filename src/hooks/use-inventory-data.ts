import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/use-auth-store';
import { useInventoryStore } from '@/store/use-inventory-store';
import { InventoryItem } from '@/lib/inventory-data';
export function useInventoryData() {
  const currentWarehouseId = useAuthStore(s => s.currentWarehouseId);
  const inventoryState = useInventoryStore(s => s.inventory);
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    // In this phase, we read directly from the store which holds our "synced" local state
    // We simulate a small delay to maintain the "fetching" feel
    setIsLoading(true);
    const timer = setTimeout(() => {
      setItems(inventoryState[currentWarehouseId] || []);
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [currentWarehouseId, inventoryState]);
  return { items, isLoading };
}