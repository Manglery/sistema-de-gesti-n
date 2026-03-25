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
  const sessionStr = localStorage.getItem('acciona_session');
  if (sessionStr) {
    try {
      return JSON.parse(sessionStr);
    } catch {
      return null;
    }
  }
  return null;
};
const initialSession = getInitialSession();
export const useAuthStore = create<AuthState>((set, get) => ({
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
    // Trigger warehouse metadata fetching immediately after login
    get().fetchWarehouses();
  },
  logout: () => {
    localStorage.removeItem('acciona_session');
    set({ 
      isAuthenticated: false, 
      role: 'operario', 
      userName: '',
      currentWarehouseId: '',
      warehouses: [] 
    });
  },
  setRole: (role) => {
    set({ role });
    const sessionStr = localStorage.getItem('acciona_session');
    if (sessionStr) {
      try {
        const session = JSON.parse(sessionStr);
        localStorage.setItem('acciona_session', JSON.stringify({ ...session, role }));
      } catch (e) {
        console.error("Failed to update session role", e);
      }
    }
  },
  setWarehouseId: (id) => {
    set({ 
      currentWarehouseId: id,
      lastUpdated: new Date().toISOString()
    });
    const sessionStr = localStorage.getItem('acciona_session');
    if (sessionStr) {
      try {
        const session = JSON.parse(sessionStr);
        localStorage.setItem('acciona_session', JSON.stringify({ ...session, warehouseId: id }));
      } catch (e) {
        console.error("Failed to update session warehouseId", e);
      }
    }
  },
  fetchWarehouses: async () => {
    // Avoid double fetching if we already have data in the last 5 minutes
    const { warehouses, lastUpdated } = get();
    const age = Date.now() - new Date(lastUpdated).getTime();
    if (warehouses.length > 0 && age < 300000) return;
    try {
      const response = await fetch('/api/warehouses');
      const result = await response.json();
      if (result.success) {
        const newWarehouses = result.data || [];
        const currentState = get();
        const updates: any = { 
          warehouses: newWarehouses,
          lastUpdated: new Date().toISOString()
        };
        // Auto-select first warehouse if none selected
        if (newWarehouses.length > 0 && !currentState.currentWarehouseId) {
          updates.currentWarehouseId = newWarehouses[0].id;
        }
        set(updates);
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