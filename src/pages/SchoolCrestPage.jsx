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

const PRESET_CRESTS = [
  {
    id: 'preset-1',
    name: 'Blasón Clásico Dorado',
    url: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'preset-2',
    name: 'Insignia Academia Andina',
    url: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'preset-3',
    name: 'Emblema Científico & Tecnológico',
    url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'preset-4',
    name: 'Escudo Humanista Real',
    url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=300&auto=format&fit=crop&q=80'
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
              <span className="block text-xs font-bold text-slate-700 uppercase mb-3">
                Escudos & Emblemas Preconfigurados
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {PRESET_CRESTS.map((preset) => {
                  const isSelected = selectedCrest === preset.url;
                  return (
                    <div
                      key={preset.id}
                      onClick={() => setSelectedCrest(preset.url)}
                      className={`p-2.5 rounded-xl border cursor-pointer transition-all text-center flex flex-col items-center ${
                        isSelected 
                          ? 'border-primary bg-amber-50/60 shadow-sm ring-2 ring-primary/40' 
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="w-14 h-14 rounded-lg overflow-hidden mb-2 bg-slate-100 flex items-center justify-center p-1 border border-slate-100">
                        <img 
                          src={preset.url} 
                          alt={preset.name} 
                          className="w-full h-full object-cover rounded-md" 
                        />
                      </div>
                      <span className="text-[10px] font-bold text-slate-700 leading-tight">
                        {preset.name}
                      </span>
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

          {/* Active Crest Badge */}
          <div className="bg-white/85 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-sm text-center">
            <span className="text-[10px] font-extrabold uppercase px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 tracking-wider inline-block mb-4">
              Vista Previa del Escudo Seleccionado
            </span>

            <div className="w-32 h-32 mx-auto rounded-2xl overflow-hidden p-2 bg-white border-2 border-amber-300/80 shadow-lg mb-4 flex items-center justify-center">
              <img 
                src={selectedCrest} 
                alt="Escudo Oficial del Colegio" 
                className="w-full h-full object-cover rounded-xl" 
              />
            </div>

            <h4 className="font-display font-black text-lg text-slate-900 leading-tight">
              {instName}
            </h4>
            <p className="text-xs text-slate-500 italic mt-1">
              "{motto}"
            </p>
          </div>

          {/* Mockup 1: Navbar Top Bar Preview */}
          <div className="bg-white/85 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-sm space-y-3">
            <span className="text-xs font-bold text-slate-700 block flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-primary" />
              <span>Simulación en Barra Superior (Todos los Perfiles)</span>
            </span>

            {/* Miniature Mock Navbar */}
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-white border border-amber-200 overflow-hidden shadow-xs flex items-center justify-center p-0.5">
                  <img src={selectedCrest} alt="Mini Escudo" className="w-full h-full object-cover rounded" />
                </div>
                <div>
                  <span className="font-bold text-xs text-primary block leading-none">EduCol</span>
                  <span className="text-[9px] text-slate-500 truncate max-w-[130px] block leading-tight">{instName}</span>
                </div>
              </div>
              <span className="text-[9px] font-extrabold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                En Línea
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-snug">
              Este logo sustituye el icono genérico y aparece para profesores, estudiantes y coordinadores.
            </p>
          </div>

          {/* Mockup 2: Official Certificate Header Preview */}
          <div className="bg-white/85 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-sm space-y-3">
            <span className="text-xs font-bold text-slate-700 block flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-primary" />
              <span>Simulación en Boletines y Certificados</span>
            </span>

            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs text-center space-y-2">
              <div className="w-12 h-12 mx-auto rounded-lg overflow-hidden border border-slate-200 p-0.5">
                <img src={selectedCrest} alt="Doc Escudo" className="w-full h-full object-cover rounded" />
              </div>
              <div className="text-[11px] font-bold text-slate-800 uppercase tracking-tight">
                República de Colombia • Ministerio de Educación Nacional
              </div>
              <div className="text-[10px] text-slate-600 font-semibold">
                {instName}
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
