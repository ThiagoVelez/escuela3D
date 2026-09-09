import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { submitHomework } from '../services/api';
import { 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Send, 
  Paperclip, 
  FileSpreadsheet, 
  FileCode, 
  Image as ImageIcon, 
  Archive, 
  X, 
  BookOpen, 
  User, 
  Check, 
  Clock, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

const MATERIAS_LIST = [
  { id: 2, nombre: 'Biología 3D', docente: 'Dra. Valentina Ríos' },
  { id: 1, nombre: 'Matemáticas 3D', docente: 'Ing. Alejandro Torres' },
  { id: 3, nombre: 'Literatura Colombiana', docente: 'Prof. Gabriel Mendoza' },
  { id: 4, nombre: 'Química 3D', docente: 'Dra. María Victoria Gómez' },
  { id: 5, nombre: 'Informática 3D', docente: 'Ing. Luis Fernando Ruiz' }
];

export default function StudentTaskUploadPage() {
  const { user, sidebarOpen, addNotification, setActiveTab, notifySubmissionsUpdated } = useAuth();

  const [materiaId, setMateriaId] = useState('2');
  const [tipo, setTipo] = useState('TALLER');
  const [titulo, setTitulo] = useState('');
  const [comentarios, setComentarios] = useState('');
  
  // File Upload State (Up to 500 MB)
  const [fileData, setFileData] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [fileError, setFileError] = useState('');

  // Submit states
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    setFileError('');
    if (!file) return;

    // Check 500 MB limit (500 * 1024 * 1024 bytes = 524,288,000 bytes)
    const maxBytes = 500 * 1024 * 1024;
    if (file.size > maxBytes) {
      setFileError('El archivo excede el límite máximo permitido de 500 MB.');
      return;
    }

    const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
    
    // Simulate reading / staging file with progressive upload feedback
    setIsUploading(true);
    setUploadProgress(15);
    
    setTimeout(() => setUploadProgress(45), 250);
    setTimeout(() => setUploadProgress(85), 550);
    setTimeout(() => {
      setUploadProgress(100);
      setIsUploading(false);
      setFileData({
        nombre: file.name,
        tamanoMb: parseFloat(sizeMb),
        tipo: file.type || 'application/octet-stream',
        sizeFormatted: `${sizeMb} MB`
      });
    }, 850);
  };

  const handleRemoveFile = () => {
    setFileData(null);
    setUploadProgress(0);
  };

  const getFileIcon = (mimeType = '', name = '') => {
    if (mimeType.includes('pdf')) return <FileText className="w-8 h-8 text-rose-500" />;
    if (mimeType.includes('sheet') || mimeType.includes('excel') || name.endsWith('.xlsx') || name.endsWith('.csv')) {
      return <FileSpreadsheet className="w-8 h-8 text-emerald-600" />;
    }
    if (mimeType.startsWith('image/')) return <ImageIcon className="w-8 h-8 text-blue-500" />;
    if (mimeType.includes('zip') || mimeType.includes('rar') || name.endsWith('.zip')) {
      return <Archive className="w-8 h-8 text-amber-500" />;
    }
    return <FileCode className="w-8 h-8 text-primary" />;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fileData) {
      setFileError('Debes adjuntar al menos un archivo (documento, hoja de cálculo o imagen) para completar la entrega.');
      return;
    }

    setSubmitting(true);
    const selectedMat = MATERIAS_LIST.find(m => String(m.id) === String(materiaId)) || MATERIAS_LIST[0];

    const payload = {
      assignmentId: Date.now(),
      materiaId: parseInt(materiaId),
      materiaNombre: selectedMat.nombre,
      titulo: titulo.trim() || `Entrega de ${tipo} - ${selectedMat.nombre}`,
      tipo,
      estudianteId: user?.id || 1,
      estudianteNombre: user?.nombre || 'Mateo Gómez',
      estudianteEmail: user?.email || 'estudiante@educol.edu.co',
      grado: user?.grado || '10° A',
      jornada: user?.jornada || 'Mañana',
      comentariosEstudiante: comentarios.trim(),
      archivo: {
        nombre: fileData.nombre,
        tamanoMb: fileData.tamanoMb,
        tipo: fileData.tipo,
        url: ''
      }
    };

    await submitHomework(payload);
    if (notifySubmissionsUpdated) notifySubmissionsUpdated();

    if (addNotification) {
      addNotification({
        title: 'Nueva Tarea en el Correo de Tareas',
        text: `El estudiante ${user?.nombre || 'Mateo Gómez'} (${user?.grado || '10° A'}) envió "${payload.titulo}" (${fileData.sizeFormatted}).`,
        icon: 'mail',
        color: 'text-primary',
        targetRole: 'DOCENTE'
      });
    }

    setSubmitting(false);
    setSubmitSuccess(true);
  };

  return (
    <div className={`flex-1 ${sidebarOpen ? 'md:ml-72' : 'md:ml-0'} p-4 sm:p-6 md:p-8 overflow-y-auto z-10 relative pt-20 md:pt-24 transition-all duration-300`}>
      
      {/* Header Banner */}
      <header className="mb-6 md:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-extrabold uppercase px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-200 tracking-wider flex items-center gap-1.5">
                <UploadCloud className="w-3.5 h-3.5 text-amber-700" />
                <span>Buzón de Entregas Digitales</span>
              </span>
            </div>
            <h1 className="font-display font-black text-2xl sm:text-3xl md:text-4xl text-slate-900 tracking-tight">
              Entrega de Tareas & Trabajos
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
              Carga tus documentos, hojas de cálculo de Excel, archivos de texto, imágenes o proyectos comprimidos de hasta 500 MB. Al enviar, el profesor recibirá tu entrega en su Correo de Tareas para revisarla y calificarte.
            </p>
          </div>

          <button
            onClick={() => setActiveTab('graded-tasks')}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all self-start sm:self-auto"
          >
            <span>Ver Trabajos Calificados</span>
            <ArrowRight className="w-4 h-4 text-primary" />
          </button>
        </div>
      </header>

      {/* SUCCESS MODAL / CARD */}
      {submitSuccess ? (
        <div className="max-w-2xl mx-auto bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-emerald-200 shadow-xl text-center space-y-5 animate-fadeIn">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-8 h-8 text-emerald-600" />
          </div>

          <div>
            <span className="text-[11px] font-extrabold uppercase px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 tracking-wider inline-block mb-2">
              Envío Confirmado
            </span>
            <h2 className="font-display font-black text-xl sm:text-2xl text-slate-900">
              ¡Trabajo Entregado Exitosamente!
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-md mx-auto leading-relaxed">
              Tu archivo <strong>{fileData?.nombre}</strong> ({fileData?.sizeFormatted}) ha sido transferido al Correo de Tareas de tu docente con la información de tu grado y jornada.
            </p>
          </div>

          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 text-left max-w-md mx-auto space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">Estudiante:</span>
              <strong className="text-slate-800">{user?.nombre}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">Grado y Jornada:</span>
              <strong className="text-slate-800">{user?.grado} • {user?.jornada}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">Asignatura:</span>
              <strong className="text-primary">{MATERIAS_LIST.find(m => String(m.id) === String(materiaId))?.nombre}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">Estado:</span>
              <span className="font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">Pendiente de Calificación</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <button
              onClick={() => {
                setSubmitSuccess(false);
                setTitulo('');
                setComentarios('');
                setFileData(null);
                setUploadProgress(0);
              }}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
            >
              Hacer Otra Entrega
            </button>
            <button
              onClick={() => setActiveTab('graded-tasks')}
              className="px-5 py-2.5 bg-primary text-white font-bold text-xs rounded-xl shadow-md hover:bg-primary/95 transition-all"
            >
              Ir a Trabajos Calificados
            </button>
          </div>
        </div>
      ) : (
        /* SUBMISSION FORM */
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-6xl">
          
          {/* Left Column: Form Details (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white/85 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-sm space-y-4">
              <h3 className="font-display font-bold text-base sm:text-lg text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                <FileText className="w-5 h-5 text-primary" />
                <span>Datos de la Asignación</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Subject Selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                    Materia / Asignatura
                  </label>
                  <select
                    value={materiaId}
                    onChange={(e) => setMateriaId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-primary/40"
                  >
                    {MATERIAS_LIST.map((mat) => (
                      <option key={mat.id} value={mat.id}>
                        {mat.nombre} ({mat.docente})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Task Type */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                    Tipo de Trabajo
                  </label>
                  <select
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-primary/40"
                  >
                    <option value="TALLER">Taller Práctico / Guía</option>
                    <option value="ENSAYO">Ensayo o Documento Escrito</option>
                    <option value="EXCEL">Hoja de Cálculo / Datos</option>
                    <option value="PROYECTO">Proyecto de Laboratorio</option>
                    <option value="EVALUACION">Cuestionario / Evaluación</option>
                  </select>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                  Título del Trabajo o Actividad
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Informe de Laboratorio sobre Células Andinas"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-primary/40 placeholder:text-slate-400"
                />
              </div>

              {/* Comments */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                  Comentarios o Mensaje para el Docente
                </label>
                <textarea
                  rows={3}
                  placeholder="Escribe aclaraciones sobre tu entrega, dudas puntuales o detalles del procedimiento..."
                  value={comentarios}
                  onChange={(e) => setComentarios(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs sm:text-sm font-medium text-slate-800 outline-none focus:ring-2 focus:ring-primary/40 placeholder:text-slate-400 leading-relaxed"
                />
              </div>

              {/* File Uploader Zone */}
              <div className="pt-2">
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2 flex items-center justify-between">
                  <span>Adjuntar Archivo de Trabajo</span>
                  <span className="text-[10px] font-bold text-primary bg-amber-100/70 px-2 py-0.5 rounded-full">
                    Soporta hasta 500 MB
                  </span>
                </label>

                {!fileData ? (
                  <div className="border-2 border-dashed border-slate-300 hover:border-primary rounded-2xl p-6 sm:p-8 text-center transition-all bg-slate-50/70 hover:bg-white group cursor-pointer relative">
                    <input
                      type="file"
                      onChange={handleFileSelect}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                    />
                    <div className="w-14 h-14 rounded-2xl bg-amber-100/80 text-primary flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform shadow-xs">
                      <Paperclip className="w-6 h-6" />
                    </div>
                    <p className="text-xs sm:text-sm font-bold text-slate-800 mb-1">
                      {isUploading ? 'Procesando archivo...' : 'Haz clic o arrastra tu archivo aquí'}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Documentos (PDF, Word, Excel, TXT), imágenes de evidencia o archivos comprimidos ZIP
                    </p>

                    {isUploading && (
                      <div className="w-full bg-slate-200 h-2 rounded-full mt-4 overflow-hidden">
                        <div 
                          className="bg-primary h-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl border-2 border-amber-300/80 bg-amber-50/50 flex items-center justify-between gap-3 animate-fadeIn">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2 rounded-xl bg-white shadow-xs">
                        {getFileIcon(fileData.tipo, fileData.nombre)}
                      </div>
                      <div className="min-w-0">
                        <h5 className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                          {fileData.nombre}
                        </h5>
                        <span className="text-[11px] font-semibold text-slate-500 block">
                          Tamaño: <strong>{fileData.sizeFormatted}</strong> • Tipo: {fileData.tipo.split('/')[1] || 'Documento'}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                      title="Quitar archivo"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {fileError && (
                  <div className="flex items-center gap-2 mt-2 text-rose-700 bg-rose-50 border border-rose-200 p-2.5 rounded-xl text-xs font-bold">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{fileError}</span>
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* Right Column: Submission Summary & Submit Button (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Student Info Card */}
            <div className="bg-white/85 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-sm space-y-4">
              <h4 className="font-display font-bold text-sm sm:text-base text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                <User className="w-4 h-4 text-primary" />
                <span>Información del Remitente</span>
              </h4>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Estudiante:</span>
                  <strong className="text-slate-900">{user?.nombre || 'Mateo Gómez'}</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Correo Institucional:</span>
                  <span className="text-primary font-bold">{user?.email || 'estudiante@educol.edu.co'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Grado Asignado:</span>
                  <strong className="text-slate-900">{user?.grado || '10° A'}</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Jornada Escolar:</span>
                  <strong className="text-slate-900">{user?.jornada || 'Mañana'}</strong>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500 font-medium">Docente Receptor:</span>
                  <strong className="text-slate-900">{MATERIAS_LIST.find(m => String(m.id) === String(materiaId))?.docente}</strong>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 leading-relaxed">
                Al enviar, tu docente recibirá una alerta inmediata y podrá descargar tu archivo para calificarlo.
              </div>

              <button
                type="submit"
                disabled={submitting || isUploading}
                className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-white font-bold text-xs sm:text-sm rounded-xl shadow-md hover:bg-primary/95 active:scale-95 transition-all disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{submitting ? 'Enviando Trabajo...' : 'Enviar Trabajo al Docente'}</span>
              </button>
            </div>

          </div>

        </form>
      )}

    </div>
  );
}
