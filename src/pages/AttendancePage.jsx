import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const MOCK_CLASSROOMS = [
  {
    id: '10a-bio',
    grado: '10° A',
    materia: 'Biología 3D & Ciencias',
    jornada: 'Mañana',
    horario: '06:30 - 07:30 AM',
    salon: 'Aula 201 - Bloque 3D',
    estudiantesCount: 8,
    docente: 'Dra. Valentina Ríos',
    estudiantes: [
      { id: 1, documento: 'TI-1.029.384.910', nombre: 'Mateo Gómez', avatar: 'https://i.pravatar.cc/150?u=mateo', asistencia: 'vino', observacion: '' },
      { id: 2, documento: 'TI-1.032.495.102', nombre: 'Sofía Morales', avatar: 'https://i.pravatar.cc/150?u=sofia', asistencia: 'vino', observacion: '' },
      { id: 3, documento: 'TI-1.018.293.481', nombre: 'Juan Pablo Rodríguez', avatar: 'https://i.pravatar.cc/150?u=juan', asistencia: 'vino', observacion: '' },
      { id: 4, documento: 'TI-1.027.394.819', nombre: 'Camila Andrea Silva', avatar: 'https://i.pravatar.cc/150?u=camila', asistencia: 'excusa', observacion: 'Presentó incapacidad médica EPS' },
      { id: 5, documento: 'TI-1.031.928.374', nombre: 'Andrés Felipe Vargas', avatar: 'https://i.pravatar.cc/150?u=andres', asistencia: 'vino', observacion: '' },
      { id: 6, documento: 'TI-1.025.849.201', nombre: 'Valentina Herrera', avatar: 'https://i.pravatar.cc/150?u=valeria', asistencia: 'no_vino', observacion: 'Sin justificación reportada' },
      { id: 7, documento: 'TI-1.019.384.726', nombre: 'Lucas Esteban Castro', avatar: 'https://i.pravatar.cc/150?u=lucas', asistencia: 'vino', observacion: 'Llegó 5 min tarde' },
      { id: 8, documento: 'TI-1.033.918.273', nombre: 'Mariana Mendoza', avatar: 'https://i.pravatar.cc/150?u=mariana', asistencia: 'vino', observacion: '' }
    ]
  },
  {
    id: '10b-bio',
    grado: '10° B',
    materia: 'Biología 3D & Laboratorio',
    jornada: 'Mañana',
    horario: '07:30 - 08:30 AM',
    salon: 'Laboratorio de Ciencias 1',
    estudiantesCount: 6,
    docente: 'Dra. Valentina Ríos',
    estudiantes: [
      { id: 101, documento: 'TI-1.028.192.837', nombre: 'Daniel Alejandro Torres', avatar: 'https://i.pravatar.cc/150?u=daniel', asistencia: 'vino', observacion: '' },
      { id: 102, documento: 'TI-1.034.918.273', nombre: 'Isabella Gómez Pérez', avatar: 'https://i.pravatar.cc/150?u=isabella', asistencia: 'vino', observacion: '' },
      { id: 103, documento: 'TI-1.017.293.847', nombre: 'Santiago Ruiz Martínez', avatar: 'https://i.pravatar.cc/150?u=santiago', asistencia: 'no_vino', observacion: '' },
      { id: 104, documento: 'TI-1.026.394.810', nombre: 'Gabriela López', avatar: 'https://i.pravatar.cc/150?u=gabriela', asistencia: 'vino', observacion: '' },
      { id: 105, documento: 'TI-1.030.192.837', nombre: 'Nicolás Ramírez', avatar: 'https://i.pravatar.cc/150?u=nicolas', asistencia: 'vino', observacion: '' },
      { id: 106, documento: 'TI-1.022.384.719', nombre: 'Salomé Cardona', avatar: 'https://i.pravatar.cc/150?u=salome', asistencia: 'excusa', observacion: 'Permiso de rectoría por concurso' }
    ]
  },
  {
    id: '11a-nat',
    grado: '11° A',
    materia: 'Ciencias Naturales Avanzadas',
    jornada: 'Mañana',
    horario: '09:15 - 10:15 AM',
    salon: 'Aula 302',
    estudiantesCount: 5,
    docente: 'Dra. Valentina Ríos',
    estudiantes: [
      { id: 201, documento: 'CC-1.092.384.719', nombre: 'Carlos Eduardo Ospina', avatar: 'https://i.pravatar.cc/150?u=carloso', asistencia: 'vino', observacion: '' },
      { id: 202, documento: 'CC-1.098.273.645', nombre: 'Laura Natalia Jimeno', avatar: 'https://i.pravatar.cc/150?u=lauran', asistencia: 'vino', observacion: '' },
      { id: 303, documento: 'CC-1.091.827.364', nombre: 'Felipe Alexander Marín', avatar: 'https://i.pravatar.cc/150?u=felipea', asistencia: 'vino', observacion: '' },
      { id: 204, documento: 'CC-1.094.718.293', nombre: 'Manuela Beltrán', avatar: 'https://i.pravatar.cc/150?u=manuela', asistencia: 'vino', observacion: '' },
      { id: 205, documento: 'CC-1.095.827.192', nombre: 'Sebastián Patiño', avatar: 'https://i.pravatar.cc/150?u=sebast', asistencia: 'no_vino', observacion: 'Ausente en evaluación' }
    ]
  },
  {
    id: '9c-bio',
    grado: '9° C',
    materia: 'Introducción a Ciencias 3D',
    jornada: 'Tarde',
    horario: '13:00 - 14:00 PM',
    salon: 'Aula 104',
    estudiantesCount: 4,
    docente: 'Dra. Valentina Ríos',
    estudiantes: [
      { id: 301, documento: 'TI-1.045.928.371', nombre: 'Valeria Santos', avatar: 'https://i.pravatar.cc/150?u=valerias', asistencia: 'vino', observacion: '' },
      { id: 302, documento: 'TI-1.048.291.827', nombre: 'Emanuel Gutiérrez', avatar: 'https://i.pravatar.cc/150?u=emanuel', asistencia: 'vino', observacion: '' },
      { id: 303, documento: 'TI-1.042.819.283', nombre: 'Ana María Pineda', avatar: 'https://i.pravatar.cc/150?u=anap', asistencia: 'excusa', observacion: 'Cita odontológica' },
      { id: 304, documento: 'TI-1.046.192.837', nombre: 'Samuel David Osorio', avatar: 'https://i.pravatar.cc/150?u=samuel', asistencia: 'vino', observacion: '' }
    ]
  }
];

