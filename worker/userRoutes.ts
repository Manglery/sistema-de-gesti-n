import { Hono } from "hono";
import type { AppEnv } from './types/app-env';
export function userRoutes(app: Hono<AppEnv>) {
  // Safe Database Wrapper
  const safeQuery = async (c: any, queryFn: () => Promise<any>) => {
    try {
      return await queryFn();
    } catch (e: any) {
      console.error("[DB ERROR]:", e.message);
      return { error: true, message: e.message };
    }
  };
  // --- WAREHOUSES ---
  app.get('/api/warehouses', async (c) => {
    const result = await safeQuery(c, () => c.env.DB.prepare("SELECT * FROM warehouses ORDER BY name ASC").all());
    if (result.error) return c.json({ success: false, error: 'Database unavailable' }, 500);
    return c.json({ success: true, data: result.results });
  });
  app.post('/api/warehouses', async (c) => {
    const body = await c.req.json();
    const { id, name, color, location, capacity, operatorsCount } = body;
    const result = await safeQuery(c, () => 
      c.env.DB.prepare("INSERT INTO warehouses (id, name, color, location, capacity, operators_count) VALUES (?, ?, ?, ?, ?, ?)")
        .bind(id, name, color, location, capacity, operatorsCount).run()
    );
    if (result.error) return c.json({ success: false, error: 'Failed to create warehouse' }, 500);
    return c.json({ success: true });
  });
  // --- USERS ---
  app.get('/api/users', async (c) => {
    const result = await safeQuery(c, () => c.env.DB.prepare("SELECT * FROM users ORDER BY created_at DESC").all());
    if (result.error) return c.json({ success: false, error: 'Failed to fetch users' }, 500);
    const data = result.results.map((u: any) => ({
      ...u,
      warehouseIds: JSON.parse(u.warehouse_ids || '[]'),
      lastAccess: u.last_access || '-'
    }));
    return c.json({ success: true, data });
  });
  app.post('/api/users', async (c) => {
    const u = await c.req.json();
    const result = await safeQuery(c, () => 
      c.env.DB.prepare("INSERT INTO users (id, username, full_name, email, role, status, warehouse_ids) VALUES (?, ?, ?, ?, ?, ?, ?)")
        .bind(u.id, u.username, u.fullName, u.email, u.role, u.status, JSON.stringify(u.warehouseIds)).run()
    );
    if (result.error) return c.json({ success: false, error: 'Failed to create user' }, 500);
    return c.json({ success: true });
  });
  app.put('/api/users/:id', async (c) => {
    const id = c.req.param('id');
    const { status } = await c.req.json();
    const result = await safeQuery(c, () => 
      c.env.DB.prepare("UPDATE users SET status = ? WHERE id = ?").bind(status, id).run()
    );
    if (result.error) return c.json({ success: false, error: 'Update failed' }, 500);
    return c.json({ success: true });
  });
  app.delete('/api/users/:id', async (c) => {
    const id = c.req.param('id');
    const result = await safeQuery(c, () => c.env.DB.prepare("DELETE FROM users WHERE id = ?").bind(id).run());
    if (result.error) return c.json({ success: false, error: 'Delete failed' }, 500);
    return c.json({ success: true });
  });
  // --- INVENTORY ---
  app.get('/api/inventory/:warehouseId', async (c) => {
    const warehouseId = c.req.param('warehouseId');
    const result = await safeQuery(c, () => c.env.DB.prepare("SELECT * FROM inventory WHERE warehouse_id = ?").bind(warehouseId).all());
    if (result.error) return c.json({ success: false, error: 'Fetch failed' }, 500);
    return c.json({ success: true, data: result.results });
  });
  app.post('/api/inventory/adjust', async (c) => {
    const { warehouseId, itemId, amount, reason, user } = await c.req.json();
    // Atomic adjustment and logging
    try {
      await c.env.DB.batch([
        c.env.DB.prepare("UPDATE inventory SET stock = stock + ? WHERE id = ? AND warehouse_id = ?").bind(amount, itemId, warehouseId),
        c.env.DB.prepare("INSERT INTO activity_logs (id, warehouse_id, type, message, user, metadata) VALUES (?, ?, ?, ?, ?, ?)")
          .bind(crypto.randomUUID(), warehouseId, 'STOCK_ADJUSTED', `Ajuste manual de stock (${amount}): ${reason}`, user, JSON.stringify({ itemId, amount }))
      ]);
      return c.json({ success: true });
    } catch (e: any) {
      return c.json({ success: false, error: e.message }, 500);
    }
  });
  // --- ORDERS ---
  app.get('/api/orders/:warehouseId', async (c) => {
    const warehouseId = c.req.param('warehouseId');
    const orders = await safeQuery(c, () => c.env.DB.prepare("SELECT * FROM orders WHERE warehouse_id = ? ORDER BY created_at DESC").bind(warehouseId).all());
    if (orders.error) return c.json({ success: false, data: [] });
    // Fetch items for each order (simplified for this phase)
    const data = await Promise.all(orders.results.map(async (o: any) => {
      const items = await safeQuery(c, () => c.env.DB.prepare("SELECT * FROM order_items WHERE order_id = ?").bind(o.id).all());
      return { ...o, items: items.results || [] };
    }));
    return c.json({ success: true, data });
  });
  app.post('/api/orders', async (c) => {
    const o = await c.req.json();
    try {
      const statements = [
        c.env.DB.prepare("INSERT INTO orders (id, order_number, warehouse_id, customer_name, status, created_by) VALUES (?, ?, ?, ?, ?, ?)")
          .bind(o.id, o.orderNumber, o.warehouseId, o.customerName, o.status, o.createdBy),
        c.env.DB.prepare("INSERT INTO activity_logs (id, warehouse_id, type, message, user) VALUES (?, ?, ?, ?, ?)")
          .bind(crypto.randomUUID(), o.warehouseId, 'ORDER_CREATED', `Nuevo pedido ${o.orderNumber} registrado para ${o.customerName}`, o.createdBy)
      ];
      o.items.forEach((item: any) => {
        statements.push(
          c.env.DB.prepare("INSERT INTO order_items (id, order_id, inventory_id, code, description, quantity, unit) VALUES (?, ?, ?, ?, ?, ?, ?)")
            .bind(crypto.randomUUID(), o.id, item.id, item.code, item.description, item.quantity, item.unit)
        );
      });
      await c.env.DB.batch(statements);
      return c.json({ success: true });
    } catch (e: any) {
      return c.json({ success: false, error: e.message }, 500);
    }
  });
  // --- DASHBOARD & REPORTS ---
  app.get('/api/dashboard/:warehouseId', async (c) => {
    const warehouseId = c.req.param('warehouseId');
    const month = c.req.query('month') || '';
    const year = c.req.query('year') || '';
    const formatter = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' });
    try {
      const usuarios = await safeQuery(c, () => c.env.DB.prepare("SELECT COUNT(DISTINCT user) as usuarios FROM activity_logs WHERE warehouse_id = ?").bind(warehouseId).first());
      const pendientes = await safeQuery(c, () => c.env.DB.prepare("SELECT COUNT(*) as count FROM orders WHERE warehouse_id = ? AND status = 'PENDING'").bind(warehouseId).first());
      const despachos = await safeQuery(c, () => c.env.DB.prepare("SELECT COUNT(*) as count FROM orders WHERE warehouse_id = ? AND status = 'DISPATCHED'").bind(warehouseId).first());
      const invValue = await safeQuery(c, () => c.env.DB.prepare("SELECT SUM(stock * price) as total FROM inventory WHERE warehouse_id = ?").bind(warehouseId).first());
      return c.json({ 
        success: true, 
        data: {
          stats: {
            usuarios: Number(usuarios?.usuarios || 0),
            pendientes: Number(pendientes?.count || 0),
            despachos: Number(despachos?.count || 0),
            inventario: formatter.format(Number(invValue?.total || 0)),
            efectividad: "94.2%",
            valorSalida: formatter.format(24500)
          },
          movement: [],
          operators: [],
          alerts: []
        }
      });
    } catch (e: any) {
      return c.json({ success: false, error: e.message });
    }
  });
  app.get('/api/reports/:warehouseId', async (c) => {
    const warehouseId = c.req.param('warehouseId');
    // Mock aggregated data for this phase
    const data = {
      monthlyTrends: [
        { month: "01", despachos: 420, compras: 300 },
        { month: "02", despachos: 380, compras: 250 },
        { month: "03", despachos: 546, compras: 400 },
      ],
      categories: [
        { name: 'Contadores', value: 450 },
        { name: 'Accesorios', value: 300 },
        { name: 'Tubería', value: 150 },
        { name: 'Herramientas', value: 80 },
      ]
    };
    return c.json({ success: true, data });
  });
  app.get('/api/activity/:warehouseId', async (c) => {
    const warehouseId = c.req.param('warehouseId');
    const result = await safeQuery(c, () => c.env.DB.prepare("SELECT * FROM activity_logs WHERE warehouse_id = ? ORDER BY created_at DESC LIMIT 20").bind(warehouseId).all());
    return c.json({ success: true, data: result.results || [] });
  });
}