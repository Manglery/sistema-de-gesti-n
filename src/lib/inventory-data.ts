export interface InventoryItem {
  id: string;
  code: string;
  description: string;
  category: string;
  stock: number;
  minStock: number;
  unit: string;
  location: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  price: number;
}
export const INVENTORY_BY_WAREHOUSE: Record<string, InventoryItem[]> = {
  contadores: [
    { id: '1', code: 'ACC-001', description: 'Contador de Agua Inteligente A1', category: 'Contadores', stock: 150, minStock: 20, unit: 'UDS', location: 'A-01-04', status: 'In Stock', price: 125.50 },
    { id: '2', code: 'ACC-002', description: 'Válvula de Retención 25mm', category: 'Accesorios', stock: 15, minStock: 25, unit: 'UDS', location: 'B-02-12', status: 'Low Stock', price: 45.00 },
    { id: '3', code: 'ACC-003', description: 'Tubo PVC 110mm 6m', category: 'Tubería', stock: 45, minStock: 10, unit: 'METROS', location: 'PATIO-01', status: 'In Stock', price: 85.20 },
    { id: '4', code: 'ACC-004', description: 'Precinto Seguridad Azul (100u)', category: 'Seguridad', stock: 0, minStock: 10, unit: 'PAQUETES', location: 'C-01-01', status: 'Out of Stock', price: 12.00 },
  ],
  averias: [
    { id: 'av-1', code: 'DEF-901', description: 'Bomba Presión Averiada', category: 'Maquinaria', stock: 5, minStock: 2, unit: 'UDS', location: 'Z-01', status: 'In Stock', price: 2100.00 },
    { id: 'av-2', code: 'DEF-902', description: 'Válvula Mariposa Obstruida', category: 'Válvulas', stock: 1, minStock: 5, unit: 'UDS', location: 'Z-02', status: 'Low Stock', price: 560.00 },
  ],
  acometidas: [
    { id: 'ac-1', code: 'FIB-500', description: 'Bobina Fibra Óptica 500m', category: 'Redes', stock: 12, minStock: 3, unit: 'BOBINAS', location: 'R-05', status: 'In Stock', price: 1200.00 },
    { id: 'ac-2', code: 'CON-RJ', description: 'Conector Estanco RJ45 IP67', category: 'Conectores', stock: 300, minStock: 50, unit: 'UDS', location: 'S-12', status: 'In Stock', price: 15.00 },
    { id: 'ac-3', code: 'ARM-600', description: 'Armario Exterior 600x400', category: 'Armarios', stock: 0, minStock: 2, unit: 'UDS', location: 'P-01', status: 'Out of Stock', price: 850.00 },
  ]
};