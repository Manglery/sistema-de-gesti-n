import { Hono } from "hono";
import type { AppEnv } from './types/app-env';
import { WAREHOUSE_DATA } from '../src/lib/mock-data';
import { INVENTORY_BY_WAREHOUSE } from '../src/lib/inventory-data';
import { MOCK_ORDERS } from '../src/lib/orders-data';
export function userRoutes(app: Hono<AppEnv>) {
  // Dashboard Metrics API
  app.get('/api/dashboard/:warehouseId', (c) => {
    const warehouseId = c.req.param('warehouseId');
    const month = c.req.query('month');
    const year = c.req.query('year');
    // In a real app, we would query a DB with month/year/warehouseId
    const data = WAREHOUSE_DATA[warehouseId] || WAREHOUSE_DATA.contadores;
    // Simulate slight variations based on temporal filters for the "live" feel
    const responseData = {
      ...data,
      filtersApplied: { month, year }
    };
    return c.json({ success: true, data: responseData });
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