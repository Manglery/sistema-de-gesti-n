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
        set({ orders: result.data, isLoading: false });
      }
    } catch (err) {
      set({ isLoading: false });
    }
  },
  addOrder: async (order) => {
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order)
      });
      const result = await response.json();
      if (result.success) {
        set((state) => ({ orders: [order, ...state.orders] }));
      }
    } catch (err) {
      console.error('Order creation failed', err);
    }
  },
  updateOrderStatus: async (id, status) => {
    // In a real system, we'd have a PATCH endpoint
    // For now we update local and assume it's synced if needed or re-fetched
    set((state) => ({
      orders: state.orders.map(o => o.id === id ? { ...o, status, updatedAt: new Date().toISOString() } : o)
    }));
  }
}));