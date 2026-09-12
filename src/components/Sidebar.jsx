import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  BookOpen, 
  Calendar, 
  GraduationCap, 
  Settings, 
  HelpCircle, 
  Users, 
  CheckSquare, 
  FileText, 
  ShieldCheck, 
  GitBranch, 
  Clock,
  School,
  Mail,
  Network,
  Shield,
  UploadCloud,
  Award,
  ClipboardCheck,
  Share2
} from 'lucide-react';

export default function Sidebar() {
  const { user, activeTab, setActiveTab, sidebarOpen, setSidebarOpen } = useAuth();

  const getNavItems = () => {
    if (user.rol === 'DOCENTE') {
      return [
        { id: 'teacher-panel', label: 'Panel Docente & Directorio', icon: Users },
        { id: 'teacher-evaluations', label: 'Evaluaciones', icon: ClipboardCheck },
        { id: 'social-school', label: 'SocialSchool', icon: Share2 },
        { id: 'task-mail', label: 'Correo de Tareas', icon: Mail },
        { id: 'hierarchy', label: 'Jerarquía', icon: Network },
        { id: 'convivencia', label: 'Manual de Convivencia', icon: BookOpen },
        { id: 'course-studio', label: 'Diseño & Gestión de Cátedras', icon: School },
        { id: 'attendance', label: 'Toma de Asistencia', icon: CheckSquare },
        { id: 'schedule-view', label: 'Mi Horario de Clases', icon: Calendar },
        { id: 'reports', label: 'Informes a Rectoría', icon: FileText },
        { id: 'settings', label: 'Configuración', icon: Settings },
      ];
    }
    if (user.rol === 'RECTOR' || user.rol === 'ADMINISTRADOR') {
      return [
        { id: 'social-school', label: 'SocialSchool', icon: Share2 },
        { id: 'staff-management', label: 'Gestión de Personal', icon: ShieldCheck },
        { id: 'academic-setup', label: 'Asignación & Estructura Académica', icon: GitBranch },
        { id: 'school-crest', label: 'Escudo del Colegio', icon: Shield },
        { id: 'handbook-management', label: 'Manual de Convivencia', icon: BookOpen },
        { id: 'hierarchy', label: 'Jerarquía', icon: Network },
        { id: 'schedule-builder', label: 'Gestión de Horarios', icon: Clock },
        { id: 'rector-attendance-reports', label: 'Reportes de Asistencia & Horarios', icon: FileText },
        { id: 'settings', label: 'Configuración', icon: Settings },
      ];
    }
    // Default ESTUDIANTE
    return [
      { id: 'subjects', label: 'Materias Activas', icon: BookOpen },
      { id: 'evaluaciones', label: 'Evaluaciones', icon: ClipboardCheck },
      { id: 'social-school', label: 'SocialSchool', icon: Share2 },
      { id: 'submit-task', label: 'Entrega de Tareas', icon: UploadCloud },
      { id: 'graded-tasks', label: 'Trabajos Calificados', icon: Award },
      { id: 'assignments', label: 'Trabajos & Evaluaciones', icon: CheckSquare },
      { id: 'schedule-view', label: 'Horario de Clases', icon: Calendar },
      { id: 'convivencia', label: 'Manual de Convivencia', icon: FileText },
      { id: 'grades', label: 'Calificaciones', icon: GraduationCap },
      { id: 'settings', label: 'Configuración', icon: Settings },
    ];
  };

  const navItems = getNavItems();

  const handleNavClick = (id) => {
    setActiveTab(id);
    if (window.innerWidth < 768 && setSidebarOpen) {
      setSidebarOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-20 md:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      <aside className={`fixed left-0 top-0 h-full z-30 flex flex-col p-4 bg-white/80 md:bg-white/40 backdrop-blur-[25px] w-72 rounded-r-2xl border-r border-white/60 shadow-[4px_0_24px_rgba(0,0,0,0.06)] pt-20 md:pt-24 transition-all duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0 opacity-100 pointer-events-auto' : '-translate-x-full opacity-0 pointer-events-none'
      }`}>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto pr-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const IconComponent = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-xs md:text-sm transition-all group text-left ${
                  isActive
                    ? 'bg-primary text-white shadow-[0_4px_12px_rgba(113,92,0,0.25)] translate-x-1'
                    : 'text-slate-700 hover:bg-white/60 hover:text-primary hover:translate-x-1'
                }`}
              >
                <IconComponent className={`w-4 h-4 flex-shrink-0 transition-transform ${isActive ? 'scale-110' : 'group-hover:scale-105'}`} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer: Ayuda y Soporte Únicamente (Cerrar Sesión se reubica dentro del Perfil) */}
        <div className="mt-auto space-y-1.5 pt-3 border-t border-slate-200/60">
          <button 
            onClick={() => handleNavClick('help')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-xs md:text-sm group transition-all hover:translate-x-1 ${
              activeTab === 'help' ? 'bg-primary text-white shadow-md' : 'text-slate-700 hover:bg-white/60 hover:text-primary'
            }`}
          >
            <HelpCircle className="w-4 h-4 flex-shrink-0 group-hover:scale-105" />
            <span>Ayuda y Soporte</span>
          </button>
        </div>
      </aside>
    </>
  );
}