export default function AttendancePage() {
  const { user, sidebarOpen, addNotification } = useAuth();
  
  // Dashboard & Active Classroom State
  const [classrooms, setClassrooms] = useState(MOCK_CLASSROOMS);
  const [selectedClassroom, setSelectedClassroom] = useState(null);
  
  // Attendance records for the selected classroom
  const [attendanceList, setAttendanceList] = useState([]);
  const [generalObservations, setGeneralObservations] = useState('');
  const [sendingToRector, setSendingToRector] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterJornada, setFilterJornada] = useState('Todas');

  const todayDate = new Date().toLocaleDateString('es-CO', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Open a classroom for attendance taking
  const handleOpenClassroom = (cls) => {
    setSelectedClassroom(cls);
    setAttendanceList(cls.estudiantes.map(s => ({ ...s })));
    setGeneralObservations('');
    setSubmittedSuccess(false);
  };

  // Change individual attendance status
  const handleStatusChange = (studentId, newStatus) => {
    setAttendanceList(prev => prev.map(s => {
      if (s.id === studentId) {
        return { ...s, asistencia: newStatus };
      }
      return s;
    }));
  };

  // Change individual observation note
  const handleObservationChange = (studentId, note) => {
    setAttendanceList(prev => prev.map(s => {
      if (s.id === studentId) {
        return { ...s, observacion: note };
      }
      return s;
    }));
  };

  // Bulk set all students status
  const handleBulkSetStatus = (status) => {
    setAttendanceList(prev => prev.map(s => ({ ...s, asistencia: status })));
  };

  // Send copy to Rector / Director
  const handleSendAttendanceToRector = async (e) => {
    e.preventDefault();
    if (!selectedClassroom) return;
    setSendingToRector(true);

    const vinoCount = attendanceList.filter(s => s.asistencia === 'vino').length;
    const noVinoCount = attendanceList.filter(s => s.asistencia === 'no_vino').length;
    const excusaCount = attendanceList.filter(s => s.asistencia === 'excusa').length;

    // Build notification for Rector
    if (addNotification) {
      addNotification({
        title: `Llamado a Lista Recibido: ${selectedClassroom.grado}`,
        text: `El docente ${user.nombre || 'Docente'} envió la asistencia de ${selectedClassroom.grado} (${selectedClassroom.materia}). Presentes: ${vinoCount}, Ausentes: ${noVinoCount}, Con Excusa: ${excusaCount}.`,
        icon: 'fact_check',
        color: 'text-amber-600',
        targetRole: 'RECTOR'
      });
      addNotification({
        title: `Registro de Asistencia: ${selectedClassroom.grado}`,
        text: `Asistencia procesada para ${selectedClassroom.grado}. Presentes: ${vinoCount}, Ausentes: ${noVinoCount}.`,
        icon: 'fact_check',
        color: 'text-blue-600',
        targetRole: 'ADMINISTRADOR'
      });
    }

    // Update classroom status in main list
    setClassrooms(prev => prev.map(c => {
      if (c.id === selectedClassroom.id) {
        return {
          ...c,
          tomada: true,
          horaTomada: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          estudiantes: attendanceList
        };
      }
      return c;
    }));

    setTimeout(() => {
      setSendingToRector(false);
      setSubmittedSuccess(true);
    }, 800);
  };

  const filteredClassrooms = classrooms.filter(c => {
    const matchesJornada = filterJornada === 'Todas' || c.jornada === filterJornada;
    const matchesSearch = c.grado.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.materia.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesJornada && matchesSearch;
  });

  return (
    <div className={`flex-1 ${sidebarOpen ? 'md:ml-72' : 'md:ml-0'} p-margin-mobile md:p-margin-desktop overflow-y-auto z-10 relative pt-24 md:pt-28 transition-all duration-300`}>
      
      {/* Header */}
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 font-extrabold text-xs mb-2">
            <span className="material-symbols-outlined text-base">fact_check</span>
            Módulo de Gestión Escolar & Control de Asistencia
          </div>
          <h1 className="font-display font-bold text-3xl md:text-4xl text-primary mb-1 tracking-tight">
            Control y Toma de Asistencia
          </h1>
          <p className="text-sm md:text-base text-on-surface-variant capitalize">
            {todayDate} • Docente: <strong>{user.nombre || 'Docente Asignado'}</strong>
          </p>
        </div>

        {selectedClassroom && (
          <button
            onClick={() => setSelectedClassroom(null)}
            className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 self-start"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            <span>Volver al Dashboard de Salones</span>
          </button>
        )}
      </header>

      {/* VIEW 1: DASHBOARD DE SALONES ASIGNADOS */}
      {!selectedClassroom ? (
        <div className="space-y-6">
          
          {/* Filter Bar */}
          <div className="glass-card p-4 rounded-2xl border border-white/80 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-80">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar salón o materia..."
                className="w-full bg-white border border-slate-200 rounded-xl py-2 pl-9 pr-3 text-xs outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <span className="text-xs font-bold text-slate-600">Filtrar por Jornada:</span>
              <select
                value={filterJornada}
                onChange={(e) => setFilterJornada(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 outline-none"
              >
                <option value="Todas">Todas las Jornadas</option>
                <option value="Mañana">Jornada Mañana</option>
                <option value="Tarde">Jornada Tarde</option>
              </select>
            </div>
          </div>

          {/* Classroom Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {filteredClassrooms.map((cls) => (
              <div 
                key={cls.id}
                className="glass-card rounded-3xl p-6 border border-white/80 shadow-md relative overflow-hidden flex flex-col justify-between group hover:shadow-xl transition-all"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-container/20 rounded-full blur-2xl -mr-10 -mt-10"></div>

                <div>
                  {/* Card Badges */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="px-3 py-1 rounded-full bg-primary text-on-primary font-extrabold text-xs inline-block mb-1 shadow-sm">
                        Grado {cls.grado}
                      </span>
                      <div className="text-xs font-semibold text-slate-500">{cls.jornada} • {cls.horario}</div>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      cls.tomada ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-amber-100 text-amber-900 border border-amber-300'
                    }`}>
                      {cls.tomada ? `Tomada ${cls.horaTomada}` : 'Pendiente hoy'}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-display font-bold text-xl text-slate-900 mb-1">
                    {cls.materia}
                  </h3>
                  <p className="text-xs text-slate-600 mb-4 flex items-center gap-1">
                    <span className="material-symbols-outlined text-base text-slate-400">meeting_room</span>
                    <span>{cls.salon}</span>
                  </p>

                  <div className="flex items-center gap-4 bg-slate-50/80 p-3 rounded-2xl border border-slate-200/60 mb-6">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-2xl">groups</span>
                      <div>
                        <div className="text-xs font-bold text-slate-800">{cls.estudiantesCount} Alumnos</div>
                        <div className="text-[10px] text-slate-500">Inscriptos en Lista</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Open Classroom Button */}
                <button
                  onClick={() => handleOpenClassroom(cls)}
                  className="w-full bg-primary hover:bg-primary/90 text-on-primary font-bold text-xs py-3 px-4 rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 btn-3d"
                >
                  <span className="material-symbols-outlined text-base">fact_check</span>
                  <span>Tomar Asistencia del Salón</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>
            ))}
          </div>

        </div>
      ) : (
        
        /* VIEW 2: VENTANA DE LISTADO DE ESTUDIANTES Y LLAMADO A LISTA */
        <div className="space-y-6">
          
          {/* Banner of Active Classroom */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 font-extrabold text-xs mb-2">
                <span className="material-symbols-outlined text-base">school</span>
                Llamado a Lista Oficial • Grado {selectedClassroom.grado}
              </div>
              <h2 className="font-display font-bold text-2xl md:text-3xl text-white mb-1">
                {selectedClassroom.materia}
              </h2>
              <p className="text-xs md:text-sm text-slate-300">
                Horario: {selectedClassroom.horario} | Ubicación: {selectedClassroom.salon} | Total: {attendanceList.length} Estudiantes
              </p>
            </div>

            {/* Quick Bulk Action Buttons */}
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleBulkSetStatus('vino')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow transition-all flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">check_circle</span>
                <span>Todos Vino</span>
              </button>
              <button
                type="button"
                onClick={() => handleBulkSetStatus('no_vino')}
                className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow transition-all flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">cancel</span>
                <span>Todos No Vino</span>
              </button>
            </div>
          </div>

          {/* Submission Success Alert */}
          {submittedSuccess && (
            <div className="p-5 bg-emerald-50 border-2 border-emerald-300 text-emerald-900 rounded-3xl shadow-md flex items-center justify-between gap-4 animate-fadeIn">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-3xl text-emerald-600">verified</span>
                <div>
                  <div className="font-bold text-base">¡Copia de Asistencia Enviada Exitosamente a Rectoría!</div>
                  <div className="text-xs text-emerald-800">
                    Se registró el informe y se envió una notificación automática al Despacho del Rector.
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedClassroom(null)}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-4 py-2 rounded-xl"
              >
                Finalizar y Salir
              </button>
            </div>
          )}

          {/* Student Roster Table Form */}
          <form onSubmit={handleSendAttendanceToRector} className="space-y-6">
            <div className="glass-card rounded-3xl overflow-hidden border border-white/80 shadow-lg">
              
              <div className="p-4 bg-white/60 border-b border-slate-200 flex items-center justify-between flex-wrap gap-2">
                <span className="font-display font-bold text-sm text-slate-800 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-xl">list_alt</span>
                  Listado de Alumnos ({attendanceList.length})
                </span>

                <div className="flex gap-4 text-xs font-bold">
                  <span className="text-emerald-700 flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    Vino: {attendanceList.filter(s => s.asistencia === 'vino').length}
                  </span>
                  <span className="text-red-700 flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                    No Vino: {attendanceList.filter(s => s.asistencia === 'no_vino').length}
                  </span>
                  <span className="text-amber-700 flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                    Excusa: {attendanceList.filter(s => s.asistencia === 'excusa').length}
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100/80 text-slate-600 text-xs uppercase font-extrabold border-b border-slate-200">
                      <th className="py-3.5 px-4">Cédula / Documento ID</th>
                      <th className="py-3.5 px-4">Estudiante</th>
                      <th className="py-3.5 px-4 text-center">Estado de Asistencia (3 Casillas)</th>
                      <th className="py-3.5 px-4">Observaciones Individuales</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/60 text-xs">
                    {attendanceList.map((std) => (
                      <tr key={std.id} className="hover:bg-white/80 transition-colors">
                        
                        {/* 1. Documento / Cédula */}
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-700 whitespace-nowrap">
                          {std.documento}
                        </td>

                        {/* 2. Nombre del Estudiante */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={std.avatar}
                              alt={std.nombre}
                              className="w-9 h-9 rounded-full border border-slate-200 object-cover shadow-sm"
                            />
                            <div>
                              <div className="font-bold text-slate-900 text-sm">{std.nombre}</div>
                              <div className="text-[10px] text-slate-500">Grado {selectedClassroom.grado}</div>
                            </div>
                          </div>
                        </td>

                        {/* 3. Tres casillas de asistencia: Vino, No vino, Con excusa */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center justify-center gap-2">
                            
                            {/* Casilla 1: Vino */}
                            <label className={`cursor-pointer px-3 py-1.5 rounded-xl border font-bold transition-all flex items-center gap-1 ${
                              std.asistencia === 'vino'
                                ? 'bg-emerald-600 text-white border-emerald-600 shadow-md scale-105'
                                : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                            }`}>
                              <input
                                type="radio"
                                name={`attendance-${std.id}`}
                                value="vino"
                                checked={std.asistencia === 'vino'}
                                onChange={() => handleStatusChange(std.id, 'vino')}
                                className="sr-only"
                              />
                              <span className="material-symbols-outlined text-sm">check_circle</span>
                              <span>Vino</span>
                            </label>

                            {/* Casilla 2: No vino */}
                            <label className={`cursor-pointer px-3 py-1.5 rounded-xl border font-bold transition-all flex items-center gap-1 ${
                              std.asistencia === 'no_vino'
                                ? 'bg-red-600 text-white border-red-600 shadow-md scale-105'
                                : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                            }`}>
                              <input
                                type="radio"
                                name={`attendance-${std.id}`}
                                value="no_vino"
                                checked={std.asistencia === 'no_vino'}
                                onChange={() => handleStatusChange(std.id, 'no_vino')}
                                className="sr-only"
                              />
                              <span className="material-symbols-outlined text-sm">cancel</span>
                              <span>No vino</span>
                            </label>

                            {/* Casilla 3: Con excusa */}
                            <label className={`cursor-pointer px-3 py-1.5 rounded-xl border font-bold transition-all flex items-center gap-1 ${
                              std.asistencia === 'excusa'
                                ? 'bg-amber-500 text-white border-amber-500 shadow-md scale-105'
                                : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                            }`}>
                              <input
                                type="radio"
                                name={`attendance-${std.id}`}
                                value="excusa"
                                checked={std.asistencia === 'excusa'}
                                onChange={() => handleStatusChange(std.id, 'excusa')}
                                className="sr-only"
                              />
                              <span className="material-symbols-outlined text-sm">assignment_turned_in</span>
                              <span>Con excusa</span>
                            </label>

                          </div>
                        </td>

                        {/* 4. Apartado de observaciones de forma individual */}
                        <td className="py-3.5 px-4 min-w-[240px]">
                          <input
                            type="text"
                            value={std.observacion}
                            onChange={(e) => handleObservationChange(std.id, e.target.value)}
                            placeholder="Escribir observación individual..."
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-primary focus:bg-white"
                          />
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* General Notes & Submit Button to Rector */}
            <div className="glass-card p-6 rounded-3xl border border-white/80 shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="w-full md:w-2/3">
                <label className="block font-bold text-xs text-slate-700 mb-1">
                  Notas Generales de la Clase para Dirección / Rectoría (Opcional):
                </label>
                <input
                  type="text"
                  value={generalObservations}
                  onChange={(e) => setGeneralObservations(e.target.value)}
                  placeholder="Ej. Clase desarrollada con normalidad. Simulador 3D ejecutado al 100%..."
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <button
                type="submit"
                disabled={sendingToRector}
                className="w-full md:w-auto bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs py-3 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 btn-3d whitespace-nowrap self-end"
              >
                {sendingToRector ? (
                  <span>Enviando informe a Rectoría...</span>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-lg">send</span>
                    <span>Enviar Copia del Llamado a Lista al Director / Rector</span>
                  </>
                )}
              </button>
            </div>

          </form>
        </div>

      )}

    </div>
  );
}
