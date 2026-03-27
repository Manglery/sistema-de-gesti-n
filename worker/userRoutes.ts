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
  // --- USERS CRUD ---
  app.get('/api/users', async (c) => {
    const result = await safeQuery(() => c.env.DB.prepare("SELECT * FROM users ORDER BY created_at DESC").all());
    if (result.error) return c.json({ success: false, error: result.message }, 500);
    const data = (result.results || []).map((u: any) => ({
      id: u.id,
      username: u.username,
      fullName: u.full_name,
      email: u.email,
      role: u.role,
      status: u.status,
      lastAccess: u.last_access || '-',
      warehouseIds: JSON.parse(u.warehouse_ids || '[]')
    }));
    return c.json({ success: true, data });
  });
  app.post('/api/users', async (c) => {
    const body = await c.req.json();
    const { id, username, fullName, email, role, status, warehouseIds } = body;
    const result = await safeQuery(() => 
      c.env.DB.prepare("INSERT INTO users (id, username, full_name, email, role, status, warehouse_ids) VALUES (?, ?, ?, ?, ?, ?, ?)")
        .bind(id, username, fullName, email, role, status, JSON.stringify(warehouseIds)).run()
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
    if (body.fullName) { sets.push("full_name = ?"); values.push(body.fullName); }
    if (body.warehouseIds) { sets.push("warehouse_ids = ?"); values.push(JSON.stringify(body.warehouseIds)); }
    if (sets.length === 0) return c.json({ success: true });
    values.push(id);
    const query = `UPDATE users SET ${sets.join(", ")} WHERE id = ?`;
    const result = await safeQuery(() => c.env.DB.prepare(query).bind(...values).run());
    return c.json({ success: !result.error });
  });
  app.delete('/api/users/:id', async (c) => {
    const id = c.req.param('id');
    const result = await safeQuery(() => c.env.DB.prepare("DELETE FROM users WHERE id = ?").bind(id).run());
    return c.json({ success: !result.error });
  });
  // --- ORDERS (TRANSACTIONAL) ---
  app.post('/api/orders', async (c) => {
    const body = await c.req.json();
    const { id, orderNumber, warehouseId, customerName, items, createdBy } = body;
    try {
      const statements = [
        c.env.DB.prepare("INSERT INTO orders (id, order_number, warehouse_id, customer_name, status, created_by) VALUES (?, ?, ?, ?, 'PENDING', ?)")
          .bind(id, orderNumber, warehouseId, customerName, createdBy)
      ];
      for (const item of items) {
        statements.push(
          c.env.DB.prepare("INSERT INTO order_items (id, order_id, inventory_id, code, description, quantity, unit) VALUES (?, ?, ?, ?, ?, ?, ?)")
            .bind(crypto.randomUUID(), id, item.id, item.code, item.description, item.quantity, item.unit)
        );
      }
      await c.env.DB.batch(statements);
      return c.json({ success: true, data: body });
    } catch (e: any) {
      return c.json({ success: false, error: e.message }, 500);
    }
  });
  // --- INVENTORY ADJUSTMENTS ---
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
  // --- REPORTS ---
  app.get('/api/reports/:warehouseId', async (c) => {
    const warehouseId = c.req.param('warehouseId');
    try {
      // Trends: Last 6 months of dispatches vs arrivals
      const trends = await c.env.DB.prepare(`
        SELECT strftime('%m', created_at) as month, 
               COUNT(*) as despachos,
               0 as compras
        FROM orders 
        WHERE warehouse_id = ? AND status = 'DISPATCHED'
        GROUP BY month ORDER BY month DESC LIMIT 6
      `).bind(warehouseId).all();
      const categories = await c.env.DB.prepare(`
        SELECT category as name, SUM(stock * price) as value 
        FROM inventory WHERE warehouse_id = ? 
        GROUP BY category
      `).bind(warehouseId).all();
      return c.json({ 
        success: true, 
        data: {
          monthlyTrends: trends.results || [],
          categories: categories.results || []
        }
      });
    } catch (e: any) {
      return c.json({ success: false, error: e.message }, 500);
    }
  });
}