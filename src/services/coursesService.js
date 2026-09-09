// Servicio centralizado de Cátedras y Módulos Universitarios
// Persistencia en localStorage para que los cambios del docente se sincronicen en tiempo real

const STORAGE_KEY = 'educol_university_courses';

export const UNIVERSITY_THEMES = [
  {
    id: 'blue',
    name: 'Azul Oxford Institucional',
    primary: '#1e40af',
    accent: '#3b82f6',
    bgLight: 'bg-blue-50',
    textPrimary: 'text-blue-900',
    borderLight: 'border-blue-200',
    badge: 'bg-blue-100 text-blue-900 border-blue-200',
    bannerGradient: 'from-slate-900 via-blue-950 to-slate-900'
  },
  {
    id: 'emerald',
    name: 'Esmeralda Académico',
    primary: '#047857',
    accent: '#10b981',
    bgLight: 'bg-emerald-50',
    textPrimary: 'text-emerald-900',
    borderLight: 'border-emerald-200',
    badge: 'bg-emerald-100 text-emerald-900 border-emerald-200',
    bannerGradient: 'from-slate-900 via-emerald-950 to-slate-900'
  },
  {
    id: 'burgundy',
    name: 'Borgoña Humanidades',
    primary: '#9f1239',
    accent: '#f43f5e',
    bgLight: 'bg-rose-50',
    textPrimary: 'text-rose-900',
    borderLight: 'border-rose-200',
    badge: 'bg-rose-100 text-rose-900 border-rose-200',
    bannerGradient: 'from-slate-900 via-rose-950 to-slate-900'
  },
  {
    id: 'purple',
    name: 'Púrpura Ciencias Avanzadas',
    primary: '#6b21a8',
    accent: '#a855f7',
    bgLight: 'bg-purple-50',
    textPrimary: 'text-purple-900',
    borderLight: 'border-purple-200',
    badge: 'bg-purple-100 text-purple-900 border-purple-200',
    bannerGradient: 'from-slate-900 via-purple-950 to-slate-900'
  },
  {
    id: 'amber',
    name: 'Ámbar & Terracota',
    primary: '#b45309',
    accent: '#f59e0b',
    bgLight: 'bg-amber-50',
    textPrimary: 'text-amber-900',
    borderLight: 'border-amber-200',
    badge: 'bg-amber-100 text-amber-900 border-amber-200',
    bannerGradient: 'from-slate-900 via-amber-950 to-slate-900'
  }
];

