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
  addUser: (user: User) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  toggleUserStatus: (id: string) => void;
  deleteUser: (id: string) => void;
}
export const useUserStore = create<UserState>((set) => ({
  users: [
    { id: '1', username: 'admin', fullName: 'Administrador del Sistema', email: 'admin@mrx.com', role: 'ADMIN', status: 'ACTIVO', lastAccess: '2026-03-18T15:50:17', warehouseIds: ['contadores'] },
    { id: '2', username: 'admin2', fullName: 'admin2', email: 'jaircastillo2302@gmail.com', role: 'SUPERADMIN', status: 'ACTIVO', lastAccess: '2026-03-19T23:07:09', warehouseIds: ['contadores', 'averias'] },
    { id: '3', username: 'admin3', fullName: 'admin-prueba-alm2', email: 'jaircastillo2302@gmail.com', role: 'ADMIN', status: 'ACTIVO', lastAccess: '2026-03-27T04:18:27', warehouseIds: ['averias'] },
    { id: '4', username: 'adminpruebas', fullName: 'Administrador de Pruebas', email: 'adminpruebas@mrx.com', role: 'ADMIN', status: 'INACTIVO', lastAccess: '-', warehouseIds: ['contadores'] },
    { id: '5', username: 'almacenero', fullName: 'Almacenero Principal', email: 'almacen@mrx.com', role: 'ALMACENERO', status: 'INACTIVO', lastAccess: '-', warehouseIds: ['contadores'] },
    { id: '6', username: 'digitador', fullName: 'Ana Torres Digitadora', email: 'digitador@acciona.pe', role: 'ALMACENERO', status: 'ACTIVO', lastAccess: '-', warehouseIds: ['contadores'] },
    { id: '7', username: 'myerren', fullName: 'Mangler Yerren', email: 'myerren@gmail.com', role: 'ADMIN', status: 'ACTIVO', lastAccess: '2026-03-26T23:47:16', warehouseIds: ['contadores', 'averias', 'acometidas'] },
    { id: '8', username: 'operario', fullName: 'Carlos Ruiz Operario', email: 'operario@acciona.pe', role: 'ALMACENERO', status: 'ACTIVO', lastAccess: '-', warehouseIds: ['acometidas'] },
    { id: '9', username: 'Prueba', fullName: 'Prueba Test', email: 'prueba@gmail.com', role: 'ALMACENERO', status: 'INACTIVO', lastAccess: '-', warehouseIds: ['contadores'] },
  ],
  addUser: (user) => set((state) => ({ 
    users: [user, ...state.users] 
  })),
  updateUser: (id, updates) => set((state) => ({
    users: state.users.map(u => u.id === id ? { ...u, ...updates } : u)
  })),
  toggleUserStatus: (id) => set((state) => ({
    users: state.users.map(u => u.id === id ? { ...u, status: u.status === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO' } : u)
  })),
  deleteUser: (id) => set((state) => ({
    users: state.users.filter(u => u.id !== id)
  })),
}));