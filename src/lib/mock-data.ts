export interface DashboardData {
  stats: {
    usuarios: number;
    pendientes: number;
    despachos: number;
    inventario: string;
    efectividad: string;
    valorSalida: string;
  };
  movement: Array<{ name: string; cantidad: number; valor: number }>;
  operators: Array<{ name: string; valor: number }>;
  alerts: Array<{ id: number; code: string; name: string; current: number; min: number }>;
}
export const WAREHOUSE_DATA: Record<string, DashboardData> = {
  contadores: {
    stats: {
      usuarios: 115,
      pendientes: 3,
      despachos: 546,
      inventario: "€1.397.383.617,35",
      efectividad: "93.3%",
      valorSalida: "€93.608,47"
    },
    movement: [
      { name: '45. PRECINTO AZUL', cantidad: 8500, valor: 4600 },
      { name: '15b. JUNTA DE RACO', cantidad: 4000, valor: 500 },
      { name: '29. RACOR LLOBREG', cantidad: 2200, valor: 5000 },
      { name: '69. BRIDAS (100U)', cantidad: 2000, valor: 8000 },
      { name: '70c. CLAC VODAFONE', cantidad: 1900, valor: 100 },
    ],
    operators: [
      { name: 'Mohammed Jadracui', valor: 13500 },
      { name: 'Antonio García', valor: 6500 },
      { name: 'Ruben Rey Viana', valor: 6300 },
    ],
    alerts: [
      { id: 1, code: "85308", name: "LLAVE COMBINADA 24-24", current: 0, min: 5 },
      { id: 2, code: "85306", name: "LLAVE COMBINADA 19-19", current: 2, min: 5 },
    ]
  },
  averias: {
    stats: {
      usuarios: 42,
      pendientes: 12,
      despachos: 124,
      inventario: "€450.230.100,00",
      efectividad: "85.1%",
      valorSalida: "€25.400,00"
    },
    movement: [
      { name: 'TUBO CORRUGADO', cantidad: 1200, valor: 3100 },
      { name: 'CABLE COBRE 2.5', cantidad: 900, valor: 2200 },
      { name: 'PIEZA RECAMBIO X', cantidad: 450, valor: 5600 },
    ],
    operators: [
      { name: 'Joseba Gonzalez', valor: 8200 },
      { name: 'Michele Laiso', valor: 4100 },
    ],
    alerts: [
      { id: 1, code: "AV-001", name: "VALVULA PRESION T3", current: 1, min: 10 },
    ]
  },
  acometidas: {
    stats: {
      usuarios: 78,
      pendientes: 1,
      despachos: 890,
      inventario: "€2.100.450.000,00",
      efectividad: "98.9%",
      valorSalida: "€150.000,00"
    },
    movement: [
      { name: 'MODULO RED A1', cantidad: 15000, valor: 25000 },
      { name: 'FIBRA OPTICA 50M', cantidad: 3000, valor: 12000 },
    ],
    operators: [
      { name: 'Alfredo Merino', valor: 15600 },
      { name: 'Daniel Juanito', valor: 12400 },
    ],
    alerts: [
      { id: 1, code: "AC-55", name: "CONECTOR RAPIDO RJ45", current: 50, min: 500 },
    ]
  }
};