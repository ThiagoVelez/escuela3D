import React from 'react';
import { useAuth } from '../context/AuthContext';
import { HelpCircle, Mail, Phone, BookOpen, Database, CheckCircle2 } from 'lucide-react';

export default function HelpPage() {
  const { sidebarOpen } = useAuth();

  return (
    <div className={`flex-1 ${sidebarOpen ? 'md:ml-72' : 'md:ml-0'} p-4 sm:p-6 md:p-8 overflow-y-auto z-10 relative pt-20 md:pt-24 transition-all duration-300`}>
      <header className="mb-6 sm:mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-2xl bg-primary text-white flex items-center justify-center shadow-md">
            <HelpCircle className="w-5 h-5" />
          </div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl text-primary">
            Centro de Ayuda & Soporte
          </h1>
        </div>
        <p className="text-xs sm:text-sm md:text-base text-on-surface-variant">
          Asistencia técnica institucional y preguntas frecuentes sobre EduCol.
        </p>
      </header>

      <div className="max-w-3xl space-y-4">
        <div className="glass-card rounded-2xl p-5 sm:p-6 border border-white/80 bg-white/70 shadow-sm">
          <h3 className="font-bold text-sm sm:text-base text-primary mb-1 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-primary" />
            ¿Cómo realizar entregas de tareas y talleres en la plataforma?
          </h3>
          <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
            Ingresa a tus materias activas o al listado de actividades pendientes desde tu panel principal. Puedes resolver cuestionarios interactivos o redactar tus respuestas para que queden vinculadas a tu expediente escolar.
          </p>
        </div>

        <div className="glass-card rounded-2xl p-5 sm:p-6 border border-white/80 bg-white/70 shadow-sm">
          <h3 className="font-bold text-sm sm:text-base text-primary mb-1 flex items-center gap-2">
            <Database className="w-4 h-4 text-primary" />
            ¿Cómo se sincronizan las calificaciones en MySQL?
          </h3>
          <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
            Cada vez que un docente califica una entrega o un estudiante valida una actividad, el sistema se conecta a la base de datos MySQL institucional (`educol3d_db`) actualizando los registros de calificaciones de forma inmediata.
          </p>
        </div>

        <div className="glass-card rounded-2xl p-5 sm:p-6 border border-white/80 bg-white/70 shadow-sm">
          <h3 className="font-bold text-sm sm:text-base text-primary mb-2 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-primary" />
            Soporte Técnico Institucional
          </h3>
          <p className="text-xs sm:text-sm text-on-surface-variant mb-3">
            Para dudas sobre matrículas, asignación de grupos o restablecimiento de accesos:
          </p>
          <div className="text-xs sm:text-sm font-semibold text-slate-700 space-y-2">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-primary" />
              <span>Correo: soporte@educol.edu.co</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-primary" />
              <span>Teléfono: +57 (601) 555-0199</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
