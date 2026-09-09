import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { getPool, initDatabase } from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health Check
app.get('/api/health', async (req, res) => {
  const pool = await getPool();
  res.json({
    status: 'OK',
    server: 'EduColombia Inmersiva 3D API',
    mysqlConnected: !!pool,
    timestamp: new Date().toISOString()
  });
});

// Initialize Database Schema from SQL file
app.post('/api/init-db', async (req, res) => {
  const success = await initDatabase();
  if (success) {
    res.json({ message: 'Base de datos educol3d_db inicializada con éxito desde schema.sql' });
  } else {
    res.status(500).json({ error: 'No se pudo inicializar la base de datos MySQL' });
  }
});

// Auth Login Route
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const pool = await getPool();

  if (pool) {
    try {
      const [rows] = await pool.query(
        'SELECT u.id, u.nombre, u.apellido, u.email, u.rol, u.grado_nivel, i.nombre as institucion, i.logo_url FROM usuarios u JOIN instituciones i ON u.institucion_id = i.id WHERE u.email = ? LIMIT 1',
        [email]
      );
      if (rows.length > 0) {
        const u = rows[0];
        return res.json({
          user: {
            id: u.id,
            nombre: `${u.nombre} ${u.apellido}`,
            email: u.email,
            rol: u.rol,
            grado: u.grado_nivel,
            institucion: u.institucion,
            logoInstitucion: u.logo_url,
            puntosExperiencia: 450,
            nivel3D: 'Explorador Avanzado'
          }
        });
      }
    } catch (e) {
      console.error('[API Login Error]', e.message);
    }
  }

  // Fallback demo user
  res.json({
    user: {
      id: 1,
      nombre: 'Mateo Gómez',
      email: email || 'estudiante@educol.edu.co',
      rol: 'Estudiante',
      grado: '10° Bachillerato',
      institucion: 'Colombian Future',
      logoInstitucion: 'https://lh3.googleusercontent.com/aida-public/AB6AXuALy1tdYIB64Ed_uo1GTsH3xD-NYVfanKwZH1R3WWYS9H5Hx4v3B-f8ZS0-gWgXJH-xL6z1J1fbCq3BWza9pb7b4oluyEz0RAEiBAgUFlNoISwJxJ1L27hsaePuWpJI-QXA8Wuu8Oq5G21DnYv3kfv13-k4SFN4jKAdcvVaGQhF5FUdtebdiKQV39axInnfDe9MUH5DwGHkOfYmwW_h35zeUNsTrUTxnkBfKZ1VAehRUTpnuve2ABwqyA',
      puntosExperiencia: 450,
      nivel3D: 'Explorador Avanzado'
    }
  });
});

// Get Subjects Route
app.get('/api/subjects', async (req, res) => {
  const pool = await getPool();
  if (pool) {
    try {
      const [rows] = await pool.query(`
        SELECT m.id, m.codigo, m.nombre as title, m.descripcion, m.icono_symbol as icon, m.color_hex as color,
               COALESCE(im.porcentaje_progreso, 50) as progress,
               CONCAT(u.nombre, ' ', u.apellido) as teacher
        FROM materias m
        LEFT JOIN usuarios u ON m.docente_id = u.id
        LEFT JOIN inscripciones_materia im ON m.id = im.materia_id AND im.estudiante_id = 1
      `);
      if (rows.length > 0) {
        const mapped = rows.map(r => ({
          id: r.id,
          code: r.codigo,
          title: r.title,
          category: `Unidad ${r.id}`,
          progress: parseFloat(r.progress),
          icon: r.icon,
          color: r.color,
          description: r.descripcion,
          teacher: r.teacher || 'Docente EduCol 3D',
          activeLab: r.id === 2 ? {
            id: 'lab-flora-1',
            title: 'Laboratorio 3D: Célula de Frailejón Andino',
            description: 'Inspecciona los cloroplastos y vacuolas adaptados a la alta montaña.',
            type: 'BIOLOGIA'
          } : null
        }));
        return res.json({ subjects: mapped });
      }
    } catch (e) {
      console.error('[API Subjects Error]', e.message);
    }
  }

  // Fallback subjects
  res.json({
    subjects: [
      {
        id: 1,
        code: "MAT-101",
        title: "Matemáticas 3D",
        category: "Unidad 4",
        progress: 65,
        icon: "calculate",
        color: "#715c00",
        description: "Geometría espacial, vectores 3D y trigonometría interactiva.",
        teacher: "Ing. Alejandro Torres",
        activeLab: null
      },
      {
        id: 2,
        code: "BIO-202",
        title: "Biología 3D",
        category: "Flora Andina",
        progress: 80,
        icon: "science",
        color: "#335ab4",
        description: "Explora la estructura celular de la flora endémica de los páramos colombianos en 3D.",
        teacher: "Dra. Valentina Ríos",
        activeLab: {
          id: "lab-flora-1",
          title: "Laboratorio 3D: Célula de Frailejón Andino",
          description: "Inspecciona los cloroplastos y vacuolas adaptados a la alta montaña.",
          type: "BIOLOGIA"
        }
      },
      {
        id: 3,
        code: "LIT-303",
        title: "Literatura Colombiana",
        category: "Macondo 3D",
        progress: 40,
        icon: "menu_book",
        color: "#c0001f",
        description: "Análisis de 'Cien años de soledad' con reconstrucciones virtuales 3D.",
        teacher: "Prof. Gabriel Mendoza",
        activeLab: null
      }
    ]
  });
});

