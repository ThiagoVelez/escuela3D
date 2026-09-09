export const MOCK_USER = {
  id: 1,
  nombre: "Mateo Gómez",
  email: "estudiante@educol.edu.co",
  rol: "Estudiante",
  grado: "10° Bachillerato",
  institucion: "Colombian Future",
  logoInstitucion: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
  puntosExperiencia: 450,
  nivel3D: "Explorador Avanzado"
};

export const MOCK_SUBJECTS = [
  {
    id: "math",
    code: "MAT-101",
    title: "Matemáticas 3D",
    category: "Unidad 4",
    progress: 65,
    icon: "calculate",
    color: "#715c00",
    bgAccent: "bg-primary/20",
    description: "Geometría espacial, vectores 3D y trigonometría interactiva.",
    teacher: "Ing. Alejandro Torres",
    unitsCount: 5,
    activeLab: null
  },
  {
    id: "bio",
    code: "BIO-202",
    title: "Biología 3D",
    category: "Flora Andina",
    progress: 80,
    icon: "science",
    color: "#335ab4",
    bgAccent: "bg-secondary/20",
    description: "Explora la estructura celular de la flora endémica de los páramos colombianos en 3D.",
    teacher: "Dra. Valentina Ríos",
    badge1: "Nuevo Lab",
    badge2: "Entrega Mañana",
    hasLabButton: true,
    activeLab: {
      id: "lab-flora-1",
      title: "Laboratorio 3D: Célula de Frailejón Andino",
      description: "Inspecciona los cloroplastos y vacuolas adaptados a la alta montaña.",
      type: "BIOLOGIA"
    }
  },
  {
    id: "lit",
    code: "LIT-303",
    title: "Literatura Colombiana",
    category: "Macondo 3D",
    progress: 40,
    icon: "menu_book",
    color: "#c0001f",
    bgAccent: "bg-tertiary/10",
    description: "Análisis de 'Cien años de soledad' con reconstrucciones virtuales 3D.",
    teacher: "Prof. Gabriel Mendoza",
    unitsCount: 4,
    activeLab: null
  }
];

export const MOCK_GRADES = [
  { id: 1, subject: "Matemáticas 3D", concept: "Taller Vectores 3D", grade: 4.5, weight: "20%", date: "2026-07-20" },
  { id: 2, subject: "Matemáticas 3D", concept: "Evaluación Parcial 1", grade: 4.8, weight: "30%", date: "2026-07-25" },
  { id: 3, subject: "Biología 3D", concept: "Informe Lab Célula Vegetal", grade: 5.0, weight: "25%", date: "2026-07-27" },
  { id: 4, subject: "Literatura Colombiana", concept: "Control de Lectura Cap. 1-3", grade: 4.2, weight: "15%", date: "2026-07-15" }
];

export const MOCK_NOTIFICATIONS = [
  { id: 1, title: "¡Nuevo Laboratorio Disponible!", text: "Se ha abierto el Lab 3D de Biología: Flora Andina.", time: "Hace 10 min", read: false },
  { id: 2, title: "Nota Registrada", text: "Tu docente asignó 5.0 en Informe Lab Célula Vegetal.", time: "Hace 2 horas", read: true }
];
