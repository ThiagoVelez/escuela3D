import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const INITIAL_TEACHER_REPORTS = [
  {
    id: 'rep-1',
    docenteNombre: 'Dra. Valentina Ríos',
    docenteAvatar: 'https://i.pravatar.cc/150?u=valentina',
    materia: 'Biología 3D & Ciencias',
    grado: '10° A',
    jornada: 'Mañana',
    horarioClase: '06:30 AM - 07:30 AM',
    fechaEnvio: 'Hoy 07:35 AM',
    presentes: 6,
    ausentes: 1,
    excusados: 1,
    observacionGeneral: 'Práctica de laboratorio 3D sobre célula de Frailejón desarrollada sin inconvenientes.',
    estudiantes: [
      { id: 1, documento: 'TI-1.029.384.910', nombre: 'Mateo Gómez', asistencia: 'vino', observacion: 'Excelente desempeño en el simulador 3D' },
      { id: 2, documento: 'TI-1.032.495.102', nombre: 'Sofía Morales', asistencia: 'vino', observacion: '' },
      { id: 3, documento: 'TI-1.018.293.481', nombre: 'Juan Pablo Rodríguez', asistencia: 'vino', observacion: '' },
      { id: 4, documento: 'TI-1.027.394.819', nombre: 'Camila Andrea Silva', asistencia: 'excusa', observacion: 'Presentó incapacidad médica EPS' },
      { id: 5, documento: 'TI-1.031.928.374', nombre: 'Andrés Felipe Vargas', asistencia: 'vino', observacion: '' },
      { id: 6, documento: 'TI-1.025.849.201', nombre: 'Valentina Herrera', asistencia: 'no_vino', observacion: 'Sin justificación' },
      { id: 7, documento: 'TI-1.019.384.726', nombre: 'Lucas Esteban Castro', asistencia: 'vino', observacion: 'Llegó 5 min tarde' },
      { id: 8, documento: 'TI-1.033.918.273', nombre: 'Mariana Mendoza', asistencia: 'vino', observacion: '' }
    ],
    estadoRector: 'Revisado'
  },
  {
    id: 'rep-2',
    docenteNombre: 'Ing. Alejandro Torres',
    docenteAvatar: 'https://i.pravatar.cc/150?u=alejandro',
    materia: 'Matemáticas 3D & Vectores',
    grado: '10° B',
    jornada: 'Mañana',
    horarioClase: '07:30 AM - 08:30 AM',
    fechaEnvio: 'Hoy 08:32 AM',
    presentes: 7,
    ausentes: 0,
    excusados: 0,
    observacionGeneral: 'Evaluación parcial de magnitud vectorial en R3. 100% de asistencia.',
    estudiantes: [
      { id: 101, documento: 'TI-1.028.192.837', nombre: 'Daniel Alejandro Torres', asistencia: 'vino', observacion: 'Calificación 5.0 en quiz' },
      { id: 102, documento: 'TI-1.034.918.273', nombre: 'Isabella Gómez Pérez', asistencia: 'vino', observacion: '' },
      { id: 103, documento: 'TI-1.017.293.847', nombre: 'Santiago Ruiz Martínez', asistencia: 'vino', observacion: '' },
      { id: 104, documento: 'TI-1.026.394.810', nombre: 'Gabriela López', asistencia: 'vino', observacion: '' }
    ],
    estadoRector: 'Pendiente Revisión'
  },
  {
    id: 'rep-3',
    docenteNombre: 'Prof. Gabriel Mendoza',
    docenteAvatar: 'https://i.pravatar.cc/150?u=gabriel',
    materia: 'Literatura Colombiana',
    grado: '11° A',
    jornada: 'Mañana',
    horarioClase: '09:15 AM - 10:15 AM',
    fechaEnvio: 'Ayer 10:20 AM',
    presentes: 5,
    ausentes: 1,
    excusados: 0,
    observacionGeneral: 'Taller presencial y maqueta 3D de Macondo.',
    estudiantes: [
      { id: 201, documento: 'CC-1.092.384.719', nombre: 'Carlos Eduardo Ospina', asistencia: 'vino', observacion: '' },
      { id: 202, documento: 'CC-1.098.273.645', nombre: 'Laura Natalia Jimeno', asistencia: 'vino', observacion: '' },
      { id: 203, documento: 'CC-1.091.827.364', nombre: 'Felipe Alexander Marín', asistencia: 'no_vino', observacion: 'Ausente en control de lectura' }
    ],
    estadoRector: 'Aprobado'
  }
];

