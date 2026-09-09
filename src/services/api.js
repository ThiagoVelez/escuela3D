const API_BASE = 'http://localhost:5000/api';

export async function fetchHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`);
    return await res.json();
  } catch (e) {
    return { status: 'OFFLINE' };
  }
}

export async function loginUser(email, password) {
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    return data.user;
  } catch (e) {
    console.warn('API Error, using fallback user login data', e);
    return null;
  }
}

export async function fetchSubjects() {
  try {
    const res = await fetch(`${API_BASE}/subjects`);
    const data = await res.json();
    return data.subjects;
  } catch (e) {
    console.warn('API Error, using fallback subjects data', e);
    return null;
  }
}

export async function fetchGrades() {
  try {
    const res = await fetch(`${API_BASE}/grades`);
    const data = await res.json();
    return data.grades;
  } catch (e) {
    console.warn('API Error, using fallback grades data', e);
    return null;
  }
}

export async function submitLabEntry(labId, simulationData) {
  try {
    const res = await fetch(`${API_BASE}/labs/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ labId, simulationData })
    });
    return await res.json();
  } catch (e) {
    return { success: true, xpGained: 150 };
  }
}

export async function registerRector(rectorData) {
  try {
    const res = await fetch(`${API_BASE}/auth/register-rector`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rectorData)
    });
    return await res.json();
  } catch (e) {
    return {
      success: true,
      user: {
        id: 99,
        nombre: `${rectorData.nombreRector} ${rectorData.apellidoRector}`,
        email: rectorData.email,
        rol: 'RECTOR',
        grado: 'Rectoría',
        institucion: rectorData.nombreInstitucion || 'Colegio Educativo 3D',
        logoInstitucion: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
        puntosExperiencia: 1000,
        nivel3D: 'Rector Principal'
      }
    };
  }
}

export async function registerStaffUser(staffData) {
  try {
    const res = await fetch(`${API_BASE}/users/staff`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(staffData)
    });
    return await res.json();
  } catch (e) {
    return {
      success: true,
      user: { id: Date.now(), ...staffData }
    };
  }
}

export async function updateUserProfile(profileData) {
  try {
    const res = await fetch(`${API_BASE}/users/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profileData)
    });
    return await res.json();
  } catch (e) {
    return { success: true, profile: profileData };
  }
}

export async function fetchUserProfile(identifier) {
  try {
    const res = await fetch(`${API_BASE}/users/profile/${encodeURIComponent(identifier)}`);
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn('Could not fetch user profile from API', e);
  }
  return null;
}

export async function fetchTeacherStudents(filters = {}) {
  try {
    const params = new URLSearchParams(filters);
    const res = await fetch(`${API_BASE}/teacher/students?${params.toString()}`);
    const data = await res.json();
    return data.students;
  } catch (e) {
    return null;
  }
}

export async function fetchAssignments(materiaId, grado) {
  try {
    const params = new URLSearchParams();
    if (materiaId) params.append('materiaId', materiaId);
    if (grado) params.append('grado', grado);
    const res = await fetch(`${API_BASE}/assignments?${params.toString()}`);
    const data = await res.json();
    return data.assignments;
  } catch (e) {
    return null;
  }
}

export async function createAssignment(assignmentData) {
  try {
    const res = await fetch(`${API_BASE}/assignments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(assignmentData)
    });
    return await res.json();
  } catch (e) {
    return { success: true, assignment: { id: Date.now(), ...assignmentData } };
  }
}

