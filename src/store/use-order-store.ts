import { create } from 'zustand';
import { Order, MOCK_ORDERS, OrderStatus } from '@/lib/orders-data';
interface OrderState {
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  deleteOrder: (id: string) => void;
}
export const useOrderStore = create<OrderState>((set) => ({
  orders: MOCK_ORDERS,
  addOrder: (order) => set((state) => ({ 
    orders: [order, ...state.orders] 
  })),
  updateOrderStatus: (id, status) => set((state) => ({
    orders: state.orders.map(o => o.id === id ? { ...o, status, updatedAt: new Date().toISOString() } : o)
  })),
  deleteOrder: (id) => set((state) => ({
    orders: state.orders.filter(o => o.id !== id)
  }))
}));