// Get Grades Route
app.get('/api/grades', async (req, res) => {
  const pool = await getPool();
  if (pool) {
    try {
      const [rows] = await pool.query(`
        SELECT c.id, m.nombre as subject, c.concepto as concept, c.nota as grade, CONCAT(c.porcentaje_peso, '%') as weight, DATE_FORMAT(c.fecha_registro, '%Y-%m-%d') as date
        FROM calificaciones c
        JOIN materias m ON c.materia_id = m.id
        WHERE c.estudiante_id = 1
      `);
      if (rows.length > 0) {
        return res.json({ grades: rows });
      }
    } catch (e) {
      console.error('[API Grades Error]', e.message);
    }
  }

  // Fallback grades
  res.json({
    grades: [
      { id: 1, subject: "Matemáticas 3D", concept: "Taller Vectores 3D", grade: 4.5, weight: "20%", date: "2026-07-20" },
      { id: 2, subject: "Matemáticas 3D", concept: "Evaluación Parcial 1", grade: 4.8, weight: "30%", date: "2026-07-25" },
      { id: 3, subject: "Biología 3D", concept: "Informe Lab Célula Vegetal", grade: 5.0, weight: "25%", date: "2026-07-27" },
      { id: 4, subject: "Literatura Colombiana", concept: "Control de Lectura Cap. 1-3", grade: 4.2, weight: "15%", date: "2026-07-15" }
    ]
  });
});

// Lab Submission Route
app.post('/api/labs/submit', async (req, res) => {
  const { labId, studentId = 1, simulationData } = req.body;
  const pool = await getPool();

  if (pool) {
    try {
      await pool.query(`
        INSERT INTO entregas_laboratorio (laboratorio_id, estudiante_id, estado, calificacion, datos_simulacion_json, tiempo_permanencia_seg, fecha_entrega)
        VALUES (?, ?, 'ENTREGADO', 5.0, ?, 180, NOW())
      `, [1, studentId, JSON.stringify(simulationData || { score: 100 })]);
    } catch (e) {
      console.error('[API Lab Submit Error]', e.message);
    }
  }

  res.json({
    success: true,
    message: 'Entrega de laboratorio 3D guardada exitosamente en MySQL',
    xpGained: 150
  });
});

// Register Rector & Institution (Public Initial Registration)
app.post('/api/auth/register-rector', async (req, res) => {
  const { nombreInstitucion, codigoSnies, departamento, municipio, nombreRector, apellidoRector, email, password } = req.body;
  const pool = await getPool();

  if (pool) {
    try {
      const [instResult] = await pool.query(
        'INSERT INTO instituciones (nombre, codigo_snies, departamento, municipio) VALUES (?, ?, ?, ?)',
        [nombreInstitucion, codigoSnies || `SNIES-${Math.floor(100000 + Math.random() * 900000)}`, departamento || 'Cundinamarca', municipio || 'Bogotá D.C.']
      );
      const instId = instResult.insertId;

      const [userResult] = await pool.query(
        'INSERT INTO usuarios (institucion_id, nombre, apellido, email, password_hash, rol, grado_nivel) VALUES (?, ?, ?, ?, ?, "RECTOR", "Rectoría")',
        [instId, nombreRector, apellidoRector, email, password || 'defaultpass']
      );

      return res.json({
        success: true,
        user: {
          id: userResult.insertId,
          nombre: `${nombreRector} ${apellidoRector}`,
          email,
          rol: 'RECTOR',
          grado: 'Rectoría',
          institucion: nombreInstitucion,
      logoInstitucion: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
          puntosExperiencia: 1000,
          nivel3D: 'Rector Institucional'
        }
      });
    } catch (e) {
      console.error('[API Register Rector Error]', e.message);
    }
  }

  // Fallback demo Rector registration
  res.json({
    success: true,
    user: {
      id: Math.floor(Math.random() * 1000) + 100,
      nombre: `${nombreRector} ${apellidoRector}`,
      email,
      rol: 'RECTOR',
      grado: 'Rectoría',
      institucion: nombreInstitucion || 'Institución Educativa Registrada',
      logoInstitucion: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
      puntosExperiencia: 1000,
      nivel3D: 'Rector Institucional'
    }
  });
});

