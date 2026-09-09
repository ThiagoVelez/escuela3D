import React from 'react';
import { useAuth } from '../context/AuthContext';
import { BookOpen } from 'lucide-react';

// Página deshabilitada: Los laboratorios 3D han sido removidos para optimización de recursos.
export default function LabsPage() {
  const { setActiveTab } = useAuth();
  return (
    <div className="flex-1 p-6 md:p-10 pt-24 flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
        <BookOpen className="w-8 h-8" />
      </div>
      <h2 className="font-display font-bold text-2xl text-slate-900 mb-2">Módulos Académicos Optimizados</h2>
      <p className="text-sm text-slate-500 max-w-md mb-6">
        Las actividades interactivas ahora están integradas directamente en cada una de tus materias activas.
      </p>
      <button
        onClick={() => setActiveTab('subjects')}
        className="px-6 py-2.5 rounded-xl bg-primary text-white font-bold text-xs shadow-md hover:bg-primary/90 transition-all"
      >
        Ir a Materias Activas
      </button>
    </div>
  );
}