const TEACHER_SCHEDULES = [
  { docente: 'Dra. Valentina Ríos', materia: 'Biología 3D', salon: 'Aula 201', grados: ['10° A', '10° B', '9° C'], totalHoras: '16 Horas/Semana' },
  { docente: 'Ing. Alejandro Torres', materia: 'Matemáticas 3D', salon: 'Aula 102', grados: ['10° A', '10° B', '11° A'], totalHoras: '20 Horas/Semana' },
  { docente: 'Prof. Gabriel Mendoza', materia: 'Literatura Colombiana', salon: 'Aula 301', grados: ['11° A', '11° B'], totalHoras: '14 Horas/Semana' },
  { docente: 'Prof. Carlos López', materia: 'Física 3D', salon: 'Laboratorio 2', grados: ['10° A', '11° A'], totalHoras: '12 Horas/Semana' }
];

export default function RectorAttendanceReportsPage() {
  const { user, sidebarOpen, notifications } = useAuth();
  
  const [reports, setReports] = useState(INITIAL_TEACHER_REPORTS);
  const [selectedReport, setSelectedReport] = useState(null);
  const [activeTab, setActiveTab] = useState('reports'); // 'reports' or 'schedules'
  const [filterGrade, setFilterGrade] = useState('Todos');
  const [searchDocente, setSearchDocente] = useState('');
  const [acknowledgedMsg, setAcknowledgedMsg] = useState(false);

  // Mark report as reviewed by Rector
  const handleAcknowledgeReport = (reportId) => {
    setReports(prev => prev.map(r => {
      if (r.id === reportId) {
        return { ...r, estadoRector: 'Aprobado por Rectoría' };
      }
      return r;
    }));
    setAcknowledgedMsg(true);
    setTimeout(() => {
      setAcknowledgedMsg(false);
    }, 2000);
  };

  const filteredReports = reports.filter(r => {
    const matchesGrade = filterGrade === 'Todos' || r.grado === filterGrade;
    const matchesDocente = r.docenteNombre.toLowerCase().includes(searchDocente.toLowerCase()) ||
                           r.materia.toLowerCase().includes(searchDocente.toLowerCase());
    return matchesGrade && matchesDocente;
  });

  return (
    <div className={`flex-1 ${sidebarOpen ? 'md:ml-72' : 'md:ml-0'} p-margin-mobile md:p-margin-desktop overflow-y-auto z-10 relative pt-24 md:pt-28 transition-all duration-300`}>
      
      {/* Header */}
      <header className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-extrabold text-xs mb-2">
          <span className="material-symbols-outlined text-base">account_balance</span>
          Despacho del Rector / Gobernanza e Informes Docentes
        </div>
        <h1 className="font-display font-bold text-3xl md:text-4xl text-primary mb-1 tracking-tight">
          Asistencias y Horarios Recibidos de Profesores
        </h1>
        <p className="text-sm md:text-base text-on-surface-variant">
          Recepción en tiempo real de llamadas a lista, reportes de asistencia y control de salones asignados a los docentes.
        </p>
      </header>

      {/* Navigation Sub-Tabs */}
      <div className="flex bg-slate-200/80 p-1.5 rounded-2xl mb-6 max-w-md border border-slate-300 shadow-inner">
        <button
          onClick={() => setActiveTab('reports')}
          className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'reports'
              ? 'bg-amber-600 text-white shadow-md'
              : 'text-slate-700 hover:bg-white/50'
          }`}
        >
          <span className="material-symbols-outlined text-base">fact_check</span>
          Reportes de Asistencia ({reports.length})
        </button>

        <button
          onClick={() => setActiveTab('schedules')}
          className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'schedules'
              ? 'bg-amber-600 text-white shadow-md'
              : 'text-slate-700 hover:bg-white/50'
          }`}
        >
          <span className="material-symbols-outlined text-base">calendar_month</span>
          Horarios de Salones Docentes
        </button>
      </div>

      {/* TAB 1: REPORTES DE ASISTENCIA RECIBIDOS DE DOCENTES */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          
          {/* Filters Bar */}
          <div className="glass-card p-4 rounded-2xl border border-white/80 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-80">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
                search
              </span>
              <input
                type="text"
                value={searchDocente}
                onChange={(e) => setSearchDocente(e.target.value)}
                placeholder="Buscar por profesor o materia..."
                className="w-full bg-white border border-slate-200 rounded-xl py-2 pl-9 pr-3 text-xs outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <span className="text-xs font-bold text-slate-600">Filtrar por Grado:</span>
              <select
                value={filterGrade}
                onChange={(e) => setFilterGrade(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 outline-none"
              >
                <option value="Todos">Todos los Grados</option>
                <option value="10° A">10° A</option>
                <option value="10° B">10° B</option>
                <option value="11° A">11° A</option>
              </select>
            </div>
          </div>

          {/* List of Received Attendance Reports */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReports.map((rep) => (
              <div 
                key={rep.id}
                className="glass-card rounded-3xl p-6 border border-white/80 shadow-md relative overflow-hidden flex flex-col justify-between hover:shadow-xl transition-all"
              >
                <div>
                  {/* Top Row Header */}
                  <div className="flex items-center justify-between mb-4 border-b border-slate-200/80 pb-3">
                    <div className="flex items-center gap-2.5">
                      <img 
                        src={rep.docenteAvatar} 
                        alt={rep.docenteNombre} 
                        className="w-10 h-10 rounded-full border border-amber-300 object-cover shadow-sm"
                      />
                      <div>
                        <div className="font-bold text-sm text-slate-900">{rep.docenteNombre}</div>
                        <div className="text-[10px] text-slate-500">{rep.fechaEnvio}</div>
                      </div>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                      rep.estadoRector.includes('Aprobado') ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-amber-100 text-amber-900 border border-amber-300'
                    }`}>
                      {rep.estadoRector}
                    </span>
                  </div>

                  {/* Classroom Details */}
                  <div className="mb-4">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-extrabold text-[11px] inline-block mb-1">
                      Grado {rep.grado} • {rep.jornada}
                    </span>
                    <h3 className="font-display font-bold text-lg text-slate-900 mb-0.5">
                      {rep.materia}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      Horario: {rep.horarioClase}
                    </p>
                  </div>

                  {/* Attendance Metrics Pills */}
                  <div className="grid grid-cols-3 gap-2 text-center p-3 rounded-2xl bg-slate-50 border border-slate-200/80 mb-4">
                    <div className="bg-emerald-50 border border-emerald-200 p-1.5 rounded-xl">
                      <div className="font-extrabold text-base text-emerald-700">{rep.presentes}</div>
                      <div className="text-[10px] text-emerald-800 font-bold">Vino</div>
                    </div>
                    <div className="bg-red-50 border border-red-200 p-1.5 rounded-xl">
                      <div className="font-extrabold text-base text-red-700">{rep.ausentes}</div>
                      <div className="text-[10px] text-red-800 font-bold">No vino</div>
                    </div>
                    <div className="bg-amber-50 border border-amber-200 p-1.5 rounded-xl">
                      <div className="font-extrabold text-base text-amber-700">{rep.excusados}</div>
                      <div className="text-[10px] text-amber-800 font-bold">Excusa</div>
                    </div>
                  </div>
                </div>

                {/* Inspect Button */}
                <button
                  onClick={() => setSelectedReport(rep)}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-base">visibility</span>
                  <span>Ver Planilla Detallada con Cédulas</span>
                </button>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* TAB 2: HORARIOS DE PROFESORES Y SALONES */}
      {activeTab === 'schedules' && (
        <div className="space-y-6">
          <div className="glass-card rounded-3xl p-6 border border-white/80 shadow-md">
            <h3 className="font-display font-bold text-xl text-slate-900 mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-600">calendar_view_week</span>
              Asignación de Horarios por Profesor y Salón
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 uppercase font-extrabold border-b border-slate-200">
                    <th className="py-3 px-4">Docente</th>
                    <th className="py-3 px-4">Asignatura / Materia</th>
                    <th className="py-3 px-4">Aula / Salón</th>
                    <th className="py-3 px-4">Grados Asignados</th>
                    <th className="py-3 px-4">Carga Horaria</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {TEACHER_SCHEDULES.map((sch, idx) => (
                    <tr key={idx} className="hover:bg-white/80 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900">{sch.docente}</td>
                      <td className="py-3 px-4 text-slate-700 font-semibold">{sch.materia}</td>
                      <td className="py-3 px-4 text-slate-600">{sch.salon}</td>
                      <td className="py-3 px-4">
                        <div className="flex gap-1">
                          {sch.grados.map((g, i) => (
                            <span key={i} className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold text-[10px]">
                              {g}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-bold text-emerald-700">{sch.totalHoras}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* DETAILED ATTENDANCE MODAL FOR RECTOR */}
      {selectedReport && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 pt-20 md:pt-24 bg-slate-900/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-3xl w-full max-h-[85vh] overflow-y-auto shadow-2xl relative my-auto">
            
            <button
              onClick={() => setSelectedReport(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center justify-center transition-colors z-10"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-extrabold text-xs">
                Informe de Asistencia • Grado {selectedReport.grado}
              </span>
              <span className="text-xs text-slate-400 font-semibold">{selectedReport.fechaEnvio}</span>
            </div>

            <h3 className="font-display font-bold text-2xl text-slate-900 mb-1">
              Planilla Enviada por {selectedReport.docenteNombre}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Materia: <strong>{selectedReport.materia}</strong> | Horario: {selectedReport.horarioClase} | Jornada: {selectedReport.jornada}
            </p>

            {selectedReport.observacionGeneral && (
              <div className="p-3 bg-amber-50 border border-amber-200 text-amber-950 rounded-2xl text-xs mb-4">
                <strong>Observaciones del Profesor a Rectoría:</strong> {selectedReport.observacionGeneral}
              </div>
            )}

            {acknowledgedMsg && (
              <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-bold mb-4 flex items-center gap-2 animate-fadeIn">
                <span className="material-symbols-outlined">check_circle</span>
                <span>Informe aprobado y registrado en el historial de Rectoría.</span>
              </div>
            )}

            {/* Students Table */}
            <div className="overflow-x-auto border border-slate-200 rounded-2xl mb-6">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-600 font-extrabold border-b border-slate-200">
                    <th className="py-2.5 px-3">Cédula / TI</th>
                    <th className="py-2.5 px-3">Estudiante</th>
                    <th className="py-2.5 px-3 text-center">Estado</th>
                    <th className="py-2.5 px-3">Observaciones del Docente</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {selectedReport.estudiantes.map((std) => (
                    <tr key={std.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-700">{std.documento}</td>
                      <td className="py-2.5 px-3 font-bold text-slate-900">{std.nombre}</td>
                      <td className="py-2.5 px-3 text-center">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                          std.asistencia === 'vino' ? 'bg-emerald-100 text-emerald-800' :
                          std.asistencia === 'no_vino' ? 'bg-red-100 text-red-800' :
                          'bg-amber-100 text-amber-900'
                        }`}>
                          {std.asistencia === 'vino' ? 'Vino' : std.asistencia === 'no_vino' ? 'No vino' : 'Excusa'}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 italic">
                        {std.observacion || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedReport(null)}
                className="px-4 py-2 rounded-xl text-slate-600 font-bold text-xs"
              >
                Cerrar
              </button>
              <button
                type="button"
                onClick={() => handleAcknowledgeReport(selectedReport.id)}
                className="px-5 py-2.5 rounded-xl bg-amber-600 text-white font-bold text-xs shadow hover:bg-amber-700 flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm">verified</span>
                <span>Aprobar y Archivar Informe</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
