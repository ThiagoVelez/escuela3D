import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
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
  ArrowRight
} from 'lucide-react';

export default function SubjectDetailModal({ subject, onClose }) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('interactive'); // 'interactive', 'syllabus', 'quiz'

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

  const isMath = subject.code === 'MAT-3D' || subject.title?.toLowerCase().includes('matemática');
  const isLit = subject.code === 'LIT-3D' || subject.title?.toLowerCase().includes('literatura');
  const isBio = subject.code === 'BIO-3D' || subject.title?.toLowerCase().includes('biología');

  // Calculate Vector Magnitude
  const vectorMagnitude = Math.sqrt(vx * vx + vy * vy + vz * vz).toFixed(2);

  const handleMathQuizSubmit = (e) => {
    e.preventDefault();
    const correct = Math.abs(parseFloat(mathAnswer) - parseFloat(vectorMagnitude)) < 0.2;
    if (correct) {
      setMathQuizResult({
        success: true,
        msg: `¡Cálculo correcto! Magnitud calculada: ${vectorMagnitude} u. El docente ha recibido tu entrega.`
      });
    } else {
      setMathQuizResult({
        success: false,
        msg: `El resultado no coincide. Revisa la raíz: √(${vx}² + ${vy}² + ${vz}²) = ${vectorMagnitude} u.`
      });
    }
  };

  const handleLitEssaySubmit = (e) => {
    e.preventDefault();
    if (!litEssayText.trim()) return;
    setLitSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-5xl max-h-[92vh] bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-slate-200">
        
        {/* Top Header */}
        <div className="px-5 py-4 border-b border-slate-200/80 flex items-center justify-between bg-slate-50/80 backdrop-blur-md flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary text-white flex items-center justify-center shadow-md font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-bold text-lg md:text-xl text-slate-900 leading-tight">
                  {subject.title}
                </h2>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                  {subject.code || 'ASIG-2026'}
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Docente: {subject.teacher || 'Docente Institucional'} • Grado: {user?.grado || '10° Bachillerato'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-slate-200/80 hover:bg-rose-100 hover:text-rose-600 text-slate-600 flex items-center justify-center transition-colors"
              title="Cerrar ventana"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-white px-4 sm:px-6 gap-2 sm:gap-4 flex-shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveTab('interactive')}
            className={`py-3 px-3 sm:px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'interactive'
                ? 'border-primary text-primary'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Módulo de Aprendizaje</span>
          </button>
          <button
            onClick={() => setActiveTab('syllabus')}
            className={`py-3 px-3 sm:px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'syllabus'
                ? 'border-primary text-primary'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Programa Académico</span>
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`py-3 px-3 sm:px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'quiz'
                ? 'border-primary text-primary'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Taller & Evaluación</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/50">
          
          {/* TAB 1: INTERACTIVE LEARNING (LIGHTWEIGHT 2D/SVG) */}
          {activeTab === 'interactive' && (
            <div>
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
                        <span className="text-xs font-bold bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full">
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
                      <span>Proyección ortogonal vectorial sin sobrecarga gráfica.</span>
                      <span className="font-semibold text-primary">Cálculo en tiempo real</span>
                    </div>
                  </div>

                  {/* Right: Controls & Parameters */}
                  <div className="lg:col-span-5 space-y-4">
                    {/* Magnitude Display */}
                    <div className="p-4 bg-primary/10 rounded-2xl border border-primary/20 flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-slate-600">Magnitud Escalar |v|</div>
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

                      <button 
                        onClick={() => setActiveTab('quiz')}
                        className="w-full mt-2 py-2.5 px-4 bg-primary text-white rounded-xl font-bold text-xs shadow hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                      >
                        <span>Completar Ejercicio de Clase</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
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
                          ? 'bg-amber-500 text-white border-amber-600 shadow-md scale-[1.02]'
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
                          ? 'bg-amber-600 text-white border-amber-700 shadow-md scale-[1.02]'
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
                    <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                      {macondoHotspot.detail}
                    </p>
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

          {/* TAB 2: SYLLABUS */}
          {activeTab === 'syllabus' && (
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <div className="font-bold text-sm text-slate-900">Unidad 1: Fundamentos y Conceptos Clave</div>
                  <div className="text-xs text-slate-500">Definiciones principales, contexto y aplicaciones prácticas.</div>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">Nota: 5.0 (Aprobado)</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <div className="font-bold text-sm text-slate-900">Unidad 2: Desarrollo y Análisis de Casos</div>
                  <div className="text-xs text-slate-500">Resolución de problemas contextualizados a Colombia.</div>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">Nota: 4.8 (Aprobado)</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-primary/30 shadow-sm flex items-center justify-between">
                <div>
                  <div className="font-bold text-sm text-slate-900">Unidad 3: Taller Integral & Proyecto Final (En Curso)</div>
                  <div className="text-xs text-slate-600">Evaluación de competencias y entrega de resultados.</div>
                </div>
                <span className="px-3 py-1 rounded-full bg-primary/15 text-primary font-bold text-xs">Avance 75%</span>
              </div>
            </div>
          )}

          {/* TAB 3: QUIZ & EVALUATION */}
          {activeTab === 'quiz' && (
            <div className="max-w-2xl mx-auto bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              {isMath ? (
                <form onSubmit={handleMathQuizSubmit} className="space-y-4 text-xs">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-primary bg-primary/10 px-2 py-0.5 rounded-md mb-2 inline-block">
                      Evaluación de Matemáticas
                    </span>
                    <h3 className="font-display font-bold text-xl text-slate-900 mb-2">
                      Cálculo de Magnitud Vectorial
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      Dado el vector <strong>v = ({vx}, {vy}, {vz})</strong>, calcula la magnitud escalar aplicando el teorema de Pitágoras espacial.
                    </p>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Ingresa el valor de |v|:
                    </label>
                    <input 
                      type="number"
                      step="0.01"
                      value={mathAnswer}
                      onChange={(e) => setMathAnswer(e.target.value)}
                      placeholder={`Ejemplo: ${vectorMagnitude}`}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary font-bold text-sm"
                      required
                    />
                  </div>

                  {mathQuizResult && (
                    <div className={`p-3.5 rounded-xl border text-xs font-bold flex items-center gap-2 ${
                      mathQuizResult.success ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-rose-50 text-rose-800 border-rose-300'
                    }`}>
                      {mathQuizResult.success ? <CheckCircle2 className="w-4 h-4" /> : <X className="w-4 h-4" />}
                      <span>{mathQuizResult.msg}</span>
                    </div>
                  )}

                  <button 
                    type="submit"
                    className="w-full py-3 px-4 bg-primary text-white rounded-xl font-bold text-xs shadow hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    Validar Respuesta y Enviar al Docente
                  </button>
                </form>
              ) : (
                <div>
                  {litSubmitted ? (
                    <div className="p-6 text-center space-y-2">
                      <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                      <div className="font-bold text-base text-slate-900">¡Trabajo Académico Entregado con Éxito!</div>
                      <div className="text-xs text-slate-500">
                        Tu entrega ha sido enviada al docente para su revisión y calificación.
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleLitEssaySubmit} className="space-y-4 text-xs">
                      <h3 className="font-display font-bold text-xl text-slate-900 mb-1">
                        Taller de Análisis y Redacción
                      </h3>
                      <p className="text-slate-600 leading-relaxed mb-3">
                        Redacta tu análisis sobre los elementos simbólicos vistos en el módulo interactivo.
                      </p>
                      <textarea
                        rows="5"
                        value={litEssayText}
                        onChange={(e) => setLitEssayText(e.target.value)}
                        placeholder="Escribe aquí tu análisis..."
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary text-slate-800 text-xs"
                        required
                      />
                      <button 
                        type="submit"
                        className="w-full py-3 px-4 bg-primary text-white rounded-xl font-bold text-xs shadow hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                      >
                        <Send className="w-4 h-4" />
                        Enviar Entrega al Docente
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
