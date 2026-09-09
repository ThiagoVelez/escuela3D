import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchTeacherStudents, fetchAssignments, createAssignment } from '../services/api';

export default function TeacherDashboard() {
  const { user, sidebarOpen, addNotification } = useAuth();
  const [activeSubTab, setActiveSubTab] = useState('roster'); // 'roster', 'assignments', 'subjects'
  
  // Student Filters State
  const [selectedGrade, setSelectedGrade] = useState('Todos');
  const [selectedJornada, setSelectedJornada] = useState('Todas');
  const [selectedMateria, setSelectedMateria] = useState('Todas');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Data States
  const [students, setStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(true);
  
  // Modal State for New Assignment
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newType, setNewType] = useState('TALLER');
  const [newGrade, setNewGrade] = useState('10° A');
  const [newJornada, setNewJornada] = useState('Mañana');
  const [newDueDate, setNewDueDate] = useState('2026-08-15');
  const [newSubjectId, setNewSubjectId] = useState('2');
  const [submitting, setSubmitting] = useState(false);
  // Student Edit/Delete State
  const [editingStudent, setEditingStudent] = useState(null);
  const [editStudentNombre, setEditStudentNombre] = useState('');
  const [editStudentEmail, setEditStudentEmail] = useState('');
  const [editStudentGrado, setEditStudentGrado] = useState('10° A');
  const [editStudentJornada, setEditStudentJornada] = useState('Mañana');
  const [editStudentEstado, setEditStudentEstado] = useState('Activo');

  // Assignment Edit/Delete State
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [editAssignTitle, setEditAssignTitle] = useState('');
  const [editAssignDesc, setEditAssignDesc] = useState('');
  const [editAssignType, setEditAssignType] = useState('TALLER');
  const [editAssignGrade, setEditAssignGrade] = useState('10° A');
  const [editAssignJornada, setEditAssignJornada] = useState('Mañana');
  const [editAssignDueDate, setEditAssignDueDate] = useState('');

  const handleDeleteStudent = (id) => {
    if (window.confirm('¿Estás seguro de eliminar a este estudiante del directorio?')) {
      setStudents(prev => prev.filter(s => s.id !== id));
    }
  };

  const handleStartEditStudent = (std) => {
    setEditingStudent(std);
    setEditStudentNombre(std.nombre);
    setEditStudentEmail(std.email || '');
    setEditStudentGrado(std.grado || '10° A');
    setEditStudentJornada(std.jornada || 'Mañana');
    setEditStudentEstado(std.estado || 'Activo');
  };

  const handleSaveEditStudent = (e) => {
    e.preventDefault();
    setStudents(prev => prev.map(s => {
      if (s.id === editingStudent.id) {
        return {
          ...s,
          nombre: editStudentNombre,
          email: editStudentEmail,
          grado: editStudentGrado,
          jornada: editStudentJornada,
          estado: editStudentEstado
        };
      }
      return s;
    }));
    setEditingStudent(null);
  };

  const handleDeleteAssignment = (id) => {
    if (window.confirm('¿Estás seguro de eliminar este trabajo/taller?')) {
      setAssignments(prev => prev.filter(a => a.id !== id));
    }
  };

  const handleStartEditAssignment = (item) => {
    setEditingAssignment(item);
    setEditAssignTitle(item.titulo);
    setEditAssignDesc(item.descripcion);
    setEditAssignType(item.tipo || 'TALLER');
    setEditAssignGrade(item.gradoDestino || '10° A');
    setEditAssignJornada(item.jornadaDestino || 'Mañana');
    setEditAssignDueDate(item.fechaLimite || '');
  };

  const handleSaveEditAssignment = (e) => {
    e.preventDefault();
    setAssignments(prev => prev.map(a => {
      if (a.id === editingAssignment.id) {
        return {
          ...a,
          titulo: editAssignTitle,
          descripcion: editAssignDesc,
          tipo: editAssignType,
          gradoDestino: editAssignGrade,
          jornadaDestino: editAssignJornada,
          fechaLimite: editAssignDueDate
        };
      }
      return a;
    }));
    setEditingAssignment(null);
  };

  // Assigned subjects mock data
  const teacherSubjects = [
    { id: 2, code: 'BIO-202', title: 'Biología 3D', degree: '10° A y 10° B', jornada: 'Mañana / Tarde', studentCount: 48, icon: 'science', color: '#335ab4' },
    { id: 1, code: 'MAT-101', title: 'Matemáticas 3D', degree: '10° A y 11° A', jornada: 'Mañana', studentCount: 52, icon: 'calculate', color: '#715c00' },
    { id: 3, code: 'LIT-303', title: 'Literatura Colombiana', degree: '11° B', jornada: 'Noche', studentCount: 29, icon: 'menu_book', color: '#c0001f' }
  ];

  // Load students & assignments
  useEffect(() => {
    loadStudents();
    loadAssignmentsList();
  }, [selectedGrade, selectedJornada]);

  const loadStudents = async () => {
    setLoadingStudents(true);
    const data = await fetchTeacherStudents({
      grado: selectedGrade,
      jornada: selectedJornada
    });
    setStudents(data || []);
    setLoadingStudents(false);
  };

  const loadAssignmentsList = async () => {
    const list = await fetchAssignments();
    setAssignments(list || []);
  };

  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const selectedSubjObj = teacherSubjects.find(s => s.id === parseInt(newSubjectId));
    
    await createAssignment({
      materiaId: newSubjectId,
      subjectTitle: selectedSubjObj?.title || 'Materia 3D',
      titulo: newTitle,
      descripcion: newDesc,
      tipo: newType,
      gradoDestino: newGrade,
      jornadaDestino: newJornada,
      fechaLimite: newDueDate,
      docenteNombre: user.nombre
    });

    if (addNotification) {
      addNotification({
        title: 'Nueva Tarea Asignada',
        text: `Docente ${user.nombre} asignó "${newTitle}" para ${newGrade}.`,
        icon: 'assignment',
        color: 'text-amber-600',
        targetRole: 'ESTUDIANTE'
      });
    }

    setSubmitting(false);
    setIsModalOpen(false);
    setNewTitle('');
    setNewDesc('');
    loadAssignmentsList();
  };

  // Filter students locally by search & subject
  const filteredStudents = students.filter(s => {
    const matchesSearch = s.nombre.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedMateria === 'Todas' || (s.materia && s.materia === selectedMateria);
    return matchesSearch && matchesSubject;
  });

  return (
    <div className={`flex-1 ${sidebarOpen ? 'md:ml-72' : 'md:ml-0'} p-margin-mobile md:p-margin-desktop overflow-y-auto z-10 relative pt-24 md:pt-28 transition-all duration-300`}>
      
      {/* Header */}
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-container text-on-primary-container text-xs font-extrabold mb-2">
            <span className="material-symbols-outlined text-base">badge</span>
            Panel de Gestión Docente
          </div>
          <h1 className="font-display font-bold text-2xl md:text-4xl text-primary">
            ¡Bienvenido, {user.nombre}!
          </h1>
          <p className="text-sm text-slate-500">
            Gestiona tus materias asignadas, estudiantes por grado/jornada y publica talleres 3D.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-on-primary font-bold text-xs md:text-sm px-5 py-3 rounded-2xl shadow-lg hover:shadow-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-lg">post_add</span>
          Crear Trabajo / Taller
        </button>
      </header>

      {/* Sub Tabs Navigation */}
      <div className="flex gap-2 border-b border-slate-200 mb-6">
        <button
          onClick={() => setActiveSubTab('roster')}
          className={`pb-3 px-4 font-bold text-xs md:text-sm flex items-center gap-2 transition-all border-b-2 ${
            activeSubTab === 'roster'
              ? 'border-primary text-primary font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span className="material-symbols-outlined text-lg">groups</span>
          Directorio de Estudiantes
        </button>

        <button
          onClick={() => setActiveSubTab('assignments')}
          className={`pb-3 px-4 font-bold text-xs md:text-sm flex items-center gap-2 transition-all border-b-2 ${
            activeSubTab === 'assignments'
              ? 'border-primary text-primary font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span className="material-symbols-outlined text-lg">assignment</span>
          Trabajos y Cuestionarios ({assignments.length})
        </button>

        <button
          onClick={() => setActiveSubTab('subjects')}
          className={`pb-3 px-4 font-bold text-xs md:text-sm flex items-center gap-2 transition-all border-b-2 ${
            activeSubTab === 'subjects'
              ? 'border-primary text-primary font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span className="material-symbols-outlined text-lg">school</span>
          Mis Materias y Grados ({teacherSubjects.length})
        </button>
      </div>

      {/* TAB 1: DIRECTORIO DE ESTUDIANTES CON TRIPLE FILTRO */}
      {activeSubTab === 'roster' && (
        <div className="space-y-6">
          
          {/* Triple Filter Controls Bar */}
          <div className="glass-card rounded-2xl p-5 border border-white/80 shadow-md">
            <h3 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-primary text-base">filter_alt</span>
              Filtros Avanzados de Selección
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              
              {/* Filter 1: Grado */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">Grado Asignado</label>
                <select
                  value={selectedGrade}
                  onChange={(e) => setSelectedGrade(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-primary outline-none"
                >
                  <option value="Todos">Todos los Grados</option>
                  <option value="10° A">10° A</option>
                  <option value="10° B">10° B</option>
                  <option value="11° A">11° A</option>
                  <option value="11° B">11° B</option>
                </select>
              </div>

              {/* Filter 2: Jornada */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">Jornada</label>
                <select
                  value={selectedJornada}
                  onChange={(e) => setSelectedJornada(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-primary outline-none"
                >
                  <option value="Todas">Todas las Jornadas</option>
                  <option value="Mañana">Jornada Mañana</option>
                  <option value="Tarde">Jornada Tarde</option>
                  <option value="Noche">Jornada Noche</option>
                </select>
              </div>

              {/* Filter 3: Materia */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">Materia</label>
                <select
                  value={selectedMateria}
                  onChange={(e) => setSelectedMateria(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-primary outline-none"
                >
                  <option value="Todas">Todas las Materias</option>
                  <option value="Biología 3D">Biología 3D</option>
                  <option value="Matemáticas 3D">Matemáticas 3D</option>
                  <option value="Literatura Colombiana">Literatura Colombiana</option>
                </select>
              </div>

              {/* Search input */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">Búsqueda por Alumno</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-base">
                    search
                  </span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar por nombre..."
                    className="w-full bg-white border border-slate-200 rounded-xl py-2 pl-8 pr-3 text-xs text-slate-800 focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>
              </div>

            </div>
          </div>

          {/* Roster Table */}
          <div className="glass-card rounded-2xl overflow-hidden border border-white/80 shadow-md">
            <div className="p-4 bg-white/40 border-b border-slate-200/80 flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-700">
                Alumnos Registrados ({filteredStudents.length})
              </span>
              <span className="text-[11px] text-emerald-600 font-bold bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                100% Sincronizado
              </span>
            </div>

            {loadingStudents ? (
              <div className="p-8 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
                Cargando directorio de estudiantes...
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="p-12 text-center text-slate-500">
                <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">group_off</span>
                <p className="text-xs font-semibold">No se encontraron estudiantes para los filtros seleccionados.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                      <th className="p-3.5 pl-6">Estudiante</th>
                      <th className="p-3.5">Grado</th>
                      <th className="p-3.5">Jornada</th>
                      <th className="p-3.5">Avance 3D</th>
                      <th className="p-3.5">Estado</th>
                      <th className="p-3.5 text-right pr-6">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {filteredStudents.map((std) => (
                      <tr key={std.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="p-3.5 pl-6 flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-primary-container text-on-primary-container font-bold flex items-center justify-center shadow-sm">
                            {std.nombre.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">{std.nombre} {std.apellido || ''}</div>
                            <div className="text-[11px] text-slate-500 font-mono">
                              {std.email ? `${std.email.split('@')[0].slice(0, 2)}••••@${std.email.split('@')[1] || ''}` : '••••••••'}
                            </div>
                          </div>
                        </td>
                        <td className="p-3.5">
                          <span className="px-2.5 py-1 rounded-full bg-slate-100 font-bold text-[11px] text-slate-700">
                            {std.grado}
                          </span>
                        </td>
                        <td className="p-3.5 font-medium text-slate-600">
                          {std.jornada || 'Mañana'}
                        </td>
                        <td className="p-3.5">
                          <div className="w-28">
                            <div className="flex justify-between text-[10px] font-bold text-slate-600 mb-1">
                              <span>Progreso</span>
                              <span>{std.progreso}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-primary rounded-full transition-all duration-500" 
                                style={{ width: `${std.progreso}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="p-3.5">
                          <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                            (std.estado || 'Activo') === 'Activo' ? 'text-emerald-700 bg-emerald-50 border-emerald-200' :
                            std.estado === 'Expulsado' ? 'text-rose-700 bg-rose-50 border-rose-200' :
                            std.estado === 'Retirado' ? 'text-slate-700 bg-slate-100 border-slate-300' :
                            std.estado === 'Con excusa' ? 'text-amber-700 bg-amber-50 border-amber-200' :
                            'text-purple-700 bg-purple-50 border-purple-200'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              (std.estado || 'Activo') === 'Activo' ? 'bg-emerald-500' :
                              std.estado === 'Expulsado' ? 'bg-rose-500' :
                              std.estado === 'Retirado' ? 'bg-slate-500' :
                              std.estado === 'Con excusa' ? 'bg-amber-500' :
                              'bg-purple-500'
                            }`}></span>
                            {std.estado || 'Activo'}
                          </span>
                        </td>
                        <td className="p-3.5 text-right pr-6">
                          <div className="flex items-center justify-end gap-1.5">
                            <button 
                              onClick={() => handleStartEditStudent(std)}
                              className="px-2.5 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-xs flex items-center gap-1 transition-colors"
                              title="Editar Estudiante"
                            >
                              <span className="material-symbols-outlined text-sm">edit</span>
                              Editar
                            </button>
                            <button 
                              onClick={() => handleDeleteStudent(std.id)}
                              className="px-2.5 py-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold text-xs flex items-center gap-1 transition-colors"
                              title="Eliminar Estudiante"
                            >
                              <span className="material-symbols-outlined text-sm">delete</span>
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: TRABAJOS Y CUESTIONARIOS PUBLICADOS */}
      {activeSubTab === 'assignments' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-display font-bold text-lg text-slate-900">
              Asignaciones y Trabajos Creados por el Docente
            </h3>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-primary text-on-primary text-xs font-bold px-4 py-2 rounded-xl shadow flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-base">add</span>
              Nueva Asignación
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {assignments.map((item) => (
              <div key={item.id} className="glass-card rounded-2xl p-5 border border-white/80 shadow-md relative overflow-hidden">
                <div className="flex justify-between items-start mb-3">
                  <span className="px-3 py-1 rounded-full bg-primary-container text-on-primary-container font-extrabold text-[10px]">
                    {item.tipo || 'TALLER'}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 font-bold">
                      Límite: {item.fechaLimite}
                    </span>
                    <button
                      onClick={() => handleStartEditAssignment(item)}
                      className="p-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                      title="Editar Asignación"
                    >
                      <span className="material-symbols-outlined text-sm">edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteAssignment(item.id)}
                      className="p-1 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors"
                      title="Eliminar Asignación"
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </div>
                </div>

                <h4 className="font-display font-bold text-base text-slate-900 mb-1">
                  {item.titulo}
                </h4>
                <p className="text-xs text-slate-600 mb-4 line-clamp-2">
                  {item.descripcion}
                </p>

                <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500 font-semibold">
                  <span>Destino: <strong className="text-slate-800">{item.gradoDestino} ({item.jornadaDestino})</strong></span>
                  <span className="text-emerald-600 font-bold">{item.puntos || 100} Puntos XP</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: MIS MATERIAS Y GRADOS */}
      {activeSubTab === 'subjects' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {teacherSubjects.map((sub) => (
            <div key={sub.id} className="glass-card rounded-2xl p-6 border border-white/80 shadow-lg relative overflow-hidden">
              <div className="w-12 h-12 rounded-2xl bg-primary-container text-on-primary-container flex items-center justify-center text-2xl shadow-md mb-4">
                <span className="material-symbols-outlined">{sub.icon}</span>
              </div>
              <h3 className="font-display font-bold text-lg text-slate-900">{sub.title}</h3>
              <p className="text-xs font-semibold text-secondary mb-3">{sub.code}</p>

              <div className="space-y-2 text-xs border-t border-slate-200 pt-3">
                <div className="flex justify-between">
                  <span className="text-slate-500">Grados Asignados:</span>
                  <strong className="text-slate-800">{sub.degree}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Jornada:</span>
                  <strong className="text-slate-800">{sub.jornada}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Alumnos Inscritos:</span>
                  <strong className="text-emerald-600 font-bold">{sub.studentCount} Alumnos</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE ASSIGNMENT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 pt-24 md:pt-28 pb-8 bg-slate-900/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-2xl relative my-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center justify-center transition-colors z-10"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>

            <h3 className="font-display font-bold text-xl text-slate-900 mb-1">
              Crear Nuevo Trabajo o Taller 3D
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              El trabajo aparecerá automáticamente en las materias activas del salón seleccionado.
            </p>

            <form onSubmit={handleCreateAssignment} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Materia Asignada</label>
                <select
                  value={newSubjectId}
                  onChange={(e) => setNewSubjectId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold outline-none"
                >
                  {teacherSubjects.map(s => (
                    <option key={s.id} value={s.id}>{s.title} ({s.code})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Título de la Actividad</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ej. Taller 3D: Células Vegetales en Páramos"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tipo de Actividad</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-semibold outline-none"
                  >
                    <option value="TALLER">Taller 3D</option>
                    <option value="TRABAJO">Trabajo Práctico</option>
                    <option value="CUESTIONARIO">Cuestionario</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Grado Destino</label>
                  <select
                    value={newGrade}
                    onChange={(e) => setNewGrade(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-semibold outline-none"
                  >
                    <option value="Todos">Todos los Salones</option>
                    <option value="10° A">10° A</option>
                    <option value="10° B">10° B</option>
                    <option value="11° A">11° A</option>
                    <option value="11° B">11° B</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Descripción e Instrucciones</label>
                <textarea
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  rows="3"
                  placeholder="Describe las tareas que los estudiantes deben completar en el entorno 3D..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none"
                  required
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Jornada</label>
                  <select
                    value={newJornada}
                    onChange={(e) => setNewJornada(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none"
                  >
                    <option value="Mañana">Mañana</option>
                    <option value="Tarde">Tarde</option>
                    <option value="Noche">Noche</option>
                    <option value="Todas">Todas</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Fecha Límite</label>
                  <input
                    type="date"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none"
                    required
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-primary text-on-primary font-bold shadow-md hover:bg-primary/90"
                >
                  {submitting ? 'Publicando...' : 'Publicar a Alumnos'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT STUDENT MODAL */}
      {editingStudent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 pt-24 md:pt-28 pb-8 bg-slate-900/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-2xl relative my-auto">
            <button
              onClick={() => setEditingStudent(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center justify-center transition-colors z-10"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>

            <h3 className="font-display font-bold text-xl text-slate-900 mb-1 flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-600 text-2xl">edit</span>
              Editar Estudiante
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Modifica la información del alumno en el directorio.
            </p>

            <form onSubmit={handleSaveEditStudent} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nombre Completo</label>
                <input
                  type="text"
                  value={editStudentNombre}
                  onChange={(e) => setEditStudentNombre(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-bold text-slate-800"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Correo Electrónico</label>
                <input
                  type="email"
                  value={editStudentEmail}
                  onChange={(e) => setEditStudentEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Grado</label>
                  <select
                    value={editStudentGrado}
                    onChange={(e) => setEditStudentGrado(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold outline-none"
                  >
                    <option value="10° A">10° A</option>
                    <option value="10° B">10° B</option>
                    <option value="11° A">11° A</option>
                    <option value="11° B">11° B</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Jornada</label>
                  <select
                    value={editStudentJornada}
                    onChange={(e) => setEditStudentJornada(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none"
                  >
                    <option value="Mañana">Mañana</option>
                    <option value="Tarde">Tarde</option>
                    <option value="Noche">Noche</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Estado Disciplinario / Académico</label>
                <select
                  value={editStudentEstado}
                  onChange={(e) => setEditStudentEstado(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold outline-none text-slate-800"
                >
                  <option value="Activo">Activo</option>
                  <option value="Expulsado">Expulsado</option>
                  <option value="Retirado">Retirado</option>
                  <option value="Con excusa">Con excusa</option>
                  <option value="Sin excusa">Sin excusa</option>
                </select>
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-base">save</span>
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT ASSIGNMENT MODAL */}
      {editingAssignment && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 pt-24 md:pt-28 pb-8 bg-slate-900/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-2xl relative my-auto">
            <button
              onClick={() => setEditingAssignment(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center justify-center transition-colors z-10"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>

            <h3 className="font-display font-bold text-xl text-slate-900 mb-1 flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-600 text-2xl">edit_note</span>
              Editar Trabajo / Taller 3D
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Actualiza las instrucciones, fechas o salon asignado.
            </p>

            <form onSubmit={handleSaveEditAssignment} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Título de la Actividad</label>
                <input
                  type="text"
                  value={editAssignTitle}
                  onChange={(e) => setEditAssignTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-bold text-slate-800"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Descripción e Instrucciones</label>
                <textarea
                  value={editAssignDesc}
                  onChange={(e) => setEditAssignDesc(e.target.value)}
                  rows="3"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none"
                  required
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tipo de Actividad</label>
                  <select
                    value={editAssignType}
                    onChange={(e) => setEditAssignType(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold outline-none"
                  >
                    <option value="TALLER">Taller 3D</option>
                    <option value="CUESTIONARIO">Cuestionario</option>
                    <option value="EXPERIMENTO">Experimento 3D</option>
                    <option value="INVESTIGACION">Investigación</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Grado Destino</label>
                  <select
                    value={editAssignGrade}
                    onChange={(e) => setEditAssignGrade(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold outline-none"
                  >
                    <option value="10° A">10° A</option>
                    <option value="10° B">10° B</option>
                    <option value="11° A">11° A</option>
                    <option value="11° B">11° B</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Jornada</label>
                  <select
                    value={editAssignJornada}
                    onChange={(e) => setEditAssignJornada(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none"
                  >
                    <option value="Mañana">Mañana</option>
                    <option value="Tarde">Tarde</option>
                    <option value="Noche">Noche</option>
                    <option value="Todas">Todas</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Fecha Límite</label>
                  <input
                    type="date"
                    value={editAssignDueDate}
                    onChange={(e) => setEditAssignDueDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none"
                    required
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingAssignment(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-base">save</span>
                  Guardar Asignación
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
