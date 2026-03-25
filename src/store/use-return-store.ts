import { create } from 'zustand';
export interface ReturnEntry {
  id: string;
  warehouse_id: string;
  order_number: string;
  material_name: string;
  reason: string;
  status: 'PENDING' | 'INSPECTED' | 'RESTOCKED';
  created_at: string;
}
interface ReturnState {
  returns: ReturnEntry[];
  isLoading: boolean;
  fetchReturns: (warehouseId: string) => Promise<void>;
  updateReturnStatus: (id: string, status: ReturnEntry['status']) => Promise<void>;
}
export const useReturnStore = create<ReturnState>((set) => ({
  returns: [],
  isLoading: false,
  fetchReturns: async (warehouseId) => {
    set({ isLoading: true });
    try {
      const response = await fetch(`/api/returns/${warehouseId}`);
      const result = await response.json();
      if (result.success) {
        set({ returns: result.data || [] });
      }
    } catch (err) {
      console.error('fetchReturns failed', err);
    } finally {
      set({ isLoading: false });
    }
  },
  updateReturnStatus: async (id, status) => {
    try {
      const response = await fetch(`/api/returns/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const result = await response.json();
      if (result.success) {
        set((state) => ({
          returns: state.returns.map(r => r.id === id ? { ...r, status } : r)
        }));
      }
    } catch (err) {
      console.error('updateReturnStatus failed', err);
    }
  }
}));