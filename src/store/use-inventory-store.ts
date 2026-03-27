import { create } from 'zustand';
import { InventoryItem } from '@/lib/inventory-data';
interface InventoryState {
  inventory: Record<string, InventoryItem[]>;
  isLoading: boolean;
  error: string | null;
  fetchInventory: (warehouseId: string) => Promise<void>;
  adjustStock: (warehouseId: string, itemId: string, amount: number, reason: string, user: string) => Promise<void>;
  setWarehouseInventory: (warehouseId: string, items: InventoryItem[]) => void;
}
export const useInventoryStore = create<InventoryState>((set) => ({
  inventory: {},
  isLoading: false,
  error: null,
  fetchInventory: async (warehouseId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/inventory/${warehouseId}`);
      if (!response.ok) throw new Error('Failed to fetch inventory');
      const result = await response.json();
      if (result.success) {
        set((state) => ({
          inventory: { ...state.inventory, [warehouseId]: result.data },
          isLoading: false
        }));
      } else {
        set({ error: result.error, isLoading: false });
      }
    } catch (err) {
      console.error('fetchInventory Error:', err);
      set({ error: 'Error de conexión con el servidor de inventario', isLoading: false });
    }
  },
  adjustStock: async (warehouseId, itemId, amount, reason, user) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/inventory/adjust', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ warehouseId, itemId, amount, reason, user })
      });
      const result = await response.json();
      if (result.success) {
        // Trigger optimized refetch
        const fetchRes = await fetch(`/api/inventory/${warehouseId}`);
        const fetchResult = await fetchRes.json();
        if (fetchResult.success) {
          set((state) => ({
            inventory: { ...state.inventory, [warehouseId]: fetchResult.data },
            isLoading: false
          }));
        } else {
          console.error('Refetch after adjustment failed');
          set({ error: fetchResult.error || 'Error actualizando stock local', isLoading: false });
        }
      } else {
        console.warn('Stock adjustment API returned failure:', result.error);
        set({ error: result.error || 'Fallo en la operación de ajuste', isLoading: false });
      }
    } catch (err) {
      console.error('adjustStock Critical Error:', err);
      set({ error: 'Fallo de red al intentar ajustar el stock', isLoading: false });
    }
  },
  setWarehouseInventory: (warehouseId, items) => set((state) => ({
    inventory: { ...state.inventory, [warehouseId]: items }
  })),
}));