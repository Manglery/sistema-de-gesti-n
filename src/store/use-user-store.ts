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
}
interface UserState {
  users: User[];
  isLoading: boolean;
  fetchUsers: () => Promise<void>;
  addUser: (user: User) => Promise<void>;
  toggleUserStatus: (id: string) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
}
export const useUserStore = create<UserState>((set, get) => ({
  users: [],
  isLoading: false,
  fetchUsers: async () => {
    set({ isLoading: true });
    try {
      const response = await fetch('/api/users');
      const result = await response.json();
      if (result.success) {
        set({ users: result.data ?? [], isLoading: false });
      }
    } catch (err) {
      console.error('Fetch users failed', err);
      set({ isLoading: false });
    }
  },
  addUser: async (user) => {
    set({ isLoading: true });
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      });
      const result = await response.json();
      if (result.success) {
        set((state) => ({ users: [user, ...state.users] }));
      }
    } catch (err) {
      console.error('Add user failed', err);
    } finally {
      set({ isLoading: false });
    }
  },
  toggleUserStatus: async (id) => {
    set({ isLoading: true });
    const user = get().users.find(u => u.id === id);
    if (!user) {
      set({ isLoading: false });
      return;
    }
    const newStatus = user.status === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO';
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const result = await response.json();
      if (result.success) {
        set((state) => ({
          users: state.users.map(u => u.id === id ? { ...u, status: newStatus } : u)
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