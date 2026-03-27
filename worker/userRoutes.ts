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
  app.get('/api/warehouses', async (c) => {
    const result = await safeQuery(c, () => c.env.DB.prepare("SELECT * FROM warehouses ORDER BY name ASC").all());
    if (result.error) return c.json({ success: false, error: 'Table warehouses not initialized' });
    return c.json({ success: true, data: result.results });
  });
  app.get('/api/users', async (c) => {
    const result = await safeQuery(c, () => c.env.DB.prepare("SELECT * FROM users ORDER BY created_at DESC").all());
    if (result.error) return c.json({ success: false, error: 'Table users not initialized' });
    const data = result.results.map((u: any) => ({
      ...u,
      warehouseIds: JSON.parse(u.warehouse_ids || '[]'),
      lastAccess: u.last_access || '-'
    }));
    return c.json({ success: true, data });
  });
  app.get('/api/dashboard/:warehouseId', async (c) => {
    const warehouseId = c.req.param('warehouseId');
    const month = c.req.query('month') || '';
    const year = c.req.query('year') || '';
    try {
      // Check if tables exist by doing a simple count
      const tableCheck = await safeQuery(c, () => c.env.DB.prepare("SELECT COUNT(*) FROM inventory").first());
      if (tableCheck.error) throw new Error("Database not initialized");

      const usuarios = await safeQuery(c, () => c.env.DB.prepare("SELECT COUNT(DISTINCT user) as usuarios FROM activity_logs WHERE warehouse_id = ?").bind(warehouseId).first());
      let dateFilter = '';
      let dateParams: any[] = [warehouseId];
      if (month && year) {
        dateFilter = "AND strftime('%Y', created_at) = ? AND strftime('%m', created_at) = ?";
        dateParams = [warehouseId, String(year).padStart(4, '0'), String(month).padStart(2, '0')];
      }
      const pendientes = await safeQuery(c, () => c.env.DB.prepare(`SELECT COUNT(*) as pendientes FROM orders WHERE warehouse_id = ? AND status = 'PENDING' ${dateFilter}`).bind(...dateParams).first());
      const despachos = await safeQuery(c, () => c.env.DB.prepare(`SELECT COUNT(*) as despachos FROM orders WHERE warehouse_id = ? AND status = 'DISPATCHED' ${dateFilter}`).bind(...dateParams).first());
      const invValue = await safeQuery(c, () => c.env.DB.prepare("SELECT SUM(stock * price) as total FROM inventory WHERE warehouse_id = ?").bind(warehouseId).first());
      const outValue = await safeQuery(c, () => c.env.DB.prepare(`
        SELECT SUM(oi.quantity * i.price) as total 
        FROM order_items oi 
        JOIN orders o ON oi.order_id = o.id 
        JOIN inventory i ON oi.inventory_id = i.id 
        WHERE o.warehouse_id = ? AND o.status = 'DISPATCHED' ${dateFilter}
      `).bind(...dateParams).first());
      const totalOrders = await safeQuery(c, () => c.env.DB.prepare(`SELECT COUNT(*) as total FROM orders WHERE warehouse_id = ? ${dateFilter}`).bind(...dateParams).first());
      
      const totalOrdersData = totalOrders.error ? { total: 0 } : totalOrders;
      const despachosData = despachos.error ? { despachos: 0 } : despachos;
      const eff = Number(totalOrdersData.total || 0) > 0 ? ((Number(despachosData.despachos || 0) / Number(totalOrdersData.total)) * 100).toFixed(1) : "0";
      
      const movements = await safeQuery(c, () => c.env.DB.prepare(`
        SELECT oi.description as name, SUM(oi.quantity) as cantidad, SUM(oi.quantity * i.price) as valor
        FROM order_items oi
        JOIN orders o ON oi.order_id = o.id
        JOIN inventory i ON oi.inventory_id = i.id
        WHERE o.warehouse_id = ? ${dateFilter}
        GROUP BY oi.description
        ORDER BY cantidad DESC LIMIT 5
      `).bind(...dateParams).all());
      const operators = await safeQuery(c, () => c.env.DB.prepare(`
        SELECT o.created_by as name, SUM(oi.quantity * i.price) as valor
        FROM orders o
        JOIN order_items oi ON oi.order_id = o.id
        JOIN inventory i ON oi.inventory_id = i.id
        WHERE o.warehouse_id = ? AND o.status = 'DISPATCHED' ${dateFilter}
        GROUP BY o.created_by
        ORDER BY valor DESC LIMIT 5
      `).bind(...dateParams).all());
      const alerts = await safeQuery(c, () => c.env.DB.prepare(`
        SELECT id, code, description as name, stock as current, min_stock as min
        FROM inventory
        WHERE warehouse_id = ? AND stock <= min_stock
      `).bind(warehouseId).all());
      
      const usuariosData = usuarios.error ? { usuarios: 0 } : usuarios;
      const pendientesData = pendientes.error ? { pendientes: 0 } : pendientes;
      const despachosDataFixed = despachos.error ? { despachos: 0 } : despachos;
      const invValueData = invValue.error ? { total: 0 } : invValue;
      const outValueData = outValue.error ? { total: 0 } : outValue;
      
      const formatter = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' });
      return c.json({ 
        success: true, 
        data: {
          stats: {
            usuarios: Number(usuariosData.usuarios || 0),
            pendientes: Number(pendientesData.pendientes || 0),
            despachos: Number(despachosDataFixed.despachos || 0),
            inventario: formatter.format(Number(invValueData.total || 0)),
            efectividad: `${eff}%`,
            valorSalida: formatter.format(Number(outValueData.total || 0))
          },
          movement: (movements.error ? [] : movements.results) || [],
          operators: (operators.error ? [] : operators.results) || [],
          alerts: (alerts.error ? [] : alerts.results) || []
        }
      });
    } catch (e: any) {
      return c.json({ success: false, error: e.message, mockFallbackTrigger: true });
    }
  });
  app.get('/api/inventory/:warehouseId', async (c) => {
    const warehouseId = c.req.param('warehouseId');
    const result = await safeQuery(c, () => c.env.DB.prepare("SELECT * FROM inventory WHERE warehouse_id = ?").bind(warehouseId).all());
    if (result.error) return c.json({ success: false, error: 'Database error' });
    return c.json({ success: true, data: result.results });
  });
  app.get('/api/activity/:warehouseId', async (c) => {
    const warehouseId = c.req.param('warehouseId');
    const result = await safeQuery(c, () => c.env.DB.prepare("SELECT * FROM activity_logs WHERE warehouse_id = ? ORDER BY created_at DESC LIMIT 50").bind(warehouseId).all());
    if (result.error) return c.json({ success: false, data: [] });
    return c.json({ success: true, data: result.results.map((r: any) => ({ ...r, timestamp: r.created_at })) });
  });
}