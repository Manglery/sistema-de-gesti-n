import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/use-auth-store';
import { InventoryItem } from '@/lib/inventory-data';
export function useInventoryData() {
  const currentWarehouseId = useAuthStore(s => s.currentWarehouseId);
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    const fetchInventory = async () => {
      try {
        const response = await fetch(`/api/inventory/${currentWarehouseId}`);
        const result = await response.json();
        if (isMounted) {
          if (result.success) {
            setItems(result.data);
          } else {
            setError(result.error || 'Error al cargar inventario');
          }
          setIsLoading(false);
        }
      } catch (_err) {
        if (isMounted) {
          setError('Error de red');
          setIsLoading(false);
        }
      }
    };
    fetchInventory();
    return () => {
      isMounted = false;
    };
  }, [currentWarehouseId]);
  return { items, isLoading, error };
}