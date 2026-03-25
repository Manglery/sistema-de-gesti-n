import { useMemo } from 'react';
import { useOrderStore } from '@/store/use-order-store';
import { useAuthStore } from '@/store/use-auth-store';
export function useOrders() {
  const currentWarehouseId = useAuthStore(s => s.currentWarehouseId);
  const orders = useOrderStore(s => s.orders);
  const updateOrderStatus = useOrderStore(s => s.updateOrderStatus);
  const addOrder = useOrderStore(s => s.addOrder);
  const warehouseOrders = useMemo(() => {
    return orders.filter(o => o.warehouseId === currentWarehouseId);
  }, [orders, currentWarehouseId]);
  const pendingCount = useMemo(() => {
    return warehouseOrders.filter(o => o.status === 'PENDING').length;
  }, [warehouseOrders]);
  const dispatchedCount = useMemo(() => {
    return warehouseOrders.filter(o => o.status === 'DISPATCHED').length;
  }, [warehouseOrders]);
  return {
    orders: warehouseOrders,
    pendingCount,
    dispatchedCount,
    updateOrderStatus,
    addOrder
  };
}