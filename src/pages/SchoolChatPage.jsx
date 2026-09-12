import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  fetchChatConversations, 
  fetchChatMessages, 
  sendChatMessage,
  markChatConversationAsRead 
} from '../services/api';
import { 
  MessageSquare, 
  Send, 
  Search, 
  Users, 
  User, 
  ShieldCheck, 
  School, 
  GraduationCap, 
  ArrowLeft, 
  Image, 
  Check, 
  CheckCheck, 
  Clock, 
  MoreVertical,
  Paperclip,
  Circle,
  X
} from 'lucide-react';
import { cleanText } from '../utils/textSanitizer';

export default function SchoolChatPage({ preselectedConvId = null }) {
  const { user, sidebarOpen } = useAuth();

  const [conversations, setConversations] = useState([]);
  const [activeConvId, setActiveConvId] = useState(preselectedConvId || 1);
  const [messages, setMessages] = useState([]);
  const [newMessageText, setNewMessageText] = useState('');
  const [searchFilter, setSearchFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('TODOS');
  const [loadingConv, setLoadingConv] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [attachedImage, setAttachedImage] = useState('');
  const [showAttachMenu, setShowAttachMenu] = useState(false);

  const messagesEndRef = useRef(null);

  // Load conversations
  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    const list = await fetchChatConversations();
    setConversations(list || []);
    setLoadingConv(false);
  };

  // Load messages whenever active conversation changes
  useEffect(() => {
    if (!activeConvId) return;
    loadMessages(activeConvId);

    // Mark conversation as read on server and clear local badge
    markChatConversationAsRead(activeConvId);
    setConversations(prev => prev.map(c => 
      c.id === activeConvId ? { ...c, noLeidos: 0 } : c
    ));

    // Real-Time Polling interval (every 2.5 seconds)
    const pollInterval = setInterval(() => {
      syncMessagesSilently(activeConvId);
      loadConversationsSilently();
    }, 2500);

    return () => clearInterval(pollInterval);
  }, [activeConvId]);

  const loadMessages = async (convId) => {
    setLoadingMsgs(true);
    const msgs = await fetchChatMessages(convId);
    setMessages(msgs || []);
    setLoadingMsgs(false);
    scrollToBottom();
  };

  const syncMessagesSilently = async (convId) => {
    const msgs = await fetchChatMessages(convId);
    if (msgs) {
      setMessages(prev => {
        // Only update if length differs or last message is different
        if (msgs.length !== prev.length) {
          setTimeout(scrollToBottom, 50);
          return msgs;
        }
        return prev;
      });
    }
  };

  const loadConversationsSilently = async () => {
    const list = await fetchChatConversations();
    if (list) {
      setConversations(list);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!newMessageText.trim() && !attachedImage) return;

    const textToSend = newMessageText.trim();
    const imageToSend = attachedImage;

    // Optimistic message addition
    const tempMsg = {
      id: Date.now(),
      convId: activeConvId,
      emisorId: user.id || 1,
      emisorNombre: user.nombre || 'Usuario',
      emisorRol: user.rol || 'ESTUDIANTE',
      emisorAvatar: user.avatarUrl || '',
      texto: textToSend,
      imagenUrl: imageToSend,
      fecha: new Date().toISOString()
    };

    setMessages(prev => [...prev, tempMsg]);
    setNewMessageText('');
    setAttachedImage('');
    setShowAttachMenu(false);
    setTimeout(scrollToBottom, 50);

    // Send to server
    await sendChatMessage(activeConvId, {
      emisorId: user.id || 1,
      emisorNombre: user.nombre || 'Usuario',
      emisorRol: user.rol || 'ESTUDIANTE',
      emisorAvatar: user.avatarUrl || '',
      texto: textToSend,
      imagenUrl: imageToSend
    });

    loadConversationsSilently();
  };

  const activeConversation = conversations.find(c => c.id === activeConvId) || conversations[0];

  const filteredConversations = conversations.filter(c => {
    const matchesSearch = c.nombre.toLowerCase().includes(searchFilter.toLowerCase()) ||
                          (c.ultimoMensaje && c.ultimoMensaje.toLowerCase().includes(searchFilter.toLowerCase()));
    if (!matchesSearch) return false;
    if (categoryFilter === 'DOCENTES') return c.rol === 'DOCENTE';
    if (categoryFilter === 'GRUPOS') return c.tipo === 'GRUPO';
    if (categoryFilter === 'COMPAÑEROS') return c.rol === 'ESTUDIANTE';
    return true;
  });

  const getRoleIcon = (rol) => {
    if (rol === 'RECTOR' || rol === 'ADMINISTRADOR') return ShieldCheck;
    if (rol === 'DOCENTE') return School;
    if (rol === 'GRUPO') return Users;
    return GraduationCap;
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAttachedImage(reader.result);
        setShowAttachMenu(false);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={`flex-1 ${sidebarOpen ? 'md:ml-72' : 'md:ml-0'} p-3 sm:p-6 overflow-hidden z-10 relative pt-20 md:pt-24 transition-all duration-300 h-[calc(100vh-1rem)] flex flex-col`}>
      
      {/* Main Chat Container with Responsive Split Pane */}
      <div className="flex-1 bg-white rounded-3xl border border-slate-200/90 shadow-lg overflow-hidden flex flex-col md:flex-row relative">
        
        {/* ================================================================= */}
        {/* LEFT COLUMN: CONVERSATION LIST                                    */}
        {/* ================================================================= */}
        <div className={`w-full md:w-80 lg:w-96 border-r border-slate-200 flex flex-col bg-slate-50/50 ${
          activeConvId && 'hidden md:flex'
        }`}>
          
          {/* Header & Search */}
          <div className="p-4 border-b border-slate-200/80 space-y-3 bg-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <h2 className="font-display font-black text-lg text-slate-900">
                  Chat Institucional
                </h2>
              </div>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                <Circle className="w-2 h-2 fill-emerald-500 text-emerald-500 animate-pulse" />
                <span>En Vivo</span>
              </span>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Buscar contacto o grupo..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-primary text-slate-800"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
              {['TODOS', 'DOCENTES', 'COMPAÑEROS', 'GRUPOS'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-colors ${
                    categoryFilter === cat
                      ? 'bg-primary text-white shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Conversations Scrollable List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {loadingConv ? (
              <div className="p-8 text-center text-xs text-slate-500">Cargando conversaciones...</div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">No se encontraron chats.</div>
            ) : (
              filteredConversations.map((conv) => {
                const isActive = activeConvId === conv.id;
                const RoleIcon = getRoleIcon(conv.rol);

                return (
                  <div
                    key={conv.id}
                    onClick={() => setActiveConvId(conv.id)}
                    className={`p-3.5 flex items-center gap-3 cursor-pointer transition-colors relative select-none ${
                      isActive
                        ? 'bg-primary/10 border-l-4 border-primary'
                        : 'hover:bg-slate-100/80 bg-white md:bg-transparent'
                    }`}
                  >
                    {/* Avatar with Online Dot */}
                    <div className="relative flex-shrink-0">
                      <img
                        src={conv.avatar}
                        alt=""
                        className="w-11 h-11 rounded-2xl object-cover border border-slate-200 shadow-2xs"
                      />
                      {conv.enLinea && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white shadow-2xs" />
                      )}
                    </div>

                    {/* Content Preview */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <h4 className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                          {cleanText(conv.nombre)}
                        </h4>
                        <span className="text-[10px] text-slate-400 whitespace-nowrap">
                          {conv.ultimaFecha ? new Date(conv.ultimaFecha).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs text-slate-500 truncate leading-tight">
                          {cleanText(conv.ultimoMensaje || 'Sin mensajes')}
                        </p>
                        {conv.noLeidos > 0 && !isActive && (
                          <span className="w-5 h-5 rounded-full bg-primary text-white font-extrabold text-[10px] flex items-center justify-center flex-shrink-0 shadow-2xs">
                            {conv.noLeidos}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ================================================================= */}
        {/* RIGHT COLUMN: ACTIVE CHAT WINDOW                                  */}
        {/* ================================================================= */}
        <div className={`flex-1 flex flex-col bg-white ${
          !activeConvId && 'hidden md:flex'
        }`}>
          {activeConversation ? (
            <>
              {/* Chat Top Header */}
              <div className="p-3 sm:p-4 border-b border-slate-200 flex items-center justify-between bg-white shadow-2xs">
                <div className="flex items-center gap-3">
                  {/* Mobile Back Button */}
                  <button
                    onClick={() => setActiveConvId(null)}
                    className="md:hidden p-1.5 rounded-xl hover:bg-slate-100 text-slate-700"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>

                  <div className="relative">
                    <img
                      src={activeConversation.avatar}
                      alt=""
                      className="w-10 h-10 rounded-2xl object-cover border border-slate-200 shadow-2xs"
                    />
                    {activeConversation.enLinea && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
                    )}
                  </div>

                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-slate-900 leading-tight">
                      {cleanText(activeConversation.nombre)}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.2 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                        {activeConversation.rol}
                      </span>
                      <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                        <Circle className="w-1.5 h-1.5 fill-emerald-500 text-emerald-500" />
                        <span>En línea</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-slate-500">
                  <span className="text-[11px] font-semibold text-slate-400 hidden sm:inline">
                    Conexión Segura EduCol
                  </span>
                </div>
              </div>

              {/* Messages Body Stream */}
              <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-3.5 bg-slate-50/40">
                {loadingMsgs ? (
                  <div className="p-12 text-center text-xs text-slate-500">Cargando mensajes...</div>
                ) : messages.length === 0 ? (
                  <div className="p-12 text-center text-xs text-slate-500">
                    No hay mensajes en esta conversación. ¡Envía el primer mensaje institucional!
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isMe = msg.emisorId === user.id || msg.emisorNombre === user.nombre;

                    return (
                      <div
                        key={msg.id}
                        className={`flex gap-2.5 max-w-[85%] sm:max-w-[70%] ${
                          isMe ? 'ml-auto flex-row-reverse' : 'mr-auto'
                        }`}
                      >
                        {!isMe && (
                          <img
                            src={msg.emisorAvatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80'}
                            alt=""
                            className="w-7 h-7 rounded-full object-cover border border-slate-200 flex-shrink-0 mt-1 shadow-2xs"
                          />
                        )}

                        <div className="space-y-1">
                          {/* Sender name for group chats */}
                          {!isMe && activeConversation.tipo === 'GRUPO' && (
                            <span className="text-[10px] font-extrabold text-slate-600 px-1 block">
                              {cleanText(msg.emisorNombre)} ({msg.emisorRol})
                            </span>
                          )}

                          {/* Message Bubble */}
                          <div
                            className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                              isMe
                                ? 'bg-primary text-white rounded-tr-none'
                                : 'bg-white text-slate-900 border border-slate-200/80 rounded-tl-none'
                            }`}
                          >
                            {msg.imagenUrl && (
                              <div className="mb-2 rounded-xl overflow-hidden border border-white/20 max-h-56">
                                <img src={msg.imagenUrl} alt="Adjunto" className="w-full h-auto object-cover max-h-56" />
                              </div>
                            )}

                            <p className="whitespace-pre-wrap">{cleanText(msg.texto)}</p>
                          </div>

                          {/* Timestamp & Status */}
                          <div className={`flex items-center gap-1 text-[10px] text-slate-400 px-1 ${
                            isMe ? 'justify-end' : 'justify-start'
                          }`}>
                            <span>{new Date(msg.fecha).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            {isMe && <CheckCheck className="w-3 h-3 text-primary stroke-[2.5]" />}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Attached Image Preview Bar */}
              {attachedImage && (
                <div className="px-4 py-2 bg-slate-100 border-t border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img src={attachedImage} alt="" className="w-10 h-10 rounded-lg object-cover border border-slate-300" />
                    <span className="text-xs font-semibold text-slate-700">Foto lista para adjuntar</span>
                  </div>
                  <button onClick={() => setAttachedImage('')} className="p-1 text-slate-500 hover:text-rose-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Bottom Message Input Bar */}
              <form onSubmit={handleSendMessage} className="p-3 sm:p-4 border-t border-slate-200 bg-white flex items-center gap-2">
                
                {/* Attachment Button */}
                <label className="p-2.5 rounded-xl text-slate-500 hover:text-primary hover:bg-slate-100 cursor-pointer transition-colors">
                  <Image className="w-5 h-5" />
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>

                {/* Text Input */}
                <input
                  type="text"
                  value={newMessageText}
                  onChange={(e) => setNewMessageText(e.target.value)}
                  placeholder={`Escribe un mensaje para ${activeConversation.nombre.split(' ')[0]}...`}
                  className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary leading-normal"
                />

                {/* Send Button */}
                <button
                  type="submit"
                  disabled={!newMessageText.trim() && !attachedImage}
                  className="p-2.5 sm:px-5 sm:py-2.5 rounded-2xl bg-primary hover:bg-primary-dark disabled:opacity-40 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 active:scale-95 flex-shrink-0"
                >
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">Enviar</span>
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8 text-center text-slate-400">
              Selecciona una conversación para iniciar el chat.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
