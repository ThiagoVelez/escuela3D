import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  fetchEvaluations, 
  createEvaluation, 
  fetchAllEvaluationSubmissions, 
  gradeEvaluationSubmission 
} from '../services/api';
import { 
  ClipboardCheck, 
  PlusCircle, 
  Clock, 
  CheckCircle2, 
  Send, 
  Trash2, 
  Calculator, 
  PenTool, 
  Award, 
  Calendar, 
  User, 
  FileText, 
  Search, 
  Timer, 
  Check, 
  Eye, 
  X, 
  Sparkles,
  BookOpen,
  ArrowRight,
  Filter
} from 'lucide-react';
import { cleanText } from '../utils/textSanitizer';

export default function TeacherEvaluationsPage() {
  const { user, sidebarOpen, addNotification } = useAuth();
  
  const [activeTab, setActiveTab] = useState('CREAR'); // 'CREAR' | 'ENVIADOS' | 'LISTADO'
  const [evaluations, setEvaluations] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Creation Form State
  const [titulo, setTitulo] = useState('');
  const [materia, setMateria] = useState('Matemáticas 3D');
  const [grado, setGrado] = useState('10° A');
  const [jornada, setJornada] = useState('Mañana');
  const [tiempoMinutos, setTiempoMinutos] = useState(45);
  const [puntosTotales, setPuntosTotales] = useState(100);
  const [instrucciones, setInstrucciones] = useState('');
  const [fechaLimite, setFechaLimite] = useState('2026-10-15');
  
  // Questions Builder State
  const [preguntas, setPreguntas] = useState([
    {
      id: 1,
      tipo: 'OPCION_MULTIPLE',
      enunciado: '¿Cuál es el valor del determinante de una matriz identidad de 3x3?',
      opciones: ['0', '1', '3', '9'],
      respuestaCorrecta: '1',
      puntos: 30
    },
    {
      id: 2,
      tipo: 'MATEMATICAS',
      enunciado: 'Resuelva la siguiente ecuación cuadrática: 2x^2 - 8 = 0. Indique la raíz positiva.',
      formula: 'x = sqrt(c/a)',
      respuestaEsperada: '2',
      unidad: '',
      puntos: 35
    },
    {
      id: 3,
      tipo: 'ESCRITURA',
      enunciado: 'Explique con sus propias palabras cómo se aplica el teorema de Pitágoras en un espacio de tres dimensiones.',
      criterios: 'Coherencia geométrica, relación de catetos espaciales y diagonal.',
      limitePalabras: 120,
      puntos: 35
    }
  ]);

  const [creating, setCreating] = useState(false);
  const [createSuccessMessage, setCreateSuccessMessage] = useState(false);

  // Inspection & Grading Modal State
  const [inspectingSubmission, setInspectingSubmission] = useState(null);
  const [gradingNota, setGradingNota] = useState(5.0);
  const [gradingFeedback, setGradingFeedback] = useState('');
  const [gradingAnswersScores, setGradingAnswersScores] = useState({});
  const [savingGrade, setSavingGrade] = useState(false);
  const [gradeSuccessMessage, setGradeSuccessMessage] = useState(false);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    const [evalData, subsData] = await Promise.all([
      fetchEvaluations(),
      fetchAllEvaluationSubmissions()
    ]);
    setEvaluations(evalData || []);
    setSubmissions(subsData || []);
    setLoading(false);
  };

  // Question Management
  const handleAddQuestion = (tipo) => {
    const newId = Date.now();
    let newQ = {
      id: newId,
      tipo,
      enunciado: '',
      puntos: 20
    };

    if (tipo === 'OPCION_MULTIPLE') {
      newQ.opciones = ['Opción A', 'Opción B', 'Opción C', 'Opción D'];
      newQ.respuestaCorrecta = 'Opción A';
    } else if (tipo === 'MATEMATICAS') {
      newQ.formula = '';
      newQ.respuestaEsperada = '';
      newQ.unidad = '';
    } else if (tipo === 'ESCRITURA') {
      newQ.criterios = '';
      newQ.limitePalabras = 150;
    }

    setPreguntas([...preguntas, newQ]);
  };

  const handleRemoveQuestion = (id) => {
    setPreguntas(preguntas.filter(q => q.id !== id));
  };

  const handleUpdateQuestion = (id, field, value) => {
    setPreguntas(preguntas.map(q => {
      if (q.id === id) {
        return { ...q, [field]: value };
      }
      return q;
    }));
  };

  const handleUpdateOption = (qId, optIdx, val) => {
    setPreguntas(preguntas.map(q => {
      if (q.id === qId) {
        const newOpts = [...q.opciones];
        newOpts[optIdx] = val;
        return { ...q, opciones: newOpts };
      }
      return q;
    }));
  };

  const handleCreateEvaluation = async (e) => {
    e.preventDefault();
    if (!titulo.trim() || preguntas.length === 0) return;

    setCreating(true);

    const payload = {
      titulo,
      materia,
      materiaId: materia.includes('Bio') ? 2 : materia.includes('Lit') ? 3 : 1,
      grado,
      jornada,
      docenteId: user.id || 2,
      docenteNombre: user.nombre || 'Dra. Valentina Ríos',
      tiempoMinutos: parseInt(tiempoMinutos) || 45,
      puntosTotales: parseInt(puntosTotales) || 100,
      fechaLimite,
      instrucciones: instrucciones || 'Complete todas las preguntas en el tiempo fijado.',
      preguntas
    };

    await createEvaluation(payload);

    if (addNotification) {
      addNotification({
        title: 'Nueva Evaluación Creada',
        text: `Se programó la evaluación "${titulo}" para ${grado} con un tiempo de ${tiempoMinutos} minutos.`,
        icon: 'assignment',
        color: 'text-amber-600',
        targetRole: 'ESTUDIANTE'
      });
    }

    setCreating(false);
    setCreateSuccessMessage(true);
    setTimeout(() => {
      setCreateSuccessMessage(false);
      setTitulo('');
      setInstrucciones('');
      loadData();
      setActiveTab('LISTADO');
    }, 1200);
  };

  const handleOpenInspection = (sub) => {
    setInspectingSubmission(sub);
    setGradingNota(sub.calificacionTotal !== null ? sub.calificacionTotal : 4.5);
    setGradingFeedback(sub.retroalimentacionDocente || 'Excelente desarrollo conceptual y solución de los ejercicios planteados.');
    
    // Initialize question scores map
    const scores = {};
    (sub.respuestas || []).forEach(r => {
      scores[r.preguntaId] = r.puntajeObtenido || 0;
    });
    setGradingAnswersScores(scores);
  };

  const handleSaveGrade = async () => {
    if (!inspectingSubmission) return;
    setSavingGrade(true);

    const answersArray = Object.keys(gradingAnswersScores).map(k => ({
      preguntaId: parseInt(k),
      puntajeObtenido: parseFloat(gradingAnswersScores[k]) || 0
    }));

    await gradeEvaluationSubmission(inspectingSubmission.id, {
      notaFinal: parseFloat(gradingNota),
      retroalimentacion: gradingFeedback,
      docenteNombre: user.nombre || 'Docente Evaluador',
      respuestasPuntajes: answersArray
    });

    if (addNotification) {
      addNotification({
        title: 'Parcial Calificado',
        text: `Su evaluación "${inspectingSubmission.evaluacionTitulo}" ha sido calificada con nota ${gradingNota}.`,
        icon: 'grade',
        color: 'text-emerald-600',
        targetRole: 'ESTUDIANTE'
      });
    }

    setSavingGrade(false);
    setGradeSuccessMessage(true);
    setTimeout(() => {
      setGradeSuccessMessage(false);
      setInspectingSubmission(null);
      loadData();
    }, 1200);
  };

  return (
    <div className={`flex-1 ${sidebarOpen ? 'md:ml-72' : 'md:ml-0'} p-4 sm:p-6 md:p-8 overflow-y-auto z-10 relative pt-20 md:pt-24 transition-all duration-300`}>
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header Banner */}
        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-extrabold uppercase px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 tracking-wider flex items-center gap-1.5">
                <ClipboardCheck className="w-3.5 h-3.5 text-primary" />
                <span>Gestión Pedagógica & Evaluaciones</span>
              </span>
            </div>
            <h1 className="font-display font-black text-2xl sm:text-3xl md:text-4xl text-slate-900 tracking-tight">
              Diseño & Calificación de Evaluaciones
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
              Crea exámenes con límites de tiempo interactivos, preguntas libres de opción múltiple, escritura y matemáticas, y califica los parciales entregados.
            </p>
          </div>

          {/* Quick Submissions Badge */}
          <div className="flex items-center gap-3">
            <div className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <Send className="w-4 h-4 text-emerald-700" />
              </div>
              <div>
                <span className="block text-[10px] text-slate-500 font-semibold uppercase">Parciales Recibidos</span>
                <span className="font-black text-slate-900 text-base">{submissions.length} entregas</span>
              </div>
            </div>
          </div>
        </header>

        {/* Section Tabs */}
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl w-fit">
          <button
            onClick={() => setActiveTab('CREAR')}
            className={`px-4 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 ${
              activeTab === 'CREAR'
                ? 'bg-white text-slate-900 shadow-xs ring-1 ring-slate-200/80'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <PlusCircle className="w-4 h-4 text-primary" />
            <span>Crear Nueva Evaluación</span>
          </button>

          <button
            onClick={() => setActiveTab('ENVIADOS')}
            className={`px-4 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 ${
              activeTab === 'ENVIADOS'
                ? 'bg-white text-slate-900 shadow-xs ring-1 ring-slate-200/80'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Send className="w-4 h-4 text-emerald-600" />
            <span>Parciales Enviados por Estudiantes ({submissions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('LISTADO')}
            className={`px-4 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 ${
              activeTab === 'LISTADO'
                ? 'bg-white text-slate-900 shadow-xs ring-1 ring-slate-200/80'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4 text-blue-600" />
            <span>Evaluaciones Activas ({evaluations.length})</span>
          </button>
        </div>

        {/* TAB 1: Creador de Evaluaciones */}
        {activeTab === 'CREAR' && (
          <form onSubmit={handleCreateEvaluation} className="space-y-6">
            
            {createSuccessMessage && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 font-bold text-sm flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                <span>¡Evaluación publicada con éxito! Ya está disponible para los estudiantes.</span>
              </div>
            )}

            {/* General Settings Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-5">
              <h2 className="font-display font-black text-lg sm:text-xl text-slate-900 flex items-center gap-2">
                <ClipboardCheck className="w-5 h-5 text-primary" />
                <span>Configuración General del Parcial</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Título de la Evaluación o Parcial *
                  </label>
                  <input
                    type="text"
                    required
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    placeholder="Ej. Parcial Bimestral: Geometría Analítica y Vectores 3D"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary text-sm font-semibold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Materia / Asignatura
                  </label>
                  <select
                    value={materia}
                    onChange={(e) => setMateria(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary text-sm text-slate-800 bg-white"
                  >
                    <option value="Matemáticas 3D">Matemáticas 3D</option>
                    <option value="Biología 3D">Biología 3D</option>
                    <option value="Literatura Colombiana">Literatura Colombiana</option>
                    <option value="Física 3D">Física 3D</option>
                    <option value="Química 3D">Química 3D</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Grado Objetivo
                  </label>
                  <select
                    value={grado}
                    onChange={(e) => setGrado(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary text-sm text-slate-800 bg-white"
                  >
                    <option value="10° A">10° A</option>
                    <option value="10° B">10° B</option>
                    <option value="11° A">11° A</option>
                    <option value="11° B">11° B</option>
                    <option value="Todos">Todos los Grados</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Jornada
                  </label>
                  <select
                    value={jornada}
                    onChange={(e) => setJornada(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary text-sm text-slate-800 bg-white"
                  >
                    <option value="Mañana">Mañana</option>
                    <option value="Tarde">Tarde</option>
                    <option value="Todas">Todas las Jornadas</option>
                  </select>
                </div>

                {/* Important Requirement: Timer / Tiempo Límite */}
                <div>
                  <label className="block text-xs font-bold text-amber-900 mb-1 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-700" />
                    <span>Tiempo Límite para Realizarla *</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      required
                      min={5}
                      max={240}
                      value={tiempoMinutos}
                      onChange={(e) => setTiempoMinutos(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-amber-300 bg-amber-50/50 focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm font-bold text-slate-900"
                    />
                    <span className="text-xs font-semibold text-slate-600 whitespace-nowrap">minutos</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Puntos Máximos
                  </label>
                  <input
                    type="number"
                    value={puntosTotales}
                    onChange={(e) => setPuntosTotales(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary text-sm text-slate-900 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Fecha de Cierre
                  </label>
                  <input
                    type="date"
                    value={fechaLimite}
                    onChange={(e) => setFechaLimite(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary text-sm text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Instrucciones o Recomendaciones para el Estudiante
                </label>
                <textarea
                  rows={2}
                  value={instrucciones}
                  onChange={(e) => setInstrucciones(e.target.value)}
                  placeholder="Ej. Tenga a mano lápiz y papel para los cálculos. El cronómetro no puede pausarse una vez iniciado."
                  className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary text-xs sm:text-sm text-slate-800"
                />
              </div>
            </div>

            {/* Questions Builder Section */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
                <div>
                  <h3 className="font-display font-black text-lg text-slate-900">
                    Preguntas del Examen ({preguntas.length})
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Libertad de combinar preguntas de opción múltiple, escritura abierta o matemáticas.
                  </p>
                </div>

                {/* Question Type Add Buttons */}
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => handleAddQuestion('OPCION_MULTIPLE')}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <PlusCircle className="w-3.5 h-3.5 text-primary" />
                    <span>+ Opción Múltiple</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleAddQuestion('MATEMATICAS')}
                    className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-bold text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <Calculator className="w-3.5 h-3.5 text-amber-700" />
                    <span>+ Matemáticas</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleAddQuestion('ESCRITURA')}
                    className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 font-bold text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <PenTool className="w-3.5 h-3.5 text-blue-700" />
                    <span>+ Escribir / Abierta</span>
                  </button>
                </div>
              </div>

              {/* Questions List */}
              <div className="space-y-4">
                {preguntas.map((q, idx) => (
                  <div 
                    key={q.id}
                    className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs relative space-y-4"
                  >
                    <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-primary text-white flex items-center justify-center font-black text-xs">
                          {idx + 1}
                        </span>
                        <span className="text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-200">
                          {q.tipo === 'OPCION_MULTIPLE' ? 'Opción Múltiple' : q.tipo === 'MATEMATICAS' ? 'Matemáticas' : 'Escritura / Ensayo'}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <label className="text-xs font-semibold text-slate-500">Puntos:</label>
                          <input
                            type="number"
                            value={q.puntos}
                            onChange={(e) => handleUpdateQuestion(q.id, 'puntos', e.target.value)}
                            className="w-16 px-2 py-1 rounded-lg border border-slate-200 text-xs font-bold text-center"
                          />
                        </div>

                        {preguntas.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveQuestion(q.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                            title="Eliminar pregunta"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Enunciado */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Enunciado de la Pregunta *
                      </label>
                      <textarea
                        rows={2}
                        required
                        value={q.enunciado}
                        onChange={(e) => handleUpdateQuestion(q.id, 'enunciado', e.target.value)}
                        placeholder="Redacte la pregunta con claridad..."
                        className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary text-xs sm:text-sm text-slate-800"
                      />
                    </div>

                    {/* TYPE 1: Options Editor */}
                    {q.tipo === 'OPCION_MULTIPLE' && (
                      <div className="space-y-2.5 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                        <span className="block text-xs font-bold text-slate-700 mb-1">
                          Opciones de Respuesta y Selección de la Correcta:
                        </span>
                        {(q.opciones || []).map((opt, optIdx) => {
                          const letter = String.fromCharCode(65 + optIdx);
                          const isCorrect = q.respuestaCorrecta === opt;
                          return (
                            <div key={optIdx} className="flex items-center gap-2">
                              <span className="w-6 h-6 rounded-md bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center">
                                {letter}
                              </span>
                              <input
                                type="text"
                                value={opt}
                                onChange={(e) => handleUpdateOption(q.id, optIdx, e.target.value)}
                                className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-800 bg-white"
                              />
                              <button
                                type="button"
                                onClick={() => handleUpdateQuestion(q.id, 'respuestaCorrecta', opt)}
                                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors ${
                                  isCorrect
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                                }`}
                              >
                                <Check className="w-3 h-3" />
                                <span>{isCorrect ? 'Correcta' : 'Marcar correcta'}</span>
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* TYPE 2: Math Fields */}
                    {q.tipo === 'MATEMATICAS' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl bg-amber-50/50 border border-amber-200/80">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Fórmula o Referencia (Opcional):
                          </label>
                          <input
                            type="text"
                            value={q.formula || ''}
                            onChange={(e) => handleUpdateQuestion(q.id, 'formula', e.target.value)}
                            placeholder="Ej. w = sqrt(x^2 + y^2 + z^2)"
                            className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-mono bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Respuesta Numérica Esperada:
                          </label>
                          <input
                            type="text"
                            value={q.respuestaEsperada || ''}
                            onChange={(e) => handleUpdateQuestion(q.id, 'respuestaEsperada', e.target.value)}
                            placeholder="Ej. 7 o 2.5"
                            className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-mono bg-white font-bold"
                          />
                        </div>
                      </div>
                    )}

                    {/* TYPE 3: Writing / Essay Fields */}
                    {q.tipo === 'ESCRITURA' && (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-blue-50/50 border border-blue-200/80">
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Criterios de Evaluación / Rúbrica:
                          </label>
                          <input
                            type="text"
                            value={q.criterios || ''}
                            onChange={(e) => handleUpdateQuestion(q.id, 'criterios', e.target.value)}
                            placeholder="Ej. Coherencia gramatical, profundidad de análisis y citas."
                            className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Límite Máx. Palabras:
                          </label>
                          <input
                            type="number"
                            value={q.limitePalabras || 150}
                            onChange={(e) => handleUpdateQuestion(q.id, 'limitePalabras', e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Bar */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-md flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900 text-sm">Resumen de la Evaluación</p>
                <p className="text-xs text-slate-600">
                  {preguntas.length} preguntas programadas | Tiempo: {tiempoMinutos} minutos | {puntosTotales} puntos totales
                </p>
              </div>

              <button
                type="submit"
                disabled={creating}
                className="px-8 py-3.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-extrabold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 active:scale-95"
              >
                <Send className="w-4 h-4" />
                <span>{creating ? 'Publicando...' : 'Publicar Evaluación'}</span>
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: Parciales Enviados por Estudiantes (Review & Grading) */}
        {activeTab === 'ENVIADOS' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-display font-black text-lg text-slate-900">
                  Entregas de Parciales Realizados
                </h3>
                <p className="text-xs text-slate-600">
                  Revise las respuestas dadas por los alumnos, asigne retroalimentación y registre la calificación.
                </p>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar estudiante o examen..."
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {submissions.length === 0 ? (
              <div className="p-12 bg-white rounded-2xl border border-slate-200 text-center space-y-2">
                <Send className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="font-bold text-slate-700 text-base">No hay parciales entregados todavía</p>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  A medida que los estudiantes concluyan sus exámenes y presionen "Enviar parcial", aparecerán aquí listados para su calificación.
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                      <tr>
                        <th className="p-4">Estudiante</th>
                        <th className="p-4">Evaluación / Materia</th>
                        <th className="p-4">Grado & Jornada</th>
                        <th className="p-4">Tiempo Empleado</th>
                        <th className="p-4">Estado</th>
                        <th className="p-4">Nota</th>
                        <th className="p-4 text-right">Acción</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {submissions.map((sub) => {
                        const isGraded = sub.estado === 'CALIFICADO';
                        const mins = Math.round((sub.tiempoEmpleadoSegundos || 0) / 60);

                        return (
                          <tr key={sub.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="p-4 font-bold text-slate-900">
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-primary" />
                                <span>{cleanText(sub.estudianteNombre)}</span>
                              </div>
                              <span className="text-[10px] text-slate-500 block pl-6">{sub.estudianteEmail}</span>
                            </td>
                            <td className="p-4">
                              <span className="font-semibold text-slate-800 block truncate max-w-xs">
                                {cleanText(sub.evaluacionTitulo)}
                              </span>
                              <span className="text-[10px] text-primary font-bold">{cleanText(sub.materia)}</span>
                            </td>
                            <td className="p-4 text-slate-700 font-medium">
                              {sub.grado} - {sub.jornada}
                            </td>
                            <td className="p-4 font-mono text-slate-700">
                              {mins} min
                            </td>
                            <td className="p-4">
                              {isGraded ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-[11px]">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                  <span>Calificado</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-bold text-[11px]">
                                  <Clock className="w-3 h-3 text-amber-600" />
                                  <span>Pendiente</span>
                                </span>
                              )}
                            </td>
                            <td className="p-4 font-extrabold text-sm">
                              {sub.calificacionTotal !== null ? (
                                <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                                  {sub.calificacionTotal}
                                </span>
                              ) : (
                                <span className="text-slate-400">-</span>
                              )}
                            </td>
                            <td className="p-4 text-right">
                              <button
                                onClick={() => handleOpenInspection(sub)}
                                className="px-3.5 py-1.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-xs shadow-2xs transition-all inline-flex items-center gap-1.5"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>{isGraded ? 'Ver / Editar' : 'Calificar'}</span>
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
        )}

        {/* TAB 3: Evaluaciones Activas */}
        {activeTab === 'LISTADO' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {evaluations.map((ev) => (
              <div key={ev.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 border border-slate-200">
                    {cleanText(ev.materia)}
                  </span>
                  <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 flex items-center gap-1">
                    <Timer className="w-3.5 h-3.5" />
                    {ev.tiempoMinutos || 45} min
                  </span>
                </div>

                <div>
                  <h3 className="font-display font-black text-lg text-slate-900 leading-snug">
                    {cleanText(ev.titulo)}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed line-clamp-2">
                    {cleanText(ev.instrucciones)}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-50 text-xs text-slate-700">
                  <div>
                    <span className="block text-[10px] text-slate-400 uppercase">Grado</span>
                    <strong>{ev.grado}</strong>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400 uppercase">Preguntas</span>
                    <strong>{ev.preguntas ? ev.preguntas.length : 3}</strong>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400 uppercase">Puntaje</span>
                    <strong>{ev.puntosTotales || 100} pts</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Inspection & Grading Modal */}
        {inspectingSubmission && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 border border-slate-200 shadow-2xl space-y-6 my-8 max-h-[90vh] overflow-y-auto">
              
              <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
                <div>
                  <span className="text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                    Revisión de Parcial Entregado
                  </span>
                  <h2 className="font-display font-black text-xl sm:text-2xl text-slate-900 mt-1">
                    {cleanText(inspectingSubmission.evaluacionTitulo)}
                  </h2>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Estudiante: <strong>{cleanText(inspectingSubmission.estudianteNombre)}</strong> | Grado: {inspectingSubmission.grado} | Tiempo: {Math.round((inspectingSubmission.tiempoEmpleadoSegundos || 0) / 60)} min
                  </p>
                </div>
                <button
                  onClick={() => setInspectingSubmission(null)}
                  className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Answers Inspection */}
              <div className="space-y-4">
                <h3 className="font-bold text-slate-900 text-sm">Respuestas del Estudiante</h3>
                
                {(inspectingSubmission.respuestas || []).map((resp, rIdx) => (
                  <div key={rIdx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800">
                        Pregunta #{rIdx + 1} ({resp.tipo === 'OPCION_MULTIPLE' ? 'Opción Múltiple' : resp.tipo === 'MATEMATICAS' ? 'Cálculo Matemático' : 'Escritura / Ensayo'})
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-500 font-semibold">Puntos asignados:</span>
                        <input
                          type="number"
                          value={gradingAnswersScores[resp.preguntaId] ?? resp.puntajeObtenido ?? 0}
                          onChange={(e) => setGradingAnswersScores({
                            ...gradingAnswersScores,
                            [resp.preguntaId]: e.target.value
                          })}
                          className="w-16 px-2 py-1 rounded-lg border border-slate-300 bg-white font-bold text-center text-xs"
                        />
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-white border border-slate-200/80 text-xs sm:text-sm text-slate-900">
                      <strong>Respuesta enviada:</strong> {cleanText(resp.respuesta || '(Sin respuesta)')}
                    </div>

                    {resp.procedimiento && (
                      <div className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-200 text-xs font-mono text-amber-950">
                        <strong>Procedimiento:</strong> {resp.procedimiento}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Teacher Final Evaluation Inputs */}
              <div className="p-5 rounded-2xl bg-slate-100 border border-slate-200 space-y-4">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-600" />
                  <span>Calificación Oficial & Retroalimentación</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Nota Final (1.0 - 5.0) *
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="1.0"
                      max="5.0"
                      value={gradingNota}
                      onChange={(e) => setGradingNota(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white font-mono text-base font-black text-emerald-800 text-center"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Retroalimentación Pedagógica para el Estudiante
                    </label>
                    <textarea
                      rows={2}
                      value={gradingFeedback}
                      onChange={(e) => setGradingFeedback(e.target.value)}
                      placeholder="Escriba comentarios pedagógicos, fortalezas o áreas de mejora..."
                      className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm text-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setInspectingSubmission(null)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSaveGrade}
                  disabled={savingGrade}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>{savingGrade ? 'Guardando...' : 'Guardar y Publicar al Estudiante'}</span>
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
