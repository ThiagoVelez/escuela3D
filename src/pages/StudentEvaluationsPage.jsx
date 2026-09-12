import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchEvaluations, fetchEvaluationById, submitEvaluationExam } from '../services/api';
import { 
  ClipboardCheck, 
  Clock, 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  BookOpen, 
  Calculator, 
  PenTool, 
  HelpCircle, 
  ChevronRight, 
  Search, 
  Award, 
  Calendar, 
  User, 
  Timer, 
  Check, 
  FileText, 
  Sparkles,
  ArrowLeft,
  X
} from 'lucide-react';
import { cleanText } from '../utils/textSanitizer';

export default function StudentEvaluationsPage() {
  const { user, sidebarOpen, addNotification } = useAuth();
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('TODOS'); // 'TODOS', 'DISPONIBLES', 'ENVIADOS'
  
  // Active Exam Session State
  const [activeExam, setActiveExam] = useState(null);
  const [examAnswers, setExamAnswers] = useState({});
  const [mathScratchpad, setMathScratchpad] = useState({});
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const [isExamStarted, setIsExamStarted] = useState(false);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(null);

  // Local storage cache key for submitted evaluations of this student
  const studentStorageKey = `educol3d_submitted_exams_student_${user?.id || 1}`;
  const [submittedExamIds, setSubmittedExamIds] = useState(() => {
    try {
      const saved = localStorage.getItem(studentStorageKey);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    loadEvaluations();
  }, [user]);

  const loadEvaluations = async () => {
    setLoading(true);
    const data = await fetchEvaluations(user?.grado);
    setEvaluations(data || []);
    setLoading(false);
  };

  // Timer Countdown Logic
  const timerRef = useRef(null);
  useEffect(() => {
    if (isExamStarted && secondsRemaining > 0) {
      timerRef.current = setInterval(() => {
        setSecondsRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleAutoSubmitOnTimeOut();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [isExamStarted, secondsRemaining]);

  const handleStartExam = async (evaluation) => {
    const detailed = await fetchEvaluationById(evaluation.id);
    const examData = detailed || evaluation;
    setActiveExam(examData);
    setSecondsRemaining((examData.tiempoMinutos || 45) * 60);
    setIsExamStarted(true);
    setExamAnswers({});
    setMathScratchpad({});
    setSubmitSuccess(null);
  };

  const handleSelectOption = (questionId, option) => {
    setExamAnswers(prev => ({
      ...prev,
      [questionId]: option
    }));
  };

  const handleTextAnswerChange = (questionId, text) => {
    setExamAnswers(prev => ({
      ...prev,
      [questionId]: text
    }));
  };

  const handleInsertMathSymbol = (questionId, symbol) => {
    const current = examAnswers[questionId] || '';
    setExamAnswers(prev => ({
      ...prev,
      [questionId]: current + symbol
    }));
  };

  const handleAutoSubmitOnTimeOut = () => {
    handleSubmitExam(true);
  };

  const handleSubmitExam = async (isForced = false) => {
    if (!activeExam) return;
    setSubmitting(true);

    const formattedAnswers = (activeExam.preguntas || []).map(q => ({
      preguntaId: q.id,
      tipo: q.tipo,
      respuesta: examAnswers[q.id] || '',
      procedimiento: mathScratchpad[q.id] || ''
    }));

    const timeSpent = ((activeExam.tiempoMinutos || 45) * 60) - secondsRemaining;

    const payload = {
      estudianteId: user.id || 1,
      estudianteNombre: user.nombre || 'Mateo Gómez',
      estudianteEmail: user.email || 'estudiante@educol.edu.co',
      grado: user.grado || '10° A',
      jornada: user.jornada || 'Mañana',
      tiempoEmpleadoSegundos: Math.max(0, timeSpent),
      respuestas: formattedAnswers
    };

    await submitEvaluationExam(activeExam.id, payload);

    const updatedIds = [...submittedExamIds, activeExam.id];
    setSubmittedExamIds(updatedIds);
    try {
      localStorage.setItem(studentStorageKey, JSON.stringify(updatedIds));
    } catch (e) {}

    if (addNotification) {
      addNotification({
        title: 'Parcial Entregado',
        text: `El estudiante ${user.nombre} completó y envió el examen "${activeExam.titulo}".`,
        icon: 'check_circle',
        color: 'text-emerald-600',
        targetRole: 'DOCENTE'
      });
    }

    setSubmitting(false);
    setShowConfirmSubmit(false);
    setIsExamStarted(false);
    setSubmitSuccess({
      evaluacionTitulo: activeExam.titulo,
      materia: activeExam.materia,
      tiempoEmpleado: Math.round(timeSpent / 60),
      fechaEnvio: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })
    });
  };

  const formatTimer = (totalSecs) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const filteredEvaluations = evaluations.filter(ev => {
    const isSubmitted = submittedExamIds.includes(ev.id);
    const matchesSearch = ev.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ev.materia.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (ev.docenteNombre && ev.docenteNombre.toLowerCase().includes(searchQuery.toLowerCase()));
    if (!matchesSearch) return false;

    if (filterStatus === 'DISPONIBLES') return !isSubmitted;
    if (filterStatus === 'ENVIADOS') return isSubmitted;
    return true;
  });

  const mathSymbols = [
    { label: '√x', value: 'sqrt()' },
    { label: 'π', value: 'π' },
    { label: '∑', value: 'sum(' },
    { label: '∫', value: 'int(' },
    { label: 'x²', value: '^2' },
    { label: 'x³', value: '^3' },
    { label: '±', value: '±' },
    { label: 'θ', value: 'θ' },
    { label: '≤', value: '<=' },
    { label: '≥', value: '>=' },
    { label: '≠', value: '!=' },
    { label: 'a/b', value: ' (a/b) ' }
  ];

  return (
    <div className={`flex-1 ${sidebarOpen ? 'md:ml-72' : 'md:ml-0'} p-4 sm:p-6 md:p-8 overflow-y-auto z-10 relative pt-20 md:pt-24 transition-all duration-300`}>
      
      {/* Active Exam Mode Screen */}
      {isExamStarted && activeExam ? (
        <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn pb-16">
          
          {/* Top Sticky Status Bar with Timer */}
          <div className="sticky top-20 z-30 bg-white/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-amber-200/80 shadow-lg flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 border border-amber-300 flex items-center justify-center font-bold">
                <ClipboardCheck className="w-5 h-5 text-amber-700" />
              </div>
              <div>
                <span className="text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                  {cleanText(activeExam.materia)}
                </span>
                <h2 className="font-bold text-slate-900 text-base sm:text-lg leading-tight mt-0.5 truncate max-w-md">
                  {cleanText(activeExam.titulo)}
                </h2>
              </div>
            </div>

            {/* Countdown Timer Display */}
            <div className={`flex items-center gap-2.5 px-4 py-2 rounded-xl border font-mono font-bold text-lg sm:text-xl transition-colors ${
              secondsRemaining < 300 
                ? 'bg-rose-50 text-rose-700 border-rose-300 animate-pulse' 
                : 'bg-amber-50 text-amber-900 border-amber-200'
            }`}>
              <Clock className={`w-5 h-5 ${secondsRemaining < 300 ? 'text-rose-600' : 'text-amber-700'}`} />
              <span>{formatTimer(secondsRemaining)}</span>
              {secondsRemaining < 300 && (
                <span className="text-xs font-sans font-semibold text-rose-600 hidden sm:inline">
                  (Tiempo por expirar)
                </span>
              )}
            </div>

            {/* Main Action: Enviar Parcial Button */}
            <button
              onClick={() => setShowConfirmSubmit(true)}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 active:scale-95"
            >
              <Send className="w-4 h-4" />
              <span>Enviar parcial</span>
            </button>
          </div>

          {/* Exam Instructions Banner */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-700 text-xs sm:text-sm flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-slate-900 mb-0.5">Instrucciones del Parcial</p>
              <p className="text-slate-600 leading-relaxed">
                {cleanText(activeExam.instrucciones || 'Responda con precisión todas las preguntas. Cuando concluya el examen, presione el botón "Enviar parcial".')}
              </p>
            </div>
          </div>

          {/* Questions Container */}
          <div className="space-y-6">
            {(activeExam.preguntas || []).map((question, index) => {
              const qNumber = index + 1;
              const currentAnswer = examAnswers[question.id] || '';

              return (
                <div 
                  key={question.id} 
                  className="bg-white rounded-2xl p-5 sm:p-7 border border-slate-200/80 shadow-xs hover:shadow-md transition-all relative overflow-hidden"
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-2.5">
                      <span className="w-7 h-7 rounded-lg bg-primary text-white flex items-center justify-center font-black text-xs">
                        {qNumber}
                      </span>
                      <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                        {question.tipo === 'OPCION_MULTIPLE' ? 'Opción Múltiple' : question.tipo === 'MATEMATICAS' ? 'Cálculo Matemático' : 'Respuesta Abierta / Ensayo'}
                      </span>
                    </div>
                    <span className="text-xs font-extrabold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                      {question.puntos} puntos
                    </span>
                  </div>

                  {/* Question Statement */}
                  <h3 className="font-semibold text-slate-900 text-base sm:text-lg mb-4 leading-relaxed">
                    {cleanText(question.enunciado)}
                  </h3>

                  {/* TYPE 1: Multiple Choice Question */}
                  {question.tipo === 'OPCION_MULTIPLE' && (
                    <div className="space-y-2.5">
                      {(question.opciones || []).map((opt, optIdx) => {
                        const isSelected = currentAnswer === opt;
                        const letter = String.fromCharCode(65 + optIdx);
                        return (
                          <div
                            key={optIdx}
                            onClick={() => handleSelectOption(question.id, opt)}
                            className={`p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer flex items-center gap-3.5 select-none ${
                              isSelected
                                ? 'bg-primary/10 border-primary text-slate-900 shadow-xs ring-1 ring-primary/40'
                                : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100/80 text-slate-700'
                            }`}
                          >
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 transition-colors ${
                              isSelected ? 'bg-primary text-white' : 'bg-slate-200 text-slate-700'
                            }`}>
                              {letter}
                            </div>
                            <span className="text-xs sm:text-sm font-medium leading-normal flex-1">
                              {cleanText(opt)}
                            </span>
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                              isSelected ? 'border-primary bg-primary text-white' : 'border-slate-300'
                            }`}>
                              {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* TYPE 2: Mathematics Question with Quick Symbol Helpers */}
                  {question.tipo === 'MATEMATICAS' && (
                    <div className="space-y-3">
                      {question.formula && (
                        <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-950 font-mono text-xs sm:text-sm flex items-center gap-2">
                          <Calculator className="w-4 h-4 text-amber-700 flex-shrink-0" />
                          <span>Fórmula o referencia: <strong>{question.formula}</strong></span>
                        </div>
                      )}

                      {/* Math quick buttons bar */}
                      <div className="flex items-center gap-1.5 flex-wrap p-2 rounded-xl bg-slate-100 border border-slate-200">
                        <span className="text-[10px] font-bold text-slate-500 uppercase px-1">Símbolos:</span>
                        {mathSymbols.map((sym, sIdx) => (
                          <button
                            key={sIdx}
                            type="button"
                            onClick={() => handleInsertMathSymbol(question.id, sym.value)}
                            className="px-2 py-1 rounded bg-white hover:bg-slate-200 text-slate-800 text-xs font-mono font-bold shadow-2xs border border-slate-300 transition-colors"
                          >
                            {sym.label}
                          </button>
                        ))}
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Resultado Numérico / Procedimiento:
                        </label>
                        <input
                          type="text"
                          value={currentAnswer}
                          onChange={(e) => handleTextAnswerChange(question.id, e.target.value)}
                          placeholder={`Escriba su valor final ${question.unidad ? `(${question.unidad})` : ''} o expresión...`}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">
                          Desarrollo o justificación del procedimiento (Opcional):
                        </label>
                        <textarea
                          rows={3}
                          value={mathScratchpad[question.id] || ''}
                          onChange={(e) => setMathScratchpad({ ...mathScratchpad, [question.id]: e.target.value })}
                          placeholder="Escriba los pasos intermedios de cálculo..."
                          className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary text-xs sm:text-sm text-slate-800"
                        />
                      </div>
                    </div>
                  )}

                  {/* TYPE 3: Open Essay / Writing Question */}
                  {question.tipo === 'ESCRITURA' && (
                    <div className="space-y-2.5">
                      {question.criterios && (
                        <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs flex items-center gap-2">
                          <PenTool className="w-4 h-4 text-blue-600 flex-shrink-0" />
                          <span>Criterios de evaluación: {question.criterios}</span>
                        </div>
                      )}
                      <textarea
                        rows={4}
                        value={currentAnswer}
                        onChange={(e) => handleTextAnswerChange(question.id, e.target.value)}
                        placeholder="Redacte su respuesta detallada y fundamentada aquí..."
                        className="w-full p-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary text-xs sm:text-sm leading-relaxed text-slate-800"
                      />
                      <div className="flex justify-between items-center text-[11px] text-slate-500">
                        <span>Límite sugerido: {question.limitePalabras || 150} palabras</span>
                        <span>{currentAnswer ? currentAnswer.trim().split(/\s+/).length : 0} palabras</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom Submission Bar with "Enviar parcial" */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-slate-900 text-base">¿Listo para entregar su examen?</h4>
              <p className="text-xs text-slate-600 mt-0.5">
                Revise cuidadosamente sus respuestas. Una vez enviado, el docente recibirá el parcial para su calificación.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowConfirmSubmit(true)}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <Send className="w-4 h-4" />
              <span>Enviar parcial</span>
            </button>
          </div>
        </div>
      ) : (
        /* Standard Evaluations Dashboard View */
        <div className="max-w-6xl mx-auto space-y-6">
          
          {/* Header Banner */}
          <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-extrabold uppercase px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 tracking-wider flex items-center gap-1.5">
                  <ClipboardCheck className="w-3.5 h-3.5 text-primary" />
                  <span>Campus Académico Digital</span>
                </span>
              </div>
              <h1 className="font-display font-black text-2xl sm:text-3xl md:text-4xl text-slate-900 tracking-tight">
                Mis Evaluaciones & Parciales
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
                Consulta los parciales activos asignados por tus profesores, gestiona tu tiempo con cronómetro regresivo y envía tus soluciones oficiales.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="px-4 py-2 rounded-xl bg-white border border-slate-200 shadow-2xs text-center">
                <span className="block text-[11px] font-semibold text-slate-500 uppercase">Grado Activo</span>
                <span className="font-black text-slate-900 text-sm">{user?.grado || '10° A'}</span>
              </div>
              <div className="px-4 py-2 rounded-xl bg-white border border-slate-200 shadow-2xs text-center">
                <span className="block text-[11px] font-semibold text-slate-500 uppercase">Jornada</span>
                <span className="font-black text-slate-900 text-sm">{user?.jornada || 'Mañana'}</span>
              </div>
            </div>
          </header>

          {/* Submission Success Alert */}
          {submitSuccess && (
            <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 flex items-start gap-4 animate-fadeIn">
              <div className="w-10 h-10 rounded-xl bg-emerald-200 flex items-center justify-center flex-shrink-0 font-bold text-emerald-800">
                <CheckCircle2 className="w-6 h-6 text-emerald-700" />
              </div>
              <div className="flex-1">
                <h3 className="font-extrabold text-base text-emerald-900">
                  ¡Parcial enviado exitosamente al profesor!
                </h3>
                <p className="text-xs sm:text-sm text-emerald-800 mt-0.5">
                  Tu entrega para <strong>{cleanText(submitSuccess.evaluacionTitulo)}</strong> ({cleanText(submitSuccess.materia)}) fue registrada a las {submitSuccess.fechaEnvio} empleando {submitSuccess.tiempoEmpleado} minutos.
                </p>
              </div>
              <button 
                onClick={() => setSubmitSuccess(null)}
                className="text-emerald-700 hover:text-emerald-900 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Filter and Search Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-1.5 w-full sm:w-auto">
              <button
                onClick={() => setFilterStatus('TODOS')}
                className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition-colors ${
                  filterStatus === 'TODOS' ? 'bg-primary text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Todos ({evaluations.length})
              </button>
              <button
                onClick={() => setFilterStatus('DISPONIBLES')}
                className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition-colors ${
                  filterStatus === 'DISPONIBLES' ? 'bg-primary text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Disponibles ({evaluations.filter(e => !submittedExamIds.includes(e.id)).length})
              </button>
              <button
                onClick={() => setFilterStatus('ENVIADOS')}
                className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition-colors ${
                  filterStatus === 'ENVIADOS' ? 'bg-primary text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Enviados ({evaluations.filter(e => submittedExamIds.includes(e.id)).length})
              </button>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar evaluación o materia..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Evaluations Grid */}
          {loading ? (
            <div className="p-12 text-center text-slate-500 font-semibold text-sm">
              Cargando evaluaciones asignadas...
            </div>
          ) : filteredEvaluations.length === 0 ? (
            <div className="p-12 bg-white rounded-2xl border border-slate-200 text-center space-y-2">
              <ClipboardCheck className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="font-bold text-slate-700 text-base">No se encontraron evaluaciones</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No hay parciales con los filtros seleccionados. Tus docentes programarán nuevas pruebas aquí.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredEvaluations.map((item) => {
                const isSubmitted = submittedExamIds.includes(item.id);

                return (
                  <div 
                    key={item.id}
                    className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                  >
                    <div>
                      {/* Subject and Status Badge */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-[11px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 border border-slate-200">
                          {cleanText(item.materia)}
                        </span>
                        {isSubmitted ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Enviado al Profesor</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                            <Clock className="w-3.5 h-3.5 text-amber-600" />
                            <span>Disponible</span>
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="font-display font-black text-lg sm:text-xl text-slate-900 group-hover:text-primary transition-colors leading-snug mb-2">
                        {cleanText(item.titulo)}
                      </h3>

                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                        {cleanText(item.instrucciones)}
                      </p>

                      {/* Evaluation Details Info Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs mb-5">
                        <div>
                          <span className="block text-[10px] text-slate-500 font-semibold uppercase">Tiempo Límite</span>
                          <span className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                            <Timer className="w-3.5 h-3.5 text-amber-700" />
                            {item.tiempoMinutos || 45} minutos
                          </span>
                        </div>
                        <div>
                          <span className="block text-[10px] text-slate-500 font-semibold uppercase">Preguntas</span>
                          <span className="font-bold text-slate-800 mt-0.5 block">
                            {item.preguntas ? item.preguntas.length : 3} preguntas
                          </span>
                        </div>
                        <div>
                          <span className="block text-[10px] text-slate-500 font-semibold uppercase">Puntaje Máximo</span>
                          <span className="font-bold text-slate-800 mt-0.5 block">
                            {item.puntosTotales || 100} pts
                          </span>
                        </div>
                      </div>

                      {/* Teacher Attribution */}
                      <div className="flex items-center gap-2 text-xs text-slate-500 mb-5">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>Docente: <strong>{cleanText(item.docenteNombre || 'Docente Evaluador')}</strong></span>
                      </div>
                    </div>

                    {/* Bottom Action Button */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      {isSubmitted ? (
                        <div className="w-full text-center py-2.5 rounded-xl bg-slate-100 text-slate-600 font-semibold text-xs border border-slate-200">
                          Parcial ya enviado y en proceso de calificación
                        </div>
                      ) : (
                        <button
                          onClick={() => handleStartExam(item)}
                          className="w-full py-3 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95"
                        >
                          <Timer className="w-4 h-4" />
                          <span>Iniciar Parcial ({item.tiempoMinutos || 45} min)</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Confirmation Modal for "Enviar parcial" */}
      {showConfirmSubmit && activeExam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 border border-slate-200 shadow-2xl space-y-5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center justify-center mx-auto">
              <Send className="w-6 h-6 text-emerald-700" />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="font-display font-black text-xl text-slate-900">
                ¿Deseas enviar tu parcial?
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Has respondido {Object.keys(examAnswers).length} de {activeExam.preguntas?.length || 0} preguntas.
                Al confirmar, tus respuestas serán enviadas al profesor y no podrán modificarse.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
              <div className="flex justify-between">
                <span>Tiempo empleado:</span>
                <strong className="font-mono">{formatTimer(((activeExam.tiempoMinutos || 45) * 60) - secondsRemaining)}</strong>
              </div>
              <div className="flex justify-between">
                <span>Tiempo restante:</span>
                <strong className="font-mono text-amber-800">{formatTimer(secondsRemaining)}</strong>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmSubmit(false)}
                disabled={submitting}
                className="flex-1 py-3 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors"
              >
                Volver al examen
              </button>
              <button
                type="button"
                onClick={() => handleSubmitExam(false)}
                disabled={submitting}
                className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                {submitting ? 'Enviando...' : 'Confirmar y Enviar'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
