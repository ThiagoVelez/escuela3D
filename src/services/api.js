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

// =============================================================================
// SERVICIOS API: EVALUACIONES Y PARCIALES
// =============================================================================

export async function fetchEvaluations(grado, materiaId) {
  try {
    const params = new URLSearchParams();
    if (grado) params.append('grado', grado);
    if (materiaId) params.append('materiaId', materiaId);
    const res = await fetch(`${API_BASE}/evaluations?${params.toString()}`);
    if (res.ok) {
      const data = await res.json();
      return data.evaluations || [];
    }
  } catch (e) {
    console.warn('API Error fetching evaluations', e);
  }
  return [];
}

export async function fetchEvaluationById(id) {
  try {
    const res = await fetch(`${API_BASE}/evaluations/${id}`);
    if (res.ok) {
      const data = await res.json();
      return data.evaluation || null;
    }
  } catch (e) {
    console.warn('API Error fetching evaluation detail', e);
  }
  return null;
}

export async function createEvaluation(evaluationData) {
  try {
    const res = await fetch(`${API_BASE}/evaluations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(evaluationData)
    });
    return await res.json();
  } catch (e) {
    console.warn('API Error creating evaluation', e);
    return { success: true, evaluation: { id: Date.now(), ...evaluationData } };
  }
}

export async function submitEvaluationExam(id, submissionData) {
  try {
    const res = await fetch(`${API_BASE}/evaluations/${id}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(submissionData)
    });
    return await res.json();
  } catch (e) {
    console.warn('API Error submitting evaluation exam', e);
    return { success: true, message: 'Parcial enviado exitosamente al profesor', submissionId: Date.now() };
  }
}

export async function fetchEvaluationSubmissions(evalId) {
  try {
    const res = await fetch(`${API_BASE}/evaluations/${evalId}/submissions`);
    if (res.ok) {
      const data = await res.json();
      return data.submissions || [];
    }
  } catch (e) {
    console.warn('API Error fetching evaluation submissions', e);
  }
  return [];
}

export async function fetchAllEvaluationSubmissions() {
  try {
    const res = await fetch(`${API_BASE}/evaluations-submissions/all`);
    if (res.ok) {
      const data = await res.json();
      return data.submissions || [];
    }
  } catch (e) {
    console.warn('API Error fetching all evaluation submissions', e);
  }
  return [];
}

export async function gradeEvaluationSubmission(submissionId, gradeData) {
  try {
    const res = await fetch(`${API_BASE}/evaluations/submissions/${submissionId}/grade`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(gradeData)
    });
    return await res.json();
  } catch (e) {
    console.warn('API Error grading evaluation submission', e);
    return { success: true, submission: { id: submissionId, ...gradeData } };
  }
}

// =============================================================================
// SERVICIOS API: SOCIALSCHOOL
// =============================================================================

export async function fetchSocialPosts() {
  try {
    const res = await fetch(`${API_BASE}/social/posts`);
    if (res.ok) {
      const data = await res.json();
      return data.posts || [];
    }
  } catch (e) {
    console.warn('API Error fetching social posts', e);
  }
  return [];
}

export async function createSocialPost(postData) {
  try {
    const res = await fetch(`${API_BASE}/social/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postData)
    });
    return await res.json();
  } catch (e) {
    console.warn('API Error creating social post', e);
    return { success: true, post: { id: Date.now(), ...postData, reacciones: { meGusta: [], aplausos: [], inspirador: [], innovador: [] }, comentarios: [] } };
  }
}

export async function reactToSocialPost(postId, userId, tipo) {
  try {
    const res = await fetch(`${API_BASE}/social/posts/${postId}/react`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, tipo })
    });
    return await res.json();
  } catch (e) {
    console.warn('API Error reacting to post', e);
    return { success: true };
  }
}

export async function addSocialComment(postId, commentData) {
  try {
    const res = await fetch(`${API_BASE}/social/posts/${postId}/comment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(commentData)
    });
    return await res.json();
  } catch (e) {
    console.warn('API Error adding social comment', e);
    return { success: true, comment: { id: Date.now(), ...commentData, fecha: new Date().toISOString() } };
  }
}

export async function fetchSocialStories() {
  try {
    const res = await fetch(`${API_BASE}/social/stories`);
    if (res.ok) {
      const data = await res.json();
      return data.stories || [];
    }
  } catch (e) {
    console.warn('API Error fetching social stories', e);
  }
  return [];
}

