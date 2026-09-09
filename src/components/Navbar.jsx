import React, { useState, useRef, useEffect } from 'react';
import { useAuth, DEFAULT_AVATARS } from '../context/AuthContext';
import { 
  Menu, 
  PanelLeftClose, 
  GraduationCap, 
  Bell, 
  BellOff, 
  Trash2, 
  Users, 
  Check 
} from 'lucide-react';

export default function Navbar() {
  const { 
    user, 
    setActiveTab, 
    activeTab, 
    sidebarOpen, 
    toggleSidebar,
    notifications,
    unreadCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification
  } = useAuth();

  const [showNotifications, setShowNotifications] = useState(false);
  const [filterUnread, setFilterUnread] = useState(false);
  const notifRef = useRef(null);

  // Close notifications popover on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const displayedNotifications = filterUnread
    ? notifications.filter(n => !n.read)
    : notifications;

  const defaultRoleAvatar = DEFAULT_AVATARS[user?.rol] || DEFAULT_AVATARS.ESTUDIANTE;
  const currentAvatar = user?.avatarUrl && !user.avatarUrl.includes('googleusercontent') 
    ? user.avatarUrl 
    : defaultRoleAvatar;

  return (
    <nav className="fixed top-0 left-0 w-full z-40 flex items-center justify-between px-3 sm:px-4 md:px-8 bg-white/70 backdrop-blur-md border-b border-white/40 shadow-sm h-16 md:h-20">
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Sidebar Drawer Toggle Button */}
          <button 
            onClick={toggleSidebar}
            className="p-2 rounded-xl bg-white/70 hover:bg-white text-primary transition-all shadow-sm active:scale-95 flex items-center justify-center border border-slate-200/60"
            title={sidebarOpen ? "Ocultar menú lateral" : "Mostrar menú lateral"}
          >
            {sidebarOpen ? (
              <PanelLeftClose className="w-5 h-5 text-primary" />
            ) : (
              <Menu className="w-5 h-5 text-primary" />
            )}
          </button>

          <div 
            onClick={() => setActiveTab('subjects')}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <span className="font-display font-bold text-xl md:text-2xl text-primary tracking-tight">
              EduCol
            </span>
          </div>
        </div>

        {/* Top Actions */}
        <div className="flex items-center gap-2 sm:gap-3 relative">

          {/* Notifications Dropdown */}
          <div className="relative" ref={notifRef}>
            <button 
              onClick={() => {
                const nextState = !showNotifications;
                setShowNotifications(nextState);
                if (nextState && unreadCount > 0) {
                  markAllNotificationsAsRead();
                }
              }}
              className="p-2 rounded-full hover:bg-white/60 transition-all duration-200 text-primary active:scale-95 relative border border-slate-200/50"
              title="Notificaciones"
            >
              <Bell className="w-5 h-5" />
              
              {/* Unread Badge */}
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 bg-rose-500 text-white font-black text-[10px] rounded-full w-4 h-4 flex items-center justify-center shadow-md animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Popover */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white/95 backdrop-blur-2xl border border-slate-200 rounded-2xl shadow-2xl p-4 z-50 animate-fadeIn">
                
                {/* Header */}
                <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">Notificaciones</span>
                    {unreadCount > 0 && (
                      <span className="text-[10px] bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full font-bold">
                        {unreadCount} nuevas
                      </span>
                    )}
                  </div>

                  {unreadCount > 0 && (
                    <button 
                      onClick={markAllNotificationsAsRead}
                      className="text-[11px] font-bold text-primary hover:underline"
                    >
                      Marcar todas leídas
                    </button>
                  )}
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2 mb-3">
                  <button
                    onClick={() => setFilterUnread(false)}
                    className={`text-[11px] font-bold px-3 py-1 rounded-full transition-all ${
                      !filterUnread ? 'bg-primary text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Todas ({notifications.length})
                  </button>
                  <button
                    onClick={() => setFilterUnread(true)}
                    className={`text-[11px] font-bold px-3 py-1 rounded-full transition-all ${
                      filterUnread ? 'bg-primary text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Sin leer ({unreadCount})
                  </button>
                </div>

                {/* Notifications List */}
                <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                  {displayedNotifications.length === 0 ? (
                    <div className="text-center py-8">
                      <BellOff className="w-8 h-8 text-slate-300 mx-auto mb-1" />
                      <p className="text-xs font-bold text-slate-500">No hay notificaciones</p>
                      <p className="text-[10px] text-slate-400">Estás al día con tus avisos.</p>
                    </div>
                  ) : (
                    displayedNotifications.map((n) => (
                      <div 
                        key={n.id} 
                        onClick={() => markNotificationAsRead(n.id)}
                        className={`p-3 rounded-xl transition-all cursor-pointer relative group border ${
                          !n.read 
                            ? 'bg-amber-50/70 border-amber-200/80 shadow-sm' 
                            : 'bg-slate-50/60 border-slate-100 hover:bg-slate-100/80'
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          {/* Text Content */}
                          <div className="flex-1 min-w-0 pr-6">
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <h5 className={`font-bold text-xs ${!n.read ? 'text-slate-900' : 'text-slate-700'}`}>
                                {n.title}
                              </h5>
                              {!n.read && (
                                <span className="w-2 h-2 rounded-full bg-rose-500 flex-shrink-0 animate-ping"></span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-600 leading-snug line-clamp-2 mb-1">
                              {n.text}
                            </p>
                            <span className="text-[10px] font-semibold text-slate-400 block">
                              {n.time}
                            </span>
                          </div>

                          {/* Delete Action Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(n.id);
                            }}
                            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-rose-100 text-slate-400 hover:text-rose-600 rounded-md transition-all absolute top-2 right-2"
                            title="Eliminar notificación"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

              </div>
            )}
          </div>

          {/* Profile Button */}
          <button 
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 p-1.5 pr-3 rounded-full hover:bg-white/50 transition-all border border-slate-200/50 ${
              activeTab === 'profile' ? 'bg-primary-container/60 text-on-primary-container ring-2 ring-primary/30' : 'text-primary'
            }`}
            title="Ver Perfil y Ajustes"
          >
            <img 
              src={currentAvatar} 
              alt="User Avatar" 
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = defaultRoleAvatar;
              }}
              className="w-8 h-8 rounded-full border border-white object-cover bg-white shadow-xs"
            />
            <span className="hidden md:inline font-semibold text-xs text-on-surface">
              {user?.nombre || 'Mi Perfil'}
            </span>
          </button>
        </div>
      </nav>
  );
}
