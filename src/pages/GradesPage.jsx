import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { MOCK_GRADES } from '../data/mockData';
import { fetchGrades } from '../services/api';

export default function GradesPage() {
  const { user, sidebarOpen } = useAuth();
  const [grades, setGrades] = useState(MOCK_GRADES);

  useEffect(() => {
    fetchGrades().then(data => {
      if (data && data.length > 0) {
        setGrades(data);
      }
    });
  }, []);

  const average = grades.length > 0
    ? (grades.reduce((acc, curr) => acc + (parseFloat(curr.grade) || 0), 0) / grades.length).toFixed(2)
    : '5.0';

  return (
    <div className={`flex-1 ${sidebarOpen ? 'md:ml-72' : 'md:ml-0'} ${user?.rol === 'ESTUDIANTE' ? 'xl:pr-[360px]' : ''} p-margin-mobile md:p-margin-desktop overflow-y-auto z-10 relative pt-28 md:pt-32 transition-all duration-300`}>
      <header className="mb-8">
        <h1 className="font-display font-bold text-3xl md:text-4xl text-primary mb-1">
          Boletín de Calificaciones
        </h1>
        <p className="text-base text-on-surface-variant">
          Seguimiento académico detallado según los registros de MySQL.
        </p>
      </header>

      {/* Average Card */}
      <div className="glass-panel p-6 rounded-2xl mb-8 flex items-center justify-between flex-wrap gap-4 border border-white/60">
        <div>
          <span className="text-xs font-bold text-secondary uppercase tracking-wider">Promedio Acumulado</span>
          <div className="text-4xl font-display font-bold text-primary mt-1">
            {average} <span className="text-sm font-normal text-on-surface-variant">/ 5.0</span>
          </div>
        </div>
        <div className="px-4 py-2 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-semibold border border-emerald-200">
          Desempeño Superior • Nivel Avanzado
        </div>
      </div>

      {/* Grades Table */}
      <div className="glass-card rounded-2xl overflow-hidden border border-white/80">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-high/60 border-b border-outline-variant/30 text-xs font-bold text-on-surface uppercase">
              <th className="p-4">Materia</th>
              <th className="p-4">Concepto / Evaluación</th>
              <th className="p-4">Porcentaje</th>
              <th className="p-4">Fecha</th>
              <th className="p-4 text-right">Nota (1.0 - 5.0)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/20 text-sm">
            {grades.map((g) => (
              <tr key={g.id} className="hover:bg-white/60 transition-colors">
                <td className="p-4 font-semibold text-primary">{g.subject}</td>
                <td className="p-4 text-on-surface">{g.concept}</td>
                <td className="p-4 text-on-surface-variant font-medium">{g.weight}</td>
                <td className="p-4 text-outline text-xs">{g.date}</td>
                <td className="p-4 text-right font-bold text-base text-emerald-700">
                  {parseFloat(g.grade).toFixed(1)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
