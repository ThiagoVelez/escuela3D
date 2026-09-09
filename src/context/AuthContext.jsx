import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, fetchHealth } from '../services/api';

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
      text: 'Base de datos MySQL conectada y sincrónica al 100%.',
      time: 'Hace 30 min',
      read: false,
      icon: 'dns',
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

const DEFAULT_AVATARS = {
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
    institucion: 'Colombian Future',
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

  useEffect(() => {
    fetchHealth().then(res => {
      if (res.status === 'OK') {
        setServerConnected(true);
      }
    });
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  const getUserKey = (userData) => {
    return `${userData.id || 'anon'}_${userData.email || 'noemail'}`;
  };

  const applyStoredProfile = (userData) => {
    const key = getUserKey(userData);
    const stored = profileStore[key];
    const roleDefaultAvatar = DEFAULT_AVATARS[userData.rol] || DEFAULT_AVATARS.ESTUDIANTE;
    
    let resolvedAvatar = userData.avatarUrl;
    if (!resolvedAvatar || resolvedAvatar.includes('googleusercontent')) {
      resolvedAvatar = roleDefaultAvatar;
    }

    if (stored) {
      return {
        ...userData,
        avatarUrl: stored.avatarUrl && !stored.avatarUrl.includes('googleusercontent') ? stored.avatarUrl : resolvedAvatar,
        bannerUrl: stored.bannerUrl ?? userData.bannerUrl,
        nombre: stored.nombre ?? userData.nombre
      };
    }
    return {
      ...userData,
      avatarUrl: resolvedAvatar
    };
  };

  const getDefaultTabForRole = (rol) => {
    if (rol === 'DOCENTE') return 'teacher-panel';
    if (rol === 'RECTOR' || rol === 'ADMINISTRADOR') return 'staff-management';
    return 'subjects';
  };

  const login = async (email, password, mockRole = null) => {
    const apiUser = await loginUser(email, password);
    const assignedRole = mockRole || (apiUser ? apiUser.rol : 'ESTUDIANTE');
    let newUser;
    if (apiUser) {
      newUser = {
        ...user,
        ...apiUser,
        rol: assignedRole
      };
    } else {
      newUser = {
        ...user,
        email,
        rol: assignedRole
      };
    }
    newUser = applyStoredProfile(newUser);
    setUser(newUser);
    setActiveTab(getDefaultTabForRole(assignedRole));
    setIsAuthenticated(true);
  };

  const loginAsUser = (userData) => {
    let newUser = {
      ...user,
      ...userData
    };
    newUser = applyStoredProfile(newUser);
    setUser(newUser);
    setActiveTab(getDefaultTabForRole(userData.rol));
    setIsAuthenticated(true);
  };

  const updateProfile = (updatedFields) => {
    setUser(prev => {
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
    setUser(prev => {
      const roleAvatar = DEFAULT_AVATARS[newRole] || DEFAULT_AVATARS.ESTUDIANTE;
      const updated = {
        ...prev,
        rol: newRole,
        grado: newRole === 'RECTOR' ? 'Rectoría' : newRole === 'DOCENTE' ? 'Docente Ciencias' : '10° A',
        avatarUrl: roleAvatar
      };
      return applyStoredProfile(updated);
    });
  };

  const logout = () => {
    setIsAuthenticated(false);
    setSelectedLab(null);
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
      updateScheduleForGrade
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
