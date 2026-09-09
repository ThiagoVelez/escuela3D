import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AcademicSetupPage() {
  const { sidebarOpen } = useAuth();
  const [activeSubTab, setActiveSubTab] = useState('assignments'); // 'assignments', 'subjects', 'classrooms', 'shifts'

  // Initial State: Teacher Assignments
  const [teacherAssignments, setTeacherAssignments] = useState([
    { id: 1, materia: 'Biología 3D', codigo: 'BIO-202', grado: '10° A', jornada: 'Mañana', docente: 'Dra. Valentina Ríos', docenteEmail: 'valentina.rios@educol.edu.co', estado: 'Activo' },
    { id: 2, materia: 'Matemáticas 3D', codigo: 'MAT-101', grado: '10° A', jornada: 'Mañana', docente: 'Ing. Alejandro Torres', docenteEmail: 'alejandro.torres@educol.edu.co', estado: 'Activo' },
    { id: 3, materia: 'Literatura Colombiana', codigo: 'LIT-303', grado: '11° B', jornada: 'Noche', docente: 'Lic. Carlos López', docenteEmail: 'carlos.lopez@educol.edu.co', estado: 'Activo' },
    { id: 4, materia: 'Física Cuántica 3D', codigo: 'FIS-401', grado: '11° A', jornada: 'Tarde', docente: 'Por Asignar', docenteEmail: '', estado: 'Pendiente' }
  ]);

  // Initial State: Subjects
  const [subjectsList, setSubjectsList] = useState([
    { id: 1, codigo: 'MAT-101', nombre: 'Matemáticas 3D', area: 'Ciencias Exactas', ihs: 5, estado: 'Activo' },
    { id: 2, codigo: 'BIO-202', nombre: 'Biología 3D', area: 'Ciencias Naturales', ihs: 4, estado: 'Activo' },
    { id: 3, codigo: 'LIT-303', nombre: 'Literatura Colombiana', area: 'Humanidades', ihs: 3, estado: 'Activo' },
    { id: 4, codigo: 'FIS-401', nombre: 'Física Cuántica 3D', area: 'Ciencias Exactas', ihs: 4, estado: 'Activo' }
  ]);

  // Initial State: Classrooms / Salones
  const [classroomsList, setClassroomsList] = useState([
    { id: 1, grado: '10° A', sede: 'Sede Principal Cundinamarca', capacidad: 35, directorGrupo: 'Dra. Valentina Ríos' },
    { id: 2, grado: '10° B', sede: 'Sede Principal Cundinamarca', capacidad: 32, directorGrupo: 'Lic. Carlos López' },
    { id: 3, grado: '11° A', sede: 'Sede Principal Cundinamarca', capacidad: 30, directorGrupo: 'Ing. Alejandro Torres' },
    { id: 4, grado: '11° B', sede: 'Sede Nocturna', capacidad: 28, directorGrupo: 'Por Asignar' }
  ]);

  // Initial State: Shifts / Jornadas
  const [shiftsList, setShiftsList] = useState([
    { id: 1, nombre: 'Jornada Mañana', horario: '06:30 AM - 12:30 PM', estado: 'Activa', totalEstudiantes: 420 },
    { id: 2, nombre: 'Jornada Tarde', horario: '12:30 PM - 06:30 PM', estado: 'Activa', totalEstudiantes: 310 },
    { id: 3, nombre: 'Jornada Noche', horario: '06:30 PM - 10:00 PM', estado: 'Activa', totalEstudiantes: 180 }
  ]);

  // Available Teachers List
  const availableTeachers = [
    { nombre: 'Dra. Valentina Ríos', email: 'valentina.rios@educol.edu.co' },
    { nombre: 'Ing. Alejandro Torres', email: 'alejandro.torres@educol.edu.co' },
    { nombre: 'Lic. Carlos López', email: 'carlos.lopez@educol.edu.co' },
    { nombre: 'Dra. María Fernanda Gómez', email: 'maria.gomez@educol.edu.co' }
  ];

  // Modals States
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [isClassroomModalOpen, setIsClassroomModalOpen] = useState(false);
  const [isShiftModalOpen, setIsShiftModalOpen] = useState(false);

  // Edit States
  const [editingItem, setEditingItem] = useState(null);

  // New Assign Form State
  const [assignMateria, setAssignMateria] = useState('Biología 3D');
  const [assignGrado, setAssignGrado] = useState('10° A');
  const [assignJornada, setAssignJornada] = useState('Mañana');
  const [assignDocente, setAssignDocente] = useState('Dra. Valentina Ríos');

  // New Subject Form State
  const [subjCodigo, setSubjCodigo] = useState('');
  const [subjNombre, setSubjNombre] = useState('');
  const [subjArea, setSubjArea] = useState('Ciencias Naturales');
  const [subjIhs, setSubjIhs] = useState(4);

  // New Classroom Form State
  const [roomGrado, setRoomGrado] = useState('');
  const [roomSede, setRoomSede] = useState('Sede Principal Cundinamarca');
  const [roomCapacidad, setRoomCapacidad] = useState(30);
  const [roomDirector, setRoomDirector] = useState('Por Asignar');

  // New Shift Form State
  const [shiftNombre, setShiftNombre] = useState('');
  const [shiftHorario, setShiftHorario] = useState('07:00 AM - 01:00 PM');

  // HANDLERS FOR ASSIGNMENTS
  const handleSaveAssignment = (e) => {
    e.preventDefault();
    if (editingItem) {
      setTeacherAssignments(prev => prev.map(a => a.id === editingItem.id ? {
        ...a,
        materia: assignMateria,
        grado: assignGrado,
        jornada: assignJornada,
        docente: assignDocente,
        estado: assignDocente === 'Por Asignar' ? 'Pendiente' : 'Activo'
      } : a));
    } else {
      const newObj = {
        id: Date.now(),
        materia: assignMateria,
        codigo: 'MAT-3D',
        grado: assignGrado,
        jornada: assignJornada,
        docente: assignDocente,
        docenteEmail: availableTeachers.find(t => t.nombre === assignDocente)?.email || '',
        estado: assignDocente === 'Por Asignar' ? 'Pendiente' : 'Activo'
      };
      setTeacherAssignments([newObj, ...teacherAssignments]);
    }
    setIsAssignModalOpen(false);
    setEditingItem(null);
  };

  const handleDeleteAssignment = (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta asignación académica?')) {
      setTeacherAssignments(prev => prev.filter(a => a.id !== id));
    }
  };

  // HANDLERS FOR SUBJECTS
  const handleSaveSubject = (e) => {
    e.preventDefault();
    if (editingItem) {
      setSubjectsList(prev => prev.map(s => s.id === editingItem.id ? {
        ...s,
        codigo: subjCodigo,
        nombre: subjNombre,
        area: subjArea,
        ihs: parseInt(subjIhs)
      } : s));
    } else {
      const newObj = {
        id: Date.now(),
        codigo: subjCodigo,
        nombre: subjNombre,
        area: subjArea,
        ihs: parseInt(subjIhs),
        estado: 'Activo'
      };
      setSubjectsList([newObj, ...subjectsList]);
    }
    setIsSubjectModalOpen(false);
    setEditingItem(null);
    setSubjCodigo('');
    setSubjNombre('');
  };

  const handleDeleteSubject = (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta materia?')) {
      setSubjectsList(prev => prev.filter(s => s.id !== id));
    }
  };

  // HANDLERS FOR CLASSROOMS
  const handleSaveClassroom = (e) => {
    e.preventDefault();
    if (editingItem) {
      setClassroomsList(prev => prev.map(c => c.id === editingItem.id ? {
        ...c,
        grado: roomGrado,
        sede: roomSede,
        capacidad: parseInt(roomCapacidad),
        directorGrupo: roomDirector
      } : c));
    } else {
      const newObj = {
        id: Date.now(),
        grado: roomGrado,
        sede: roomSede,
        capacidad: parseInt(roomCapacidad),
        directorGrupo: roomDirector
      };
      setClassroomsList([newObj, ...classroomsList]);
    }
    setIsClassroomModalOpen(false);
    setEditingItem(null);
    setRoomGrado('');
  };

  const handleDeleteClassroom = (id) => {
    if (window.confirm('¿Estás seguro de eliminar este salón/grado?')) {
      setClassroomsList(prev => prev.filter(c => c.id !== id));
    }
  };

  // HANDLERS FOR SHIFTS
  const handleSaveShift = (e) => {
    e.preventDefault();
    if (editingItem) {
      setShiftsList(prev => prev.map(s => s.id === editingItem.id ? {
        ...s,
        nombre: shiftNombre,
        horario: shiftHorario
      } : s));
    } else {
      const newObj = {
        id: Date.now(),
        nombre: shiftNombre,
        horario: shiftHorario,
        estado: 'Activa',
        totalEstudiantes: 0
      };
      setShiftsList([...shiftsList, newObj]);
    }
    setIsShiftModalOpen(false);
    setEditingItem(null);
    setShiftNombre('');
  };

  const handleDeleteShift = (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta jornada?')) {
      setShiftsList(prev => prev.filter(s => s.id !== id));
    }
  };

  return (
    <div className={`flex-1 ${sidebarOpen ? 'md:ml-72' : 'md:ml-0'} p-margin-mobile md:p-margin-desktop overflow-y-auto z-10 relative pt-24 md:pt-28 transition-all duration-300`}>
      
      {/* Header */}
      <header className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 font-semibold text-xs mb-2">
              <span className="material-symbols-outlined text-sm">account_tree</span>
              Gestión de Rectoría
            </div>
            <h1 className="font-display font-bold text-3xl md:text-4xl text-primary tracking-tight">
              Estructura & Asignación Académica
            </h1>
            <p className="text-base text-on-surface-variant">
              Administración institucional de materias 3D, salones, jornadas y asignación de docentes.
            </p>
          </div>
        </div>
      </header>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white/70 backdrop-blur-md rounded-2xl p-4 border border-white/80 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
            <span className="material-symbols-outlined">menu_book</span>
          </div>
          <div>
            <div className="text-xs text-slate-500 font-semibold">Materias 3D</div>
            <div className="text-xl font-bold text-slate-900">{subjectsList.length}</div>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-md rounded-2xl p-4 border border-white/80 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <span className="material-symbols-outlined">meeting_room</span>
          </div>
          <div>
            <div className="text-xs text-slate-500 font-semibold">Salones / Grados</div>
            <div className="text-xl font-bold text-slate-900">{classroomsList.length}</div>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-md rounded-2xl p-4 border border-white/80 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
            <span className="material-symbols-outlined">schedule</span>
          </div>
          <div>
            <div className="text-xs text-slate-500 font-semibold">Jornadas</div>
            <div className="text-xl font-bold text-slate-900">{shiftsList.length}</div>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-md rounded-2xl p-4 border border-white/80 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
            <span className="material-symbols-outlined">assignment_ind</span>
          </div>
          <div>
            <div className="text-xs text-slate-500 font-semibold">Asignaciones</div>
            <div className="text-xl font-bold text-slate-900">{teacherAssignments.length}</div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap bg-slate-200/60 p-1.5 rounded-2xl mb-6 max-w-2xl border border-slate-300/40">
        <button
          onClick={() => setActiveSubTab('assignments')}
          className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
            activeSubTab === 'assignments' ? 'bg-primary text-white shadow-md' : 'text-slate-700 hover:bg-white/50'
          }`}
        >
          <span className="material-symbols-outlined text-base">assignment_ind</span>
          Asignación Docente
        </button>

        <button
          onClick={() => setActiveSubTab('subjects')}
          className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
            activeSubTab === 'subjects' ? 'bg-primary text-white shadow-md' : 'text-slate-700 hover:bg-white/50'
          }`}
        >
          <span className="material-symbols-outlined text-base">menu_book</span>
          Materias 3D
        </button>

        <button
          onClick={() => setActiveSubTab('classrooms')}
          className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
            activeSubTab === 'classrooms' ? 'bg-primary text-white shadow-md' : 'text-slate-700 hover:bg-white/50'
          }`}
        >
          <span className="material-symbols-outlined text-base">meeting_room</span>
          Salones / Grados
        </button>

        <button
          onClick={() => setActiveSubTab('shifts')}
          className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
            activeSubTab === 'shifts' ? 'bg-primary text-white shadow-md' : 'text-slate-700 hover:bg-white/50'
          }`}
        >
          <span className="material-symbols-outlined text-base">schedule</span>
          Jornadas
        </button>
      </div>

      {/* TAB 1: TEACHER ASSIGNMENTS */}
      {activeSubTab === 'assignments' && (
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-3xl p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h3 className="font-bold text-lg text-slate-900">Asignación de Cargas Académicas</h3>
              <p className="text-xs text-slate-500">Asigna profesores a materias, salones correspondientes y jornadas escolares.</p>
            </div>
            <button
              onClick={() => {
                setEditingItem(null);
                setAssignMateria('Biología 3D');
                setAssignGrado('10° A');
                setAssignJornada('Mañana');
                setAssignDocente('Dra. Valentina Ríos');
                setIsAssignModalOpen(true);
              }}
              className="bg-primary text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-md hover:bg-primary/90 transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-base">person_add</span>
              <span>Nueva Asignación Docente</span>
            </button>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Materia 3D</th>
                  <th className="p-3.5">Grado / Salón</th>
                  <th className="p-3.5">Jornada</th>
                  <th className="p-3.5">Docente Asignado</th>
                  <th className="p-3.5">Estado</th>
                  <th className="p-3.5 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-medium text-slate-800">
                {teacherAssignments.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3.5 font-bold text-primary flex items-center gap-2">
                      <span className="material-symbols-outlined text-base">view_in_ar</span>
                      {item.materia}
                    </td>
                    <td className="p-3.5">
                      <span className="bg-slate-100 text-slate-800 px-2.5 py-1 rounded-lg font-bold">
                        {item.grado}
                      </span>
                    </td>
                    <td className="p-3.5">{item.jornada}</td>
                    <td className="p-3.5">
                      <div className="font-bold text-slate-900">{item.docente}</div>
                      <div className="text-[10px] text-slate-400">{item.docenteEmail}</div>
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                        item.estado === 'Activo' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {item.estado}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => {
                            setEditingItem(item);
                            setAssignMateria(item.materia);
                            setAssignGrado(item.grado);
                            setAssignJornada(item.jornada);
                            setAssignDocente(item.docente);
                            setIsAssignModalOpen(true);
                          }}
                          className="p-1.5 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors"
                          title="Editar Asignación"
                        >
                          <span className="material-symbols-outlined text-base block">edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteAssignment(item.id)}
                          className="p-1.5 hover:bg-rose-100 text-rose-600 rounded-lg transition-colors"
                          title="Eliminar Asignación"
                        >
                          <span className="material-symbols-outlined text-base block">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: SUBJECTS LIST */}
      {activeSubTab === 'subjects' && (
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-3xl p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h3 className="font-bold text-lg text-slate-900">Catálogo de Materias 3D</h3>
              <p className="text-xs text-slate-500">Administra las asignaturas disponibles en la plataforma institucional.</p>
            </div>
            <button
              onClick={() => {
                setEditingItem(null);
                setSubjCodigo('');
                setSubjNombre('');
                setSubjArea('Ciencias Naturales');
                setSubjIhs(4);
                setIsSubjectModalOpen(true);
              }}
              className="bg-primary text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-md hover:bg-primary/90 transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-base">add_box</span>
              <span>Crear Nueva Materia 3D</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {subjectsList.map(subj => (
              <div key={subj.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-white transition-all shadow-xs flex justify-between items-center">
                <div>
                  <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-md mb-1 inline-block">
                    {subj.codigo}
                  </span>
                  <h4 className="font-bold text-base text-slate-900">{subj.nombre}</h4>
                  <p className="text-xs text-slate-500">{subj.area} • {subj.ihs} Horas Semanales</p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setEditingItem(subj);
                      setSubjCodigo(subj.codigo);
                      setSubjNombre(subj.nombre);
                      setSubjArea(subj.area);
                      setSubjIhs(subj.ihs);
                      setIsSubjectModalOpen(true);
                    }}
                    className="p-2 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors"
                  >
                    <span className="material-symbols-outlined text-base block">edit</span>
                  </button>
                  <button
                    onClick={() => handleDeleteSubject(subj.id)}
                    className="p-2 hover:bg-rose-100 text-rose-600 rounded-xl transition-colors"
                  >
                    <span className="material-symbols-outlined text-base block">delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: CLASSROOMS */}
      {activeSubTab === 'classrooms' && (
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-3xl p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h3 className="font-bold text-lg text-slate-900">Directorio de Salones y Grados</h3>
              <p className="text-xs text-slate-500">Configuración de aulas físicas y virtuales de la institución.</p>
            </div>
            <button
              onClick={() => {
                setEditingItem(null);
                setRoomGrado('');
                setRoomSede('Sede Principal Cundinamarca');
                setRoomCapacidad(30);
                setRoomDirector('Por Asignar');
                setIsClassroomModalOpen(true);
              }}
              className="bg-primary text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-md hover:bg-primary/90 transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-base">domain_add</span>
              <span>Crear Salón / Grado</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {classroomsList.map(room => (
              <div key={room.id} className="p-4 rounded-2xl border border-slate-200 bg-white shadow-xs">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-xl">
                    Grado {room.grado}
                  </span>
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => {
                        setEditingItem(room);
                        setRoomGrado(room.grado);
                        setRoomSede(room.sede);
                        setRoomCapacidad(room.capacidad);
                        setRoomDirector(room.directorGrupo);
                        setIsClassroomModalOpen(true);
                      }}
                      className="text-slate-400 hover:text-slate-600 p-1"
                    >
                      <span className="material-symbols-outlined text-sm">edit</span>
                    </button>
                    <button 
                      onClick={() => handleDeleteClassroom(room.id)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </div>
                </div>
                <div className="font-semibold text-xs text-slate-700">{room.sede}</div>
                <div className="text-[11px] text-slate-500 mt-2">Capacidad: <strong>{room.capacidad} estudiantes</strong></div>
                <div className="text-[11px] text-slate-500">Director: <strong>{room.directorGrupo}</strong></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: SHIFTS */}
      {activeSubTab === 'shifts' && (
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-3xl p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h3 className="font-bold text-lg text-slate-900">Jornadas Escolares Habilitadas</h3>
              <p className="text-xs text-slate-500">Definición de turnos y horarios institucionales.</p>
            </div>
            <button
              onClick={() => {
                setEditingItem(null);
                setShiftNombre('');
                setShiftHorario('07:00 AM - 01:00 PM');
                setIsShiftModalOpen(true);
              }}
              className="bg-primary text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-md hover:bg-primary/90 transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-base">more_time</span>
              <span>Nueva Jornada</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {shiftsList.map(shift => (
              <div key={shift.id} className="p-5 rounded-2xl border border-amber-200/80 bg-amber-50/50 shadow-xs">
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-amber-700 text-xl">schedule</span>
                  <h4 className="font-bold text-base text-amber-950">{shift.nombre}</h4>
                </div>
                <div className="text-xs font-semibold text-amber-900 mb-3">{shift.horario}</div>
                <div className="flex justify-between items-center text-[10px] text-amber-800 border-t border-amber-200/60 pt-2">
                  <span>Estudiantes: <strong>{shift.totalEstudiantes}</strong></span>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => {
                        setEditingItem(shift);
                        setShiftNombre(shift.nombre);
                        setShiftHorario(shift.horario);
                        setIsShiftModalOpen(true);
                      }}
                      className="text-amber-900 font-bold hover:underline"
                    >
                      Editar
                    </button>
                    <button 
                      onClick={() => handleDeleteShift(shift.id)}
                      className="text-rose-600 font-bold hover:underline"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL 1: ASSIGNMENT MODAL */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 pt-20 md:pt-24 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl relative max-h-[82vh] overflow-y-auto">
            <button 
              onClick={() => setIsAssignModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center"
            >
              <span className="material-symbols-outlined text-base">close</span>
            </button>

            <h3 className="font-bold text-lg text-slate-900 mb-1">
              {editingItem ? 'Editar Asignación Docente' : 'Nueva Asignación Académica'}
            </h3>
            <p className="text-xs text-slate-500 mb-4">Selecciona la materia, salón y profesor asignado.</p>

            <form onSubmit={handleSaveAssignment} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Materia 3D</label>
                <select
                  value={assignMateria}
                  onChange={(e) => setAssignMateria(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-semibold text-slate-800"
                >
                  {subjectsList.map(s => <option key={s.id} value={s.nombre}>{s.nombre}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Salón / Grado</label>
                  <select
                    value={assignGrado}
                    onChange={(e) => setAssignGrado(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-semibold text-slate-800"
                  >
                    {classroomsList.map(c => <option key={c.id} value={c.grado}>{c.grado}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Jornada</label>
                  <select
                    value={assignJornada}
                    onChange={(e) => setAssignJornada(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-semibold text-slate-800"
                  >
                    {shiftsList.map(s => <option key={s.id} value={s.nombre.replace('Jornada ', '')}>{s.nombre}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Docente Asignado</label>
                <select
                  value={assignDocente}
                  onChange={(e) => setAssignDocente(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-semibold text-slate-800"
                >
                  <option value="Por Asignar">-- Por Asignar (Vacante) --</option>
                  {availableTeachers.map((t, idx) => (
                    <option key={idx} value={t.nombre}>{t.nombre}</option>
                  ))}
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAssignModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-bold hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-primary text-white font-bold shadow-md hover:bg-primary/90"
                >
                  Guardar Asignación
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: SUBJECT MODAL */}
      {isSubjectModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 pt-20 md:pt-24 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl relative max-h-[82vh] overflow-y-auto">
            <button 
              onClick={() => setIsSubjectModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center"
            >
              <span className="material-symbols-outlined text-base">close</span>
            </button>

            <h3 className="font-bold text-lg text-slate-900 mb-1">
              {editingItem ? 'Editar Materia 3D' : 'Crear Nueva Materia 3D'}
            </h3>

            <form onSubmit={handleSaveSubject} className="space-y-3 text-xs mt-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Código de Asignatura</label>
                <input
                  type="text"
                  value={subjCodigo}
                  onChange={(e) => setSubjCodigo(e.target.value)}
                  placeholder="Ej. QUI-301"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-semibold text-slate-800"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nombre de la Materia</label>
                <input
                  type="text"
                  value={subjNombre}
                  onChange={(e) => setSubjNombre(e.target.value)}
                  placeholder="Ej. Química Orgánica 3D"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-semibold text-slate-800"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Área Académica</label>
                <select
                  value={subjArea}
                  onChange={(e) => setSubjArea(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-semibold text-slate-800"
                >
                  <option value="Ciencias Naturales">Ciencias Naturales</option>
                  <option value="Ciencias Exactas">Ciencias Exactas</option>
                  <option value="Humanidades">Humanidades</option>
                  <option value="Tecnología e Informática">Tecnología e Informática</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Horas Semanales (IHS)</label>
                <input
                  type="number"
                  value={subjIhs}
                  onChange={(e) => setSubjIhs(e.target.value)}
                  min="1"
                  max="10"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-semibold text-slate-800"
                  required
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsSubjectModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-bold hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-primary text-white font-bold shadow-md hover:bg-primary/90"
                >
                  Guardar Materia
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: CLASSROOM MODAL */}
      {isClassroomModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 pt-20 md:pt-24 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl relative max-h-[82vh] overflow-y-auto">
            <button 
              onClick={() => setIsClassroomModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center"
            >
              <span className="material-symbols-outlined text-base">close</span>
            </button>

            <h3 className="font-bold text-lg text-slate-900 mb-1">
              {editingItem ? 'Editar Salón' : 'Crear Salón / Grado'}
            </h3>

            <form onSubmit={handleSaveClassroom} className="space-y-3 text-xs mt-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nombre del Grado / Salón</label>
                <input
                  type="text"
                  value={roomGrado}
                  onChange={(e) => setRoomGrado(e.target.value)}
                  placeholder="Ej. 11° C"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-semibold text-slate-800"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Sede Educativa</label>
                <input
                  type="text"
                  value={roomSede}
                  onChange={(e) => setRoomSede(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-semibold text-slate-800"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Capacidad Máxima (Estudiantes)</label>
                <input
                  type="number"
                  value={roomCapacidad}
                  onChange={(e) => setRoomCapacidad(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-semibold text-slate-800"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Director de Grupo</label>
                <select
                  value={roomDirector}
                  onChange={(e) => setRoomDirector(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-semibold text-slate-800"
                >
                  <option value="Por Asignar">-- Por Asignar --</option>
                  {availableTeachers.map((t, idx) => (
                    <option key={idx} value={t.nombre}>{t.nombre}</option>
                  ))}
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsClassroomModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-bold hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-primary text-white font-bold shadow-md hover:bg-primary/90"
                >
                  Guardar Salón
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: SHIFT MODAL */}
      {isShiftModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 pt-20 md:pt-24 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl relative max-h-[82vh] overflow-y-auto">
            <button 
              onClick={() => setIsShiftModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center"
            >
              <span className="material-symbols-outlined text-base">close</span>
            </button>

            <h3 className="font-bold text-lg text-slate-900 mb-1">
              {editingItem ? 'Editar Jornada' : 'Crear Nueva Jornada'}
            </h3>

            <form onSubmit={handleSaveShift} className="space-y-3 text-xs mt-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nombre de la Jornada</label>
                <input
                  type="text"
                  value={shiftNombre}
                  onChange={(e) => setShiftNombre(e.target.value)}
                  placeholder="Ej. Jornada Sabatina"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-semibold text-slate-800"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Horario Institucional</label>
                <input
                  type="text"
                  value={shiftHorario}
                  onChange={(e) => setShiftHorario(e.target.value)}
                  placeholder="Ej. 07:00 AM - 01:00 PM"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-semibold text-slate-800"
                  required
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsShiftModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-bold hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-primary text-white font-bold shadow-md hover:bg-primary/90"
                >
                  Guardar Jornada
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
