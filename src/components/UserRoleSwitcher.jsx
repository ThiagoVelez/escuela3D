import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { DEFAULT_AVATARS } from '../context/AuthContext';
import { 
  Users, 
  ShieldCheck, 
  Check, 
  ArrowRight, 
  GraduationCap, 
  Briefcase, 
  Award, 
  X,
  RefreshCw,
  Sparkles
} from 'lucide-react';

export default function UserRoleSwitcher({ isOpen, onClose }) {
  const { user, switchRole, profileStore } = useAuth();
  const [switching, setSwitching] = useState(false);

  if (!isOpen) return null;

  // Resolves the current stored avatar for each role
  const getAvatarFor = (email, role) => {
    const key = `user_${email.toLowerCase().trim()}`;
    const stored = profileStore && profileStore[key];
    if (stored && stored.avatarUrl && !stored.avatarUrl.includes('googleusercontent')) {
      return stored.avatarUrl;
    }
    return DEFAULT_AVATARS[role] || DEFAULT_AVATARS.ESTUDIANTE;
  };

  const PERSONAS = [
    {
      role: 'ESTUDIANTE',
      nombre: 'Mateo Gómez',
      email: 'estudiante@educol.edu.co',
      cargo: 'Estudiante de Bachillerato • Grado 10° A',
      icon: GraduationCap,
      color: 'border-amber-400 bg-amber-50/60 text-amber-900',
      badgeColor: 'bg-amber-100 text-amber-800'
    },
    {
      role: 'DOCENTE',
      nombre: 'Dra. Valentina Ríos',
      email: 'docente@educol.edu.co',
      cargo: 'Docente de Ciencias & Biología 3D',
      icon: Briefcase,
      color: 'border-blue-400 bg-blue-50/60 text-blue-900',
      badgeColor: 'bg-blue-100 text-blue-800'
    },
    {
      role: 'RECTOR',
      nombre: 'Carlos Administrador',
      email: 'admin@educol.edu.co',
      cargo: 'Rectoría & Alta Dirección Institucional',
      icon: Award,
      color: 'border-purple-400 bg-purple-50/60 text-purple-900',
      badgeColor: 'bg-purple-100 text-purple-800'
    }
  ];

  const handleSelectRole = (targetRole) => {
    if (user?.rol === targetRole) {
      onClose();
      return;
    }
    setSwitching(true);
    switchRole(targetRole);
    setTimeout(() => {
      setSwitching(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 pt-20 md:pt-24 bg-slate-900/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-3xl border border-white/80 shadow-2xl max-w-xl w-full p-6 md:p-8 relative">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center justify-center transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-200">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shadow-sm">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-display text-xl font-bold text-slate-900">
              Conmutador de Perfiles y Roles
            </h2>
            <p className="text-xs text-slate-500">
              Cambia entre cuentas para verificar que las fotos y datos son 100% aislados.
            </p>
          </div>
        </div>

        {/* Guarantee Banner */}
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl mb-5 flex items-start gap-2.5 text-xs text-emerald-900">
          <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
          <div>
            <strong className="block font-bold">Aislamiento de Perfil 100% Garantizado:</strong>
            <span>Cada usuario (Estudiante, Docente y Rector) posee su propio almacenamiento independiente en base de datos y memoria. Modificar la foto de uno nunca afectará a los demás.</span>
          </div>
        </div>

        {/* Personas List */}
        <div className="space-y-3 mb-6">
          {PERSONAS.map((p) => {
            const isCurrent = user?.rol === p.role || user?.email === p.email;
            const avatarUrl = isCurrent ? user.avatarUrl : getAvatarFor(p.email, p.role);
            const IconComp = p.icon;

            return (
              <div 
                key={p.role}
                onClick={() => handleSelectRole(p.role)}
                className={`flex items-center justify-between p-3.5 rounded-2xl border-2 transition-all cursor-pointer ${
                  isCurrent 
                    ? 'border-primary bg-primary/5 ring-2 ring-primary/20 shadow-md' 
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative flex-shrink-0">
                    <img 
                      src={avatarUrl} 
                      alt={p.nombre} 
                      className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm bg-white"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = DEFAULT_AVATARS[p.role];
                      }}
                    />
                    {isCurrent && (
                      <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
                      </span>
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-slate-900 truncate">{p.nombre}</h4>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${p.badgeColor}`}>
                        {p.role}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 truncate">{p.cargo}</p>
                    <span className="text-[10px] font-mono text-slate-400">{p.email}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {isCurrent ? (
                    <span className="px-3 py-1 bg-primary text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      Activo
                    </span>
                  ) : (
                    <button
                      type="button"
                      className="px-3 py-1.5 bg-slate-100 hover:bg-primary hover:text-white text-slate-700 text-xs font-bold rounded-xl transition-all flex items-center gap-1 shadow-sm"
                    >
                      <span>Cambiar</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
}
