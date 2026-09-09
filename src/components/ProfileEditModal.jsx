import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateUserProfile } from '../services/api';
import { Check, X } from 'lucide-react';

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
  { id: 'av-1', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', label: 'Estudiante 1' },
  { id: 'av-2', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80', label: 'Estudiante 2' },
  { id: 'av-3', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', label: 'Estudiante 3' },
  { id: 'av-4', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', label: 'Estudiante 4' },
  { id: 'av-5', url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80', label: 'Rector / Institucional' }
];

export default function ProfileEditModal({ isOpen, onClose }) {
  const { user, updateProfile } = useAuth();
  const [selectedBanner, setSelectedBanner] = useState(user.bannerUrl || 'banner-paramo');
  const [customBannerDataUrl, setCustomBannerDataUrl] = useState(
    user.bannerUrl?.startsWith('data:') ? user.bannerUrl : ''
  );
  const [selectedAvatar, setSelectedAvatar] = useState(user.avatarUrl || AVATAR_PRESETS[0].url);
  const [customAvatarDataUrl, setCustomAvatarDataUrl] = useState(
    user.avatarUrl?.startsWith('data:') ? user.avatarUrl : ''
  );
  const [nombre, setNombre] = useState(user.nombre || '');
  const [loading, setLoading] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const bannerFileRef = useRef(null);
  const avatarFileRef = useRef(null);

  if (!isOpen) return null;

  const handleBannerFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setCustomBannerDataUrl(ev.target.result);
      setSelectedBanner(''); // deselect presets
    };
    reader.readAsDataURL(file);
  };

  const handleAvatarFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setCustomAvatarDataUrl(ev.target.result);
      setSelectedAvatar(''); // deselect presets
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Determine final banner: custom upload > preset
    const finalBanner = customBannerDataUrl ? customBannerDataUrl : selectedBanner;
    // Determine final avatar: custom upload > preset
    const finalAvatar = customAvatarDataUrl ? customAvatarDataUrl : selectedAvatar;

    const payload = {
      userId: user.id,
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
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 pt-20 md:pt-24 bg-slate-900/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-3xl border border-white/80 shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 md:p-8 relative">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center justify-center transition-colors z-10"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6 border-b border-slate-200 pb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-primary-container text-white flex items-center justify-center shadow-md">
            <span className="material-symbols-outlined text-2xl">palette</span>
          </div>
          <div>
            <h2 className="font-display text-xl font-bold text-slate-900">Personalizar Perfil</h2>
            <p className="text-xs text-slate-500">Selecciona el banner de fondo, tu foto de perfil o sube desde tu dispositivo</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          
          {/* Banner 3D Selection (5 Predefined Banners) */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-primary text-base">image</span>
              Banners Predefinidos EduCol 3D (5 Estilos)
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
                    {/* Background Preview */}
                    <div 
                      className="h-16 rounded-xl relative flex items-center justify-between p-3 mb-2 shadow-inner bg-slate-100"
                      style={{ backgroundImage: `url(${preset.url})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                    >
                      <div className="flex items-center gap-1.5 z-10">
                        <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse"></span>
                        <span className="text-[10px] font-bold text-white uppercase tracking-wider bg-black/40 px-2 py-0.5 rounded-full backdrop-blur-sm">
                          3D Theme
                        </span>
                      </div>
                      {isSelected && (
                        <div className="w-6 h-6 rounded-full bg-white text-primary flex items-center justify-center shadow-md z-10">
                          <span className="material-symbols-outlined text-sm font-bold">check</span>
                        </div>
                      )}
                    </div>
                    <div className="font-bold text-xs text-slate-800">{preset.name}</div>
                    <div className="text-[11px] text-slate-500 line-clamp-1">{preset.description}</div>
                  </button>
                );
              })}
            </div>

            {/* Upload Banner from Device */}
            <div className="mt-4">
              <span className="text-xs font-bold text-slate-600 block mb-2 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary text-base">upload_file</span>
                O sube un banner desde tu dispositivo:
              </span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => bannerFileRef.current?.click()}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-200 flex items-center gap-2 transition-colors"
                >
                  <span className="material-symbols-outlined text-base">photo_library</span>
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
              <span className="material-symbols-outlined text-primary text-base">account_circle</span>
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
                  >
                    <img src={av.url} alt={av.label} className="w-full h-full object-cover" />
                    {isSelected && (
                      <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                        <span className="material-symbols-outlined text-white font-bold text-lg">check</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Upload Avatar from Device */}
            <div className="mt-4">
              <span className="text-xs font-bold text-slate-600 block mb-2 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary text-base">upload_file</span>
                O sube tu foto desde el dispositivo:
              </span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => avatarFileRef.current?.click()}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-200 flex items-center gap-2 transition-colors"
                >
                  <span className="material-symbols-outlined text-base">add_a_photo</span>
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

          {/* Student Name */}
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
                  <span className="material-symbols-outlined text-base">check_circle</span>
                  ¡Guardado!
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-base">save</span>
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
