import { Hono } from "hono";
import type { AppEnv } from './types/app-env';
export function userRoutes(app: Hono<AppEnv>) {
  // Warehouses API
  app.get('/api/warehouses', async (c) => {
    const { results } = await c.env.DB.prepare("SELECT * FROM warehouses ORDER BY name ASC").all();
    return c.json({ success: true, data: results });
  });
  app.post('/api/warehouses', async (c) => {
    const body = await c.req.json();
    const { id, name, color, location } = body;
    await c.env.DB.prepare(
      "INSERT INTO warehouses (id, name, color, location) VALUES (?, ?, ?, ?)"
    ).bind(id, name, color, location).run();
    return c.json({ success: true });
  });
  // Dashboard Metrics API
  app.get('/api/dashboard/:warehouseId', async (c) => {
    const warehouseId = c.req.param('warehouseId');
    // Stats - split for D1 compatibility
    const usuarios = await c.env.DB.prepare("SELECT COUNT(DISTINCT user) as usuarios FROM activity_logs WHERE warehouse_id = ?").bind(warehouseId).first();
    const pendientes = await c.env.DB.prepare("SELECT COUNT(*) as pendientes FROM orders WHERE warehouse_id = ? AND status = 'PENDING'").bind(warehouseId).first();
    const despachos = await c.env.DB.prepare("SELECT COUNT(*) as despachos FROM orders WHERE warehouse_id = ? AND status = 'DISPATCHED'").bind(warehouseId).first();
    const total_items = await c.env.DB.prepare("SELECT COUNT(*) as total_items FROM inventory WHERE warehouse_id = ?").bind(warehouseId).first();
    // Top Products (MOCK VALOR as it's computed differently in a real system)
    const movements = await c.env.DB.prepare(`
      SELECT description as name, SUM(quantity) as cantidad, 1000 as valor
      FROM order_items oi
      JOIN orders o ON oi.order_id = o.id
      WHERE o.warehouse_id = ?
      GROUP BY description
      ORDER BY cantidad DESC LIMIT 5
    `).bind(warehouseId).all();
    // Top Operators
    const operators = await c.env.DB.prepare(`
      SELECT created_by as name, COUNT(*) * 500 as valor
      FROM orders
      WHERE warehouse_id = ? AND status = 'DISPATCHED'
      GROUP BY created_by
      ORDER BY valor DESC LIMIT 5
    `).bind(warehouseId).all();
    // Alerts
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
          pendientes: Number(pendientes?.pendientes || 0),
          despachos: Number(despachos?.despachos || 0),
          inventario: "€1.397.383.617,35", // Keeping UI consistency
          efectividad: "93.3%",
          valorSalida: "€93.608,47"
        },
        movement: movements.results || [],
        operators: operators.results || [],
        alerts: alerts.results || []
      }
    });
  });
  // Inventory API
  app.get('/api/inventory/:warehouseId', async (c) => {
    const warehouseId = c.req.param('warehouseId');
    const { results } = await c.env.DB.prepare("SELECT * FROM inventory WHERE warehouse_id = ?").bind(warehouseId).all();
    return c.json({ success: true, data: results });
  });
  app.post('/api/inventory/adjust', async (c) => {
    const { warehouseId, itemId, amount, reason, user } = await c.req.json();
    // Update Stock
    const item = await c.env.DB.prepare("SELECT stock, min_stock FROM inventory WHERE id = ?").bind(itemId).first();
    if (!item) return c.json({ success: false, error: 'Item not found' }, 404);
    const newStock = Math.max(0, Number(item.stock) + amount);
    let status = 'In Stock';
    if (newStock === 0) status = 'Out of Stock';
    else if (newStock <= Number(item.min_stock || 0)) status = 'Low Stock';
    await c.env.DB.prepare("UPDATE inventory SET stock = ?, status = ? WHERE id = ?")
      .bind(newStock, status, itemId).run();
    // Log activity - parameterized to prevent injection
    await c.env.DB.prepare(
      "INSERT INTO activity_logs (id, warehouse_id, type, message, user, metadata) VALUES (?, ?, ?, ?, ?, ?)"
    ).bind(
      crypto.randomUUID(), 
      warehouseId, 
      'STOCK_ADJUSTED', 
      `Stock ajustado para item ${itemId}: ${amount}. Motivo: ${reason}`, 
      user, 
      JSON.stringify({ amount, reason })
    ).run();
    return c.json({ success: true });
  });
  // Orders API
  app.get('/api/orders/:warehouseId', async (c) => {
    const warehouseId = c.req.param('warehouseId');
    const orders = await c.env.DB.prepare("SELECT * FROM orders WHERE warehouse_id = ? ORDER BY created_at DESC").bind(warehouseId).all();
    // Attach items to each order
    const data = await Promise.all((orders.results || []).map(async (order: any) => {
      const items = await c.env.DB.prepare("SELECT * FROM order_items WHERE order_id = ?").bind(order.id).all();
      return {
        ...order,
        createdAt: order.created_at,
        updatedAt: order.updated_at,
        orderNumber: order.order_number,
        customerName: order.customer_name,
        createdBy: order.created_by,
        items: items.results || []
      };
    }));
    return c.json({ success: true, data });
  });
  app.post('/api/orders', async (c) => {
    const body = await c.req.json();
    const { id, orderNumber, warehouseId, customerName, items = [], status, createdBy } = body;
    // Transactional insert (D1 doesn't have multi-statement transactions yet in simple prep, but we can chain)
    await c.env.DB.prepare(
      "INSERT INTO orders (id, order_number, warehouse_id, customer_name, status, created_by) VALUES (?, ?, ?, ?, ?, ?)"
    ).bind(id, orderNumber, warehouseId, customerName || '', status || 'PENDING', createdBy || '').run();
    for (const item of items) {
      if (item.id && item.code && item.description) {
        await c.env.DB.prepare(
          "INSERT INTO order_items (id, order_id, inventory_id, code, description, quantity, unit) VALUES (?, ?, ?, ?, ?, ?, ?)"
        ).bind(crypto.randomUUID(), id, item.id, item.code, item.description, Number(item.quantity) || 0, item.unit || '').run();
      }
    }
    return c.json({ success: true });
  });
  app.get('/api/activity/:warehouseId', async (c) => {
    const warehouseId = c.req.param('warehouseId');
    const { results } = await c.env.DB.prepare(
      "SELECT * FROM activity_logs WHERE warehouse_id = ? ORDER BY created_at DESC LIMIT 50"
    ).bind(warehouseId).all();
    const data = (results || []).map((log: any) => ({
      ...log,
      timestamp: log.created_at
    }));
    return c.json({ success: true, data });
  });
}