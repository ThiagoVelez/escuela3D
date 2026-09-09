import React, { useState, useEffect } from 'react';
import { fetchServerTime } from '../services/api';
import { Clock, Calendar } from 'lucide-react';

export default function LiveClockWidget({ onDateChange, compact = false }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [timeOffset, setTimeOffset] = useState(0);

  // Initial Sync with Backend Server Time
  const syncWithServer = async () => {
    try {
      const data = await fetchServerTime();
      if (data && data.timestamp) {
        const offset = data.timestamp - Date.now();
        setTimeOffset(offset);
        const serverNow = new Date(Date.now() + offset);
        setCurrentTime(serverNow);
        if (onDateChange) onDateChange(serverNow);
      }
    } catch (e) {
      console.warn('[Clock] Error syncing with server, using local time', e);
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
      {/* Live Digital Clock Display */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-2xl font-display font-black text-slate-900 font-mono tracking-tight">
            {formattedTimeStr}
          </div>
          <div className="text-xs font-semibold text-slate-600 flex items-center gap-1.5 mt-1">
            <Calendar className="w-3.5 h-3.5 text-primary flex-shrink-0" />
            <span className="truncate">{capitalizedDate}</span>
          </div>
        </div>

        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold flex-shrink-0">
          <Clock className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
