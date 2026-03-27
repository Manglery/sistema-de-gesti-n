import { create } from 'zustand';
export type UserRole = 'admin' | 'almacenero' | 'operario';
export interface Warehouse {
  id: string;
  name: string;
  color: string;
  location?: string;
  capacity?: string;
  operatorsCount?: number;
}
interface AuthState {
  role: UserRole;
  currentWarehouseId: string;
  warehouses: Warehouse[];
  userName: string;
  lastUpdated: string;
  setRole: (role: UserRole) => void;
  setWarehouseId: (id: string) => void;
  fetchWarehouses: () => Promise<void>;
  addWarehouse: (warehouse: Warehouse) => Promise<void>;
}
export const useAuthStore = create<AuthState>((set) => ({
  role: 'admin',
  userName: 'Mangler Yerren',
  currentWarehouseId: 'contadores',
  warehouses: [],
  lastUpdated: new Date().toISOString(),
  setRole: (role) => set({ role }),
  setWarehouseId: (currentWarehouseId) => set({ 
    currentWarehouseId,
    lastUpdated: new Date().toISOString()
  }),
  fetchWarehouses: async () => {
    try {
      const response = await fetch('/api/warehouses');
      const result = await response.json();
      if (result.success) {
        set({ 
          warehouses: result.data || [],
          lastUpdated: new Date().toISOString()
        });
        // Default to first warehouse if none selected
        if (result.data?.length > 0) {
          set({ currentWarehouseId: result.data[0].id });
        }
      }
    } catch (err) {
      console.error('Fetch warehouses failed', err);
    }
  },
  addWarehouse: async (warehouse) => {
    try {
      const response = await fetch('/api/warehouses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(warehouse)
      });
      const result = await response.json();
      if (result.success) {
        set((state) => ({ 
          warehouses: [...state.warehouses, warehouse],
          lastUpdated: new Date().toISOString()
        }));
      }
    } catch (err) {
      console.error('Create warehouse failed', err);
    }
  },
}));