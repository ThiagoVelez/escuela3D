import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUniversityCourses, UNIVERSITY_THEMES } from '../services/coursesService';
import { 
  Zap, 
  BookOpen, 
  ArrowRight, 
  School,
  Compass,
  Leaf,
  Calculator,
  Dna,
  Atom,
  GraduationCap,
  Globe,
  Microscope,
  Award
} from 'lucide-react';

const ICON_MAP = {
  Compass,
  Leaf,
  BookOpen,
  Calculator,
  Dna,
  Atom,
  GraduationCap,
  Globe,
  Microscope
};

export default function DashboardPage() {
  const { user, setSelectedSubject, sidebarOpen } = useAuth();
  const [universityCourses, setUniversityCourses] = useState([]);

  useEffect(() => {
    setUniversityCourses(getUniversityCourses());

    const handleCoursesUpdated = (e) => {
      setUniversityCourses(e.detail);
    };

    window.addEventListener('educol_courses_updated', handleCoursesUpdated);
    return () => window.removeEventListener('educol_courses_updated', handleCoursesUpdated);
  }, []);

  return (
    <div className={`flex-1 ${sidebarOpen ? 'md:ml-72' : 'md:ml-0'} ${user.rol === 'ESTUDIANTE' ? 'xl:pr-[360px]' : ''} p-4 sm:p-6 md:p-8 overflow-y-auto z-10 relative pt-20 md:pt-24 transition-all duration-300`}>
      
      {/* Header Banner */}
      <header className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl text-primary mb-1 tracking-tight">
              Bienvenido, {user.nombre}
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-on-surface-variant">
              Campus Virtual Institucional EduCol • Grado {user.grado || '10° A'} ({user.jornada || 'Mañana'})
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/70 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/80 shadow-sm self-start">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm">
              <Zap className="w-5 h-5 text-amber-600 fill-amber-600" />
            </div>
            <div>
              <div className="text-xs text-on-surface-variant font-medium">Nivel Académico</div>
              <div className="text-xs font-bold text-primary">{user.puntosExperiencia || 450} XP Acumulados</div>
            </div>
          </div>
        </div>
      </header>

      {/* Active Subjects Grid (University Academic Bento Style) */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg sm:text-xl font-bold text-on-background flex items-center gap-2">
            <School className="w-5 h-5 text-primary" />
            <span>Cátedras & Materias Universitarias Activas</span>
          </h2>
          <span className="text-xs font-semibold text-slate-500 bg-white/70 px-3 py-1 rounded-full border border-slate-200">
            {universityCourses.length} {universityCourses.length === 1 ? 'Cátedra Inscrita' : 'Cátedras Inscritas'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {universityCourses.map((course) => {
            const theme = UNIVERSITY_THEMES.find(t => t.id === course.themeId) || UNIVERSITY_THEMES[0];
            const IconComponent = ICON_MAP[course.iconName] || BookOpen;

            return (
              <div 
                key={course.id}
                onClick={() => setSelectedSubject(course)}
                className="bg-white/90 backdrop-blur-md rounded-2xl border border-white/80 shadow-sm hover:shadow-xl hover:scale-[1.015] transition-all cursor-pointer flex flex-col justify-between overflow-hidden group relative"
              >
                {/* Top Banner Accent */}
                <div className={`h-2.5 w-full bg-gradient-to-r ${theme.bannerGradient}`}></div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Faculty & Code Badge */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider truncate max-w-[170px]" title={course.faculty}>
                        {course.faculty || 'Facultad Institucional'}
                      </span>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-md ${theme.badge}`}>
                          {course.code || 'UNIV-101'}
                        </span>
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                          {course.credits || 4} CR
                        </span>
                      </div>
                    </div>

                    {/* Icon & Title */}
                    <div className="flex items-start gap-3.5 mb-3">
                      <div className={`w-11 h-11 rounded-xl ${theme.bgLight} flex items-center justify-center flex-shrink-0 shadow-xs mt-0.5 transition-transform group-hover:scale-105`}>
                        <IconComponent className={`w-5 h-5 ${theme.textPrimary}`} />
                      </div>
                      <div>
                        <h3 className="font-display font-bold text-base sm:text-lg text-slate-900 leading-snug group-hover:text-primary transition-colors">
                          {course.title}
                        </h3>
                        <p className="text-xs text-slate-500 line-clamp-1 italic mt-0.5">
                          {course.subtitle || 'Cátedra de Formación Superior'}
                        </p>
                      </div>
                    </div>

                    {/* Academic Info Pills */}
                    <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-100 space-y-1 text-xs text-slate-600 mb-4">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-slate-500 font-medium">Docente:</span>
                        <strong className="text-slate-800 truncate max-w-[160px]">{course.teacher?.name || 'Docente Titular'}</strong>
                      </div>
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-slate-500 font-medium">Horas / Semana:</span>
                        <strong className="text-slate-800">{course.weeklyHours || 4} Horas Semanales</strong>
                      </div>
                    </div>
                  </div>

                  {/* Progress & Enter Action */}
                  <div className="pt-3 border-t border-slate-100 mt-auto">
                    <div className="flex items-center justify-between text-xs mb-1.5 font-bold">
                      <span className="text-slate-600">Avance Curricular</span>
                      <span className="text-slate-900">{course.progress || 0}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden mb-3">
                      <div 
                        className="h-full rounded-full transition-all duration-500" 
                        style={{ 
                          width: `${course.progress || 0}%`,
                          backgroundColor: theme.primary 
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs font-bold text-primary group-hover:translate-x-0.5 transition-transform">
                      <span>Ingresar al Aula Virtual</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

