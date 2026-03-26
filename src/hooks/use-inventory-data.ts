import { useEffect, useMemo } from 'react';
import { useAuthStore } from '@/store/use-auth-store';
import { useInventoryStore } from '@/store/use-inventory-store';
export function useInventoryData() {
  const currentWarehouseId = useAuthStore(s => s.currentWarehouseId);
  const inventoryState = useInventoryStore(s => s.inventory);
  const isLoading = useInventoryStore(s => s.isLoading);
  const fetchInventory = useInventoryStore(s => s.fetchInventory);
  useEffect(() => {
    if (currentWarehouseId) {
      fetchInventory(currentWarehouseId);
    }
  }, [currentWarehouseId, fetchInventory]);
  const items = useMemo(() => {
    return inventoryState[currentWarehouseId] || [];
  }, [inventoryState, currentWarehouseId]);
  return { items, isLoading };
}