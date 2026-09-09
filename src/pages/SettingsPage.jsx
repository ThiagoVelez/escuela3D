import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Sliders, 
  Check, 
  Save, 
  KeyRound, 
  Eye, 
  EyeOff, 
  Volume2, 
  Smartphone, 
  Globe, 
  FileText, 
  Sparkles,
  Lock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function SettingsPage() {
  const { user, sidebarOpen, addNotification } = useAuth();

  const [activeTab, setActiveTab] = useState('general'); // 'general', 'notifications', 'security', 'role'

  // General Settings State
  const [interfaceDensity, setInterfaceDensity] = useState(() => localStorage.getItem('cfg_density') || 'comoda');
  const [fontSize, setFontSize] = useState(() => localStorage.getItem('cfg_fontsize') || 'normal');
  const [highContrast, setHighContrast] = useState(() => localStorage.getItem('cfg_contrast') === 'true');
  const [language, setLanguage] = useState(() => localStorage.getItem('cfg_lang') || 'es');
  const [systemSounds, setSystemSounds] = useState(() => localStorage.getItem('cfg_sounds') !== 'false');

  // Notification Settings State
  const [notifyTasks, setNotifyTasks] = useState(true);
  const [notifyGrades, setNotifyGrades] = useState(true);
  const [notifyAnnouncements, setNotifyAnnouncements] = useState(true);
  const [notifyDigest, setNotifyDigest] = useState(false);

  // Security Settings State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState(null); // 'success', 'error', 'mismatch'

  // Role-Specific Settings State
  // Teacher
  const [gradingScale, setGradingScale] = useState('1.0 - 5.0 (Nacional)');
  const [taskOrder, setTaskOrder] = useState('recientes');
  const [instantTaskAlert, setInstantTaskAlert] = useState(true);
  // Student
  const [confirmHeavyUploads, setConfirmHeavyUploads] = useState(true);
  const [dueReminder24h, setDueReminder24h] = useState(true);
  // Admin
  const [maxUploadLimit, setMaxUploadLimit] = useState('500 MB');
  const [auditMode, setAuditMode] = useState(true);
  const [lockGradesPeriod, setLockGradesPeriod] = useState(false);

  // Saved Alert Feedback
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveGeneral = (e) => {
    e.preventDefault();
    localStorage.setItem('cfg_density', interfaceDensity);
    localStorage.setItem('cfg_fontsize', fontSize);
    localStorage.setItem('cfg_contrast', highContrast);
    localStorage.setItem('cfg_lang', language);
    localStorage.setItem('cfg_sounds', systemSounds);

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);

    if (addNotification) {
      addNotification({
        title: 'Configuración Actualizada',
        text: 'Tus preferencias generales del sistema se han guardado con éxito.',
        icon: 'settings',
        color: 'text-primary'
      });
    }
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (!currentPassword) {
      setPasswordStatus('error');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordStatus('short');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordStatus('mismatch');
      return;
    }

    setPasswordStatus('success');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPasswordStatus(null), 3500);

    if (addNotification) {
      addNotification({
        title: 'Seguridad de la Cuenta',
        text: 'La contraseña de tu cuenta institucional ha sido actualizada correctamente.',
        icon: 'lock',
        color: 'text-emerald-600'
      });
    }
  };

  return (
    <div className={`flex-1 ${sidebarOpen ? 'md:ml-72' : 'md:ml-0'} p-4 sm:p-6 md:p-8 overflow-y-auto z-10 relative pt-20 md:pt-24 transition-all duration-300`}>
      
      {/* Header */}
      <header className="mb-6 md:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-extrabold uppercase px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-200 tracking-wider flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-amber-700" />
                <span>Panel de Preferencias Institucionales</span>
              </span>
            </div>
            <h1 className="font-display font-black text-2xl sm:text-3xl md:text-4xl text-slate-900 tracking-tight">
              Configuración del Sistema
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
              Ajusta los parámetros operativos, notificaciones, accesibilidad y seguridad según tu perfil de {user?.rol || 'usuario'}.
            </p>
          </div>

          {savedSuccess && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold rounded-xl animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Preferencias guardadas correctamente</span>
            </div>
          )}
        </div>

        {/* Responsive Tab Bar */}
        <div className="flex flex-wrap gap-2 mt-6 border-b border-slate-200/80 pb-3">
          <button
            onClick={() => setActiveTab('general')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'general'
                ? 'bg-primary text-white shadow-md'
                : 'bg-white/80 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>General & Accesibilidad</span>
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'notifications'
                ? 'bg-primary text-white shadow-md'
                : 'bg-white/80 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Notificaciones</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'security'
                ? 'bg-primary text-white shadow-md'
                : 'bg-white/80 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Seguridad & Credenciales</span>
          </button>

          <button
            onClick={() => setActiveTab('role')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'role'
                ? 'bg-primary text-white shadow-md'
                : 'bg-white/80 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Preferencias de {user?.rol === 'DOCENTE' ? 'Docente' : (user?.rol === 'RECTOR' || user?.rol === 'ADMINISTRADOR') ? 'Rectoría' : 'Estudiante'}</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="max-w-4xl space-y-6">

        {/* TAB 1: GENERAL & ACCESIBILIDAD */}
        {activeTab === 'general' && (
          <form onSubmit={handleSaveGeneral} className="space-y-6">
            <div className="bg-white/85 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-sm space-y-5">
              <h3 className="font-display font-bold text-base sm:text-lg text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                <Sliders className="w-5 h-5 text-primary" />
                <span>Visualización e Interfaz</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Interface Density */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                    Densidad de la Interfaz
                  </label>
                  <select
                    value={interfaceDensity}
                    onChange={(e) => setInterfaceDensity(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                  >
                    <option value="comoda">Cómoda (Espacio óptimo y legible)</option>
                    <option value="compacta">Compacta (Más filas en tablas y listados)</option>
                  </select>
                  <p className="text-[11px] text-slate-500 mt-1">Ajusta el relleno y espaciado de tablas y tarjetas.</p>
                </div>

                {/* Font Size */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                    Tamaño de Letra
                  </label>
                  <select
                    value={fontSize}
                    onChange={(e) => setFontSize(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                  >
                    <option value="normal">Estándar (Recomendado)</option>
                    <option value="grande">Accesibilidad Alta (Fuente Aumentada)</option>
                  </select>
                  <p className="text-[11px] text-slate-500 mt-1">Facilita la lectura en pantallas pequeñas o proyectores.</p>
                </div>

                {/* Language */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                    Idioma Institucional
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                  >
                    <option value="es">Español (Colombia - es-CO)</option>
                    <option value="en">English (Bilingual Campus)</option>
                  </select>
                </div>

                {/* Regional Timezone */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                    Zona Horaria
                  </label>
                  <input
                    type="text"
                    disabled
                    value="Bogotá, Colombia (UTC -05:00)"
                    className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-600 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="pt-4 border-t border-slate-100 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-xs sm:text-sm text-slate-800 block">Efectos Sonoros del Sistema</span>
                    <span className="text-[11px] text-slate-500">Reproducir sonido al enviar tareas o registrar asistencias</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSystemSounds(!systemSounds)}
                    className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                      systemSounds ? 'bg-primary' : 'bg-slate-300'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      systemSounds ? 'translate-x-6' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-xs sm:text-sm text-slate-800 block">Modo de Contraste Alto</span>
                    <span className="text-[11px] text-slate-500">Realzar bordes y textos para óptima visibilidad</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setHighContrast(!highContrast)}
                    className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                      highContrast ? 'bg-primary' : 'bg-slate-300'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      highContrast ? 'translate-x-6' : 'translate-x-0'
                    }`} />
                  </button>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-bold text-xs sm:text-sm rounded-xl shadow-md hover:bg-primary/95 active:scale-95 transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>Guardar Preferencias Generales</span>
                </button>
              </div>
            </div>
          </form>
        )}

        {/* TAB 2: NOTIFICACIONES */}
        {activeTab === 'notifications' && (
          <div className="bg-white/85 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-sm space-y-6">
            <h3 className="font-display font-bold text-base sm:text-lg text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Bell className="w-5 h-5 text-primary" />
              <span>Canales y Frecuencia de Notificaciones</span>
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <div>
                  <span className="font-bold text-xs sm:text-sm text-slate-800 block">Alertas de Tareas y Talleres</span>
                  <span className="text-[11px] text-slate-500">Avisos de nuevas asignaciones o entregas recibidas</span>
                </div>
                <button
                  type="button"
                  onClick={() => setNotifyTasks(!notifyTasks)}
                  className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                    notifyTasks ? 'bg-primary' : 'bg-slate-300'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    notifyTasks ? 'translate-x-6' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <div>
                  <span className="font-bold text-xs sm:text-sm text-slate-800 block">Publicación de Calificaciones</span>
                  <span className="text-[11px] text-slate-500">Notificar inmediatamente al calificar un trabajo con anotaciones</span>
                </div>
                <button
                  type="button"
                  onClick={() => setNotifyGrades(!notifyGrades)}
                  className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                    notifyGrades ? 'bg-primary' : 'bg-slate-300'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    notifyGrades ? 'translate-x-6' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <div>
                  <span className="font-bold text-xs sm:text-sm text-slate-800 block">Circulares y Comunicados de Rectoría</span>
                  <span className="text-[11px] text-slate-500">Avisos urgentes del Consejo Directivo y coordinación</span>
                </div>
                <button
                  type="button"
                  onClick={() => setNotifyAnnouncements(!notifyAnnouncements)}
                  className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                    notifyAnnouncements ? 'bg-primary' : 'bg-slate-300'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    notifyAnnouncements ? 'translate-x-6' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between py-2">
                <div>
                  <span className="font-bold text-xs sm:text-sm text-slate-800 block">Resumen Semanal por Correo</span>
                  <span className="text-[11px] text-slate-500">Recibir en {user?.email} el reporte consolidado cada viernes</span>
                </div>
                <button
                  type="button"
                  onClick={() => setNotifyDigest(!notifyDigest)}
                  className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                    notifyDigest ? 'bg-primary' : 'bg-slate-300'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    notifyDigest ? 'translate-x-6' : 'translate-x-0'
                  }`} />
                </button>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setSavedSuccess(true);
                  setTimeout(() => setSavedSuccess(false), 2000);
                }}
                className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-bold text-xs sm:text-sm rounded-xl shadow-md hover:bg-primary/95 active:scale-95 transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Actualizar Canales de Notificación</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: SEGURIDAD & CREDENCIALES */}
        {activeTab === 'security' && (
          <div className="bg-white/85 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-sm space-y-6">
            <h3 className="font-display font-bold text-base sm:text-lg text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <KeyRound className="w-5 h-5 text-primary" />
              <span>Cambio de Contraseña Institucional</span>
            </h3>

            <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-lg">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Contraseña Actual
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Ingresa tu contraseña actual"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-primary/40 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Nueva Contraseña
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres alfanuméricos"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Confirmar Nueva Contraseña
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repite la nueva contraseña"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              {passwordStatus === 'error' && (
                <div className="flex items-center gap-2 text-rose-700 bg-rose-50 border border-rose-200 rounded-xl p-3 text-xs font-bold">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>Debes ingresar tu contraseña actual para autorizar el cambio.</span>
                </div>
              )}

              {passwordStatus === 'short' && (
                <div className="flex items-center gap-2 text-amber-700 bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs font-bold">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>La nueva contraseña debe tener al menos 6 caracteres.</span>
                </div>
              )}

              {passwordStatus === 'mismatch' && (
                <div className="flex items-center gap-2 text-rose-700 bg-rose-50 border border-rose-200 rounded-xl p-3 text-xs font-bold">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>Las contraseñas no coinciden. Verifica e intenta nuevamente.</span>
                </div>
              )}

              {passwordStatus === 'success' && (
                <div className="flex items-center gap-2 text-emerald-800 bg-emerald-50 border border-emerald-300 rounded-xl p-3 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
                  <span>Contraseña actualizada correctamente con cifrado seguro.</span>
                </div>
              )}

              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-bold text-xs sm:text-sm rounded-xl shadow-md hover:bg-primary/95 active:scale-95 transition-all"
              >
                <Lock className="w-4 h-4" />
                <span>Actualizar Contraseña</span>
              </button>
            </form>

            <div className="pt-4 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-700 block mb-1">Sesión Activa</span>
              <p className="text-[11px] text-slate-500">
                Conectado como <strong className="text-slate-800">{user?.nombre}</strong> ({user?.email}) con rol de <strong className="text-primary">{user?.rol}</strong>.
              </p>
            </div>
          </div>
        )}

        {/* TAB 4: PREFERENCIAS POR ROL */}
        {activeTab === 'role' && (
          <div className="bg-white/85 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-sm space-y-6">
            <h3 className="font-display font-bold text-base sm:text-lg text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <User className="w-5 h-5 text-primary" />
              <span>
                Parámetros Específicos para el Rol: <span className="text-primary uppercase">{user?.rol}</span>
              </span>
            </h3>

            {/* If Docente */}
            {user?.rol === 'DOCENTE' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                    Escala de Calificación Institucional
                  </label>
                  <select
                    value={gradingScale}
                    onChange={(e) => setGradingScale(e.target.value)}
                    className="w-full sm:w-80 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 outline-none"
                  >
                    <option value="1.0 - 5.0 (Nacional)">1.0 a 5.0 (Escala Nacional Colombiana)</option>
                    <option value="Cualitativa">Cualitativa (Superior, Alto, Básico, Bajo)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                    Orden por Defecto en Correo de Tareas
                  </label>
                  <select
                    value={taskOrder}
                    onChange={(e) => setTaskOrder(e.target.value)}
                    className="w-full sm:w-80 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 outline-none"
                  >
                    <option value="recientes">Más recientes primero</option>
                    <option value="antiguos">Pendientes más antiguos primero</option>
                    <option value="grado">Agrupados por Grado escolar</option>
                  </select>
                </div>

                <div className="flex items-center justify-between py-2 border-t border-slate-100">
                  <div>
                    <span className="font-bold text-xs sm:text-sm text-slate-800 block">Alerta Instantánea de Nueva Entrega</span>
                    <span className="text-[11px] text-slate-500">Generar notificación cuando un estudiante suba un archivo</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setInstantTaskAlert(!instantTaskAlert)}
                    className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                      instantTaskAlert ? 'bg-primary' : 'bg-slate-300'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      instantTaskAlert ? 'translate-x-6' : 'translate-x-0'
                    }`} />
                  </button>
                </div>
              </div>
            )}

            {/* If Estudiante */}
            {user?.rol === 'ESTUDIANTE' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <div>
                    <span className="font-bold text-xs sm:text-sm text-slate-800 block">Confirmación al Subir Archivos Pesados</span>
                    <span className="text-[11px] text-slate-500">Solicitar confirmación antes de enviar entregas mayores a 50 MB</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setConfirmHeavyUploads(!confirmHeavyUploads)}
                    className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                      confirmHeavyUploads ? 'bg-primary' : 'bg-slate-300'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      confirmHeavyUploads ? 'translate-x-6' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between py-2">
                  <div>
                    <span className="font-bold text-xs sm:text-sm text-slate-800 block">Recordatorio 24 Horas Antes de Entrega</span>
                    <span className="text-[11px] text-slate-500">Avisar un día antes del límite de fecha fijado por el docente</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDueReminder24h(!dueReminder24h)}
                    className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                      dueReminder24h ? 'bg-primary' : 'bg-slate-300'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      dueReminder24h ? 'translate-x-6' : 'translate-x-0'
                    }`} />
                  </button>
                </div>
              </div>
            )}

            {/* If Rector or Admin */}
            {(user?.rol === 'RECTOR' || user?.rol === 'ADMINISTRADOR') && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                    Límite Máximo de Tamaño de Tareas
                  </label>
                  <input
                    type="text"
                    value={maxUploadLimit}
                    onChange={(e) => setMaxUploadLimit(e.target.value)}
                    className="w-full sm:w-80 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 outline-none"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">Capacidad asignada en el servidor por archivo entregado.</p>
                </div>

                <div className="flex items-center justify-between py-2 border-t border-slate-100">
                  <div>
                    <span className="font-bold text-xs sm:text-sm text-slate-800 block">Modo Auditoría Docente</span>
                    <span className="text-[11px] text-slate-500">Registrar historial de correcciones y tiempos de retroalimentación</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAuditMode(!auditMode)}
                    className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                      auditMode ? 'bg-primary' : 'bg-slate-300'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      auditMode ? 'translate-x-6' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between py-2 border-t border-slate-100">
                  <div>
                    <span className="font-bold text-xs sm:text-sm text-slate-800 block">Bloqueo Oficial de Periodo Académico</span>
                    <span className="text-[11px] text-slate-500">Impedir modificaciones de notas en materias concluidas</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setLockGradesPeriod(!lockGradesPeriod)}
                    className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                      lockGradesPeriod ? 'bg-primary' : 'bg-slate-300'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      lockGradesPeriod ? 'translate-x-6' : 'translate-x-0'
                    }`} />
                  </button>
                </div>
              </div>
            )}

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setSavedSuccess(true);
                  setTimeout(() => setSavedSuccess(false), 2500);
                }}
                className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-bold text-xs sm:text-sm rounded-xl shadow-md hover:bg-primary/95 active:scale-95 transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Guardar Parámetros de Rol</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
