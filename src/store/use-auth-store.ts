import { create } from 'zustand';
export type UserRole = 'admin' | 'almacenero' | 'operario';
export interface Warehouse {
  id: string;
  name: string;
  color: string;
}
interface AuthState {
  role: UserRole;
  currentWarehouseId: string;
  warehouses: Warehouse[];
  userName: string;
  setRole: (role: UserRole) => void;
  setWarehouseId: (id: string) => void;
}
export const useAuthStore = create<AuthState>((set) => ({
  role: 'admin',
  userName: 'Mangler Yerren',
  currentWarehouseId: 'contadores',
  warehouses: [
    { id: 'contadores', name: 'Almacén de Contadores', color: 'bg-red-600' },
    { id: 'averias', name: 'Almacén de Averías', color: 'bg-orange-600' },
    { id: 'acometidas', name: 'Almacén de Acometidas', color: 'bg-blue-600' },
  ],
  setRole: (role) => set({ role }),
  setWarehouseId: (currentWarehouseId) => set({ currentWarehouseId }),
}));