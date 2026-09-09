import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchSubmissions, gradeSubmission } from '../services/api';
import { cleanText } from '../utils/textSanitizer';
import { downloadSubmissionFile } from '../utils/fileDownloader';
import { 
  Mail, 
  Inbox, 
  Filter, 
  Search, 
  CheckCircle2, 
  Clock, 
  FileText, 
  FileSpreadsheet, 
  ImageIcon, 
  Archive, 
  Download, 
  Send, 
  User, 
  Award, 
  AlertCircle, 
  X, 
  Check, 
  MessageSquare, 
  RefreshCw,
  Sparkles,
  BookOpen
} from 'lucide-react';

export default function TeacherTaskMailPage() {
  const { user, sidebarOpen, addNotification, submissionsRefreshKey, notifySubmissionsUpdated } = useAuth();

  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [selectedGrade, setSelectedGrade] = useState('Todos');
  const [selectedStatus, setSelectedStatus] = useState('TODOS'); // 'TODOS', 'PENDIENTE', 'CALIFICADO'
  const [searchQuery, setSearchQuery] = useState('');

  // Grading Modal / Drawer
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [gradeInput, setGradeInput] = useState('5.0');
  const [feedbackInput, setFeedbackInput] = useState('');
  const [submittingGrade, setSubmittingGrade] = useState(false);
  const [gradeSuccessToast, setGradeSuccessToast] = useState(false);

  useEffect(() => {
    loadSubmissionsList();
  }, [submissionsRefreshKey, selectedGrade, selectedStatus]);

  const loadSubmissionsList = async () => {
    setLoading(true);
    const data = await fetchSubmissions({
      grado: selectedGrade,
      estado: selectedStatus
    });
    setSubmissions(data || []);
    setLoading(false);
  };

  const handleOpenGradeModal = (sub) => {
    setSelectedSubmission(sub);
    setGradeInput(sub.nota ? String(sub.nota) : '5.0');
    setFeedbackInput(sub.anotacionesDocente || '');
  };

  const handleSendGrade = async (e) => {
    e.preventDefault();
    if (!selectedSubmission) return;

    const parsedNota = parseFloat(gradeInput);
    if (isNaN(parsedNota) || parsedNota < 1.0 || parsedNota > 5.0) {
      alert('La nota debe ser un valor numérico válido entre 1.0 y 5.0.');
      return;
    }

    setSubmittingGrade(true);
    const payload = {
      nota: parsedNota,
      anotacionesDocente: feedbackInput.trim() || 'Trabajo revisado y calificado satisfactoriamente.',
      docenteNombre: user?.nombre || 'Docente Evaluador'
    };

    await gradeSubmission(selectedSubmission.id, payload);
    if (notifySubmissionsUpdated) notifySubmissionsUpdated();

    if (addNotification) {
      addNotification({
        title: 'Calificación Publicada',
        text: `Tu docente ${user?.nombre || 'Docente'} calificó tu trabajo "${selectedSubmission.titulo}" con una nota de ${parsedNota.toFixed(1)}.`,
        icon: 'grade',
        color: 'text-emerald-600',
        targetRole: 'ESTUDIANTE'
      });
    }

    setSubmittingGrade(false);
    setGradeSuccessToast(true);
    setTimeout(() => {
      setGradeSuccessToast(false);
      setSelectedSubmission(null);
      loadSubmissionsList();
    }, 1200);
  };

  const filteredList = submissions.filter((item) => {
    const query = searchQuery.toLowerCase();
    const estName = cleanText(item.estudianteNombre || '').toLowerCase();
    const tit = cleanText(item.titulo || '').toLowerCase();
    const mat = cleanText(item.materiaNombre || '').toLowerCase();
    const grd = cleanText(item.grado || '').toLowerCase();
    return estName.includes(query) || tit.includes(query) || mat.includes(query) || grd.includes(query);
  });

  const pendingCount = submissions.filter(s => s.estado === 'PENDIENTE').length;
  const gradedCount = submissions.filter(s => s.estado === 'CALIFICADO').length;

  const getFileIcon = (mimeType = '', name = '') => {
    if (mimeType.includes('pdf')) return <FileText className="w-5 h-5 text-rose-500" />;
    if (mimeType.includes('sheet') || mimeType.includes('excel') || name.endsWith('.xlsx')) return <FileSpreadsheet className="w-5 h-5 text-emerald-600" />;
    if (mimeType.startsWith('image/')) return <ImageIcon className="w-5 h-5 text-blue-500" />;
    if (mimeType.includes('zip') || mimeType.includes('rar')) return <Archive className="w-5 h-5 text-amber-500" />;
    return <FileText className="w-5 h-5 text-primary" />;
  };

  return (
    <div className={`flex-1 ${sidebarOpen ? 'md:ml-72' : 'md:ml-0'} p-4 sm:p-6 md:p-8 overflow-y-auto z-10 relative pt-20 md:pt-24 transition-all duration-300`}>
      
      {/* Header Banner */}
      <header className="mb-6 md:mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-extrabold uppercase px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-200 tracking-wider flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-amber-700" />
                <span>Gestión de Entregas & Calificaciones Docente</span>
              </span>
            </div>
            <h1 className="font-display font-black text-2xl sm:text-3xl md:text-4xl text-slate-900 tracking-tight">
              Correo de Tareas
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
              Buzón de recepción de trabajos, talleres y proyectos enviados por los estudiantes. Filtra por grado escolar, descarga o revisa los archivos adjuntos, asigna la nota y envía observaciones de mejora que llegarán de inmediato a la sección de Trabajos Calificados del estudiante.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-amber-50 border border-amber-200 rounded-2xl text-center shadow-xs">
              <span className="text-[10px] font-extrabold text-amber-800 uppercase block">Pendientes</span>
              <span className="text-lg font-black text-amber-900 leading-tight">{pendingCount}</span>
            </div>
            <div className="px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-2xl text-center shadow-xs">
              <span className="text-[10px] font-extrabold text-emerald-800 uppercase block">Calificados</span>
              <span className="text-lg font-black text-emerald-900 leading-tight">{gradedCount}</span>
            </div>
          </div>
        </div>

        {/* Filters Toolbar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 bg-white/70 backdrop-blur-md p-3 rounded-2xl border border-slate-200">
          
          {/* Grade Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400 ml-2" />
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="w-full bg-transparent text-xs sm:text-sm font-semibold text-slate-800 outline-none cursor-pointer"
            >
              <option value="Todos">Todos los Grados</option>
              <option value="10° A">Grado 10° A</option>
              <option value="10° B">Grado 10° B</option>
              <option value="11° A">Grado 11° A</option>
              <option value="11° B">Grado 11° B</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase ml-2">Estado:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-transparent text-xs sm:text-sm font-semibold text-slate-800 outline-none cursor-pointer"
            >
              <option value="TODOS">Todas las Entregas</option>
              <option value="PENDIENTE">Sólo Pendientes por Calificar</option>
              <option value="CALIFICADO">Sólo Calificados</option>
            </select>
          </div>

          {/* Search Query */}
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-slate-400 ml-2" />
            <input
              type="text"
              placeholder="Buscar estudiante o trabajo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-xs sm:text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400"
            />
          </div>

        </div>
      </header>

      {/* Submissions Table / Cards */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-16 bg-white/80 rounded-2xl border border-slate-200">
            <RefreshCw className="w-8 h-8 text-primary animate-spin mx-auto mb-2" />
            <span className="text-xs font-bold text-slate-500">Cargando buzón de tareas...</span>
          </div>
        ) : filteredList.length === 0 ? (
          <div className="text-center py-16 bg-white/80 rounded-2xl border border-slate-200">
            <Inbox className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <h4 className="font-display font-bold text-base text-slate-700">No hay entregas registradas</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              No se encontraron entregas que coincidan con los filtros de grado o estado seleccionados.
            </p>
          </div>
        ) : (
          <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="w-full">
              <table className="w-full text-left border-collapse table-auto">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[10px] sm:text-[11px] font-extrabold uppercase text-slate-600 tracking-wider">
                    <th className="py-2.5 px-3">Estudiante</th>
                    <th className="py-2.5 px-2">Grado & Materia</th>
                    <th className="py-2.5 px-3">Trabajo Entregado</th>
                    <th className="py-2.5 px-2">Archivo</th>
                    <th className="py-2.5 px-2">Estado</th>
                    <th className="py-2.5 px-3 text-center">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredList.map((item) => {
                    const isGraded = item.estado === 'CALIFICADO';
                    return (
                      <tr key={item.id} className="hover:bg-amber-50/40 transition-colors">
                        
                        {/* Student */}
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black text-xs flex-shrink-0">
                              {item.estudianteNombre?.charAt(0) || 'E'}
                            </div>
                            <div className="min-w-0">
                              <strong className="text-slate-900 block font-bold text-xs truncate max-w-[130px]">
                                {cleanText(item.estudianteNombre)}
                              </strong>
                              <span className="text-[10px] text-slate-400 block truncate max-w-[130px]">
                                {cleanText(item.estudianteEmail)}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Grade & Subject */}
                        <td className="py-2.5 px-2">
                          <span className="font-black text-slate-800 text-[10px] px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 mr-1 inline-block">
                            {cleanText(item.grado)}
                          </span>
                          <span className="text-[11px] font-semibold text-slate-600 block truncate max-w-[120px] mt-0.5">
                            {cleanText(item.materiaNombre)}
                          </span>
                        </td>

                        {/* Assignment Title */}
                        <td className="py-2.5 px-3">
                          <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-900 border border-amber-200 tracking-wider inline-block">
                            {item.tipo}
                          </span>
                          <h5 className="font-bold text-xs text-slate-900 truncate max-w-[170px] leading-tight mt-0.5">
                            {cleanText(item.titulo)}
                          </h5>
                          <span className="text-[9px] text-slate-400 block mt-0.5">
                            {new Date(item.fechaEntrega).toLocaleDateString('es-CO', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </td>

                        {/* File Attachment */}
                        <td className="py-2.5 px-2">
                          {item.archivo ? (
                            <button
                              type="button"
                              onClick={() => downloadSubmissionFile(item.archivo, item)}
                              className="flex items-center gap-1.5 p-1 px-2 rounded-lg bg-slate-50 hover:bg-amber-100/70 border border-slate-200/80 transition-all text-left group max-w-[140px]"
                              title="Haz clic para descargar este archivo entregado"
                            >
                              <div className="flex-shrink-0">
                                {getFileIcon(item.archivo.tipo, item.archivo.nombre)}
                              </div>
                              <div className="min-w-0 flex-1">
                                <span className="text-[11px] font-bold text-slate-800 truncate block group-hover:text-primary">
                                  {item.archivo.nombre}
                                </span>
                                <span className="text-[9px] text-slate-400 block font-medium">
                                  {item.archivo.tamanoMb} MB
                                </span>
                              </div>
                            </button>
                          ) : (
                            <span className="text-slate-400 italic text-[11px]">Sin archivo</span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="py-2.5 px-2">
                          {isGraded ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold whitespace-nowrap">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>{parseFloat(item.nota).toFixed(1)} / 5.0</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold whitespace-nowrap">
                              <Clock className="w-3 h-3 text-amber-600" />
                              <span>Pendiente</span>
                            </span>
                          )}
                        </td>

                        {/* Action */}
                        <td className="py-2.5 px-3 text-center">
                          <button
                            onClick={() => handleOpenGradeModal(item)}
                            className={`px-2.5 py-1 font-bold text-[11px] rounded-lg shadow-xs transition-all whitespace-nowrap ${
                              isGraded
                                ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                : 'bg-primary text-white hover:bg-primary/95 shadow-xs active:scale-95'
                            }`}
                          >
                            {isGraded ? 'Ver / Modificar' : 'Calificar'}
                          </button>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* REVIEW & GRADING MODAL */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-slate-200 animate-fadeIn space-y-5 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200 tracking-wider inline-block mb-1">
                  Revisión Académica • {cleanText(selectedSubmission.grado)}
                </span>
                <h3 className="font-display font-black text-xl text-slate-900 leading-tight">
                  {cleanText(selectedSubmission.titulo)}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Estudiante: <strong className="text-slate-800">{cleanText(selectedSubmission.estudianteNombre)}</strong> ({cleanText(selectedSubmission.estudianteEmail)})
                </p>
              </div>

              <button
                onClick={() => setSelectedSubmission(null)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Submission Details & Comments */}
            <div className="space-y-3">
              {selectedSubmission.comentariosEstudiante && (
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
                  <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1">
                    Comentarios del Estudiante:
                  </span>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                    "{cleanText(selectedSubmission.comentariosEstudiante)}"
                  </p>
                </div>
              )}

              {/* Attached File Preview Card with Authentic Download */}
              {selectedSubmission.archivo && (
                <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/90 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2.5 rounded-xl bg-white shadow-xs">
                      {getFileIcon(selectedSubmission.archivo.tipo, selectedSubmission.archivo.nombre)}
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-slate-900 block truncate">
                        {selectedSubmission.archivo.nombre}
                      </span>
                      <span className="text-[11px] text-slate-500 block">
                        Tamaño: <strong>{selectedSubmission.archivo.tamanoMb} MB</strong>
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => downloadSubmissionFile(selectedSubmission.archivo, selectedSubmission)}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-amber-100/80 text-primary border border-slate-200 font-bold text-xs rounded-xl shadow-xs transition-all flex-shrink-0"
                    title="Descargar archivo en tu equipo"
                  >
                    <Download className="w-4 h-4" />
                    <span>Descargar Archivo</span>
                  </button>
                </div>
              )}
            </div>

            {/* Grading Form */}
            <form onSubmit={handleSendGrade} className="space-y-4 pt-2 border-t border-slate-100">
              <h4 className="font-display font-bold text-sm sm:text-base text-slate-900 flex items-center gap-2">
                <Award className="w-4 h-4 text-primary" />
                <span>Calificación & Retroalimentación Pedagógica</span>
              </h4>

              {/* Score Input & Quick Preset Buttons */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                  Nota Numérica (Escala 1.0 a 5.0)
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    type="number"
                    step="0.1"
                    min="1.0"
                    max="5.0"
                    required
                    value={gradeInput}
                    onChange={(e) => setGradeInput(e.target.value)}
                    className="w-28 bg-slate-50 border-2 border-primary/40 focus:border-primary rounded-xl px-3.5 py-2 text-base font-black text-primary outline-none text-center shadow-xs"
                  />
                  <div className="flex gap-1.5">
                    {['5.0', '4.5', '4.0', '3.5', '3.0'].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setGradeInput(val)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                          gradeInput === val
                            ? 'bg-primary text-white border-primary'
                            : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Feedback Textarea (Anotaciones de mejora) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                  Anotaciones, Observaciones & Oportunidades de Mejora
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Detalla lo que el estudiante realizó bien, los puntos que le faltaron y recomendaciones precisas para enriquecer su aprendizaje..."
                  value={feedbackInput}
                  onChange={(e) => setFeedbackInput(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs sm:text-sm text-slate-800 font-medium outline-none focus:ring-2 focus:ring-primary/40 leading-relaxed placeholder:text-slate-400 resize-y"
                />
              </div>

              {/* Success Toast Inside Modal */}
              {gradeSuccessToast && (
                <div className="flex items-center gap-2 text-emerald-800 bg-emerald-50 border border-emerald-300 p-3 rounded-xl text-xs font-bold animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Nota y anotaciones enviadas exitosamente al estudiante.</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedSubmission(null)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={submittingGrade}
                  className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white font-bold text-xs sm:text-sm rounded-xl shadow-md hover:bg-primary/95 active:scale-95 transition-all disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{submittingGrade ? 'Guardando...' : 'Enviar Nota'}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
