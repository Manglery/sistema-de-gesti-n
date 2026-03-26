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
}
export const INVENTORY_MOCK: InventoryItem[] = [
  { id: '1', code: 'ACC-001', description: 'Contador de Agua Inteligente A1', category: 'Contadores', stock: 150, minStock: 20, unit: 'UDS', location: 'A-01-04', status: 'In Stock' },
  { id: '2', code: 'ACC-002', description: 'Válvula de Retención 25mm', category: 'Accesorios', stock: 15, minStock: 25, unit: 'UDS', location: 'B-02-12', status: 'Low Stock' },
  { id: '3', code: 'ACC-003', description: 'Tubo PVC 110mm 6m', category: 'Tubería', stock: 45, minStock: 10, unit: 'METROS', location: 'PATIO-01', status: 'In Stock' },
  { id: '4', code: 'ACC-004', description: 'Precinto Seguridad Azul (100u)', category: 'Seguridad', stock: 0, minStock: 10, unit: 'PAQUETES', location: 'C-01-01', status: 'Out of Stock' },
  { id: '5', code: 'ACC-005', description: 'Junta de Goma 1/2"', category: 'Accesorios', stock: 500, minStock: 100, unit: 'UDS', location: 'B-04-05', status: 'In Stock' },
  { id: '6', code: 'ACC-006', description: 'Caja Derivación IP65', category: 'Eléctrico', stock: 8, minStock: 15, unit: 'UDS', location: 'D-02-03', status: 'Low Stock' },
  { id: '7', code: 'ACC-007', description: 'Bridas Nylon 200mm (500u)', category: 'Varios', stock: 30, minStock: 5, unit: 'BOLSAS', location: 'C-05-10', status: 'In Stock' },
];