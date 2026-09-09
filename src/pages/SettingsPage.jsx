import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function SettingsPage() {
  const { user, sidebarOpen } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [theme3D, setTheme3D] = useState('Alto Rendimiento');

  return (
    <div className={`flex-1 ${sidebarOpen ? 'md:ml-72' : 'md:ml-0'} p-margin-mobile md:p-margin-desktop overflow-y-auto z-10 relative pt-28 md:pt-32 transition-all duration-300`}>
      <header className="mb-8">
        <h1 className="font-display font-bold text-3xl md:text-4xl text-primary mb-1">
          Configuración del Sistema
        </h1>
        <p className="text-base text-on-surface-variant">
          Personaliza tu experiencia en el campus EduCol 3D.
        </p>
      </header>

      <div className="max-w-3xl space-y-6">
        {/* Account Settings */}
        <div className="glass-card rounded-2xl p-6 border border-white/80 space-y-4">
          <h3 className="font-display font-bold text-lg text-primary flex items-center gap-2">
            <span className="material-symbols-outlined">tune</span>
            Preferencias de Renderizado 3D
          </h3>

          <div className="flex justify-between items-center py-2 border-b border-outline-variant/20">
            <div>
              <div className="font-semibold text-sm text-on-surface">Modo Gráfico 3D</div>
              <div className="text-xs text-on-surface-variant">Ajusta la calidad de simulación en WebGL</div>
            </div>
            <select 
              value={theme3D} 
              onChange={(e) => setTheme3D(e.target.value)}
              className="bg-white/80 border border-outline-variant rounded-xl px-3 py-1.5 text-xs font-semibold text-primary outline-none"
            >
              <option value="Alto Rendimiento">Alto Rendimiento (60 FPS)</option>
              <option value="Calidad Máxima">Calidad Máxima (Shaders 4K)</option>
              <option value="Ahorro de Batería">Ahorro de Batería</option>
            </select>
          </div>

          <div className="flex justify-between items-center py-2">
            <div>
              <div className="font-semibold text-sm text-on-surface">Notificaciones del Campus</div>
              <div className="text-xs text-on-surface-variant">Recibir alertas de nuevos laboratorios y notas</div>
            </div>
            <button 
              onClick={() => setNotifications(!notifications)}
              className={`w-12 h-6 rounded-full transition-colors relative p-1 ${
                notifications ? 'bg-primary' : 'bg-surface-variant'
              }`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                notifications ? 'translate-x-6' : 'translate-x-0'
              }`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
