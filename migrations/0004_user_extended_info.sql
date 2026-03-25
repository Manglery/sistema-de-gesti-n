-- Expansión de la tabla de usuarios con campos corporativos
ALTER TABLE users ADD COLUMN employee_id TEXT;
ALTER TABLE users ADD COLUMN phone TEXT;
-- Índice único para identificación de empleados (evita duplicidad de personal)
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_employee_id ON users(employee_id);
-- Usuario de prueba con datos extendidos
INSERT OR IGNORE INTO users (id, username, full_name, email, role, status, warehouse_ids, employee_id, phone) 
VALUES ('u4', 'jgarcia', 'Javier García', 'jgarcia@acciona.com', 'OPERARIO', 'ACTIVO', '["contadores"]', 'ACC-4592', '+34 600 000 000');