import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { registerRector } from '../services/api';

export default function LoginPage() {
  const { login, loginAsUser } = useAuth();
  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'register'
  const [email, setEmail] = useState('estudiante@educol.edu.co');
  const [password, setPassword] = useState('12345678');
  const [showPassword, setShowPassword] = useState(false);

  // Rector Register Form State
  const [nombreInstitucion, setNombreInstitucion] = useState('');
  const [codigoSnies, setCodigoSnies] = useState('');
  const [nombreRector, setNombreRector] = useState('');
  const [apellidoRector, setApellidoRector] = useState('');
  const [rectorEmail, setRectorEmail] = useState('');
  const [rectorPassword, setRectorPassword] = useState('');
  const [showRectorPassword, setShowRectorPassword] = useState(false);
  const [registering, setRegistering] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password);
  };

  const handleRectorRegister = async (e) => {
    e.preventDefault();
    setRegistering(true);
    const res = await registerRector({
      nombreInstitucion,
      codigoSnies,
      nombreRector,
      apellidoRector,
      email: rectorEmail,
      password: rectorPassword
    });

    if (res.success && res.user) {
      loginAsUser(res.user);
    }
    setRegistering(false);
  };

  return (
    <div className="w-full min-h-screen md:h-screen flex flex-col md:flex-row overflow-y-auto md:overflow-hidden bg-background">
      
      {/* Left Canvas: Educational Scene (60% on desktop) */}
      <div className="relative w-full md:w-[58%] lg:w-[60%] min-h-[340px] md:min-h-full md:h-full flex-shrink-0 flex items-center justify-center p-6 sm:p-8 md:p-12 overflow-hidden bg-surface-container">
        <div className="absolute inset-0 z-0">
          <img 
            className="w-full h-full object-cover transition-transform duration-1000 scale-105" 
            alt="EduColombia Campus" 
            src="/colombia_3d_campus_bg.png"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/80 via-slate-900/40 to-primary-container/25"></div>
        </div>

        {/* Floating Hero Card */}
        <div className="relative z-10 max-w-xl bg-white/15 backdrop-blur-[24px] border border-white/30 p-6 sm:p-8 md:p-10 rounded-3xl shadow-[0_16px_48px_0_rgba(0,0,0,0.25)] animate-float">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 border border-white/30 text-white font-semibold text-xs mb-4 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse"></span>
            Plataforma Educativa Institucional
          </div>

          <h1 className="font-display text-2xl sm:text-4xl md:text-5xl font-bold text-white drop-shadow-md mb-3 leading-tight">
            Impulsando el futuro de <span className="text-primary-container drop-shadow-lg">Colombia</span>
          </h1>
          <p className="font-sans text-xs sm:text-sm text-white/95 max-w-lg mt-1 leading-relaxed">
            Plataforma académica integral para instituciones educativas colombianas con roles de Rectoría, Docentes y Estudiantes.
          </p>

          <div className="flex flex-wrap gap-2.5 mt-6">
            <div className="px-4 py-1.5 rounded-full bg-primary-container/90 text-on-primary-container font-bold text-xs backdrop-blur-md shadow-sm">
              Gestión de Rectoría
            </div>
            <div className="px-4 py-1.5 rounded-full bg-secondary-container/90 text-on-secondary-container font-bold text-xs backdrop-blur-md shadow-sm">
              Panel Docente
            </div>
          </div>
        </div>
      </div>

      {/* Right Form Container (40% on desktop) */}
      <div className="w-full md:w-[42%] lg:w-[40%] flex-1 md:h-full flex flex-col justify-center items-center p-4 sm:p-6 md:p-10 relative bg-surface-container-lowest z-20 overflow-y-auto shadow-[-10px_0_30px_rgba(0,0,0,0.05)]">
        <div className="w-full max-w-md bg-white/95 backdrop-blur-[30px] border border-outline-variant/30 shadow-2xl rounded-3xl p-6 sm:p-8 relative z-10 my-auto">
          
          {/* Brand Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-container via-amber-400 to-primary text-slate-900 mb-3 shadow-[0_6px_20px_rgba(113,92,0,0.3)] transform rotate-3">
              <span className="material-symbols-outlined text-3xl -rotate-3 text-slate-900">school</span>
            </div>
            <h2 className="font-display text-2xl font-bold text-on-surface mb-0.5">EduCol</h2>
            <p className="text-xs text-on-surface-variant font-medium">Campus Virtual de Colombia</p>
          </div>

          {/* Tabs */}
          <div className="flex bg-surface-container-high/40 p-1 rounded-xl mb-5 border border-outline-variant/20 shadow-inner">
            <button 
              type="button"
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-2.5 rounded-lg font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'login'
                  ? 'bg-primary-container text-on-primary-container shadow-md'
                  : 'text-on-surface-variant hover:bg-white/50'
              }`}
            >
              <span className="material-symbols-outlined text-base">login</span>
              Ingresar
            </button>
            <button 
              type="button"
              onClick={() => setActiveTab('register')}
              className={`flex-1 py-2.5 rounded-lg font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'register'
                  ? 'bg-primary-container text-on-primary-container shadow-md'
                  : 'text-on-surface-variant hover:bg-white/50'
              }`}
            >
              <span className="material-symbols-outlined text-base">domain_add</span>
              Registrar Colegio (Rector)
            </button>
          </div>

          {/* TAB 1: LOGIN FORM */}
          {activeTab === 'login' ? (
            <div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                    Correo Electrónico
                  </label>
                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">
                      mail
                    </span>
                    <input 
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-xl py-3 pl-10 pr-4 text-xs text-on-surface focus:ring-2 focus:ring-primary-container outline-none transition-all shadow-inner"
                      placeholder="usuario@educol.edu.co"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                    Contraseña
                  </label>
                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">
                      lock
                    </span>
                    <input 
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-xl py-3 pl-10 pr-10 text-xs text-on-surface focus:ring-2 focus:ring-primary-container outline-none transition-all shadow-inner"
                      placeholder="••••••••"
                      required
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface p-1 focus:outline-none"
                      title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    >
                      <span className="material-symbols-outlined text-base select-none">
                        {showPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                </div>

                <button 
                  type="submit"
                  className="mt-5 w-full bg-primary text-on-primary font-bold text-sm py-3 px-5 rounded-xl shadow-[0_4px_0_#554500,0_8px_20px_rgba(113,92,0,0.3)] hover:translate-y-[1px] hover:shadow-[0_2px_0_#554500,0_4px_12px_rgba(113,92,0,0.3)] active:translate-y-[3px] active:shadow-none transition-all flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <span>Iniciar Sesión</span>
                  <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </button>
              </form>
            </div>
          ) : (
            
            /* TAB 2: RECTOR-ONLY PUBLIC REGISTRATION FORM */
            <div>
              {/* Notice banner explaining Rector governance */}
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl mb-3 text-[11px] text-amber-900 font-medium leading-tight">
                <div className="font-bold flex items-center gap-1.5 mb-1 text-amber-800">
                  <span className="material-symbols-outlined text-base">info</span>
                  Registro Exclusivo para Rectoría
                </div>
                El registro inicial está habilitado únicamente para la <strong>Cabeza del Colegio (Rector)</strong>. El Rector luego creará los usuarios para coordinadores, docentes y alumnos.
              </div>

              <form onSubmit={handleRectorRegister} className="space-y-2.5 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-0.5">Nombre de la Institución Educativa</label>
                  <input
                    type="text"
                    value={nombreInstitucion}
                    onChange={(e) => setNombreInstitucion(e.target.value)}
                    placeholder="Ej. Colegio San José de Cundinamarca"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-primary-container"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-0.5">Código SNIES / NIT</label>
                  <input
                    type="text"
                    value={codigoSnies}
                    onChange={(e) => setCodigoSnies(e.target.value)}
                    placeholder="Ej. SNIES-88392"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-primary-container"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-slate-700 mb-0.5">Nombre del Rector(a)</label>
                    <input
                      type="text"
                      value={nombreRector}
                      onChange={(e) => setNombreRector(e.target.value)}
                      placeholder="Ej. Carlos Roberto"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-primary-container"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-0.5">Apellido</label>
                    <input
                      type="text"
                      value={apellidoRector}
                      onChange={(e) => setApellidoRector(e.target.value)}
                      placeholder="Ej. Mendoza"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-primary-container"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-0.5">Correo Electrónico Institucional</label>
                  <input
                    type="email"
                    value={rectorEmail}
                    onChange={(e) => setRectorEmail(e.target.value)}
                    placeholder="rectoria@colegiosanjose.edu.co"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-primary-container"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-0.5">Contraseña de Acceso</label>
                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base pointer-events-none">
                      lock
                    </span>
                    <input
                      type={showRectorPassword ? 'text' : 'password'}
                      value={rectorPassword}
                      onChange={(e) => setRectorPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-9 text-xs outline-none focus:ring-2 focus:ring-primary-container"
                      required
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowRectorPassword(!showRectorPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1 focus:outline-none"
                      title={showRectorPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    >
                      <span className="material-symbols-outlined text-base select-none">
                        {showRectorPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={registering}
                  className="mt-3 w-full bg-primary hover:bg-primary/90 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  {registering ? (
                    <span>Registrando Institución...</span>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-base">check_circle</span>
                      <span>Registrar Colegio y Entrar como Rector</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

        </div>
      </div>

    </div>
  );
}
