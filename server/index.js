import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { getPool, initDatabase } from './db.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.join(__dirname, '../dist');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '500mb' }));
app.use(express.urlencoded({ limit: '500mb', extended: true }));

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

// System Time & Date Control (Reliable 100% Server Clock)
let systemTimeOffsetMs = 0;

app.get('/api/time', (req, res) => {
  const now = new Date(Date.now() + systemTimeOffsetMs);
  
  const dateOptions = {
    timeZone: 'America/Bogota',
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  const timeOptions = {
    timeZone: 'America/Bogota',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  };

  const rawDate = now.toLocaleDateString('es-CO', dateOptions);
  const formattedDate = rawDate.charAt(0).toUpperCase() + rawDate.slice(1);
  const formattedTime = now.toLocaleTimeString('es-CO', timeOptions);

  res.json({
    iso: now.toISOString(),
    timestamp: now.getTime(),
    year: now.getFullYear(),
    month: now.getMonth() + 1, // 1 - 12
    monthIndex: now.getMonth(), // 0 - 11
    day: now.getDate(),
    dayOfWeek: now.getDay(), // 0 - 6
    hours: now.getHours(),
    minutes: now.getMinutes(),
    seconds: now.getSeconds(),
    formattedDate,
    formattedTime,
    timeZone: 'America/Bogota',
    offsetMs: systemTimeOffsetMs,
    isControlled: systemTimeOffsetMs !== 0
  });
});

app.post('/api/time/control', (req, res) => {
  const { targetDate, resetToRealTime } = req.body;
  if (resetToRealTime) {
    systemTimeOffsetMs = 0;
    return res.json({ success: true, message: 'Reloj reestablecido a la hora real del sistema', offsetMs: 0 });
  }
  if (targetDate) {
    const parsed = new Date(targetDate);
    if (!isNaN(parsed.getTime())) {
      systemTimeOffsetMs = parsed.getTime() - Date.now();
      return res.json({ success: true, message: 'Fecha/Hora del sistema ajustada exitosamente', offsetMs: systemTimeOffsetMs });
    }
  }
  res.status(400).json({ error: 'Parámetro targetDate inválido' });
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
        'SELECT u.id, u.nombre, u.apellido, u.email, u.rol, u.grado_nivel, u.avatar_url, u.banner_url, i.nombre as institucion, i.logo_url FROM usuarios u JOIN instituciones i ON u.institucion_id = i.id WHERE u.email = ? LIMIT 1',
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
            avatarUrl: u.avatar_url || null,
            bannerUrl: u.banner_url || null,
            puntosExperiencia: 450,
            nivel3D: 'Explorador Avanzado'
          }
        });
      }
    } catch (e) {
      console.error('[API Login Error]', e.message);
    }
  }

  // Fallback demo user isolated per role to prevent cross-contamination
  const lower = (email || '').toLowerCase();
  let fallbackUser;
  if (lower.includes('docente')) {
    fallbackUser = {
      id: 2,
      nombre: 'Dra. Valentina Ríos',
      email: email || 'docente@educol.edu.co',
      rol: 'DOCENTE',
      grado: 'Docente de Ciencias',
      institucion: 'Institución Educativa Colombian Future',
      logoInstitucion: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      bannerUrl: 'banner-molecular',
      puntosExperiencia: 650,
      nivel3D: 'Docente Experto'
    };
  } else if (lower.includes('admin') || lower.includes('rector')) {
    fallbackUser = {
      id: 3,
      nombre: 'Carlos Administrador',
      email: email || 'admin@educol.edu.co',
      rol: 'RECTOR',
      grado: 'Rectoría Institucional',
      institucion: 'Institución Educativa Colombian Future',
      logoInstitucion: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
      avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
      bannerUrl: 'banner-sol',
      puntosExperiencia: 1000,
      nivel3D: 'Rector Institucional'
    };
  } else {
    fallbackUser = {
      id: 1,
      nombre: 'Mateo Gómez',
      email: email || 'estudiante@educol.edu.co',
      rol: 'ESTUDIANTE',
      grado: '10° Bachillerato',
      institucion: 'Institución Educativa Colombian Future',
      logoInstitucion: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
      avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
      bannerUrl: 'banner-paramo',
      puntosExperiencia: 450,
      nivel3D: 'Explorador Avanzado'
    };
  }

  res.json({ user: fallbackUser });
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
  const { userId, email, avatarUrl, bannerUrl, nombre } = req.body;
  const pool = await getPool();

  if (pool && (userId || email)) {
    try {
      const updates = [];
      const params = [];
      if (avatarUrl !== undefined) {
        updates.push('avatar_url = ?');
        params.push(avatarUrl);
      }
      if (bannerUrl !== undefined) {
        updates.push('banner_url = ?');
        params.push(bannerUrl);
      }
      if (nombre) {
        updates.push('nombre = ?');
        params.push(nombre);
      }
      if (updates.length > 0) {
        let sql = `UPDATE usuarios SET ${updates.join(', ')}`;
        if (userId) {
          sql += ' WHERE id = ?';
          params.push(userId);
        } else {
          sql += ' WHERE email = ?';
          params.push(email);
        }
        await pool.query(sql, params);
      }
    } catch (e) {
      console.error('[API Update Profile Error]', e.message);
    }
  }

  res.json({
    success: true,
    message: 'Perfil actualizado exitosamente en el servidor',
    profile: { userId, email, avatarUrl, bannerUrl, nombre }
  });
});

