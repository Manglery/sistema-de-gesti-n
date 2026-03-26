import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserPlus, X } from 'lucide-react';
import { useAuthStore } from '@/store/use-auth-store';
import { useUserStore, UserRole } from '@/store/use-user-store';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
interface UserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
export function UserDialog({ open, onOpenChange }: UserDialogProps) {
  const warehouses = useAuthStore(s => s.warehouses);
  const addUser = useUserStore(s => s.addUser);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    fullName: '',
    email: '',
    role: '' as UserRole | '',
    status: true,
    warehouseIds: [] as string[]
  });

  React.useEffect(() => {
    if (!open) {
      setFormData({
        username: '',
        password: '',
        fullName: '',
        email: '',
        role: '',
        status: true,
        warehouseIds: []
      });
    }
  }, [open]);
  const handleWarehouseToggle = (id: string) => {
    setFormData(prev => ({
      ...prev,
      warehouseIds: prev.warehouseIds.includes(id) 
        ? prev.warehouseIds.filter(wid => wid !== id)
        : [...prev.warehouseIds, id]
    }));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation
    if (!formData.username || !formData.password || !formData.fullName || !formData.role || formData.warehouseIds.length === 0) {
      toast.error("Por favor complete todos los campos obligatorios y seleccione al menos un almacén.");
      return;
    }
    addUser({
      id: uuidv4(),
      username: formData.username,
      fullName: formData.fullName,
      email: formData.email,
      role: formData.role as UserRole,
      status: formData.status ? 'ACTIVO' : 'INACTIVO',
      lastAccess: '-',
      warehouseIds: formData.warehouseIds
    });
    toast.success("Usuario creado con éxito");
    onOpenChange(false);
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden border-none shadow-2xl">
        <DialogHeader className="p-6 border-b flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-lg bg-red-50 flex items-center justify-center text-red-600">
              <UserPlus className="size-5" />
            </div>
            <DialogTitle className="text-lg font-black uppercase text-slate-900 tracking-tight">Nuevo Usuario</DialogTitle>
          </div>
          <DialogClose asChild>
            <Button variant="ghost" size="icon" className="size-8 text-slate-400 hover:text-slate-900">
              <X className="size-5" />
            </Button>
          </DialogClose>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-1.5">
            <Label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">
              Usuario <span className="text-red-500">*</span>
            </Label>
            <Input 
              placeholder="nombre.usuario" 
              className="h-10 border-slate-200"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">
              Contraseña <span className="text-red-500">*</span>
            </Label>
            <Input 
              type="password"
              placeholder="********" 
              className="h-10 border-slate-200"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">
              Nombre Completo <span className="text-red-500">*</span>
            </Label>
            <Input 
              placeholder="Nombre Apellido Apellido" 
              className="h-10 border-slate-200"
              value={formData.fullName}
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">
              Email
            </Label>
            <Input 
              type="email"
              placeholder="usuario@acciona.com" 
              className="h-10 border-slate-200"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div className="space-y-2.5">
            <Label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">
              Acceso a Almacenes <span className="text-red-500">*</span>
            </Label>
            <div className="flex flex-wrap gap-4 pt-1">
              {warehouses.map((warehouse) => (
                <div key={warehouse.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`wh-${warehouse.id}`} 
                    checked={formData.warehouseIds.includes(warehouse.id)}
                    onCheckedChange={() => handleWarehouseToggle(warehouse.id)}
                  />
                  <label 
                    htmlFor={`wh-${warehouse.id}`}
                    className="text-xs font-bold text-slate-700 uppercase cursor-pointer"
                  >
                    {warehouse.name.replace('Almacén de ', '')}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">
                Perfil <span className="text-red-500">*</span>
              </Label>
              <Select 
                value={formData.role} 
                onValueChange={(val) => setFormData({...formData, role: val as UserRole})}
              >
                <SelectTrigger className="h-10 border-slate-200 font-bold text-xs uppercase">
                  <SelectValue placeholder="Seleccionar..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN" className="text-xs font-bold uppercase">Administrador</SelectItem>
                  <SelectItem value="ALMACENERO" className="text-xs font-bold uppercase">Almacenero</SelectItem>
                  <SelectItem value="OPERARIO" className="text-xs font-bold uppercase">Operario</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">
                Estado
              </Label>
              <div className="flex items-center gap-2 h-10">
                <Switch 
                  checked={formData.status} 
                  onCheckedChange={(val) => setFormData({...formData, status: val})}
                />
                <span className={cn(
                  "text-[10px] font-black uppercase tracking-widest",
                  formData.status ? "text-emerald-500" : "text-slate-400"
                )}>
                  {formData.status ? 'Activo' : 'Inactivo'}
                </span>
              </div>
            </div>
          </div>
        </form>
        <DialogFooter className="p-6 bg-slate-50/50 border-t flex flex-row gap-3">
          <Button 
            variant="outline" 
            onClick={() => {
              setFormData({
                username: '',
                password: '',
                fullName: '',
                email: '',
                role: '',
                status: true,
                warehouseIds: []
              });
              onOpenChange(false);
            }}
            className="flex-1 h-11 text-xs font-black uppercase tracking-widest border-slate-200"
          >
            Cancelar
          </Button>
          <Button 
            type="submit"
            className="flex-1 h-11 bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-widest shadow-xl shadow-red-100"
          >
            Crear Usuario
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}