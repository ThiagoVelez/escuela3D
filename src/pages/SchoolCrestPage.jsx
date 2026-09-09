import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  ShieldCheck, 
  Upload, 
  Image as ImageIcon, 
  Check, 
  RefreshCw, 
  Eye, 
  Award, 
  Building2, 
  CheckCircle2, 
  AlertCircle,
  GraduationCap
} from 'lucide-react';
import { cleanText } from '../utils/textSanitizer';

const PRESET_CRESTS = [
  {
    id: 'preset-1',
    name: 'Blasón Circular Dorado',
    format: 'Circular (1:1)',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="%23fef3c7" stroke="%23b45309" stroke-width="4"/><circle cx="50" cy="50" r="38" fill="%23ffffff" stroke="%23d97706" stroke-width="2"/><path d="M50 20 L58 36 L76 36 L62 48 L67 66 L50 55 L33 66 L38 48 L24 36 L42 36 Z" fill="%23d97706"/><text x="50" y="82" font-size="8.5" font-family="sans-serif" font-weight="900" fill="%2378350f" text-anchor="middle">EXCELENCIA</text></svg>'
  },
  {
    id: 'preset-2',
    name: 'Insignia Horizontal Banner (ECN)',
    format: 'Horizontal (Banner)',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 80"><rect width="220" height="80" rx="14" fill="%23ffffff" stroke="%230284c7" stroke-width="3"/><path d="M14 40 Q50 16 110 40 T206 40" stroke="%2338bdf8" stroke-width="4" fill="none"/><text x="110" y="48" font-size="28" font-family="sans-serif" font-weight="900" fill="%230369a1" text-anchor="middle" letter-spacing="3">ECN</text><text x="110" y="68" font-size="8.5" font-family="sans-serif" font-weight="bold" fill="%230284c7" text-anchor="middle">COLEGIO NACIONAL</text></svg>'
  },
  {
    id: 'preset-3',
    name: 'Escudo Heráldico Real',
    format: 'Vertical Tradicional',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 120"><path d="M10 10 H90 V70 Q90 110 50 120 Q10 110 10 70 Z" fill="%230f172a" stroke="%23f59e0b" stroke-width="4"/><path d="M16 16 H84 V68 Q84 104 50 113 Q16 104 16 68 Z" fill="%231e3a8a"/><path d="M50 16 V113 M16 60 H84" stroke="%23fcd34d" stroke-width="3"/><circle cx="50" cy="38" r="13" fill="%23f59e0b"/><polygon points="50,72 56,84 70,84 59,92 63,105 50,96 37,105 41,92 30,84 44,84" fill="%23ffffff"/></svg>'
  },
  {
    id: 'preset-4',
    name: 'Emblema Científico & 3D',
    format: 'Hexagonal Moderno',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><polygon points="50,6 90,28 90,72 50,94 10,72 10,28" fill="%23064e3b" stroke="%2310b981" stroke-width="4"/><circle cx="50" cy="50" r="22" fill="%23047857" stroke="%236ee7b7" stroke-width="2"/><text x="50" y="56" font-size="14" font-weight="900" font-family="sans-serif" fill="%23ecfdf5" text-anchor="middle">3D</text></svg>'
  },
  {
    id: 'preset-5',
    name: 'Academia Andina Institucional',
    format: 'Emblema Universitario',
    url: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=300&auto=format&fit=crop&q=80'
  }
];

