import { create } from 'zustand';
import { Order, OrderStatus } from '@/lib/orders-data';
interface OrderState {
  orders: Order[];
  isLoading: boolean;
  fetchOrders: (warehouseId: string) => Promise<void>;
  addOrder: (order: Order) => Promise<void>;
  updateOrderStatus: (id: string, status: OrderStatus) => Promise<void>;
}
export const useOrderStore = create<OrderState>((set) => ({
  orders: [],
  isLoading: false,
  fetchOrders: async (warehouseId) => {
    set({ isLoading: true });
    try {
      const response = await fetch(`/api/orders/${warehouseId}`);
      const result = await response.json();
      if (result.success) {
        set({ orders: result.data || [], isLoading: false });
      } else {
        set({ orders: [], isLoading: false });
      }
    } catch (err) {
      console.error('fetchOrders failed', err);
      set({ isLoading: false });
    }
  },
  addOrder: async (order) => {
    set({ isLoading: true });
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order)
      });
      const result = await response.json();
      if (result.success && result.data) {
        set((state) => ({ orders: [result.data, ...state.orders], isLoading: false }));
      } else {
        console.error('API creation failed');
        set({ isLoading: false });
      }
    } catch (err) {
      console.error('Order creation failed', err);
      set({ isLoading: false });
    }
  },
  updateOrderStatus: async (id, status) => {
    // Optimistic local update
    set((state) => ({
      orders: state.orders.map(o => o.id === id ? { ...o, status, updatedAt: new Date().toISOString() } : o)
    }));
    // In a full implementation, we'd also call a PATCH /api/orders/:id endpoint
    try {
      await fetch(`/api/orders/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
    } catch (err) {
      console.warn('Backend status update failed, local state might be ahead');
    }
  }
}));