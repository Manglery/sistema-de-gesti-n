import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Mail, Phone, ShieldCheck, User as UserIcon, Wrench, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
const MOCK_USERS = [
  { id: 1, name: 'Mangler Yerren', role: 'Admin', email: 'mangler@acciona.com', phone: '+34 600 000 001', status: 'Active', avatar: 'MY' },
  { id: 2, name: 'Antonio García', role: 'Almacenero', email: 'antonio@acciona.com', phone: '+34 600 000 002', status: 'Active', avatar: 'AG' },
  { id: 3, name: 'Mohammed Jadracui', role: 'Operario', email: 'mohammed@acciona.com', phone: '+34 600 000 003', status: 'Away', avatar: 'MJ' },
  { id: 4, name: 'Lucía Fernández', role: 'Almacenero', email: 'lucia@acciona.com', phone: '+34 600 000 004', status: 'Active', avatar: 'LF' },
  { id: 5, name: 'Ruben Rey', role: 'Operario', email: 'ruben@acciona.com', phone: '+34 600 000 005', status: 'Active', avatar: 'RR' },
];
export function UsersPage() {
  return (
    <AppLayout className="bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-xl shadow-slate-200">
                <Users className="size-7" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight leading-none">Gestión de Usuarios</h1>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">CONTROL DE ACCESOS Y PERFILES DE PERSONAL</p>
              </div>
            </div>
            <Button className="bg-red-600 hover:bg-red-700 text-xs font-black uppercase">Invitar Usuario</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_USERS.map((user) => (
              <Card key={user.id} className="border-slate-200 shadow-sm hover:shadow-md transition-all">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-10 border-2 border-white shadow-sm">
                      <AvatarFallback className="bg-slate-900 text-white font-black text-xs">{user.avatar}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <CardTitle className="text-sm font-black text-slate-900 uppercase truncate max-w-[150px]">{user.name}</CardTitle>
                      <Badge className={user.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-none w-fit text-[8px] font-black uppercase px-1.5 py-0' : 'bg-orange-50 text-orange-600 border-none w-fit text-[8px] font-black uppercase px-1.5 py-0'}>
                        {user.status === 'Active' ? 'En Línea' : 'Ausente'}
                      </Badge>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="size-4" /></Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 flex flex-col gap-1">
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Rol</span>
                      <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-900 uppercase">
                        {user.role === 'Admin' && <ShieldCheck className="size-3 text-red-600" />}
                        {user.role === 'Almacenero' && <Wrench className="size-3 text-blue-600" />}
                        {user.role === 'Operario' && <UserIcon className="size-3 text-slate-400" />}
                        {user.role}
                      </div>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 flex flex-col gap-1">
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Sucursal</span>
                      <span className="text-[10px] font-black text-slate-900 uppercase">Principal</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase">
                      <Mail className="size-3" /> {user.email}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase">
                      <Phone className="size-3" /> {user.phone}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}