export default function SchoolCrestPage() {
  const { 
    sidebarOpen, 
    schoolCrest, 
    institutionName, 
    updateSchoolCrest, 
    addNotification 
  } = useAuth();

  const [selectedCrest, setSelectedCrest] = useState(schoolCrest || PRESET_CRESTS[0].url);
  const [instName, setInstName] = useState(institutionName || 'Institución Educativa Colombian Future');
  const [motto, setMotto] = useState('Ciencia, Innovación & Excelencia Inmersiva');
  const [customUrl, setCustomUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // File Upload to Base64
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido (PNG, JPG, SVG o WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setSelectedCrest(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveCrest = async (e) => {
    e.preventDefault();
    setSaving(true);
    await updateSchoolCrest(selectedCrest, instName);
    setSaving(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);

    if (addNotification) {
      addNotification({
        title: 'Escudo Oficial Actualizado',
        text: 'Rectoría ha publicado el nuevo escudo institucional para toda la comunidad académica.',
        icon: 'shield',
        color: 'text-primary',
        targetRole: 'ESTUDIANTE'
      });
      addNotification({
        title: 'Nueva Identidad Institucional',
        text: 'El escudo del colegio ha sido actualizado en las cabeceras y reportes oficiales.',
        icon: 'shield',
        color: 'text-primary',
        targetRole: 'DOCENTE'
      });
    }
  };

  return (
    <div className={`flex-1 ${sidebarOpen ? 'md:ml-72' : 'md:ml-0'} p-4 sm:p-6 md:p-8 overflow-y-auto z-10 relative pt-20 md:pt-24 transition-all duration-300`}>
      
      {/* Header Banner */}
      <header className="mb-6 md:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-extrabold uppercase px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-200 tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                <span>Gestión de Identidad & Membrete Institucional</span>
              </span>
            </div>
            <h1 className="font-display font-black text-2xl sm:text-3xl md:text-4xl text-slate-900 tracking-tight">
              Escudo del Colegio
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
              Carga o selecciona la insignia oficial de la institución. Este escudo se exhibirá de manera automática en el encabezado (Navbar), boletines y perfil de todos los estudiantes y docentes.
            </p>
          </div>

          {savedSuccess && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold rounded-xl animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Escudo publicado en todos los perfiles</span>
            </div>
          )}
        </div>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-6xl">

        {/* Left Column: Crest Selection & Upload (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Uploader Card */}
          <div className="bg-white/85 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-sm space-y-5">
            <h3 className="font-display font-bold text-base sm:text-lg text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Upload className="w-5 h-5 text-primary" />
              <span>Subir Nueva Imagen del Escudo</span>
            </h3>

            {/* Drag & Drop File Input */}
            <div className="border-2 border-dashed border-slate-300 hover:border-primary/70 rounded-2xl p-6 sm:p-8 text-center transition-all bg-slate-50/60 hover:bg-white group cursor-pointer relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
              />
              <div className="w-14 h-14 rounded-2xl bg-amber-100/80 text-primary flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform shadow-xs">
                <ImageIcon className="w-7 h-7" />
              </div>
              <p className="text-xs sm:text-sm font-bold text-slate-800 mb-1">
                Haz clic para examinar o arrastra la imagen aquí
              </p>
              <p className="text-[11px] text-slate-500">
                Formatos recomendados: PNG con fondo transparente, JPG o SVG (Hasta 10 MB)
              </p>
            </div>

            {/* Direct URL Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                O ingresa un enlace directo a la imagen (URL)
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://ejemplo.edu.co/escudo.png"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-primary/40"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (customUrl.trim()) setSelectedCrest(customUrl.trim());
                  }}
                  className="px-4 py-2 bg-slate-800 text-white font-bold text-xs rounded-xl hover:bg-slate-900 transition-colors"
                >
                  Aplicar
                </button>
              </div>
            </div>

            {/* Presets Gallery */}
            <div className="pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between mb-3">
                <span className="block text-xs font-bold text-slate-700 uppercase">
                  Escudos & Emblemas Preconfigurados
                </span>
                <span className="text-[10px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                  Formatos Diversos (Circular, Horizontal, Heráldico)
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {PRESET_CRESTS.map((preset) => {
                  const isSelected = selectedCrest === preset.url;
                  return (
                    <div
                      key={preset.id}
                      onClick={() => setSelectedCrest(preset.url)}
                      className={`p-2.5 rounded-xl border cursor-pointer transition-all text-center flex flex-col items-center justify-between ${
                        isSelected 
                          ? 'border-primary bg-amber-50/60 shadow-sm ring-2 ring-primary/40' 
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="h-14 w-full rounded-lg overflow-hidden mb-2 bg-slate-50 flex items-center justify-center p-1 border border-slate-100">
                        <img 
                          src={preset.url} 
                          alt={preset.name} 
                          className="max-h-full max-w-full w-auto h-auto object-contain rounded"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            const fallback = e.currentTarget.parentElement.querySelector('.fallback-preset-icon');
                            if (fallback) fallback.style.display = 'flex';
                          }}
                        />
                        <div className="fallback-preset-icon hidden items-center justify-center text-slate-400 text-[10px] font-bold">
                          Insignia
                        </div>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-800 leading-tight block">
                          {preset.name}
                        </span>
                        <span className="text-[9px] text-slate-500 block mt-0.5">
                          {preset.format}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Institution Details Edit */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Nombre Oficial de la Institución
                </label>
                <input
                  type="text"
                  value={instName}
                  onChange={(e) => setInstName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Lema Institucional
                </label>
                <input
                  type="text"
                  value={motto}
                  onChange={(e) => setMotto(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={handleSaveCrest}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold text-xs sm:text-sm rounded-xl shadow-md hover:bg-primary/95 active:scale-95 transition-all disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Guardando y Sincronizando...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Guardar y Publicar Escudo Institucional</span>
                  </>
                )}
              </button>
            </div>

          </div>

        </div>

        {/* Right Column: Live Previews (5 cols) */}
        <div className="lg:col-span-5 space-y-6">

          {/* Active Crest Badge: Fully Adaptive */}
          <div className="bg-white/85 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-sm text-center">
            <span className="text-[10px] font-extrabold uppercase px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 tracking-wider inline-block mb-3">
              Vista Previa Adaptativa del Escudo
            </span>

            {/* Adaptive container: expands naturally for horizontal badges or centers round/vertical crests */}
            <div className="min-h-[140px] max-h-[190px] w-full max-w-sm mx-auto rounded-2xl overflow-hidden p-3 bg-white/90 border-2 border-amber-300/80 shadow-md mb-4 flex items-center justify-center">
              <img 
                src={selectedCrest} 
                alt="Escudo Oficial del Colegio" 
                className="max-h-[160px] max-w-full w-auto h-auto object-contain rounded-xl drop-shadow-sm transition-all"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const fallback = e.currentTarget.parentElement.querySelector('.fallback-crest-preview');
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
              <div className="fallback-crest-preview hidden flex-col items-center justify-center text-slate-400 p-4">
                <GraduationCap className="w-12 h-12 text-slate-300 mb-1" />
                <span className="text-xs font-semibold">Imagen no disponible</span>
              </div>
            </div>

            <h4 className="font-display font-black text-lg text-slate-900 leading-tight">
              {cleanText(instName)}
            </h4>
            <p className="text-xs text-slate-500 italic mt-1">
              "{cleanText(motto)}"
            </p>
          </div>

          {/* Mockup 1: Navbar Top Bar Preview (Adaptive) */}
          <div className="bg-white/85 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-sm space-y-3">
            <span className="text-xs font-bold text-slate-700 block flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-primary" />
              <span>Simulación en Barra Superior (Todos los Perfiles)</span>
            </span>

            {/* Miniature Mock Navbar with adaptive crest container */}
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className="h-9 min-w-[36px] max-w-[140px] px-1 py-0.5 rounded-lg bg-white border border-amber-200 overflow-hidden shadow-xs flex items-center justify-center">
                  <img src={selectedCrest} alt="Mini Escudo" className="max-h-full max-w-full w-auto h-auto object-contain rounded" />
                </div>
                <div className="min-w-0">
                  <span className="font-bold text-xs text-primary block leading-none">EduCol</span>
                  <span className="text-[9px] text-slate-500 truncate max-w-[130px] block leading-tight mt-0.5">
                    {cleanText(instName)}
                  </span>
                </div>
              </div>
              <span className="text-[9px] font-extrabold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md shrink-0">
                En Línea
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-snug">
              El espacio del escudo se adapta automáticamente sin deformar ni recortar logos horizontales o redondos.
            </p>
          </div>

          {/* Mockup 2: Official Certificate Header Preview (Adaptive) */}
          <div className="bg-white/85 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-sm space-y-3">
            <span className="text-xs font-bold text-slate-700 block flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-primary" />
              <span>Simulación en Boletines y Certificados</span>
            </span>

            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs text-center space-y-2">
              <div className="h-14 min-w-[48px] max-w-[170px] mx-auto rounded-lg overflow-hidden border border-slate-200 p-1 flex items-center justify-center bg-slate-50/50">
                <img src={selectedCrest} alt="Doc Escudo" className="max-h-full max-w-full w-auto h-auto object-contain rounded" />
              </div>
              <div className="text-[11px] font-bold text-slate-800 uppercase tracking-tight">
                República de Colombia • Ministerio de Educación Nacional
              </div>
              <div className="text-[10px] text-slate-600 font-semibold">
                {cleanText(instName)}
              </div>
              <div className="text-[9px] text-slate-400">
                Boletín Oficial de Calificaciones & Registro Académico
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
