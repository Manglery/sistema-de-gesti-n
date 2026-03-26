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
  setRole: (role: UserRole) => void;
  setWarehouseId: (id: string) => void;
  addWarehouse: (warehouse: Warehouse) => void;
}
export const useAuthStore = create<AuthState>((set) => ({
  role: 'admin',
  userName: 'Mangler Yerren',
  currentWarehouseId: 'contadores',
  warehouses: [
    { id: 'contadores', name: 'Almacén de Contadores', color: 'bg-red-600', location: 'Zona Norte, Nave A', capacity: '85%', operatorsCount: 12 },
    { id: 'averias', name: 'Almacén de Averías', color: 'bg-orange-600', location: 'Zona Sur, Nave C', capacity: '42%', operatorsCount: 5 },
    { id: 'acometidas', name: 'Almacén de Acometidas', color: 'bg-blue-600', location: 'Zona Este, Nave B', capacity: '68%', operatorsCount: 8 },
  ],
  setRole: (role) => set({ role }),
  setWarehouseId: (currentWarehouseId) => set({ currentWarehouseId }),
  addWarehouse: (warehouse) => set((state) => ({ 
    warehouses: [...state.warehouses, warehouse] 
  })),
}));