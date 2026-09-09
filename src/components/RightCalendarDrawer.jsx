import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchAssignments, fetchServerTime } from '../services/api';
import LiveClockWidget from './LiveClockWidget';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  FileText, 
  CheckCircle2, 
  Clock 
} from 'lucide-react';

const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export default function RightCalendarDrawer() {
  const { user, activeTab } = useAuth();
  const [assignments, setAssignments] = useState([]);
  
  // Real System / Server Date
  const [serverDate, setServerDate] = useState(new Date());
  // Active calendar view (Year & Month)
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);

  useEffect(() => {
    if (user?.rol === 'ESTUDIANTE') {
      loadAssignments();
    }
  }, [user]);

  // Sync date with server time on mount
  useEffect(() => {
    fetchServerTime().then((data) => {
      if (data && data.timestamp) {
        const sDate = new Date(data.timestamp);
        setServerDate(sDate);
        setCurrentDate(sDate);
        setSelectedDay(sDate.getDate());
      }
    });
  }, []);

  const loadAssignments = async () => {
    const data = await fetchAssignments(null, user?.grado);
    setAssignments(data || []);
  };

  // Only render for students on subjects and grades tabs
  if (user?.rol !== 'ESTUDIANTE' || (activeTab !== 'subjects' && activeTab !== 'grades')) {
    return null;
  }

  // Month navigation
  const handlePrevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    setSelectedDay(null);
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    setSelectedDay(null);
  };

  const handleGoToToday = () => {
    setCurrentDate(new Date(serverDate));
    setSelectedDay(serverDate.getDate());
  };

  // Calendar calculations
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0 = Sunday

  // Get active assignments
  const pendingAssignments = assignments.filter(a => a.estadoEstudiante !== 'Entregado' && a.estado !== 'Entregado');

  // Exact task matching per day
  const getTasksForDay = (dayNum) => {
    const formattedDay = String(dayNum).padStart(2, '0');
    const formattedMonth = String(month + 1).padStart(2, '0');
    const dateStr = `${year}-${formattedMonth}-${formattedDay}`;

    return pendingAssignments.filter(task => {
      const taskDate = task.fechaLimite || task.fecha_limite;
      if (!taskDate) return false;
      return taskDate.startsWith(dateStr);
    });
  };

  // Days with tasks map
  const hasTaskMap = {};
  for (let d = 1; d <= daysInMonth; d++) {
    hasTaskMap[d] = getTasksForDay(d).length > 0;
  }

  // Filtered tasks based on selected day
  const displayedTasks = selectedDay 
    ? getTasksForDay(selectedDay) 
    : pendingAssignments;

  return (
    <aside className="hidden xl:flex fixed right-0 top-0 h-full z-20 flex-col p-4 bg-white/70 backdrop-blur-[25px] w-80 border-l border-white/60 shadow-[-4px_0_24px_rgba(0,0,0,0.06)] pt-20 md:pt-24 overflow-y-auto">
      
      {/* 100% Reliable Live Clock & Date Widget */}
      <LiveClockWidget 
        onDateChange={(newDate) => {
          setServerDate(newDate);
          // If viewing current month, stay synced
          if (currentDate.getMonth() === newDate.getMonth() && currentDate.getFullYear() === newDate.getFullYear()) {
            setSelectedDay(newDate.getDate());
          }
        }} 
      />

      {/* Mini Calendar Container */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 mb-4">
        
        {/* Header (Month + Year + Nav + Today Button) */}
        <div className="flex justify-between items-center mb-3">
          <button 
            onClick={handlePrevMonth}
            className="w-7 h-7 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-primary flex items-center justify-center transition-colors"
            title="Mes Anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-slate-900">
              {MONTH_NAMES[month]} {year}
            </span>
            <button
              onClick={handleGoToToday}
              className="text-[10px] font-bold text-primary bg-primary/10 hover:bg-primary/20 px-2 py-0.5 rounded-md transition-colors"
              title="Ir al día de hoy"
            >
              Hoy
            </button>
          </div>

          <button 
            onClick={handleNextMonth}
            className="w-7 h-7 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-primary flex items-center justify-center transition-colors"
            title="Mes Siguiente"
          >
            <ChevronRight className="w-4 h-4" />
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
            const isToday = 
              dayNum === serverDate.getDate() && 
              month === serverDate.getMonth() && 
              year === serverDate.getFullYear();

            return (
              <button
                key={dayNum}
                onClick={() => setSelectedDay(isSelected ? null : dayNum)}
                className={`
                  h-7 text-[10px] font-bold rounded-lg transition-all flex flex-col items-center justify-center relative
                  ${isSelected 
                    ? 'bg-primary text-white shadow-md scale-105 ring-2 ring-primary/40' 
                    : isToday 
                    ? 'bg-amber-100 text-amber-900 ring-2 ring-amber-400 font-black' 
                    : hasTask 
                    ? 'bg-emerald-50 text-emerald-900 font-bold hover:bg-emerald-100' 
                    : 'text-slate-600 hover:bg-slate-100'
                  }
                `}
                title={isToday ? 'Día de Hoy' : hasTask ? 'Tiene entregas programadas' : ''}
              >
                <span>{dayNum}</span>
                {hasTask && !isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 absolute bottom-0.5"></span>
                )}
              </button>
            );
          })}
        </div>

        {/* Filter reset helper text */}
        {selectedDay && (
          <div className="mt-3 pt-2 border-t border-slate-100 flex justify-between items-center text-[10px]">
            <span className="text-slate-500">Filtrando: <strong>{selectedDay} de {MONTH_NAMES[month]}</strong></span>
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
        <h4 className="font-bold text-xs text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <CalendarIcon className="w-3.5 h-3.5 text-primary" />
          <span>{selectedDay ? `Entregas del Día ${selectedDay}` : 'Próximas Entregas'}</span>
        </h4>
        <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full">
          {displayedTasks.length} {displayedTasks.length === 1 ? 'Tarea' : 'Tareas'}
        </span>
      </div>

      {/* Task Items */}
      <div className="space-y-2.5 pb-6 flex-1">
        {displayedTasks.length === 0 ? (
          <div className="text-center p-5 bg-white/70 rounded-2xl border border-slate-200/70 shadow-sm">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-1.5" />
            <p className="text-xs text-slate-700 font-bold">Sin entregas para este día</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Selecciona otra fecha o pulsa "Ver todas".</p>
          </div>
        ) : (
          displayedTasks.map((task, idx) => (
            <div 
              key={task.id || idx} 
              className="bg-white rounded-2xl p-3 border-l-4 border-amber-500 shadow-sm hover:shadow-md transition-all relative overflow-hidden group"
            >
              <div className="flex gap-2.5 items-start mb-1.5">
                <div className="bg-amber-50 text-amber-700 p-2 rounded-xl flex-shrink-0 border border-amber-200">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="font-bold text-xs text-slate-900 line-clamp-1 group-hover:text-primary transition-colors">
                    {task.titulo}
                  </h5>
                  <p className="text-[10px] text-slate-500 font-medium line-clamp-1">
                    {task.subjectTitle || task.materia || 'Materia'} • <span className="font-bold text-slate-700">{task.tipo || 'TALLER'}</span>
                  </p>
                </div>
              </div>

              <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                <div className="font-bold text-rose-600 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>Vence: {task.fechaLimite || task.fecha_limite || '2026-09-30'}</span>
                </div>
                <span className="text-slate-400 font-medium">{task.docenteNombre || task.profesor || 'Docente'}</span>
              </div>
            </div>
          ))
        )}
      </div>

    </aside>
  );
}
