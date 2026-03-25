import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Search, 
  UserPlus, 
  Edit2, 
  UserX, 
  UserCheck,
  User as UserIcon,
  Fingerprint
} from 'lucide-react';
import { useUserStore, UserRole, UserStatus } from '@/store/use-user-store';
import { UserDialog } from '@/components/users/user-dialog';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
export function UsersPage() {
  const users = useUserStore(s => s.users);
  const toggleUserStatus = useUserStore(s => s.toggleUserStatus);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('todos');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const filteredUsers = (users ?? []).filter(user => {
    const safeUsername = (user.username || '').toLowerCase();
    const safeFullName = (user.fullName || '').toLowerCase();
    const safeEmail = (user.email || '').toLowerCase();
    const safeEmployeeId = (user.employeeId || '').toLowerCase();
    
    const matchesSearch = 
      safeUsername.includes(searchTerm.toLowerCase()) ||
      safeFullName.includes(searchTerm.toLowerCase()) ||
      safeEmail.includes(searchTerm.toLowerCase()) ||
      safeEmployeeId.includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'todos' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'todos' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });
  const handleToggleStatus = (id: string, currentStatus: UserStatus) => {
    toggleUserStatus(id);
    toast.info(`Usuario ${currentStatus === 'ACTIVO' ? 'desactivado' : 'activado'} correctamente`);
  };
  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'ADMIN':
        return <Badge className="bg-purple-100 text-purple-600 border-none font-black text-[9px] uppercase px-2 shadow-none">Admin</Badge>;
      case 'SUPERADMIN':
        return <Badge className="bg-slate-900 text-white border-none font-black text-[9px] uppercase px-2 shadow-none">Superadmin</Badge>;
      case 'ALMACENERO':
        return <Badge className="bg-emerald-100 text-emerald-600 border-none font-black text-[9px] uppercase px-2 shadow-none">Almacenero</Badge>;
      case 'OPERARIO':
        return <Badge className="bg-blue-100 text-blue-600 border-none font-black text-[9px] uppercase px-2 shadow-none">Operario</Badge>;
      default:
        return <Badge className="bg-slate-100 text-slate-500 border-none font-black text-[9px] uppercase px-2 shadow-none">{role}</Badge>;
    }
  };
  const getStatusBadge = (status: UserStatus) => {
    return status === 'ACTIVO' ? (
      <Badge className="bg-emerald-50 text-emerald-500 border-none font-black text-[9px] uppercase px-2 shadow-none">Activo</Badge>
    ) : (
      <Badge className="bg-slate-100 text-slate-400 border-none font-black text-[9px] uppercase px-2 shadow-none">Inactivo</Badge>
    );
  };
  return (
    <AppLayout className="bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-xl shadow-red-200">
                <UserIcon className="size-7" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight leading-none">Gestión de Usuarios</h1>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">SISTEMA ACCIONA WMS CORPORATIVO</p>
              </div>
            </div>
            <Button 
              onClick={() => setIsDialogOpen(true)}
              className="bg-slate-900 hover:bg-slate-800 h-11 text-xs font-black uppercase tracking-tight px-6 shadow-xl"
            >
              <UserPlus className="mr-2 size-4" /> Registrar Nuevo Colaborador
            </Button>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-end md:items-center">
            <div className="flex-1 w-full space-y-2">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Filtro de Búsqueda</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <Input 
                  placeholder="Buscar por ID, nombre, usuario o email..." 
                  className="pl-10 h-11 text-sm border-slate-200 focus:ring-red-500 bg-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="w-full md:w-48 space-y-2">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Rol / Perfil</label>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="h-11 text-sm font-bold border-slate-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los Roles</SelectItem>
                  <SelectItem value="ADMIN">Administrador</SelectItem>
                  <SelectItem value="SUPERADMIN">Superadmin</SelectItem>
                  <SelectItem value="ALMACENERO">Almacenero</SelectItem>
                  <SelectItem value="OPERARIO">Operario</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-48 space-y-2">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Estado</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-11 text-sm font-bold border-slate-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los Estados</SelectItem>
                  <SelectItem value="ACTIVO">Activos</SelectItem>
                  <SelectItem value="INACTIVO">Inactivos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow className="border-slate-100">
                    <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest py-5 pl-6">ID Empleado</TableHead>
                    <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest py-5">Colaborador</TableHead>
                    <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest py-5">Perfil WMS</TableHead>
                    <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest py-5 text-center">Estado</TableHead>
                    <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest py-5">Contacto</TableHead>
                    <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest py-5 text-right pr-6">Gestión</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id} className="hover:bg-slate-50/50 transition-colors border-slate-100">
                        <TableCell className="py-5 pl-6">
                          <div className="flex items-center gap-2">
                            <Fingerprint className="size-3.5 text-slate-400" />
                            <span className="text-[11px] font-mono font-black text-slate-500 uppercase">{user.employeeId || ''}</span>
                          </div>
                        </TableCell>
                        <TableCell className="py-5">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-xs font-black text-slate-900 uppercase leading-none">{user.fullName || ''}</span>
                            <span className="text-[10px] font-bold text-red-600 uppercase tracking-tight">{user.username || ''}</span>
                          </div>
                        </TableCell>
                        <TableCell>{user.role ? getRoleBadge(user.role) : <Badge className="bg-slate-100 text-slate-500 border-none font-black text-[9px] uppercase px-2 shadow-none">Sin rol</Badge>}</TableCell>
                        <TableCell className="text-center">{user.status ? getStatusBadge(user.status) : <Badge className="bg-slate-100 text-slate-400 border-none font-black text-[9px] uppercase px-2 shadow-none">Sin estado</Badge>}</TableCell>
                        <TableCell className="py-5">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[10px] font-bold text-slate-600 truncate max-w-[150px]">{user.email || ''}</span>
                            <span className="text-[10px] font-bold text-slate-400">{user.phone || ''}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right pr-6">
                          <div className="flex justify-end items-center gap-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900 hover:bg-slate-100">
                              <Edit2 className="size-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleToggleStatus(user.id, user.status)}
                              className={cn(
                                "h-8 w-8",
                                user.status === 'ACTIVO' ? "text-slate-400 hover:text-red-600 hover:bg-red-50" : "text-slate-400 hover:text-emerald-600 hover:bg-emerald-50"
                              )}
                            >
                              {user.status === 'ACTIVO' ? <UserX className="size-4" /> : <UserCheck className="size-4" />}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-80 text-center">
                        <div className="flex flex-col items-center gap-4 opacity-40">
                          <div className="size-16 rounded-full bg-slate-100 flex items-center justify-center">
                            <UserIcon className="size-8 text-slate-400" />
                          </div>
                          <div>
                            <p className="text-sm font-black text-slate-900 uppercase tracking-tight">Sin resultados</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">No se encontraron colaboradores con los criterios seleccionados</p>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
      <UserDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </AppLayout>
  );
}