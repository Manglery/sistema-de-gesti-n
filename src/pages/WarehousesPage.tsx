import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  Plus, 
  MapPin, 
  Users, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { useAuthStore } from '@/store/use-auth-store';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
export function WarehousesPage() {
  const warehouses = useAuthStore(s => s.warehouses);
  const currentWarehouseId = useAuthStore(s => s.currentWarehouseId);
  const addWarehouse = useAuthStore(s => s.addWarehouse);
  const setWarehouseId = useAuthStore(s => s.setWarehouseId);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const handleCreate = () => {
    if (!newName) return;
    const id = newName.toLowerCase().replace(/\s+/g, '-');
    addWarehouse({
      id,
      name: newName,
      location: newLocation || 'Ubicación pendiente',
      color: 'bg-zinc-600',
      capacity: '0%',
      operatorsCount: 0
    });
    setNewName('');
    setNewLocation('');
    setIsDialogOpen(false);
    toast.success(`Almacén "${newName}" creado correctamente`);
  };
  return (
    <AppLayout className="bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-xl shadow-slate-200">
                <Building2 className="size-7" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight leading-none">Almacenes</h1>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">GESTIÓN DE CENTROS LOGÍSTICOS Y TABLAS MAESTRAS</p>
              </div>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-red-600 hover:bg-red-700 text-xs font-bold uppercase tracking-tight">
                  <Plus className="mr-2 size-4" /> Nuevo Almacén
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle className="text-lg font-black uppercase">Crear Centro Logístico</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-xs font-bold uppercase">Nombre del Almacén</Label>
                    <Input id="name" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Ej. Almacén Central" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-xs font-bold uppercase">Ubicación / Nave</Label>
                    <Input id="location" value={newLocation} onChange={(e) => setNewLocation(e.target.value)} placeholder="Ej. Zona Industrial Sur" />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="text-xs font-bold uppercase">Cancelar</Button>
                  <Button onClick={handleCreate} className="bg-red-600 hover:bg-red-700 text-xs font-bold uppercase">Crear Almacén</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {warehouses?.map((warehouse) => {
              const isActive = currentWarehouseId === warehouse.id;
              return (
                <Card 
                  key={warehouse.id} 
                  className={cn(
                    "relative overflow-hidden transition-all duration-300 hover:shadow-md cursor-pointer group border-slate-200",
                    isActive ? "ring-2 ring-red-600 shadow-lg" : "hover:border-slate-300"
                  )}
                  onClick={() => setWarehouseId(warehouse.id)}
                >
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                      <div className={cn("size-10 rounded-lg flex items-center justify-center text-white mb-2", warehouse.color)}>
                        <Building2 className="size-5" />
                      </div>
                      {isActive && (
                        <Badge className="bg-red-600 text-white font-black text-[9px] uppercase px-2 py-0.5 border-none">
                          Activo
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-base font-black uppercase text-slate-900 leading-tight">
                      {warehouse.name}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-slate-400">
                      <MapPin className="size-3" /> {warehouse.location}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Capacidad</span>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-black text-slate-900">{warehouse.capacity}</span>
                          <div className="h-1.5 w-12 bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full bg-slate-900" style={{ width: warehouse.capacity }} />
                          </div>
                        </div>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Personal</span>
                        <div className="flex items-center gap-2">
                          <Users className="size-3.5 text-slate-400" />
                          <span className="text-sm font-black text-slate-900">{warehouse.operatorsCount}</span>
                        </div>
                      </div>
                    </div>
                    <div className="pt-2">
                      <Button 
                        variant={isActive ? "secondary" : "ghost"} 
                        className={cn(
                          "w-full h-10 text-[10px] font-black uppercase transition-all flex items-center justify-between px-4",
                          isActive ? "bg-red-50 text-red-600 hover:bg-red-100" : "text-slate-400 group-hover:text-slate-900"
                        )}
                      >
                        {isActive ? (
                          <>
                            <span className="flex items-center gap-2">
                              <CheckCircle2 className="size-4" /> Almacén en uso
                            </span>
                          </>
                        ) : (
                          <>
                            Seleccionar Almacén
                            <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}