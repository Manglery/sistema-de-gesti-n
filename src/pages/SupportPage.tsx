import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { LifeBuoy, BookOpen, MessageCircle, Mail, Phone, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
export function SupportPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Ticket enviado correctamente. Nuestro equipo contactará con usted pronto.");
  };
  return (
    <AppLayout className="bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12 space-y-8">
          <div className="flex items-center gap-4">
            <div className="size-12 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-xl shadow-slate-200">
              <LifeBuoy className="size-7" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight leading-none">Centro de Soporte</h1>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">AYUDA, DOCUMENTACIÓN Y CONTACTO TÉCNICO</p>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 space-y-6">
              <Card className="border-slate-200">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <BookOpen className="size-4 text-red-600" />
                    <CardTitle className="text-sm font-black uppercase">Preguntas Frecuentes</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1" className="border-slate-100">
                      <AccordionTrigger className="text-xs font-bold uppercase py-4">¿Cómo cambio el almacén activo?</AccordionTrigger>
                      <AccordionContent className="text-sm text-slate-600">
                        Puede cambiar el almacén desde el selector ubicado en el encabezado principal o desde la barra lateral en el apartado "Almacén Activo".
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2" className="border-slate-100">
                      <AccordionTrigger className="text-xs font-bold uppercase py-4">¿Qué es el Kardex y cómo se actualiza?</AccordionTrigger>
                      <AccordionContent className="text-sm text-slate-600">
                        El Kardex es el registro histórico de todos los movimientos. Se actualiza automáticamente cada vez que se registra un nuevo pedido, despacho o recepción de compra.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3" className="border-slate-100">
                      <AccordionTrigger className="text-xs font-bold uppercase py-4">¿Cómo puedo exportar reportes?</AccordionTrigger>
                      <AccordionContent className="text-sm text-slate-600">
                        En la sección de "Reportes Data", encontrará botones de descarga para formatos Excel y PDF de todos los indicadores seleccionados.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-slate-200 bg-white">
                  <CardContent className="pt-6 flex flex-col items-center text-center gap-4">
                    <div className="size-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-900">
                      <Mail className="size-6" />
                    </div>
                    <div>
                      <div className="text-xs font-black uppercase mb-1">Email Soporte</div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase">soporte.wms@acciona.com</div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-slate-200 bg-white">
                  <CardContent className="pt-6 flex flex-col items-center text-center gap-4">
                    <div className="size-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-900">
                      <Phone className="size-6" />
                    </div>
                    <div>
                      <div className="text-xs font-black uppercase mb-1">Teléfono Directo</div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase">+34 900 123 456</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            <Card className="lg:col-span-5 border-slate-200 shadow-lg">
              <CardHeader className="bg-slate-900 text-white rounded-t-lg">
                <div className="flex items-center gap-3">
                  <AlertCircle className="size-5" />
                  <div>
                    <CardTitle className="text-sm font-black uppercase tracking-tight">Reportar Incidencia</CardTitle>
                    <p className="text-[9px] text-slate-400 font-bold uppercase">Soporte técnico Nivel 1</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-500">Asunto</label>
                    <Input placeholder="Ej. Error al procesar despacho" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-500">Urgencia</label>
                    <div className="flex gap-2">
                      <Button type="button" variant="outline" className="flex-1 text-[9px] font-black uppercase h-8 border-red-100 text-red-600">Crítica</Button>
                      <Button type="button" variant="outline" className="flex-1 text-[9px] font-black uppercase h-8">Media</Button>
                      <Button type="button" variant="outline" className="flex-1 text-[9px] font-black uppercase h-8">Baja</Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-500">Mensaje Detallado</label>
                    <Textarea placeholder="Describa el problema aquí..." className="min-h-[120px]" required />
                  </div>
                  <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-[10px] font-black uppercase h-12 shadow-xl shadow-red-100">
                    <MessageCircle className="size-4 mr-2" /> Enviar Ticket
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}