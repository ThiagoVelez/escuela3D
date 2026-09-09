import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, fetchHealth, fetchSchoolCrest, saveSchoolCrest } from '../services/api';

const DEFAULT_NOTIFICATIONS = {
  ESTUDIANTE: [
    {
      id: 1,
      title: '¡Nuevo Laboratorio 3D Disponible!',
      text: 'Se ha abierto el Lab 3D de Biología: Célula de Frailejón Andino.',
      time: 'Hace 10 min',
      read: false,
      icon: 'science',
      color: 'text-primary'
    },
    {
      id: 2,
      title: 'Calificación Registrada',
      text: 'Dra. Valentina Ríos asignó 5.0 en Informe Lab Célula Vegetal.',
      time: 'Hace 2 horas',
      read: false,
      icon: 'grade',
      color: 'text-emerald-600'
    },
    {
      id: 3,
      title: 'Nueva Tarea Asignada',
      text: 'Ing. Alejandro Torres asignó Cuestionario 3D: Vectores.',
      time: 'Ayer 14:30',
      read: true,
      icon: 'assignment',
      color: 'text-amber-600'
    }
  ],
  DOCENTE: [
    {
      id: 101,
      title: 'Entrega de Tarea Recibida',
      text: 'El estudiante Mateo Gómez entregó el Taller Inmersivo de Biología 3D.',
      time: 'Hace 5 min',
      read: false,
      icon: 'upload_file',
      color: 'text-blue-600'
    },
    {
      id: 102,
      title: 'Recordatorio de Rectoría',
      text: 'Favor enviar los informes pedagógicos del periodo 2026-II.',
      time: 'Hace 1 hora',
      read: false,
      icon: 'campaign',
      color: 'text-amber-600'
    },
    {
      id: 103,
      title: 'Actualización de Sistema 3D',
      text: 'Se han cargado nuevos modelos interactivos de geometría tridimensional.',
      time: 'Ayer',
      read: true,
      icon: 'view_in_ar',
      color: 'text-purple-600'
    }
  ],
  RECTOR: [
    {
      id: 201,
      title: 'Nuevo Informe Recibido',
      text: 'El docente Lic. Carlos López envió el Informe de Asistencia 10° A.',
      time: 'Hace 15 min',
      read: false,
      icon: 'description',
      color: 'text-emerald-600'
    },
    {
      id: 202,
      title: 'Registro de Institución',
      text: 'Su colegio "Colombian Future" ha sido verificado con SNIES-88392.',
      time: 'Hace 2 horas',
      read: false,
      icon: 'verified',
      color: 'text-blue-600'
    },
    {
      id: 203,
      title: 'Resumen de Matrículas',
      text: 'El 98% del personal docente y estudiantil ha sido registrado con éxito.',
      time: 'Ayer',
      read: true,
      icon: 'groups',
      color: 'text-indigo-600'
    }
  ],
  ADMINISTRADOR: [
    {
      id: 301,
      title: 'Alerta del Sistema',
      text: 'Todos los servicios del campus institucional operan con normalidad.',
      time: 'Hace 30 min',
      read: false,
      icon: 'check_circle',
      color: 'text-emerald-600'
    }
  ]
};

