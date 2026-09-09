import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchAssignments, submitAssignment } from '../services/api';
import { 
  CheckSquare, 
  Clock, 
  Send, 
  CheckCircle2, 
  X, 
  AlertCircle, 
  BookOpen, 
  Filter, 
  Search, 
  Award,
  Calendar,
  User
} from 'lucide-react';

export default function StudentAssignmentsPage() {
  const { user, sidebarOpen, addNotification } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [filterStatus, setFilterStatus] = useState('TODOS'); // 'TODOS', 'PENDIENTE', 'ENTREGADO'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissionText, setSubmissionText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedMessage, setSubmittedMessage] = useState(false);

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    const data = await fetchAssignments(null, user?.grado);
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

  const filteredAssignments = assignments.filter((item) => {
    const matchesSearch = item.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.descripcion.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (item.subjectTitle && item.subjectTitle.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (!matchesSearch) return false;

    if (filterStatus === 'PENDIENTE') {
      return item.estadoEstudiante !== 'Entregado';
    }
    if (filterStatus === 'ENTREGADO') {
      return item.estadoEstudiante === 'Entregado';
    }
    return true;
  });

  const pendingCount = assignments.filter(a => a.estadoEstudiante !== 'Entregado').length;
  const completedCount = assignments.filter(a => a.estadoEstudiante === 'Entregado').length;

  return (
    <div className={`flex-1 ${sidebarOpen ? 'md:ml-72' : 'md:ml-0'} p-4 sm:p-6 md:p-8 overflow-y-auto z-10 relative pt-20 md:pt-24 transition-all duration-300`}>
      
      {/* Header Banner */}
      <header className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-extrabold uppercase px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-200 tracking-wider flex items-center gap-1.5">
                <CheckSquare className="w-3.5 h-3.5 text-amber-700" />
                <span>Gestión Académica de Entregas</span>
              </span>
            </div>
            <h1 className="font-display font-black text-2xl sm:text-3xl md:text-4xl text-slate-900 tracking-tight">
              Trabajos, Talleres & Evaluaciones
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
              Consulta y realiza las entregas asignadas por tus docentes de cátedra. Monitorea fechas límite y estado de entrega.
            </p>
          </div>

          {/* Quick Summary Badges */}
          <div className="flex items-center gap-3">
            <div className="bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Pendientes</div>
                <div className="text-sm font-black text-slate-900">{pendingCount} Tareas</div>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Entregadas</div>
                <div className="text-sm font-black text-emerald-700">{completedCount} Tareas</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs mb-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setFilterStatus('TODOS')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterStatus === 'TODOS'
                ? 'bg-primary text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Todas ({assignments.length})
          </button>
          <button
            onClick={() => setFilterStatus('PENDIENTE')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterStatus === 'PENDIENTE'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Pendientes ({pendingCount})
          </button>
          <button
            onClick={() => setFilterStatus('ENTREGADO')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterStatus === 'ENTREGADO'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Entregadas ({completedCount})
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar tarea, tema o materia..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-800 outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Assignments List Grid */}
      {filteredAssignments.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 shadow-xs space-y-3">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
          <h3 className="font-display font-bold text-base text-slate-900">
            No tienes tareas pendientes en esta categoría
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Todas tus actividades académicas se encuentran al día o no coinciden con los filtros aplicados.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredAssignments.map((item) => {
            const isCompleted = item.estadoEstudiante === 'Entregado';
            return (
              <div 
                key={item.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Subject Tag & Status */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-200">
                      {item.subjectTitle || 'CÁTEDRA'} • {item.tipo || 'TALLER'}
                    </span>

                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isCompleted 
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : 'bg-amber-100 text-amber-900 border border-amber-200'
                    }`}>
                      {isCompleted ? 'Entregado' : 'Pendiente'}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-display font-bold text-base text-slate-900 mb-1.5 group-hover:text-primary transition-colors leading-snug">
                    {item.titulo}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-3 mb-4 leading-relaxed">
                    {item.descripcion}
                  </p>
                </div>

                {/* Footer Metadata & Submission Button */}
                <div className="pt-3 border-t border-slate-100 space-y-2 mt-auto">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <div className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate max-w-[130px]">{item.docenteNombre || 'Docente Titular'}</span>
                    </div>
                    <div className="flex items-center gap-1 font-semibold text-slate-700">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{item.fechaLimite || 'Sin límite'}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedAssignment(item)}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-2 transition-all ${
                      isCompleted
                        ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : 'bg-primary text-white hover:bg-primary/90'
                    }`}
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isCompleted ? 'Ver Entrega Enviada' : 'Realizar Entrega'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* SUBMISSION MODAL */}
      {selectedAssignment && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 pt-24 md:pt-28 pb-8 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-2xl relative my-auto border border-slate-200">
            <button
              onClick={() => setSelectedAssignment(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center justify-center transition-colors z-10"
              title="Cerrar modal"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-200 font-extrabold text-[10px] inline-block mb-2">
              {selectedAssignment.subjectTitle} • {selectedAssignment.tipo}
            </span>

            <h3 className="font-display font-bold text-lg md:text-xl text-slate-900 mb-2">
              {selectedAssignment.titulo}
            </h3>
            <p className="text-xs text-slate-600 mb-4 bg-slate-50 p-3 rounded-xl border border-slate-200 leading-relaxed">
              {selectedAssignment.descripcion}
            </p>

            <form onSubmit={handleSubmitWork} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Tu Respuesta o Desarrollo de la Actividad:
                </label>
                <textarea
                  rows="5"
                  value={submissionText}
                  onChange={(e) => setSubmissionText(e.target.value)}
                  placeholder="Redacta la solución del taller o informe de cátedra..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              {submittedMessage && (
                <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 font-bold text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Entrega enviada y registrada con éxito ante el docente.</span>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedAssignment(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 rounded-xl bg-primary text-white font-bold shadow-md hover:bg-primary/90 flex items-center gap-2 transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submitting ? 'Enviando...' : 'Entregar al Docente'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
