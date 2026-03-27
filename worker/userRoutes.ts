import { Hono } from "hono";
import type { AppEnv } from './types/app-env';
export function userRoutes(app: Hono<AppEnv>) {
  // Warehouses API
  app.get('/api/warehouses', async (c) => {
    const { results } = await c.env.DB.prepare("SELECT * FROM warehouses ORDER BY name ASC").all();
    return c.json({ success: true, data: results });
  });
  // Users API
  app.get('/api/users', async (c) => {
    const { results } = await c.env.DB.prepare("SELECT * FROM users ORDER BY created_at DESC").all();
    const data = results.map((u: any) => ({
      ...u,
      warehouseIds: JSON.parse(u.warehouse_ids || '[]'),
      lastAccess: u.last_access || '-'
    }));
    return c.json({ success: true, data });
  });
  app.post('/api/users', async (c) => {
    const body = await c.req.json();
    const { id, username, fullName, email, role, status, warehouseIds } = body;
    await c.env.DB.prepare(
      "INSERT INTO users (id, username, full_name, email, role, status, warehouse_ids) VALUES (?, ?, ?, ?, ?, ?, ?)"
    ).bind(id, username, fullName, email, role, status, JSON.stringify(warehouseIds)).run();
    return c.json({ success: true });
  });
  app.put('/api/users/:id', async (c) => {
    const id = c.req.param('id');
    const body = await c.req.json();
    const { status } = body;
    if (status) {
      await c.env.DB.prepare("UPDATE users SET status = ? WHERE id = ?").bind(status, id).run();
    }
    return c.json({ success: true });
  });
  app.delete('/api/users/:id', async (c) => {
    const id = c.req.param('id');
    await c.env.DB.prepare("DELETE FROM users WHERE id = ?").bind(id).run();
    return c.json({ success: true });
  });
  // Dashboard Metrics API (Enhanced for dynamic financial aggregation)
  app.get('/api/dashboard/:warehouseId', async (c) => {
    const warehouseId = c.req.param('warehouseId');
    const month = c.req.query('month');
    const year = c.req.query('year');
    // Stats calculations
    const usuarios = await c.env.DB.prepare("SELECT COUNT(DISTINCT user) as usuarios FROM activity_logs WHERE warehouse_id = ?").bind(warehouseId).first();
    let dateFilter = '';
    let dateParams: any[] = [warehouseId];
    if (month && year) {
      dateFilter = "AND strftime('%Y', created_at) = ? AND strftime('%m', created_at) = ?";
      dateParams = [warehouseId, year.padStart(4, '0'), month.padStart(2, '0')];
    }
    const pendientes = await c.env.DB.prepare(`SELECT COUNT(*) as pendientes FROM orders WHERE warehouse_id = ? AND status = 'PENDING' ${dateFilter}`).bind(...dateParams).first();
    const despachos = await c.env.DB.prepare(`SELECT COUNT(*) as despachos FROM orders WHERE warehouse_id = ? AND status = 'DISPATCHED' ${dateFilter}`).bind(...dateParams).first();
    // Financial: Total Inventory Value
    const invValue = await c.env.DB.prepare("SELECT SUM(stock * price) as total FROM inventory WHERE warehouse_id = ?").bind(warehouseId).first();
    // Financial: Valor Salida (Dispatched items * price)
    const outValue = await c.env.DB.prepare(`
      SELECT SUM(oi.quantity * i.price) as total 
      FROM order_items oi 
      JOIN orders o ON oi.order_id = o.id 
      JOIN inventory i ON oi.inventory_id = i.id 
      WHERE o.warehouse_id = ? AND o.status = 'DISPATCHED' ${dateFilter}
    `).bind(...dateParams).first();
    // Effectiveness: Ratio of Dispatched vs Total Orders
    const totalOrders = await c.env.DB.prepare(`SELECT COUNT(*) as total FROM orders WHERE warehouse_id = ? ${dateFilter}`).bind(...dateParams).first();
    const despachosCount = Number(despachos?.despachos || 0);
    const totalCount = Number(totalOrders?.total || 0);
    const eff = totalCount > 0 ? ((despachosCount / totalCount) * 100).toFixed(1) : "0";
    const movements = await c.env.DB.prepare(`
      SELECT oi.description as name, SUM(oi.quantity) as cantidad, SUM(oi.quantity * i.price) as valor
      FROM order_items oi
      JOIN orders o ON oi.order_id = o.id
      JOIN inventory i ON oi.inventory_id = i.id
      WHERE o.warehouse_id = ? ${dateFilter}
      GROUP BY oi.description
      ORDER BY cantidad DESC LIMIT 5
    `).bind(...dateParams).all();
    const operators = await c.env.DB.prepare(`
      SELECT o.created_by as name, SUM(oi.quantity * i.price) as valor
      FROM orders o
      JOIN order_items oi ON oi.order_id = o.id
      JOIN inventory i ON oi.inventory_id = i.id
      WHERE o.warehouse_id = ? AND o.status = 'DISPATCHED' ${dateFilter}
      GROUP BY o.created_by
      ORDER BY valor DESC LIMIT 5
    `).bind(...dateParams).all();
    const alerts = await c.env.DB.prepare(`
      SELECT id, code, description as name, stock as current, min_stock as min
      FROM inventory
      WHERE warehouse_id = ? AND stock <= min_stock
    `).bind(warehouseId).all();
    const formatter = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' });
    return c.json({ 
      success: true, 
      data: {
        stats: {
          usuarios: Number(usuarios?.usuarios || 0),
          pendientes: Number(pendientes?.pendientes || 0),
          despachos: Number(despachos?.despachos || 0),
          inventario: formatter.format(Number(invValue?.total || 0)),
          efectividad: `${eff}%`,
          valorSalida: formatter.format(Number(outValue?.total || 0))
        },
        movement: movements.results || [],
        operators: operators.results || [],
        alerts: alerts.results || []
      }
    });
  });
  // Reports API
  app.get('/api/reports/:warehouseId', async (c) => {
    const warehouseId = c.req.param('warehouseId');
    const year = c.req.query('year');
    let trendsFilter = 'WHERE warehouse_id = ? AND status = \'DISPATCHED\'';
    let trendsParams: any[] = [warehouseId];
    if (year) {
      trendsFilter += " AND strftime('%Y', created_at) = ?";
      trendsParams.push(year.padStart(4, '0'));
    }
    const trends = await c.env.DB.prepare(`
      SELECT strftime('%m', created_at) as month, COUNT(*) as despachos, 10 as compras
      FROM orders 
      ${trendsFilter}
      GROUP BY month
    `).bind(...trendsParams).all();
    const categories = await c.env.DB.prepare(`
      SELECT category as name, SUM(stock * price) as value
      FROM inventory
      WHERE warehouse_id = ?
      GROUP BY category
    `).bind(warehouseId).all();
    return c.json({
      success: true,
      data: {
        monthlyTrends: trends.results || [],
        categories: categories.results || []
      }
    });
  });
  // Inventory API (Updated for Price)
  app.get('/api/inventory/:warehouseId', async (c) => {
    const warehouseId = c.req.param('warehouseId');
    const { results } = await c.env.DB.prepare("SELECT * FROM inventory WHERE warehouse_id = ?").bind(warehouseId).all();
    return c.json({ success: true, data: results });
  });
  app.post('/api/inventory/adjust', async (c) => {
    const { warehouseId, itemId, amount, reason, user } = await c.req.json();
    const item = await c.env.DB.prepare("SELECT stock, min_stock FROM inventory WHERE id = ?").bind(itemId).first();
    if (!item) return c.json({ success: false, error: 'Item not found' }, 404);
    const newStock = Math.max(0, Number(item.stock) + amount);
    let status = 'In Stock';
    if (newStock === 0) status = 'Out of Stock';
    else if (newStock <= Number(item.min_stock || 0)) status = 'Low Stock';
    await c.env.DB.prepare("UPDATE inventory SET stock = ?, status = ? WHERE id = ?")
      .bind(newStock, status, itemId).run();
    await c.env.DB.prepare(
      "INSERT INTO activity_logs (id, warehouse_id, type, message, user, metadata) VALUES (?, ?, ?, ?, ?, ?)"
    ).bind(crypto.randomUUID(), warehouseId, 'STOCK_ADJUSTED', `Stock ajustado para item ${itemId}: ${amount}. Motivo: ${reason}`, user, JSON.stringify({ amount, reason })).run();
    return c.json({ success: true });
  });
  app.get('/api/activity/:warehouseId', async (c) => {
    const warehouseId = c.req.param('warehouseId');
    const { results } = await c.env.DB.prepare("SELECT * FROM activity_logs WHERE warehouse_id = ? ORDER BY created_at DESC LIMIT 50").bind(warehouseId).all();
    return c.json({ success: true, data: results.map((r: any) => ({ ...r, timestamp: r.created_at })) });
  });
}