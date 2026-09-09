import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchHierarchy } from '../services/api';
import { 
  Network, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Move, 
  User, 
  Mail, 
  Phone, 
  Clock, 
  School, 
  BookOpen, 
  Users, 
  X, 
  ChevronRight, 
  ShieldCheck, 
  CheckCircle2, 
  Layers,
  Sparkles,
  Award
} from 'lucide-react';

export default function HierarchyTreePage() {
  const { sidebarOpen } = useAuth();
  
  const [hierarchyData, setHierarchyData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Pan and Zoom Canvas State
  const [scale, setScale] = useState(1);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Selected Person for the Details Accordion Panel
  const [selectedPerson, setSelectedPerson] = useState(null);

  // Search filter
  const [searchPerson, setSearchPerson] = useState('');

  const containerRef = useRef(null);

  useEffect(() => {
    loadHierarchy();
  }, []);

  const loadHierarchy = async () => {
    setLoading(true);
    const data = await fetchHierarchy();
    if (data) {
      setHierarchyData(data);
      // Select rector by default
      setSelectedPerson(data);
    }
    setLoading(false);
  };

  // Zoom Controls
  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.15, 1.8));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.15, 0.55));
  const handleReset = () => {
    setScale(1);
    setPanPosition({ x: 0, y: 0 });
  };

  // Pan / Drag Handlers
  const handleMouseDown = (e) => {
    // Only drag when clicking background, not inside interactive node cards
    if (e.target.closest('.interactive-node')) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - panPosition.x, y: e.clientY - panPosition.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPanPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  if (loading) {
    return (
      <div className={`flex-1 ${sidebarOpen ? 'md:ml-72' : 'md:ml-0'} p-8 flex items-center justify-center pt-32`}>
        <div className="text-center">
          <Network className="w-10 h-10 text-primary animate-pulse mx-auto mb-2" />
          <span className="text-xs font-bold text-slate-600">Construyendo Árbol de Jerarquía Institucional...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex-1 ${sidebarOpen ? 'md:ml-72' : 'md:ml-0'} p-4 sm:p-6 md:p-8 overflow-y-auto z-10 relative pt-20 md:pt-24 transition-all duration-300`}>
      
      {/* Header */}
      <header className="mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-extrabold uppercase px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-200 tracking-wider flex items-center gap-1.5">
                <Network className="w-3.5 h-3.5 text-amber-700" />
                <span>Organigrama & Gobierno Escolar</span>
              </span>
            </div>
            <h1 className="font-display font-black text-2xl sm:text-3xl md:text-4xl text-slate-900 tracking-tight">
              Jerarquía Institucional
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
              Explora la estructura directiva, coordinaciones académicas, cuerpo de profesores y salones asignados. Puedes desplazarte (arrastrar el lienzo), hacer zoom y pulsar sobre cualquier persona para desplegar el panel con su información detallada.
            </p>
          </div>

          {/* Canvas Floating Tools */}
          <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200 shadow-sm self-start sm:self-auto">
            <button
              onClick={handleZoomIn}
              className="p-2 rounded-xl hover:bg-slate-100 text-slate-700 transition-colors"
              title="Acercar (Zoom In)"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold text-slate-600 px-1 min-w-12 text-center">
              {Math.round(scale * 100)}%
            </span>
            <button
              onClick={handleZoomOut}
              className="p-2 rounded-xl hover:bg-slate-100 text-slate-700 transition-colors"
              title="Alejar (Zoom Out)"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <div className="w-px h-5 bg-slate-200 mx-1" />
            <button
              onClick={handleReset}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors"
              title="Restablecer vista centrada"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Centrar</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Interactive Viewport Layout (Canvas + Accordion Panel) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 relative">

        {/* Tree Canvas Area (8 cols on large screens, or full) */}
        <div 
          className="xl:col-span-8 bg-slate-900/5 rounded-3xl border border-slate-200/80 overflow-hidden shadow-inner relative h-[650px] sm:h-[720px] select-none flex flex-col"
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        >
          {/* Subtle Grid Background Pattern */}
          <div 
            className="absolute inset-0 opacity-40 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)',
              backgroundSize: '24px 24px'
            }}
          />

          {/* Instruction Badge */}
          <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-2 pointer-events-none">
            <Move className="w-3.5 h-3.5 text-primary animate-pulse" />
            <span className="text-[11px] font-bold text-slate-600">Arrastra para desplazar • Rueda o botones para Zoom</span>
          </div>

          {/* Zoomable & Pannable Container */}
          <div 
            className="flex-1 transition-transform duration-75 flex items-center justify-center p-12"
            style={{
              transform: `translate(${panPosition.x}px, ${panPosition.y}px) scale(${scale})`,
              transformOrigin: 'center center'
            }}
          >
            {/* Hierarchical Structure Node Tree */}
            <div className="flex flex-col items-center gap-8 min-w-[950px]">
              
              {/* LEVEL 1: RECTOR */}
              {hierarchyData && (
                <div className="flex flex-col items-center">
                  <div
                    onClick={() => setSelectedPerson(hierarchyData)}
                    className={`interactive-node cursor-pointer p-4 rounded-2xl bg-white/95 backdrop-blur-md border-2 transition-all shadow-md hover:scale-105 flex items-center gap-3.5 max-w-sm ${
                      selectedPerson?.id === hierarchyData.id 
                        ? 'border-primary ring-4 ring-primary/20 shadow-lg' 
                        : 'border-amber-300 hover:border-primary'
                    }`}
                  >
                    <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-primary shadow-xs flex-shrink-0">
                      <img src={hierarchyData.foto} alt={hierarchyData.nombre} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 tracking-wider">
                        Rectoría Principal
                      </span>
                      <h4 className="font-display font-black text-sm sm:text-base text-slate-900 leading-tight mt-0.5">
                        {hierarchyData.nombre}
                      </h4>
                      <p className="text-[11px] text-slate-500 font-medium truncate max-w-[200px]">
                        {hierarchyData.cargo}
                      </p>
                    </div>
                  </div>

                  {/* Vertical Connector */}
                  <div className="w-0.5 h-8 bg-amber-400" />
                </div>
              )}

              {/* LEVEL 2: DIRECTIVOS & COORDINACIONES */}
              <div className="flex flex-col items-center w-full">
                
                {/* Horizontal Bar for Coordinators */}
                <div className="w-[82%] h-0.5 bg-amber-300" />

                <div className="grid grid-cols-3 gap-6 w-full pt-4">
                  {hierarchyData?.hijos?.map((coord) => (
                    <div key={coord.id} className="flex flex-col items-center">
                      
                      {/* Coordinator Node */}
                      <div
                        onClick={() => setSelectedPerson(coord)}
                        className={`interactive-node cursor-pointer p-3.5 rounded-2xl bg-white/95 backdrop-blur-md border transition-all shadow-sm hover:scale-105 flex items-center gap-3 w-full max-w-xs ${
                          selectedPerson?.id === coord.id 
                            ? 'border-primary ring-4 ring-primary/20 shadow-md' 
                            : 'border-slate-200 hover:border-primary/60'
                        }`}
                      >
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-slate-300 flex-shrink-0 shadow-xs">
                          <img src={coord.foto} alt={coord.nombre} className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 tracking-wider block truncate max-w-fit">
                            {coord.area}
                          </span>
                          <h5 className="font-bold text-xs text-slate-900 leading-tight mt-0.5 truncate">
                            {coord.nombre}
                          </h5>
                          <p className="text-[10px] text-slate-500 truncate">
                            {coord.cargo}
                          </p>
                        </div>
                      </div>

                      {/* Vertical Connector to Teachers */}
                      {coord.hijos?.length > 0 && <div className="w-0.5 h-6 bg-slate-300" />}

                      {/* LEVEL 3: DOCENTES PER COORDINATION */}
                      <div className="flex flex-col gap-3 w-full mt-1">
                        {coord.hijos?.map((docente) => (
                          <div
                            key={docente.id}
                            onClick={() => setSelectedPerson(docente)}
                            className={`interactive-node cursor-pointer p-3 rounded-2xl bg-white/90 backdrop-blur-md border transition-all shadow-xs hover:scale-102 flex items-start gap-2.5 w-full ${
                              selectedPerson?.id === docente.id 
                                ? 'border-primary ring-2 ring-primary/30 shadow-md bg-amber-50/40' 
                                : 'border-slate-200/90 hover:border-slate-300'
                            }`}
                          >
                            <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 flex-shrink-0 mt-0.5">
                              <img src={docente.foto} alt={docente.nombre} className="w-full h-full object-cover" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-1">
                                <h6 className="font-bold text-xs text-slate-900 truncate">
                                  {docente.nombre}
                                </h6>
                              </div>
                              <p className="text-[10px] text-slate-500 truncate">
                                {docente.cargo}
                              </p>

                              {/* Salones Chips */}
                              {docente.salones && (
                                <div className="flex flex-wrap gap-1 mt-1.5">
                                  {docente.salones.map((s, idx) => (
                                    <span key={idx} className="text-[9px] font-bold px-1.5 py-0.5 bg-amber-100/70 text-amber-900 rounded-md">
                                      {s.grado}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                    </div>
                  ))}
                </div>

              </div>

            </div>
          </div>
        </div>

        {/* Accordion / Details Drawer Panel (4 cols on large screens) */}
        <div className="xl:col-span-4 space-y-4">
          {selectedPerson ? (
            <div className="bg-white/95 backdrop-blur-md rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-md animate-fadeIn space-y-5">
              
              {/* Profile Card Header */}
              <div className="flex items-start gap-4 pb-4 border-b border-slate-100">
                <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-primary shadow-md flex-shrink-0 p-0.5 bg-white">
                  <img 
                    src={selectedPerson.foto} 
                    alt={selectedPerson.nombre} 
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 tracking-wider inline-block mb-1">
                    {selectedPerson.area || 'Directiva'}
                  </span>
                  <h3 className="font-display font-black text-lg sm:text-xl text-slate-900 leading-tight">
                    {selectedPerson.nombre}
                  </h3>
                  <p className="text-xs text-slate-600 font-semibold mt-0.5">
                    {selectedPerson.cargo}
                  </p>
                  <div className="inline-flex items-center gap-1.5 mt-2 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>{selectedPerson.estado || 'Activo Institucional'}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200/70 text-xs text-slate-700 leading-relaxed font-normal">
                {selectedPerson.descripcion}
              </div>

              {/* Contact Information Accordion Section */}
              <div className="space-y-2.5">
                <span className="text-xs font-bold text-slate-700 uppercase block">
                  Canales de Comunicación
                </span>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white text-primary flex items-center justify-center shadow-xs flex-shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] text-slate-400 font-semibold block">Correo Electrónico</span>
                    <a href={`mailto:${selectedPerson.email}`} className="text-xs font-bold text-primary hover:underline truncate block">
                      {selectedPerson.email}
                    </a>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white text-primary flex items-center justify-center shadow-xs flex-shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] text-slate-400 font-semibold block">Teléfono / Conmutador</span>
                    <span className="text-xs font-bold text-slate-800 truncate block">
                      {selectedPerson.telefono || '+57 (1) 745-8900'}
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white text-primary flex items-center justify-center shadow-xs flex-shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] text-slate-400 font-semibold block">Horario de Despacho & Atención</span>
                    <span className="text-xs font-bold text-slate-800 truncate block">
                      {selectedPerson.horarioAtencion || 'Lunes a Viernes'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Salones y Cursos Asignados (Si es Docente) */}
              {selectedPerson.salones && selectedPerson.salones.length > 0 && (
                <div className="space-y-2.5 pt-2 border-t border-slate-100">
                  <span className="text-xs font-bold text-slate-700 uppercase block flex items-center gap-1.5">
                    <School className="w-4 h-4 text-primary" />
                    <span>Salones & Asignaturas a Cargo ({selectedPerson.salones.length})</span>
                  </span>

                  <div className="space-y-2">
                    {selectedPerson.salones.map((item, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/80 flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-primary px-2 py-0.5 rounded bg-white shadow-xs">
                              {item.grado}
                            </span>
                            <span className="text-xs font-bold text-slate-900">
                              {item.materia}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-500 block mt-1">
                            Ubicación: <strong>{item.aula}</strong>
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] font-bold text-slate-600 bg-white px-2 py-1 rounded-md border border-slate-200">
                            {item.estudiantes} Alumnos
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          ) : (
            <div className="bg-white/80 rounded-3xl p-8 border border-slate-200 text-center">
              <User className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-600">Selecciona a una persona en el árbol</p>
              <p className="text-[11px] text-slate-400 mt-1">
                Haz clic sobre el rector, un coordinador o profesor para abrir su ficha completa.
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