// Get User Profile by ID or Email
app.get('/api/users/profile/:identifier', async (req, res) => {
  const { identifier } = req.params;
  const pool = await getPool();

  if (pool) {
    try {
      const isNum = !isNaN(identifier) && !identifier.includes('@');
      const query = isNum
        ? 'SELECT id, nombre, apellido, email, rol, grado_nivel, avatar_url, banner_url FROM usuarios WHERE id = ? LIMIT 1'
        : 'SELECT id, nombre, apellido, email, rol, grado_nivel, avatar_url, banner_url FROM usuarios WHERE email = ? LIMIT 1';
      const [rows] = await pool.query(query, [identifier]);
      if (rows.length > 0) {
        const u = rows[0];
        return res.json({
          success: true,
          user: {
            id: u.id,
            nombre: `${u.nombre} ${u.apellido}`,
            email: u.email,
            rol: u.rol,
            grado: u.grado_nivel,
            avatarUrl: u.avatar_url,
            bannerUrl: u.banner_url
          }
        });
      }
    } catch (e) {
      console.error('[API Get Profile Error]', e.message);
    }
  }

  res.status(404).json({ success: false, error: 'Usuario no encontrado' });
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
    subjectTitle: 'Biología',
    titulo: 'Taller: Adaptaciones Foliares del Frailejón',
    descripcion: 'Análisis biológico sobre la cutícula de las hojas del frailejón en el páramo de Chingaza.',
    tipo: 'TALLER',
    gradoDestino: '10° A',
    jornadaDestino: 'Mañana',
    fechaLimite: '2026-09-12',
    puntos: 100,
    docenteNombre: 'Dra. Valentina Ríos',
    estadoEstudiante: 'Pendiente'
  },
  {
    id: 2,
    materiaId: 1,
    subjectTitle: 'Matemáticas',
    titulo: 'Cuestionario: Vectores y Geometría Espacial',
    descripcion: 'Resuelve los ejercicios de geometría y cálculo vectorial en R3.',
    tipo: 'CUESTIONARIO',
    gradoDestino: '10° A',
    jornadaDestino: 'Mañana',
    fechaLimite: '2026-09-18',
    puntos: 100,
    docenteNombre: 'Ing. Alejandro Torres',
    estadoEstudiante: 'Pendiente'
  },
  {
    id: 3,
    materiaId: 3,
    subjectTitle: 'Literatura Colombiana',
    titulo: 'Ensayo Crítico: El Tiempo Circular en Macondo',
    descripcion: 'Análisis textual sobre los símbolos de Soledad y el taller de Melquíades.',
    tipo: 'ENSAYO',
    gradoDestino: '10° A',
    jornadaDestino: 'Mañana',
    fechaLimite: '2026-09-25',
    puntos: 100,
    docenteNombre: 'Prof. Gabriel Mendoza',
    estadoEstudiante: 'Pendiente'
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

// =============================================================================
// INSTITUTIONAL CREST (ESCUDO DEL COLEGIO)
// =============================================================================
let institutionalSettings = {
  crestUrl: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=300&auto=format&fit=crop&q=80',
  institutionName: 'Institución Educativa Colombian Future',
  motto: 'Ciencia, Innovación & Excelencia Inmersiva',
  rectorName: 'Carlos Administrador',
  updatedAt: new Date().toISOString()
};

app.get('/api/institutional/crest', (req, res) => {
  res.json({ success: true, ...institutionalSettings });
});

app.post('/api/institutional/crest', (req, res) => {
  const { crestUrl, institutionName, motto } = req.body;
  if (crestUrl) institutionalSettings.crestUrl = crestUrl;
  if (institutionName) institutionalSettings.institutionName = institutionName;
  if (motto) institutionalSettings.motto = motto;
  institutionalSettings.updatedAt = new Date().toISOString();

  res.json({ success: true, message: 'Escudo institucional actualizado con éxito', settings: institutionalSettings });
});

// =============================================================================
// MANUAL DE CONVIVENCIA Y REGLAS DEL COLEGIO
// =============================================================================
let institutionalHandbook = {
  titulo: 'Manual de Convivencia y Normativa Institucional',
  institucion: 'Institución Educativa Colombian Future',
  codigoSnies: 'SNIES-994821',
  vigencia: 'Periodo Lectivo 2026 - 2027',
  ultimaActualizacion: '2026-09-01',
  aprobadoPor: 'Consejo Directivo y Rectoría General',
  capitulos: [
    {
      id: 1,
      numero: 'Capítulo I',
      titulo: 'Principios Fundamentales, Misión y Visión',
      descripcion: 'Bases filosóficas y formativas de la institución educativa orientadas a la excelencia académica y ciudadana.',
      articulos: [
        {
          id: 101,
          numero: 'Artículo 1',
          titulo: 'Misión Institucional',
          contenido: 'Formar líderes con pensamiento crítico, ético e innovador mediante el uso responsable de la ciencia, la tecnología inmersiva y el respeto por los derechos humanos.'
        },
        {
          id: 102,
          numero: 'Artículo 2',
          titulo: 'Filosofía del Respeto y Convivencia Pacífica',
          contenido: 'Toda interacción dentro y fuera de las instalaciones físicas o entornos virtuales del colegio debe fundamentarse en la dignidad humana, la empatía y la resolución pacífica de diferencias.'
        }
      ]
    },
    {
      id: 2,
      numero: 'Capítulo II',
      titulo: 'Derechos de los Estudiantes y la Comunidad Educativa',
      descripcion: 'Garantías esenciales para el pleno desarrollo de la personalidad y el aprendizaje integral.',
      articulos: [
        {
          id: 201,
          numero: 'Artículo 3',
          titulo: 'Derecho a una Educación Equitativa y de Calidad',
          contenido: 'Recibir formación académica integral con metodologías pedagógicas modernas, retroalimentación justa y acceso a laboratorios y herramientas virtuales sin ningún tipo de discriminación.'
        },
        {
          id: 202,
          numero: 'Artículo 4',
          titulo: 'Derecho al Debido Proceso Académico y Disciplinario',
          contenido: 'Conocer oportunamente las evaluaciones, criterios de calificación y contar con derecho a réplica y mediación pedagógica en toda situación correctiva.'
        }
      ]
    },
    {
      id: 3,
      numero: 'Capítulo III',
      titulo: 'Deberes y Compromisos del Estudiante',
      descripcion: 'Obligaciones formativas y éticas para salvaguardar el orden y la armonía escolar.',
      articulos: [
        {
          id: 301,
          numero: 'Artículo 5',
          titulo: 'Puntualidad y Asistencia a Clases',
          contenido: 'Presentarse con puntualidad a las jornadas presenciales y sesiones académicas programadas portando el uniforme oficial en óptimo estado de pulcritud.'
        },
        {
          id: 302,
          numero: 'Artículo 6',
          titulo: 'Cumplimiento Oportuno de Tareas y Talleres',
          contenido: 'Elaborar y presentar las asignaciones académicas con rigor, originalidad y dentro de los plazos estipulados por los docentes en el campus virtual.'
        }
      ]
    },
    {
      id: 4,
      numero: 'Capítulo IV',
      titulo: 'Clasificación de Faltas y Procedimientos Pedagógicos',
      descripcion: 'Tipificación de comportamientos y acciones formativas restaurativas.',
      articulos: [
        {
          id: 401,
          numero: 'Artículo 7',
          titulo: 'Faltas Leves',
          contenido: 'Interrupción recurrente de clases, porte inadecuado de implementos escolares o uso de dispositivos móviles sin autorización pedagógica del docente.'
        },
        {
          id: 402,
          numero: 'Artículo 8',
          titulo: 'Faltas Graves y Gravísimas',
          contenido: 'Cualquier conducta que vulnere la integridad física o psicológica de miembros de la comunidad (ciberacoso, intimidación, plagio deliberado o daño intencional a bienes institucionales).'
        }
      ]
    },
    {
      id: 5,
      numero: 'Capítulo V',
      titulo: 'Uso de Entornos Digitales y Campus Virtual',
      descripcion: 'Normas de ciudadanía digital, seguridad informática y convivencia en línea.',
      articulos: [
        {
          id: 501,
          numero: 'Artículo 9',
          titulo: 'Custodia de Credenciales Institucionales',
          contenido: 'El acceso al campus y correo institucional es personal e intransferible. Está prohibido suplantar identidades o compartir contraseñas de acceso.'
        },
        {
          id: 502,
          numero: 'Artículo 10',
          titulo: 'Netiqueta y Comunicación Asertiva',
          contenido: 'Toda comunicación en foros, buzones de entrega y chats del colegio debe mantener un tono respetuoso, constructivo y formal.'
        }
      ]
    }
  ]
};

app.get('/api/institutional/handbook', (req, res) => {
  res.json({ success: true, handbook: institutionalHandbook });
});

app.post('/api/institutional/handbook', (req, res) => {
  const { capitulos, titulo, vigencia, aprobadoPor } = req.body;
  if (capitulos && Array.isArray(capitulos)) institutionalHandbook.capitulos = capitulos;
  if (titulo) institutionalHandbook.titulo = titulo;
  if (vigencia) institutionalHandbook.vigencia = vigencia;
  if (aprobadoPor) institutionalHandbook.aprobadoPor = aprobadoPor;
  institutionalHandbook.ultimaActualizacion = new Date().toISOString().split('T')[0];

  res.json({ success: true, message: 'Manual de convivencia actualizado exitosamente', handbook: institutionalHandbook });
});

// =============================================================================
// JERARQUÍA INSTITUCIONAL INTERACTIVA
// =============================================================================
const institutionalHierarchyData = {
  id: 'node-rector',
  nombre: 'Carlos Administrador',
  cargo: 'Rector General & Director Institucional',
  area: 'Dirección General',
  email: 'admin@educol.edu.co',
  telefono: '+57 (1) 745-8900 Ext. 101',
  horarioAtencion: 'Lunes a Viernes 07:30 - 12:30',
  foto: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&auto=format&fit=crop&q=80',
  estado: 'Activo en Sede Central',
  descripcion: 'Dirección integral, planeación estratégica y articulación pedagógica institucional.',
  hijos: [
    {
      id: 'node-coord-acad',
      nombre: 'Lic. Andrés Maldonado',
      cargo: 'Coordinador Académico',
      area: 'Coordinación Pedagógica',
      email: 'academica@educol.edu.co',
      telefono: '+57 (1) 745-8900 Ext. 104',
      horarioAtencion: 'Lunes a Viernes 08:00 - 14:00',
      foto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      estado: 'Activo',
      descripcion: 'Supervisión del plan curricular, mallas pedagógicas y seguimiento de rendimientos académicos.',
      hijos: [
        {
          id: 'node-prof-valentina',
          nombre: 'Dra. Valentina Ríos',
          cargo: 'Docente Titular de Ciencias Naturales & Biología',
          area: 'Departamento de Ciencias Naturales',
          email: 'docente@educol.edu.co',
          telefono: '+57 (1) 745-8900 Ext. 201',
          horarioAtencion: 'Miércoles y Jueves 14:00 - 16:00',
          foto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
          estado: 'Activo',
          descripcion: 'Cátedra de Biología 3D, investigación de biodiversidad andina y laboratorios celulares.',
          salones: [
            { grado: '10° A', materia: 'Biología 3D', estudiantes: 34, aula: 'Laboratorio de Ciencias 1' },
            { grado: '10° B', materia: 'Biología 3D', estudiantes: 32, aula: 'Aula 204' },
            { grado: '11° A', materia: 'Ecología Aplicada', estudiantes: 29, aula: 'Laboratorio de Ciencias 1' }
          ]
        },
        {
          id: 'node-prof-alejandro',
          nombre: 'Ing. Alejandro Torres',
          cargo: 'Docente de Matemáticas, Cálculo & Geometría 3D',
          area: 'Departamento de Matemáticas',
          email: 'alejandro.torres@educol.edu.co',
          telefono: '+57 (1) 745-8900 Ext. 202',
          horarioAtencion: 'Martes y Viernes 10:30 - 12:30',
          foto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
          estado: 'Activo',
          descripcion: 'Cálculo diferencial, trigonometría espacial y modelos geométricos 3D.',
          salones: [
            { grado: '10° A', materia: 'Matemáticas 3D', estudiantes: 34, aula: 'Aula 201' },
            { grado: '10° B', materia: 'Matemáticas 3D', estudiantes: 32, aula: 'Aula 202' },
            { grado: '11° B', materia: 'Cálculo Avanzado', estudiantes: 28, aula: 'Aula 301' }
          ]
        },
        {
          id: 'node-prof-gabriel',
          nombre: 'Prof. Gabriel Mendoza',
          cargo: 'Docente de Humanidades & Literatura Colombiana',
          area: 'Departamento de Humanidades',
          email: 'gabriel.mendoza@educol.edu.co',
          telefono: '+57 (1) 745-8900 Ext. 203',
          horarioAtencion: 'Lunes y Jueves 09:00 - 11:00',
          foto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
          estado: 'Activo',
          descripcion: 'Cátedra de literatura hispanoamericana, narrativa contemporánea y análisis crítico.',
          salones: [
            { grado: '10° A', materia: 'Literatura Colombiana', estudiantes: 34, aula: 'Biblioteca Central' },
            { grado: '11° A', materia: 'Filosofía & Lengua', estudiantes: 29, aula: 'Aula 205' }
          ]
        }
      ]
    },
    {
      id: 'node-coord-conviv',
      nombre: 'Dra. Helena Sarmiento',
      cargo: 'Coordinadora de Convivencia Escolar',
      area: 'Bienestar & Convivencia',
      email: 'convivencia@educol.edu.co',
      telefono: '+57 (1) 745-8900 Ext. 105',
      horarioAtencion: 'Lunes a Viernes 07:00 - 13:00',
      foto: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
      estado: 'Activo',
      descripcion: 'Gestión de comités de convivencia, mediación estudiantil y acompañamiento a familias.',
      hijos: [
        {
          id: 'node-prof-carlos',
          nombre: 'Lic. Carlos López',
          cargo: 'Docente de Educación Física & Convivencia',
          area: 'Educación Física y Deportes',
          email: 'carlos.lopez@educol.edu.co',
          telefono: '+57 (1) 745-8900 Ext. 204',
          horarioAtencion: 'Martes 08:00 - 10:00',
          foto: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80',
          estado: 'Activo',
          descripcion: 'Dirección de grupo de 10° B, formación deportiva y hábitos saludables.',
          salones: [
            { grado: '10° B', materia: 'Educación Física', estudiantes: 32, aula: 'Canchas Polideportivas' },
            { grado: '11° B', materia: 'Educación Física', estudiantes: 28, aula: 'Canchas Polideportivas' }
          ]
        },
        {
          id: 'node-prof-maria',
          nombre: 'Dra. María Victoria Gómez',
          cargo: 'Docente de Química & Laboratorios Experimentales',
          area: 'Departamento de Ciencias',
          email: 'maria.gomez@educol.edu.co',
          telefono: '+57 (1) 745-8900 Ext. 205',
          horarioAtencion: 'Jueves 10:00 - 12:00',
          foto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
          estado: 'Activo',
          descripcion: 'Química orgánica, estequiometría y seguridad en laboratorios.',
          salones: [
            { grado: '10° A', materia: 'Química 3D', estudiantes: 34, aula: 'Laboratorio de Química 2' },
            { grado: '11° A', materia: 'Química Orgánica', estudiantes: 29, aula: 'Laboratorio de Química 2' }
          ]
        }
      ]
    },
    {
      id: 'node-coord-tic',
      nombre: 'Ing. David Beltrán',
      cargo: 'Coordinador de Tecnología, Informática & Campus Virtual',
      area: 'Dirección TIC',
      email: 'tic@educol.edu.co',
      telefono: '+57 (1) 745-8900 Ext. 108',
      horarioAtencion: 'Lunes a Viernes 08:00 - 16:00',
      foto: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
      estado: 'Activo',
      descripcion: 'Infraestructura tecnológica, servidores del campus y soporte de conectividad.',
      hijos: [
        {
          id: 'node-prof-luis',
          nombre: 'Ing. Luis Fernando Ruiz',
          cargo: 'Docente de Informática & Robótica Educativa',
          area: 'Departamento de Tecnología',
          email: 'luis.ruiz@educol.edu.co',
          telefono: '+57 (1) 745-8900 Ext. 206',
          horarioAtencion: 'Lunes 14:00 - 16:00',
          foto: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=80',
          estado: 'Activo',
          descripcion: 'Algoritmia, robótica Arduino y diseño digital.',
          salones: [
            { grado: '10° A', materia: 'Informática 3D', estudiantes: 34, aula: 'Sala de Sistemas 1' },
            { grado: '10° B', materia: 'Informática 3D', estudiantes: 32, aula: 'Sala de Sistemas 2' }
          ]
        }
      ]
    }
  ]
};

app.get('/api/institutional/hierarchy', (req, res) => {
  res.json({ success: true, hierarchy: institutionalHierarchyData });
});

// =============================================================================
// GESTIÓN COMPLETA DE ENTREGAS, CORREO DE TAREAS Y CALIFICACIONES
// =============================================================================
let memorySubmissions = [
  {
    id: 1,
    assignmentId: 1,
    materiaId: 2,
    materiaNombre: 'Biología 3D',
    titulo: 'Informe de Laboratorio: Células del Frailejón Andino',
    tipo: 'TALLER',
    estudianteId: 1,
    estudianteNombre: 'Mateo Gómez',
    estudianteEmail: 'estudiante@educol.edu.co',
    grado: '10° A',
    jornada: 'Mañana',
    fechaEntrega: '2026-09-08T14:30:00.000Z',
    archivo: {
      nombre: 'Informe_Frailejon_MateoGomez.pdf',
      tamanoMb: 14.5,
      tipo: 'application/pdf',
      url: ''
    },
    comentariosEstudiante: 'Adjunto el informe de investigación con las capturas microscópicas del tejido celular y análisis de vacuolas.',
    estado: 'CALIFICADO',
    nota: 5.0,
    anotacionesDocente: 'Excelente trabajo de análisis. Se evidencia rigurosidad metodológica y una clara interpretación de las adaptaciones climáticas del frailejón. Continúa con ese nivel de detalle.',
    docenteNombre: 'Dra. Valentina Ríos',
    fechaCalificacion: '2026-09-08T17:45:00.000Z'
  },
  {
    id: 2,
    assignmentId: 2,
    materiaId: 1,
    materiaNombre: 'Matemáticas 3D',
    titulo: 'Taller de Vectores y Geometría en R3',
    tipo: 'TALLER',
    estudianteId: 1,
    estudianteNombre: 'Mateo Gómez',
    estudianteEmail: 'estudiante@educol.edu.co',
    grado: '10° A',
    jornada: 'Mañana',
    fechaEntrega: '2026-09-09T08:15:00.000Z',
    archivo: {
      nombre: 'Calculo_Vectores_3D_Mateo.xlsx',
      tamanoMb: 8.2,
      tipo: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      url: ''
    },
    comentariosEstudiante: 'Entrego el archivo Excel con las matrices de proyección y los cálculos del producto cruz solicitados en la guía.',
    estado: 'PENDIENTE',
    nota: null,
    anotacionesDocente: null,
    docenteNombre: null,
    fechaCalificacion: null
  },
  {
    id: 3,
    assignmentId: 3,
    materiaId: 3,
    materiaNombre: 'Literatura Colombiana',
    titulo: 'Ensayo Crítico sobre Cien Años de Soledad',
    tipo: 'ENSAYO',
    estudianteId: 104,
    estudianteNombre: 'Camila Morales',
    estudianteEmail: 'camila.morales@educol.edu.co',
    grado: '10° A',
    jornada: 'Mañana',
    fechaEntrega: '2026-09-09T09:20:00.000Z',
    archivo: {
      nombre: 'Ensayo_Macondo_CamilaMorales.docx',
      tamanoMb: 4.1,
      tipo: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      url: ''
    },
    comentariosEstudiante: 'Profesor, envío mi ensayo sobre el simbolismo de los peces de oro y la soledad del coronel Aureliano Buendía.',
    estado: 'PENDIENTE',
    nota: null,
    anotacionesDocente: null,
    docenteNombre: null,
    fechaCalificacion: null
  },
  {
    id: 4,
    assignmentId: 1,
    materiaId: 2,
    materiaNombre: 'Biología 3D',
    titulo: 'Investigación Flora Andina y Cloroplastos',
    tipo: 'PROYECTO',
    estudianteId: 105,
    estudianteNombre: 'Santiago Ospina',
    estudianteEmail: 'santiago.ospina@educol.edu.co',
    grado: '10° B',
    jornada: 'Tarde',
    fechaEntrega: '2026-09-09T09:40:00.000Z',
    archivo: {
      nombre: 'Proyecto_Biologia_Ospina.pdf',
      tamanoMb: 28.6,
      tipo: 'application/pdf',
      url: ''
    },
    comentariosEstudiante: 'Comparto el documento en PDF con diagramas de células de páramo y datos experimentales.',
    estado: 'PENDIENTE',
    nota: null,
    anotacionesDocente: null,
    docenteNombre: null,
    fechaCalificacion: null
  }
];

function cleanServerText(str) {
  if (!str || typeof str !== 'string') return str || '';
  return str
    .replace(/Ã¡/g, 'á')
    .replace(/Ã©/g, 'é')
    .replace(/Ã­/g, 'í')
    .replace(/Ã³/g, 'ó')
    .replace(/Ãº/g, 'ú')
    .replace(/Ã±/g, 'ñ')
    .replace(/Ã /g, 'Á')
    .replace(/Ã‰/g, 'É')
    .replace(/Ã /g, 'Í')
    .replace(/Ã“/g, 'Ó')
    .replace(/Ãš/g, 'Ú')
    .replace(/Ã‘/g, 'Ñ')
    .replace(/Â°/g, '°')
    .replace(/Biolog[\uFFFD\?]a/gi, 'Biología')
    .replace(/BIOLOG[\uFFFD\?]A/g, 'BIOLOGÍA')
    .replace(/G[\uFFFD\?]mez/gi, 'Gómez')
    .replace(/R[\uFFFD\?]os/gi, 'Ríos')
    .replace(/investigaci[\uFFFD\?]n/gi, 'investigación')
    .replace(/Geometr[\uFFFD\?]a/gi, 'Geometría')
    .replace(/Frailej[\uFFFD\?]n/gi, 'Frailejón')
    .replace(/Ma[\uFFFD\?]ana/gi, 'Mañana')
    .replace(/evaluaci[\uFFFD\?]n/gi, 'evaluación')
    .replace(/calificaci[\uFFFD\?]n/gi, 'calificación')
    .replace(/educaci[\uFFFD\?]n/gi, 'educación')
    .replace(/inform[\uFFFD\?]tica/gi, 'informática')
    .replace(/\b10[\uFFFD\?\s]*A\b/g, '10° A')
    .replace(/\b10[\uFFFD\?\s]*B\b/g, '10° B')
    .replace(/\b11[\uFFFD\?\s]*A\b/g, '11° A')
    .replace(/\b11[\uFFFD\?\s]*B\b/g, '11° B')
    .replace(/\uFFFD/g, '');
}

function sanitizeSubmission(s) {
  if (!s) return s;
  return {
    ...s,
    materiaNombre: cleanServerText(s.materiaNombre),
    titulo: cleanServerText(s.titulo),
    estudianteNombre: cleanServerText(s.estudianteNombre),
    grado: cleanServerText(s.grado),
    jornada: cleanServerText(s.jornada),
    docenteNombre: cleanServerText(s.docenteNombre),
    anotacionesDocente: cleanServerText(s.anotacionesDocente),
    comentariosEstudiante: cleanServerText(s.comentariosEstudiante)
  };
}

// Obtener entregas para el Correo de Tareas del profesor
app.get('/api/submissions', (req, res) => {
  const { grado, materiaId, estado, estudianteId } = req.query;
  let list = memorySubmissions.map(sanitizeSubmission);

  if (grado && grado !== 'Todos') {
    list = list.filter(s => s.grado === grado);
  }
  if (materiaId && materiaId !== 'Todas') {
    list = list.filter(s => String(s.materiaId) === String(materiaId));
  }
  if (estado && estado !== 'TODOS') {
    list = list.filter(s => s.estado === estado);
  }
  if (estudianteId) {
    list = list.filter(s => String(s.estudianteId) === String(estudianteId));
  }

  res.json({ success: true, submissions: list });
});

// Estudiante sube una tarea (hasta 500 MB)
app.post('/api/submissions', (req, res) => {
  const {
    assignmentId,
    materiaId,
    materiaNombre,
    titulo,
    tipo,
    estudianteId,
    estudianteNombre,
    estudianteEmail,
    grado,
    jornada,
    comentariosEstudiante,
    archivo
  } = req.body;

  const newSubmission = {
    id: Date.now(),
    assignmentId: parseInt(assignmentId) || 1,
    materiaId: parseInt(materiaId) || 1,
    materiaNombre: cleanServerText(materiaNombre || 'Materia Académica'),
    titulo: cleanServerText(titulo || 'Entrega de Tarea'),
    tipo: tipo || 'TALLER',
    estudianteId: parseInt(estudianteId) || 1,
    estudianteNombre: cleanServerText(estudianteNombre || 'Estudiante EduCol'),
    estudianteEmail: estudianteEmail || 'estudiante@educol.edu.co',
    grado: cleanServerText(grado || '10° A'),
    jornada: cleanServerText(jornada || 'Mañana'),
    fechaEntrega: new Date().toISOString(),
    archivo: archivo || {
      nombre: 'documento_entregado.pdf',
      tamanoMb: 1.0,
      tipo: 'application/pdf',
      url: ''
    },
    comentariosEstudiante: cleanServerText(comentariosEstudiante || ''),
    estado: 'PENDIENTE',
    nota: null,
    anotacionesDocente: null,
    docenteNombre: null,
    fechaCalificacion: null
  };

  memorySubmissions.unshift(newSubmission);
  res.json({ success: true, message: 'Tarea enviada exitosamente al profesor', submission: newSubmission });
});

// Profesor califica la tarea y envía nota con observaciones
app.put('/api/submissions/:id/grade', (req, res) => {
  const submissionId = parseInt(req.params.id);
  const { nota, anotacionesDocente, docenteNombre } = req.body;

  const submission = memorySubmissions.find(s => s.id === submissionId);
  if (!submission) {
    return res.status(404).json({ success: false, message: 'Entrega no encontrada' });
  }

  const parsedNota = parseFloat(nota);
  submission.nota = !isNaN(parsedNota) ? parsedNota : 5.0;
  submission.anotacionesDocente = cleanServerText(anotacionesDocente || 'Revisado y aprobado.');
  submission.docenteNombre = cleanServerText(docenteNombre || 'Docente Evaluador');
  submission.fechaCalificacion = new Date().toISOString();
  submission.estado = 'CALIFICADO';

  res.json({
    success: true,
    message: 'Nota y observaciones enviadas exitosamente al estudiante',
    submission: sanitizeSubmission(submission)
  });
});

// Obtener entregas de un estudiante específico (para Trabajos Calificados)
app.get('/api/submissions/student/:studentId', (req, res) => {
  const studentId = parseInt(req.params.studentId);
  const list = memorySubmissions.filter(s => s.estudianteId === studentId).map(sanitizeSubmission);
  res.json({ success: true, submissions: list });
});

// GESTIÓN INSTITUCIONAL DE PERSONAL (STAFF)
let memoryStaff = [];

app.post('/api/users/staff', (req, res) => {
  const staffMember = {
    id: Date.now(),
    ...req.body,
    nombre: cleanServerText(req.body.nombre || ''),
    grado: cleanServerText(req.body.grado || '')
  };
  memoryStaff.push(staffMember);
  res.json({ success: true, message: 'Miembro del personal registrado exitosamente', user: staffMember });
});

app.get('/api/users/staff', (req, res) => {
  res.json({ success: true, staff: memoryStaff });
});

// =============================================================================
// MÓDULO DE EVALUACIONES & PARCIALES (PROFESOR & ESTUDIANTE)
// =============================================================================

let memoryEvaluations = [
  {
    id: 1,
    titulo: 'Parcial I: Geometría Espacial y Vectores en R3',
    materia: 'Matemáticas 3D',
    materiaId: 1,
    grado: '10° A',
    jornada: 'Mañana',
    docenteId: 2,
    docenteNombre: 'Ing. Alejandro Torres',
    tiempoMinutos: 45,
    puntosTotales: 100,
    fechaLimite: '2026-09-30T23:59:00.000Z',
    instrucciones: 'Lea atentamente cada pregunta. El parcial contiene preguntas de selección múltiple, análisis conceptual escrito y cálculo matemático.',
    preguntas: [
      {
        id: 101,
        tipo: 'OPCION_MULTIPLE',
        enunciado: 'Dado dos vectores u = (3, 0, 4) y v = (0, 5, 0), ¿cuál es el resultado de su producto escalar (u · v)?',
        opciones: ['0', '15', '20', '25'],
        respuestaCorrecta: '0',
        puntos: 25
      },
      {
        id: 102,
        tipo: 'MATEMATICAS',
        enunciado: 'Calcule la magnitud o norma del vector tridimensional w = (2, 3, 6). Indique el valor exacto y el procedimiento.',
        formula: '|w| = sqrt(x^2 + y^2 + z^2)',
        respuestaEsperada: '7',
        unidad: 'unidades',
        puntos: 35
      },
      {
        id: 103,
        tipo: 'ESCRITURA',
        enunciado: 'Explique brevemente la diferencia fundamental entre un vector libre en el espacio tridimensional y un punto geométrico de coordenadas fijas.',
        criterios: 'Claridad teórica, uso de conceptos de dirección, sentido y magnitud.',
        limitePalabras: 150,
        puntos: 40
      }
    ],
    createdAt: '2026-09-01T10:00:00.000Z'
  },
  {
    id: 2,
    titulo: 'Parcial Bimestral: Morfología y Fisiología Celular Andina',
    materia: 'Biología 3D',
    materiaId: 2,
    grado: '10° A',
    jornada: 'Mañana',
    docenteId: 2,
    docenteNombre: 'Dra. Valentina Ríos',
    tiempoMinutos: 60,
    puntosTotales: 100,
    fechaLimite: '2026-10-05T23:59:00.000Z',
    instrucciones: 'Examen teórico y aplicado sobre las adaptaciones celulares de la flora de páramo. Verifique el tiempo disponible antes de comenzar.',
    preguntas: [
      {
        id: 201,
        tipo: 'OPCION_MULTIPLE',
        enunciado: '¿Cuál es la función principal de los tricomas densos en la superficie foliar de los frailejones (Espeletia)?',
        opciones: [
          'Aislar térmicamente contra temperaturas bajo cero y retener humedad',
          'Facilitar la absorción de luz ultravioleta sin filtro',
          'Acelerar la tasa de transpiración en época de lluvia',
          'Producir clorofila adicional durante la noche'
        ],
        respuestaCorrecta: 'Aislar térmicamente contra temperaturas bajo cero y retener humedad',
        puntos: 30
      },
      {
        id: 202,
        tipo: 'ESCRITURA',
        enunciado: 'Describa el mecanismo osmótico que emplean las vacuolas de las células vegetales en alta montaña para evitar el congelamiento citoplasmático.',
        criterios: 'Mención de concentración de solutos, potencial hídrico y presión de turgencia.',
        limitePalabras: 200,
        puntos: 40
      },
      {
        id: 203,
        tipo: 'MATEMATICAS',
        enunciado: 'Si una muestra foliar de 50 cm2 retiene 120 ml de agua condensada de niebla en 6 horas, calcule la tasa promedio de captación en ml por cm2 por hora.',
        formula: 'Tasa = Volumen / (Area * Tiempo)',
        respuestaEsperada: '0.4',
        unidad: 'ml / (cm2 * h)',
        puntos: 30
      }
    ],
    createdAt: '2026-09-05T14:00:00.000Z'
  }
];

let memoryEvaluationSubmissions = [
  {
    id: 1,
    evaluacionId: 1,
    evaluacionTitulo: 'Parcial I: Geometría Espacial y Vectores en R3',
    materia: 'Matemáticas 3D',
    estudianteId: 102,
    estudianteNombre: 'Sofía Rodríguez',
    estudianteEmail: 'sofia.rodriguez@educol.edu.co',
    grado: '10° A',
    jornada: 'Mañana',
    tiempoEmpleadoSegundos: 1950,
    fechaEnvio: '2026-09-10T11:45:00.000Z',
    estado: 'CALIFICADO',
    calificacionTotal: 4.8,
    retroalimentacionDocente: 'Excelente razonamiento en el cálculo de norma y definición vectorial precisa.',
    docenteEvaluador: 'Ing. Alejandro Torres',
    fechaCalificacion: '2026-09-11T16:00:00.000Z',
    respuestas: [
      { preguntaId: 101, tipo: 'OPCION_MULTIPLE', respuesta: '0', puntajeObtenido: 25 },
      { preguntaId: 102, tipo: 'MATEMATICAS', respuesta: '7', procedimiento: '|w| = sqrt(4 + 9 + 36) = sqrt(49) = 7', puntajeObtenido: 35 },
      { preguntaId: 103, tipo: 'ESCRITURA', respuesta: 'Un punto determina una posición estática en el espacio con coordenadas fijas (x,y,z), mientras que un vector representa una traslación que posee magnitud, dirección y sentido independiente de su punto de aplicación inicial.', puntajeObtenido: 38 }
    ]
  }
];

// Listar Evaluaciones (con filtro opcional de grado y materia)
app.get('/api/evaluations', (req, res) => {
  const { grado, materiaId } = req.query;
  let list = memoryEvaluations;
  if (grado && grado !== 'Todos') {
    list = list.filter(e => e.grado === grado || e.grado === 'Todos');
  }
  if (materiaId) {
    list = list.filter(e => e.materiaId === parseInt(materiaId));
  }

  // Devolver sin las respuestas correctas para seguridad del estudiante
  const sanitizedList = list.map(ev => ({
    ...ev,
    preguntas: ev.preguntas.map(p => {
      const { respuestaCorrecta, ...rest } = p;
      return rest;
    })
  }));

  res.json({ success: true, evaluations: sanitizedList });
});

// Detalle de una evaluación específica
app.get('/api/evaluations/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const ev = memoryEvaluations.find(e => e.id === id);
  if (!ev) {
    return res.status(404).json({ success: false, message: 'Evaluación no encontrada' });
  }
  const sanitized = {
    ...ev,
    preguntas: ev.preguntas.map(p => {
      const { respuestaCorrecta, ...rest } = p;
      return rest;
    })
  };
  res.json({ success: true, evaluation: sanitized });
});

// Crear nueva Evaluación (Docente)
app.post('/api/evaluations', (req, res) => {
  const {
    titulo,
    materia,
    materiaId,
    grado,
    jornada,
    docenteId,
    docenteNombre,
    tiempoMinutos,
    puntosTotales,
    fechaLimite,
    instrucciones,
    preguntas
  } = req.body;

  if (!titulo || !preguntas || !Array.isArray(preguntas) || preguntas.length === 0) {
    return res.status(400).json({ success: false, message: 'Faltan datos requeridos o preguntas' });
  }

  const newEvaluation = {
    id: Date.now(),
    titulo: cleanServerText(titulo),
    materia: cleanServerText(materia || 'Materia General'),
    materiaId: parseInt(materiaId) || 1,
    grado: cleanServerText(grado || '10° A'),
    jornada: cleanServerText(jornada || 'Mañana'),
    docenteId: parseInt(docenteId) || 2,
    docenteNombre: cleanServerText(docenteNombre || 'Docente Evaluador'),
    tiempoMinutos: parseInt(tiempoMinutos) || 45,
    puntosTotales: parseInt(puntosTotales) || 100,
    fechaLimite: fechaLimite || new Date(Date.now() + 14 * 86400000).toISOString(),
    instrucciones: cleanServerText(instrucciones || 'Complete la prueba en el tiempo asignado.'),
    preguntas: preguntas.map((q, idx) => ({
      id: q.id || (Date.now() + idx),
      tipo: q.tipo || 'OPCION_MULTIPLE',
      enunciado: cleanServerText(q.enunciado || ''),
      puntos: parseInt(q.puntos) || 20,
      opciones: Array.isArray(q.opciones) ? q.opciones.map(opt => cleanServerText(opt)) : [],
      respuestaCorrecta: q.respuestaCorrecta ? cleanServerText(q.respuestaCorrecta) : '',
      formula: q.formula ? cleanServerText(q.formula) : '',
      respuestaEsperada: q.respuestaEsperada ? cleanServerText(q.respuestaEsperada) : '',
      unidad: q.unidad ? cleanServerText(q.unidad) : '',
      criterios: q.criterios ? cleanServerText(q.criterios) : '',
      limitePalabras: parseInt(q.limitePalabras) || 200
    })),
    createdAt: new Date().toISOString()
  };

  memoryEvaluations.unshift(newEvaluation);
  res.json({ success: true, message: 'Evaluación creada y publicada exitosamente', evaluation: newEvaluation });
});

// Enviar Parcial (Estudiante - Botón "Enviar parcial")
app.post('/api/evaluations/:id/submit', (req, res) => {
  const evaluacionId = parseInt(req.params.id);
  const evaluation = memoryEvaluations.find(e => e.id === evaluacionId);
  if (!evaluation) {
    return res.status(404).json({ success: false, message: 'Evaluación no encontrada' });
  }

  const {
    estudianteId = 1,
    estudianteNombre = 'Mateo Gómez',
    estudianteEmail = 'estudiante@educol.edu.co',
    grado = '10° A',
    jornada = 'Mañana',
    tiempoEmpleadoSegundos = 0,
    respuestas = []
  } = req.body;

  // Calificación automática previa para preguntas de opción múltiple
  let puntajeAuto = 0;
  const processedRespuestas = respuestas.map(r => {
    const originalQuestion = evaluation.preguntas.find(q => q.id === r.preguntaId);
    let puntaje = 0;
    if (originalQuestion && originalQuestion.tipo === 'OPCION_MULTIPLE') {
      if (String(r.respuesta).trim().toLowerCase() === String(originalQuestion.respuestaCorrecta).trim().toLowerCase()) {
        puntaje = originalQuestion.puntos || 0;
      }
    } else if (originalQuestion && originalQuestion.tipo === 'MATEMATICAS' && originalQuestion.respuestaEsperada) {
      if (String(r.respuesta).trim().toLowerCase() === String(originalQuestion.respuestaEsperada).trim().toLowerCase()) {
        puntaje = originalQuestion.puntos || 0;
      }
    }
    puntajeAuto += puntaje;
    return {
      ...r,
      puntajeObtenido: puntaje
    };
  });

  const submission = {
    id: Date.now(),
    evaluacionId,
    evaluacionTitulo: evaluation.titulo,
    materia: evaluation.materia,
    estudianteId: parseInt(estudianteId),
    estudianteNombre: cleanServerText(estudianteNombre),
    estudianteEmail: cleanServerText(estudianteEmail),
    grado: cleanServerText(grado),
    jornada: cleanServerText(jornada),
    tiempoEmpleadoSegundos: parseInt(tiempoEmpleadoSegundos),
    fechaEnvio: new Date().toISOString(),
    estado: 'ENVIADO',
    calificacionTotal: null,
    puntajeAutoPreliminar: puntajeAuto,
    retroalimentacionDocente: null,
    docenteEvaluador: null,
    fechaCalificacion: null,
    respuestas: processedRespuestas
  };

  memoryEvaluationSubmissions.unshift(submission);

  res.json({
    success: true,
    message: 'Parcial enviado exitosamente al profesor para su revisión',
    submissionId: submission.id,
    fechaEnvio: submission.fechaEnvio
  });
});

// Obtener entregas de parciales para el Docente
app.get('/api/evaluations/:id/submissions', (req, res) => {
  const evaluacionId = parseInt(req.params.id);
  const submissions = memoryEvaluationSubmissions.filter(s => s.evaluacionId === evaluacionId);
  res.json({ success: true, submissions });
});

// Todas las entregas de parciales (para el panel docente)
app.get('/api/evaluations-submissions/all', (req, res) => {
  res.json({ success: true, submissions: memoryEvaluationSubmissions });
});

// Calificar Parcial (Docente)
app.put('/api/evaluations/submissions/:id/grade', (req, res) => {
  const submissionId = parseInt(req.params.id);
  const submission = memoryEvaluationSubmissions.find(s => s.id === submissionId);
  if (!submission) {
    return res.status(404).json({ success: false, message: 'Entrega no encontrada' });
  }

  const { notaFinal, retroalimentacion, docenteNombre = 'Docente Evaluador', respuestasPuntajes } = req.body;

  if (respuestasPuntajes && Array.isArray(respuestasPuntajes)) {
    respuestasPuntajes.forEach(rp => {
      const resp = submission.respuestas.find(r => r.preguntaId === rp.preguntaId);
      if (resp) {
        resp.puntajeObtenido = parseFloat(rp.puntajeObtenido) || 0;
      }
    });
  }

  submission.calificacionTotal = parseFloat(notaFinal) || 5.0;
  submission.retroalimentacionDocente = cleanServerText(retroalimentacion || 'Parcial revisado y calificado.');
  submission.docenteEvaluador = cleanServerText(docenteNombre);
  submission.fechaCalificacion = new Date().toISOString();
  submission.estado = 'CALIFICADO';

  res.json({
    success: true,
    message: 'Parcial calificado exitosamente',
    submission
  });
});

// =============================================================================
// MÓDULO SOCIALSCHOOL (RED SOCIAL INSTITUCIONAL PARA TODOS LOS ROLES)
// =============================================================================

let memorySocialStories = [
  {
    id: 1,
    autorId: 3,
    autorNombre: 'Carlos Administrador',
    autorRol: 'RECTOR',
    autorAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
    titulo: 'Inauguración Semana de la Ciencia',
    texto: 'Bienvenidos a la Feria de Innovación y Robótica 2026 en el Auditorio Central.',
    imagenUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80',
    gradiente: 'from-amber-700 to-amber-950',
    fecha: '2026-09-12T08:00:00.000Z'
  },
  {
    id: 2,
    autorId: 2,
    autorNombre: 'Dra. Valentina Ríos',
    autorRol: 'DOCENTE',
    autorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    titulo: 'Muestras de Laboratorio 3D',
    texto: 'Felicito a los alumnos de 10° por sus análisis morfológicos de alta precisión.',
    imagenUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&auto=format&fit=crop&q=80',
    gradiente: 'from-blue-700 to-indigo-950',
    fecha: '2026-09-12T09:30:00.000Z'
  },
  {
    id: 3,
    autorId: 1,
    autorNombre: 'Mateo Gómez',
    autorRol: 'ESTUDIANTE',
    autorAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    titulo: 'Preparando el Parcial de Matemáticas',
    texto: 'Grupo de estudio activo en la biblioteca virtual repasando vectores tridimensionales.',
    imagenUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80',
    gradiente: 'from-emerald-700 to-teal-950',
    fecha: '2026-09-12T11:00:00.000Z'
  }
];

let memorySocialPosts = [
  {
    id: 1,
    autorId: 3,
    autorNombre: 'Carlos Administrador',
    autorRol: 'RECTOR',
    autorAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
    grado: 'Rectoría Institucional',
    categoria: 'INSTITUCIONAL',
    contenido: 'Comunidad educativa: Nos complace anunciar la apertura formal del periodo de evaluaciones bimestrales y los talleres preparatorios en laboratorios interactivos. Exhortamos a docentes y estudiantes a mantener la excelencia académica y la puntualidad.',
    imagenUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1000&auto=format&fit=crop&q=80',
    fecha: '2026-09-12T08:30:00.000Z',
    reacciones: {
      meGusta: [1, 2],
      aplausos: [1, 2],
      inspirador: [2],
      innovador: [1]
    },
    comentarios: [
      {
        id: 1,
        autorId: 2,
        autorNombre: 'Dra. Valentina Ríos',
        autorRol: 'DOCENTE',
        autorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        contenido: 'Todo el equipo docente está listo para acompañar a los estudiantes en sus evaluaciones.',
        fecha: '2026-09-12T09:00:00.000Z'
      },
      {
        id: 2,
        autorId: 1,
        autorNombre: 'Mateo Gómez',
        autorRol: 'ESTUDIANTE',
        autorAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
        contenido: 'Muchas gracias Rector, listos para los parciales.',
        fecha: '2026-09-12T09:15:00.000Z'
      }
    ]
  },
  {
    id: 2,
    autorId: 2,
    autorNombre: 'Dra. Valentina Ríos',
    autorRol: 'DOCENTE',
    autorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    grado: 'Docente de Ciencias Naturales',
    categoria: 'CIENCIA_3D',
    contenido: 'Gran jornada en el laboratorio inmersivo con grado 10°. Los alumnos lograron mapear con éxito la cutícula celular del frailejón andino. No olviden revisar el módulo de Evaluaciones para su examen asignado.',
    imagenUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1000&auto=format&fit=crop&q=80',
    fecha: '2026-09-12T10:15:00.000Z',
    reacciones: {
      meGusta: [1, 3],
      aplausos: [1, 3],
      inspirador: [1],
      innovador: [1, 3]
    },
    comentarios: [
      {
        id: 3,
        autorId: 1,
        autorNombre: 'Mateo Gómez',
        autorRol: 'ESTUDIANTE',
        autorAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
        contenido: 'La observación celular estuvo excelente profesora.',
        fecha: '2026-09-12T10:45:00.000Z'
      }
    ]
  },
  {
    id: 3,
    autorId: 1,
    autorNombre: 'Mateo Gómez',
    autorRol: 'ESTUDIANTE',
    autorAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    grado: '10° A',
    categoria: 'ACADEMICO',
    contenido: 'Terminamos de estructurar el proyecto de trigonometría y cálculo vectorial con el grupo de estudio. Listos para enviar el parcial en cuanto abra la plataforma.',
    imagenUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1000&auto=format&fit=crop&q=80',
    fecha: '2026-09-12T12:00:00.000Z',
    reacciones: {
      meGusta: [2, 3],
      aplausos: [2],
      inspirador: [3],
      innovador: [2]
    },
    comentarios: []
  }
];

// Obtener feed de publicaciones
app.get('/api/social/posts', (req, res) => {
  res.json({ success: true, posts: memorySocialPosts });
});

// Crear nueva publicación en SocialSchool
app.post('/api/social/posts', (req, res) => {
  const {
    autorId = 1,
    autorNombre = 'Usuario SocialSchool',
    autorRol = 'ESTUDIANTE',
    autorAvatar = '',
    grado = '',
    contenido,
    categoria = 'EVENTO',
    imagenUrl = ''
  } = req.body;

  if (!contenido || !contenido.trim()) {
    return res.status(400).json({ success: false, message: 'El contenido de la publicación no puede estar vacío' });
  }

  const newPost = {
    id: Date.now(),
    autorId: parseInt(autorId),
    autorNombre: cleanServerText(autorNombre),
    autorRol: cleanServerText(autorRol),
    autorAvatar: autorAvatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    grado: cleanServerText(grado),
    categoria: cleanServerText(categoria),
    contenido: cleanServerText(contenido),
    imagenUrl: imagenUrl || '',
    fecha: new Date().toISOString(),
    reacciones: {
      meGusta: [],
      aplausos: [],
      inspirador: [],
      innovador: []
    },
    comentarios: []
  };

  memorySocialPosts.unshift(newPost);
  saveSocialStateToDisk();
  res.json({ success: true, message: 'Publicación compartida exitosamente en SocialSchool', post: newPost });
});

// Alternar reacción en una publicación (Me gusta, Aplausos, Inspirador, Innovador)
app.post('/api/social/posts/:id/react', (req, res) => {
  const postId = parseInt(req.params.id);
  const { userId = 1, tipo = 'meGusta' } = req.body;

  const post = memorySocialPosts.find(p => p.id === postId);
  if (!post) {
    return res.status(404).json({ success: false, message: 'Publicación no encontrada' });
  }

  if (!post.reacciones) {
    post.reacciones = { meGusta: [], aplausos: [], inspirador: [], innovador: [] };
  }
  if (!post.reacciones[tipo]) {
    post.reacciones[tipo] = [];
  }

  const uId = parseInt(userId);
  const index = post.reacciones[tipo].indexOf(uId);
  let active = false;

  if (index > -1) {
    post.reacciones[tipo].splice(index, 1);
    active = false;
  } else {
    post.reacciones[tipo].push(uId);
    active = true;
  }

  saveSocialStateToDisk();
  res.json({ success: true, post, active, tipo, totalReacciones: post.reacciones[tipo].length });
});

// Comentar en una publicación
app.post('/api/social/posts/:id/comment', (req, res) => {
  const postId = parseInt(req.params.id);
  const {
    autorId = 1,
    autorNombre = 'Usuario',
    autorRol = 'ESTUDIANTE',
    autorAvatar = '',
    contenido
  } = req.body;

  if (!contenido || !contenido.trim()) {
    return res.status(400).json({ success: false, message: 'El comentario no puede estar vacío' });
  }

  const post = memorySocialPosts.find(p => p.id === postId);
  if (!post) {
    return res.status(404).json({ success: false, message: 'Publicación no encontrada' });
  }

  const newComment = {
    id: Date.now(),
    autorId: parseInt(autorId),
    autorNombre: cleanServerText(autorNombre),
    autorRol: cleanServerText(autorRol),
    autorAvatar: autorAvatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    contenido: cleanServerText(contenido),
    fecha: new Date().toISOString()
  };

  post.comentarios.push(newComment);
  saveSocialStateToDisk();
  res.json({ success: true, message: 'Comentario agregado', comment: newComment, post });
});

// Obtener historias activas
app.get('/api/social/stories', (req, res) => {
  res.json({ success: true, stories: memorySocialStories });
});

// Crear nueva historia
app.post('/api/social/stories', (req, res) => {
  const {
    autorId = 1,
    autorNombre = 'Usuario',
    autorRol = 'ESTUDIANTE',
    autorAvatar = '',
    titulo = 'Historia Escolar',
    texto = '',
    imagenUrl = '',
    gradiente = 'from-primary to-amber-900'
  } = req.body;

  const newStory = {
    id: Date.now(),
    autorId: parseInt(autorId),
    autorNombre: cleanServerText(autorNombre),
    autorRol: cleanServerText(autorRol),
    autorAvatar: autorAvatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    titulo: cleanServerText(titulo),
    texto: cleanServerText(texto),
    imagenUrl: imagenUrl || '',
    gradiente: gradiente || 'from-primary to-amber-900',
    fecha: new Date().toISOString()
  };

  memorySocialStories.unshift(newStory);
  saveSocialStateToDisk();
  res.json({ success: true, message: 'Historia publicada con éxito en SocialSchool', story: newStory });
});

// =============================================================================
// MÓDULO DE REELS EDUCATIVOS (INSTAGRAM REELS ESCOLAR)
// =============================================================================
let memorySocialReels = [
  {
    id: 1,
    autorId: 2,
    autorNombre: 'Dra. Valentina Ríos',
    autorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    autorRol: 'DOCENTE',
    grado: 'Ciencias Naturales',
    descripcion: 'Reacción química con catalizador en el laboratorio escolar. Observen la cristalización instantánea de la solución sobresaturada.',
    tags: ['#Química', '#Ciencia', '#Experimento', '#Laboratorio'],
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&auto=format&fit=crop&q=80',
    audioTrack: 'Sonido Original - Laboratorio de Ciencias EduCol',
    likes: [1, 2, 3],
    comentarios: [
      {
        id: 1,
        autorId: 1,
        autorNombre: 'Mateo Gómez',
        autorAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
        texto: 'Increíble cómo se formó la estructura cristalina en segundos.',
        fecha: '2026-09-12T10:00:00.000Z'
      }
    ]
  },
  {
    id: 2,
    autorId: 4,
    autorNombre: 'Ing. Alejandro Torres',
    autorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    autorRol: 'DOCENTE',
    grado: 'Robótica y Mecatrónica',
    descripcion: 'Calibración de servomotores y cinemática en el brazo robótico del colegio. Proyecto listo para la gran feria tecnológica.',
    tags: ['#Robótica', '#Ingeniería', '#Arduino', '#Tecnología'],
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=800&auto=format&fit=crop&q=80',
    audioTrack: 'Música Institucional - Innovación & Robótica',
    likes: [1, 102],
    comentarios: [
      {
        id: 2,
        autorId: 102,
        autorNombre: 'Sofía Rodríguez',
        autorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        texto: 'El sensor ultrasónico quedó perfectamente programado.',
        fecha: '2026-09-12T11:15:00.000Z'
      }
    ]
  },
  {
    id: 3,
    autorId: 102,
    autorNombre: 'Sofía Rodríguez',
    autorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    autorRol: 'ESTUDIANTE',
    grado: '10° B',
    descripcion: 'Exposición sobre el ecosistema de páramo y el frailejón andino. Trabajo de investigación y conservación ambiental.',
    tags: ['#Biología', '#Ecosistemas', '#Páramo', '#MedioAmbiente'],
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=800&auto=format&fit=crop&q=80',
    audioTrack: 'Audio Ambiental - Naturaleza & Biodiversidad',
    likes: [1, 2],
    comentarios: []
  }
];

// Obtener todos los reels
app.get('/api/social/reels', (req, res) => {
  res.json({ success: true, reels: memorySocialReels });
});

// Dar / quitar like a un reel
app.post('/api/social/reels/:id/like', (req, res) => {
  const reelId = parseInt(req.params.id);
  const { userId = 1 } = req.body;
  const reel = memorySocialReels.find(r => r.id === reelId);
  if (!reel) {
    return res.status(404).json({ success: false, message: 'Reel no encontrado' });
  }

  const uId = parseInt(userId);
  const hasLiked = reel.likes.includes(uId);
  if (hasLiked) {
    reel.likes = reel.likes.filter(id => id !== uId);
  } else {
    reel.likes.push(uId);
  }

  saveSocialStateToDisk();
  res.json({ success: true, likes: reel.likes, hasLiked: !hasLiked });
});

// Agregar comentario a un reel
app.post('/api/social/reels/:id/comment', (req, res) => {
  const reelId = parseInt(req.params.id);
  const { autorId = 1, autorNombre = 'Usuario', autorAvatar = '', texto = '' } = req.body;
  if (!texto.trim()) {
    return res.status(400).json({ success: false, message: 'El comentario no puede estar vacío' });
  }

  const reel = memorySocialReels.find(r => r.id === reelId);
  if (!reel) {
    return res.status(404).json({ success: false, message: 'Reel no encontrado' });
  }

  const newComm = {
    id: Date.now(),
    autorId: parseInt(autorId),
    autorNombre: cleanServerText(autorNombre),
    autorAvatar: autorAvatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    texto: cleanServerText(texto),
    fecha: new Date().toISOString()
  };

  reel.comentarios.push(newComm);
  saveSocialStateToDisk();
  res.json({ success: true, comment: newComm, comentarios: reel.comentarios });
});

// Obtener actividad de reacciones y comentarios para un usuario
app.get('/api/social/activity/:userId', (req, res) => {
  const userId = parseInt(req.params.userId);
  const activities = [];

  // Recorrer posts del usuario para recopilar interacciones
  memorySocialPosts.forEach(post => {
    if (post.autorId === userId) {
      // Reacciones
      if (post.reacciones) {
        Object.keys(post.reacciones).forEach(tipo => {
          (post.reacciones[tipo] || []).forEach(reactorId => {
            if (reactorId !== userId) {
              const reactorName = reactorId === 2 ? 'Dra. Valentina Ríos' : reactorId === 3 ? 'Carlos Administrador' : reactorId === 4 ? 'Ing. Alejandro Torres' : 'Sofía Rodríguez';
              const reactorAvatar = reactorId === 2 ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80' : reactorId === 3 ? 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80' : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
              const reactorRole = reactorId === 2 || reactorId === 4 ? 'DOCENTE' : reactorId === 3 ? 'RECTOR' : 'ESTUDIANTE';

              activities.push({
                id: `react-${post.id}-${tipo}-${reactorId}`,
                tipo: 'REACCION',
                tipoReaccion: tipo,
                autorNombre: reactorName,
                autorAvatar: reactorAvatar,
                autorRol: reactorRole,
                postId: post.id,
                postPreview: post.contenido.substring(0, 60) + '...',
                postImagen: post.imagenUrl || '',
                fecha: post.fecha
              });
            }
          });
        });
      }

      // Comentarios
      (post.comentarios || []).forEach(comm => {
        if (comm.autorId !== userId) {
          activities.push({
            id: `comm-${comm.id}`,
            tipo: 'COMENTARIO',
            autorNombre: comm.autorNombre,
            autorAvatar: comm.autorAvatar,
            autorRol: comm.autorRol,
            postId: post.id,
            comentarioTexto: comm.contenido,
            postPreview: post.contenido.substring(0, 60) + '...',
            postImagen: post.imagenUrl || '',
            fecha: comm.fecha
          });
        }
      });
    }
  });

  // Actividades destacadas adicionales de la comunidad
  activities.push(
    {
      id: 'act-sample-1',
      tipo: 'REACCION',
      tipoReaccion: 'meGusta',
      autorNombre: 'Sofía Rodríguez',
      autorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      autorRol: 'ESTUDIANTE',
      postId: 3,
      postPreview: 'Terminamos de estructurar el proyecto de trigonometría...',
      postImagen: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1000&auto=format&fit=crop&q=80',
      fecha: '2026-09-12T14:10:00.000Z'
    },
    {
      id: 'act-sample-2',
      tipo: 'COMENTARIO',
      autorNombre: 'Dra. Valentina Ríos',
      autorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      autorRol: 'DOCENTE',
      postId: 3,
      comentarioTexto: 'Excelente dedicación en el informe. Muy buen rigor académico.',
      postPreview: 'Terminamos de estructurar el proyecto de trigonometría...',
      postImagen: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1000&auto=format&fit=crop&q=80',
      fecha: '2026-09-12T14:25:00.000Z'
    }
  );

  res.json({ success: true, activities });
});

// Elementos guardados (Reels y Publicaciones) estrictamente aislados por usuario
const memoryUserSavedItems = {};

app.get('/api/social/saved/:userId', (req, res) => {
  const userId = String(req.params.userId);
  res.json({ success: true, savedIds: memoryUserSavedItems[userId] || [] });
});

app.post('/api/social/saved/:userId', (req, res) => {
  const userId = String(req.params.userId);
  const { savedIds } = req.body;
  if (Array.isArray(savedIds)) {
    memoryUserSavedItems[userId] = savedIds;
  }
  saveSocialStateToDisk();
  res.json({ success: true, savedIds: memoryUserSavedItems[userId] || [] });
});

// =============================================================================
// MÓDULO DE CHAT INSTITUCIONAL EN TIEMPO REAL (100% OPERATIVO)
// =============================================================================

let memoryChatConversations = [
  {
    id: 1,
    tipo: 'GRUPO',
    nombre: 'Grupo 10° A - Curso Oficial',
    avatar: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=150&auto=format&fit=crop&q=80',
    rol: 'GRUPO',
    participantes: [1, 2, 3, 102, 103, 104],
    ultimoMensaje: 'Recuerden revisar el módulo de Evaluaciones antes del viernes.',
    ultimaFecha: '2026-09-12T14:30:00.000Z',
    noLeidos: 2,
    enLinea: true
  },
  {
    id: 2,
    tipo: 'DIRECTO',
    nombre: 'Dra. Valentina Ríos',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    rol: 'DOCENTE',
    participantes: [1, 2],
    ultimoMensaje: 'Excelente trabajo en el informe celular de biología. Sigue así.',
    ultimaFecha: '2026-09-12T13:45:00.000Z',
    noLeidos: 0,
    enLinea: true
  },
  {
    id: 3,
    tipo: 'DIRECTO',
    nombre: 'Ing. Alejandro Torres',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    rol: 'DOCENTE',
    participantes: [1, 4],
    ultimoMensaje: 'El parcial de vectores en R3 ya está disponible en la plataforma.',
    ultimaFecha: '2026-09-12T11:20:00.000Z',
    noLeidos: 0,
    enLinea: false
  },
  {
    id: 4,
    tipo: 'DIRECTO',
    nombre: 'Carlos Administrador (Rectoría)',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
    rol: 'RECTOR',
    participantes: [1, 3],
    ultimoMensaje: 'Atento saludo comunidad. La feria de ciencias se llevará a cabo el próximo mes.',
    ultimaFecha: '2026-09-11T16:00:00.000Z',
    noLeidos: 0,
    enLinea: true
  },
  {
    id: 5,
    tipo: 'DIRECTO',
    nombre: 'Sofía Rodríguez',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    rol: 'ESTUDIANTE',
    participantes: [1, 102],
    ultimoMensaje: 'Hola Mateo, ¿vamos a repasar juntos los ejercicios de matemáticas hoy?',
    ultimaFecha: '2026-09-12T15:00:00.000Z',
    noLeidos: 0,
    enLinea: true
  }
];

let memoryChatMessages = {
  1: [
    {
      id: 1001,
      convId: 1,
      emisorId: 2,
      emisorNombre: 'Dra. Valentina Ríos',
      emisorRol: 'DOCENTE',
      emisorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      texto: 'Estimados estudiantes de 10° A: Sean bienvenidos al canal oficial de comunicación.',
      fecha: '2026-09-12T09:00:00.000Z'
    },
    {
      id: 1002,
      convId: 1,
      emisorId: 102,
      emisorNombre: 'Sofía Rodríguez',
      emisorRol: 'ESTUDIANTE',
      emisorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      texto: 'Buenos días profesora. ¿Los parciales tendrán tiempo límite asignado en la plataforma?',
      fecha: '2026-09-12T09:15:00.000Z'
    },
    {
      id: 1003,
      convId: 1,
      emisorId: 2,
      emisorNombre: 'Dra. Valentina Ríos',
      emisorRol: 'DOCENTE',
      emisorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      texto: 'Sí, cada evaluación cuenta con su cronómetro en vivo y al terminar deben presionar Enviar parcial.',
      fecha: '2026-09-12T09:20:00.000Z'
    },
    {
      id: 1004,
      convId: 1,
      emisorId: 2,
      emisorNombre: 'Dra. Valentina Ríos',
      emisorRol: 'DOCENTE',
      emisorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      texto: 'Recuerden revisar el módulo de Evaluaciones antes del viernes.',
      fecha: '2026-09-12T14:30:00.000Z'
    }
  ],
  2: [
    {
      id: 2001,
      convId: 2,
      emisorId: 1,
      emisorNombre: 'Mateo Gómez',
      emisorRol: 'ESTUDIANTE',
      emisorAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
      texto: 'Buenas tardes profesora Valentina, envié mi informe sobre la flora de páramo.',
      fecha: '2026-09-12T13:30:00.000Z'
    },
    {
      id: 2002,
      convId: 2,
      emisorId: 2,
      emisorNombre: 'Dra. Valentina Ríos',
      emisorRol: 'DOCENTE',
      emisorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      texto: 'Excelente trabajo en el informe celular de biología. Sigue así.',
      fecha: '2026-09-12T13:45:00.000Z'
    }
  ],
  3: [
    {
      id: 3001,
      convId: 3,
      emisorId: 4,
      emisorNombre: 'Ing. Alejandro Torres',
      emisorRol: 'DOCENTE',
      emisorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      texto: 'El parcial de vectores en R3 ya está disponible en la plataforma.',
      fecha: '2026-09-12T11:20:00.000Z'
    }
  ],
  4: [
    {
      id: 4001,
      convId: 4,
      emisorId: 3,
      emisorNombre: 'Carlos Administrador (Rectoría)',
      emisorRol: 'RECTOR',
      emisorAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
      texto: 'Atento saludo comunidad. La feria de ciencias se llevará a cabo el próximo mes.',
      fecha: '2026-09-11T16:00:00.000Z'
    }
  ],
  5: [
    {
      id: 5001,
      convId: 5,
      emisorId: 102,
      emisorNombre: 'Sofía Rodríguez',
      emisorRol: 'ESTUDIANTE',
      emisorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      texto: 'Hola Mateo, ¿vamos a repasar juntos los ejercicios de matemáticas hoy?',
      fecha: '2026-09-12T15:00:00.000Z'
    }
  ]
};

// Archivo de persistencia en disco para publicaciones, reels, comentarios y chats
const SOCIAL_DATA_FILE = path.join(__dirname, 'social_state.json');

function saveSocialStateToDisk() {
  try {
    const data = {
      posts: memorySocialPosts,
      stories: memorySocialStories,
      reels: memorySocialReels,
      savedItems: memoryUserSavedItems,
      conversations: memoryChatConversations,
      messages: memoryChatMessages
    };
    fs.writeFileSync(SOCIAL_DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (e) {
    console.warn('[Persistence] Error guardando estado social en disco:', e.message);
  }
}

function loadSocialStateFromDisk() {
  try {
    if (fs.existsSync(SOCIAL_DATA_FILE)) {
      const raw = fs.readFileSync(SOCIAL_DATA_FILE, 'utf8');
      const data = JSON.parse(raw);
      if (Array.isArray(data.posts) && data.posts.length > 0) memorySocialPosts = data.posts;
      if (Array.isArray(data.stories) && data.stories.length > 0) memorySocialStories = data.stories;
      if (Array.isArray(data.reels) && data.reels.length > 0) memorySocialReels = data.reels;
      if (data.savedItems) Object.assign(memoryUserSavedItems, data.savedItems);
      if (Array.isArray(data.conversations) && data.conversations.length > 0) memoryChatConversations = data.conversations;
      if (data.messages) Object.assign(memoryChatMessages, data.messages);
      console.log('[Persistence] Datos sociales y de chat cargados exitosamente desde disco.');
    }
  } catch (e) {
    console.warn('[Persistence] Error cargando estado social desde disco:', e.message);
  }
}

loadSocialStateFromDisk();

// Marcar todas las conversaciones como leídas
app.put('/api/chat/conversations/read-all', (req, res) => {
  memoryChatConversations.forEach(c => {
    c.noLeidos = 0;
  });
  res.json({ success: true, message: 'Todas las conversaciones marcadas como leídas' });
});

// Marcar conversación individual como leída (resetear noLeidos)
app.put('/api/chat/conversations/:convId/read', (req, res) => {
  const convId = parseInt(req.params.convId);
  const conv = memoryChatConversations.find(c => c.id === convId);
  if (conv) {
    conv.noLeidos = 0;
    res.json({ success: true, message: 'Conversación marcada como leída' });
  } else {
    res.status(404).json({ success: false, message: 'Conversación no encontrada' });
  }
});

// Listar conversaciones de chat
app.get('/api/chat/conversations', (req, res) => {
  res.json({ success: true, conversations: memoryChatConversations });
});

// Obtener mensajes de una conversación específica
app.get('/api/chat/messages/:convId', (req, res) => {
  const convId = parseInt(req.params.convId);
  const messages = memoryChatMessages[convId] || [];
  res.json({ success: true, messages });
});

// Enviar nuevo mensaje a una conversación
app.post('/api/chat/messages/:convId', (req, res) => {
  const convId = parseInt(req.params.convId);
  const {
    emisorId = 1,
    emisorNombre = 'Usuario',
    emisorRol = 'ESTUDIANTE',
    emisorAvatar = '',
    texto = '',
    imagenUrl = ''
  } = req.body;

  if (!texto.trim() && !imagenUrl) {
    return res.status(400).json({ success: false, message: 'El mensaje no puede estar vacío' });
  }

  const newMsg = {
    id: Date.now(),
    convId,
    emisorId: parseInt(emisorId),
    emisorNombre: cleanServerText(emisorNombre),
    emisorRol: cleanServerText(emisorRol),
    emisorAvatar: emisorAvatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    texto: cleanServerText(texto),
    imagenUrl: imagenUrl || '',
    fecha: new Date().toISOString()
  };

  if (!memoryChatMessages[convId]) {
    memoryChatMessages[convId] = [];
  }
  memoryChatMessages[convId].push(newMsg);

  // Actualizar último mensaje de la conversación y marcar no leído
  const conv = memoryChatConversations.find(c => c.id === convId);
  if (conv) {
    conv.ultimoMensaje = newMsg.texto || 'Archivo adjunto compartido';
    conv.ultimaFecha = newMsg.fecha;
    conv.noLeidos = (conv.noLeidos || 0) + 1;
  }

  saveSocialStateToDisk();
  res.json({ success: true, message: newMsg });
});

// Crear o iniciar una nueva conversación
app.post('/api/chat/conversations', (req, res) => {
  const { nombre, avatar, rol, participanteId, tipo = 'DIRECTO' } = req.body;
  const newConv = {
    id: Date.now(),
    tipo,
    nombre: cleanServerText(nombre || 'Nuevo Chat'),
    avatar: avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    rol: rol || 'ESTUDIANTE',
    participantes: [1, parseInt(participanteId) || 2],
    ultimoMensaje: 'Conversación iniciada',
    ultimaFecha: new Date().toISOString(),
    noLeidos: 0,
    enLinea: true
  };

  memoryChatConversations.unshift(newConv);
  memoryChatMessages[newConv.id] = [];
  res.json({ success: true, conversation: newConv });
});

// Servir frontend compilado en producción si la carpeta dist existe
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`[API Server] EduColombia API Server running on port ${PORT}`);
  console.log(`[API Base] Endpoint: http://localhost:${PORT}/api`);
  console.log(`=======================================================`);
});

