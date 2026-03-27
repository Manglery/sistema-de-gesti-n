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
      full_name: u.full_name,
      email: u.email,
      role: u.role,
      status: u.status,
      last_access: u.last_access || '-',
      warehouse_ids: u.warehouse_ids || '[]',
      employee_id: u.employee_id || '-',
      phone: u.phone || '-'
    }));
    return c.json({ success: true, data });
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
    if (body.full_name) { sets.push("full_name = ?"); values.push(body.full_name); }
    if (body.warehouse_ids) { sets.push("warehouse_ids = ?"); values.push(body.warehouse_ids); }
    if (body.employee_id) { sets.push("employee_id = ?"); values.push(body.employee_id); }
    if (body.phone) { sets.push("phone = ?"); values.push(body.phone); }
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
  // --- ORDERS ---
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
  // --- INVENTORY ---
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
  // --- DASHBOARD / REPORTS ---
  app.get('/api/dashboard/:warehouseId', async (c) => {
    const warehouseId = c.req.param('warehouseId');
    // Simplified metrics for initial phase
    return c.json({ success: true, data: null }); 
  });
  app.get('/api/reports/:warehouseId', async (c) => {
    const warehouseId = c.req.param('warehouseId');
    try {
      const categories = await c.env.DB.prepare(`
        SELECT category as name, SUM(stock * price) as value 
        FROM inventory WHERE warehouse_id = ? 
        GROUP BY category
      `).bind(warehouseId).all();
      return c.json({ success: true, data: { categories: categories.results || [] } });
    } catch (e: any) {
      return c.json({ success: false, error: e.message }, 500);
    }
  });
}