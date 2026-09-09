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
