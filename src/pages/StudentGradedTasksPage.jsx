import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchStudentSubmissions } from '../services/api';
import { 
  Award, 
  CheckCircle2, 
  MessageSquare, 
  BookOpen, 
  Calendar, 
  FileText, 
  Download, 
  Search, 
  Filter, 
  Clock, 
  TrendingUp,
  UserCheck,
  AlertCircle,
  Inbox
} from 'lucide-react';

export default function StudentGradedTasksPage() {
  const { user, sidebarOpen, submissionsRefreshKey } = useAuth();

  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSubject, setFilterSubject] = useState('Todas');

  useEffect(() => {
    loadStudentGradedTasks();
  }, [submissionsRefreshKey, user?.id]);

  const loadStudentGradedTasks = async () => {
    setLoading(true);
    const data = await fetchStudentSubmissions(user?.id || 1);
    // Filter only those that have been graded (CALIFICADO)
    const graded = (data || []).filter(item => item.estado === 'CALIFICADO');
    setSubmissions(graded);
    setLoading(false);
  };

  const filteredGraded = submissions.filter((item) => {
    const matchesSearch = item.titulo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.materiaNombre?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.docenteNombre?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSubject = filterSubject === 'Todas' || item.materiaNombre === filterSubject;

    return matchesSearch && matchesSubject;
  });

  const averageGrade = submissions.length > 0
    ? (submissions.reduce((acc, curr) => acc + (parseFloat(curr.nota) || 0), 0) / submissions.length).toFixed(1)
    : '5.0';

  const getPerformanceBadge = (nota) => {
    const val = parseFloat(nota);
    if (val >= 4.6) {
      return { label: 'Desempeño Superior', bg: 'bg-emerald-50 text-emerald-800 border-emerald-300' };
    }
    if (val >= 4.0) {
      return { label: 'Desempeño Alto', bg: 'bg-blue-50 text-blue-800 border-blue-300' };
    }
    if (val >= 3.0) {
      return { label: 'Desempeño Básico', bg: 'bg-amber-50 text-amber-800 border-amber-300' };
    }
    return { label: 'Desempeño Bajo (Requiere Refuerzo)', bg: 'bg-rose-50 text-rose-800 border-rose-300' };
  };

  const uniqueSubjects = ['Todas', ...new Set(submissions.map(s => s.materiaNombre).filter(Boolean))];

  return (
    <div className={`flex-1 ${sidebarOpen ? 'md:ml-72' : 'md:ml-0'} p-4 sm:p-6 md:p-8 overflow-y-auto z-10 relative pt-20 md:pt-24 transition-all duration-300`}>
      
      {/* Header Banner */}
      <header className="mb-6 md:mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-extrabold uppercase px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-200 tracking-wider flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-700" />
                <span>Historial de Evaluaciones & Retroalimentación</span>
              </span>
            </div>
            <h1 className="font-display font-black text-2xl sm:text-3xl md:text-4xl text-slate-900 tracking-tight">
              Trabajos Calificados
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
              Revisa la nota final asignada por tus docentes junto con las anotaciones pedagógicas detalladas sobre qué aspectos destacaste y cuáles debes mejorar en tus próximos entregables.
            </p>
          </div>

          {/* Average Badge Card */}
          <div className="flex items-center gap-4 bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-slate-200 shadow-sm self-start sm:self-auto">
            <div>
              <span className="text-[10px] font-extrabold uppercase text-slate-400 block tracking-wider">
                Promedio de Entregas
              </span>
              <div className="text-2xl sm:text-3xl font-display font-black text-primary leading-tight mt-0.5">
                {averageGrade} <span className="text-xs font-normal text-slate-400">/ 5.0</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
        </div>

        {/* Toolbar & Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6 bg-white/70 backdrop-blur-md p-3 rounded-2xl border border-slate-200">
          
          {/* Subject Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400 ml-2" />
            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="w-full bg-transparent text-xs sm:text-sm font-semibold text-slate-800 outline-none cursor-pointer"
            >
              {uniqueSubjects.map((sub) => (
                <option key={sub} value={sub}>
                  {sub === 'Todas' ? 'Todas las Materias' : sub}
                </option>
              ))}
            </select>
          </div>

          {/* Search Input */}
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-slate-400 ml-2" />
            <input
              type="text"
              placeholder="Buscar trabajo o docente..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-xs sm:text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400"
            />
          </div>

        </div>
      </header>

      {/* Main List of Graded Assignments */}
      {loading ? (
        <div className="text-center py-16 bg-white/80 rounded-2xl border border-slate-200">
          <Award className="w-10 h-10 text-primary animate-pulse mx-auto mb-2" />
          <span className="text-xs font-bold text-slate-600">Cargando trabajos calificados...</span>
        </div>
      ) : filteredGraded.length === 0 ? (
        <div className="text-center py-16 bg-white/80 rounded-2xl border border-slate-200 max-w-2xl mx-auto">
          <Inbox className="w-12 h-12 text-slate-300 mx-auto mb-2" />
          <h4 className="font-display font-bold text-base text-slate-700">Aún no tienes trabajos calificados</h4>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            Cuando envíes una tarea desde el apartado de "Entrega de Tareas" y tu profesor la revise en su buzón, aquí aparecerá tu nota y sus anotaciones de mejora.
          </p>
        </div>
      ) : (
        <div className="space-y-5 max-w-4xl">
          {filteredGraded.map((item) => {
            const perf = getPerformanceBadge(item.nota);
            return (
              <div 
                key={item.id} 
                className="bg-white/90 backdrop-blur-md rounded-3xl p-5 sm:p-7 border border-slate-200/90 shadow-sm space-y-4 hover:shadow-md transition-all"
              >
                
                {/* Header Row: Subject, Title & Score Badge */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200 tracking-wider">
                        {item.materiaNombre}
                      </span>
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${perf.bg}`}>
                        {perf.label}
                      </span>
                    </div>

                    <h3 className="font-display font-black text-lg sm:text-xl text-slate-900 leading-tight">
                      {item.titulo}
                    </h3>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                      <span className="flex items-center gap-1 font-semibold text-slate-700">
                        <UserCheck className="w-3.5 h-3.5 text-primary" />
                        <span>Calificado por: {item.docenteNombre || 'Docente de Área'}</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{new Date(item.fechaCalificacion || item.fechaEntrega).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                      </span>
                    </div>
                  </div>

                  {/* Big Score Box */}
                  <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-50/80 to-white border-2 border-amber-300 shadow-xs text-center min-w-28 flex-shrink-0 self-start sm:self-auto">
                    <span className="text-[10px] font-extrabold uppercase text-slate-500 block tracking-wider">
                      Nota Obtenida
                    </span>
                    <div className="text-3xl font-display font-black text-primary leading-tight mt-0.5">
                      {parseFloat(item.nota).toFixed(1)}
                    </div>
                    <span className="text-[10px] font-bold text-slate-400">Escala 1.0 - 5.0</span>
                  </div>
                </div>

                {/* Teacher Feedback / Annotations (Lo que realizó el profesor para saber qué mejorar o qué faltó) */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50/70 via-white to-amber-50/40 border border-amber-200/90 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-primary" />
                    <h5 className="font-bold text-xs uppercase tracking-wider text-primary">
                      Anotaciones y Observaciones del Docente
                    </h5>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium pl-6">
                    {item.anotacionesDocente || 'El docente no añadió observaciones adicionales para esta entrega.'}
                  </p>
                </div>

                {/* Delivery Attachment Footer */}
                {item.archivo && (
                  <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 text-slate-600">
                      <FileText className="w-4 h-4 text-primary" />
                      <span>Archivo entregado: <strong className="text-slate-800">{item.archivo.nombre}</strong> ({item.archivo.tamanoMb} MB)</span>
                    </div>

                    <a
                      href={`#descargar-${item.archivo.nombre}`}
                      onClick={(e) => {
                        e.preventDefault();
                        alert(`Descargando copia de tu entrega: ${item.archivo.nombre}`);
                      }}
                      className="inline-flex items-center gap-1.5 text-primary hover:text-primary/80 font-bold hover:underline"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Descargar mi entrega</span>
                    </a>
                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
