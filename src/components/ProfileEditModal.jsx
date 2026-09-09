import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateUserProfile } from '../services/api';
import { 
  Check, 
  X, 
  Palette, 
  Image as ImageIcon, 
  Upload, 
  User, 
  Camera, 
  Save, 
  CheckCircle2, 
  ShieldCheck 
} from 'lucide-react';

export const BANNER_PRESETS = [
  {
    id: 'banner-paramo',
    name: 'Páramos y Flora Andina',
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1000&auto=format&fit=crop&q=80',
    accentColor: '#10b981',
    description: 'Ecosistema de alta montaña y frailejones en verde esmeralda'
  },
  {
    id: 'banner-cosmos',
    name: 'Galaxia y Cosmos',
    url: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1000&auto=format&fit=crop&q=80',
    accentColor: '#8b5cf6',
    description: 'Espacio profundo con nebulosas y destellos cósmicos'
  },
  {
    id: 'banner-quantum',
    name: 'Malla Tecnológica Digital',
    url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1000&auto=format&fit=crop&q=80',
    accentColor: '#06b6d4',
    description: 'Geometría futurista digital y nodos de energía cian'
  },
  {
    id: 'banner-sol',
    name: 'Atardecer Sol Colonial',
    url: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=1000&auto=format&fit=crop&q=80',
    accentColor: '#f59e0b',
    description: 'Cálido crepúsculo andino con destellos de sol dorado'
  },
  {
    id: 'banner-molecular',
    name: 'Laboratorio de Ciencias',
    url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1000&auto=format&fit=crop&q=80',
    accentColor: '#3b82f6',
    description: 'Estructuras celulares y biotecnología'
  }
];

