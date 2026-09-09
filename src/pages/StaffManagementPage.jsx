import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { registerStaffUser } from '../services/api';

export default function StaffManagementPage() {
  const { user, sidebarOpen } = useAuth();

  const [staffList, setStaffList] = useState([
    { id: 1, nombre: 'Dra. Valentina Ríos', email: 'docente@educol.edu.co', rol: 'DOCENTE', grado: 'Docente de Ciencias', jornada: 'Mañana' },
    { id: 2, nombre: 'Carlos Administrador', email: 'admin@educol.edu.co', rol: 'ADMINISTRADOR', grado: 'Coordinación TIC', jornada: 'Mañana' },
    { id: 3, nombre: 'Lic. Ricardo Morales', email: 'coordinador@educol.edu.co', rol: 'COORDINADOR', grado: 'Coordinación Académica', jornada: 'Tarde' },
    { id: 4, nombre: 'Mateo Gómez', email: 'estudiante@educol.edu.co', rol: 'ESTUDIANTE', grado: '10° A', jornada: 'Mañana' }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('Educol2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [rol, setRol] = useState('DOCENTE');
  const [grado, setGrado] = useState('10° A');
  const [jornada, setJornada] = useState('Mañana');
  const [submitting, setSubmitting] = useState(false);

  const handleRegisterStaff = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      nombre,
      apellido,
      email,
      password,
      rol,
      grado: rol === 'ESTUDIANTE' ? grado : `Personal ${rol}`,
      jornada
    };

    const res = await registerStaffUser(payload);
    if (res.success) {
      setStaffList(prev => [
        {
          id: Date.now(),
          nombre: `${nombre} ${apellido}`,
          email,
          rol,
          grado: payload.grado,
          jornada
        },
        ...prev
      ]);
    }

    setSubmitting(false);
    setIsModalOpen(false);
    setNombre('');
    setApellido('');
    setEmail('');
  };

  // Edit Modal State
  const [editingStaff, setEditingStaff] = useState(null);
  const [editNombre, setEditNombre] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editRol, setEditRol] = useState('DOCENTE');
  const [editGrado, setEditGrado] = useState('10° A');
  const [editJornada, setEditJornada] = useState('Mañana');

  const handleDeleteStaff = (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar a este miembro del personal?')) {
      setStaffList(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleStartEdit = (item) => {
    setEditingStaff(item);
    setEditNombre(item.nombre);
    setEditEmail(item.email);
    setEditRol(item.rol);
    setEditGrado(item.grado);
    setEditJornada(item.jornada);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    setStaffList(prev => prev.map(item => {
      if (item.id === editingStaff.id) {
        return {
          ...item,
          nombre: editNombre,
          email: editEmail,
          rol: editRol,
          grado: editGrado,
          jornada: editJornada
        };
      }
      return item;
    }));
    setEditingStaff(null);
  };

  return (
    <div className={`flex-1 ${sidebarOpen ? 'md:ml-72' : 'md:ml-0'} p-margin-mobile md:p-margin-desktop overflow-y-auto z-10 relative pt-24 md:pt-28 transition-all duration-300`}>
      
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-extrabold mb-2">
            <span className="material-symbols-outlined text-base">admin_panel_settings</span>
            Despacho del Rector / Gobernanza Institucional
          </div>
          <h1 className="font-display font-bold text-2xl md:text-4xl text-primary">
            Gestión Institucional de Personal
          </h1>
          <p className="text-sm text-slate-500">
            Únicamente el Rector o Administrador puede crear e inscribir coordinadores, docentes y estudiantes.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-on-primary font-bold text-xs md:text-sm px-5 py-3 rounded-2xl shadow-lg hover:shadow-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-lg">person_add</span>
          Registrar Nuevo Personal
        </button>
      </header>

      {/* Roster Table */}
      <div className="glass-card rounded-2xl overflow-hidden border border-white/80 shadow-md">
        <div className="p-4 bg-white/40 border-b border-slate-200/80 flex items-center justify-between">
          <span className="text-xs font-extrabold text-slate-700">
            Personal e Inscriptos en Institución ({staffList.length})
          </span>
          <span className="text-[11px] text-amber-700 font-bold bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
            Acceso Autorizado por Rectoría
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <th className="p-3.5 pl-6">Nombre y Apellido</th>
                <th className="p-3.5">Correo</th>
                <th className="p-3.5">Rol Institucional</th>
                <th className="p-3.5">Grado / Asignación</th>
                <th className="p-3.5">Jornada</th>
                <th className="p-3.5">Estado</th>
                <th className="p-3.5 text-right pr-6">Acciones (CRUD)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {staffList.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="p-3.5 pl-6 font-bold text-slate-900">
                    {item.nombre}
                  </td>
                  <td className="p-3.5 text-slate-600 font-mono">
                    {item.email ? `${item.email.split('@')[0].slice(0, 2)}••••@${item.email.split('@')[1] || ''}` : '••••••••'}
                  </td>
                  <td className="p-3.5">
                    <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${
                      item.rol === 'RECTOR' ? 'bg-amber-100 text-amber-900' :
                      item.rol === 'DOCENTE' ? 'bg-blue-100 text-blue-900' :
                      item.rol === 'COORDINADOR' ? 'bg-purple-100 text-purple-900' :
                      item.rol === 'ADMINISTRADOR' ? 'bg-slate-800 text-white' :
                      'bg-emerald-100 text-emerald-900'
                    }`}>
                      {item.rol}
                    </span>
                  </td>
                  <td className="p-3.5 font-semibold text-slate-700">
                    {item.grado}
                  </td>
                  <td className="p-3.5 text-slate-600">
                    {item.jornada}
                  </td>
                  <td className="p-3.5">
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Habilitado
                    </span>
                  </td>
                  <td className="p-3.5 text-right pr-6">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleStartEdit(item)}
                        className="px-2.5 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-xs flex items-center gap-1 transition-colors"
                        title="Editar Registro"
                      >
                        <span className="material-symbols-outlined text-sm">edit</span>
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteStaff(item.id)}
                        className="px-2.5 py-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold text-xs flex items-center gap-1 transition-colors"
                        title="Eliminar Registro"
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
      </div>

      {/* REGISTER STAFF MODAL */}
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
              Registrar Personal Institucional
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Inscribe docentes, coordinadores o estudiantes vinculados a la institución.
            </p>

            <form onSubmit={handleRegisterStaff} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nombre</label>
                  <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Ej. Ana María"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Apellido</label>
                  <input
                    type="text"
                    value={apellido}
                    onChange={(e) => setApellido(e.target.value)}
                    placeholder="Ej. López"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Correo Electrónico Institucional</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="usuario@educol.edu.co"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Rol a Asignar</label>
                  <select
                    value={rol}
                    onChange={(e) => setRol(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold outline-none"
                  >
                    <option value="DOCENTE">Docente</option>
                    <option value="COORDINADOR">Coordinador</option>
                    <option value="ADMINISTRADOR">Administrador</option>
                    <option value="ESTUDIANTE">Estudiante</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Jornada</label>
                  <select
                    value={jornada}
                    onChange={(e) => setJornada(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none"
                  >
                    <option value="Mañana">Mañana</option>
                    <option value="Tarde">Tarde</option>
                    <option value="Noche">Noche</option>
                  </select>
                </div>
              </div>

              {rol === 'ESTUDIANTE' && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Grado del Estudiante</label>
                  <select
                    value={grado}
                    onChange={(e) => setGrado(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold outline-none"
                  >
                    <option value="10° A">10° A</option>
                    <option value="10° B">10° B</option>
                    <option value="11° A">11° A</option>
                    <option value="11° B">11° B</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 mb-1">Contraseña Inicial</label>
                <div className="relative group">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 pr-10 outline-none"
                    required
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1 focus:outline-none"
                    title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    <span className="material-symbols-outlined text-base select-none">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
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
                  {submitting ? 'Creando...' : 'Crear Usuario'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT STAFF MODAL */}
      {editingStaff && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 pt-24 md:pt-28 pb-8 bg-slate-900/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-2xl relative my-auto">
            <button
              onClick={() => setEditingStaff(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center justify-center transition-colors z-10"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>

            <h3 className="font-display font-bold text-xl text-slate-900 mb-1 flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-600 text-2xl">edit</span>
              Editar Registro de Personal
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Modifica los datos del usuario en la institución.
            </p>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
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
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Rol Institucional</label>
                  <select
                    value={editRol}
                    onChange={(e) => setEditRol(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold outline-none"
                  >
                    <option value="DOCENTE">Docente</option>
                    <option value="COORDINADOR">Coordinador</option>
                    <option value="ADMINISTRADOR">Administrador</option>
                    <option value="ESTUDIANTE">Estudiante</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Jornada</label>
                  <select
                    value={editJornada}
                    onChange={(e) => setEditJornada(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none"
                  >
                    <option value="Mañana">Mañana</option>
                    <option value="Tarde">Tarde</option>
                    <option value="Noche">Noche</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Grado / Asignación</label>
                <input
                  type="text"
                  value={editGrado}
                  onChange={(e) => setEditGrado(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-semibold"
                  required
                />
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingStaff(null)}
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

    </div>
  );
}
