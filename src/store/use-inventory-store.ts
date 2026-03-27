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
      if (!response.ok) throw new Error('Network response was not ok');
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
      set({ error: 'Error de conexión con el servidor', isLoading: false });
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
        // Optimistic refresh: fetch inventory again
        const fetchRes = await fetch(`/api/inventory/${warehouseId}`);
        const fetchResult = await fetchRes.json();
        if (fetchResult.success) {
          set((state) => ({
            inventory: { ...state.inventory, [warehouseId]: fetchResult.data },
            isLoading: false
          }));
        } else {
          set({ isLoading: false });
        }
      } else {
        set({ error: result.error, isLoading: false });
      }
    } catch (err) {
      console.error('adjustStock Error:', err);
      set({ error: 'Fallo al ajustar el inventario', isLoading: false });
    }
  },
  setWarehouseInventory: (warehouseId, items) => set((state) => ({
    inventory: { ...state.inventory, [warehouseId]: items }
  })),
}));