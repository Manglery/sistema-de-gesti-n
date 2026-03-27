import { Hono } from "hono";
import type { AppEnv } from './types/app-env';
export function userRoutes(app: Hono<AppEnv>) {
  const safeQuery = async (c: any, queryFn: () => Promise<any>) => {
    try {
      return await queryFn();
    } catch (e: any) {
      console.error("[DB ERROR]:", e.message);
      return { error: true, message: e.message };
    }
  };
  // --- DASHBOARD (ENRICHED ANALYTICS) ---
  app.get('/api/dashboard/:warehouseId', async (c) => {
    const warehouseId = c.req.param('warehouseId');
    const formatter = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' });
    try {
      // 1. Core Stats
      const usuarios = await c.env.DB.prepare("SELECT COUNT(DISTINCT user) as usuarios FROM activity_logs WHERE warehouse_id = ?").bind(warehouseId).first();
      const pendientes = await c.env.DB.prepare("SELECT COUNT(*) as count FROM orders WHERE warehouse_id = ? AND status = 'PENDING'").bind(warehouseId).first();
      const despachos = await c.env.DB.prepare("SELECT COUNT(*) as count FROM orders WHERE warehouse_id = ? AND status = 'DISPATCHED'").bind(warehouseId).first();
      const invValue = await c.env.DB.prepare("SELECT SUM(stock * price) as total FROM inventory WHERE warehouse_id = ?").bind(warehouseId).first();
      // 2. Top Product Movement (Join inventory with order_items)
      const movement = await c.env.DB.prepare(`
        SELECT i.description as name, SUM(oi.quantity) as cantidad, SUM(oi.quantity * i.price) as valor 
        FROM order_items oi 
        JOIN orders o ON oi.order_id = o.id 
        JOIN inventory i ON oi.inventory_id = i.id 
        WHERE o.warehouse_id = ? AND o.status = 'DISPATCHED'
        GROUP BY i.id 
        ORDER BY cantidad DESC LIMIT 5
      `).bind(warehouseId).all();
      // 3. Operator Performance
      const operators = await c.env.DB.prepare(`
        SELECT created_by as name, SUM(order_val) as valor 
        FROM (
          SELECT o.created_by, SUM(oi.quantity * i.price) as order_val 
          FROM orders o 
          JOIN order_items oi ON o.id = oi.order_id 
          JOIN inventory i ON oi.inventory_id = i.id 
          WHERE o.warehouse_id = ? AND o.status = 'DISPATCHED'
          GROUP BY o.id
        ) 
        GROUP BY created_by 
        ORDER BY valor DESC LIMIT 5
      `).bind(warehouseId).all();
      // 4. Critical Stock Alerts
      const alerts = await c.env.DB.prepare(`
        SELECT id, code, description as name, stock as current, min_stock as min 
        FROM inventory 
        WHERE warehouse_id = ? AND stock <= min_stock
      `).bind(warehouseId).all();
      return c.json({ 
        success: true, 
        data: {
          stats: {
            usuarios: Number(usuarios?.usuarios || 0),
            pendientes: Number(pendientes?.count || 0),
            despachos: Number(despachos?.count || 0),
            inventario: formatter.format(Number(invValue?.total || 0)),
            efectividad: "94.2%",
            valorSalida: formatter.format(Number(invValue?.total || 0) * 0.05)
          },
          movement: movement.results || [],
          operators: operators.results || [],
          alerts: alerts.results || []
        }
      });
    } catch (e: any) {
      return c.json({ success: false, error: e.message }, 500);
    }
  });
  // --- RETURNS MODULE ---
  app.get('/api/returns/:warehouseId', async (c) => {
    const warehouseId = c.req.param('warehouseId');
    const result = await safeQuery(c, () => c.env.DB.prepare("SELECT * FROM returns WHERE warehouse_id = ? ORDER BY created_at DESC").bind(warehouseId).all());
    if (result.error) return c.json({ success: false, error: 'Database error' }, 500);
    return c.json({ success: true, data: result.results });
  });
  app.post('/api/returns', async (c) => {
    const body = await c.req.json();
    const { id, warehouse_id, order_number, material_name, reason, status } = body;
    const result = await safeQuery(c, () => 
      c.env.DB.prepare("INSERT INTO returns (id, warehouse_id, order_number, material_name, reason, status) VALUES (?, ?, ?, ?, ?, ?)")
        .bind(id, warehouse_id, order_number, material_name, reason, status).run()
    );
    if (result.error) return c.json({ success: false, error: 'Failed to create return' }, 500);
    return c.json({ success: true });
  });
  app.put('/api/returns/:id/status', async (c) => {
    const id = c.req.param('id');
    const { status } = await c.req.json();
    const result = await safeQuery(c, () => 
      c.env.DB.prepare("UPDATE returns SET status = ? WHERE id = ?").bind(status, id).run()
    );
    return c.json({ success: !result.error });
  });
  // --- PURCHASES MODULE ---
  app.get('/api/purchases/:warehouseId', async (c) => {
    const warehouseId = c.req.param('warehouseId');
    const result = await safeQuery(c, () => c.env.DB.prepare("SELECT * FROM purchases WHERE warehouse_id = ? ORDER BY delivery_date ASC").bind(warehouseId).all());
    if (result.error) return c.json({ success: false, error: 'Database error' }, 500);
    return c.json({ success: true, data: result.results });
  });
  app.post('/api/purchases', async (c) => {
    const p = await c.req.json();
    const result = await safeQuery(c, () => 
      c.env.DB.prepare("INSERT INTO purchases (id, warehouse_id, vendor_name, total_amount, status, delivery_date, items_count) VALUES (?, ?, ?, ?, ?, ?, ?)")
        .bind(p.id, p.warehouse_id, p.vendor_name, p.total_amount, p.status, p.delivery_date, p.items_count).run()
    );
    return c.json({ success: !result.error });
  });
  app.put('/api/purchases/:id/receive', async (c) => {
    const id = c.req.param('id');
    const { warehouseId, user } = await c.req.json();
    try {
      // In a real scenario, this would atomicaly update specific inventory items based on a PO.
      // For this phase, we update the status and log the receipt.
      await c.env.DB.batch([
        c.env.DB.prepare("UPDATE purchases SET status = 'COMPLETED' WHERE id = ?").bind(id),
        c.env.DB.prepare("INSERT INTO activity_logs (id, warehouse_id, type, message, user) VALUES (?, ?, ?, ?, ?)")
          .bind(crypto.randomUUID(), warehouseId, 'STOCK_ADJUSTED', `Recepción de compra ${id} completada`, user)
      ]);
      return c.json({ success: true });
    } catch (e: any) {
      return c.json({ success: false, error: e.message }, 500);
    }
  });
  // --- LEGACY ENDPOINTS (Preserved from Phase 1) ---
  app.get('/api/warehouses', async (c) => {
    const result = await safeQuery(c, () => c.env.DB.prepare("SELECT * FROM warehouses ORDER BY name ASC").all());
    return c.json({ success: !result.error, data: result.results });
  });
  app.get('/api/users', async (c) => {
    const result = await safeQuery(c, () => c.env.DB.prepare("SELECT * FROM users ORDER BY created_at DESC").all());
    const data = (result.results || []).map((u: any) => ({
      ...u,
      warehouseIds: JSON.parse(u.warehouse_ids || '[]'),
      lastAccess: u.last_access || '-'
    }));
    return c.json({ success: !result.error, data });
  });
  app.get('/api/inventory/:warehouseId', async (c) => {
    const warehouseId = c.req.param('warehouseId');
    const result = await safeQuery(c, () => c.env.DB.prepare("SELECT * FROM inventory WHERE warehouse_id = ?").bind(warehouseId).all());
    return c.json({ success: !result.error, data: result.results });
  });
  app.get('/api/activity/:warehouseId', async (c) => {
    const warehouseId = c.req.param('warehouseId');
    const result = await safeQuery(c, () => c.env.DB.prepare("SELECT * FROM activity_logs WHERE warehouse_id = ? ORDER BY created_at DESC LIMIT 20").bind(warehouseId).all());
    return c.json({ success: !result.error, data: result.results || [] });
  });
}