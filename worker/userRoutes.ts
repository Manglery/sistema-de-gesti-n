import { Hono } from "hono";
import type { AppEnv } from './types/app-env';
export function userRoutes(app: Hono<AppEnv>) {
  const safeQuery = async (queryFn: () => Promise<any>) => {
    try {
      return await queryFn();
    } catch (e: any) {
      console.error("[DB ERROR]:", e.message);
      return { error: true, message: e.message };
    }
  };
  // --- WAREHOUSES ---
  app.get('/api/warehouses', async (c) => {
    const result = await safeQuery(() => c.env.DB.prepare("SELECT * FROM warehouses").all());
    if (result.error) return c.json({ success: false, error: result.message }, 500);
    return c.json({ success: true, data: result.results });
  });
  app.post('/api/warehouses', async (c) => {
    const body = await c.req.json();
    const { id, name, color, location, capacity, operatorsCount } = body;
    const result = await safeQuery(() => 
      c.env.DB.prepare("INSERT INTO warehouses (id, name, color, location, capacity, operators_count) VALUES (?, ?, ?, ?, ?, ?)")
        .bind(id, name, color, location, capacity, operatorsCount).run()
    );
    if (result.error) return c.json({ success: false, error: result.message }, 500);
    return c.json({ success: true });
  });
  // --- INVENTORY ---
  app.get('/api/inventory/:warehouseId', async (c) => {
    const warehouseId = c.req.param('warehouseId');
    const result = await safeQuery(() => 
      c.env.DB.prepare("SELECT * FROM inventory WHERE warehouse_id = ?").bind(warehouseId).all()
    );
    if (result.error) return c.json({ success: false, error: result.message }, 500);
    return c.json({ success: true, data: result.results });
  });
  app.post('/api/inventory/adjust', async (c) => {
    const { warehouseId, itemId, amount, reason, user } = await c.req.json();
    try {
      await c.env.DB.batch([
        c.env.DB.prepare("UPDATE inventory SET stock = stock + ? WHERE id = ? AND warehouse_id = ?")
          .bind(amount, itemId, warehouseId),
        c.env.DB.prepare("INSERT INTO activity_logs (id, warehouse_id, type, message, user) VALUES (?, ?, 'STOCK_ADJUSTED', ?, ?)")
          .bind(crypto.randomUUID(), warehouseId, `Ajuste de stock: ${reason} (${amount > 0 ? '+' : ''}${amount})`, user)
      ]);
      return c.json({ success: true });
    } catch (e: any) {
      return c.json({ success: false, error: e.message }, 500);
    }
  });
  // --- ORDERS ---
  app.get('/api/orders/:warehouseId', async (c) => {
    const warehouseId = c.req.param('warehouseId');
    const orders = await c.env.DB.prepare("SELECT * FROM orders WHERE warehouse_id = ? ORDER BY created_at DESC").bind(warehouseId).all();
    const results = [];
    for (const order of (orders.results || [])) {
      const items = await c.env.DB.prepare("SELECT * FROM order_items WHERE order_id = ?").bind(order.id).all();
      results.push({ ...order, items: items.results });
    }
    return c.json({ success: true, data: results });
  });
  app.put('/api/orders/:id/status', async (c) => {
    const id = c.req.param('id');
    const { status } = await c.req.json();
    const result = await safeQuery(() => 
      c.env.DB.prepare("UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").bind(status, id).run()
    );
    return c.json({ success: !result.error });
  });
  // --- ACTIVITY LOGS ---
  app.get('/api/activity/:warehouseId', async (c) => {
    const warehouseId = c.req.param('warehouseId');
    const result = await safeQuery(() => 
      c.env.DB.prepare("SELECT * FROM activity_logs WHERE warehouse_id = ? ORDER BY created_at DESC LIMIT 50").bind(warehouseId).all()
    );
    // Map created_at to timestamp for frontend consistency
    const data = (result.results || []).map((l: any) => ({ ...l, timestamp: l.created_at }));
    return c.json({ success: true, data });
  });
  // --- RETURNS ---
  app.get('/api/returns/:warehouseId', async (c) => {
    const warehouseId = c.req.param('warehouseId');
    const result = await safeQuery(() => 
      c.env.DB.prepare("SELECT * FROM returns WHERE warehouse_id = ? ORDER BY created_at DESC").bind(warehouseId).all()
    );
    return c.json({ success: true, data: result.results });
  });
  app.put('/api/returns/:id/status', async (c) => {
    const id = c.req.param('id');
    const { status } = await c.req.json();
    const result = await safeQuery(() => 
      c.env.DB.prepare("UPDATE returns SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").bind(status, id).run()
    );
    return c.json({ success: !result.error });
  });
  // --- PURCHASES ---
  app.get('/api/purchases/:warehouseId', async (c) => {
    const warehouseId = c.req.param('warehouseId');
    const result = await safeQuery(() => 
      c.env.DB.prepare("SELECT * FROM purchases WHERE warehouse_id = ? ORDER BY created_at DESC").bind(warehouseId).all()
    );
    return c.json({ success: true, data: result.results });
  });
  app.put('/api/purchases/:id/receive', async (c) => {
    const id = c.req.param('id');
    const { warehouseId, user } = await c.req.json();
    try {
      // In a real app we would iterate through purchase items to update stock
      // For this phase, we just complete the order and log it
      await c.env.DB.batch([
        c.env.DB.prepare("UPDATE purchases SET status = 'COMPLETED' WHERE id = ?").bind(id),
        c.env.DB.prepare("INSERT INTO activity_logs (id, warehouse_id, type, message, user) VALUES (?, ?, 'PURCHASE_RECEIVED', ?, ?)")
          .bind(crypto.randomUUID(), warehouseId, `Recepción de compra finalizada: ${id}`, user)
      ]);
      return c.json({ success: true });
    } catch (e: any) {
      return c.json({ success: false, error: e.message }, 500);
    }
  });
  // --- DASHBOARD AGGREGATIONS ---
  app.get('/api/dashboard/:warehouseId', async (c) => {
    const warehouseId = c.req.param('warehouseId');
    try {
      // 1. Core Stats
      const [usuariosRes, pendientesRes, despachosRes, inventarioRes, valorSalidaRes] = await Promise.all([
        c.env.DB.prepare("SELECT COUNT(DISTINCT user) as usuarios FROM activity_logs WHERE warehouse_id = ? AND created_at > datetime('now', '-1 day')").bind(warehouseId).first(),
        c.env.DB.prepare("SELECT COUNT(*) as pendientes FROM orders WHERE warehouse_id = ? AND status = 'PENDING'").bind(warehouseId).first(),
        c.env.DB.prepare("SELECT COUNT(*) as despachos FROM orders WHERE warehouse_id = ? AND status = 'DISPATCHED' AND created_at > datetime('now', 'start of month')").bind(warehouseId).first(),
        c.env.DB.prepare("SELECT SUM(stock * price) as inventario_valor FROM inventory WHERE warehouse_id = ?").bind(warehouseId).first(),
        c.env.DB.prepare("SELECT SUM(oi.quantity * i.price) as valor_salida FROM order_items oi JOIN orders o ON o.id = oi.order_id JOIN inventory i ON i.id = oi.inventory_id WHERE o.warehouse_id = ? AND o.status = 'DISPATCHED' AND o.created_at > datetime('now', 'start of month')").bind(warehouseId).first()
      ]);
      const stats = {
        usuarios: usuariosRes?.usuarios || 0,
        pendientes: pendientesRes?.pendientes || 0,
        despachos: despachosRes?.despachos || 0,
        inventario_valor: inventarioRes?.inventario_valor || 0,
        valor_salida: valorSalidaRes?.valor_salida || 0
      };
      // 2. Movement Chart (Top 5)
      const movement = await c.env.DB.prepare(`
        SELECT i.description as name, SUM(oi.quantity) as cantidad, SUM(oi.quantity * i.price) as valor
        FROM order_items oi
        JOIN orders o ON o.id = oi.order_id
        JOIN inventory i ON i.id = oi.inventory_id
        WHERE o.warehouse_id = ?
        GROUP BY i.id
        ORDER BY cantidad DESC
        LIMIT 5
      `).bind(warehouseId).all();
      // 3. Operators Chart
      const operators = await c.env.DB.prepare(`
        SELECT created_by as name, COUNT(*) as valor
        FROM orders
        WHERE warehouse_id = ? AND status = 'DISPATCHED'
        GROUP BY created_by
        ORDER BY valor DESC
        LIMIT 5
      `).bind(warehouseId).all();
      // 4. Critical Alerts
      const alerts = await c.env.DB.prepare(`
        SELECT id, code, description as name, stock as current, min_stock as min
        FROM inventory
        WHERE warehouse_id = ? AND stock <= min_stock
        LIMIT 5
      `).bind(warehouseId).all();
      const formatter = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' });
      return c.json({
        success: true,
        data: {
          stats: {
            usuarios: stats.usuarios,
            pendientes: stats.pendientes,
            despachos: stats.despachos,
            inventario: formatter.format(stats.inventario_valor as number),
            efectividad: "94.2%", // Mocked KPI for now
            valorSalida: formatter.format(stats.valor_salida as number)
          },
          movement: movement.results,
          operators: operators.results,
          alerts: alerts.results
        }
      });
    } catch (e: any) {
      return c.json({ success: false, error: e.message }, 500);
    }
  });
  // --- REPORTS ---
  app.get('/api/reports/:warehouseId', async (c) => {
    const warehouseId = c.req.param('warehouseId');
    try {
      const categories = await c.env.DB.prepare(`
        SELECT category as name, SUM(stock * price) as value 
        FROM inventory WHERE warehouse_id = ? 
        GROUP BY category
      `).bind(warehouseId).all();
      const trends = await c.env.DB.prepare(`
        SELECT strftime('%m', created_at) as month, COUNT(*) as despachos
        FROM orders 
        WHERE warehouse_id = ? AND status = 'DISPATCHED'
        GROUP BY month
        ORDER BY month ASC
      `).bind(warehouseId).all();
      return c.json({ success: true, data: { categories: categories.results, monthlyTrends: trends.results } });
    } catch (e: any) {
      return c.json({ success: false, error: e.message }, 500);
    }
  });
  // --- USERS ---
  app.get('/api/users', async (c) => {
    const result = await safeQuery(() => c.env.DB.prepare("SELECT * FROM users ORDER BY created_at DESC").all());
    if (result.error) return c.json({ success: false, error: result.message }, 500);
    return c.json({ success: true, data: result.results });
  });
  app.post('/api/users', async (c) => {
    const body = await c.req.json();
    const { id, username, full_name, email, role, status, warehouse_ids, employee_id, phone } = body;
    const result = await safeQuery(() => 
      c.env.DB.prepare("INSERT INTO users (id, username, full_name, email, role, status, warehouse_ids, employee_id, phone) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)")
        .bind(id, username, full_name, email, role, status, warehouse_ids, employee_id, phone).run()
    );
    if (result.error) return c.json({ success: false, error: result.message }, 500);
    return c.json({ success: true });
  });
  app.put('/api/users/:id', async (c) => {
    const id = c.req.param('id');
    const body = await c.req.json();
    const sets = [];
    const values = [];
    if (body.status) { sets.push("status = ?"); values.push(body.status); }
    if (body.role) { sets.push("role = ?"); values.push(body.role); }
    if (sets.length === 0) return c.json({ success: true });
    values.push(id);
    const result = await safeQuery(() => c.env.DB.prepare(`UPDATE users SET ${sets.join(", ")} WHERE id = ?`).bind(...values).run());
    return c.json({ success: !result.error });
  });
}