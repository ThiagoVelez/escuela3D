import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../context/AuthContext';
import { 
  getUniversityCourses, 
  saveUniversityCourse, 
  deleteUniversityCourse, 
  resetUniversityCourses, 
  UNIVERSITY_THEMES 
} from '../services/coursesService';
import { 
  BookOpen, 
  GraduationCap, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  Layers, 
  Clock, 
  Award, 
  CheckCircle2, 
  Sparkles, 
  Palette, 
  FileText, 
  BookCheck, 
  Compass, 
  Leaf, 
  Atom, 
  Calculator, 
  Dna, 
  Globe, 
  Microscope,
  RotateCcw,
  X,
  Save,
  Check,
  ChevronRight,
  School
} from 'lucide-react';

const ICON_OPTIONS = [
  { name: 'Compass', label: 'Compás / Geometría', icon: Compass },
  { name: 'Leaf', label: 'Hoja / Botánica', icon: Leaf },
  { name: 'BookOpen', label: 'Libro Abierto / Letras', icon: BookOpen },
  { name: 'Calculator', label: 'Calculadora / Análisis', icon: Calculator },
  { name: 'Dna', label: 'ADN / Genética', icon: Dna },
  { name: 'Atom', label: 'Átomo / Física', icon: Atom },
  { name: 'GraduationCap', label: 'Birrete / Cátedra', icon: GraduationCap },
  { name: 'Globe', label: 'Globo / Geografía', icon: Globe },
  { name: 'Microscope', label: 'Microscopio / Laboratorio', icon: Microscope }
];

const FACULTIES = [
  'Facultad de Ciencias Básicas e Ingeniería',
  'Facultad de Ciencias Naturales y Ambientales',
  'Facultad de Humanidades, Filosofía y Letras',
  'Facultad de Ciencias Sociales y Educación',
  'Facultad de Ciencias Económicas y Administrativas'
];

