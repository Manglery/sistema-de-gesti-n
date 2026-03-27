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
  isAuthenticated: boolean;
  role: UserRole;
  userName: string;
  currentWarehouseId: string;
  warehouses: Warehouse[];
  lastUpdated: string;
  login: (role: UserRole, userName: string, warehouseId: string) => void;
  logout: () => void;
  setRole: (role: UserRole) => void;
  setWarehouseId: (id: string) => void;
  fetchWarehouses: () => Promise<void>;
  addWarehouse: (warehouse: Warehouse) => Promise<void>;
}
const getInitialSession = () => {
  const session = localStorage.getItem('acciona_session');
  if (session) {
    try {
      return JSON.parse(session);
    } catch {
      return null;
    }
  }
  return null;
};

const getCurrentSession = () => {
  const session = localStorage.getItem('acciona_session');
  if (session) {
    try {
      return JSON.parse(session);
    } catch {
      return null;
    }
  }
  return null;
};
const initialSession = getInitialSession();
export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: !!initialSession,
  role: initialSession?.role || 'admin',
  userName: initialSession?.userName || '',
  currentWarehouseId: initialSession?.warehouseId || 'contadores',
  warehouses: [],
  lastUpdated: new Date().toISOString(),
  login: (role, userName, warehouseId) => {
    const session = { role, userName, warehouseId };
    localStorage.setItem('acciona_session', JSON.stringify(session));
    set({ 
      isAuthenticated: true, 
      role, 
      userName, 
      currentWarehouseId: warehouseId,
      lastUpdated: new Date().toISOString()
    });
  },
  logout: () => {
    localStorage.removeItem('acciona_session');
    set({ isAuthenticated: false, role: 'operario', userName: '' });
  },
  setRole: (role) => {
    set({ role });
    // Update local storage if authenticated
    const session = getCurrentSession();
    if (session) {
      localStorage.setItem('acciona_session', JSON.stringify({ ...session, role }));
    }
  },
  setWarehouseId: (id) => {
    set({ 
      currentWarehouseId: id,
      lastUpdated: new Date().toISOString()
    });
    const session = getCurrentSession();
    if (session) {
      localStorage.setItem('acciona_session', JSON.stringify({ ...session, warehouseId: id }));
    }
  },
  fetchWarehouses: async () => {
    try {
      const response = await fetch('/api/warehouses');
      const result = await response.json();
      if (result.success) {
        set({ 
          warehouses: result.data || [],
          lastUpdated: new Date().toISOString()
        });
        // Si no hay almacen seleccionado, poner el primero
        if (result.data?.length > 0 && !getCurrentSession()?.warehouseId) {
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