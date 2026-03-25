import { create } from 'zustand';
export type UserRole = 'ADMIN' | 'SUPERADMIN' | 'ALMACENERO' | 'OPERARIO';
export type UserStatus = 'ACTIVO' | 'INACTIVO';
export interface User {
  id: string;
  username: string;
  fullName: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  lastAccess: string;
  warehouseIds: string[];
  employeeId: string;
  phone: string;
}
interface UserState {
  users: User[];
  isLoading: boolean;
  fetchUsers: () => Promise<void>;
  addUser: (user: User) => Promise<void>;
  toggleUserStatus: (id: string) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
}
const toSnakeCaseUser = (user: User) => ({
  id: user.id,
  username: user.username,
  full_name: user.fullName,
  email: user.email,
  role: user.role,
  status: user.status,
  warehouse_ids: JSON.stringify(user.warehouseIds),
  employee_id: user.employeeId,
  phone: user.phone
});
const fromSnakeCaseUser = (data: any): User => ({
  id: data.id,
  username: data.username,
  fullName: data.full_name,
  email: data.email,
  role: data.role,
  status: data.status,
  lastAccess: data.last_access || '-',
  warehouseIds: data.warehouse_ids ? JSON.parse(data.warehouse_ids) : [],
  employeeId: data.employee_id || '-',
  phone: data.phone || '-'
});
export const useUserStore = create<UserState>((set, get) => ({
  users: [],
  isLoading: false,
  fetchUsers: async () => {
    set({ isLoading: true });
    try {
      const response = await fetch('/api/users');
      const result = await response.json();
      if (result.success) {
        set({ users: (result.data ?? []).map(fromSnakeCaseUser) });
      }
    } catch (err) {
      console.error('Fetch users failed', err);
    } finally {
      set({ isLoading: false });
    }
  },
  addUser: async (user) => {
    set({ isLoading: true });
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(toSnakeCaseUser(user))
      });
      const result = await response.json();
      if (result.success) {
        set((state) => ({ users: [user, ...state.users] }));
      } else {
        throw new Error(result.error || 'Failed to add user');
      }
    } catch (err) {
      console.error('Add user failed', err);
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },
  toggleUserStatus: async (id) => {
    const users = get().users;
    const user = users.find(u => u.id === id);
    if (!user) return;
    const newStatus = user.status === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO';
    set({ isLoading: true });
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const result = await response.json();
      if (result.success && result.data) {
        const updatedUser = fromSnakeCaseUser(result.data);
        set((state) => ({
          users: state.users.map(u => u.id === id ? updatedUser : u)
        }));
      } else {
        set((state) => ({
          users: state.users.map(u => u.id === id ? { ...u, status: newStatus as UserStatus } : u)
        }));
      }
    } catch (err) {
      console.error('Toggle status failed', err);
    } finally {
      set({ isLoading: false });
    }
  },
  deleteUser: async (id) => {
    set({ isLoading: true });
    try {
      const response = await fetch(`/api/users/${id}`, { method: 'DELETE' });
      const result = await response.json();
      if (result.success) {
        set((state) => ({
          users: state.users.filter(u => u.id !== id)
        }));
      }
    } catch (err) {
      console.error('Delete user failed', err);
    } finally {
      set({ isLoading: false });
    }
  },
}));