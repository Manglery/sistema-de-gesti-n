import { create } from 'zustand';
export interface PurchaseOrder {
  id: string;
  warehouse_id: string;
  vendor_name: string;
  total_amount: number;
  status: 'ARRIVING' | 'COMPLETED';
  delivery_date: string;
  items_count: number;
}
interface PurchaseState {
  purchases: PurchaseOrder[];
  isLoading: boolean;
  fetchPurchases: (warehouseId: string) => Promise<void>;
  receivePurchase: (id: string, warehouseId: string, user: string) => Promise<void>;
}
export const usePurchaseStore = create<PurchaseState>((set) => ({
  purchases: [],
  isLoading: false,
  fetchPurchases: async (warehouseId) => {
    set({ isLoading: true });
    try {
      const response = await fetch(`/api/purchases/${warehouseId}`);
      const result = await response.json();
      if (result.success) {
        set({ purchases: result.data || [] });
      }
    } catch (err) {
      console.error('fetchPurchases failed', err);
    } finally {
      set({ isLoading: false });
    }
  },
  receivePurchase: async (id, warehouseId, user) => {
    try {
      const response = await fetch(`/api/purchases/${id}/receive`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ warehouseId, user })
      });
      const result = await response.json();
      if (result.success) {
        set((state) => ({
          purchases: state.purchases.map(p => p.id === id ? { ...p, status: 'COMPLETED' } : p)
        }));
      }
    } catch (err) {
      console.error('receivePurchase failed', err);
    }
  }
}));