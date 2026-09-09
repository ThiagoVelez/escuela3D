import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { registerStaffUser } from '../services/api';
import { cleanText } from '../utils/textSanitizer';
import { 
  Users, 
  UserPlus, 
  ShieldCheck, 
  GraduationCap, 
  Sparkles, 
  Utensils, 
  UserCheck, 
  BookOpen, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  X, 
  Check, 
  Eye, 
  EyeOff, 
  CheckCircle2,
  Clock,
  Briefcase
} from 'lucide-react';

const INITIAL_STAFF = [
  { 
    id: 1, 
    nombre: 'Dra. Valentina Ríos', 
    email: 'docente@educol.edu.co', 
    rol: 'DOCENTE', 
    grado: 'Docente de Biología & Ciencias', 
    jornada: 'Mañana',
    telefono: '+57 312 456 7890'
  },
  { 
    id: 2, 
    nombre: 'María del Carmen Restrepo', 
    email: 'm.restrepo@educol.edu.co', 
    rol: 'ASEO', 
    grado: 'Servicios Generales (Bloque A & Salones 1-6)', 
    jornada: 'Mañana',
    telefono: '+57 310 987 6543'
  },
  { 
    id: 3, 
    nombre: 'Luz Dary Quintero', 
    email: 'l.quintero@educol.edu.co', 
    rol: 'RESTAURANTE', 
    grado: 'Chef Manipuladora Principal PAE', 
    jornada: 'Mañana',
    telefono: '+57 315 234 5678'
  },
  { 
    id: 4, 
    nombre: 'Carlos Administrador', 
    email: 'admin@educol.edu.co', 
    rol: 'ADMINISTRADOR', 
    grado: 'Coordinación TIC & Plataforma', 
    jornada: 'Mañana',
    telefono: '+57 300 112 2334'
  },
  { 
    id: 5, 
    nombre: 'Lic. Ricardo Morales', 
    email: 'coordinador@educol.edu.co', 
    rol: 'COORDINADOR', 
    grado: 'Coordinación de Convivencia', 
    jornada: 'Tarde',
    telefono: '+57 314 556 6778'
  },
  { 
    id: 6, 
    nombre: 'Mateo Gómez', 
    email: 'estudiante@educol.edu.co', 
    rol: 'ESTUDIANTE', 
    grado: '10° A', 
    jornada: 'Mañana',
    telefono: '+57 320 889 9001'
  },
  { 
    id: 7, 
    nombre: 'Rosalba Martínez', 
    email: 'r.martinez@educol.edu.co', 
    rol: 'RESTAURANTE', 
    grado: 'Auxiliar de Cocina & Manipulación de Alimentos', 
    jornada: 'Mañana',
    telefono: '+57 311 334 4556'
  },
  { 
    id: 8, 
    nombre: 'José Antonio Cárdenas', 
    email: 'j.cardenas@educol.edu.co', 
    rol: 'ASEO', 
    grado: 'Mantenimiento & Zonas Deportivas', 
    jornada: 'Tarde',
    telefono: '+57 316 778 8990'
  }
];

const ASEO_ZONES = [
  'Bloque A (Aulas 1 a 6 & Patios)',
  'Bloque B (Laboratorios & Aulas Especiales)',
  'Zonas Comunes, Cafetería & Baños Principales',
  'Bloque Administrativo & Rectoría',
  'Polideportivo & Canchas Exteriores',
  'Biblioteca & Salones de Informática'
];

const RESTAURANTE_ROLES = [
  'Chef Manipuladora Principal PAE',
  'Auxiliar de Cocina & Manipulación de Alimentos',
  'Supervisora de Comedor & Higiene',
  'Nutricionista Institucional / Menús Saludables',
  'Cajera & Control de Raciones de Almuerzo',
  'Auxiliar de Logística y Despensa'
];

