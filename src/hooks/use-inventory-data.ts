import { useEffect, useMemo } from 'react';
import { useAuthStore } from '@/store/use-auth-store';
import { useInventoryStore } from '@/store/use-inventory-store';
import { INVENTORY_BY_WAREHOUSE } from '@/lib/inventory-data';
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
    const serverItems = inventoryState[currentWarehouseId];
    // If server items don't exist yet, fallback to high-fidelity mock data
    if (!serverItems || serverItems.length === 0) {
      return INVENTORY_BY_WAREHOUSE[currentWarehouseId] || [];
    }
    return serverItems;
  }, [inventoryState, currentWarehouseId]);
  return { items, isLoading };
}