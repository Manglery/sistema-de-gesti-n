import React, { useState, useEffect } from 'react';
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
import { UserPlus, X, IdCard, Phone } from 'lucide-react';
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
    warehouseIds: [] as string[],
    employeeId: '',
    phone: ''
  });
  useEffect(() => {
    if (!open) {
      setFormData({
        username: '',
        password: '',
        fullName: '',
        email: '',
        role: '',
        status: true,
        warehouseIds: [],
        employeeId: '',
        phone: ''
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
    if (!formData.username || !formData.password || !formData.fullName || !formData.role || !formData.employeeId || formData.warehouseIds.length === 0) {
      toast.error("Por favor complete todos los campos obligatorios (Usuario, Contraseña, Nombre, Perfil, ID Empleado y Almacén).");
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
      warehouseIds: formData.warehouseIds,
      employeeId: formData.employeeId,
      phone: formData.phone
    });
    toast.success("Usuario creado con éxito");
    onOpenChange(false);
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden border-none shadow-2xl">
        <DialogHeader className="p-6 border-b flex flex-row items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-lg bg-red-50 flex items-center justify-center text-red-600">
              <UserPlus className="size-5" />
            </div>
            <DialogTitle className="text-lg font-black uppercase text-slate-900 tracking-tight">Nuevo Registro de Usuario</DialogTitle>
          </div>
          <DialogClose asChild>
            <Button variant="ghost" size="icon" className="size-8 text-slate-400 hover:text-slate-900">
              <X className="size-5" />
            </Button>
          </DialogClose>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="p-6 space-y-5 bg-white">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">
                ID de Empleado <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <IdCard className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <Input 
                  placeholder="ACC-0000" 
                  className="h-10 border-slate-200 pl-10"
                  value={formData.employeeId}
                  onChange={(e) => setFormData(prev => ({...prev, employeeId: e.target.value}))}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">
                Teléfono Corporativo
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <Input 
                  placeholder="+34 000 000 000" 
                  className="h-10 border-slate-200 pl-10"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({...prev, phone: e.target.value}))}
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">
                Usuario <span className="text-red-500">*</span>
              </Label>
              <Input 
                placeholder="nombre.apellido" 
                className="h-10 border-slate-200"
                value={formData.username}
                onChange={(e) => setFormData(prev => ({...prev, username: e.target.value}))}
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
                onChange={(e) => setFormData(prev => ({...prev, password: e.target.value}))}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">
              Nombre Completo <span className="text-red-500">*</span>
            </Label>
            <Input 
              placeholder="Juan Pérez García" 
              className="h-10 border-slate-200"
              value={formData.fullName}
              onChange={(e) => setFormData(prev => ({...prev, fullName: e.target.value}))}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">
              Email Corporativo
            </Label>
            <Input 
              type="email"
              placeholder="usuario@acciona.com" 
              className="h-10 border-slate-200"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))}
            />
          </div>
          <div className="space-y-2.5">
            <Label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">
              Asignación de Almacenes <span className="text-red-500">*</span>
            </Label>
            <div className="grid grid-cols-2 gap-3 pt-1">
              {(warehouses || []).map((warehouse) => (
                <div key={warehouse.id} className="flex items-center space-x-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <Checkbox 
                    id={`wh-${warehouse.id}`} 
                    checked={formData.warehouseIds.includes(warehouse.id)}
                    onCheckedChange={() => handleWarehouseToggle(warehouse.id)}
                  />
                  <label 
                    htmlFor={`wh-${warehouse.id}`}
                    className="text-[10px] font-bold text-slate-700 uppercase cursor-pointer truncate"
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
                onValueChange={(val) => setFormData(prev => ({...prev, role: val as UserRole}))}
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
                Estado de Cuenta
              </Label>
              <div className="flex items-center gap-2 h-10 px-3 bg-slate-50 rounded-lg border border-slate-100">
                <Switch 
                  checked={formData.status} 
                  onCheckedChange={(val) => setFormData(prev => ({...prev, status: val}))}
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
            onClick={() => onOpenChange(false)}
            className="flex-1 h-11 text-xs font-black uppercase tracking-widest border-slate-200"
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit}
            className="flex-1 h-11 bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-widest shadow-xl shadow-red-100"
          >
            Guardar Usuario
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}