export async function submitAssignment(assignmentId, respuestaText) {
  try {
    const res = await fetch(`${API_BASE}/assignments/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ assignmentId, respuestaText })
    });
    return await res.json();
  } catch (e) {
    return { success: true, message: 'Entrega registrada en modo local' };
  }
}

export async function fetchServerTime() {
  try {
    const res = await fetch(`${API_BASE}/time`);
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn('Could not fetch server time, using client clock as fallback');
  }
  const now = new Date();
  return {
    iso: now.toISOString(),
    timestamp: now.getTime(),
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    monthIndex: now.getMonth(),
    day: now.getDate(),
    dayOfWeek: now.getDay(),
    hours: now.getHours(),
    minutes: now.getMinutes(),
    seconds: now.getSeconds(),
    formattedDate: now.toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
    formattedTime: now.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }),
    timeZone: 'America/Bogota',
    offsetMs: 0,
    isControlled: false
  };
}

export async function controlServerTime(targetDate, resetToRealTime = false) {
  try {
    const res = await fetch(`${API_BASE}/time/control`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetDate, resetToRealTime })
    });
    return await res.json();
  } catch (e) {
    return { success: false, error: e.message };
  }
}

// INSTITUTIONAL CREST (ESCUDO DEL COLEGIO)
export async function fetchSchoolCrest() {
  try {
    const res = await fetch(`${API_BASE}/institutional/crest`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('API Error fetching crest, using fallback', e);
  }
  return {
    success: true,
    crestUrl: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=300&auto=format&fit=crop&q=80',
    institutionName: 'Institución Educativa Colombian Future',
    motto: 'Ciencia, Innovación & Excelencia Inmersiva'
  };
}

export async function saveSchoolCrest(data) {
  try {
    const res = await fetch(`${API_BASE}/institutional/crest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  } catch (e) {
    return { success: true, settings: data };
  }
}

// MANUAL DE CONVIVENCIA
export async function fetchHandbook() {
  try {
    const res = await fetch(`${API_BASE}/institutional/handbook`);
    if (res.ok) {
      const data = await res.json();
      return data.handbook;
    }
  } catch (e) {
    console.warn('API Error fetching handbook', e);
  }
  return null;
}

export async function saveHandbook(data) {
  try {
    const res = await fetch(`${API_BASE}/institutional/handbook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  } catch (e) {
    return { success: true, handbook: data };
  }
}

// JERARQUÍA INSTITUCIONAL
export async function fetchHierarchy() {
  try {
    const res = await fetch(`${API_BASE}/institutional/hierarchy`);
    if (res.ok) {
      const data = await res.json();
      return data.hierarchy;
    }
  } catch (e) {
    console.warn('API Error fetching hierarchy', e);
  }
  return null;
}

// ENTREGAS & CORREO DE TAREAS (CALIFICACIONES)
export async function fetchSubmissions(filters = {}) {
  try {
    const params = new URLSearchParams();
    if (filters.grado && filters.grado !== 'Todos') params.append('grado', filters.grado);
    if (filters.materiaId && filters.materiaId !== 'Todas') params.append('materiaId', filters.materiaId);
    if (filters.estado && filters.estado !== 'TODOS') params.append('estado', filters.estado);
    if (filters.estudianteId) params.append('estudianteId', filters.estudianteId);

    const res = await fetch(`${API_BASE}/submissions?${params.toString()}`);
    if (res.ok) {
      const data = await res.json();
      return data.submissions;
    }
  } catch (e) {
    console.warn('API Error fetching submissions', e);
  }
  return [];
}

export async function submitHomework(submissionData) {
  try {
    const res = await fetch(`${API_BASE}/submissions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(submissionData)
    });
    return await res.json();
  } catch (e) {
    return {
      success: true,
      submission: { id: Date.now(), ...submissionData, estado: 'PENDIENTE', fechaEntrega: new Date().toISOString() }
    };
  }
}

export async function gradeSubmission(id, gradeData) {
  try {
    const res = await fetch(`${API_BASE}/submissions/${id}/grade`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(gradeData)
    });
    return await res.json();
  } catch (e) {
    return {
      success: true,
      submission: { id, ...gradeData, estado: 'CALIFICADO', fechaCalificacion: new Date().toISOString() }
    };
  }
}

export async function fetchStudentSubmissions(studentId) {
  try {
    const res = await fetch(`${API_BASE}/submissions/student/${studentId}`);
    if (res.ok) {
      const data = await res.json();
      return data.submissions;
    }
  } catch (e) {
    console.warn('API Error fetching student submissions', e);
  }
  return [];
}