export default function CourseStudioPage() {
  const { user, sidebarOpen, setSelectedSubject, addNotification } = useAuth();
  const [courses, setCourses] = useState([]);
  const [editingCourse, setEditingCourse] = useState(null);
  const [activeStudioTab, setActiveStudioTab] = useState('identity'); // 'identity', 'theme', 'syllabus', 'units', 'resources'
  const [successToast, setSuccessToast] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    code: '',
    faculty: FACULTIES[0],
    department: '',
    credits: 4,
    level: '10° Bachillerato / Nivel Universitario Inicial',
    semester: 'Periodo Académico 2026 - Ciclo II',
    modality: 'Presencial / Híbrida',
    prerequisites: '',
    weeklyHours: 4,
    themeId: 'blue',
    iconName: 'Compass',
    teacherName: user?.nombre || 'Docente Titular',
    teacherEmail: user?.email || 'docente@educol.edu.co',
    teacherOfficeHours: 'Lunes y Miércoles: 2:00 PM - 4:00 PM',
    syllabusDesc: '',
    generalObjective: '',
    competencies: [''],
    evaluationMethodology: '',
    units: [],
    resources: []
  });

  const loadCourses = () => {
    const list = getUniversityCourses();
    setCourses(list);
  };

  useEffect(() => {
    loadCourses();

    const handleCoursesUpdated = (e) => {
      setCourses(e.detail);
    };

    window.addEventListener('educol_courses_updated', handleCoursesUpdated);
    return () => window.removeEventListener('educol_courses_updated', handleCoursesUpdated);
  }, []);

  const handleOpenCreateModal = () => {
    setEditingCourse('NEW');
    setActiveStudioTab('identity');
    setFormData({
      id: null,
      title: 'Nueva Cátedra Universitaria',
      subtitle: 'Cátedra de Formación Superior y Competencias Avanzadas',
      code: 'UNIV-101',
      faculty: FACULTIES[0],
      department: 'Departamento Académico',
      credits: 4,
      level: '10° Bachillerato / Nivel Universitario Inicial',
      semester: 'Periodo Académico 2026 - Ciclo II',
      modality: 'Presencial / Híbrida',
      prerequisites: 'Aprobación de ciclo previo',
      weeklyHours: 4,
      progress: 0,
      themeId: 'blue',
      iconName: 'GraduationCap',
      teacherName: user?.nombre || 'Docente Titular',
      teacherEmail: user?.email || 'docente@educol.edu.co',
      teacherOfficeHours: 'Martes y Jueves: 2:00 PM - 4:00 PM (Cubículo Docente)',
      syllabusDesc: 'Descripción detallada de la cátedra con fundamentación teórica y aplicación práctica.',
      generalObjective: 'Desarrollar competencias transversales mediante investigación formativa y rigor conceptual.',
      competencies: [
        'Capacidad de análisis crítico e interpretación formal de problemas disciplinares.',
        'Aplicación metodológica de soluciones fundamentadas en literatura científica.',
        'Comunicación asertiva de resultados con estándares académicos.'
      ],
      evaluationMethodology: '35% Talleres y estudios de caso, 25% Proyecto de investigación, 40% Evaluaciones parciales de cátedra.',
      units: [
        {
          id: 'u1',
          title: 'Unidad 1: Fundamentos y Epistemología Disciplinar',
          description: 'Conceptos basales, antecedentes teóricos y formulación de problemas.',
          hours: 16,
          weight: '30%',
          status: 'En Curso',
          lessons: ['Introducción a los conceptos clave', 'Metodología de indagación', 'Estudio de casos seminales']
        },
        {
          id: 'u2',
          title: 'Unidad 2: Desarrollo Metodológico y Práctico',
          description: 'Técnicas avanzadas y contrastación empírica en laboratorio o seminario.',
          hours: 20,
          weight: '35%',
          status: 'Pendiente',
          lessons: ['Protocolos y procedimientos', 'Análisis cualitativo y cuantitativo']
        }
      ],
      resources: [
        {
          title: 'Guía Oficial de Cátedra y Rúbricas de Evaluación',
          type: 'Documento Institucional (PDF)',
          author: 'Comité Curricular EduCol',
          callNumber: 'GUIA-UNIV-2026'
        }
      ]
    });
  };

  const handleOpenEditModal = (course) => {
    setEditingCourse(course);
    setActiveStudioTab('identity');
    setFormData({
      id: course.id,
      title: course.title || '',
      subtitle: course.subtitle || '',
      code: course.code || '',
      faculty: course.faculty || FACULTIES[0],
      department: course.department || '',
      credits: course.credits || 4,
      level: course.level || '10° Bachillerato / Nivel Universitario Inicial',
      semester: course.semester || 'Periodo Académico 2026 - Ciclo II',
      modality: course.modality || 'Presencial / Híbrida',
      prerequisites: course.prerequisites || '',
      weeklyHours: course.weeklyHours || 4,
      progress: course.progress || 0,
      themeId: course.themeId || 'blue',
      iconName: course.iconName || 'Compass',
      teacherName: course.teacher?.name || user?.nombre || 'Docente Titular',
      teacherEmail: course.teacher?.email || user?.email || 'docente@educol.edu.co',
      teacherOfficeHours: course.teacher?.officeHours || 'Lunes y Miércoles: 2:00 PM - 4:00 PM',
      syllabusDesc: course.syllabus?.description || '',
      generalObjective: course.syllabus?.generalObjective || '',
      competencies: course.syllabus?.competencies && course.syllabus.competencies.length > 0 
        ? course.syllabus.competencies 
        : ['Competencia principal del curso'],
      evaluationMethodology: course.syllabus?.evaluationMethodology || '',
      units: course.units || [],
      resources: course.resources || [],
      interactiveType: course.interactiveType || 'math'
    });
  };

  const handleSaveCourse = (e) => {
    e.preventDefault();

    const courseToSave = {
      id: formData.id || (editingCourse === 'NEW' ? null : editingCourse.id),
      title: formData.title,
      subtitle: formData.subtitle,
      code: formData.code,
      faculty: formData.faculty,
      department: formData.department,
      credits: parseInt(formData.credits) || 4,
      level: formData.level,
      semester: formData.semester,
      modality: formData.modality,
      prerequisites: formData.prerequisites,
      weeklyHours: parseInt(formData.weeklyHours) || 4,
      progress: formData.progress || 0,
      published: true,
      themeId: formData.themeId,
      iconName: formData.iconName,
      teacher: {
        name: formData.teacherName,
        title: 'Profesor Titular de Cátedra',
        email: formData.teacherEmail,
        officeHours: formData.teacherOfficeHours,
        department: formData.department || formData.faculty
      },
      syllabus: {
        description: formData.syllabusDesc,
        generalObjective: formData.generalObjective,
        competencies: formData.competencies.filter(c => c && c.trim().length > 0),
        evaluationMethodology: formData.evaluationMethodology
      },
      units: formData.units,
      resources: formData.resources,
      interactiveType: formData.interactiveType || (formData.title.toLowerCase().includes('bio') ? 'bio' : formData.title.toLowerCase().includes('lit') ? 'literature' : 'math')
    };

    saveUniversityCourse(courseToSave);
    setEditingCourse(null);
    setSuccessToast(`Cátedra "${courseToSave.title}" guardada y sincronizada con éxito.`);
    setTimeout(() => setSuccessToast(null), 3500);

    if (addNotification) {
      addNotification({
        title: 'Cátedra Universitaria Actualizada',
        text: `El docente actualizó la materia "${courseToSave.title}". Los estudiantes ya pueden ver el nuevo syllabus.`,
        icon: 'book',
        color: 'text-blue-600',
        targetRole: 'ESTUDIANTE'
      });
    }
  };

  const handleDeleteCourse = (course) => {
    if (window.confirm(`¿Estás seguro de eliminar la cátedra "${course.title}"? Esta acción se reflejará en el catálogo institucional.`)) {
      deleteUniversityCourse(course.id);
      setSuccessToast(`Cátedra "${course.title}" eliminada.`);
      setTimeout(() => setSuccessToast(null), 3000);
    }
  };

  const handleResetDefaults = () => {
    if (window.confirm('¿Deseas restablecer el catálogo de materias universitarias a su configuración institucional de fábrica?')) {
      resetUniversityCourses();
      setSuccessToast('Catálogo restablecido a valores predeterminados.');
      setTimeout(() => setSuccessToast(null), 3000);
    }
  };

  // Unit manipulation helpers
  const handleAddUnit = () => {
    const nextNum = formData.units.length + 1;
    const newUnit = {
      id: `u-${Date.now()}`,
      title: `Unidad ${nextNum}: Nuevo Eje Temático`,
      description: 'Descripción de las competencias y conceptos a desarrollar en esta unidad.',
      hours: 16,
      weight: '25%',
      status: 'Pendiente',
      lessons: ['Tema 1: Fundamentación teórica', 'Tema 2: Taller de aplicación']
    };
    setFormData(prev => ({
      ...prev,
      units: [...prev.units, newUnit]
    }));
  };

  const handleUpdateUnit = (index, field, value) => {
    setFormData(prev => {
      const updated = [...prev.units];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, units: updated };
    });
  };

  const handleDeleteUnit = (index) => {
    setFormData(prev => ({
      ...prev,
      units: prev.units.filter((_, i) => i !== index)
    }));
  };

  // Competencies helpers
  const handleAddCompetency = () => {
    setFormData(prev => ({
      ...prev,
      competencies: [...prev.competencies, '']
    }));
  };

  const handleUpdateCompetency = (index, val) => {
    setFormData(prev => {
      const copy = [...prev.competencies];
      copy[index] = val;
      return { ...prev, competencies: copy };
    });
  };

  const handleDeleteCompetency = (index) => {
    setFormData(prev => ({
      ...prev,
      competencies: prev.competencies.filter((_, i) => i !== index)
    }));
  };

  // Resources helpers
  const handleAddResource = () => {
    const newRes = {
      title: 'Nueva Lectura o Tratado de Cátedra',
      type: 'Lectura Universitaria Obligatoria',
      author: 'Autor de Referencia',
      callNumber: `BIB-${Math.floor(100 + Math.random() * 900)}`
    };
    setFormData(prev => ({
      ...prev,
      resources: [...prev.resources, newRes]
    }));
  };

  const handleUpdateResource = (index, field, value) => {
    setFormData(prev => {
      const copy = [...prev.resources];
      copy[index] = { ...copy[index], [field]: value };
      return { ...prev, resources: copy };
    });
  };

  const handleDeleteResource = (index) => {
    setFormData(prev => ({
      ...prev,
      resources: prev.resources.filter((_, i) => i !== index)
    }));
  };

  // Stats
  const totalCredits = courses.reduce((acc, c) => acc + (c.credits || 0), 0);
  const totalHours = courses.reduce((acc, c) => acc + (c.weeklyHours || 0), 0);

  const selectedTheme = UNIVERSITY_THEMES.find(t => t.id === formData.themeId) || UNIVERSITY_THEMES[0];
  const SelectedIconComp = ICON_OPTIONS.find(i => i.name === formData.iconName)?.icon || GraduationCap;

  return (
    <div className={`flex-1 ${sidebarOpen ? 'md:ml-72' : 'md:ml-0'} p-4 sm:p-6 md:p-8 overflow-y-auto relative pt-20 md:pt-24 transition-all duration-300`}>
      
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-emerald-500/40 flex items-center gap-3 animate-fadeIn text-xs font-bold">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Header Banner */}
      <header className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-extrabold uppercase px-3 py-1 rounded-full bg-blue-100 text-blue-900 border border-blue-200 tracking-wider flex items-center gap-1.5">
                <School className="w-3.5 h-3.5 text-blue-700" />
                <span>Nivel Académico Superior • Gestión de Cátedras</span>
              </span>
            </div>
            <h1 className="font-display font-black text-2xl sm:text-3xl md:text-4xl text-slate-900 tracking-tight">
              Diseño & Gestión de Cátedras Universitarias
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
              Diseña, estructura el syllabus y personaliza visualmente cada materia a tu gusto. Todos los cambios se reflejan inmediatamente en el campus virtual de tus estudiantes.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={handleResetDefaults}
              className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold shadow-xs flex items-center gap-2 transition-all"
              title="Restablecer materias predeterminadas"
            >
              <RotateCcw className="w-4 h-4 text-slate-500" />
              <span>Restablecer</span>
            </button>

            <button
              onClick={handleOpenCreateModal}
              className="px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-xs shadow-md hover:bg-primary/90 flex items-center gap-2 transition-all hover:scale-[1.02]"
            >
              <Plus className="w-4 h-4" />
              <span>Diseñar Nueva Cátedra</span>
            </button>
          </div>
        </div>
      </header>

      {/* Institutional Metrics Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center font-bold flex-shrink-0">
            <BookCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Cátedras Activas</div>
            <div className="text-xl font-display font-black text-slate-900">{courses.length} Materias</div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold flex-shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Créditos Totales</div>
            <div className="text-xl font-display font-black text-slate-900">{totalCredits} Créditos</div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center font-bold flex-shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Intensidad Horaria</div>
            <div className="text-xl font-display font-black text-slate-900">{totalHours} Horas / Sem.</div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-800 flex items-center justify-center font-bold flex-shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Modalidad</div>
            <div className="text-xl font-display font-black text-slate-900">Presencial / Híbrida</div>
          </div>
        </div>
      </div>

      {/* Courses Catalog Grid */}
      <div className="space-y-4 mb-10">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-display font-bold text-slate-900 flex items-center gap-2">
            <School className="w-4 h-4 text-primary" />
            <span>Catálogo Institucional de Cátedras Asignadas</span>
          </h2>
          <span className="text-xs text-slate-500">
            {courses.length} {courses.length === 1 ? 'materia registrada' : 'materias registradas'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => {
            const theme = UNIVERSITY_THEMES.find(t => t.id === course.themeId) || UNIVERSITY_THEMES[0];
            const IconCmp = ICON_OPTIONS.find(i => i.name === course.iconName)?.icon || GraduationCap;
            const unitsCount = course.units ? course.units.length : 0;
            const resourcesCount = course.resources ? course.resources.length : 0;

            return (
              <div 
                key={course.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col group relative"
              >
                {/* Header Gradient Top Bar */}
                <div className={`h-2.5 w-full bg-gradient-to-r ${theme.bannerGradient}`}></div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Faculty & Code Badge Row */}
                    <div className="flex items-center justify-between gap-2 mb-2.5 flex-wrap">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider truncate max-w-[200px]" title={course.faculty}>
                        {course.faculty || 'Facultad Institucional'}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-md ${theme.badge}`}>
                          {course.code || 'UNIV-100'}
                        </span>
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                          {course.credits || 4} CR
                        </span>
                      </div>
                    </div>

                    {/* Course Title and Icon */}
                    <div className="flex items-start gap-3 mb-2">
                      <div className={`w-10 h-10 rounded-xl ${theme.bgLight} flex items-center justify-center flex-shrink-0 shadow-xs mt-0.5`}>
                        <IconCmp className={`w-5 h-5 ${theme.textPrimary}`} />
                      </div>
                      <div>
                        <h3 className="font-display font-bold text-base text-slate-900 leading-snug group-hover:text-primary transition-colors">
                          {course.title}
                        </h3>
                        <p className="text-[11px] text-slate-500 line-clamp-1 italic mt-0.5">
                          {course.subtitle || 'Cátedra de Formación Superior'}
                        </p>
                      </div>
                    </div>

                    {/* Academic Metadata Grid */}
                    <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-100 space-y-1.5 text-xs text-slate-600 my-3">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-slate-500 font-medium">Docente Titular:</span>
                        <strong className="text-slate-900 truncate max-w-[150px]">{course.teacher?.name || user?.nombre}</strong>
                      </div>
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-slate-500 font-medium">Unidades Temáticas:</span>
                        <strong className="text-slate-800">{unitsCount} Unidades</strong>
                      </div>
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-slate-500 font-medium">Recursos / Bibliografía:</span>
                        <strong className="text-slate-800">{resourcesCount} Obras</strong>
                      </div>
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-slate-500 font-medium">Horas Semanales:</span>
                        <strong className="text-slate-800">{course.weeklyHours || 4} Horas</strong>
                      </div>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 mt-auto">
                    <button
                      onClick={() => setSelectedSubject(course)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors"
                      title="Previsualizar como estudiante"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-600" />
                      <span>Ver Alumno</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEditModal(course)}
                        className="px-3 py-1.5 bg-primary/10 hover:bg-primary text-primary hover:text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all"
                        title="Modificar diseño y syllabus a tu gusto"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Diseñar</span>
                      </button>

                      <button
                        onClick={() => handleDeleteCourse(course)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                        title="Eliminar cátedra"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* DESIGNER MODAL (DRAWER EXPANSIVO) */}
      {editingCourse && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 md:p-6 pt-20 md:pt-24 pb-6 bg-slate-950/80 backdrop-blur-sm animate-fadeIn overflow-y-auto">
          <div className="relative w-full max-w-5xl max-h-[85vh] bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-slate-200 my-auto">
            
            {/* Modal Top Header */}
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/90 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-primary text-white flex items-center justify-center shadow-md font-bold">
                  <Palette className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-display font-bold text-lg md:text-xl text-slate-900 leading-tight">
                      {editingCourse === 'NEW' ? 'Diseñar Nueva Cátedra Universitaria' : `Editar Cátedra: ${formData.title}`}
                    </h2>
                    <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                      {formData.code || 'CÁTEDRA'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 hidden sm:block">
                    Personaliza la identidad visual, el syllabus y las unidades temáticas a tu gusto profesional.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setEditingCourse(null)}
                className="w-9 h-9 rounded-xl bg-slate-200/80 hover:bg-rose-100 hover:text-rose-600 text-slate-600 flex items-center justify-center transition-colors"
                title="Cerrar diseñador"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Studio Navigation Tabs */}
            <div className="flex border-b border-slate-200 bg-white px-4 sm:px-6 gap-2 sm:gap-4 flex-shrink-0 overflow-x-auto">
              <button
                onClick={() => setActiveStudioTab('identity')}
                className={`py-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                  activeStudioTab === 'identity'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>1. Identidad & Acreditación</span>
              </button>

              <button
                onClick={() => setActiveStudioTab('theme')}
                className={`py-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                  activeStudioTab === 'theme'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <Palette className="w-4 h-4" />
                <span>2. Estilo Visual Universitario</span>
              </button>

              <button
                onClick={() => setActiveStudioTab('syllabus')}
                className={`py-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                  activeStudioTab === 'syllabus'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                <span>3. Syllabus & Competencias</span>
              </button>

              <button
                onClick={() => setActiveStudioTab('units')}
                className={`py-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                  activeStudioTab === 'units'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>4. Unidades Temáticas ({formData.units.length})</span>
              </button>

              <button
                onClick={() => setActiveStudioTab('resources')}
                className={`py-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                  activeStudioTab === 'resources'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>5. Bibliografía & Recursos ({formData.resources.length})</span>
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSaveCourse} className="flex-1 overflow-y-auto p-5 sm:p-6 bg-slate-50/50 space-y-6">
              
              {/* TAB 1: IDENTIDAD Y ACREDITACIÓN */}
              {activeStudioTab === 'identity' && (
                <div className="space-y-4 max-w-3xl mx-auto">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Nombre Oficial de la Cátedra *
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Ej. Cálculo Multivariable y Geometría Espacial"
                        className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-primary"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Código Académico *
                      </label>
                      <input
                        type="text"
                        value={formData.code}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                        placeholder="Ej. CALC-201"
                        className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-mono font-extrabold text-slate-900 outline-none focus:ring-2 focus:ring-primary"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Subtítulo o Lema Formativo de la Cátedra
                    </label>
                    <input
                      type="text"
                      value={formData.subtitle}
                      onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                      placeholder="Ej. Cátedra de Fundamentos Matemáticos y Modelado en Tres Dimensiones"
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-700 outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Facultad Responsable *
                      </label>
                      <select
                        value={formData.faculty}
                        onChange={(e) => setFormData({ ...formData, faculty: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-medium text-slate-800 outline-none focus:ring-2 focus:ring-primary"
                      >
                        {FACULTIES.map(fac => (
                          <option key={fac} value={fac}>{fac}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Departamento Académico
                      </label>
                      <input
                        type="text"
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        placeholder="Ej. Departamento de Matemáticas Aplicadas"
                        className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Créditos Académicos
                      </label>
                      <select
                        value={formData.credits}
                        onChange={(e) => setFormData({ ...formData, credits: parseInt(e.target.value) })}
                        className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value={1}>1 Crédito</option>
                        <option value={2}>2 Créditos</option>
                        <option value={3}>3 Créditos</option>
                        <option value={4}>4 Créditos</option>
                        <option value={5}>5 Créditos</option>
                        <option value={6}>6 Créditos</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Horas Semanales (IHS)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="12"
                        value={formData.weeklyHours}
                        onChange={(e) => setFormData({ ...formData, weeklyHours: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Modalidad
                      </label>
                      <select
                        value={formData.modality}
                        onChange={(e) => setFormData({ ...formData, modality: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="Presencial / Híbrida">Presencial / Híbrida</option>
                        <option value="Presencial / Laboratorio">Presencial / Laboratorio</option>
                        <option value="Seminario Taller">Seminario Taller</option>
                        <option value="Cátedra Magistral">Cátedra Magistral</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Semestre / Ciclo
                      </label>
                      <input
                        type="text"
                        value={formData.semester}
                        onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div className="border-t border-slate-200 pt-4">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                      <GraduationCap className="w-4 h-4 text-primary" />
                      <span>Atención y Tutorías del Docente Titular</span>
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Docente Asignado</label>
                        <input
                          type="text"
                          value={formData.teacherName}
                          onChange={(e) => setFormData({ ...formData, teacherName: e.target.value })}
                          className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Horario de Asesorías / Tutoría</label>
                        <input
                          type="text"
                          value={formData.teacherOfficeHours}
                          onChange={(e) => setFormData({ ...formData, teacherOfficeHours: e.target.value })}
                          placeholder="Ej. Martes y Jueves: 2:00 PM - 4:00 PM (Cubículo 302)"
                          className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: ESTILO VISUAL UNIVERSITARIO */}
              {activeStudioTab === 'theme' && (
                <div className="space-y-6 max-w-3xl mx-auto">
                  {/* Theme Selector */}
                  <div>
                    <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide mb-3 flex items-center gap-2">
                      <Palette className="w-4 h-4 text-primary" />
                      <span>Paleta Institucional de Color Universitario</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {UNIVERSITY_THEMES.map((theme) => {
                        const isSelected = formData.themeId === theme.id;
                        return (
                          <div
                            key={theme.id}
                            onClick={() => setFormData({ ...formData, themeId: theme.id })}
                            className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                              isSelected
                                ? 'border-primary bg-white shadow-md scale-[1.02]'
                                : 'border-slate-200 bg-white/70 hover:border-slate-300'
                            }`}
                          >
                            <div className="flex items-center gap-3 mb-2">
                              <div 
                                className="w-6 h-6 rounded-full border border-white/60 shadow-xs" 
                                style={{ backgroundColor: theme.primary }}
                              />
                              <div className="font-bold text-xs text-slate-900">{theme.name}</div>
                            </div>
                            <div className={`h-2 rounded-full w-full bg-gradient-to-r ${theme.bannerGradient} mb-2`}></div>
                            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${theme.badge}`}>
                              Muestra de Insignia
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Icon Selector */}
                  <div>
                    <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide mb-3 flex items-center gap-2">
                      <Compass className="w-4 h-4 text-primary" />
                      <span>Icono Representativo de la Disciplina</span>
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2.5">
                      {ICON_OPTIONS.map((opt) => {
                        const IconComponent = opt.icon;
                        const isSelected = formData.iconName === opt.name;
                        return (
                          <button
                            key={opt.name}
                            type="button"
                            onClick={() => setFormData({ ...formData, iconName: opt.name })}
                            className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
                              isSelected
                                ? 'border-primary bg-primary/10 text-primary font-bold shadow-xs scale-105'
                                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                            }`}
                            title={opt.label}
                          >
                            <IconComponent className="w-5 h-5" />
                            <span className="text-[9px] truncate max-w-full">{opt.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Live Card Preview */}
                  <div className="border-t border-slate-200 pt-5">
                    <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide mb-3 flex items-center gap-2">
                      <Eye className="w-4 h-4 text-primary" />
                      <span>Previsualización en Tiempo Real (Vista del Estudiante)</span>
                    </label>

                    <div className="max-w-md mx-auto bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden">
                      <div className={`h-2.5 w-full bg-gradient-to-r ${selectedTheme.bannerGradient}`}></div>
                      <div className="p-5">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider truncate max-w-[180px]">
                            {formData.faculty}
                          </span>
                          <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-md ${selectedTheme.badge}`}>
                            {formData.code || 'CALC-201'} • {formData.credits} CR
                          </span>
                        </div>
                        <div className="flex items-start gap-3 mb-3">
                          <div className={`w-10 h-10 rounded-xl ${selectedTheme.bgLight} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                            <SelectedIconComp className={`w-5 h-5 ${selectedTheme.textPrimary}`} />
                          </div>
                          <div>
                            <h4 className="font-display font-bold text-base text-slate-900 leading-snug">
                              {formData.title || 'Título de la Cátedra'}
                            </h4>
                            <p className="text-[11px] text-slate-500 italic">
                              {formData.subtitle || 'Lema formativo de la cátedra'}
                            </p>
                          </div>
                        </div>
                        <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl flex justify-between">
                          <span>Docente: <strong>{formData.teacherName}</strong></span>
                          <span><strong>{formData.units.length} Unidades</strong></span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: SYLLABUS & COMPETENCIAS */}
              {activeStudioTab === 'syllabus' && (
                <div className="space-y-4 max-w-3xl mx-auto">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Descripción Académica y Justificación del Curso *
                    </label>
                    <textarea
                      rows="3"
                      value={formData.syllabusDesc}
                      onChange={(e) => setFormData({ ...formData, syllabusDesc: e.target.value })}
                      placeholder="Describe la importancia formativa, el marco teórico y la relevancia del curso..."
                      className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-primary leading-relaxed"
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Objetivo General de Aprendizaje *
                    </label>
                    <textarea
                      rows="2"
                      value={formData.generalObjective}
                      onChange={(e) => setFormData({ ...formData, generalObjective: e.target.value })}
                      placeholder="Meta formativa primordial que el estudiante alcanzará al concluir la cátedra..."
                      className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-primary leading-relaxed"
                    ></textarea>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-bold text-slate-700">
                        Competencias Transversales & Específicas
                      </label>
                      <button
                        type="button"
                        onClick={handleAddCompetency}
                        className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Agregar Competencia</span>
                      </button>
                    </div>

                    <div className="space-y-2">
                      {formData.competencies.map((comp, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-600 font-bold text-[11px] flex items-center justify-center flex-shrink-0">
                            {idx + 1}
                          </span>
                          <input
                            type="text"
                            value={comp}
                            onChange={(e) => handleUpdateCompetency(idx, e.target.value)}
                            placeholder={`Competencia formativa ${idx + 1}`}
                            className="flex-1 bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 outline-none focus:ring-1 focus:ring-primary"
                          />
                          <button
                            type="button"
                            onClick={() => handleDeleteCompetency(idx)}
                            className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-slate-200 pt-3">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Metodología y Escala de Evaluación Porcentual
                    </label>
                    <textarea
                      rows="2"
                      value={formData.evaluationMethodology}
                      onChange={(e) => setFormData({ ...formData, evaluationMethodology: e.target.value })}
                      placeholder="Ej. 30% Talleres aplicados, 30% Prácticas de laboratorio, 40% Evaluaciones parciales."
                      className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-primary leading-relaxed"
                    ></textarea>
                  </div>
                </div>
              )}

              {/* TAB 4: UNIDADES TEMÁTICAS */}
              {activeStudioTab === 'units' && (
                <div className="space-y-4 max-w-3xl mx-auto">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">Ejes Temáticos & Contenidos Modulares</h4>
                      <p className="text-xs text-slate-500">Estructura las unidades, horas presenciales y lecciones de la cátedra.</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddUnit}
                      className="px-3.5 py-1.5 bg-primary text-white text-xs font-bold rounded-xl shadow-xs hover:bg-primary/90 flex items-center gap-1.5 transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Nueva Unidad</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {formData.units.map((unit, idx) => (
                      <div key={unit.id || idx} className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-3">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <div className="flex items-center gap-2 flex-1">
                            <span className="w-7 h-7 rounded-xl bg-primary/10 text-primary font-bold text-xs flex items-center justify-center flex-shrink-0">
                              {idx + 1}
                            </span>
                            <input
                              type="text"
                              value={unit.title}
                              onChange={(e) => handleUpdateUnit(idx, 'title', e.target.value)}
                              placeholder={`Título de la Unidad ${idx + 1}`}
                              className="w-full font-bold text-xs sm:text-sm text-slate-900 border-b border-transparent hover:border-slate-300 focus:border-primary outline-none px-1 py-0.5"
                            />
                          </div>

                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1 text-xs">
                              <span className="text-slate-400">Ponderación:</span>
                              <input
                                type="text"
                                value={unit.weight || '25%'}
                                onChange={(e) => handleUpdateUnit(idx, 'weight', e.target.value)}
                                className="w-14 bg-slate-50 border border-slate-200 rounded-lg text-center font-bold text-xs py-0.5"
                              />
                            </div>

                            <button
                              type="button"
                              onClick={() => handleDeleteUnit(idx)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                              title="Eliminar unidad"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div>
                          <input
                            type="text"
                            value={unit.description}
                            onChange={(e) => handleUpdateUnit(idx, 'description', e.target.value)}
                            placeholder="Descripción breve de los conceptos clave abordados..."
                            className="w-full text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none"
                          />
                        </div>

                        {/* Lessons List */}
                        <div className="bg-slate-50/50 rounded-xl p-3 border border-slate-100">
                          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                            Temas y Lecciones Comprendidas:
                          </div>
                          <div className="space-y-1">
                            {(unit.lessons || []).map((les, lIdx) => (
                              <div key={lIdx} className="text-xs text-slate-700 flex items-center gap-2">
                                <ChevronRight className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                                <span>{les}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: BIBLIOGRAFÍA & RECURSOS */}
              {activeStudioTab === 'resources' && (
                <div className="space-y-4 max-w-3xl mx-auto">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">Bibliografía Oficial & Recursos de Cátedra</h4>
                      <p className="text-xs text-slate-500">Tratados universitarios, artículos de referencia y guías para los alumnos.</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddResource}
                      className="px-3.5 py-1.5 bg-primary text-white text-xs font-bold rounded-xl shadow-xs hover:bg-primary/90 flex items-center gap-1.5 transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Nueva Referencia</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {formData.resources.map((res, idx) => (
                      <div key={idx} className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <input
                            type="text"
                            value={res.title}
                            onChange={(e) => handleUpdateResource(idx, 'title', e.target.value)}
                            placeholder="Título de la obra o artículo científico..."
                            className="flex-1 font-bold text-xs sm:text-sm text-slate-900 border-b border-transparent hover:border-slate-300 focus:border-primary outline-none px-1 py-0.5"
                          />
                          <button
                            type="button"
                            onClick={() => handleDeleteResource(idx)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                          <div>
                            <label className="block text-[10px] text-slate-400 font-bold">Autor / Editorial:</label>
                            <input
                              type="text"
                              value={res.author}
                              onChange={(e) => handleUpdateResource(idx, 'author', e.target.value)}
                              placeholder="Ej. James Stewart"
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-xs text-slate-700"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] text-slate-400 font-bold">Tipo de Recurso:</label>
                            <input
                              type="text"
                              value={res.type}
                              onChange={(e) => handleUpdateResource(idx, 'type', e.target.value)}
                              placeholder="Ej. Texto Guía Oficial"
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-xs text-slate-700"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] text-slate-400 font-bold">Código de Biblioteca:</label>
                            <input
                              type="text"
                              value={res.callNumber}
                              onChange={(e) => handleUpdateResource(idx, 'callNumber', e.target.value)}
                              placeholder="Ej. BIB-MAT-515"
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-xs text-slate-700 font-mono"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Bottom Sticky Action Bar */}
              <div className="border-t border-slate-200 pt-4 flex items-center justify-between">
                <div className="text-xs text-slate-500 hidden sm:block">
                  Los cambios se guardan y sincronizan automáticamente en el campus institucional.
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingCourse(null)}
                    className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-xs transition-colors"
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-primary text-white font-bold text-xs shadow-md hover:bg-primary/90 flex items-center gap-2 transition-all hover:scale-[1.02]"
                  >
                    <Save className="w-4 h-4" />
                    <span>Guardar y Publicar Cátedra</span>
                  </button>
                </div>
              </div>

            </form>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
}
