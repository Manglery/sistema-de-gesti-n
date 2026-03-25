-- Refine Users table constraints
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON users(email) WHERE email IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
-- Add length checks or constraints if needed (D1 supports basic CHECK)
-- SQLite CHECK constraints are supported
ALTER TABLE users ADD COLUMN bio TEXT; -- Placeholder for future refinements
-- Improve Inventory performance
CREATE INDEX IF NOT EXISTS idx_inventory_warehouse_code ON inventory(warehouse_id, code);
CREATE INDEX IF NOT EXISTS idx_inventory_category ON inventory(category);
CREATE INDEX IF NOT EXISTS idx_inventory_status ON inventory(status);
-- Improve Orders lookups
CREATE INDEX IF NOT EXISTS idx_orders_warehouse_status ON orders(warehouse_id, status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
-- Improve Activity Logs performance for Dashboard feed
CREATE INDEX IF NOT EXISTS idx_activity_logs_warehouse_date ON activity_logs(warehouse_id, created_at DESC);