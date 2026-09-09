import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UNIVERSITY_THEMES } from '../services/coursesService';
import { 
  X, 
  BookOpen, 
  CheckCircle2, 
  Send, 
  Check, 
  Compass, 
  Sparkles, 
  Home, 
  TreePine, 
  Fish, 
  Info, 
  GraduationCap, 
  Award, 
  Leaf, 
  Droplet, 
  Dna,
  ArrowRight,
  School,
  FileText,
  Layers,
  Download,
  Calendar,
  Clock,
  Mail,
  HelpCircle,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export default function SubjectDetailModal({ subject, onClose }) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('syllabus'); // 'syllabus', 'units', 'interactive', 'resources'
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Math State
  const [vx, setVx] = useState(3);
  const [vy, setVy] = useState(4);
  const [vz, setVz] = useState(2);
  const [mathAnswer, setMathAnswer] = useState('');
  const [mathQuizResult, setMathQuizResult] = useState(null);

  // Literature State
  const [macondoHotspot, setMacondoHotspot] = useState({
    id: 'casa-buendia',
    title: 'La Casa Buendía & Laboratorio de Melquíades',
    detail: 'Hogar patriarcal donde José Arcadio instaló los astrolabios, imanes y el laboratorio de alquimia regalado por el gitano Melquíades.'
  });
  const [litEssayText, setLitEssayText] = useState('');
  const [litSubmitted, setLitSubmitted] = useState(false);

  // Biology State
  const [selectedOrganelle, setSelectedOrganelle] = useState({
    id: 'cloroplasto',
    name: 'Cloroplasto de Páramo',
    description: 'Estructura celular altamente especializada en captación lumínica y protección contra la intensa radiación ultravioleta de los ecosistemas andinos colombianos.'
  });

  if (!subject) return null;

  const isMath = subject.interactiveType === 'math' || subject.code?.includes('MAT') || subject.code?.includes('CALC') || subject.title?.toLowerCase().includes('matemática') || subject.title?.toLowerCase().includes('cálculo');
  const isLit = subject.interactiveType === 'literature' || subject.code?.includes('LIT') || subject.title?.toLowerCase().includes('literatura');
  const isBio = subject.interactiveType === 'bio' || subject.code?.includes('BIO') || subject.title?.toLowerCase().includes('biología');

  const theme = UNIVERSITY_THEMES.find(t => t.id === subject.themeId) || UNIVERSITY_THEMES[0];

  // Calculate Vector Magnitude
  const vectorMagnitude = Math.sqrt(vx * vx + vy * vy + vz * vz).toFixed(2);

  const handleMathQuizSubmit = (e) => {
    e.preventDefault();
    const correct = Math.abs(parseFloat(mathAnswer) - parseFloat(vectorMagnitude)) < 0.2;
    if (correct) {
      setMathQuizResult({
        success: true,
        msg: `¡Cálculo correcto! Magnitud calculada: ${vectorMagnitude} u. El docente ha recibido tu entrega de cátedra.`
      });
    } else {
      setMathQuizResult({
        success: false,
        msg: `El resultado no coincide. Revisa la raíz euclidiana: √(${vx}² + ${vy}² + ${vz}²) = ${vectorMagnitude} u.`
      });
    }
  };

  const handleLitEssaySubmit = (e) => {
    e.preventDefault();
    if (!litEssayText.trim()) return;
    setLitSubmitted(true);
  };

  const handleDownloadSyllabus = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  // Syllabus Fallbacks
  const syllabusDesc = subject.syllabus?.description || subject.description || 'Formación académica rigurosa con enfoque metodológico universitario.';
  const generalObjective = subject.syllabus?.generalObjective || 'Desarrollar competencias teóricas y experimentales en la disciplina.';
  const competencies = subject.syllabus?.competencies || [
    'Modelamiento y resolución rigurosa de problemas disciplinares.',
    'Aplicación de metodologías analíticas fundamentadas en literatura científica.',
    'Pensamiento crítico y formulación de proyectos académicos.'
  ];
  const evaluationMethodology = subject.syllabus?.evaluationMethodology || '30% Talleres prácticos, 30% Seminarios y proyectos, 40% Evaluaciones parciales de cátedra.';

  // Units Fallbacks
  const units = subject.units || [
    {
      id: 'u1',
      title: 'Unidad 1: Fundamentos y Epistemología de la Cátedra',
      description: 'Definiciones primarias, marco conceptual y aplicaciones.',
      hours: 16,
      weight: '30%',
      status: 'Aprobado (5.0)',
      lessons: ['Conceptos introductorios', 'Metodología analítica', 'Estudio de casos']
    },
    {
      id: 'u2',
      title: 'Unidad 2: Desarrollo y Análisis de Casos de Estudio',
      description: 'Resolución de problemas contextualizados a la realidad colombiana.',
      hours: 18,
      weight: '35%',
      status: 'Aprobado (4.8)',
      lessons: ['Análisis empírico', 'Talleres prácticos aplicados']
    },
    {
      id: 'u3',
      title: 'Unidad 3: Taller Integral y Proyecto de Cátedra (En Curso)',
      description: 'Evaluación de competencias y entrega de resultados.',
      hours: 20,
      weight: '35%',
      status: 'Avance 75%',
      lessons: ['Integración curricular', 'Sustentación de resultados']
    }
  ];

  // Resources Fallbacks
  const resources = subject.resources || [
    {
      title: 'Tratado Académico de Referencia Institucional (Edición Universitaria)',
      type: 'Texto Guía Oficial de Cátedra',
      author: 'Comité Editorial Universitario',
      callNumber: 'BIB-COL-2026'
    },
    {
      title: 'Guía Metodológica de Cátedra y Rúbricas de Evaluación',
      type: 'Documento Oficial de la Facultad (PDF)',
      author: 'Facultad Académica',
      callNumber: 'DOC-EDCOL-01'
    }
  ];

  const teacherName = subject.teacher?.name || subject.teacher || 'Docente Titular';
  const teacherOfficeHours = subject.teacher?.officeHours || 'Martes y Jueves: 2:00 PM - 4:00 PM';
  const teacherEmail = subject.teacher?.email || 'docente@educol.edu.co';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 md:p-6 pt-20 md:pt-24 pb-6 bg-slate-950/80 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-5xl max-h-[85vh] bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-slate-200 my-auto">
        
        {/* Top Accent Gradient */}
        <div className={`h-2.5 w-full bg-gradient-to-r ${theme.bannerGradient}`}></div>

        {/* Top Header: University Official Lecture Header */}
        <div className="px-6 py-4 border-b border-slate-200/80 bg-slate-50/90 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3.5">
            <div className={`w-11 h-11 rounded-2xl ${theme.bgLight} flex items-center justify-center shadow-xs font-bold flex-shrink-0`}>
              <School className={`w-6 h-6 ${theme.textPrimary}`} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-slate-200 text-slate-700">
                  {subject.faculty || 'Facultad Institucional'}
                </span>
                <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-md ${theme.badge}`}>
                  {subject.code || 'ASIG-2026'}
                </span>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {subject.credits || 4} Créditos Académicos
                </span>
              </div>
              <h2 className="font-display font-bold text-lg md:text-xl text-slate-900 leading-tight mt-1">
                {subject.title}
              </h2>
              <p className="text-xs text-slate-500 hidden sm:block">
                Cátedra: {teacherName} • {teacherOfficeHours}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadSyllabus}
              className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-xs hidden md:flex items-center gap-1.5 transition-colors"
              title="Descargar Syllabus de Cátedra Oficial en PDF"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Syllabus PDF</span>
            </button>

            <button 
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-slate-200/80 hover:bg-rose-100 hover:text-rose-600 text-slate-600 flex items-center justify-center transition-colors"
              title="Cerrar aula virtual"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Download Feedback Banner */}
        {downloadSuccess && (
          <div className="bg-emerald-50 text-emerald-800 border-b border-emerald-200 px-6 py-2 text-xs font-bold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Syllabus oficial descargado exitosamente con firma digital del claustro docente.</span>
          </div>
        )}

        {/* University Tabs Navigation */}
        <div className="flex border-b border-slate-200 bg-white px-4 sm:px-6 gap-2 sm:gap-4 flex-shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveTab('syllabus')}
            className={`py-3 px-3 sm:px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'syllabus'
                ? 'border-primary text-primary'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Syllabus & Presentación</span>
          </button>

          <button
            onClick={() => setActiveTab('units')}
            className={`py-3 px-3 sm:px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'units'
                ? 'border-primary text-primary'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Módulos & Unidades Temáticas ({units.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('interactive')}
            className={`py-3 px-3 sm:px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'interactive'
                ? 'border-primary text-primary'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Cátedra Interactiva & Taller Práctico</span>
          </button>

          <button
            onClick={() => setActiveTab('resources')}
            className={`py-3 px-3 sm:px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'resources'
                ? 'border-primary text-primary'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Biblioteca & Recursos ({resources.length})</span>
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/50">
          
          {/* TAB 1: SYLLABUS & PRESENTACIÓN */}
          {activeTab === 'syllabus' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              
              {/* Executive Summary Card */}
              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
                  <FileText className="w-4 h-4" />
                  <span>Justificación Curricular & Descripción Académica</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans">
                  {syllabusDesc}
                </p>
              </div>

              {/* General Objective Card */}
              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-2">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider">
                  <GraduationCap className="w-4 h-4 text-primary" />
                  <span>Objetivo General de Aprendizaje</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                  "{generalObjective}"
                </p>
              </div>

              {/* Competencies Breakdown */}
              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider">
                  <Award className="w-4 h-4 text-primary" />
                  <span>Competencias Formativas Institucionales</span>
                </div>
                <div className="space-y-2.5">
                  {competencies.map((comp, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700">
                      <span className="w-5 h-5 rounded-full bg-primary/10 text-primary font-bold text-[11px] flex items-center justify-center flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{comp}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Evaluation Scheme and Teacher Contact */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2">
                  <div className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Sistema de Evaluación Porcentual</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {evaluationMethodology}
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2">
                  <div className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                    <Mail className="w-4 h-4 text-blue-600" />
                    <span>Atención y Asesorías de Cátedra</span>
                  </div>
                  <div className="text-xs text-slate-600 space-y-1">
                    <div>Titular: <strong className="text-slate-800">{teacherName}</strong></div>
                    <div>Correo: <strong className="text-slate-800">{teacherEmail}</strong></div>
                    <div>Horario: <strong className="text-slate-800">{teacherOfficeHours}</strong></div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: UNIDADES TEMÁTICAS */}
          {activeTab === 'units' && (
            <div className="space-y-4 max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-display font-bold text-base text-slate-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-primary" />
                  <span>Estructura de Contenidos Modulares</span>
                </h3>
                <span className="text-xs text-slate-500">{units.length} unidades planificadas</span>
              </div>

              <div className="space-y-3">
                {units.map((unit, idx) => (
                  <div 
                    key={unit.id || idx}
                    className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-primary/40 transition-all space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2.5">
                        <span className="w-7 h-7 rounded-xl bg-primary/10 text-primary font-extrabold text-xs flex items-center justify-center flex-shrink-0">
                          {idx + 1}
                        </span>
                        <div>
                          <h4 className="font-display font-bold text-sm text-slate-900">
                            {unit.title}
                          </h4>
                          <span className="text-[11px] text-slate-500">
                            {unit.hours || 16} Horas lectivas • Ponderación: {unit.weight || '30%'}
                          </span>
                        </div>
                      </div>

                      <span className={`self-start sm:self-auto px-3 py-1 rounded-full text-[11px] font-bold ${
                        unit.status?.includes('Aprobado')
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : unit.status?.includes('Avance')
                          ? 'bg-blue-100 text-blue-800 border border-blue-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {unit.status || 'En Desarrollo'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {unit.description}
                    </p>

                    {unit.lessons && unit.lessons.length > 0 && (
                      <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                          Temas y Lecciones Comprendidas:
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                          {unit.lessons.map((les, lIdx) => (
                            <div key={lIdx} className="text-xs text-slate-700 flex items-center gap-1.5">
                              <ChevronRight className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                              <span className="truncate">{les}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: CÁTEDRA INTERACTIVA & TALLER PRÁCTICO (LIGHTWEIGHT SVG) */}
          {activeTab === 'interactive' && (
            <div className="max-w-4xl mx-auto">
              {isMath ? (
                /* MATHEMATICS MODULE */
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left: Vector Diagram SVG (Lightweight, 0 GPU resource drain) */}
                  <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                          <Compass className="w-4 h-4 text-primary" />
                          Representación Vectorial Espacial (R³)
                        </span>
                        <span className="text-xs font-bold bg-blue-100 text-blue-900 px-2.5 py-0.5 rounded-full">
                          v = ({vx}, {vy}, {vz})
                        </span>
                      </div>
                      
                      {/* SVG Coordinate Grid */}
                      <div className="w-full h-56 sm:h-64 bg-slate-900 rounded-xl relative overflow-hidden flex items-center justify-center p-4">
                        <svg className="w-full h-full max-h-60" viewBox="-120 -100 240 200">
                          {/* Grid Lines */}
                          <line x1="-110" y1="0" x2="110" y2="0" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />
                          <line x1="0" y1="-90" x2="0" y2="90" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />
                          <line x1="-80" y1="60" x2="80" y2="-60" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />

                          {/* Axes */}
                          {/* X Axis */}
                          <line x1="0" y1="0" x2="95" y2="0" stroke="#ef4444" strokeWidth="2.5" />
                          <text x="100" y="4" fill="#ef4444" fontSize="10" fontWeight="bold">X</text>

                          {/* Y Axis */}
                          <line x1="0" y1="0" x2="0" y2="-80" stroke="#22c55e" strokeWidth="2.5" />
                          <text x="4" y="-83" fill="#22c55e" fontSize="10" fontWeight="bold">Y</text>

                          {/* Z Axis (Isometric projection) */}
                          <line x1="0" y1="0" x2="-65" y2="50" stroke="#3b82f6" strokeWidth="2.5" />
                          <text x="-75" y="60" fill="#3b82f6" fontSize="10" fontWeight="bold">Z</text>

                          {/* Calculated Vector Projection */}
                          {(() => {
                            const px = vx * 16 - vz * 10;
                            const py = -vy * 16 + vz * 8;
                            return (
                              <g>
                                <line x1="0" y1="0" x2={px} y2={py} stroke="#fcd116" strokeWidth="3.5" strokeLinecap="round" />
                                <circle cx={px} cy={py} r="5" fill="#fcd116" stroke="#ffffff" strokeWidth="2" />
                                <text x={px + 8} y={py} fill="#ffffff" fontSize="10" fontWeight="bold">
                                  v({vx}, {vy}, {vz})
                                </text>
                              </g>
                            );
                          })()}
                        </svg>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <span>Proyección ortogonal euclídea vectorial sin sobrecarga gráfica.</span>
                      <span className="font-semibold text-primary">Cálculo analítico en tiempo real</span>
                    </div>
                  </div>

                  {/* Right: Controls & Parameters */}
                  <div className="lg:col-span-5 space-y-4">
                    {/* Magnitude Display */}
                    <div className="p-4 bg-primary/10 rounded-2xl border border-primary/20 flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-slate-600">Norma Euclídea |v|</div>
                        <div className="text-2xl font-extrabold text-primary mt-0.5">
                          {vectorMagnitude} <span className="text-xs font-medium text-slate-500">unidades</span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1 font-mono">
                          √({vx}² + {vy}² + {vz}²)
                        </div>
                      </div>
                      <div className="w-12 h-12 rounded-2xl bg-white text-primary flex items-center justify-center shadow-sm">
                        <Compass className="w-6 h-6" />
                      </div>
                    </div>

                    {/* Component Sliders */}
                    <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3 text-xs">
                      <div>
                        <div className="flex justify-between font-bold mb-1">
                          <span className="text-rose-600">Componente X: {vx}</span>
                        </div>
                        <input 
                          type="range" min="-5" max="5" value={vx} 
                          onChange={(e) => setVx(parseFloat(e.target.value))}
                          className="w-full accent-rose-500"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between font-bold mb-1">
                          <span className="text-emerald-600">Componente Y: {vy}</span>
                        </div>
                        <input 
                          type="range" min="-5" max="5" value={vy} 
                          onChange={(e) => setVy(parseFloat(e.target.value))}
                          className="w-full accent-emerald-600"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between font-bold mb-1">
                          <span className="text-blue-600">Componente Z: {vz}</span>
                        </div>
                        <input 
                          type="range" min="-5" max="5" value={vz} 
                          onChange={(e) => setVz(parseFloat(e.target.value))}
                          className="w-full accent-blue-600"
                        />
                      </div>

                      {/* Quiz Form Integrated */}
                      <form onSubmit={handleMathQuizSubmit} className="pt-2 border-t border-slate-100 space-y-2">
                        <label className="block font-bold text-slate-700 text-[11px]">
                          Comprobar Magnitud Teórica:
                        </label>
                        <div className="flex gap-2">
                          <input 
                            type="number"
                            step="0.01"
                            value={mathAnswer}
                            onChange={(e) => setMathAnswer(e.target.value)}
                            placeholder={`Ej: ${vectorMagnitude}`}
                            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-800 outline-none"
                            required
                          />
                          <button 
                            type="submit"
                            className="py-1.5 px-3 bg-primary text-white rounded-xl font-bold text-xs shadow-xs hover:bg-primary/90 flex items-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Validar</span>
                          </button>
                        </div>

                        {mathQuizResult && (
                          <div className={`p-2.5 rounded-xl border text-[11px] font-bold flex items-center gap-2 ${
                            mathQuizResult.success ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-rose-50 text-rose-800 border-rose-300'
                          }`}>
                            {mathQuizResult.success ? <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" /> : <X className="w-3.5 h-3.5 flex-shrink-0" />}
                            <span>{mathQuizResult.msg}</span>
                          </div>
                        )}
                      </form>
                    </div>
                  </div>
                </div>
              ) : isLit ? (
                /* LITERATURE MODULE (MACONDO) */
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      onClick={() => setMacondoHotspot({
                        id: 'casa-buendia',
                        title: 'La Casa Buendía & Laboratorio de Alquimia',
                        detail: 'Epicentro donde José Arcadio Buendía instaló los astrolabios, imanes y el gabinete de alquimia cedido por Melquíades, simbolizando la búsqueda humana del conocimiento.'
                      })}
                      className={`p-4 rounded-2xl border text-left transition-all ${
                        macondoHotspot.id === 'casa-buendia'
                          ? 'bg-amber-600 text-white border-amber-700 shadow-md scale-[1.02]'
                          : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      <Home className="w-5 h-5 mb-2" />
                      <div className="font-bold text-sm">Casa Buendía</div>
                      <div className="text-[11px] opacity-80">Laboratorio de alquimia</div>
                    </button>

                    <button
                      onClick={() => setMacondoHotspot({
                        id: 'castano',
                        title: 'El Castaño del Patio',
                        detail: 'El árbol donde José Arcadio Buendía permaneció atado por su aparente locura, dialogando en latín con el padre Nicanor sobre la eternidad.'
                      })}
                      className={`p-4 rounded-2xl border text-left transition-all ${
                        macondoHotspot.id === 'castano'
                          ? 'bg-emerald-600 text-white border-emerald-700 shadow-md scale-[1.02]'
                          : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      <TreePine className="w-5 h-5 mb-2" />
                      <div className="font-bold text-sm">El Castaño</div>
                      <div className="text-[11px] opacity-80">Soledad y memoria</div>
                    </button>

                    <button
                      onClick={() => setMacondoHotspot({
                        id: 'pescaditos',
                        title: 'Taller de los Pescaditos de Oro',
                        detail: 'Lugar donde el Coronel Aureliano Buendía fabrica y funde una y otra vez sus 32 pescaditos de oro, manifestación del tiempo cíclico de Macondo.'
                      })}
                      className={`p-4 rounded-2xl border text-left transition-all ${
                        macondoHotspot.id === 'pescaditos'
                          ? 'bg-rose-700 text-white border-rose-800 shadow-md scale-[1.02]'
                          : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      <Fish className="w-5 h-5 mb-2" />
                      <div className="font-bold text-sm">Pescaditos de Oro</div>
                      <div className="text-[11px] opacity-80">El tiempo circular</div>
                    </button>
                  </div>

                  {/* Detailed Analysis Box */}
                  <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
                    <div className="flex items-center gap-2 text-primary font-bold text-sm">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span>{macondoHotspot.title}</span>
                    </div>
                    <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-serif">
                      {macondoHotspot.detail}
                    </p>
                  </div>

                  {/* Essay Submission */}
                  <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                    {litSubmitted ? (
                      <div className="p-4 text-center space-y-2">
                        <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                        <div className="font-bold text-base text-slate-900">¡Ensayo Académico Recibido por el Docente!</div>
                        <div className="text-xs text-slate-500">
                          Tu texto ha sido registrado en la plataforma institucional para su evaluación formativa.
                        </div>
                      </div>
                    ) : (
                      <form onSubmit={handleLitEssaySubmit} className="space-y-3">
                        <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                          <FileText className="w-4 h-4 text-primary" />
                          <span>Taller de Crítica Literaria: Redacción Breve</span>
                        </h4>
                        <textarea
                          rows="4"
                          value={litEssayText}
                          onChange={(e) => setLitEssayText(e.target.value)}
                          placeholder="Escribe tu análisis argumentativo sobre el espacio simbólico seleccionado..."
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-primary"
                          required
                        />
                        <button
                          type="submit"
                          className="py-2.5 px-4 bg-primary text-white rounded-xl font-bold text-xs shadow-xs hover:bg-primary/90 flex items-center gap-2"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Enviar Entrega al Profesor</span>
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              ) : (
                /* BIOLOGY / GENERAL SUBJECT MODULE */
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      onClick={() => setSelectedOrganelle({
                        id: 'cloroplasto',
                        name: 'Cloroplasto de Páramo',
                        description: 'Altamente desarrollado para captar luz difusa en la neblina y metabolizar azúcares protegiéndose de la radiación UV mediante flavonoides.'
                      })}
                      className={`p-4 rounded-2xl border text-left transition-all ${
                        selectedOrganelle.id === 'cloroplasto'
                          ? 'bg-emerald-600 text-white border-emerald-700 shadow-md'
                          : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      <Leaf className="w-5 h-5 mb-2" />
                      <div className="font-bold text-sm">Cloroplasto</div>
                      <div className="text-[11px] opacity-80">Fotosíntesis de montaña</div>
                    </button>

                    <button
                      onClick={() => setSelectedOrganelle({
                        id: 'vacuola',
                        name: 'Vacuola Central Turgente',
                        description: 'Regula la presión hídrica y almacena sales minerales esenciales para resistir las heladas nocturnas de los páramos andinos.'
                      })}
                      className={`p-4 rounded-2xl border text-left transition-all ${
                        selectedOrganelle.id === 'vacuola'
                          ? 'bg-blue-600 text-white border-blue-700 shadow-md'
                          : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      <Droplet className="w-5 h-5 mb-2" />
                      <div className="font-bold text-sm">Vacuola Central</div>
                      <div className="text-[11px] opacity-80">Regulación osmótica</div>
                    </button>

                    <button
                      onClick={() => setSelectedOrganelle({
                        id: 'nucleo',
                        name: 'Núcleo y Expresión Genética',
                        description: 'Contiene el genoma con genes de resistencia al estrés térmico y adaptación única de la flora endémica colombiana (Espeletia).'
                      })}
                      className={`p-4 rounded-2xl border text-left transition-all ${
                        selectedOrganelle.id === 'nucleo'
                          ? 'bg-purple-600 text-white border-purple-700 shadow-md'
                          : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      <Dna className="w-5 h-5 mb-2" />
                      <div className="font-bold text-sm">Núcleo Celular</div>
                      <div className="text-[11px] opacity-80">Información genética</div>
                    </button>
                  </div>

                  <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-2">
                    <div className="flex items-center gap-2 font-bold text-slate-900">
                      <Info className="w-4 h-4 text-primary" />
                      <span>{selectedOrganelle.name}</span>
                    </div>
                    <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                      {selectedOrganelle.description}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: BIBLIOTECA & RECURSOS */}
          {activeTab === 'resources' && (
            <div className="space-y-4 max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-display font-bold text-base text-slate-900 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-primary" />
                  <span>Bibliografía & Referencias de Cátedra</span>
                </h3>
                <span className="text-xs text-slate-500">Normas APA 7ma / Clasificación Universitaria</span>
              </div>

              <div className="space-y-3">
                {resources.map((res, idx) => (
                  <div 
                    key={idx}
                    className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-blue-100 text-blue-900 border border-blue-200">
                          {res.type || 'Lectura Académica'}
                        </span>
                        {res.callNumber && (
                          <span className="text-[10px] font-mono font-bold text-slate-500">
                            {res.callNumber}
                          </span>
                        )}
                      </div>
                      <h4 className="font-display font-bold text-sm text-slate-900">
                        {res.title}
                      </h4>
                      <p className="text-xs text-slate-500">
                        Autor / Editor: {res.author || 'Departamento de Publicaciones'}
                      </p>
                    </div>

                    <button
                      onClick={handleDownloadSyllabus}
                      className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-primary hover:text-white text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-all self-start sm:self-auto"
                      title="Consultar recurso digital"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Consultar</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
