import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { MOCK_SUBJECTS } from '../data/mockData';
import { fetchAssignments, submitAssignment } from '../services/api';
import { Zap, BookOpen, ArrowRight, CheckCircle2, Send, Database } from 'lucide-react';

export default function DashboardPage() {
  const { user, setSelectedLab, setSelectedSubject, setActiveTab, sidebarOpen, addNotification } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissionText, setSubmissionText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedMessage, setSubmittedMessage] = useState(false);

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    const data = await fetchAssignments(null, user.grado);
    setAssignments(data || []);
  };

  const handleSubmitWork = async (e) => {
    e.preventDefault();
    if (!selectedAssignment) return;
    setSubmitting(true);

    await submitAssignment(selectedAssignment.id, submissionText);
    
    if (addNotification) {
      addNotification({
        title: 'Entrega de Tarea Recibida',
        text: `El estudiante ${user.nombre} envió el trabajo "${selectedAssignment.titulo}".`,
        icon: 'upload_file',
        color: 'text-blue-600',
        targetRole: 'DOCENTE'
      });
    }

    setSubmitting(false);
    setSubmittedMessage(true);
    setTimeout(() => {
      setSubmittedMessage(false);
      setSelectedAssignment(null);
      setSubmissionText('');
      loadAssignments();
    }, 1200);
  };

  return (
    <div className={`flex-1 ${sidebarOpen ? 'md:ml-72' : 'md:ml-0'} ${user.rol === 'ESTUDIANTE' ? 'xl:pr-[360px]' : ''} p-4 sm:p-6 md:p-8 overflow-y-auto z-10 relative pt-20 md:pt-24 transition-all duration-300`}>
      
      {/* Header Banner */}
      <header className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl text-primary mb-1 tracking-tight">
              Bienvenido, {user.nombre}
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-on-surface-variant">
              Campus Virtual Institucional EduCol • Grado {user.grado || '10° A'} ({user.jornada || 'Mañana'})
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/70 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/80 shadow-sm self-start">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm">
              <Zap className="w-5 h-5 text-amber-600 fill-amber-600" />
            </div>
            <div>
              <div className="text-xs text-on-surface-variant font-medium">Nivel Académico</div>
              <div className="text-xs font-bold text-primary">{user.puntosExperiencia || 450} XP Acumulados</div>
            </div>
          </div>
        </div>
      </header>

      {/* Active Subjects Grid (Bento Style) */}
      <section className="mb-10">
        <h2 className="font-display text-lg sm:text-xl font-bold text-on-background mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          Materias Activas
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          
          {/* Card 1: Math */}
          <div 
            onClick={() => setSelectedSubject(MOCK_SUBJECTS[0])}
            className="glass-card rounded-2xl p-6 flex flex-col h-60 relative overflow-hidden group cursor-pointer border border-white/80 hover:shadow-xl hover:scale-[1.01] transition-all bg-white/70"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-2xl -mr-10 -mt-10 transition-transform group-hover:scale-150"></div>
            
            <div className="flex justify-between items-start mb-auto z-10">
              <div className="p-3 bg-white/80 rounded-xl backdrop-blur-sm border border-white/40 shadow-sm text-primary font-bold">
                <span className="material-symbols-outlined text-2xl">calculate</span>
              </div>
              <span className="font-semibold text-xs bg-primary text-white px-3 py-1 rounded-full shadow-sm">
                Ver Materia
              </span>
            </div>

            <div className="z-10 mt-auto">
              <h3 className="font-display font-bold text-lg sm:text-xl text-on-background mb-1 group-hover:text-primary transition-colors">
                Matemáticas
              </h3>
              <p className="text-xs text-on-surface-variant line-clamp-1 mb-2">
                Vectores R³, geometría analítica y cálculo espacial.
              </p>
              <div className="flex items-center gap-3">
                <div className="h-2 flex-1 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[65%] rounded-full"></div>
                </div>
                <span className="font-semibold text-xs text-on-surface-variant">65%</span>
              </div>
            </div>
          </div>

          {/* Card 2: Science (Biology) */}
          <div 
            onClick={() => setSelectedSubject(MOCK_SUBJECTS[1])}
            className="glass-card rounded-2xl p-6 flex flex-col h-60 relative overflow-hidden group cursor-pointer border border-white/80 hover:shadow-xl hover:scale-[1.01] transition-all bg-white/70"
          >
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl -mr-10 -mb-10 transition-transform group-hover:scale-150"></div>
            
            <div className="flex justify-between items-start mb-auto z-10">
              <div className="p-3 bg-white/80 rounded-xl backdrop-blur-sm border border-white/40 shadow-sm text-emerald-700 font-bold">
                <span className="material-symbols-outlined text-2xl">science</span>
              </div>
              <span className="font-semibold text-xs bg-emerald-700 text-white px-3 py-1 rounded-full shadow-sm">
                Flora Andina
              </span>
            </div>

            <div className="z-10 mt-auto">
              <h3 className="font-display font-bold text-lg sm:text-xl text-on-background mb-1 group-hover:text-emerald-700 transition-colors">
                Biología
              </h3>
              <p className="text-xs text-on-surface-variant line-clamp-2 mb-2">
                Estructura celular de la flora endémica andina y ecosistemas colombianos.
              </p>
              <div className="flex items-center justify-between text-xs text-emerald-700 font-bold">
                <span>Ver Materia</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Card 3: Spanish / Literature */}
          <div 
            onClick={() => setSelectedSubject(MOCK_SUBJECTS[2])}
            className="glass-card rounded-2xl p-6 flex flex-col h-60 relative overflow-hidden group cursor-pointer border border-white/80 hover:shadow-xl hover:scale-[1.01] transition-all bg-white/70"
          >
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl transition-transform group-hover:scale-125"></div>
            
            <div className="flex justify-between items-start mb-auto z-10">
              <div className="p-3 bg-white/80 rounded-xl backdrop-blur-sm border border-white/40 shadow-sm text-amber-800 font-bold">
                <BookOpen className="w-6 h-6 text-amber-800" />
              </div>
              <span className="font-semibold text-xs bg-amber-100 text-amber-900 px-3 py-1 rounded-full border border-amber-200">
                Macondo & Letras
              </span>
            </div>

            <div className="z-10 mt-auto">
              <h3 className="font-display font-bold text-lg sm:text-xl text-on-background mb-1 group-hover:text-amber-800 transition-colors">
                Literatura Colombiana
              </h3>
              <p className="text-xs text-on-surface-variant line-clamp-2 mb-2">
                "Cien años de soledad" - Contexto histórico y análisis crítico.
              </p>
              <div className="flex items-center justify-between text-xs text-amber-800 font-bold">
                <span>Ver Materia</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ASSIGNMENTS SECTION: Trabajos y Talleres Asignados por Docentes */}
      <section className="mb-10">
        <h2 className="font-display text-xl font-bold text-on-background mb-4 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary">assignment</span>
            Trabajos, Talleres y Cuestionarios Asignados por Docentes
          </span>
          <span className="text-xs text-slate-500 font-semibold">
            {assignments.length} Actividades Pendientes / Asignadas
          </span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {assignments.map((item) => (
            <div key={item.id} className="glass-card rounded-2xl p-5 border border-white/80 shadow-md flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-primary-container text-on-primary-container font-extrabold text-[10px]">
                    {item.subjectTitle} • {item.tipo}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                    item.estadoEstudiante === 'Entregado' ? 'bg-emerald-100 text-emerald-900' : 'bg-amber-100 text-amber-900'
                  }`}>
                    {item.estadoEstudiante || 'Pendiente'}
                  </span>
                </div>

                <h3 className="font-display font-bold text-base text-slate-900 mb-1">
                  {item.titulo}
                </h3>
                <p className="text-xs text-slate-600 mb-3">
                  {item.descripcion}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-semibold">
                  Docente: <strong>{item.docenteNombre}</strong> • Límite: {item.fechaLimite}
                </span>

                <button
                  onClick={() => setSelectedAssignment(item)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-900 text-white font-bold text-xs shadow hover:bg-slate-800 transition-all flex items-center gap-1"
                >
                  <span>{item.estadoEstudiante === 'Entregado' ? 'Ver Entrega' : 'Realizar Entrega'}</span>
                  <span className="material-symbols-outlined text-sm">send</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Database Quick Stats */}
      <section className="bg-white/40 backdrop-blur-md rounded-2xl p-6 border border-white/60 shadow-sm">
        <h3 className="font-display font-bold text-base text-primary mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined">database</span>
          Estado de Base de Datos MySQL (educol3d_db)
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-3 rounded-xl bg-white/60 border border-outline-variant/30">
            <div className="text-2xl font-bold text-primary">3</div>
            <div className="text-xs text-on-surface-variant font-medium">Materias Cursadas</div>
          </div>
          <div className="p-3 rounded-xl bg-white/60 border border-outline-variant/30">
            <div className="text-2xl font-bold text-secondary">4.6</div>
            <div className="text-xs text-on-surface-variant font-medium">Promedio Parcial</div>
          </div>
          <div className="p-3 rounded-xl bg-white/60 border border-outline-variant/30">
            <div className="text-2xl font-bold text-emerald-600">{assignments.length}</div>
            <div className="text-xs text-on-surface-variant font-medium">Talleres Asignados</div>
          </div>
          <div className="p-3 rounded-xl bg-white/60 border border-outline-variant/30">
            <div className="text-2xl font-bold text-tertiary">100%</div>
            <div className="text-xs text-on-surface-variant font-medium">Asistencia 3D</div>
          </div>
        </div>
      </section>

      {/* STUDENT ASSIGNMENT SUBMISSION MODAL */}
      {selectedAssignment && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 pt-24 md:pt-28 pb-8 bg-slate-900/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-2xl relative my-auto">
            <button
              onClick={() => setSelectedAssignment(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center justify-center transition-colors z-10"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>

            <span className="px-3 py-1 rounded-full bg-primary-container text-on-primary-container font-extrabold text-[10px] inline-block mb-2">
              {selectedAssignment.subjectTitle} • {selectedAssignment.tipo}
            </span>

            <h3 className="font-display font-bold text-xl text-slate-900 mb-2">
              {selectedAssignment.titulo}
            </h3>
            <p className="text-xs text-slate-600 mb-4 bg-slate-50 p-3 rounded-xl border border-slate-200">
              {selectedAssignment.descripcion}
            </p>

            <form onSubmit={handleSubmitWork} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tu Respuesta / Informe de Laboratorio 3D</label>
                <textarea
                  value={submissionText}
                  onChange={(e) => setSubmissionText(e.target.value)}
                  rows="4"
                  placeholder="Escribe tus observaciones, conclusiones del entorno 3D o solución del taller..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary"
                  required
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedAssignment(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-bold"
                >
                  Cerrar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-primary text-on-primary font-bold shadow-md hover:bg-primary/90 flex items-center gap-1.5"
                >
                  {submitting ? 'Enviando...' : submittedMessage ? '¡Entregado!' : 'Enviar Trabajo al Docente'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

