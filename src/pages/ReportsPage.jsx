import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function ReportsPage() {
  const { user, sidebarOpen, addNotification } = useAuth();

  // State for sent reports history
  const [reportsList, setReportsList] = useState([
    {
      id: 101,
      titulo: 'Informe de Asistencia y Excusas 10° A',
      tipo: 'Reporte de Asistencia y Excusas',
      destinatario: 'Rectoría General',
      estudiante: 'Mateo Gómez (Sin excusa)',
      fecha: '2026-07-30 14:30',
      estado: 'Leído por Rector',
      resumen: 'Se reporta inasistencia recurrente sin justificación médica.'
    },
    {
      id: 102,
      titulo: 'Balance Académico de Talleres 3D - Biología',
      tipo: 'Informe Académico',
      destinatario: 'Coordinación Académica',
      estudiante: 'Grupo General 10° A y 10° B',
      fecha: '2026-07-28 10:15',
      estado: 'En Trámite',
      resumen: 'El 92% de los estudiantes completó la simulación del Frailejón Andino en 3D.'
    }
  ]);

  // Form State
  const [titulo, setTitulo] = useState('');
  const [tipo, setTipo] = useState('Informe Académico');
  const [destinatario, setDestinatario] = useState('Rectoría General');
  const [estudianteRelacionado, setEstudianteRelacionado] = useState('Todos / Informe General de Grupo');
  const [observaciones, setObservaciones] = useState('');
  const [incluirTablaStats, setIncluirTablaStats] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  const handleSubmitReport = (e) => {
    e.preventDefault();
    setSubmitting(true);

    setTimeout(() => {
      const newReport = {
        id: Date.now(),
        titulo,
        tipo,
        destinatario,
        estudiante: estudianteRelacionado,
        fecha: new Date().toISOString().replace('T', ' ').substring(0, 16),
        estado: 'Enviado a Rectoría',
        resumen: observaciones.substring(0, 100) + (observaciones.length > 100 ? '...' : '')
      };

      setReportsList([newReport, ...reportsList]);
      
      if (addNotification) {
        addNotification({
          title: 'Nuevo Informe Recibido',
          text: `Docente ${user.nombre} envió "${titulo}" a Rectoría.`,
          icon: 'description',
          color: 'text-emerald-600',
          targetRole: 'RECTOR'
        });
      }

      setSubmitting(false);
      setSuccessMsg(true);
      setTitulo('');
      setObservaciones('');

      setTimeout(() => setSuccessMsg(false), 3000);
    }, 600);
  };

  return (
    <div className={`flex-1 ${sidebarOpen ? 'md:ml-72' : 'md:ml-0'} p-margin-mobile md:p-margin-desktop overflow-y-auto z-10 relative pt-24 md:pt-28 transition-all duration-300`}>
      
      {/* Header */}
      <header className="mb-8 flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 font-bold text-xs mb-2">
            <span className="material-symbols-outlined text-sm text-amber-600">verified_user</span>
            Canal Directo de Rectoría y Dirección
          </div>
          <h1 className="font-display font-bold text-2xl md:text-3xl text-slate-900">
            Enviar Informes al Rector y Dirección
          </h1>
          <p className="text-xs md:text-sm text-slate-600">
            Genera y transmite reportes académicos, disciplinarios y métricas consolidadas de tus salones.
          </p>
        </div>
      </header>

      {/* Real-time Table Metrics Snapshot */}
      <section className="mb-8">
        <h3 className="font-display font-bold text-sm text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <span className="material-symbols-outlined text-primary text-base">analytics</span>
          Resumen Automático de Datos e Historial de Tablas
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-card p-4 rounded-2xl border border-white/80 shadow-md">
            <span className="text-[10px] font-bold text-slate-500 uppercase block">Total Alumnos</span>
            <div className="text-2xl font-display font-bold text-primary mt-1">48 Alumnos</div>
            <span className="text-[11px] text-emerald-600 font-semibold">100% Asignados</span>
          </div>

          <div className="glass-card p-4 rounded-2xl border border-white/80 shadow-md">
            <span className="text-[10px] font-bold text-slate-500 uppercase block">Estudiantes Activos</span>
            <div className="text-2xl font-display font-bold text-emerald-600 mt-1">42 Activos</div>
            <span className="text-[11px] text-slate-500">87.5% en normalidad</span>
          </div>

          <div className="glass-card p-4 rounded-2xl border border-white/80 shadow-md">
            <span className="text-[10px] font-bold text-slate-500 uppercase block">Novedades y Excusas</span>
            <div className="text-2xl font-display font-bold text-amber-600 mt-1">6 Novedades</div>
            <span className="text-[11px] text-amber-700 font-semibold">2 Excusas | 1 Expulsado</span>
          </div>

          <div className="glass-card p-4 rounded-2xl border border-white/80 shadow-md">
            <span className="text-[10px] font-bold text-slate-500 uppercase block">Trabajos 3D Publicados</span>
            <div className="text-2xl font-display font-bold text-blue-600 mt-1">12 Actividades</div>
            <span className="text-[11px] text-blue-700 font-semibold">4.8 Promedio General</span>
          </div>
        </div>
      </section>

      {/* Main Content Grid: Form + Sent Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Form Column */}
        <div className="lg:col-span-2">
          <div className="bg-white/90 rounded-3xl p-6 md:p-8 border border-white/80 shadow-xl relative">
            
            {successMsg && (
              <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-fadeIn">
                <span className="material-symbols-outlined text-emerald-600">check_circle</span>
                ¡El informe ha sido enviado exitosamente al Despacho del Rector!
              </div>
            )}

            <h3 className="font-display font-bold text-lg text-slate-900 mb-1 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-xl">send</span>
              Componer Nuevo Informe Oficial
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Completa los campos requeridos. Puedes adjuntar los datos consolidados de las tablas de docente.
            </p>

            <form onSubmit={handleSubmitReport} className="space-y-5 text-xs">
              
              <div>
                <label className="block font-bold text-slate-700 mb-1">Título o Asunto del Informe</label>
                <input
                  type="text"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  placeholder="Ej. Reporte Mensual de Rendimiento en Laboratorios 3D de Biología"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 font-semibold focus:ring-2 focus:ring-primary outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tipo de Informe</label>
                  <select
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 font-bold outline-none"
                  >
                    <option value="Informe Académico">Informe Académico</option>
                    <option value="Informe de Convivencia / Disciplina">Convivencia / Disciplina</option>
                    <option value="Reporte de Asistencia y Excusas">Asistencia y Excusas</option>
                    <option value="Informe General de Innovación">Informe Pedagógico e Innovación</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Destinatario Institucional</label>
                  <select
                    value={destinatario}
                    onChange={(e) => setDestinatario(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 font-bold outline-none"
                  >
                    <option value="Rectoría General">Despacho del Rector</option>
                    <option value="Coordinación Académica">Coordinación Académica</option>
                    <option value="Dirección de Grupo">Dirección de Grupo</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Estudiante o Grupo Asociado</label>
                <select
                  value={estudianteRelacionado}
                  onChange={(e) => setEstudianteRelacionado(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 outline-none"
                >
                  <option value="Todos / Informe General de Grupo">Todos los salones (Grado 10° A, 10° B, 11° A)</option>
                  <option value="Mateo Gómez (Estudiante con Novedad)">Mateo Gómez (Estudiante - Sin excusa)</option>
                  <option value="Sofía Rodríguez (Estudiante con Novedad)">Sofía Rodríguez (Estudiante - Con excusa)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Detalle de Observaciones y Conclusiones</label>
                <textarea
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  rows="4"
                  placeholder="Escribe el informe detallado con las observaciones pertinentes para el Rector..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 outline-none"
                  required
                ></textarea>
              </div>

              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-2xl flex items-center gap-3">
                <input
                  type="checkbox"
                  id="stats-check"
                  checked={incluirTablaStats}
                  onChange={(e) => setIncluirTablaStats(e.target.checked)}
                  className="w-4 h-4 text-primary rounded border-slate-300 focus:ring-primary"
                />
                <label htmlFor="stats-check" className="text-xs text-amber-900 font-semibold cursor-pointer">
                  Adjuntar automáticamente snapshot estadístico del directorio de estudiantes (Activos, Excusas, Retirados).
                </label>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-3 rounded-2xl bg-primary text-on-primary font-bold text-xs shadow-lg hover:bg-primary/90 transition-all flex items-center gap-2"
                >
                  {submitting ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Enviando a Rectoría...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-base">send</span>
                      Enviar Informe al Rector
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>

        {/* Sent Reports History Column */}
        <div className="lg:col-span-1">
          <div className="bg-white/90 rounded-3xl p-6 border border-white/80 shadow-xl">
            <h3 className="font-display font-bold text-base text-slate-900 mb-4 flex items-center gap-2 border-b border-slate-200 pb-3">
              <span className="material-symbols-outlined text-emerald-600 text-lg">history_edu</span>
              Historial de Informes Enviados
            </h3>

            <div className="space-y-4">
              {reportsList.map((item) => (
                <div key={item.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:shadow-md transition-all">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-primary-container text-on-primary-container">
                      {item.tipo}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      item.estado === 'Leído por Rector' ? 'bg-emerald-100 text-emerald-900' : 'bg-amber-100 text-amber-900'
                    }`}>
                      {item.estado}
                    </span>
                  </div>

                  <h4 className="font-bold text-xs text-slate-900 mb-1">{item.titulo}</h4>
                  <p className="text-[11px] text-slate-600 mb-2 line-clamp-2">{item.resumen}</p>

                  <div className="pt-2 border-t border-slate-200 flex justify-between text-[10px] font-semibold text-slate-500">
                    <span>{item.destinatario}</span>
                    <span>{item.fecha}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
