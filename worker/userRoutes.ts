import { Hono } from "hono";
import type { AppEnv } from './types/app-env';
import { WAREHOUSE_DATA, getVaryingData } from '../src/lib/mock-data';
import { INVENTORY_BY_WAREHOUSE } from '../src/lib/inventory-data';
import { MOCK_ORDERS } from '../src/lib/orders-data';
export function userRoutes(app: Hono<AppEnv>) {
  // Dashboard Metrics API
  app.get('/api/dashboard/:warehouseId', (c) => {
    const warehouseId = c.req.param('warehouseId');
    const month = c.req.query('month') || 'marzo';
    const year = c.req.query('year') || '2026';
    // Base data
    const baseData = WAREHOUSE_DATA[warehouseId] || WAREHOUSE_DATA.contadores;
    // Simulate dynamic data variation based on selected filters
    const dynamicData = getVaryingData(baseData, month, year);
    return c.json({ 
      success: true, 
      data: dynamicData,
      filtersApplied: { month, year }
    });
  });
  // Inventory API
  app.get('/api/inventory/:warehouseId', (c) => {
    const warehouseId = c.req.param('warehouseId');
    const data = INVENTORY_BY_WAREHOUSE[warehouseId] || [];
    return c.json({ success: true, data });
  });
  // Orders API
  app.get('/api/orders/:warehouseId', (c) => {
    const warehouseId = c.req.param('warehouseId');
    const data = MOCK_ORDERS.filter(o => o.warehouseId === warehouseId);
    return c.json({ success: true, data });
  });
}