const DEFAULT_SCHEDULES = {
  '10° A': [
    { id: 1, hora: '06:30 - 07:30', lunes: 'Matemáticas 3D (Ing. Alejandro)', martes: 'Biología 3D (Dra. Valentina)', miercoles: 'Matemáticas 3D (Ing. Alejandro)', jueves: 'Física 3D (Prof. Carlos)', viernes: 'Química 3D (Dra. María)' },
    { id: 2, hora: '07:30 - 08:30', lunes: 'Biología 3D (Dra. Valentina)', martes: 'Matemáticas 3D (Ing. Alejandro)', miercoles: 'Literatura (Prof. Gabriel)', jueves: 'Biología 3D (Dra. Valentina)', viernes: 'Matemáticas 3D (Ing. Alejandro)' },
    { id: 3, hora: '08:30 - 09:15', lunes: 'DESCANSO Y RECREO', martes: 'DESCANSO Y RECREO', miercoles: 'DESCANSO Y RECREO', jueves: 'DESCANSO Y RECREO', viernes: 'DESCANSO Y RECREO', isBreak: true },
    { id: 4, hora: '09:15 - 10:15', lunes: 'Literatura (Prof. Gabriel)', martes: 'Física 3D (Prof. Carlos)', miercoles: 'Biología 3D (Dra. Valentina)', jueves: 'Matemáticas 3D (Ing. Alejandro)', viernes: 'Inglés 3D (Prof. Sarah)' },
    { id: 5, hora: '10:15 - 11:15', lunes: 'Historia 3D (Prof. Fernando)', martes: 'Química 3D (Dra. María)', miercoles: 'Inglés 3D (Prof. Sarah)', jueves: 'Literatura (Prof. Gabriel)', viernes: 'Educación Física' },
    { id: 6, hora: '11:15 - 12:15', lunes: 'Informática 3D (Ing. Luis)', martes: 'Educación Física', miercoles: 'Ética y Valores', jueves: 'Informática 3D (Ing. Luis)', viernes: 'Dirección de Grupo' }
  ],
  '10° B': [
    { id: 1, hora: '06:30 - 07:30', lunes: 'Biología 3D (Dra. Valentina)', martes: 'Matemáticas 3D (Ing. Alejandro)', miercoles: 'Física 3D (Prof. Carlos)', jueves: 'Química 3D (Dra. María)', viernes: 'Literatura (Prof. Gabriel)' },
    { id: 2, hora: '07:30 - 08:30', lunes: 'Matemáticas 3D (Ing. Alejandro)', martes: 'Literatura (Prof. Gabriel)', miercoles: 'Biología 3D (Dra. Valentina)', jueves: 'Matemáticas 3D (Ing. Alejandro)', viernes: 'Biología 3D (Dra. Valentina)' },
    { id: 3, hora: '08:30 - 09:15', lunes: 'DESCANSO Y RECREO', martes: 'DESCANSO Y RECREO', miercoles: 'DESCANSO Y RECREO', jueves: 'DESCANSO Y RECREO', viernes: 'DESCANSO Y RECREO', isBreak: true },
    { id: 4, hora: '09:15 - 10:15', lunes: 'Física 3D (Prof. Carlos)', martes: 'Biología 3D (Dra. Valentina)', miercoles: 'Matemáticas 3D (Ing. Alejandro)', jueves: 'Inglés 3D (Prof. Sarah)', viernes: 'Historia 3D (Prof. Fernando)' }
  ]
};

