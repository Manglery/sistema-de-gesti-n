import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, ShieldCheck, User, Wrench, ArrowRight, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuthStore } from '@/store/use-auth-store';
import { toast } from 'sonner';
export function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore(s => s.login);
  const handleSimulatedLogin = (role: 'admin' | 'almacenero' | 'operario', name: string) => {
    login(role, name, 'contadores');
    toast.success(`Sesión iniciada como ${name} (${role.toUpperCase()})`);
    navigate('/');
  };
  return (
    <div className="min-h-screen w-full flex overflow-hidden bg-slate-50">
      {/* Lado Izquierdo - Visual Brand */}
      <div className="hidden lg:flex lg:w-3/5 relative bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop" 
            alt="Logistics center" 
            className="w-full h-full object-cover opacity-40 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
        </div>
        <div className="relative z-10 p-16 flex flex-col justify-between h-full w-full">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-2xl shadow-red-900">
              <Package className="size-8" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tighter text-white leading-none">ACCIONA</span>
              <span className="text-[10px] uppercase tracking-[0.4em] text-red-500 font-black">Logistics WMS</span>
            </div>
          </div>
          <div className="max-w-xl">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-6xl font-black text-white leading-tight tracking-tighter"
            >
              Control total sobre tu <span className="text-red-600">cadena de suministro.</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6 text-slate-400 text-lg font-medium leading-relaxed"
            >
              Gestión de inventarios en tiempo real, trazabilidad completa y optimización operativa para los proyectos más exigentes de infraestructura.
            </motion.p>
          </div>
          <div className="flex items-center gap-8 border-t border-white/10 pt-8">
            <div className="flex flex-col">
              <span className="text-white font-black text-2xl tracking-tight">100%</span>
              <span className="text-slate-500 text-[10px] uppercase font-black tracking-widest">Trazabilidad</span>
            </div>
            <div className="flex flex-col">
              <span className="text-white font-black text-2xl tracking-tight">+50</span>
              <span className="text-slate-500 text-[10px] uppercase font-black tracking-widest">Centros</span>
            </div>
          </div>
        </div>
      </div>
      {/* Lado Derecho - Form */}
      <div className="w-full lg:w-2/5 flex flex-col justify-center items-center p-8 sm:p-12 md:p-16">
        <div className="w-full max-w-md space-y-12">
          <div className="space-y-4">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Acceso al Sistema</h2>
            <p className="text-slate-500 font-medium">Seleccione un perfil para acceder al entorno de demostración del WMS.</p>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {[
              { id: 'admin', role: 'admin', name: 'Mangler Yerren', icon: ShieldCheck, desc: 'Gestión total, reportes y configuración', color: 'bg-slate-900' },
              { id: 'almacenero', role: 'almacenero', name: 'Juan Pérez', icon: Wrench, desc: 'Entradas, salidas y control de stock', color: 'bg-red-600' },
              { id: 'operario', role: 'operario', name: 'Javier García', icon: User, desc: 'Consultas y ejecución de pedidos', color: 'bg-slate-700' }
            ].map((profile) => (
                <Card 
                  key={profile.id}
                  className="group relative overflow-hidden border-slate-200 hover:border-red-600/50 hover:shadow-xl hover:shadow-red-900/5 transition-all cursor-pointer"
                  onClick={() => handleSimulatedLogin(profile.role as 'admin' | 'almacenero' | 'operario', profile.name)}
                >
                <CardContent className="p-6 flex items-center gap-5">
                  <div className={`size-14 rounded-2xl ${profile.color} flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                    <profile.icon className="size-7" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">{profile.name}</h3>
                      <ArrowRight className="size-4 text-slate-300 group-hover:text-red-600 transition-transform group-hover:translate-x-1" />
                    </div>
                    <p className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-1">{profile.role}</p>
                    <p className="text-[11px] text-slate-500 font-medium truncate">{profile.desc}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="pt-8 border-t border-slate-200">
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-100 border border-slate-200">
              <Building2 className="size-5 text-slate-400" />
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Entorno Activo</span>
                <span className="text-xs font-bold text-slate-700 uppercase">PRODUCCIÓN · ESPAÑA</span>
              </div>
            </div>
            <p className="mt-8 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              © 2025 Acciona Logistics S.A. · v2.4.0
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}