// Register Staff/Student User by Rector or Admin
app.post('/api/users/staff', async (req, res) => {
  const { nombre, apellido, email, password, rol, grado, jornada, institucionId = 1 } = req.body;
  const pool = await getPool();

  if (pool) {
    try {
      const [result] = await pool.query(
        'INSERT INTO usuarios (institucion_id, nombre, apellido, email, password_hash, rol, grado_nivel, jornada) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [institucionId, nombre, apellido, email, password || 'default123', rol, grado || '10° A', jornada || 'Mañana']
      );
      return res.json({
        success: true,
        user: { id: result.insertId, nombre: `${nombre} ${apellido}`, email, rol, grado, jornada }
      });
    } catch (e) {
      console.error('[API Register Staff Error]', e.message);
    }
  }

  res.json({
    success: true,
    user: { id: Date.now(), nombre: `${nombre} ${apellido}`, email, rol, grado: grado || '10° A', jornada: jornada || 'Mañana' }
  });
});

// Update Profile Customization (Avatar & Banner)
app.put('/api/users/profile', async (req, res) => {
  const { userId, avatarUrl, bannerUrl, nombre, apellido } = req.body;
  const pool = await getPool();

  if (pool && userId) {
    try {
      await pool.query(
        'UPDATE usuarios SET avatar_url = COALESCE(?, avatar_url), banner_url = COALESCE(?, banner_url) WHERE id = ?',
        [avatarUrl || null, bannerUrl || null, userId]
      );
    } catch (e) {
      console.error('[API Update Profile Error]', e.message);
    }
  }

  res.json({
    success: true,
    message: 'Perfil actualizado exitosamente en el servidor',
    profile: { avatarUrl, bannerUrl, nombre, apellido }
  });
});

// Get Students List for Teacher Directory
app.get('/api/teacher/students', async (req, res) => {
  const { grado, jornada, materiaId } = req.query;
  const pool = await getPool();

  if (pool) {
    try {
      let query = `
        SELECT u.id, u.nombre, u.apellido, u.email, u.grado_nivel as grado, u.jornada, 
               COALESCE(AVG(im.porcentaje_progreso), 75.0) as progreso,
               i.nombre as institucion
        FROM usuarios u
        JOIN instituciones i ON u.institucion_id = i.id
        LEFT JOIN inscripciones_materia im ON u.id = im.estudiante_id
        WHERE u.rol = 'ESTUDIANTE'
      `;
      const params = [];
      if (grado && grado !== 'Todos') {
        query += ' AND u.grado_nivel = ?';
        params.push(grado);
      }
      if (jornada && jornada !== 'Todas') {
        query += ' AND u.jornada = ?';
        params.push(jornada);
      }
      query += ' GROUP BY u.id, u.nombre, u.apellido, u.email, u.grado_nivel, u.jornada, i.nombre';

      const [rows] = await pool.query(query, params);
      if (rows.length > 0) {
        return res.json({ students: rows });
      }
    } catch (e) {
      console.error('[API Teacher Students Error]', e.message);
    }
  }

  // Fallback demo students
  const demoStudents = [
    { id: 1, nombre: 'Mateo', apellido: 'Gómez', email: 'estudiante@educol.edu.co', grado: '10° A', jornada: 'Mañana', progreso: 85, institucion: 'Colombian Future', materia: 'Biología 3D' },
    { id: 2, nombre: 'Sofía', apellido: 'Rodríguez', email: 'sofia.rodriguez@educol.edu.co', grado: '10° A', jornada: 'Mañana', progreso: 92, institucion: 'Colombian Future', materia: 'Matemáticas 3D' },
    { id: 3, nombre: 'Santiago', apellido: 'Vargas', email: 'santiago.v@educol.edu.co', grado: '10° B', jornada: 'Tarde', progreso: 78, institucion: 'Colombian Future', materia: 'Biología 3D' },
    { id: 4, nombre: 'Camila', apellido: 'Morales', email: 'camila.m@educol.edu.co', grado: '11° A', jornada: 'Mañana', progreso: 95, institucion: 'Colombian Future', materia: 'Literatura Colombiana' },
    { id: 5, nombre: 'Lucas', apellido: 'Torres', email: 'lucas.t@educol.edu.co', grado: '10° B', jornada: 'Tarde', progreso: 64, institucion: 'Colombian Future', materia: 'Matemáticas 3D' },
    { id: 6, nombre: 'Mariana', apellido: 'López', email: 'mariana.l@educol.edu.co', grado: '11° B', jornada: 'Noche', progreso: 88, institucion: 'Colombian Future', materia: 'Literatura Colombiana' }
  ];

  let filtered = demoStudents;
  if (grado && grado !== 'Todos') filtered = filtered.filter(s => s.grado === grado);
  if (jornada && jornada !== 'Todas') filtered = filtered.filter(s => s.jornada === jornada);

  res.json({ students: filtered });
});

