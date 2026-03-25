export type OrderStatus = 'PENDING' | 'DISPATCHED' | 'CANCELLED';
export interface OrderItem {
  id: string;
  code: string;
  description: string;
  quantity: number;
  unit: string;
}
export interface Order {
  id: string;
  orderNumber: string;
  warehouseId: string;
  customerName: string;
  items: OrderItem[];
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}
export const MOCK_ORDERS: Order[] = [
  {
    id: 'ord-1',
    orderNumber: 'PED-2024-001',
    warehouseId: 'contadores',
    customerName: 'Obra Calle Mayor',
    status: 'PENDING',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'Mangler Yerren',
    items: [
      { id: '1', code: 'ACC-001', description: 'Contador de Agua Inteligente A1', quantity: 10, unit: 'UDS' },
      { id: '2', code: 'ACC-002', description: 'Válvula de Retención 25mm', quantity: 5, unit: 'UDS' }
    ]
  },
  {
    id: 'ord-2',
    orderNumber: 'PED-2024-002',
    warehouseId: 'contadores',
    customerName: 'Mantenimiento Sector Norte',
    status: 'PENDING',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'Mangler Yerren',
    items: [
      { id: '3', code: 'ACC-003', description: 'Tubo PVC 110mm 6m', quantity: 12, unit: 'METROS' }
    ]
  }
];