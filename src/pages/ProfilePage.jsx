import React, { useState } from 'react';
import { useAuth, DEFAULT_AVATARS } from '../context/AuthContext';
import ProfileEditModal, { BANNER_PRESETS } from '../components/ProfileEditModal';
import { 
  Trophy, 
  Compass, 
  Zap, 
  Award, 
  GraduationCap, 
  Mail, 
  Building, 
  Sliders, 
  Star,
  ShieldCheck,
  LogOut,
  Eye,
  EyeOff
} from 'lucide-react';

export default function ProfilePage() {
  const { user, sidebarOpen, logout } = useAuth();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [showEmail, setShowEmail] = useState(false);

  // Helper to resolve background banner style or image URL
  const getBannerStyle = () => {
    const defaultStyle = { backgroundImage: `url(${BANNER_PRESETS[0].url})`, backgroundSize: 'cover', backgroundPosition: 'center' };
    
    if (!user?.bannerUrl) {
      return defaultStyle;
    }
    const preset = BANNER_PRESETS.find(b => b.id === user.bannerUrl);
    if (preset) {
      return { backgroundImage: `url(${preset.url})`, backgroundSize: 'cover', backgroundPosition: 'center' };
    }
    if (user.bannerUrl.startsWith('data:') || user.bannerUrl.startsWith('http')) {
      return { backgroundImage: `url(${user.bannerUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' };
    }
    return defaultStyle;
  };

  const defaultRoleAvatar = DEFAULT_AVATARS[user?.rol] || DEFAULT_AVATARS.ESTUDIANTE;
  const currentAvatar = user?.avatarUrl && !user.avatarUrl.includes('googleusercontent') 
    ? user.avatarUrl 
    : defaultRoleAvatar;

  const bannerStyle = getBannerStyle();

  // Helper to mask sensitive email
  const maskEmail = (email) => {
    if (!email) return '••••••••••••••••';
    const parts = email.split('@');
    if (parts.length !== 2) return '••••••••••••••••';
    const [userPart, domain] = parts;
    const visiblePrefix = userPart.slice(0, Math.min(2, userPart.length));
    const maskedUser = visiblePrefix + '•'.repeat(Math.max(4, userPart.length - visiblePrefix.length));
    return `${maskedUser}@${domain}`;
  };

  return (
    <div className={`flex-1 ${sidebarOpen ? 'md:ml-72' : 'md:ml-0'} p-4 sm:p-6 md:p-8 overflow-y-auto z-10 relative pt-20 md:pt-24 transition-all duration-300`}>
      
      {/* Social Media Header Banner & Profile Card */}
      <div className="rounded-3xl overflow-hidden shadow-xl border border-white/80 bg-white/70 backdrop-blur-md mb-8">
        
        {/* Top Decorative Banner */}
        <div 
          className="h-44 sm:h-56 md:h-64 relative flex items-end p-4 sm:p-6 overflow-hidden"
          style={bannerStyle}
        >
          {/* Subtle overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-black/30"></div>

          {/* Institutional Badge */}
          <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white font-semibold text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Perfil EduCol Institucional
          </div>

          {/* Action Buttons: Personalizar y Cerrar Sesión */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              onClick={() => setIsEditOpen(true)}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/40 text-white font-bold text-xs px-3 sm:px-4 py-2 rounded-xl shadow-lg transition-all flex items-center gap-2 hover:scale-105 active:scale-95"
            >
              <Sliders className="w-4 h-4" />
              <span className="hidden sm:inline">Ajustes / Personalizar</span>
              <span className="sm:hidden">Editar</span>
            </button>

            <button
              onClick={logout}
              className="bg-rose-600/85 hover:bg-rose-700 backdrop-blur-md border border-rose-400/80 text-white font-bold text-xs px-3 sm:px-4 py-2 rounded-xl shadow-lg transition-all flex items-center gap-2 hover:scale-105 active:scale-95"
              title="Cerrar sesión de forma segura"
            >
              <LogOut className="w-4 h-4" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>

        {/* Profile Details Container */}
        <div className="p-4 sm:p-6 md:p-8 relative pt-0">
          <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between -mt-16 sm:-mt-20 mb-6 gap-4">
            
            {/* Avatar Photo */}
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 text-center sm:text-left">
              <div className="relative">
                <img 
                  src={currentAvatar} 
                  alt="Avatar Perfil" 
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = defaultRoleAvatar;
                  }}
                  className="w-28 h-28 md:w-36 md:h-36 rounded-full border-4 border-white shadow-2xl object-cover bg-white"
                />
                <span className="absolute bottom-2 right-2 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white" title="En línea"></span>
              </div>
              <div className="mb-2">
                <h1 className="font-display font-bold text-2xl md:text-3xl text-slate-900">{user?.nombre}</h1>
                <p className="text-xs sm:text-sm font-semibold text-primary flex items-center justify-center sm:justify-start gap-1.5 mt-0.5">
                  <GraduationCap className="w-4 h-4 flex-shrink-0" />
                  <span>{user?.grado || '10° Bachillerato'} • Jornada {user?.jornada || 'Mañana'}</span>
                </p>
              </div>
            </div>

            {/* Role & Level Pill */}
            <div className="flex items-center gap-2 flex-wrap justify-center">
              <div className="px-4 py-1.5 rounded-full bg-primary text-white font-extrabold text-xs shadow-sm">
                {user?.rol || 'Estudiante'}
              </div>
              <div className="px-4 py-1.5 rounded-full bg-slate-900 text-white font-bold text-xs shadow-sm flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>Nivel Avanzado</span>
              </div>
            </div>

          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 pt-6 border-t border-slate-200/80 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60">
              <div className="flex items-center justify-between mb-1">
                <span className="text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  Correo Institucional
                </span>
                <button 
                  type="button"
                  onClick={() => setShowEmail(!showEmail)}
                  className="text-slate-400 hover:text-primary p-0.5 rounded transition-colors flex items-center gap-1 text-[11px]"
                  title={showEmail ? "Ocultar correo" : "Ver correo"}
                >
                  {showEmail ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5" />
                      <span className="text-[10px]">Ocultar</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5" />
                      <span className="text-[10px]">Ver</span>
                    </>
                  )}
                </button>
              </div>
              <span className="font-bold text-slate-800 text-xs sm:text-sm break-all font-mono">
                {showEmail ? user?.email : maskEmail(user?.email)}
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60">
              <span className="text-slate-400 font-semibold uppercase tracking-wider block mb-1 flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-slate-400" />
                Institución Educativa
              </span>
              <span className="font-bold text-slate-800 text-xs sm:text-sm">{user?.institucion}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60">
              <span className="text-slate-400 font-semibold uppercase tracking-wider block mb-1 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                Puntos de Experiencia
              </span>
              <span className="font-bold text-emerald-600 text-xs sm:text-sm flex items-center gap-1">
                <Zap className="w-4 h-4 text-emerald-600 fill-emerald-600" />
                <span>{user?.puntosExperiencia || 450} XP Acumulados</span>
              </span>
            </div>
          </div>

          {/* Profile Isolation Guarantee Note */}
          <div className="mt-4 p-3 bg-slate-50 rounded-2xl border border-slate-200/60 flex items-center gap-2 text-xs text-slate-600">
            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Perfil y foto 100% aislados para tu cuenta institucional activa. Los cambios realizados aquí no alteran a otros docentes ni al rector.</span>
          </div>

        </div>
      </div>

      {/* Badges & Achievements Section (Clean Icons, NO EMOJIS) */}
      <div className="glass-card rounded-3xl p-5 sm:p-6 md:p-8 border border-white/80 shadow-lg bg-white/70">
        <h3 className="font-display font-bold text-lg sm:text-xl text-slate-900 mb-6 flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-500" />
          Insignias y Reconocimientos Académicos
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center gap-3.5 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0 border border-amber-200">
              <Trophy className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <div className="font-bold text-sm text-slate-900">Explorador de Páramos</div>
              <div className="text-[11px] text-slate-500">Módulo Biología y Ecosistemas</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center gap-3.5 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 border border-blue-200">
              <Compass className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="font-bold text-sm text-slate-900">Maestro del Espacio</div>
              <div className="text-[11px] text-slate-500">Puntaje perfecto en Geometría</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center gap-3.5 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 border border-emerald-200">
              <Zap className="w-6 h-6 text-emerald-600 fill-emerald-600" />
            </div>
            <div>
              <div className="font-bold text-sm text-slate-900">Puntualidad 100%</div>
              <div className="text-[11px] text-slate-500">Entregas a tiempo</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center gap-3.5 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0 border border-purple-200">
              <Award className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <div className="font-bold text-sm text-slate-900">Pionero EduCol</div>
              <div className="text-[11px] text-slate-500">Campus Digital Institucional</div>
            </div>
          </div>
        </div>
      </div>

      {/* Session Security Card - Cerrar Sesión desde el perfil */}
      <div className="mt-6 rounded-3xl p-5 sm:p-6 border border-rose-100 bg-rose-50/60 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div>
          <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-rose-600" />
            Control de Sesión y Seguridad
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Puedes cerrar tu sesión de forma segura en este dispositivo en cualquier momento.
          </p>
        </div>
        <button
          type="button"
          onClick={logout}
          className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 hover:scale-105 active:scale-95 cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Cerrar Sesión Activa</span>
        </button>
      </div>

      {/* Edit Profile Modal */}
      <ProfileEditModal 
        isOpen={isEditOpen} 
        onClose={() => setIsEditOpen(false)} 
      />

    </div>
  );
}