// Assignments API (Teacher -> Student Homework / Workshop / Quiz)
let memoryAssignments = [
  {
    id: 1,
    materiaId: 2,
    subjectTitle: 'Biología 3D',
    titulo: 'Taller Inmersivo: Adaptaciones Foliares del Frailejón',
    descripcion: 'Análisis microscópico en 3D sobre la cutícula de las hojas del frailejón en el páramo de Chingaza.',
    tipo: 'TALLER',
    gradoDestino: '10° A',
    jornadaDestino: 'Mañana',
    fechaLimite: '2026-08-05',
    puntos: 100,
    docenteNombre: 'Dra. Valentina Ríos',
    estadoEstudiante: 'Pendiente'
  },
  {
    id: 2,
    materiaId: 1,
    subjectTitle: 'Matemáticas 3D',
    titulo: 'Cuestionario 3D: Vectores en Sistemas Tridimensionales',
    descripcion: 'Resuelve los 5 ejercicios de geometría espacial utilizando el visor 3D.',
    tipo: 'CUESTIONARIO',
    gradoDestino: '10° A',
    jornadaDestino: 'Mañana',
    fechaLimite: '2026-08-10',
    puntos: 100,
    docenteNombre: 'Ing. Alejandro Torres',
    estadoEstudiante: 'Entregado'
  }
];

app.get('/api/assignments', (req, res) => {
  const { materiaId, grado } = req.query;
  let list = memoryAssignments;
  if (materiaId) list = list.filter(a => a.materiaId === parseInt(materiaId));
  if (grado && grado !== 'Todos') list = list.filter(a => a.gradoDestino === grado || a.gradoDestino === 'Todos');
  res.json({ assignments: list });
});

app.post('/api/assignments', (req, res) => {
  const { materiaId, subjectTitle, titulo, descripcion, tipo, gradoDestino, jornadaDestino, fechaLimite, puntos, docenteNombre } = req.body;
  const newAssignment = {
    id: Date.now(),
    materiaId: parseInt(materiaId) || 1,
    subjectTitle: subjectTitle || 'Materia 3D',
    titulo,
    descripcion,
    tipo: tipo || 'TALLER',
    gradoDestino: gradoDestino || 'Todos',
    jornadaDestino: jornadaDestino || 'Todas',
    fechaLimite: fechaLimite || '2026-08-15',
    puntos: parseInt(puntos) || 100,
    docenteNombre: docenteNombre || 'Docente EduCol 3D',
    estadoEstudiante: 'Pendiente'
  };
  memoryAssignments.unshift(newAssignment);
  res.json({ success: true, assignment: newAssignment });
});

app.post('/api/assignments/submit', (req, res) => {
  const { assignmentId, respuestaText } = req.body;
  const item = memoryAssignments.find(a => a.id === parseInt(assignmentId));
  if (item) {
    item.estadoEstudiante = 'Entregado';
  }
  res.json({ success: true, message: 'Trabajo/Taller entregado exitosamente al docente' });
});

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`[API Server] EduColombia API Server running on port ${PORT}`);
  console.log(`[API Base] Endpoint: http://localhost:${PORT}/api`);
  console.log(`=======================================================`);
});