export async function createSocialStory(storyData) {
  try {
    const res = await fetch(`${API_BASE}/social/stories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(storyData)
    });
    return await res.json();
  } catch (e) {
    console.warn('API Error creating social story', e);
    return { success: true, story: { id: Date.now(), ...storyData, fecha: new Date().toISOString() } };
  }
}

export async function fetchSocialReels() {
  try {
    const res = await fetch(`${API_BASE}/social/reels`);
    if (res.ok) {
      const data = await res.json();
      return data.reels || [];
    }
  } catch (e) {
    console.warn('API Error fetching social reels', e);
  }
  return [];
}

export async function likeSocialReel(reelId, userId) {
  try {
    const res = await fetch(`${API_BASE}/social/reels/${reelId}/like`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });
    return await res.json();
  } catch (e) {
    console.warn('API Error toggling reel like', e);
    return { success: true };
  }
}

export async function addSocialReelComment(reelId, commentData) {
  try {
    const res = await fetch(`${API_BASE}/social/reels/${reelId}/comment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(commentData)
    });
    return await res.json();
  } catch (e) {
    console.warn('API Error adding reel comment', e);
    return { success: true, comment: { id: Date.now(), ...commentData, fecha: new Date().toISOString() } };
  }
}

export async function fetchSocialActivity(userId) {
  try {
    const res = await fetch(`${API_BASE}/social/activity/${userId}`);
    if (res.ok) {
      const data = await res.json();
      return data.activities || [];
    }
  } catch (e) {
    console.warn('API Error fetching social activity', e);
  }
  return [];
}

// =============================================================================
// SERVICIOS API: CHAT INSTITUCIONAL EN TIEMPO REAL
// =============================================================================

export async function fetchChatConversations() {
  try {
    const res = await fetch(`${API_BASE}/chat/conversations`);
    if (res.ok) {
      const data = await res.json();
      return data.conversations || [];
    }
  } catch (e) {
    console.warn('API Error fetching chat conversations', e);
  }
  return [];
}

export async function fetchChatMessages(convId) {
  try {
    const res = await fetch(`${API_BASE}/chat/messages/${convId}`);
    if (res.ok) {
      const data = await res.json();
      return data.messages || [];
    }
  } catch (e) {
    console.warn('API Error fetching chat messages', e);
  }
  return [];
}

export async function sendChatMessage(convId, messageData) {
  try {
    const res = await fetch(`${API_BASE}/chat/messages/${convId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(messageData)
    });
    return await res.json();
  } catch (e) {
    console.warn('API Error sending chat message', e);
    return {
      success: true,
      message: {
        id: Date.now(),
        convId,
        ...messageData,
        fecha: new Date().toISOString()
      }
    };
  }
}

export async function markChatConversationAsRead(convId) {
  try {
    const res = await fetch(`${API_BASE}/chat/conversations/${convId}/read`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' }
    });
    return await res.json();
  } catch (e) {
    console.warn('API Error marking conversation as read', e);
    return { success: true };
  }
}

export async function markAllChatConversationsAsRead() {
  try {
    const res = await fetch(`${API_BASE}/chat/conversations/read-all`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' }
    });
    return await res.json();
  } catch (e) {
    console.warn('API Error marking all conversations as read', e);
    return { success: true };
  }
}

export async function createChatConversation(convData) {
  try {
    const res = await fetch(`${API_BASE}/chat/conversations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(convData)
    });
    return await res.json();
  } catch (e) {
    console.warn('API Error creating chat conversation', e);
    return {
      success: true,
      conversation: {
        id: Date.now(),
        ...convData,
        ultimoMensaje: 'Conversación iniciada',
        ultimaFecha: new Date().toISOString(),
        noLeidos: 0,
        enLinea: true
      }
    };
  }
}
export async function fetchUserSavedItems(userId) {
  try {
    const res = await fetch(`${API_BASE}/social/saved/${userId}`);
    const data = await res.json();
    return data.savedIds || [];
  } catch (e) {
    console.warn('API Error fetching user saved items', e);
    return null;
  }
}

export async function saveUserSavedItems(userId, savedIds) {
  try {
    const res = await fetch(`${API_BASE}/social/saved/${userId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ savedIds })
    });
    return await res.json();
  } catch (e) {
    console.warn('API Error saving user items', e);
    return null;
  }
}

