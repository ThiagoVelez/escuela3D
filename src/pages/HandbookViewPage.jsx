import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchHandbook } from '../services/api';
import { 
  BookOpen, 
  Search, 
  ShieldCheck, 
  Award, 
  Printer, 
  Bookmark, 
  CheckCircle2, 
  FileText,
  ChevronRight,
  ExternalLink,
  Layers
} from 'lucide-react';

export default function HandbookViewPage() {
  const { sidebarOpen, institutionName, schoolCrest } = useAuth();

  const [handbook, setHandbook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChapterId, setSelectedChapterId] = useState(null);

  useEffect(() => {
    loadHandbook();
  }, []);

  const loadHandbook = async () => {
    setLoading(true);
    const data = await fetchHandbook();
    if (data) {
      setHandbook(data);
      if (data.capitulos?.length > 0) {
        setSelectedChapterId(data.capitulos[0].id);
      }
    }
    setLoading(false);
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className={`flex-1 ${sidebarOpen ? 'md:ml-72' : 'md:ml-0'} p-8 flex items-center justify-center pt-32`}>
        <div className="text-center">
          <BookOpen className="w-10 h-10 text-primary animate-pulse mx-auto mb-2" />
          <span className="text-xs font-bold text-slate-600">Cargando Manual de Convivencia...</span>
        </div>
      </div>
    );
  }

  const allArticles = handbook?.capitulos?.flatMap(cap => 
    cap.articulos.map(art => ({ ...art, chapterTitle: cap.titulo, chapterNumero: cap.numero }))
  ) || [];

  const filteredArticles = searchQuery.trim()
    ? allArticles.filter(art => 
        art.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.contenido.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.numero.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.chapterTitle.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : null;

  const currentChapter = handbook?.capitulos?.find(c => c.id === selectedChapterId) || handbook?.capitulos?.[0];

  return (
    <div className={`flex-1 ${sidebarOpen ? 'md:ml-72' : 'md:ml-0'} p-4 sm:p-6 md:p-8 overflow-y-auto z-10 relative pt-20 md:pt-24 transition-all duration-300 print:p-0 print:m-0`}>
      
      {/* Header Banner */}
      <header className="mb-6 md:mb-8 print:hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-extrabold uppercase px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-200 tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                <span>Normativa Oficial & Reglamento Institucional</span>
              </span>
            </div>
            <h1 className="font-display font-black text-2xl sm:text-3xl md:text-4xl text-slate-900 tracking-tight">
              Manual de Convivencia
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
              Documento rector de deberes, derechos, faltas pedagógicas y acuerdos de convivencia escolar de la {institutionName}.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all"
              title="Imprimir o exportar a PDF"
            >
              <Printer className="w-4 h-4 text-primary" />
              <span>Imprimir / PDF</span>
            </button>
          </div>
        </div>

        {/* Official Validation Ribbon */}
        <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-amber-50/80 via-white to-amber-50/40 border border-amber-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-amber-200 flex items-center justify-center shadow-xs flex-shrink-0 p-1">
              {schoolCrest ? (
                <img src={schoolCrest} alt="Escudo" className="w-full h-full object-cover rounded" />
              ) : (
                <Award className="w-5 h-5 text-primary" />
              )}
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                {handbook?.titulo || 'Manual de Convivencia Escolar'}
              </h4>
              <p className="text-[11px] text-slate-500">
                Aprobado por: <strong className="text-slate-700">{handbook?.aprobadoPor}</strong> • Vigencia: <strong className="text-slate-700">{handbook?.vigencia}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 self-start sm:self-auto">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Versión Oficial en Vigencia</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-4 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por artículo, derecho, deber, falta o sanción..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm font-medium text-slate-800 outline-none focus:ring-2 focus:ring-primary/40 shadow-xs placeholder:text-slate-400"
          />
        </div>
      </header>

      {/* Main Layout */}
      {searchQuery.trim() ? (
        /* Search Results View */
        <div className="space-y-4 max-w-4xl">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <span className="text-xs font-bold text-slate-700 uppercase">
              Resultados de búsqueda ({filteredArticles?.length || 0} encontrados)
            </span>
            <button 
              onClick={() => setSearchQuery('')}
              className="text-xs font-bold text-primary hover:underline"
            >
              Limpiar búsqueda
            </button>
          </div>

          {filteredArticles?.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
              <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-600">No se encontraron artículos con ese término.</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Intenta con palabras como "asistencia", "faltas", "deberes" o "derechos".</p>
            </div>
          ) : (
            filteredArticles?.map((art) => (
              <div key={art.id} className="bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                    {art.chapterNumero}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-500">
                    {art.chapterTitle}
                  </span>
                </div>
                <h4 className="font-display font-black text-base text-slate-900">
                  <span className="text-primary">{art.numero}:</span> {art.titulo}
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 font-normal leading-relaxed">
                  {art.contenido}
                </p>
              </div>
            ))
          )}
        </div>
      ) : (
        /* Chapter by Chapter Reader Layout */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-6xl">
          
          {/* Chapter Selector Sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-2 print:hidden">
            <span className="block text-xs font-bold text-slate-700 uppercase px-1 mb-2 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-primary" />
              <span>Índice de Capítulos</span>
            </span>

            <div className="space-y-1.5">
              {handbook?.capitulos?.map((cap) => {
                const isSelected = selectedChapterId === cap.id;
                return (
                  <button
                    key={cap.id}
                    onClick={() => setSelectedChapterId(cap.id)}
                    className={`w-full text-left p-3.5 rounded-xl transition-all border flex items-center justify-between group ${
                      isSelected
                        ? 'bg-primary text-white border-primary shadow-md'
                        : 'bg-white/80 hover:bg-white text-slate-700 border-slate-200/80 hover:border-slate-300'
                    }`}
                  >
                    <div className="min-w-0 pr-2">
                      <span className={`block text-[10px] font-extrabold uppercase tracking-wider ${isSelected ? 'text-amber-200' : 'text-primary'}`}>
                        {cap.numero}
                      </span>
                      <h5 className={`font-bold text-xs sm:text-sm truncate leading-tight mt-0.5 ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                        {cap.titulo}
                      </h5>
                    </div>
                    <ChevronRight className={`w-4 h-4 flex-shrink-0 transition-transform ${isSelected ? 'translate-x-1 text-amber-200' : 'text-slate-400 group-hover:translate-x-0.5'}`} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Chapter Reader View (8 cols) */}
          <div className="lg:col-span-8">
            {currentChapter ? (
              <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
                
                {/* Chapter Title Header */}
                <div className="pb-4 border-b border-slate-200">
                  <span className="text-[11px] font-extrabold text-primary uppercase tracking-widest block mb-1">
                    {currentChapter.numero}
                  </span>
                  <h2 className="font-display font-black text-xl sm:text-2xl text-slate-900 leading-tight">
                    {currentChapter.titulo}
                  </h2>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed italic">
                    {currentChapter.descripcion}
                  </p>
                </div>

                {/* Articles */}
                <div className="space-y-6">
                  {currentChapter.articulos.map((art) => (
                    <article key={art.id} className="p-4 sm:p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-primary uppercase px-2.5 py-0.5 rounded-lg bg-amber-100/80 border border-amber-200">
                          {art.numero}
                        </span>
                        <h4 className="font-display font-bold text-sm sm:text-base text-slate-900">
                          {art.titulo}
                        </h4>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal pt-1">
                        {art.contenido}
                      </p>
                    </article>
                  ))}
                </div>

                {/* Chapter Footer */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Documento oficial de consulta para el cuerpo docente y administrativo</span>
                  <span>{currentChapter.articulos.length} artículos vigentes</span>
                </div>

              </div>
            ) : null}
          </div>

        </div>
      )}

    </div>
  );
}
