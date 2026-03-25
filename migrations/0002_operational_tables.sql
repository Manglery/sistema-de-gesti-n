-- Returns table
CREATE TABLE IF NOT EXISTS returns (
    id TEXT PRIMARY KEY,
    warehouse_id TEXT NOT NULL,
    order_number TEXT NOT NULL,
    material_name TEXT NOT NULL,
    reason TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'PENDING', -- 'PENDING', 'INSPECTED', 'RESTOCKED'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (warehouse_id) REFERENCES warehouses(id)
);
-- Purchases table
CREATE TABLE IF NOT EXISTS purchases (
    id TEXT PRIMARY KEY,
    warehouse_id TEXT NOT NULL,
    vendor_name TEXT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'ARRIVING', -- 'ARRIVING', 'COMPLETED'
    delivery_date TEXT NOT NULL,
    items_count INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (warehouse_id) REFERENCES warehouses(id)
);
-- Seed data for Returns
INSERT OR IGNORE INTO returns (id, warehouse_id, order_number, material_name, reason, status) VALUES 
('R1', 'contadores', 'PED-2024-001', 'Contador Agua B2', 'Defecto de fábrica', 'PENDING'),
('R2', 'contadores', 'PED-2024-045', 'Válvula Esfera 3/4', 'Sobrante de obra', 'INSPECTED');
-- Seed data for Purchases
INSERT OR IGNORE INTO purchases (id, warehouse_id, vendor_name, total_amount, status, delivery_date, items_count) VALUES 
('PO-1', 'contadores', 'Ibercont S.L.', 12450.00, 'ARRIVING', '2025-03-28', 45),
('PO-2', 'contadores', 'Valvulería Sur', 3120.00, 'COMPLETED', '2025-03-20', 120),
('PO-3', 'contadores', 'Logística Total', 5600.00, 'ARRIVING', '2025-03-29', 12);