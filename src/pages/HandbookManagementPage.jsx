import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchHandbook, saveHandbook } from '../services/api';
import { 
  BookOpen, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  ShieldCheck, 
  FileCheck, 
  CheckCircle2, 
  AlertCircle,
  FolderPlus,
  Search,
  ChevronDown,
  ChevronUp,
  Layers,
  Sparkles
} from 'lucide-react';

export default function HandbookManagementPage() {
  const { sidebarOpen, addNotification } = useAuth();

  const [handbook, setHandbook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Selected or Expanded Chapter
  const [expandedChapter, setExpandedChapter] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal / Form for New Article
  const [showArticleModal, setShowArticleModal] = useState(false);
  const [targetChapterId, setTargetChapterId] = useState(1);
  const [newArticleNumber, setNewArticleNumber] = useState('');
  const [newArticleTitle, setNewArticleTitle] = useState('');
  const [newArticleContent, setNewArticleContent] = useState('');

  // Modal / Form for New Chapter
  const [showChapterModal, setShowChapterModal] = useState(false);
  const [newChapterNumber, setNewChapterNumber] = useState('');
  const [newChapterTitle, setNewChapterTitle] = useState('');
  const [newChapterDesc, setNewChapterDesc] = useState('');

  useEffect(() => {
    loadHandbookData();
  }, []);

  const loadHandbookData = async () => {
    setLoading(true);
    const data = await fetchHandbook();
    if (data) {
      setHandbook(data);
    }
    setLoading(false);
  };

  const handleSaveHandbook = async () => {
    if (!handbook) return;
    setSaving(true);
    await saveHandbook(handbook);
    setSaving(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);

    if (addNotification) {
      addNotification({
        title: 'Manual de Convivencia Actualizado',
        text: 'Rectoría ha publicado una nueva versión revisada del Manual de Convivencia escolar.',
        icon: 'menu_book',
        color: 'text-primary',
        targetRole: 'DOCENTE'
      });
      addNotification({
        title: 'Reglamento Escolar Publicado',
        text: 'Se han actualizado los capítulos y normas del Manual de Convivencia escolar.',
        icon: 'menu_book',
        color: 'text-primary',
        targetRole: 'ESTUDIANTE'
      });
    }
  };

  const handleAddChapter = (e) => {
    e.preventDefault();
    if (!newChapterTitle.trim()) return;

    const newCap = {
      id: Date.now(),
      numero: newChapterNumber || `Capítulo ${(handbook?.capitulos?.length || 0) + 1}`,
      titulo: newChapterTitle,
      descripcion: newChapterDesc || 'Normativa institucional complementaria.',
      articulos: []
    };

    setHandbook(prev => ({
      ...prev,
      capitulos: [...(prev?.capitulos || []), newCap]
    }));

    setNewChapterNumber('');
    setNewChapterTitle('');
    setNewChapterDesc('');
    setShowChapterModal(false);
    setExpandedChapter(newCap.id);
  };

  const handleDeleteChapter = (capId) => {
    if (window.confirm('¿Deseas eliminar este capítulo y todos sus artículos?')) {
      setHandbook(prev => ({
        ...prev,
        capitulos: prev.capitulos.filter(c => c.id !== capId)
      }));
    }
  };

  const handleAddArticle = (e) => {
    e.preventDefault();
    if (!newArticleTitle.trim() || !newArticleContent.trim()) return;

    const newArt = {
      id: Date.now(),
      numero: newArticleNumber || `Artículo ${(Math.floor(Math.random() * 80) + 10)}`,
      titulo: newArticleTitle,
      contenido: newArticleContent
    };

    setHandbook(prev => ({
      ...prev,
      capitulos: prev.capitulos.map(cap => {
        if (cap.id === targetChapterId) {
          return {
            ...cap,
            articulos: [...cap.articulos, newArt]
          };
        }
        return cap;
      })
    }));

    setNewArticleNumber('');
    setNewArticleTitle('');
    setNewArticleContent('');
    setShowArticleModal(false);
  };

  const handleDeleteArticle = (chapterId, articleId) => {
    if (window.confirm('¿Seguro que deseas remover este artículo del manual?')) {
      setHandbook(prev => ({
        ...prev,
        capitulos: prev.capitulos.map(cap => {
          if (cap.id === chapterId) {
            return {
              ...cap,
              articulos: cap.articulos.filter(a => a.id !== articleId)
            };
          }
          return cap;
        })
      }));
    }
  };

  const handleArticleTextChange = (chapterId, articleId, field, value) => {
    setHandbook(prev => ({
      ...prev,
      capitulos: prev.capitulos.map(cap => {
        if (cap.id === chapterId) {
          return {
            ...cap,
            articulos: cap.articulos.map(art => {
              if (art.id === articleId) {
                return { ...art, [field]: value };
              }
              return art;
            })
          };
        }
        return cap;
      })
    }));
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

  return (
    <div className={`flex-1 ${sidebarOpen ? 'md:ml-72' : 'md:ml-0'} p-4 sm:p-6 md:p-8 overflow-y-auto z-10 relative pt-20 md:pt-24 transition-all duration-300`}>
      
      {/* Header Banner */}
      <header className="mb-6 md:mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-extrabold uppercase px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-200 tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                <span>Rectoría & Consejo Directivo</span>
              </span>
            </div>
            <h1 className="font-display font-black text-2xl sm:text-3xl md:text-4xl text-slate-900 tracking-tight">
              Redacción del Manual de Convivencia
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
              Crea, edita y administra los capítulos, artículos y normas institucionales del colegio. Todas las actualizaciones que guardes aquí se reflejarán de inmediato en el apartado del profesor y de la comunidad.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {savedSuccess && (
              <div className="inline-flex items-center gap-2 px-3.5 py-2 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold rounded-xl animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Manual publicado con éxito</span>
              </div>
            )}

            <button
              onClick={() => setShowChapterModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-300 text-slate-800 font-bold text-xs sm:text-sm rounded-xl shadow-xs hover:bg-slate-50 transition-all"
            >
              <FolderPlus className="w-4 h-4 text-primary" />
              <span>Nuevo Capítulo</span>
            </button>

            <button
              onClick={handleSaveHandbook}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-bold text-xs sm:text-sm rounded-xl shadow-md hover:bg-primary/95 active:scale-95 transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Guardando...' : 'Guardar y Publicar Manual'}</span>
            </button>
          </div>
        </div>

        {/* Search and Metadata Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 mt-6 items-center justify-between bg-white/70 backdrop-blur-md p-3 rounded-2xl border border-slate-200">
          <div className="flex items-center gap-2 w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 ml-2" />
            <input
              type="text"
              placeholder="Buscar por artículo, falta o norma..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-xs sm:text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400"
            />
          </div>

          <div className="text-[11px] font-semibold text-slate-500 flex items-center gap-3">
            <span>Vigencia: <strong className="text-slate-800">{handbook?.vigencia}</strong></span>
            <span>•</span>
            <span>Última Actualización: <strong className="text-slate-800">{handbook?.ultimaActualizacion}</strong></span>
          </div>
        </div>
      </header>

      {/* Chapters & Articles List */}
      <div className="space-y-6 max-w-5xl">
        {handbook?.capitulos?.map((chapter) => {
          const isExpanded = expandedChapter === chapter.id;
          const filteredArticles = chapter.articulos.filter(art => 
            art.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
            art.contenido.toLowerCase().includes(searchQuery.toLowerCase()) ||
            art.numero.toLowerCase().includes(searchQuery.toLowerCase())
          );

          if (searchQuery && filteredArticles.length === 0) return null;

          return (
            <div key={chapter.id} className="bg-white/85 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden transition-all">
              
              {/* Chapter Header Banner */}
              <div 
                onClick={() => setExpandedChapter(isExpanded ? null : chapter.id)}
                className="p-4 sm:p-5 bg-gradient-to-r from-amber-50/70 to-white flex items-center justify-between cursor-pointer border-b border-slate-100 hover:bg-amber-50/90 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center shadow-xs flex-shrink-0 font-bold text-xs">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-extrabold text-primary uppercase tracking-wider">{chapter.numero}</span>
                      <span className="text-[11px] font-bold text-slate-400">• {chapter.articulos.length} Artículos</span>
                    </div>
                    <h3 className="font-display font-black text-base sm:text-lg text-slate-900 leading-tight">
                      {chapter.titulo}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setTargetChapterId(chapter.id);
                      setShowArticleModal(true);
                    }}
                    className="p-1.5 sm:px-3 sm:py-1.5 bg-white hover:bg-amber-100/60 border border-slate-200 text-primary font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
                    title="Añadir artículo a este capítulo"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Agregar Artículo</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteChapter(chapter.id);
                    }}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                    title="Eliminar capítulo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="text-slate-400 ml-1">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </div>
              </div>

              {/* Chapter Content / Articles */}
              {isExpanded && (
                <div className="p-4 sm:p-6 space-y-4">
                  <p className="text-xs text-slate-500 italic pb-2 border-b border-slate-100">
                    {chapter.descripcion}
                  </p>

                  {filteredArticles.length === 0 ? (
                    <div className="text-center py-6 text-slate-400 text-xs font-semibold">
                      No hay artículos registrados en este capítulo aún. Haz clic en "Agregar Artículo".
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredArticles.map((art) => (
                        <div key={art.id} className="p-4 rounded-xl border border-slate-200/90 bg-slate-50/50 hover:bg-white transition-all space-y-2.5 group">
                          
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2 flex-1">
                              <input
                                type="text"
                                value={art.numero}
                                onChange={(e) => handleArticleTextChange(chapter.id, art.id, 'numero', e.target.value)}
                                className="w-28 bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-black text-primary outline-none focus:ring-1 focus:ring-primary"
                              />
                              <input
                                type="text"
                                value={art.titulo}
                                onChange={(e) => handleArticleTextChange(chapter.id, art.id, 'titulo', e.target.value)}
                                className="flex-1 bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs sm:text-sm font-bold text-slate-900 outline-none focus:ring-1 focus:ring-primary"
                              />
                            </div>

                            <button
                              onClick={() => handleDeleteArticle(chapter.id, art.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                              title="Eliminar artículo"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <textarea
                            rows={3}
                            value={art.contenido}
                            onChange={(e) => handleArticleTextChange(chapter.id, art.id, 'contenido', e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs sm:text-sm text-slate-700 font-medium outline-none focus:ring-1 focus:ring-primary leading-relaxed resize-y"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="pt-2 flex justify-start">
                    <button
                      type="button"
                      onClick={() => {
                        setTargetChapterId(chapter.id);
                        setShowArticleModal(true);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-primary font-bold text-xs rounded-xl border border-amber-200 transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Agregar Otro Artículo a {chapter.numero}</span>
                    </button>
                  </div>
                </div>
              )}

            </div>
          );
        })}
      </div>

      {/* MODAL: ADD ARTICLE */}
      {showArticleModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 animate-fadeIn">
            <h3 className="font-display font-black text-lg text-slate-900 mb-1 flex items-center gap-2">
              <Plus className="w-5 h-5 text-primary" />
              <span>Añadir Nuevo Artículo</span>
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Ingresa los detalles del artículo reglamentario para el capítulo seleccionado.
            </p>

            <form onSubmit={handleAddArticle} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Número / Identificador
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Artículo 11"
                  value={newArticleNumber}
                  onChange={(e) => setNewArticleNumber(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Título del Artículo
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Protocolo de Mediación y Salidas Pedagógicas"
                  value={newArticleTitle}
                  onChange={(e) => setNewArticleTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Contenido Normativo y Alcance
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe la regla, deber, derecho o protocolo aplicable..."
                  value={newArticleContent}
                  onChange={(e) => setNewArticleContent(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs sm:text-sm font-medium outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowArticleModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary text-white font-bold text-xs rounded-xl shadow-md hover:bg-primary/95 transition-all"
                >
                  Añadir Artículo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD CHAPTER */}
      {showChapterModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 animate-fadeIn">
            <h3 className="font-display font-black text-lg text-slate-900 mb-1 flex items-center gap-2">
              <FolderPlus className="w-5 h-5 text-primary" />
              <span>Crear Nuevo Capítulo</span>
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Agrupa artículos relacionados bajo una sección temática oficial.
            </p>

            <form onSubmit={handleAddChapter} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Número de Capítulo
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Capítulo VI"
                  value={newChapterNumber}
                  onChange={(e) => setNewChapterNumber(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Título del Capítulo
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Rutas de Atención y Bienestar Estudiantil"
                  value={newChapterTitle}
                  onChange={(e) => setNewChapterTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Descripción o Propósito del Capítulo
                </label>
                <textarea
                  rows={3}
                  placeholder="Resumen del marco que cubre este capítulo..."
                  value={newChapterDesc}
                  onChange={(e) => setNewChapterDesc(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs sm:text-sm font-medium outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowChapterModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary text-white font-bold text-xs rounded-xl shadow-md hover:bg-primary/95 transition-all"
                >
                  Crear Capítulo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
