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
  User as UserIcon
} from 'lucide-react';
import { useUserStore, UserRole, UserStatus } from '@/store/use-user-store';
import { useShallow } from 'zustand/react/shallow';
import { UserDialog } from '@/components/users/user-dialog';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
export function UsersPage() {
  const users = useUserStore(useShallow(s => s.users));
  const toggleUserStatus = useUserStore(s => s.toggleUserStatus);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('todos');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
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
        return <Badge className="bg-slate-100 text-slate-600 border-none font-black text-[9px] uppercase px-2 shadow-none">Superadmin</Badge>;
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
              <div className="size-10 rounded-lg bg-red-600 flex items-center justify-center text-white shadow-lg shadow-red-100">
                <UserIcon className="size-6" />
              </div>
              <div>
                <h1 className="text-xl font-black text-slate-900 uppercase tracking-tight leading-none">Usuarios</h1>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">ADMINISTRACIÓN DE SISTEMA</p>
              </div>
            </div>
          </div>
          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-end md:items-center">
            <div className="flex-1 w-full space-y-1">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">BUSCAR</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <Input 
                  placeholder="Usuario, nombre, email..." 
                  className="pl-10 h-10 text-sm border-slate-200 focus:ring-red-500 bg-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="w-full md:w-48 space-y-1">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">PERFIL</label>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="h-10 text-sm font-bold border-slate-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="ADMIN">Administrador</SelectItem>
                  <SelectItem value="SUPERADMIN">Superadmin</SelectItem>
                  <SelectItem value="ALMACENERO">Almacenero</SelectItem>
                  <SelectItem value="OPERARIO">Operario</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-48 space-y-1">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">ESTADO</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-10 text-sm font-bold border-slate-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="ACTIVO">Activo</SelectItem>
                  <SelectItem value="INACTIVO">Inactivo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={() => setIsDialogOpen(true)}
              className="bg-red-600 hover:bg-red-700 h-10 text-xs font-black uppercase tracking-tight px-6"
            >
              <UserPlus className="mr-2 size-4" /> Nuevo Usuario
            </Button>
          </div>
          {/* User Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50/30 flex items-center gap-2">
              <UserIcon className="size-4 text-red-600" />
              <span className="text-xs font-black uppercase text-slate-900">Usuarios del Sistema</span>
              <span className="text-[10px] font-bold text-slate-400 ml-1">({filteredUsers.length} usuarios)</span>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow className="border-slate-100">
                    <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest py-4">Usuario</TableHead>
                    <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest py-4">Nombre Completo</TableHead>
                    <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest py-4">Email</TableHead>
                    <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest py-4">Perfil</TableHead>
                    <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest py-4">Estado</TableHead>
                    <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest py-4">Último Acceso</TableHead>
                    <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest py-4 text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id} className="hover:bg-slate-50/50 transition-colors border-slate-100">
                        <TableCell className="py-4">
                          <div className="flex items-center gap-3">
                            <div className="size-8 rounded-full bg-red-50 flex items-center justify-center text-red-600">
                              <UserIcon className="size-4" />
                            </div>
                            <span className="text-xs font-black text-red-600">{user.username}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs font-bold text-slate-700 uppercase">{user.fullName}</TableCell>
                        <TableCell className="text-xs font-medium text-slate-500">{user.email}</TableCell>
                        <TableCell>{getRoleBadge(user.role)}</TableCell>
                        <TableCell>{getStatusBadge(user.status)}</TableCell>
                        <TableCell className="text-[10px] font-bold text-slate-400">{user.lastAccess}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end items-center gap-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900">
                              <Edit2 className="size-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleToggleStatus(user.id, user.status)}
                              className={cn(
                                "h-8 w-8",
                                user.status === 'ACTIVO' ? "text-slate-400 hover:text-red-600" : "text-slate-400 hover:text-emerald-600"
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
                      <TableCell colSpan={7} className="h-64 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <UserIcon className="size-12 text-slate-200" />
                          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No se encontraron usuarios</p>
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