export const DEFAULT_AVATARS = {
  ESTUDIANTE: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
  DOCENTE: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  RECTOR: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
  ADMINISTRADOR: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
};

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Per-user profile storage with localStorage persistence
  const [profileStore, setProfileStore] = useState(() => {
    try {
      const saved = localStorage.getItem('educol3d_profile_store');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {};
  });

  useEffect(() => {
    try {
      localStorage.setItem('educol3d_profile_store', JSON.stringify(profileStore));
    } catch (e) {}
  }, [profileStore]);

  // Dynamic notifications store per role with localStorage persistence
  const [notificationsStore, setNotificationsStore] = useState(() => {
    try {
      const saved = localStorage.getItem('educol3d_notifications_store');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_NOTIFICATIONS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('educol3d_notifications_store', JSON.stringify(notificationsStore));
    } catch (e) {}
  }, [notificationsStore]);

  // Dynamic schedules store per grade
  const [schedulesStore, setSchedulesStore] = useState(DEFAULT_SCHEDULES);

  const [user, setUser] = useState({
    id: 1,
    nombre: 'Mateo Gómez',
    email: 'estudiante@educol.edu.co',
    rol: 'ESTUDIANTE', // 'ESTUDIANTE', 'DOCENTE', 'RECTOR', 'ADMINISTRADOR'
    grado: '10° A',
    jornada: 'Mañana',
    institucion: 'Institución Educativa Colombian Future',
    logoInstitucion: DEFAULT_AVATARS.ESTUDIANTE,
    avatarUrl: DEFAULT_AVATARS.ESTUDIANTE,
    bannerUrl: 'banner-paramo',
    puntosExperiencia: 450,
    nivel3D: 'Explorador Avanzado'
  });
  const [activeTab, setActiveTab] = useState('subjects');
  const [selectedLab, setSelectedLab] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [serverConnected, setServerConnected] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [submissionsRefreshKey, setSubmissionsRefreshKey] = useState(0);

  // Institutional Crest global state across ALL user profiles
  const [schoolCrest, setSchoolCrest] = useState(() => {
    try {
      const saved = localStorage.getItem('educol3d_institutional_crest');
      if (saved) return saved;
    } catch (e) {}
    return 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=300&auto=format&fit=crop&q=80';
  });

  const [institutionName, setInstitutionName] = useState('Institución Educativa Colombian Future');

  useEffect(() => {
    fetchHealth().then(res => {
      if (res.status === 'OK') {
        setServerConnected(true);
      }
    });

    fetchSchoolCrest().then(res => {
      if (res && res.crestUrl) {
        setSchoolCrest(res.crestUrl);
        if (res.institutionName) setInstitutionName(res.institutionName);
        try {
          localStorage.setItem('educol3d_institutional_crest', res.crestUrl);
        } catch (e) {}
      }
    });
  }, []);

  const updateSchoolCrest = async (newCrestUrl, newName) => {
    setSchoolCrest(newCrestUrl);
    if (newName) setInstitutionName(newName);
    try {
      localStorage.setItem('educol3d_institutional_crest', newCrestUrl);
    } catch (e) {}
    await saveSchoolCrest({ crestUrl: newCrestUrl, institutionName: newName || institutionName });
  };

  const notifySubmissionsUpdated = () => {
    setSubmissionsRefreshKey(prev => prev + 1);
  };

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  // Unique identifier key per user to completely isolate custom avatars and profiles
  const getUserKey = (userData) => {
    if (!userData) return 'anon';
    if (userData.email) {
      return `user_${userData.email.toLowerCase().trim()}`;
    }
    if (userData.id) {
      return `id_${userData.id}`;
    }
    return `role_${userData.rol || 'ESTUDIANTE'}`;
  };

  const applyStoredProfile = (userData) => {
    if (!userData) return userData;
    const key = getUserKey(userData);
    const stored = profileStore[key];
    const roleDefaultAvatar = DEFAULT_AVATARS[userData.rol] || DEFAULT_AVATARS.ESTUDIANTE;
    
    // Priority:
    // 1. Explicitly stored custom avatar for this exact user/email
    // 2. Server-provided avatar (if from DB and not generic googleusercontent)
    // 3. Role's distinct default avatar
    let resolvedAvatar = roleDefaultAvatar;
    if (stored && stored.avatarUrl && !stored.avatarUrl.includes('googleusercontent')) {
      resolvedAvatar = stored.avatarUrl;
    } else if (userData.avatarUrl && !userData.avatarUrl.includes('googleusercontent')) {
      resolvedAvatar = userData.avatarUrl;
    }

    return {
      ...userData,
      avatarUrl: resolvedAvatar,
      bannerUrl: stored?.bannerUrl ?? userData.bannerUrl ?? (userData.rol === 'DOCENTE' ? 'banner-molecular' : userData.rol === 'RECTOR' ? 'banner-sol' : 'banner-paramo'),
      nombre: stored?.nombre ?? userData.nombre
    };
  };

  const getDefaultTabForRole = (rol) => {
    if (rol === 'DOCENTE') return 'teacher-panel';
    if (rol === 'RECTOR' || rol === 'ADMINISTRADOR') return 'staff-management';
    return 'subjects';
  };

  const login = async (email, password, mockRole = null) => {
    const apiUser = await loginUser(email, password);
    const assignedRole = mockRole || (apiUser ? apiUser.rol : (
      email?.toLowerCase().includes('docente') ? 'DOCENTE' :
      email?.toLowerCase().includes('admin') || email?.toLowerCase().includes('rector') ? 'RECTOR' : 'ESTUDIANTE'
    ));
    
    const roleDefaultAvatar = DEFAULT_AVATARS[assignedRole] || DEFAULT_AVATARS.ESTUDIANTE;
    
    // Construct a brand new isolated user object, NEVER inheriting properties from previous user session
    let freshUser = {
      id: apiUser?.id || (assignedRole === 'DOCENTE' ? 2 : assignedRole === 'RECTOR' ? 3 : 1),
      nombre: apiUser?.nombre || (assignedRole === 'DOCENTE' ? 'Dra. Valentina Ríos' : assignedRole === 'RECTOR' ? 'Carlos Administrador' : 'Mateo Gómez'),
      email: email || apiUser?.email || (assignedRole === 'DOCENTE' ? 'docente@educol.edu.co' : assignedRole === 'RECTOR' ? 'admin@educol.edu.co' : 'estudiante@educol.edu.co'),
      rol: assignedRole,
      grado: apiUser?.grado || (assignedRole === 'RECTOR' ? 'Rectoría Institucional' : assignedRole === 'DOCENTE' ? 'Docente de Ciencias' : '10° A'),
      jornada: apiUser?.jornada || 'Mañana',
      institucion: apiUser?.institucion || 'Institución Educativa Colombian Future',
      logoInstitucion: apiUser?.logoInstitucion || roleDefaultAvatar,
      avatarUrl: apiUser?.avatarUrl || roleDefaultAvatar,
      bannerUrl: apiUser?.bannerUrl || (assignedRole === 'DOCENTE' ? 'banner-molecular' : assignedRole === 'RECTOR' ? 'banner-sol' : 'banner-paramo'),
      puntosExperiencia: apiUser?.puntosExperiencia || (assignedRole === 'RECTOR' ? 1000 : 450),
      nivel3D: apiUser?.nivel3D || (assignedRole === 'RECTOR' ? 'Rector Institucional' : assignedRole === 'DOCENTE' ? 'Docente Experto' : 'Explorador Avanzado')
    };

    const finalUser = applyStoredProfile(freshUser);
    setUser(finalUser);
    setActiveTab(getDefaultTabForRole(assignedRole));
    setIsAuthenticated(true);
  };

  const loginAsUser = (userData) => {
    const assignedRole = userData.rol || 'ESTUDIANTE';
    const roleDefaultAvatar = DEFAULT_AVATARS[assignedRole] || DEFAULT_AVATARS.ESTUDIANTE;
    
    let freshUser = {
      id: userData.id || Date.now(),
      nombre: userData.nombre || 'Usuario Institucional',
      email: userData.email || 'usuario@educol.edu.co',
      rol: assignedRole,
      grado: userData.grado || (assignedRole === 'RECTOR' ? 'Rectoría' : assignedRole === 'DOCENTE' ? 'Docente de Ciencias' : '10° A'),
      jornada: userData.jornada || 'Mañana',
      institucion: userData.institucion || 'Institución Educativa Colombian Future',
      logoInstitucion: userData.logoInstitucion || roleDefaultAvatar,
      avatarUrl: userData.avatarUrl || roleDefaultAvatar,
      bannerUrl: userData.bannerUrl || (assignedRole === 'DOCENTE' ? 'banner-molecular' : assignedRole === 'RECTOR' ? 'banner-sol' : 'banner-paramo'),
      puntosExperiencia: userData.puntosExperiencia || (assignedRole === 'RECTOR' ? 1000 : 450),
      nivel3D: userData.nivel3D || 'Usuario Institucional',
      ...userData
    };

    const finalUser = applyStoredProfile(freshUser);
    setUser(finalUser);
    setActiveTab(getDefaultTabForRole(assignedRole));
    setIsAuthenticated(true);
  };

  const updateProfile = (updatedFields) => {
    setUser(prev => {
      if (!prev) return prev;
      const updated = { ...prev, ...updatedFields };
      const key = getUserKey(updated);
      setProfileStore(store => ({
        ...store,
        [key]: {
          ...(store[key] || {}),
          avatarUrl: updated.avatarUrl,
          bannerUrl: updated.bannerUrl,
          nombre: updated.nombre
        }
      }));
      return updated;
    });
  };

  const switchRole = (newRole) => {
    let freshPersona;
    if (newRole === 'DOCENTE') {
      freshPersona = {
        id: 2,
        nombre: 'Dra. Valentina Ríos',
        email: 'docente@educol.edu.co',
        rol: 'DOCENTE',
        grado: 'Docente de Ciencias',
        jornada: 'Mañana',
        institucion: 'Institución Educativa Colombian Future',
        logoInstitucion: DEFAULT_AVATARS.DOCENTE,
        avatarUrl: DEFAULT_AVATARS.DOCENTE,
        bannerUrl: 'banner-molecular',
        puntosExperiencia: 650,
        nivel3D: 'Docente Experto'
      };
    } else if (newRole === 'RECTOR' || newRole === 'ADMINISTRADOR') {
      freshPersona = {
        id: 3,
        nombre: 'Carlos Administrador',
        email: 'admin@educol.edu.co',
        rol: newRole,
        grado: 'Rectoría Institucional',
        jornada: 'Mañana',
        institucion: 'Institución Educativa Colombian Future',
        logoInstitucion: DEFAULT_AVATARS.RECTOR,
        avatarUrl: DEFAULT_AVATARS.RECTOR,
        bannerUrl: 'banner-sol',
        puntosExperiencia: 1000,
        nivel3D: 'Rector Institucional'
      };
    } else {
      freshPersona = {
        id: 1,
        nombre: 'Mateo Gómez',
        email: 'estudiante@educol.edu.co',
        rol: 'ESTUDIANTE',
        grado: '10° A',
        jornada: 'Mañana',
        institucion: 'Institución Educativa Colombian Future',
        logoInstitucion: DEFAULT_AVATARS.ESTUDIANTE,
        avatarUrl: DEFAULT_AVATARS.ESTUDIANTE,
        bannerUrl: 'banner-paramo',
        puntosExperiencia: 450,
        nivel3D: 'Explorador Avanzado'
      };
    }
    const finalUser = applyStoredProfile(freshPersona);
    setUser(finalUser);
    setActiveTab(getDefaultTabForRole(newRole));
  };

  const logout = () => {
    setIsAuthenticated(false);
    setSelectedLab(null);
    setUser({
      id: 1,
      nombre: 'Mateo Gómez',
      email: 'estudiante@educol.edu.co',
      rol: 'ESTUDIANTE',
      grado: '10° A',
      jornada: 'Mañana',
      institucion: 'Institución Educativa Colombian Future',
      logoInstitucion: DEFAULT_AVATARS.ESTUDIANTE,
      avatarUrl: DEFAULT_AVATARS.ESTUDIANTE,
      bannerUrl: 'banner-paramo',
      puntosExperiencia: 450,
      nivel3D: 'Explorador Avanzado'
    });
  };

  // NOTIFICATION MANAGEMENT METHODS
  const userRole = user.rol || 'ESTUDIANTE';
  const notifications = notificationsStore[userRole] || [];

  const markNotificationAsRead = (id) => {
    setNotificationsStore(prev => ({
      ...prev,
      [userRole]: (prev[userRole] || []).map(n => n.id === id ? { ...n, read: true } : n)
    }));
  };

  const markAllNotificationsAsRead = () => {
    setNotificationsStore(prev => ({
      ...prev,
      [userRole]: (prev[userRole] || []).map(n => ({ ...n, read: true }))
    }));
  };

  const deleteNotification = (id) => {
    setNotificationsStore(prev => ({
      ...prev,
      [userRole]: (prev[userRole] || []).map(n => n.id === id ? null : n).filter(Boolean)
    }));
  };

  const addNotification = ({ title, text, icon = 'notifications', color = 'text-primary', targetRole = userRole }) => {
    const newNotif = {
      id: Date.now(),
      title,
      text,
      time: 'Hace un momento',
      read: false,
      icon,
      color
    };
    setNotificationsStore(prev => ({
      ...prev,
      [targetRole]: [newNotif, ...(prev[targetRole] || [])]
    }));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  // SCHEDULE MANAGEMENT METHODS
  const getScheduleForGrade = (grado = user.grado || '10° A') => {
    return schedulesStore[grado] || DEFAULT_SCHEDULES['10° A'];
  };

  const updateScheduleForGrade = (grado, newBlocks) => {
    setSchedulesStore(prev => ({
      ...prev,
      [grado]: newBlocks
    }));

    addNotification({
      title: 'Nuevo Horario Publicado',
      text: `Rectoría ha actualizado el horario oficial de clases para ${grado}.`,
      icon: 'calendar_view_week',
      color: 'text-primary',
      targetRole: 'ESTUDIANTE'
    });
    addNotification({
      title: 'Actualización de Horario',
      text: `Rectoría ha actualizado el horario asignado para ${grado}.`,
      icon: 'calendar_view_week',
      color: 'text-primary',
      targetRole: 'DOCENTE'
    });
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      user,
      setUser,
      activeTab,
      setActiveTab,
      selectedLab,
      setSelectedLab,
      selectedSubject,
      setSelectedSubject,
      serverConnected,
      sidebarOpen,
      setSidebarOpen,
      toggleSidebar,
      login,
      loginAsUser,
      updateProfile,
      switchRole,
      logout,
      // Notifications API
      notifications,
      unreadCount,
      markNotificationAsRead,
      markAllNotificationsAsRead,
      deleteNotification,
      addNotification,
      // Schedule API
      schedulesStore,
      getScheduleForGrade,
      updateScheduleForGrade,
      // Institutional Crest & School Identity
      schoolCrest,
      institutionName,
      updateSchoolCrest,
      // Submissions Synchronization
      submissionsRefreshKey,
      notifySubmissionsUpdated
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