export const INITIAL_UNIVERSITY_COURSES = [
  {
    id: 'course-mat-101',
    code: 'CALC-201',
    title: 'Cálculo Multivariable y Geometría Espacial',
    subtitle: 'Cátedra de Fundamentos Matemáticos y Modelado en Tres Dimensiones',
    faculty: 'Facultad de Ciencias Básicas e Ingeniería',
    department: 'Departamento de Matemáticas Aplicadas',
    credits: 4,
    level: '10° Bachillerato / Nivel Universitario Inicial',
    semester: 'Periodo Académico 2026 - Ciclo II',
    modality: 'Presencial / Híbrida',
    prerequisites: 'Álgebra Lineal I y Geometría Euclídea',
    weeklyHours: 5,
    progress: 65,
    published: true,
    themeId: 'blue',
    iconName: 'Compass',
    teacher: {
      name: 'Ing. Alejandro Torres, M.Sc.',
      title: 'Profesor Titular de Cátedra',
      email: 'alejandro.torres@educol.edu.co',
      officeHours: 'Martes y Jueves: 2:00 PM - 4:00 PM (Cubículo 302)',
      department: 'Matemáticas y Modelado Físico'
    },
    syllabus: {
      description: 'El curso proporciona una formación analítica profunda en el cálculo multivariable, vectores en R³, planos tangentes, gradientes y optimización tridimensional, orientada a la resolución de problemas científicos y de ingeniería.',
      generalObjective: 'Desarrollar en el estudiante la capacidad de conceptualizar, modelar y resolver problemas espaciales en tres dimensiones mediante el rigor analítico del cálculo y la geometría vectorial.',
      competencies: [
        'Modelar fenómenos tridimensionales mediante vectores, matrices y productos escalares/vectoriales.',
        'Calcular magnitudes, proyecciones ortogonales y ángulos entre vectores en el espacio euclídeo R³.',
        'Analizar superficies cuádricas y campos vectoriales con rigor formal.'
      ],
      evaluationMethodology: 'Evaluación continua: 30% Talleres y problemas aplicados, 30% Prácticas interactivas y proyectos, 40% Evaluaciones parciales de cátedra.'
    },
    units: [
      {
        id: 'u1',
        title: 'Unidad 1: Espacios Vectoriales y Álgebra en R³',
        description: 'Vectores cartesianos, producto punto, producto cruz, proyecciones y norma euclidiana.',
        hours: 18,
        weight: '25%',
        status: 'Aprobado (5.0)',
        lessons: [
          'Definición axiomática de espacios vectoriales en R³',
          'Magnitud y cosenos directores',
          'Producto escalar y aplicaciones físicas de trabajo mecánico',
          'Producto vectorial y cálculo de torque en el espacio'
        ]
      },
      {
        id: 'u2',
        title: 'Unidad 2: Ecuaciones de la Recta y el Plano en el Espacio',
        description: 'Geometría analítica tridimensional, intersección de planos y distancias mínimas.',
        hours: 20,
        weight: '35%',
        status: 'Aprobado (4.8)',
        lessons: [
          'Ecuación vectorial, paramétrica y simétrica de la recta',
          'Ecuación general del plano en R³',
          'Ángulos diedros y planos ortogonales',
          'Resolución de sistemas de ecuaciones geométricas'
        ]
      },
      {
        id: 'u3',
        title: 'Unidad 3: Funciones Multivariables y Optimización (En Curso)',
        description: 'Derivadas parciales, vectores gradiente, planos tangentes y multiplicadores de Lagrange.',
        hours: 22,
        weight: '40%',
        status: 'Avance 75%',
        lessons: [
          'Definición de campos escalares y funciones f(x,y,z)',
          'El operador Nabla y el gradiente direccional',
          'Optimización con restricciones en modelos prácticos'
        ]
      }
    ],
    resources: [
      {
        title: 'Stewart, James. Cálculo de Varias Variables: Trascendentes Tempranas (8va Ed.)',
        type: 'Texto Guía Oficial (Cengage Learning)',
        author: 'James Stewart',
        callNumber: 'BIB-MAT-515.1'
      },
      {
        title: 'Guía de Práctica de Cátedra: Proyecciones Vectoriales en R³',
        type: 'Guía Metodológica de Cátedra (PDF Institucional)',
        author: 'Departamento de Matemáticas Aplicadas',
        callNumber: 'DOC-EDCOL-2026-M1'
      },
      {
        title: 'Formulario Oficial de Identidades Vectoriales y Teoremas de Espacio',
        type: 'Material de Referencia Rápida',
        author: 'Facultad de Ciencias Básicas',
        callNumber: 'REF-MAT-002'
      }
    ],
    interactiveType: 'math'
  },
  {
    id: 'course-bio-202',
    code: 'BIOL-305',
    title: 'Biología Celular y Botánica de Ecosistemas Andinos',
    subtitle: 'Cátedra de Citología, Fisiología Vegetal y Adaptaciones en Alta Montaña',
    faculty: 'Facultad de Ciencias Naturales y Ambientales',
    department: 'Departamento de Biología y Biotecnología',
    credits: 4,
    level: '10° Bachillerato / Nivel Universitario Inicial',
    semester: 'Periodo Académico 2026 - Ciclo II',
    modality: 'Presencial / Laboratorio',
    prerequisites: 'Biología General y Química Orgánica Básica',
    weeklyHours: 4,
    progress: 80,
    published: true,
    themeId: 'emerald',
    iconName: 'Leaf',
    teacher: {
      name: 'Dra. Valentina Ríos, Ph.D.',
      title: 'Profesora Titular & Directora de Semillero',
      email: 'valentina.rios@educol.edu.co',
      officeHours: 'Lunes y Miércoles: 10:00 AM - 12:00 PM (Laboratorio 104)',
      department: 'Fisiología Celular y Biodiversidad'
    },
    syllabus: {
      description: 'Estudio de la morfología y ultraestructura de las células eucariotas vegetales, con énfasis en las adaptaciones morfo-fisiológicas de la flora endémica de los páramos andinos (Chingaza, Sumapaz) frente al estrés lumínico y térmico.',
      generalObjective: 'Comprender los mecanismos celulares que permiten la supervivencia de la vegetación de páramo frente a heladas nocturnas e irradiación solar intensa.',
      competencies: [
        'Identificar los organelos celulares vegetales y su función biofísica.',
        'Explicar el papel de los flavonoides y cutículas gruesas en la protección UV.',
        'Analizar datos ecofisiológicos mediante informes de rigor académico.'
      ],
      evaluationMethodology: '35% Informes de laboratorio citológico, 25% Seminarios de discusión científica, 40% Examen integral de competencias.'
    },
    units: [
      {
        id: 'u1',
        title: 'Unidad 1: Citología Vegetal y Organelos Especializados',
        description: 'Cloroplastos, tilacoides, vacuolas centrales y pared celular celulósica.',
        hours: 16,
        weight: '30%',
        status: 'Aprobado (5.0)',
        lessons: [
          'Ultraestructura del cloroplasto y pigmentos fotosintéticos',
          'La vacuola central y el potencial hídrico en células vegetales',
          'Biogénesis de pared celular y plasmodesmos'
        ]
      },
      {
        id: 'u2',
        title: 'Unidad 2: Adaptaciones Morfológicas en Especies de Páramo',
        description: 'Estudio del Frailejón (Espeletia) y retención hídrica en altitudes mayores a 3.000 m.s.n.m.',
        hours: 18,
        weight: '35%',
        status: 'Aprobado (4.9)',
        lessons: [
          'Tricomas foliares y reflexión de la radiación ultravioleta',
          'Mecanismos osmóticos contra el congelamiento nocturno',
          'El páramo como regulador hidrográfico del territorio colombiano'
        ]
      },
      {
        id: 'u3',
        title: 'Unidad 3: Proyecto de Investigación y Conservación (En Curso)',
        description: 'Formulación de protocolos de propagación in-vitro y preservación del ecosistema.',
        hours: 20,
        weight: '35%',
        status: 'Avance 85%',
        lessons: [
          'Metodología científica aplicada a la botánica andina',
          'Muestreo ecológico no destructivo',
          'Presentación de póster científico de cátedra'
        ]
      }
    ],
    resources: [
      {
        title: 'Alberts, Bruce et al. Biología Molecular de la Célula (6ta Edición)',
        type: 'Tratado Universitario de Referencia (Omega)',
        author: 'Bruce Alberts & cols.',
        callNumber: 'BIB-BIO-571.6'
      },
      {
        title: 'Monografía: Diversidad y Ecofisiología del Género Espeletia en Colombia',
        type: 'Artículo Científico y Monografía Botánica',
        author: 'Instituto de Investigación Alexander von Humboldt',
        callNumber: 'ART-COL-BIO-089'
      },
      {
        title: 'Protocolo de Seguridad y Normas Técnicas para el Laboratorio de Microscopía',
        type: 'Manual Institucional de Laboratorio',
        author: 'Comité de Bioseguridad EduCol',
        callNumber: 'MAN-BIO-2026'
      }
    ],
    interactiveType: 'bio'
  },
  {
    id: 'course-lit-303',
    code: 'LITE-402',
    title: 'Literatura Latinoamericana y Hermenéutica Crítica',
    subtitle: 'Cátedra de Narrativa Contemporánea, Realismo Mágico e Identidad Histórica',
    faculty: 'Facultad de Humanidades, Filosofía y Letras',
    department: 'Departamento de Literatura y Lenguas Clásicas',
    credits: 3,
    level: '10° Bachillerato / Nivel Universitario Inicial',
    semester: 'Periodo Académico 2026 - Ciclo II',
    modality: 'Presencial / Seminario Taller',
    prerequisites: 'Comprensión de Lectura y Retórica Discursiva',
    weeklyHours: 3,
    progress: 40,
    published: true,
    themeId: 'burgundy',
    iconName: 'BookOpen',
    teacher: {
      name: 'Prof. Gabriel Mendoza, M.A.',
      title: 'Profesor de Cátedra & Crítico Literario',
      email: 'gabriel.mendoza@educol.edu.co',
      officeHours: 'Viernes: 3:00 PM - 5:30 PM (Sala de Seminarios Humanidades)',
      department: 'Estudios Literarios y Semiótica'
    },
    syllabus: {
      description: 'Análisis textual, sociológico e histórico de la narrativa hispanoamericana del siglo XX, con foco primordial en la obra cumbre de Gabriel García Márquez y la fundación mitopoética de Macondo.',
      generalObjective: 'Desarrollar competencias de lectura crítica, análisis de figuras retóricas y comprensión del contexto sociopolítico plasmado en el Boom latinoamericano.',
      competencies: [
        'Estructurar ensayos académicos con argumentación sólida y citación en normas APA.',
        'Identificar las técnicas de polifonía, tiempo cíclico y desfamiliarización en la novela.',
        'Vincular la producción estética con los procesos sociohistóricos de Colombia y la región.'
      ],
      evaluationMethodology: '40% Ensayos de análisis crítico textual, 30% Foros y seminarios de discusión en clase, 30% Exposición final de cátedra.'
    },
    units: [
      {
        id: 'u1',
        title: 'Unidad 1: Fundación y Mito: El Espacio Simbólico de Macondo',
        description: 'La travesía de los fundadores, el laboratorio de Melquíades y el choque con la modernidad.',
        hours: 14,
        weight: '30%',
        status: 'Aprobado (4.7)',
        lessons: [
          'La geografía mítica y la fundación de la aldea Buendía',
          'Los gitanos, el hielo y la alquimia como entrada del conocimiento',
          'La memoria y la peste del insomnio como metáfora del olvido'
        ]
      },
      {
        id: 'u2',
        title: 'Unidad 2: El Tiempo Cíclico y las Guerras Civiles',
        description: 'El Coronel Aureliano Buendía, los 32 pescaditos de oro y la soledad del poder.',
        hours: 16,
        weight: '35%',
        status: 'En Curso',
        lessons: [
          'La repetición generacional y los nombres arquetípicos',
          'La violencia bipartidista y la pérdida de ideales',
          'El taller de orfebrería y la noción circular del tiempo'
        ]
      },
      {
        id: 'u3',
        title: 'Unidad 3: La Fiebre del Banano y el Apocalipsis Textual (Pendiente)',
        description: 'La compañía bananera, la masacre de las bananeras y el desciframiento de los pergaminos.',
        hours: 18,
        weight: '35%',
        status: 'Pendiente',
        lessons: [
          'El imperialismo económico y la reescritura de la historia oficial',
          'El diluvio y la decadencia de la estirpe',
          'Metaliteratura: la lectura final de Aureliano Babilonia'
        ]
      }
    ],
    resources: [
      {
        title: 'García Márquez, Gabriel. Cien años de soledad (Edición conmemorativa RAE)',
        type: 'Obra Literaria de Estudio Obligatorio',
        author: 'Gabriel García Márquez',
        callNumber: 'BIB-LIT-863.64'
      },
      {
        title: 'Rama, Ángel. La ciudad letrada y la narrativa del Boom',
        type: 'Ensayo Crítico Fundamental',
        author: 'Ángel Rama',
        callNumber: 'ENS-LIT-RAM-1984'
      },
      {
        title: 'Rúbrica Institucional para la Redacción de Ensayos Académicos (Normas APA 7ma)',
        type: 'Guía de Estilo y Criterios Evaluativos',
        author: 'Comité de Humanidades EduCol',
        callNumber: 'RUB-APA-2026'
      }
    ],
    interactiveType: 'literature'
  }
];