const TEACHER_SUBJECTS = [
  'Docente de Biología & Ciencias Naturales',
  'Docente de Matemáticas & Geometría 3D',
  'Docente de Lengua Castellana & Literatura',
  'Docente de Física & Química',
  'Docente de Ciencias Sociales e Historia',
  'Docente de Tecnología e Informática',
  'Docente de Educación Física & Deportes',
  'Docente de Artes & Música',
  'Docente de Inglés'
];

const STUDENT_GRADES = ['10° A', '10° B', '11° A', '11° B'];

export default function StaffManagementPage() {
  const { user, sidebarOpen, addNotification } = useAuth();

  const [staffList, setStaffList] = useState(INITIAL_STAFF);
  const [filterRole, setFilterRole] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Creation Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [password, setPassword] = useState('Educol2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [rol, setRol] = useState('DOCENTE');
  const [jornada, setJornada] = useState('Mañana');
  
  // Dynamic fields based on role
  const [docenteMateria, setDocenteMateria] = useState(TEACHER_SUBJECTS[0]);
  const [aseoZona, setAseoZona] = useState(ASEO_ZONES[0]);
  const [restauranteCargo, setRestauranteCargo] = useState(RESTAURANTE_ROLES[0]);
  const [estudianteGrado, setEstudianteGrado] = useState(STUDENT_GRADES[0]);
  const [cargoPersonalizado, setCargoPersonalizado] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [savedSuccessToast, setSavedSuccessToast] = useState(false);

  // Edit Modal State
  const [editingStaff, setEditingStaff] = useState(null);
  const [editNombre, setEditNombre] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editRol, setEditRol] = useState('DOCENTE');
  const [editGrado, setEditGrado] = useState('');
  const [editJornada, setEditJornada] = useState('Mañana');
  const [editTelefono, setEditTelefono] = useState('');

  // Filtered staff calculation
  const filteredStaff = staffList.filter(item => {
    // Role filter
    if (filterRole === 'DOCENTE' && item.rol !== 'DOCENTE') return false;
    if (filterRole === 'ASEO' && item.rol !== 'ASEO') return false;
    if (filterRole === 'RESTAURANTE' && item.rol !== 'RESTAURANTE') return false;
    if (filterRole === 'DIRECTIVOS' && !['ADMINISTRADOR', 'COORDINADOR', 'RECTOR'].includes(item.rol)) return false;
    if (filterRole === 'ESTUDIANTE' && item.rol !== 'ESTUDIANTE') return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.nombre.toLowerCase().includes(q);
      const matchEmail = item.email.toLowerCase().includes(q);
      const matchGrado = (item.grado || '').toLowerCase().includes(q);
      const matchRol = item.rol.toLowerCase().includes(q);
      return matchName || matchEmail || matchGrado || matchRol;
    }

    return true;
  });

  const getRoleLabel = (r) => {
    switch (r) {
      case 'DOCENTE': return 'Docente';
      case 'ASEO': return 'Aseo & Mantenimiento';
      case 'RESTAURANTE': return 'Restaurante Escolar & PAE';
      case 'ADMINISTRADOR': return 'Administrador TIC';
      case 'COORDINADOR': return 'Coordinador';
      case 'RECTOR': return 'Rector Principal';
      case 'ESTUDIANTE': return 'Estudiante';
      default: return r;
    }
  };

  const getRoleBadge = (r) => {
    switch (r) {
      case 'DOCENTE':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-bold text-[11px] bg-blue-50 text-blue-800 border border-blue-200">
            <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
            <span>Docente</span>
          </span>
        );
      case 'ASEO':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-bold text-[11px] bg-teal-50 text-teal-800 border border-teal-200">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>Aseo & Servicios</span>
          </span>
        );
      case 'RESTAURANTE':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-bold text-[11px] bg-amber-50 text-amber-900 border border-amber-200">
            <Utensils className="w-3.5 h-3.5 text-amber-600" />
            <span>Restaurante Escolar</span>
          </span>
        );
      case 'ADMINISTRADOR':
      case 'RECTOR':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-bold text-[11px] bg-slate-800 text-white border border-slate-700">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>{r === 'RECTOR' ? 'Rector' : 'Administrador'}</span>
          </span>
        );
      case 'COORDINADOR':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-bold text-[11px] bg-purple-50 text-purple-800 border border-purple-200">
            <UserCheck className="w-3.5 h-3.5 text-purple-600" />
            <span>Coordinador</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-bold text-[11px] bg-emerald-50 text-emerald-800 border border-emerald-200">
            <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
            <span>Estudiante</span>
          </span>
        );
    }
  };

  const handleRegisterStaff = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    let assignedGrade = '';
    if (rol === 'DOCENTE') assignedGrade = docenteMateria;
    else if (rol === 'ASEO') assignedGrade = `Servicios Generales (${aseoZona})`;
    else if (rol === 'RESTAURANTE') assignedGrade = restauranteCargo;
    else if (rol === 'ESTUDIANTE') assignedGrade = estudianteGrado;
    else assignedGrade = cargoPersonalizado.trim() || `Personal ${rol}`;

    const newStaffItem = {
      id: Date.now(),
      nombre: cleanText(`${nombre.trim()} ${apellido.trim()}`),
      email: email.trim().toLowerCase(),
      rol,
      grado: cleanText(assignedGrade),
      jornada,
      telefono: telefono.trim() || '+57 300 000 0000'
    };

    // Call API with graceful fallback
    await registerStaffUser({
      ...newStaffItem,
      password
    });

    setStaffList(prev => [newStaffItem, ...prev]);
    setSubmitting(false);
    setIsModalOpen(false);
    setNombre('');
    setApellido('');
    setEmail('');
    setTelefono('');
    setCargoPersonalizado('');

    setSavedSuccessToast(true);
    setTimeout(() => setSavedSuccessToast(false), 3500);

    if (addNotification) {
      addNotification({
        title: 'Nuevo Registro de Personal',
        text: `Se ha registrado a ${newStaffItem.nombre} como ${getRoleLabel(rol)} en la institución.`,
        icon: 'users',
        color: 'text-primary',
        targetRole: 'ADMINISTRADOR'
      });
    }
  };

  const handleDeleteStaff = (id) => {
    const item = staffList.find(s => s.id === id);
    if (window.confirm(`¿Estás seguro de que deseas eliminar a ${item?.nombre || 'este usuario'} del registro institucional?`)) {
      setStaffList(prev => prev.filter(i => i.id !== id));
    }
  };

  const handleStartEdit = (item) => {
    setEditingStaff(item);
    setEditNombre(cleanText(item.nombre));
    setEditEmail(item.email);
    setEditRol(item.rol);
    setEditGrado(cleanText(item.grado || ''));
    setEditJornada(item.jornada || 'Mañana');
    setEditTelefono(item.telefono || '');
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    setStaffList(prev => prev.map(item => {
      if (item.id === editingStaff.id) {
        return {
          ...item,
          nombre: cleanText(editNombre.trim()),
          email: editEmail.trim().toLowerCase(),
          rol: editRol,
          grado: cleanText(editGrado.trim()),
          jornada: editJornada,
          telefono: editTelefono.trim()
        };
      }
      return item;
    }));
    setEditingStaff(null);
  };

  return (
    <div className={`flex-1 ${sidebarOpen ? 'md:ml-72' : 'md:ml-0'} p-4 sm:p-6 md:p-8 overflow-y-auto z-10 relative pt-20 md:pt-24 transition-all duration-300`}>
      
      {/* Header Banner */}
      <header className="mb-6 md:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-extrabold uppercase px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-200 tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                <span>Despacho de Rectoría & Gobernanza Institucional</span>
              </span>
            </div>
            <h1 className="font-display font-black text-2xl sm:text-3xl md:text-4xl text-slate-900 tracking-tight">
              Gestión Integral de Personal
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
              Inscribe y administra de forma centralizada a docentes, directivos, personal de aseo & mantenimiento, personal del restaurante escolar (PAE) y estudiantes.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-primary text-white font-bold text-xs sm:text-sm rounded-xl shadow-md hover:bg-primary/95 active:scale-95 transition-all self-start sm:self-auto shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            <span>Registrar Nuevo Personal</span>
          </button>
        </div>

        {savedSuccessToast && (
          <div className="mt-4 p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold rounded-xl animate-fadeIn flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Personal registrado exitosamente en la base de datos institucional.</span>
          </div>
        )}
      </header>

      {/* Role Filter Tabs & Search Bar */}
      <div className="bg-white/85 backdrop-blur-md rounded-2xl p-4 border border-slate-200/80 shadow-sm mb-6 space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none text-xs">
            {[
              { id: 'ALL', label: 'Todos', count: staffList.length },
              { id: 'DOCENTE', label: 'Docentes', count: staffList.filter(s => s.rol === 'DOCENTE').length },
              { id: 'ASEO', label: 'Aseo & Servicios', count: staffList.filter(s => s.rol === 'ASEO').length },
              { id: 'RESTAURANTE', label: 'Restaurante Escolar', count: staffList.filter(s => s.rol === 'RESTAURANTE').length },
              { id: 'DIRECTIVOS', label: 'Directivos', count: staffList.filter(s => ['ADMINISTRADOR', 'COORDINADOR', 'RECTOR'].includes(s.rol)).length },
              { id: 'ESTUDIANTE', label: 'Estudiantes', count: staffList.filter(s => s.rol === 'ESTUDIANTE').length }
            ].map(tab => {
              const active = filterRole === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setFilterRole(tab.id)}
                  className={`px-3 py-2 rounded-xl font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    active 
                      ? 'bg-primary text-white shadow-sm' 
                      : 'bg-slate-100 hover:bg-slate-200/70 text-slate-600'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                    active ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nombre, cargo o correo..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3.5 py-2 text-xs font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-primary/40"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Roster Table Card */}
      <div className="bg-white/85 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        
        <div className="p-4 bg-slate-50/70 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            <span className="text-xs font-extrabold text-slate-800">
              Personal Institucional Registrado ({filteredStaff.length})
            </span>
          </div>
          <span className="text-[10px] text-amber-800 font-extrabold bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
            Acceso & Control Rectoral
          </span>
        </div>

        {/* Responsive Table with overflow-x-auto */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[680px]">
            <thead>
              <tr className="bg-slate-100/70 text-[11px] font-extrabold text-slate-600 uppercase tracking-wider border-b border-slate-200">
                <th className="py-3 px-4 pl-6">Nombre & Apellido</th>
                <th className="py-3 px-4">Correo Institucional</th>
                <th className="py-3 px-4">Rol en la Institución</th>
                <th className="py-3 px-4">Área / Zona / Asignación</th>
                <th className="py-3 px-4">Jornada</th>
                <th className="py-3 px-4">Estado</th>
                <th className="py-3 px-4 text-right pr-6">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredStaff.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-400">
                    <Users className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p className="font-bold">No se encontraron registros de personal con los filtros actuales.</p>
                  </td>
                </tr>
              ) : (
                filteredStaff.map((item) => (
                  <tr key={item.id} className="hover:bg-amber-50/30 transition-colors">
                    <td className="py-3.5 px-4 pl-6 font-bold text-slate-900">
                      {cleanText(item.nombre)}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px]">
                      {item.email}
                    </td>
                    <td className="py-3.5 px-4">
                      {getRoleBadge(item.rol)}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-700">
                      {cleanText(item.grado || 'Asignación General')}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{item.jornada}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <Check className="w-3 h-3" />
                        <span>Habilitado</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right pr-6">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleStartEdit(item)}
                          className="p-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                          title="Editar Registro"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteStaff(item.id)}
                          className="p-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors"
                          title="Eliminar Registro"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* REGISTER STAFF MODAL */}
      {/* ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl relative my-auto border border-slate-100">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <span className="p-2 rounded-xl bg-amber-100 text-amber-800">
                <UserPlus className="w-5 h-5 text-primary" />
              </span>
              <div>
                <h3 className="font-display font-bold text-lg text-slate-900 leading-tight">
                  Registrar Personal Institucional
                </h3>
                <p className="text-[11px] text-slate-500">
                  Inscribe docentes, aseo, restaurante escolar, directivos o estudiantes.
                </p>
              </div>
            </div>

            <form onSubmit={handleRegisterStaff} className="space-y-3.5 text-xs mt-4">
              
              {/* Nombres y Apellidos */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nombre</label>
                  <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Ej. Carmen"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-primary/40 font-semibold text-slate-800"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Apellido</label>
                  <input
                    type="text"
                    value={apellido}
                    onChange={(e) => setApellido(e.target.value)}
                    placeholder="Ej. Restrepo"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-primary/40 font-semibold text-slate-800"
                    required
                  />
                </div>
              </div>

              {/* Correo y Teléfono */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Correo Electrónico</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="usuario@educol.edu.co"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-primary/40 font-mono text-[11px]"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Teléfono / WhatsApp</label>
                  <input
                    type="tel"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    placeholder="+57 300 123 4567"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-primary/40 font-semibold text-slate-800"
                  />
                </div>
              </div>

              {/* Rol y Jornada */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Rol a Asignar</label>
                  <select
                    value={rol}
                    onChange={(e) => setRol(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold outline-none text-slate-800"
                  >
                    <option value="DOCENTE">Docente</option>
                    <option value="ASEO">Empleado/a de Aseo & Servicios</option>
                    <option value="RESTAURANTE">Empleado/a de Restaurante Escolar (PAE)</option>
                    <option value="COORDINADOR">Coordinador/a</option>
                    <option value="ADMINISTRADOR">Administrador TIC</option>
                    <option value="ESTUDIANTE">Estudiante</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Jornada</label>
                  <select
                    value={jornada}
                    onChange={(e) => setJornada(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-semibold text-slate-800"
                  >
                    <option value="Mañana">Mañana (6:30 AM - 1:00 PM)</option>
                    <option value="Tarde">Tarde (1:00 PM - 6:30 PM)</option>
                    <option value="Completa">Jornada Única / Completa</option>
                  </select>
                </div>
              </div>

              {/* Dynamic Field: ASEO */}
              {rol === 'ASEO' && (
                <div className="p-3 bg-teal-50/70 border border-teal-200 rounded-xl space-y-2">
                  <label className="block font-bold text-teal-900 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-teal-700" />
                    <span>Zona / Bloque de Aseo & Mantenimiento Asignado</span>
                  </label>
                  <select
                    value={aseoZona}
                    onChange={(e) => setAseoZona(e.target.value)}
                    className="w-full bg-white border border-teal-300 rounded-xl p-2.5 font-semibold text-slate-800 outline-none"
                  >
                    {ASEO_ZONES.map(z => (
                      <option key={z} value={z}>{z}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Dynamic Field: RESTAURANTE */}
              {rol === 'RESTAURANTE' && (
                <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl space-y-2">
                  <label className="block font-bold text-amber-900 flex items-center gap-1.5">
                    <Utensils className="w-3.5 h-3.5 text-amber-700" />
                    <span>Cargo en Restaurante Escolar / PAE</span>
                  </label>
                  <select
                    value={restauranteCargo}
                    onChange={(e) => setRestauranteCargo(e.target.value)}
                    className="w-full bg-white border border-amber-300 rounded-xl p-2.5 font-semibold text-slate-800 outline-none"
                  >
                    {RESTAURANTE_ROLES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Dynamic Field: DOCENTE */}
              {rol === 'DOCENTE' && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-primary" />
                    <span>Asignatura o Cátedra Principal</span>
                  </label>
                  <select
                    value={docenteMateria}
                    onChange={(e) => setDocenteMateria(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-semibold text-slate-800 outline-none"
                  >
                    {TEACHER_SUBJECTS.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Dynamic Field: ESTUDIANTE */}
              {rol === 'ESTUDIANTE' && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-primary" />
                    <span>Grado del Estudiante</span>
                  </label>
                  <select
                    value={estudianteGrado}
                    onChange={(e) => setEstudianteGrado(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-slate-800 outline-none"
                  >
                    {STUDENT_GRADES.map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Custom Cargo for Coordinador / Administrador */}
              {['ADMINISTRADOR', 'COORDINADOR'].includes(rol) && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Dependencia o Cargo Específico
                  </label>
                  <input
                    type="text"
                    value={cargoPersonalizado}
                    onChange={(e) => setCargoPersonalizado(e.target.value)}
                    placeholder="Ej. Coordinación de Convivencia y Disciplina"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-semibold text-slate-800 outline-none"
                  />
                </div>
              )}

              {/* Password */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Contraseña Inicial de Acceso</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 pr-10 outline-none font-mono text-xs"
                    required
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-600 font-bold hover:bg-slate-100 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white font-bold shadow-md hover:bg-primary/95 transition-all disabled:opacity-50"
                >
                  {submitting ? (
                    <span>Registrando...</span>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span>Registrar en Personal</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* EDIT STAFF MODAL */}
      {/* ========================================================================= */}
      {editingStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl relative my-auto border border-slate-100">
            <button
              onClick={() => setEditingStaff(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <span className="p-2 rounded-xl bg-blue-100 text-blue-800">
                <Edit3 className="w-5 h-5 text-blue-600" />
              </span>
              <div>
                <h3 className="font-display font-bold text-lg text-slate-900 leading-tight">
                  Editar Registro de Personal
                </h3>
                <p className="text-[11px] text-slate-500">
                  Modifica la información, cargo o jornada del usuario.
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3.5 text-xs mt-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nombre Completo</label>
                <input
                  type="text"
                  value={editNombre}
                  onChange={(e) => setEditNombre(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-bold text-slate-800"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Correo Electrónico</label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-mono text-[11px]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Rol Institucional</label>
                  <select
                    value={editRol}
                    onChange={(e) => setEditRol(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold outline-none text-slate-800"
                  >
                    <option value="DOCENTE">Docente</option>
                    <option value="ASEO">Empleado/a de Aseo & Servicios</option>
                    <option value="RESTAURANTE">Empleado/a de Restaurante Escolar</option>
                    <option value="COORDINADOR">Coordinador/a</option>
                    <option value="ADMINISTRADOR">Administrador</option>
                    <option value="ESTUDIANTE">Estudiante</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Jornada</label>
                  <select
                    value={editJornada}
                    onChange={(e) => setEditJornada(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-semibold text-slate-800"
                  >
                    <option value="Mañana">Mañana</option>
                    <option value="Tarde">Tarde</option>
                    <option value="Completa">Jornada Única</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Área / Zona / Cargo Institucional
                </label>
                <input
                  type="text"
                  value={editGrado}
                  onChange={(e) => setEditGrado(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-semibold text-slate-800"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Teléfono</label>
                <input
                  type="tel"
                  value={editTelefono}
                  onChange={(e) => setEditTelefono(e.target.value)}
                  placeholder="+57 300 000 0000"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-semibold text-slate-800"
                />
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingStaff(null)}
                  className="px-4 py-2.5 rounded-xl text-slate-600 font-bold hover:bg-slate-100 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md transition-colors"
                >
                  <Check className="w-4 h-4" />
                  <span>Guardar Cambios</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
