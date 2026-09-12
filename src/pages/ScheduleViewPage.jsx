import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Download } from 'lucide-react';

export default function ScheduleViewPage() {
  const { user, sidebarOpen, getScheduleForGrade } = useAuth();
  const [selectedGrado, setSelectedGrado] = useState(user.grado || '10° A');

  const scheduleBlocks = getScheduleForGrade(selectedGrado);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className={`flex-1 ${sidebarOpen ? 'md:ml-72' : 'md:ml-0'} p-margin-mobile md:p-margin-desktop overflow-y-auto z-10 relative pt-24 md:pt-28 transition-all duration-300`}>
      
      {/* Header Banner */}
      <header className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-semibold text-xs mb-2">
              <span className="material-symbols-outlined text-sm">verified</span>
              Horario Oficial Publicado por Rectoría
            </div>
            <h1 className="font-display font-bold text-3xl md:text-4xl text-primary tracking-tight">
              Horario Semanal de Clases
            </h1>
            <p className="text-base text-on-surface-variant">
              Programación de clases, asignaturas 3D y descansos institucionales.
            </p>
          </div>

          <button
            onClick={handlePrint}
            className="bg-white/80 border border-slate-200 hover:bg-white text-slate-700 font-bold text-xs py-2.5 px-4 rounded-xl shadow-sm transition-all flex items-center gap-2 self-start"
          >
            <Download className="w-4 h-4" />
            <span>Descargar PDF</span>
          </button>
        </div>
      </header>

      {/* Grade Selector if Docente has multiple or Estudiante */}
      <div className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-3xl p-5 shadow-sm mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-primary-container text-on-primary-container flex items-center justify-center font-bold">
            <span className="material-symbols-outlined">calendar_view_week</span>
          </div>
          <div>
            <div className="text-xs text-slate-500 font-semibold">Curso / Salón</div>
            <div className="text-base font-bold text-slate-900">{selectedGrado} • Jornada {user.jornada || 'Mañana'}</div>
          </div>
        </div>

        {user.rol === 'DOCENTE' && (
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-slate-700">Ver Horario de:</label>
            <select
              value={selectedGrado}
              onChange={(e) => setSelectedGrado(e.target.value)}
              className="bg-slate-100 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 outline-none"
            >
              <option value="10° A">Grado 10° A</option>
              <option value="10° B">Grado 10° B</option>
              <option value="11° A">Grado 11° A</option>
              <option value="11° B">Grado 11° B</option>
            </select>
          </div>
        )}
      </div>

      {/* Schedule Table */}
      <div className="bg-white/90 backdrop-blur-xl border border-slate-200 rounded-3xl p-6 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-gradient-to-r from-primary-container/40 to-primary/10 text-on-primary-container font-bold uppercase tracking-wider border-b border-slate-200">
              <th className="p-4 w-32 border-r border-slate-200">Hora del Día</th>
              <th className="p-4 border-r border-slate-200">Lunes</th>
              <th className="p-4 border-r border-slate-200">Martes</th>
              <th className="p-4 border-r border-slate-200">Miércoles</th>
              <th className="p-4 border-r border-slate-200">Jueves</th>
              <th className="p-4">Viernes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 font-semibold text-slate-800">
            {scheduleBlocks.map((block) => (
              <tr 
                key={block.id} 
                className={`transition-colors ${
                  block.isBreak 
                    ? 'bg-amber-100/90 text-amber-950 font-black text-center' 
                    : 'hover:bg-slate-50/80'
                }`}
              >
                {/* Time */}
                <td className="p-4 font-bold text-slate-900 border-r border-slate-200 bg-slate-50/80">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm text-primary">schedule</span>
                    {block.hora}
                  </div>
                </td>

                {block.isBreak ? (
                  <td colSpan="5" className="p-4 font-bold text-amber-900 tracking-wider">
                    DESCANSO Y RECREO INSTITUCIONAL
                  </td>
                ) : (
                  <>
                    <td className="p-4 border-r border-slate-200">
                      <div className="font-bold text-slate-900">{block.lunes}</div>
                    </td>
                    <td className="p-4 border-r border-slate-200">
                      <div className="font-bold text-slate-900">{block.martes}</div>
                    </td>
                    <td className="p-4 border-r border-slate-200">
                      <div className="font-bold text-slate-900">{block.miercoles}</div>
                    </td>
                    <td className="p-4 border-r border-slate-200">
                      <div className="font-bold text-slate-900">{block.jueves}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-slate-900">{block.viernes}</div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
