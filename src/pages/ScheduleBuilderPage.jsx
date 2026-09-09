import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function ScheduleBuilderPage() {
  const { user, sidebarOpen, getScheduleForGrade, updateScheduleForGrade } = useAuth();
  const [selectedGrado, setSelectedGrado] = useState('10° A');
  const [selectedJornada, setSelectedJornada] = useState('Mañana');
  
  const [blocks, setBlocks] = useState(getScheduleForGrade(selectedGrado));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlock, setEditingBlock] = useState(null);
  
  // Form State for Editing/Adding a Block
  const [horaSlot, setHoraSlot] = useState('06:30 - 07:30');
  const [lunesVal, setLunesVal] = useState('Matemáticas 3D');
  const [martesVal, setMartesVal] = useState('Biología 3D');
  const [miercolesVal, setMiercolesVal] = useState('Matemáticas 3D');
  const [juevesVal, setJuevesVal] = useState('Física 3D');
  const [viernesVal, setViernesVal] = useState('Química 3D');
  const [isBreakSlot, setIsBreakSlot] = useState(false);

  const [publishSuccess, setPublishSuccess] = useState(false);

  const handleGradoChange = (grado) => {
    setSelectedGrado(grado);
    setBlocks(getScheduleForGrade(grado));
  };

  const handleOpenEditModal = (block) => {
    setEditingBlock(block);
    setHoraSlot(block.hora);
    setLunesVal(block.lunes);
    setMartesVal(block.martes);
    setMiercolesVal(block.miercoles);
    setJuevesVal(block.jueves);
    setViernesVal(block.viernes);
    setIsBreakSlot(!!block.isBreak);
    setIsModalOpen(true);
  };

  const handleSaveBlock = (e) => {
    e.preventDefault();
    if (editingBlock) {
      setBlocks(prev => prev.map(b => b.id === editingBlock.id ? {
        ...b,
        hora: horaSlot,
        lunes: isBreakSlot ? 'DESCANSO Y RECREO' : lunesVal,
        martes: isBreakSlot ? 'DESCANSO Y RECREO' : martesVal,
        miercoles: isBreakSlot ? 'DESCANSO Y RECREO' : miercolesVal,
        jueves: isBreakSlot ? 'DESCANSO Y RECREO' : juevesVal,
        viernes: isBreakSlot ? 'DESCANSO Y RECREO' : viernesVal,
        isBreak: isBreakSlot
      } : b));
    } else {
      const newBlock = {
        id: Date.now(),
        hora: horaSlot,
        lunes: isBreakSlot ? 'DESCANSO Y RECREO' : lunesVal,
        martes: isBreakSlot ? 'DESCANSO Y RECREO' : martesVal,
        miercoles: isBreakSlot ? 'DESCANSO Y RECREO' : miercolesVal,
        jueves: isBreakSlot ? 'DESCANSO Y RECREO' : juevesVal,
        viernes: isBreakSlot ? 'DESCANSO Y RECREO' : viernesVal,
        isBreak: isBreakSlot
      };
      setBlocks([...blocks, newBlock]);
    }
    setIsModalOpen(false);
    setEditingBlock(null);
  };

  const handleDeleteBlock = (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta franja horaria?')) {
      setBlocks(prev => prev.filter(b => b.id !== id));
    }
  };

  const handlePublishSchedule = () => {
    updateScheduleForGrade(selectedGrado, blocks);
    setPublishSuccess(true);
    setTimeout(() => {
      setPublishSuccess(false);
    }, 2500);
  };

  return (
    <div className={`flex-1 ${sidebarOpen ? 'md:ml-72' : 'md:ml-0'} p-margin-mobile md:p-margin-desktop overflow-y-auto z-10 relative pt-24 md:pt-28 transition-all duration-300`}>
      
      {/* Header */}
      <header className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-container text-on-primary-container font-semibold text-xs mb-2">
              <span className="material-symbols-outlined text-sm">calendar_view_week</span>
              Gestión de Rectoría
            </div>
            <h1 className="font-display font-bold text-3xl md:text-4xl text-primary tracking-tight">
              Diseñador de Horario Escolar
            </h1>
            <p className="text-base text-on-surface-variant">
              Crea y edita el horario semanal de clases y descansos para enviarlo a profesores y alumnos.
            </p>
          </div>

          <button
            onClick={handlePublishSchedule}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 px-5 rounded-2xl shadow-lg transition-all flex items-center gap-2 self-start"
          >
            <span className="material-symbols-outlined text-base">send</span>
            <span>{publishSuccess ? '¡Enviado a Profesores y Alumnos!' : 'Publicar y Enviar Horario'}</span>
          </button>
        </div>
      </header>

      {/* Selectors for Grade and Jornada */}
      <div className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-3xl p-6 shadow-sm mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Seleccionar Grado / Salón</label>
            <select
              value={selectedGrado}
              onChange={(e) => handleGradoChange(e.target.value)}
              className="bg-slate-100 border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="10° A">Grado 10° A</option>
              <option value="10° B">Grado 10° B</option>
              <option value="11° A">Grado 11° A</option>
              <option value="11° B">Grado 11° B</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Jornada Escolar</label>
            <select
              value={selectedJornada}
              onChange={(e) => setSelectedJornada(e.target.value)}
              className="bg-slate-100 border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold text-slate-800 outline-none"
            >
              <option value="Mañana">Jornada Mañana (06:30 AM - 12:30 PM)</option>
              <option value="Tarde">Jornada Tarde (12:30 PM - 06:30 PM)</option>
              <option value="Noche">Jornada Noche (06:30 PM - 10:00 PM)</option>
            </select>
          </div>
        </div>

        <button
          onClick={() => {
            setEditingBlock(null);
            setHoraSlot('12:15 - 01:15');
            setLunesVal('Clase Libre');
            setMartesVal('Clase Libre');
            setMiercolesVal('Clase Libre');
            setJuevesVal('Clase Libre');
            setViernesVal('Clase Libre');
            setIsBreakSlot(false);
            setIsModalOpen(true);
          }}
          className="bg-primary hover:bg-primary/90 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-md transition-all flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-base">add_circle</span>
          <span>Agregar Franja Horaria</span>
        </button>
      </div>

      {/* Schedule Table */}
      <div className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-3xl p-6 shadow-sm overflow-x-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">calendar_month</span>
            Horario Oficial de {selectedGrado} ({selectedJornada})
          </h3>
          <span className="text-xs text-slate-500 font-medium">Lunes a Viernes</span>
        </div>

        <table className="w-full text-left text-xs border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
              <th className="p-3.5 w-32 border-r border-slate-200">Hora</th>
              <th className="p-3.5 border-r border-slate-200">Lunes</th>
              <th className="p-3.5 border-r border-slate-200">Martes</th>
              <th className="p-3.5 border-r border-slate-200">Miércoles</th>
              <th className="p-3.5 border-r border-slate-200">Jueves</th>
              <th className="p-3.5 border-r border-slate-200">Viernes</th>
              <th className="p-3.5 text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 font-semibold text-slate-800">
            {blocks.map((block) => (
              <tr 
                key={block.id} 
                className={`transition-colors ${
                  block.isBreak 
                    ? 'bg-amber-100/70 text-amber-950 font-bold' 
                    : 'hover:bg-slate-50/80'
                }`}
              >
                {/* Time Block */}
                <td className="p-3.5 font-bold text-slate-900 border-r border-slate-200 bg-slate-50/50">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm text-slate-400">schedule</span>
                    {block.hora}
                  </div>
                </td>

                {/* Days */}
                {block.isBreak ? (
                  <td colSpan="5" className="p-3.5 border-r border-slate-200 font-bold text-amber-900 tracking-wider text-center bg-amber-100/90">
                    DESCANSO Y RECREO INSTITUCIONAL
                  </td>
                ) : (
                  <>
                    <td className="p-3.5 border-r border-slate-200">{block.lunes}</td>
                    <td className="p-3.5 border-r border-slate-200">{block.martes}</td>
                    <td className="p-3.5 border-r border-slate-200">{block.miercoles}</td>
                    <td className="p-3.5 border-r border-slate-200">{block.jueves}</td>
                    <td className="p-3.5 border-r border-slate-200">{block.viernes}</td>
                  </>
                )}

                {/* Action Buttons */}
                <td className="p-3.5 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => handleOpenEditModal(block)}
                      className="p-1.5 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors"
                      title="Editar Franja Horaria"
                    >
                      <span className="material-symbols-outlined text-base block">edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteBlock(block.id)}
                      className="p-1.5 hover:bg-rose-100 text-rose-600 rounded-lg transition-colors"
                      title="Eliminar Franja"
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

      {/* EDIT/CREATE BLOCK MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 pt-20 md:pt-24 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl relative max-h-[82vh] overflow-y-auto">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center"
            >
              <span className="material-symbols-outlined text-base">close</span>
            </button>

            <h3 className="font-bold text-lg text-slate-900 mb-1">
              {editingBlock ? 'Editar Franja Horaria' : 'Nueva Franja Horaria'}
            </h3>
            <p className="text-xs text-slate-500 mb-4">Define la hora y materias o descanso de la jornada.</p>

            <form onSubmit={handleSaveBlock} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Rango de Hora</label>
                <input
                  type="text"
                  value={horaSlot}
                  onChange={(e) => setHoraSlot(e.target.value)}
                  placeholder="Ej. 08:30 - 09:15"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-slate-800 outline-none"
                  required
                />
              </div>

              {/* Is Break Checkbox */}
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isBreakCheck"
                  checked={isBreakSlot}
                  onChange={(e) => setIsBreakSlot(e.target.checked)}
                  className="w-4 h-4 accent-amber-600 rounded"
                />
                <label htmlFor="isBreakCheck" className="font-bold text-amber-900 cursor-pointer">
                  Marcar como Descanso / Recreo Institucional
                </label>
              </div>

              {!isBreakSlot && (
                <>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Lunes</label>
                    <input
                      type="text"
                      value={lunesVal}
                      onChange={(e) => setLunesVal(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-semibold text-slate-800 outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Martes</label>
                    <input
                      type="text"
                      value={martesVal}
                      onChange={(e) => setMartesVal(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-semibold text-slate-800 outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Miércoles</label>
                    <input
                      type="text"
                      value={miercolesVal}
                      onChange={(e) => setMiercolesVal(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-semibold text-slate-800 outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Jueves</label>
                    <input
                      type="text"
                      value={juevesVal}
                      onChange={(e) => setJuevesVal(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-semibold text-slate-800 outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Viernes</label>
                    <input
                      type="text"
                      value={viernesVal}
                      onChange={(e) => setViernesVal(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-semibold text-slate-800 outline-none"
                      required
                    />
                  </div>
                </>
              )}

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-bold hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-primary text-white font-bold shadow-md hover:bg-primary/90"
                >
                  Guardar Franja
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
