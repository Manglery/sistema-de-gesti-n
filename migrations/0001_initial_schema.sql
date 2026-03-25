-- Warehouses table
CREATE TABLE IF NOT EXISTS warehouses (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    color TEXT NOT NULL,
    location TEXT,
    capacity TEXT DEFAULT '0%',
    operators_count INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
-- Users table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT,
    full_name TEXT NOT NULL,
    email TEXT,
    role TEXT NOT NULL, -- 'ADMIN', 'SUPERADMIN', 'ALMACENERO', 'OPERARIO'
    status TEXT NOT NULL DEFAULT 'ACTIVO', -- 'ACTIVO', 'INACTIVO'
    last_access DATETIME,
    warehouse_ids TEXT, -- JSON array of strings
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
-- Inventory table
CREATE TABLE IF NOT EXISTS inventory (
    id TEXT PRIMARY KEY,
    warehouse_id TEXT NOT NULL,
    code TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    stock INTEGER DEFAULT 0,
    min_stock INTEGER DEFAULT 0,
    price DECIMAL(10, 2) DEFAULT 0.00,
    unit TEXT NOT NULL,
    location TEXT,
    status TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (warehouse_id) REFERENCES warehouses(id)
);
-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    order_number TEXT UNIQUE NOT NULL,
    warehouse_id TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'PENDING',
    created_by TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (warehouse_id) REFERENCES warehouses(id)
);
-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
    id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL,
    inventory_id TEXT NOT NULL,
    code TEXT NOT NULL,
    description TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    unit TEXT NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (inventory_id) REFERENCES inventory(id)
);
-- Activity logs table
CREATE TABLE IF NOT EXISTS activity_logs (
    id TEXT PRIMARY KEY,
    warehouse_id TEXT NOT NULL,
    type TEXT NOT NULL,
    message TEXT NOT NULL,
    user TEXT NOT NULL,
    metadata TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (warehouse_id) REFERENCES warehouses(id)
);
-- Seed Data
INSERT OR IGNORE INTO warehouses (id, name, color, location, capacity, operators_count) VALUES 
('contadores', 'Almacén de Contadores', 'bg-red-600', 'Zona Norte, Nave A', '85%', 12),
('averias', 'Almacén de Averías', 'bg-orange-600', 'Zona Sur, Nave C', '42%', 5),
('acometidas', 'Almacén de Acometidas', 'bg-blue-600', 'Zona Este, Nave B', '68%', 8);
INSERT OR IGNORE INTO users (id, username, full_name, email, role, status, warehouse_ids) VALUES 
('u1', 'admin', 'Administrador del Sistema', 'admin@acciona.com', 'ADMIN', 'ACTIVO', '["contadores", "averias", "acometidas"]'),
('u2', 'myerren', 'Mangler Yerren', 'myerren@gmail.com', 'SUPERADMIN', 'ACTIVO', '["contadores", "averias", "acometidas"]'),
('u3', 'almacenero', 'Juan Pérez', 'jperez@acciona.com', 'ALMACENERO', 'ACTIVO', '["contadores"]');
INSERT OR IGNORE INTO inventory (id, warehouse_id, code, description, category, stock, min_stock, price, unit, location, status) VALUES 
('1', 'contadores', 'ACC-001', 'Contador de Agua Inteligente A1', 'Contadores', 150, 20, 125.50, 'UDS', 'A-01-04', 'In Stock'),
('2', 'contadores', 'ACC-002', 'Válvula de Retención 25mm', 'Accesorios', 15, 25, 45.00, 'UDS', 'B-02-12', 'Low Stock'),
('3', 'contadores', 'ACC-003', 'Tubo PVC 110mm 6m', 'Tubería', 45, 10, 85.20, 'METROS', 'PATIO-01', 'In Stock'),
('4', 'contadores', 'ACC-004', 'Precinto Seguridad Azul (100u)', 'Seguridad', 0, 10, 12.00, 'PAQUETES', 'C-01-01', 'Out of Stock');