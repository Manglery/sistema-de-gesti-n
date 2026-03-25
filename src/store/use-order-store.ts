import { create } from 'zustand';
import { Order, OrderStatus } from '@/lib/orders-data';
interface OrderState {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
  fetchOrders: (warehouseId: string) => Promise<void>;
  addOrder: (order: Order) => Promise<void>;
  updateOrderStatus: (id: string, status: OrderStatus) => Promise<void>;
}
export const useOrderStore = create<OrderState>((set) => ({
  orders: [],
  isLoading: false,
  error: null,
  fetchOrders: async (warehouseId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/orders/${warehouseId}`);
      const result = await response.json();
      if (result.success) {
        set({ orders: result.data || [] });
      }
    } catch (err) {
      console.error('fetchOrders failed', err);
      set({ error: 'Fallo al cargar pedidos' });
    } finally {
      set({ isLoading: false });
    }
  },
  addOrder: async (order) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order)
      });
      const result = await response.json();
      if (result.success) {
        set((state) => ({ orders: [result.data, ...state.orders] }));
      } else {
        throw new Error(result.error || 'Error al crear pedido');
      }
    } catch (err: any) {
      console.error('Order creation failed', err);
      set({ error: err.message });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },
  updateOrderStatus: async (id, status) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/orders/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const result = await response.json();
      if (result.success) {
        set((state) => ({
          orders: state.orders.map(o => o.id === id ? { ...o, status, updatedAt: new Date().toISOString() } : o)
        }));
      } else {
        throw new Error(result.error || 'Error al actualizar estado');
      }
    } catch (err: any) {
      console.error('Backend status update failed', err);
      set({ error: err.message });
    } finally {
      set({ isLoading: false });
    }
  }
}));