export const AVATAR_PRESETS = [
  { id: 'av-1', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80', label: 'Estudiante (Mateo)' },
  { id: 'av-2', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', label: 'Estudiante (Sofía)' },
  { id: 'av-3', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80', label: 'Docente (Dra. Valentina)' },
  { id: 'av-4', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', label: 'Docente (Ing. Alejandro)' },
  { id: 'av-5', url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80', label: 'Rectoría / Directivo' },
  { id: 'av-6', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', label: 'Académico / Tutor' }
];

export default function ProfileEditModal({ isOpen, onClose }) {
  const { user, updateProfile } = useAuth();
  const [selectedBanner, setSelectedBanner] = useState(user?.bannerUrl || 'banner-paramo');
  const [customBannerDataUrl, setCustomBannerDataUrl] = useState(
    user?.bannerUrl?.startsWith('data:') ? user.bannerUrl : ''
  );
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatarUrl || AVATAR_PRESETS[0].url);
  const [customAvatarDataUrl, setCustomAvatarDataUrl] = useState(
    user?.avatarUrl?.startsWith('data:') ? user.avatarUrl : ''
  );
  const [nombre, setNombre] = useState(user?.nombre || '');
  const [loading, setLoading] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const bannerFileRef = useRef(null);
  const avatarFileRef = useRef(null);

  // Sync state whenever the modal opens or the active user changes
  useEffect(() => {
    if (isOpen && user) {
      setSelectedBanner(user.bannerUrl || 'banner-paramo');
      setCustomBannerDataUrl(user.bannerUrl?.startsWith('data:') ? user.bannerUrl : '');
      setSelectedAvatar(user.avatarUrl || AVATAR_PRESETS[0].url);
      setCustomAvatarDataUrl(user.avatarUrl?.startsWith('data:') ? user.avatarUrl : '');
      setNombre(user.nombre || '');
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handleBannerFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setCustomBannerDataUrl(ev.target.result);
      setSelectedBanner('');
    };
    reader.readAsDataURL(file);
  };

  const handleAvatarFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setCustomAvatarDataUrl(ev.target.result);
      setSelectedAvatar('');
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    const finalBanner = customBannerDataUrl ? customBannerDataUrl : selectedBanner;
    const finalAvatar = customAvatarDataUrl ? customAvatarDataUrl : selectedAvatar;

    const payload = {
      userId: user.id,
      email: user.email,
      bannerUrl: finalBanner,
      avatarUrl: finalAvatar,
      nombre
    };

    await updateUserProfile(payload);
    updateProfile({
      nombre,
      bannerUrl: finalBanner,
      avatarUrl: finalAvatar
    });

    setLoading(false);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 pt-20 md:pt-24 bg-slate-900/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-3xl border border-white/80 shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 md:p-8 relative">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center justify-center transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6 border-b border-slate-200 pb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-amber-500 text-white flex items-center justify-center shadow-md">
            <Palette className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-display text-xl font-bold text-slate-900">Personalizar Perfil</h2>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
              <span className="font-semibold text-primary">{user?.nombre}</span>
              <span>•</span>
              <span className="bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-full text-[10px]">{user?.rol || 'ESTUDIANTE'}</span>
            </div>
          </div>
        </div>

        {/* Isolation Notice Banner */}
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl mb-6 text-xs text-emerald-900 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>Este cambio de foto y banner se aplicará <strong>únicamente a tu usuario ({user?.email})</strong> y no modificará el perfil de otros docentes ni directivos.</span>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          
          {/* Banner Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-primary" />
              Banners Institucionales (5 Estilos)
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {BANNER_PRESETS.map((preset) => {
                const isSelected = selectedBanner === preset.id && !customBannerDataUrl;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => {
                      setSelectedBanner(preset.id);
                      setCustomBannerDataUrl('');
                    }}
                    className={`relative p-3 rounded-2xl border-2 text-left transition-all overflow-hidden ${
                      isSelected
                        ? 'border-primary ring-2 ring-primary/30 shadow-lg scale-[1.02]'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div 
                      className="h-16 rounded-xl relative flex items-center justify-between p-3 mb-2 shadow-inner bg-slate-100"
                      style={{ backgroundImage: `url(${preset.url})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                    >
                      <div className="flex items-center gap-1.5 z-10">
                        <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse"></span>
                        <span className="text-[10px] font-bold text-white uppercase tracking-wider bg-black/40 px-2 py-0.5 rounded-full backdrop-blur-sm">
                          Tema
                        </span>
                      </div>
                      {isSelected && (
                        <div className="w-6 h-6 rounded-full bg-white text-primary flex items-center justify-center shadow-md z-10">
                          <Check className="w-3.5 h-3.5 font-bold" />
                        </div>
                      )}
                    </div>
                    <div className="font-bold text-xs text-slate-800">{preset.name}</div>
                    <div className="text-[11px] text-slate-500 line-clamp-1">{preset.description}</div>
                  </button>
                );
              })}
            </div>

            {/* Upload Banner */}
            <div className="mt-4">
              <span className="text-xs font-bold text-slate-600 block mb-2 flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5 text-primary" />
                O sube un banner desde tu dispositivo:
              </span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => bannerFileRef.current?.click()}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-200 flex items-center gap-2 transition-colors"
                >
                  <Camera className="w-4 h-4" />
                  Seleccionar Imagen
                </button>
                <input
                  ref={bannerFileRef}
                  type="file"
                  accept="image/*"
                  onChange={handleBannerFileChange}
                  className="hidden"
                />
                {customBannerDataUrl && (
                  <div className="flex items-center gap-2">
                    <img src={customBannerDataUrl} alt="Banner Preview" className="h-10 w-20 rounded-lg object-cover border border-primary shadow-sm" />
                    <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Banner cargado
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setCustomBannerDataUrl('');
                        setSelectedBanner('banner-paramo');
                      }}
                      className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-md transition-colors"
                      title="Eliminar"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Avatar / Profile Picture Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
              <User className="w-4 h-4 text-primary" />
              Foto de Perfil / Avatar
            </label>

            <div className="flex flex-wrap gap-3 items-center">
              {AVATAR_PRESETS.map((av) => {
                const isSelected = selectedAvatar === av.url && !customAvatarDataUrl;
                return (
                  <button
                    key={av.id}
                    type="button"
                    onClick={() => {
                      setSelectedAvatar(av.url);
                      setCustomAvatarDataUrl('');
                    }}
                    className={`relative w-14 h-14 rounded-full overflow-hidden border-2 transition-all ${
                      isSelected ? 'border-primary ring-4 ring-primary/30 scale-110 shadow-md' : 'border-slate-200 hover:border-slate-400'
                    }`}
                    title={av.label}
                  >
                    <img src={av.url} alt={av.label} className="w-full h-full object-cover" />
                    {isSelected && (
                      <div className="absolute inset-0 bg-primary/30 flex items-center justify-center">
                        <Check className="w-5 h-5 text-white font-black drop-shadow" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Upload Avatar from Device */}
            <div className="mt-4">
              <span className="text-xs font-bold text-slate-600 block mb-2 flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5 text-primary" />
                O sube tu foto desde el dispositivo:
              </span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => avatarFileRef.current?.click()}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-200 flex items-center gap-2 transition-colors"
                >
                  <Camera className="w-4 h-4" />
                  Seleccionar Foto
                </button>
                <input
                  ref={avatarFileRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarFileChange}
                  className="hidden"
                />
                {customAvatarDataUrl && (
                  <div className="flex items-center gap-2">
                    <img src={customAvatarDataUrl} alt="Avatar Preview" className="w-12 h-12 rounded-full object-cover border-2 border-primary shadow-sm" />
                    <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Foto cargada
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setCustomAvatarDataUrl('');
                        setSelectedAvatar(AVATAR_PRESETS[0].url);
                      }}
                      className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-md transition-colors"
                      title="Eliminar"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* User Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Nombre Visible
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-semibold focus:ring-2 focus:ring-primary outline-none"
              required
            />
          </div>

          {/* Save Footer */}
          <div className="pt-4 border-t border-slate-200 flex justify-end gap-3 items-center">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-xs transition-colors"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-primary text-on-primary font-bold text-xs shadow-md hover:bg-primary/90 transition-all flex items-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Guardando...
                </>
              ) : savedSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  ¡Guardado!
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Guardar Personalización
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
