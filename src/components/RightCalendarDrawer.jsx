import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchAssignments } from '../services/api';

const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export default function RightCalendarDrawer() {
  const { user, activeTab } = useAuth();
  const [assignments, setAssignments] = useState([]);
  
  // Date State - Default to July 2026 (or current date)
  const [currentDate, setCurrentDate] = useState(new Date(2026, 6, 1)); // July 2026
  const [selectedDay, setSelectedDay] = useState(null); // Filter by day number

  useEffect(() => {
    if (user?.rol === 'ESTUDIANTE') {
      loadAssignments();
    }
  }, [user]);

  const loadAssignments = async () => {
    const data = await fetchAssignments(null, user?.grado);
    setAssignments(data || []);
  };

  // Only render for students on subjects and grades tabs (hide on schedule-view, profile, settings, etc.)
  if (user?.rol !== 'ESTUDIANTE' || (activeTab !== 'subjects' && activeTab !== 'grades')) {
    return null;
  }

  // Month navigation handlers
  const handlePrevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    setSelectedDay(null);
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    setSelectedDay(null);
  };

  // Calendar math
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0 = Sunday

  // Get active assignments
  const pendingAssignments = assignments.filter(a => a.estado === 'Pendiente' || !a.estado);

  // Helper to check if a specific day has deadlines
  const getTasksForDay = (dayNum) => {
    const formattedDay = dayNum < 10 ? `0${dayNum}` : `${dayNum}`;
    const formattedMonth = (month + 1) < 10 ? `0${month + 1}` : `${month + 1}`;
    const dateStr = `${year}-${formattedMonth}-${formattedDay}`;

    return pendingAssignments.filter(task => {
      if (!task.fecha_limite) return true; // Default match if no date
      return task.fecha_limite.startsWith(dateStr);
    });
  };

  // Days with tasks map for visual indicators
  const hasTaskMap = {};
  for (let d = 1; d <= daysInMonth; d++) {
    hasTaskMap[d] = getTasksForDay(d).length > 0;
  }

  // Filtered tasks based on selected day
  const displayedTasks = selectedDay 
    ? getTasksForDay(selectedDay) 
    : pendingAssignments;

  return (
    <aside className="hidden xl:flex fixed right-0 top-0 h-full z-20 flex-col p-4 bg-white/40 backdrop-blur-[20px] w-80 border-l border-white/60 shadow-[-4px_0_24px_rgba(0,0,0,0.05)] pt-24 overflow-y-auto">
      
      {/* Title */}
      <div className="flex items-center gap-2 mb-5">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-container text-white flex items-center justify-center shadow-md">
          <span className="material-symbols-outlined text-xl">calendar_month</span>
        </div>
        <div>
          <h3 className="font-display font-bold text-slate-800 text-sm">Calendario Escolar</h3>
          <p className="text-[10px] font-semibold text-primary uppercase tracking-wide">Próximas Entregas</p>
        </div>
      </div>

      {/* Mini Calendar Container */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 mb-5">
        
        {/* Header (Month + Year + Nav) */}
        <div className="flex justify-between items-center mb-3">
          <button 
            onClick={handlePrevMonth}
            className="w-7 h-7 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-primary flex items-center justify-center transition-colors"
            title="Mes Anterior"
          >
            <span className="material-symbols-outlined text-sm font-bold">chevron_left</span>
          </button>

          <div className="text-xs font-bold text-slate-800">
            {MONTH_NAMES[month]} {year}
          </div>

          <button 
            onClick={handleNextMonth}
            className="w-7 h-7 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-primary flex items-center justify-center transition-colors"
            title="Mes Siguiente"
          >
            <span className="material-symbols-outlined text-sm font-bold">chevron_right</span>
          </button>
        </div>

        {/* Days of Week Header */}
        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {['D','L','M','M','J','V','S'].map((d, i) => (
            <div key={i} className="text-[9px] font-bold text-slate-400 uppercase">{d}</div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 text-center">
          {/* Empty cells before month start */}
          {Array.from({ length: firstDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} className="h-7"></div>
          ))}

          {/* Days of current month */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const hasTask = hasTaskMap[dayNum];
            const isSelected = selectedDay === dayNum;
            const isToday = dayNum === 31 && month === 6 && year === 2026;

            return (
              <button
                key={dayNum}
                onClick={() => setSelectedDay(isSelected ? null : dayNum)}
                className={`
                  h-7 text-[10px] font-bold rounded-lg transition-all flex flex-col items-center justify-center relative
                  ${isSelected 
                    ? 'bg-primary text-white shadow-md scale-105 ring-2 ring-primary/30' 
                    : isToday 
                    ? 'bg-amber-500 text-white font-black' 
                    : hasTask 
                    ? 'bg-amber-100 text-amber-900 hover:bg-amber-200' 
                    : 'text-slate-600 hover:bg-slate-100'
                  }
                `}
              >
                <span>{dayNum}</span>
                {hasTask && !isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 absolute bottom-0.5"></span>
                )}
              </button>
            );
          })}
        </div>

        {/* Filter reset helper text */}
        {selectedDay && (
          <div className="mt-3 pt-2 border-t border-slate-100 flex justify-between items-center text-[10px]">
            <span className="text-slate-500">Filtrando: <strong>{selectedDay} {MONTH_NAMES[month]}</strong></span>
            <button 
              onClick={() => setSelectedDay(null)}
              className="text-primary font-bold hover:underline"
            >
              Ver todas
            </button>
          </div>
        )}
      </div>

      {/* Task List Header */}
      <div className="flex justify-between items-center mb-3">
        <h4 className="font-bold text-xs text-slate-500 uppercase tracking-wider">
          {selectedDay ? `Entregas del Día ${selectedDay}` : 'Todas las Entregas'}
        </h4>
        <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
          {displayedTasks.length} {displayedTasks.length === 1 ? 'Tarea' : 'Tareas'}
        </span>
      </div>

      {/* Task Items */}
      <div className="space-y-3 pb-6">
        {displayedTasks.length === 0 ? (
          <div className="text-center p-5 bg-white/60 rounded-2xl border border-slate-200/60 shadow-sm">
            <span className="material-symbols-outlined text-slate-300 text-3xl mb-1">task_alt</span>
            <p className="text-xs text-slate-600 font-bold">¡Sin entregas pendientes!</p>
            <p className="text-[10px] text-slate-400 mt-0.5">No hay trabajos agendados para este día.</p>
          </div>
        ) : (
          displayedTasks.map((task, idx) => (
            <div 
              key={idx} 
              className="bg-white rounded-2xl p-3.5 border-l-4 border-amber-400 shadow-sm hover:shadow-md transition-all relative overflow-hidden group"
            >
              <div className="flex gap-2.5 items-start mb-1.5 z-10 relative">
                <div className="bg-amber-100 text-amber-700 p-2 rounded-xl flex-shrink-0">
                  <span className="material-symbols-outlined text-base block">assignment</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="font-bold text-xs text-slate-800 line-clamp-1 group-hover:text-primary transition-colors">
                    {task.titulo}
                  </h5>
                  <p className="text-[10px] text-slate-500 font-medium line-clamp-1">
                    {task.materia} • <span className="font-bold text-slate-600">{task.tipo}</span>
                  </p>
                </div>
              </div>

              <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                <div className="font-bold text-rose-500 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px]">event</span>
                  <span>Vence: {task.fecha_limite || '2026-07-31'}</span>
                </div>
                <span className="text-slate-400 font-medium">{task.profesor || 'Docente'}</span>
              </div>
            </div>
          ))
        )}
      </div>

    </aside>
  );
}
