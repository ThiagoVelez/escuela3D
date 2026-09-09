import React, { useState, useEffect } from 'react';
import { fetchServerTime, controlServerTime } from '../services/api';
import { Clock, Calendar, CheckCircle2, RotateCcw, Sliders } from 'lucide-react';

export default function LiveClockWidget({ onDateChange, compact = false }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [timeOffset, setTimeOffset] = useState(0);
  const [isSynced, setIsSynced] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [customDateInput, setCustomDateInput] = useState('');

  // Initial Sync with Backend Server Time
  const syncWithServer = async () => {
    try {
      const data = await fetchServerTime();
      if (data && data.timestamp) {
        const offset = data.timestamp - Date.now();
        setTimeOffset(offset);
        const serverNow = new Date(Date.now() + offset);
        setCurrentTime(serverNow);
        setIsSynced(true);
        if (onDateChange) onDateChange(serverNow);
      }
    } catch (e) {
      console.warn('[Clock] Error syncing with server, using local time', e);
      setIsSynced(false);
    }
  };

  useEffect(() => {
    syncWithServer();
    // Re-sync every 5 minutes to prevent time drift
    const syncInterval = setInterval(syncWithServer, 5 * 60 * 1000);
    return () => clearInterval(syncInterval);
  }, []);

  // 1-second live clock tick
  useEffect(() => {
    const timer = setInterval(() => {
      const updated = new Date(Date.now() + timeOffset);
      setCurrentTime(updated);

      // If midnight crossed, notify parent
      if (updated.getSeconds() === 0 && updated.getMinutes() === 0 && updated.getHours() === 0) {
        if (onDateChange) onDateChange(updated);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [timeOffset]);

  // Formatters for Colombia (es-CO)
  const formattedTimeStr = currentTime.toLocaleTimeString('es-CO', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  const formattedDateStr = currentTime.toLocaleDateString('es-CO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const capitalizedDate = formattedDateStr.charAt(0).toUpperCase() + formattedDateStr.slice(1);

  const handleApplyCustomDate = async (e) => {
    e.preventDefault();
    if (!customDateInput) return;
    const res = await controlServerTime(customDateInput);
    if (res.success) {
      setShowConfig(false);
      syncWithServer();
    }
  };

  const handleResetToRealTime = async () => {
    const res = await controlServerTime(null, true);
    if (res.success) {
      setShowConfig(false);
      syncWithServer();
    }
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2 bg-slate-100/80 px-3 py-1.5 rounded-xl border border-slate-200/60 text-xs text-slate-700">
        <Clock className="w-3.5 h-3.5 text-primary" />
        <span className="font-mono font-bold">{formattedTimeStr}</span>
      </div>
    );
  }

  return (
    <div className="bg-white/85 backdrop-blur-md rounded-2xl p-4 border border-slate-200/80 shadow-sm mb-4 relative">
      {/* Top Header: Indicator + Actions */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>{isSynced ? 'Hora Oficial del Servidor' : 'Hora Local'}</span>
        </div>

        <button
          onClick={() => setShowConfig(!showConfig)}
          className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700 transition-colors"
          title="Ajustar o calibrar fecha del sistema"
        >
          <Sliders className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Live Digital Clock Display */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-2xl font-display font-black text-slate-900 font-mono tracking-tight">
            {formattedTimeStr}
          </div>
          <div className="text-xs font-semibold text-slate-600 flex items-center gap-1.5 mt-0.5">
            <Calendar className="w-3.5 h-3.5 text-primary flex-shrink-0" />
            <span className="truncate">{capitalizedDate}</span>
          </div>
        </div>

        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
          <Clock className="w-5 h-5" />
        </div>
      </div>

      {/* Administrative Time Control Popover */}
      {showConfig && (
        <div className="mt-3 pt-3 border-t border-slate-200 text-xs animate-fadeIn">
          <form onSubmit={handleApplyCustomDate} className="space-y-2">
            <label className="block text-[11px] font-bold text-slate-700">
              Calibrar Fecha / Hora Oficial:
            </label>
            <input
              type="datetime-local"
              value={customDateInput}
              onChange={(e) => setCustomDateInput(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 outline-none focus:ring-1 focus:ring-primary"
            />
            <div className="flex gap-2 pt-1">
              <button
                type="submit"
                className="flex-1 py-1 px-2 bg-primary text-white font-bold rounded-lg text-[11px] shadow-sm hover:bg-primary/90 transition-all"
              >
                Aplicar
              </button>
              <button
                type="button"
                onClick={handleResetToRealTime}
                className="py-1 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-[11px] flex items-center gap-1 transition-all"
                title="Volver a la hora actual de la máquina"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Tiempo Real</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
