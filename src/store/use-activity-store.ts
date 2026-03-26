import { create } from 'zustand';
export type ActivityType = 'ORDER_CREATED' | 'ORDER_DISPATCHED' | 'STOCK_ADJUSTED' | 'WAREHOUSE_CREATED' | 'USER_ACTION';
export interface ActivityLog {
  id: string;
  timestamp: string;
  type: ActivityType;
  message: string;
  user: string;
  warehouseId: string;
  metadata?: Record<string, any>;
}
interface ActivityState {
  logs: ActivityLog[];
  addLog: (log: Omit<ActivityLog, 'id' | 'timestamp'>) => void;
  clearLogs: () => void;
}
export const useActivityStore = create<ActivityState>((set) => ({
  logs: [
    {
      id: 'initial-1',
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      type: 'USER_ACTION',
      message: 'Sesión iniciada correctamente',
      user: 'Mangler Yerren',
      warehouseId: 'contadores'
    }
  ],
  addLog: (log) => set((state) => ({
    logs: [
      {
        ...log,
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
      },
      ...state.logs,
    ].slice(0, 50), // Keep last 50
  })),
  clearLogs: () => set({ logs: [] }),
}));