// Obtener todas las cátedras (desde almacenamiento local con respaldo en datos iniciales)
export function getUniversityCourses() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_UNIVERSITY_COURSES));
      return INITIAL_UNIVERSITY_COURSES;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_UNIVERSITY_COURSES));
      return INITIAL_UNIVERSITY_COURSES;
    }
    return parsed;
  } catch (e) {
    console.error('[coursesService] Error loading university courses:', e);
    return INITIAL_UNIVERSITY_COURSES;
  }
}

// Guardar o actualizar una cátedra
export function saveUniversityCourse(courseData) {
  const currentCourses = getUniversityCourses();
  let updatedCourses = [];
  
  if (courseData.id) {
    const exists = currentCourses.some(c => c.id === courseData.id);
    if (exists) {
      updatedCourses = currentCourses.map(c => c.id === courseData.id ? { ...c, ...courseData } : c);
    } else {
      updatedCourses = [courseData, ...currentCourses];
    }
  } else {
    const newCourse = {
      ...courseData,
      id: `course-${Date.now()}`,
      progress: courseData.progress || 0,
      published: true
    };
    updatedCourses = [newCourse, ...currentCourses];
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCourses));
  
  // Emit custom event for same-window reactive updates
  window.dispatchEvent(new CustomEvent('educol_courses_updated', { detail: updatedCourses }));
  return updatedCourses;
}

// Eliminar una cátedra
export function deleteUniversityCourse(courseId) {
  const currentCourses = getUniversityCourses();
  const filtered = currentCourses.filter(c => c.id !== courseId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  window.dispatchEvent(new CustomEvent('educol_courses_updated', { detail: filtered }));
  return filtered;
}

// Reiniciar a valores predeterminados
export function resetUniversityCourses() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_UNIVERSITY_COURSES));
  window.dispatchEvent(new CustomEvent('educol_courses_updated', { detail: INITIAL_UNIVERSITY_COURSES }));
  return INITIAL_UNIVERSITY_COURSES;
}
