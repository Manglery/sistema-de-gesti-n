import { create } from 'zustand';
export type ActivityType = 'ORDER_CREATED' | 'ORDER_DISPATCHED' | 'STOCK_ADJUSTED' | 'WAREHOUSE_CREATED' | 'USER_ACTION';
export interface ActivityLog {
  id: string;
  timestamp: string;
  type: ActivityType;
  message: string;
  user: string;
  warehouseId: string;
  metadata?: any;
}
interface ActivityState {
  logs: ActivityLog[];
  fetchLogs: (warehouseId: string) => Promise<void>;
  addLog: (log: Omit<ActivityLog, 'id' | 'timestamp'>) => Promise<void>;
}
export const useActivityStore = create<ActivityState>((set) => ({
  logs: [],
  fetchLogs: async (warehouseId) => {
    try {
      const response = await fetch(`/api/activity/${warehouseId}`);
      const result = await response.json();
      if (result.success) {
        set({ logs: result.data });
      }
    } catch (err) {
      console.error('Fetch logs failed', err);
    }
  },
  addLog: async (log) => {
    // Usually log creation is triggered by other API actions on the server
    // But for manual UI logs if needed:
    const newLog: ActivityLog = {
      ...log,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString()
    };
    set((state) => ({
      logs: [newLog, ...state.logs].slice(0, 50)
    }));
  }
}));