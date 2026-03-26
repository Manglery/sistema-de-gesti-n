import { create } from 'zustand';
import { InventoryItem, INVENTORY_BY_WAREHOUSE } from '@/lib/inventory-data';
interface InventoryState {
  inventory: Record<string, InventoryItem[]>;
  adjustStock: (warehouseId: string, itemId: string, amount: number) => void;
  transferStock: (fromWarehouseId: string, toWarehouseId: string, itemId: string, quantity: number) => void;
  setWarehouseInventory: (warehouseId: string, items: InventoryItem[]) => void;
}
export const useInventoryStore = create<InventoryState>((set) => ({
  inventory: INVENTORY_BY_WAREHOUSE,
  adjustStock: (warehouseId, itemId, amount) => set((state) => {
    const warehouseItems = state.inventory[warehouseId] || [];
    const updatedItems = warehouseItems.map((item) => {
      if (item.id === itemId) {
        const newStock = Math.max(0, item.stock + amount);
        let status: InventoryItem['status'] = 'In Stock';
        if (newStock === 0) status = 'Out of Stock';
        else if (newStock <= item.minStock) status = 'Low Stock';
        return { ...item, stock: newStock, status };
      }
      return item;
    });
    return {
      inventory: {
        ...state.inventory,
        [warehouseId]: updatedItems,
      },
    };
  }),
  transferStock: (fromId, toId, itemId, qty) => set((state) => {
    const fromItemsCopy = [...(state.inventory[fromId] || [])];
    const toItemsCopy = [...(state.inventory[toId] || [])];
    
    const fromItemIndex = fromItemsCopy.findIndex(i => i.id === itemId);
    if (fromItemIndex === -1) {
      return state;
    }
    
    const itemToMove = fromItemsCopy[fromItemIndex];
    if (itemToMove.stock < qty) {
      return state;
    }
    
    // Update from warehouse
    fromItemsCopy[fromItemIndex] = { ...itemToMove, stock: itemToMove.stock - qty };
    
    // Find or create in to warehouse
    const toItemIndex = toItemsCopy.findIndex(i => i.id === itemId);
    if (toItemIndex !== -1) {
      // Same item exists, just add stock
      toItemsCopy[toItemIndex] = {
        ...toItemsCopy[toItemIndex],
        stock: toItemsCopy[toItemIndex].stock + qty
      };
    } else {
      // Create new item instance in target warehouse
      toItemsCopy.push({
        ...itemToMove,
        id: crypto.randomUUID(),
        stock: qty
      });
    }
    
    return {
      inventory: {
        ...state.inventory,
        [fromId]: fromItemsCopy,
        [toId]: toItemsCopy,
      }
    };
  }),
  setWarehouseInventory: (warehouseId, items) => set((state) => ({
    inventory: { ...state.inventory, [warehouseId]: items }
  })),
}));