import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../context/AuthContext';
import { 
  fetchSocialPosts, 
  createSocialPost, 
  reactToSocialPost, 
  addSocialComment, 
  fetchSocialStories, 
  createSocialStory,
  fetchChatConversations,
  fetchChatMessages,
  sendChatMessage,
  markChatConversationAsRead,
  markAllChatConversationsAsRead,
  fetchSocialReels,
  likeSocialReel,
  addSocialReelComment,
  fetchSocialActivity,
  fetchUserSavedItems,
  saveUserSavedItems
} from '../services/api';
import { 
  Share2, 
  Heart, 
  Award, 
  Flame, 
  Sparkles, 
  MessageCircle, 
  Send, 
  Plus, 
  Image, 
  Camera, 
  Search, 
  CheckCircle2, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Pause, 
  Play, 
  ShieldCheck, 
  GraduationCap, 
  School, 
  MessageSquare,
  PlusSquare,
  Bookmark,
  MoreHorizontal,
  User,
  SlidersHorizontal,
  Upload,
  CheckCheck,
  Circle,
  Minimize2,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  Users,
  Film,
  Grid,
  Volume2,
  VolumeX,
  Music,
  Bell,
  Compass
} from 'lucide-react';
import { cleanText } from '../utils/textSanitizer';

export default function SocialSchoolPage() {
  const { user, sidebarOpen, setActiveTab, addNotification } = useAuth();

  const [posts, setPosts] = useState([]);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState('TODOS');
  const [searchQuery, setSearchQuery] = useState('');

  // Instagram Sub-Navigation Tab: 'muro' | 'explorar' | 'reels' | 'guardados'
  const [activeNavTab, setActiveNavTab] = useState('muro');

  // Activity & Reactions Modal State (Heart Icon in Header)
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [activities, setActivities] = useState([]);
  const [activityUnread, setActivityUnread] = useState(0);

  // Reels State
  const [reels, setReels] = useState([]);
  const [activeReelIndex, setActiveReelIndex] = useState(0);
  const [isReelPlaying, setIsReelPlaying] = useState(true);
  const [isReelMuted, setIsReelMuted] = useState(false);
  const [showReelComments, setShowReelComments] = useState(false);
  const [reelCommentInput, setReelCommentInput] = useState('');
  const reelVideoRef = useRef(null);

  const currentUserId = user?.id || user?.email || 'estudiante-1';

  // Saved / Bookmarked Posts strictly isolated per user profile
  const [savedPostIds, setSavedPostIds] = useState(() => {
    try {
      const uKey = `saved_social_posts_${user?.id || user?.email || 'estudiante-1'}`;
      const saved = localStorage.getItem(uKey);
      if (saved) return JSON.parse(saved);
      // Check legacy key if exists
      const legacy = localStorage.getItem('saved_social_posts');
      return legacy ? JSON.parse(legacy) : [];
    } catch {
      return [];
    }
  });

  // Sync saved items whenever current user changes or loads from server
  useEffect(() => {
    let isMounted = true;
    const loadUserSaved = async () => {
      const uKey = `saved_social_posts_${currentUserId}`;
      try {
        const localSaved = localStorage.getItem(uKey);
        if (localSaved && isMounted) {
          setSavedPostIds(JSON.parse(localSaved));
        }
      } catch (e) {
        console.error(e);
      }

      const serverSaved = await fetchUserSavedItems(currentUserId);
      if (serverSaved && isMounted && Array.isArray(serverSaved)) {
        setSavedPostIds(serverSaved);
        try {
          localStorage.setItem(uKey, JSON.stringify(serverSaved));
        } catch (e) {
          console.error(e);
        }
      }
    };
    loadUserSaved();
    return () => { isMounted = false; };
  }, [currentUserId]);

  // Explore Tab State
  const [exploreCategory, setExploreCategory] = useState('TODOS');
  const [selectedExplorePost, setSelectedExplorePost] = useState(null);

  // Instagram-style Profile Action Sheet Modal
  const [showProfileActionsModal, setShowProfileActionsModal] = useState(false);

  // Dedicated Post Creator Modal (Instagram Style)
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);
  const [newPostText, setNewPostText] = useState('');
  const [newPostCategory, setNewPostCategory] = useState('ACADEMICO');
  const [newPostImage, setNewPostImage] = useState('');
  const [isPublishingPost, setIsPublishingPost] = useState(false);

  // Dedicated Story Creator Modal (Instagram Style)
  const [showCreateStoryModal, setShowCreateStoryModal] = useState(false);
  const [storyText, setStoryText] = useState('');
  const [storyTitle, setStoryTitle] = useState('');
  const [storyImage, setStoryImage] = useState('');
  const [storyGradient, setStoryGradient] = useState('from-amber-700 to-amber-950');
  const [isPublishingStory, setIsPublishingStory] = useState(false);

  // Story Viewer Modal State (Instagram Stories Style - Rendered via Portal at z-[99999])
  const [activeStoryIndex, setActiveStoryIndex] = useState(null);
  const [storyProgress, setStoryProgress] = useState(0);
  const [isStoryPaused, setIsStoryPaused] = useState(false);

  // Comments State
  const [commentInputs, setCommentInputs] = useState({});
  const [expandedComments, setExpandedComments] = useState({});

  // LinkedIn-Style Chat State
  const [chatConversations, setChatConversations] = useState([]);
  const [chatPanelOpen, setChatPanelOpen] = useState(false);
  const [openChatWindows, setOpenChatWindows] = useState([]); // Array of conv IDs
  const [minimizedChats, setMinimizedChats] = useState([]); // Array of conv IDs
  const [chatMessages, setChatMessages] = useState({});
  const [chatInputs, setChatInputs] = useState({});
  const [chatSearchFilter, setChatSearchFilter] = useState('');
  const chatMessagesEndRefs = useRef({});

  // Preset Event Gallery for instant photo selection
  const presetPhotos = [
    { label: 'Feria de Ciencias & Robótica', url: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=1000&auto=format&fit=crop&q=80' },
    { label: 'Laboratorio de Biología 3D', url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1000&auto=format&fit=crop&q=80' },
    { label: 'Biblioteca & Grupo de Estudio', url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1000&auto=format&fit=crop&q=80' },
    { label: 'Conferencia & Auditorio Escolar', url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1000&auto=format&fit=crop&q=80' },
    { label: 'Olimpiadas & Deportes', url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1000&auto=format&fit=crop&q=80' },
    { label: 'Artes, Música & Cultura', url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1000&auto=format&fit=crop&q=80' }
  ];

  useEffect(() => {
    loadFeed();
  }, [user]);

  const loadFeed = async () => {
    setLoading(true);
    const [pData, sData, chatData, rData, actData] = await Promise.all([
      fetchSocialPosts(),
      fetchSocialStories(),
      fetchChatConversations(),
      fetchSocialReels(),
      fetchSocialActivity(user.id || 1)
    ]);
    setPosts(pData || []);
    setStories(sData || []);
    setChatConversations(chatData || []);
    setReels(rData || []);
    setActivities(actData || []);
    setActivityUnread((actData || []).length);
    setLoading(false);
  };

  // When story viewer is active, disable body scroll so background doesn't move
  useEffect(() => {
    if (activeStoryIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [activeStoryIndex]);

  // Story Viewer Auto-Progress Timer
  const storyIntervalRef = useRef(null);
  useEffect(() => {
    if (activeStoryIndex !== null && !isStoryPaused) {
      const step = 2; // progress step
      storyIntervalRef.current = setInterval(() => {
        setStoryProgress(prev => {
          if (prev >= 100) {
            if (activeStoryIndex < stories.length - 1) {
              setActiveStoryIndex(activeStoryIndex + 1);
              return 0;
            } else {
              clearInterval(storyIntervalRef.current);
              setActiveStoryIndex(null);
              return 0;
            }
          }
          return prev + step;
        });
      }, 70);
    }
    return () => clearInterval(storyIntervalRef.current);
  }, [activeStoryIndex, isStoryPaused, stories]);

  const handleOpenStory = (idx) => {
    setActiveStoryIndex(idx);
    setStoryProgress(0);
    setIsStoryPaused(false);
  };

  const handlePrevStory = () => {
    if (activeStoryIndex > 0) {
      setActiveStoryIndex(activeStoryIndex - 1);
      setStoryProgress(0);
    }
  };

  const handleNextStory = () => {
    if (activeStoryIndex < stories.length - 1) {
      setActiveStoryIndex(activeStoryIndex + 1);
      setStoryProgress(0);
    } else {
      setActiveStoryIndex(null);
    }
  };

  // Reactions Handler (Strictly NO EMOJIS, pure Lucide icons)
  const handleReact = async (postId, tipo) => {
    setPosts(prevPosts => prevPosts.map(p => {
      if (p.id === postId) {
        const uId = user.id || 1;
        const currentList = p.reacciones?.[tipo] || [];
        const hasReacted = currentList.includes(uId);
        const newList = hasReacted ? currentList.filter(id => id !== uId) : [...currentList, uId];
        return {
          ...p,
          reacciones: {
            ...p.reacciones,
            [tipo]: newList
          }
        };
      }
      return p;
    }));

    await reactToSocialPost(postId, user.id || 1, tipo);
  };

  // Publish Post Handler
  const handlePublishPost = async (e) => {
    e.preventDefault();
    if (!newPostText.trim()) return;
    setIsPublishingPost(true);

    const payload = {
      autorId: user.id || 1,
      autorNombre: user.nombre || 'Usuario',
      autorRol: user.rol || 'ESTUDIANTE',
      autorAvatar: user.avatarUrl || '',
      grado: user.grado || '',
      contenido: newPostText,
      categoria: newPostCategory,
      imagenUrl: newPostImage
    };

    const res = await createSocialPost(payload);
    if (res && res.post) {
      setPosts([res.post, ...posts]);
    } else {
      loadFeed();
    }

    if (addNotification) {
      addNotification({
        title: 'Nueva Publicación en SocialSchool',
        text: `${user.nombre} compartió una actualización en el muro del colegio.`,
        icon: 'share',
        color: 'text-primary',
        targetRole: 'ESTUDIANTE'
      });
    }

    setNewPostText('');
    setNewPostImage('');
    setShowCreatePostModal(false);
    setIsPublishingPost(false);
  };

  // Publish Story Handler
  const handlePublishStory = async (e) => {
    e.preventDefault();
    if (!storyTitle.trim() && !storyText.trim() && !storyImage) return;
    setIsPublishingStory(true);

    const payload = {
      autorId: user.id || 1,
      autorNombre: user.nombre || 'Usuario',
      autorRol: user.rol || 'ESTUDIANTE',
      autorAvatar: user.avatarUrl || '',
      titulo: storyTitle || 'Historia Escolar',
      texto: storyText,
      imagenUrl: storyImage,
      gradiente: storyGradient
    };

    const res = await createSocialStory(payload);
    if (res && res.story) {
      setStories([res.story, ...stories]);
    } else {
      loadFeed();
    }

    setShowCreateStoryModal(false);
    setStoryTitle('');
    setStoryText('');
    setStoryImage('');
    setIsPublishingStory(false);
  };

  // Comments Handler
  const handleAddComment = async (postId) => {
    const text = commentInputs[postId];
    if (!text || !text.trim()) return;

    const payload = {
      autorId: user.id || 1,
      autorNombre: user.nombre || 'Usuario',
      autorRol: user.rol || 'ESTUDIANTE',
      autorAvatar: user.avatarUrl || '',
      contenido: text.trim()
    };

    const tempComment = {
      id: Date.now(),
      ...payload,
      fecha: new Date().toISOString()
    };

    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          comentarios: [...(p.comentarios || []), tempComment]
        };
      }
      return p;
    }));

    setCommentInputs({ ...commentInputs, [postId]: '' });
    await addSocialComment(postId, payload);
  };

  const toggleComments = (postId) => {
    setExpandedComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const handleFileUpload = (e, setter) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setter(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // =========================================================================
  // INSTAGRAM SUITE HANDLERS (GUARDADOS, REELS, ACTIVIDAD)
  // =========================================================================

  const toggleSavePost = (postId) => {
    setSavedPostIds(prev => {
      const next = prev.includes(postId) ? prev.filter(id => id !== postId) : [...prev, postId];
      try {
        const uKey = `saved_social_posts_${currentUserId}`;
        localStorage.setItem(uKey, JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      saveUserSavedItems(currentUserId, next);
      return next;
    });
  };

  const handleLikeReel = async (reelId) => {
    const uId = user.id || 1;
    setReels(prev => prev.map(r => {
      if (r.id === reelId) {
        const hasLiked = (r.likes || []).includes(uId);
        const newLikes = hasLiked ? r.likes.filter(id => id !== uId) : [...(r.likes || []), uId];
        return { ...r, likes: newLikes };
      }
      return r;
    }));
    await likeSocialReel(reelId, uId);
  };

  const handleAddReelComment = async (reelId, e) => {
    if (e) e.preventDefault();
    if (!reelCommentInput.trim()) return;

    const payload = {
      autorId: user.id || 1,
      autorNombre: user.nombre || 'Usuario',
      autorAvatar: user.avatarUrl || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
      texto: reelCommentInput.trim()
    };

    const tempComment = {
      id: Date.now(),
      ...payload,
      fecha: new Date().toISOString()
    };

    setReels(prev => prev.map(r => {
      if (r.id === reelId) {
        return {
          ...r,
          comentarios: [...(r.comentarios || []), tempComment]
        };
      }
      return r;
    }));

    setReelCommentInput('');
    await addSocialReelComment(reelId, payload);
  };

  const handleNextReel = () => {
    if (activeReelIndex < reels.length - 1) {
      setActiveReelIndex(prev => prev + 1);
      setIsReelPlaying(true);
    }
  };

  const handlePrevReel = () => {
    if (activeReelIndex > 0) {
      setActiveReelIndex(prev => prev - 1);
      setIsReelPlaying(true);
    }
  };

  const handleToggleReelPlay = () => {
    if (reelVideoRef.current) {
      if (isReelPlaying) {
        reelVideoRef.current.pause();
        setIsReelPlaying(false);
      } else {
        reelVideoRef.current.play();
        setIsReelPlaying(true);
      }
    } else {
      setIsReelPlaying(!isReelPlaying);
    }
  };

  const handleMarkActivityRead = () => {
    setActivityUnread(0);
  };

  // =========================================================================
  // LINKEDIN-STYLE CHAT HANDLERS
  // =========================================================================

  // Poll chat conversations every 3 seconds
  useEffect(() => {
    const pollChat = setInterval(async () => {
      const data = await fetchChatConversations();
      if (data) {
        setChatConversations(data.map(c =>
          openChatWindows.includes(c.id) ? { ...c, noLeidos: 0 } : c
        ));
      }
      // Also refresh messages for open windows
      openChatWindows.forEach(async (convId) => {
        const msgs = await fetchChatMessages(convId);
        if (msgs) {
          setChatMessages(prev => {
            if (!prev[convId] || prev[convId].length !== msgs.length) {
              return { ...prev, [convId]: msgs };
            }
            return prev;
          });
        }
      });
    }, 3000);
    return () => clearInterval(pollChat);
  }, [openChatWindows]);

  const totalUnreadChat = chatConversations.reduce((sum, c) => sum + (c.noLeidos || 0), 0);

  const handleMarkAllRead = async () => {
    setChatConversations(prev => prev.map(c => ({ ...c, noLeidos: 0 })));
    await markAllChatConversationsAsRead();
  };

  const openChatWindow = async (convId) => {
    // Remove from minimized if it was minimized
    setMinimizedChats(prev => prev.filter(id => id !== convId));
    // Add to open windows if not already there (max 3)
    setOpenChatWindows(prev => {
      if (prev.includes(convId)) return prev;
      const newWindows = [...prev, convId];
      if (newWindows.length > 3) newWindows.shift();
      return newWindows;
    });
    // Load messages
    const msgs = await fetchChatMessages(convId);
    setChatMessages(prev => ({ ...prev, [convId]: msgs || [] }));
    // Mark as read locally and on server
    setChatConversations(prev => prev.map(c =>
      c.id === convId ? { ...c, noLeidos: 0 } : c
    ));
    await markChatConversationAsRead(convId);
    setChatPanelOpen(false);
    setTimeout(() => {
      chatMessagesEndRefs.current[convId]?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const closeChatWindow = (convId) => {
    setOpenChatWindows(prev => prev.filter(id => id !== convId));
    setMinimizedChats(prev => prev.filter(id => id !== convId));
  };

  const minimizeChatWindow = (convId) => {
    setOpenChatWindows(prev => prev.filter(id => id !== convId));
    setMinimizedChats(prev => prev.includes(convId) ? prev : [...prev, convId]);
  };

  const restoreChatWindow = (convId) => {
    setMinimizedChats(prev => prev.filter(id => id !== convId));
    openChatWindow(convId);
  };

  const handleSendChatMessage = async (convId) => {
    const text = chatInputs[convId];
    if (!text || !text.trim()) return;

    const tempMsg = {
      id: Date.now(),
      convId,
      emisorId: user.id || 1,
      emisorNombre: user.nombre || 'Usuario',
      emisorRol: user.rol || 'ESTUDIANTE',
      emisorAvatar: user.avatarUrl || '',
      texto: text.trim(),
      fecha: new Date().toISOString()
    };

    setChatMessages(prev => ({
      ...prev,
      [convId]: [...(prev[convId] || []), tempMsg]
    }));
    setChatInputs(prev => ({ ...prev, [convId]: '' }));

    setTimeout(() => {
      chatMessagesEndRefs.current[convId]?.scrollIntoView({ behavior: 'smooth' });
    }, 50);

    await sendChatMessage(convId, {
      emisorId: user.id || 1,
      emisorNombre: user.nombre || 'Usuario',
      emisorRol: user.rol || 'ESTUDIANTE',
      emisorAvatar: user.avatarUrl || '',
      texto: text.trim()
    });

    // Refresh conversations for last message preview
    const convData = await fetchChatConversations();
    if (convData) setChatConversations(convData);
  };

  const getChatRoleIcon = (rol) => {
    if (rol === 'RECTOR' || rol === 'ADMINISTRADOR') return ShieldCheck;
    if (rol === 'DOCENTE') return School;
    if (rol === 'GRUPO') return Users;
    return GraduationCap;
  };

  const filteredChatConversations = chatConversations.filter(c =>
    c.nombre.toLowerCase().includes(chatSearchFilter.toLowerCase())
  );

  const filteredPosts = posts.filter(p => {
    const matchesSearch = p.contenido?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.autorNombre?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const getRoleBadge = (rol) => {
    if (rol === 'RECTOR' || rol === 'ADMINISTRADOR') {
      return {
        label: 'Directivo / Rectoría',
        color: 'bg-amber-100 text-amber-900 border-amber-200',
        icon: ShieldCheck
      };
    }
    if (rol === 'DOCENTE') {
      return {
        label: 'Docente Titular',
        color: 'bg-blue-100 text-blue-900 border-blue-200',
        icon: School
      };
    }
    return {
      label: 'Estudiante',
      color: 'bg-emerald-100 text-emerald-900 border-emerald-200',
      icon: GraduationCap
    };
  };

  const savedPostsList = posts.filter(p => savedPostIds.includes(p.id));
  const savedReelsList = reels.filter(r => 
    savedPostIds.includes('reel-' + r.id) || 
    savedPostIds.includes(r.id + 10000) ||
    savedPostIds.includes(String(r.id + 10000))
  );
  const totalSavedCount = savedPostsList.length + savedReelsList.length;

  const handleRemoveSavedReel = (reelId) => {
    setSavedPostIds(prev => {
      const next = prev.filter(id => 
        id !== ('reel-' + reelId) && 
        id !== (reelId + 10000) && 
        id !== String(reelId + 10000)
      );
      try {
        const uKey = `saved_social_posts_${currentUserId}`;
        localStorage.setItem(uKey, JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      saveUserSavedItems(currentUserId, next);
      return next;
    });
  };

  const handleToggleSaveReel = (reelId) => {
    const isSaved = savedPostIds.includes('reel-' + reelId) || 
                    savedPostIds.includes(reelId + 10000) ||
                    savedPostIds.includes(String(reelId + 10000));
    if (isSaved) {
      handleRemoveSavedReel(reelId);
    } else {
      toggleSavePost('reel-' + reelId);
    }
  };

  return (
    <div className={`flex-1 ${sidebarOpen ? 'md:ml-72' : 'md:ml-0'} p-3 sm:p-6 md:p-8 overflow-y-auto z-10 relative pt-20 md:pt-24 transition-all duration-300`}>
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Clean Top Header */}
        <header className="flex items-center justify-between pb-3 border-b border-slate-200/80">
          <div>
            <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-900 tracking-tight">
              SocialSchool
            </h1>
          </div>

          {/* Action Icon: Heart Button (Activity & Interactions) */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                setShowActivityModal(true);
                handleMarkActivityRead();
              }}
              className="p-2.5 rounded-2xl bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-slate-700 hover:text-rose-600 transition-all shadow-2xs relative active:scale-95 flex items-center justify-center group"
              title="Actividad e Interacciones"
            >
              <Heart className="w-5 h-5 transition-transform group-hover:scale-110" />
              {activityUnread > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white font-extrabold text-[9px] flex items-center justify-center animate-pulse">
                  {activityUnread}
                </span>
              )}
            </button>
          </div>
        </header>

        {/* Instagram-style Sub-Navbar (Sticky at top of scroll container) */}
        <nav className="sticky top-0 z-20 flex flex-col sm:flex-row items-center justify-between gap-2.5 border border-slate-200/90 bg-white/95 backdrop-blur-md rounded-2xl p-2 sm:px-3 shadow-xs">
          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 sm:gap-2 w-full sm:w-auto justify-between sm:justify-start overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveNavTab('muro')}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl font-bold text-xs transition-all whitespace-nowrap ${
                activeNavTab === 'muro'
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-slate-600 hover:text-primary hover:bg-slate-50'
              }`}
            >
              <Grid className="w-4 h-4" />
              <span>Muro</span>
            </button>

            <button
              onClick={() => setActiveNavTab('explorar')}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl font-bold text-xs transition-all whitespace-nowrap ${
                activeNavTab === 'explorar'
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-slate-600 hover:text-primary hover:bg-slate-50'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Explorar</span>
            </button>

            <button
              onClick={() => setActiveNavTab('reels')}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl font-bold text-xs transition-all whitespace-nowrap ${
                activeNavTab === 'reels'
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-slate-600 hover:text-primary hover:bg-slate-50'
              }`}
            >
              <Film className="w-4 h-4" />
              <span>Reels</span>
            </button>

            <button
              onClick={() => setActiveNavTab('guardados')}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl font-bold text-xs transition-all whitespace-nowrap ${
                activeNavTab === 'guardados'
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-slate-600 hover:text-primary hover:bg-slate-50'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span>Guardados</span>
              {totalSavedCount > 0 && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  activeNavTab === 'guardados' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
                }`}>
                  {totalSavedCount}
                </span>
              )}
            </button>
          </div>

          {/* Integrated Search Bar with Magnifying Glass Icon (Lupa) */}
          <div className="relative w-full sm:w-44 md:w-52 flex-shrink-0">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar..."
              className="w-full pl-8 pr-7 py-1.5 rounded-xl bg-slate-100/90 hover:bg-slate-100 border border-slate-200/80 text-[11px] text-slate-800 placeholder-slate-400 focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-primary transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full hover:bg-slate-200 transition-colors"
                title="Limpiar búsqueda"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </nav>

        {/* ================================================================= */}
        {/* TAB 1: MURO / FEED                                                */}
        {/* ================================================================= */}
        {activeNavTab === 'muro' && (
          <div className="space-y-6 animate-fadeIn">
            {/* STORIES SECTION (INSTAGRAM STYLE TOP CAROUSEL) */}
            <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-xs">
              <div className="flex items-center gap-4 sm:gap-5 overflow-x-auto pb-2 scrollbar-none">
                
                {/* Profile Avatar / "Tu historia" */}
                <div 
                  onClick={() => setShowProfileActionsModal(true)}
                  className="flex flex-col items-center gap-1.5 cursor-pointer flex-shrink-0 group select-none"
                  title="Opciones de perfil: Subir historia o publicación"
                >
                  <div className="relative">
                    <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full p-0.5 border-2 border-dashed border-primary flex items-center justify-center bg-slate-50 group-hover:scale-105 transition-transform overflow-hidden shadow-xs">
                      <img
                        src={user.avatarUrl || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80'}
                        alt="Tu Avatar"
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                    <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center shadow-md border-2 border-white">
                      <Plus className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-slate-800 truncate max-w-[70px]">
                    Tu historia
                  </span>
                </div>

                {/* List of Active Stories */}
                {stories.map((story, index) => (
                  <div
                    key={story.id}
                    onClick={() => handleOpenStory(index)}
                    className="flex flex-col items-center gap-1.5 cursor-pointer flex-shrink-0 group select-none"
                  >
                    <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full p-[2.5px] bg-gradient-to-tr from-amber-500 via-primary to-rose-500 group-hover:scale-105 transition-transform shadow-xs">
                      <div className="w-full h-full rounded-full p-0.5 bg-white overflow-hidden">
                        <img
                          src={story.autorAvatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80'}
                          alt={story.autorNombre}
                          className="w-full h-full object-cover rounded-full"
                        />
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-800 truncate max-w-[75px] text-center">
                      {story.autorNombre.split(' ')[0]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

              {/* POSTS FEED LIST */}
            {loading ? (
              <div className="p-12 text-center text-slate-500 font-semibold text-sm">
                Cargando publicaciones de SocialSchool...
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="p-12 bg-white rounded-3xl border border-slate-200 text-center space-y-3">
                <Share2 className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="font-bold text-slate-700 text-base">No hay publicaciones disponibles</p>
                <button
                  onClick={() => setShowCreatePostModal(true)}
                  className="px-4 py-2 rounded-xl bg-primary text-white font-bold text-xs"
                >
                  Crear la primera publicación
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredPosts.map((post) => {
                  const roleBadge = getRoleBadge(post.autorRol);
                  const RoleIcon = roleBadge.icon;
                  const isCommentsOpen = !!expandedComments[post.id];
                  const commentsList = post.comentarios || [];

                  const uId = user.id || 1;
                  const hasLiked = post.reacciones?.meGusta?.includes(uId);
                  const hasApplauded = post.reacciones?.aplausos?.includes(uId);
                  const hasInspired = post.reacciones?.inspirador?.includes(uId);
                  const hasInnovated = post.reacciones?.innovador?.includes(uId);

                  const likeCount = post.reacciones?.meGusta?.length || 0;
                  const applaudCount = post.reacciones?.aplausos?.length || 0;
                  const inspireCount = post.reacciones?.inspirador?.length || 0;
                  const innovateCount = post.reacciones?.innovador?.length || 0;

                  return (
                    <article
                      key={post.id}
                      className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden transition-all hover:shadow-md"
                    >
                      {/* Post Header */}
                      <div className="p-4 sm:p-5 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={post.autorAvatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80'}
                            alt={post.autorNombre}
                            className="w-10 h-10 rounded-2xl object-cover border border-slate-200 shadow-2xs"
                          />
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="font-bold text-slate-900 text-sm">
                                {cleanText(post.autorNombre)}
                              </h4>
                              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${roleBadge.color}`}>
                                <RoleIcon className="w-3 h-3" />
                                <span>{roleBadge.label}</span>
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                              {post.grado && <span>{post.grado} •</span>}
                              <span>{new Date(post.fecha).toLocaleDateString([], { day: '2-digit', month: 'short' })}</span>
                            </div>
                          </div>
                        </div>

                        {/* Save Bookmark Button in Card Header */}
                        <button
                          type="button"
                          onClick={() => toggleSavePost(post.id)}
                          className={`p-2 rounded-xl transition-all ${
                            savedPostIds.includes(post.id)
                              ? 'text-primary bg-primary/10'
                              : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                          }`}
                          title={savedPostIds.includes(post.id) ? "Guardado (clic para quitar)" : "Guardar publicación"}
                        >
                          <Bookmark className={`w-4 h-4 ${savedPostIds.includes(post.id) ? 'fill-primary' : ''}`} />
                        </button>
                      </div>

                      {/* Post Content */}
                      <div className="px-4 sm:px-5 pb-3">
                        <p className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line">
                          {cleanText(post.contenido)}
                        </p>
                      </div>

                      {/* Post Image */}
                      {post.imagenUrl && (
                        <div className="w-full max-h-[460px] bg-slate-950 overflow-hidden flex items-center justify-center">
                          <img
                            src={post.imagenUrl}
                            alt="Publicación escolar"
                            className="w-full h-auto max-h-[460px] object-cover hover:scale-[1.01] transition-transform duration-300"
                          />
                        </div>
                      )}

                      {/* Reactions & Actions Toolbar */}
                      <div className="p-3 sm:p-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
                        {/* Reaction Buttons */}
                        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                          {/* 1. Me gusta (Heart) */}
                          <button
                            type="button"
                            onClick={() => handleReact(post.id, 'meGusta')}
                            className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 ${
                              hasLiked
                                ? 'bg-rose-50 border-rose-300 text-rose-600 shadow-2xs'
                                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                            }`}
                            title="Me gusta"
                          >
                            <Heart className={`w-4 h-4 ${hasLiked ? 'text-rose-500 fill-rose-500' : 'text-slate-500'}`} />
                            <span>{likeCount}</span>
                          </button>

                          {/* 2. Aplausos (Award) */}
                          <button
                            type="button"
                            onClick={() => handleReact(post.id, 'aplausos')}
                            className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 ${
                              hasApplauded
                                ? 'bg-amber-50 border-amber-300 text-amber-700 shadow-2xs'
                                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                            }`}
                            title="Aplausos & Felicitaciones"
                          >
                            <Award className={`w-4 h-4 ${hasApplauded ? 'text-amber-600 fill-amber-500' : 'text-slate-500'}`} />
                            <span>{applaudCount}</span>
                          </button>

                          {/* 3. Inspirador (Flame) */}
                          <button
                            type="button"
                            onClick={() => handleReact(post.id, 'inspirador')}
                            className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 ${
                              hasInspired
                                ? 'bg-orange-50 border-orange-300 text-orange-700 shadow-2xs'
                                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                            }`}
                            title="Inspirador"
                          >
                            <Flame className={`w-4 h-4 ${hasInspired ? 'text-orange-600 fill-orange-500' : 'text-slate-500'}`} />
                            <span>{inspireCount}</span>
                          </button>

                          {/* 4. Innovador (Sparkles) */}
                          <button
                            type="button"
                            onClick={() => handleReact(post.id, 'innovador')}
                            className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 ${
                              hasInnovated
                                ? 'bg-purple-50 border-purple-300 text-purple-700 shadow-2xs'
                                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                            }`}
                            title="Innovación & Creatividad"
                          >
                            <Sparkles className={`w-4 h-4 ${hasInnovated ? 'text-purple-600 fill-purple-400' : 'text-slate-500'}`} />
                            <span>{innovateCount}</span>
                          </button>
                        </div>

                        {/* Comments Toggle Button */}
                        <button
                          type="button"
                          onClick={() => toggleComments(post.id)}
                          className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
                        >
                          <MessageCircle className="w-4 h-4 text-primary" />
                          <span>{commentsList.length} Comentarios</span>
                        </button>
                      </div>

                      {/* Comments Section */}
                      {isCommentsOpen && (
                        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/70 space-y-3">
                          {commentsList.length > 0 && (
                            <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                              {commentsList.map((comm) => {
                                const cRole = getRoleBadge(comm.autorRol);
                                return (
                                  <div key={comm.id} className="p-3 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
                                    <div className="flex items-center justify-between text-[11px]">
                                      <div className="flex items-center gap-1.5 font-bold text-slate-900">
                                        <img
                                          src={comm.autorAvatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80'}
                                          alt=""
                                          className="w-5 h-5 rounded-full object-cover"
                                        />
                                        <span>{cleanText(comm.autorNombre)}</span>
                                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                                          {cRole.label}
                                        </span>
                                      </div>
                                      <span className="text-slate-400">Reciente</span>
                                    </div>
                                    <p className="text-xs text-slate-700 leading-normal pl-6">
                                      {cleanText(comm.contenido)}
                                    </p>
                                  </div>
                                );
                              })}
                            </div>
                          )}

                          {/* Add Comment Input */}
                          <div className="flex items-center gap-2 pt-1">
                            <input
                              type="text"
                              value={commentInputs[post.id] || ''}
                              onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                              onKeyDown={(e) => { if (e.key === 'Enter') handleAddComment(post.id); }}
                              placeholder="Escribe un comentario institucional..."
                              className="flex-1 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-primary text-slate-800"
                            />
                            <button
                              type="button"
                              onClick={() => handleAddComment(post.id)}
                              className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5"
                            >
                              <Send className="w-3 h-3" />
                              <span>Comentar</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 2: EXPLORAR & BUSCAR                                          */}
        {/* ================================================================= */}
        {activeNavTab === 'explorar' && (
          <div className="space-y-5 animate-fadeIn">
            {/* Search Input */}
            <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="relative w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar proyectos, alumnos, temas científicos o arte..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {[
                { id: 'TODOS', label: 'Todos' },
                { id: 'CIENCIA_3D', label: 'Ciencias 3D' },
                { id: 'ACADEMICO', label: 'Académico' },
                { id: 'INSTITUCIONAL', label: 'Institucional' },
                { id: 'ROBOTICA', label: 'Robótica' },
                { id: 'DEPORTES', label: 'Deportes' }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setExploreCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                    exploreCategory === cat.id
                      ? 'bg-primary text-white shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  #{cat.label}
                </button>
              ))}
            </div>

            {/* Visual Media Explore Grid (Instagram Style) */}
            {(() => {
              const exploreList = posts.filter(p => {
                const matchesCat = exploreCategory === 'TODOS' || p.categoria === exploreCategory;
                const matchesQ = !searchQuery.trim() ||
                  p.contenido?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  p.autorNombre?.toLowerCase().includes(searchQuery.toLowerCase());
                return matchesCat && matchesQ;
              });

              if (exploreList.length === 0) {
                return (
                  <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
                    <Search className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <p className="font-bold text-slate-700 text-sm">No se encontraron publicaciones en esta categoría</p>
                  </div>
                );
              }

              return (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3.5">
                  {exploreList.map((item) => {
                    const likesSum = (item.reacciones?.meGusta?.length || 0) + (item.reacciones?.aplausos?.length || 0);
                    const commSum = item.comentarios?.length || 0;
                    return (
                      <div
                        key={`exp-${item.id}`}
                        onClick={() => setSelectedExplorePost(item)}
                        className="relative aspect-square sm:aspect-[4/5] rounded-2xl overflow-hidden cursor-pointer group bg-slate-900 border border-slate-200 shadow-2xs"
                      >
                        <img
                          src={item.imagenUrl || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80'}
                          alt=""
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3 text-white">
                          <span className="text-[10px] font-extrabold text-amber-300 uppercase tracking-wider mb-1 truncate">
                            {item.categoria || 'Comunidad'}
                          </span>
                          <p className="text-xs font-semibold line-clamp-2 leading-tight mb-2">
                            {cleanText(item.contenido)}
                          </p>
                          <div className="flex items-center justify-between text-[11px] font-bold text-slate-200 border-t border-white/20 pt-1.5">
                            <span className="flex items-center gap-1">
                              <Heart className="w-3.5 h-3.5 fill-white text-white" />
                              {likesSum}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageCircle className="w-3.5 h-3.5 text-white" />
                              {commSum}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 3: REELS ESCOLARES (INSTAGRAM REELS)                           */}
        {/* ================================================================= */}
        {activeNavTab === 'reels' && (
          <div className="py-2 animate-fadeIn space-y-4">
            {reels.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
                <Film className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                <p className="font-bold text-slate-700 text-sm">No hay Reels disponibles en este momento</p>
              </div>
            ) : (() => {
              const currentReel = reels[activeReelIndex] || reels[0];
              const uId = user.id || 1;
              const isLiked = (currentReel.likes || []).includes(uId);
              const isReelSaved = savedPostIds.includes('reel-' + currentReel.id) || 
                                  savedPostIds.includes(currentReel.id + 10000) ||
                                  savedPostIds.includes(String(currentReel.id + 10000));

              return (
                <div className="flex items-center justify-center gap-3 sm:gap-5">
                  {/* Central Vertical Reel Player Card (Responsive 9:16 Aspect) */}
                  <div className="relative w-auto max-w-[320px] sm:max-w-[350px] h-[calc(100vh-230px)] max-h-[530px] min-h-[400px] aspect-[9/16] rounded-3xl overflow-hidden shadow-2xl bg-black select-none border border-slate-800 flex-shrink-0">
                    {/* Video Player */}
                    <video
                      ref={reelVideoRef}
                      src={currentReel.videoUrl}
                      poster={currentReel.posterUrl}
                      playsInline
                      autoPlay
                      loop
                      muted={isReelMuted}
                      onClick={handleToggleReelPlay}
                      className="w-full h-full object-cover cursor-pointer"
                    />

                    {/* Play/Pause Animated Indicator */}
                    {!isReelPlaying && (
                      <div 
                        onClick={handleToggleReelPlay}
                        className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-auto cursor-pointer"
                      >
                        <div className="w-16 h-16 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center shadow-2xl scale-110 transition-transform">
                          <Play className="w-8 h-8 fill-white ml-1" />
                        </div>
                      </div>
                    )}

                    {/* Top Reel Overlay Bar */}
                    <div className="absolute top-0 left-0 w-full p-4 flex items-center justify-end z-10 bg-gradient-to-b from-black/70 to-transparent">
                      <button
                        type="button"
                        onClick={() => setIsReelMuted(!isReelMuted)}
                        className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/80 transition-colors border border-white/20"
                        title={isReelMuted ? "Activar sonido" : "Silenciar"}
                      >
                        {isReelMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Right Floating Action Bar (Instagram Reels Style) */}
                    <div className="absolute right-3 bottom-20 z-20 flex flex-col items-center gap-4 text-white">
                      {/* Like Button */}
                      <button
                        type="button"
                        onClick={() => handleLikeReel(currentReel.id)}
                        className="flex flex-col items-center gap-1 group active:scale-90 transition-transform"
                        title="Me gusta"
                      >
                        <div className={`w-11 h-11 rounded-full flex items-center justify-center shadow-lg transition-colors ${
                          isLiked ? 'bg-rose-600 text-white' : 'bg-black/50 backdrop-blur-md text-white hover:bg-black/70'
                        }`}>
                          <Heart className={`w-5 h-5 ${isLiked ? 'fill-white' : ''}`} />
                        </div>
                        <span className="text-[10px] font-extrabold drop-shadow-md">{(currentReel.likes || []).length}</span>
                      </button>

                      {/* Comment Button */}
                      <button
                        type="button"
                        onClick={() => setShowReelComments(!showReelComments)}
                        className="flex flex-col items-center gap-1 group active:scale-90 transition-transform"
                        title="Comentarios"
                      >
                        <div className="w-11 h-11 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/70 shadow-lg transition-colors">
                          <MessageCircle className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-extrabold drop-shadow-md">{(currentReel.comentarios || []).length}</span>
                      </button>

                      {/* Bookmark Save Button */}
                      <button
                        type="button"
                        onClick={() => handleToggleSaveReel(currentReel.id)}
                        className="flex flex-col items-center gap-1 group active:scale-90 transition-transform"
                        title={isReelSaved ? "Quitar de guardados" : "Guardar Reel"}
                      >
                        <div className={`w-11 h-11 rounded-full flex items-center justify-center shadow-lg transition-colors ${
                          isReelSaved ? 'bg-amber-500 text-white' : 'bg-black/50 backdrop-blur-md text-white hover:bg-black/70'
                        }`}>
                          <Bookmark className={`w-5 h-5 ${isReelSaved ? 'fill-white' : ''}`} />
                        </div>
                        <span className="text-[10px] font-extrabold drop-shadow-md">
                          {isReelSaved ? 'Guardado' : 'Guardar'}
                        </span>
                      </button>

                      {/* Share Button */}
                      <button
                        type="button"
                        onClick={() => {
                          if (navigator.clipboard) {
                            navigator.clipboard.writeText(window.location.href);
                            if (addNotification) {
                              addNotification({
                                title: 'Enlace del Reel Copiado',
                                text: 'El enlace del clip educativo ha sido copiado al portapapeles.',
                                icon: 'share',
                                color: 'text-primary',
                                targetRole: user.rol
                              });
                            }
                          }
                        }}
                        className="flex flex-col items-center gap-1 group active:scale-90 transition-transform"
                        title="Compartir"
                      >
                        <div className="w-11 h-11 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/70 shadow-lg transition-colors">
                          <Share2 className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-extrabold drop-shadow-md">Compartir</span>
                      </button>
                    </div>

                    {/* Bottom Overlay: Creator info, caption, audio */}
                    <div className="absolute bottom-0 left-0 w-full p-4 pt-10 z-10 bg-gradient-to-t from-black/90 via-black/50 to-transparent text-white space-y-2 pr-16">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={currentReel.autorAvatar}
                          alt=""
                          className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-md"
                        />
                        <div className="min-w-0">
                          <h4 className="font-bold text-xs truncate leading-tight">{cleanText(currentReel.autorNombre)}</h4>
                          <span className="text-[10px] text-amber-300 font-semibold block leading-none mt-0.5">
                            {currentReel.grado || currentReel.autorRol}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-100 leading-snug line-clamp-2">
                        {cleanText(currentReel.descripcion)}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1">
                        {(currentReel.tags || []).map((t, i) => (
                          <span key={i} className="text-[10px] font-bold text-sky-300">
                            {t}
                          </span>
                        ))}
                      </div>

                      {/* Audio ticker */}
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-300 pt-1">
                        <Music className="w-3.5 h-3.5 flex-shrink-0 animate-spin" style={{ animationDuration: '6s' }} />
                        <span className="truncate">{cleanText(currentReel.audioTrack || 'Audio original institucional')}</span>
                      </div>
                    </div>

                    {/* Reel Comments Sheet */}
                    {showReelComments && (
                      <div className="absolute inset-x-0 bottom-0 top-1/3 bg-white/95 backdrop-blur-xl rounded-t-3xl p-4 z-30 flex flex-col text-slate-900 shadow-2xl animate-fadeIn">
                        <div className="flex items-center justify-between pb-2.5 border-b border-slate-200">
                          <span className="font-bold text-xs text-slate-900">
                            Comentarios ({(currentReel.comentarios || []).length})
                          </span>
                          <button onClick={() => setShowReelComments(false)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-500">
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex-1 overflow-y-auto py-2 space-y-2.5">
                          {(currentReel.comentarios || []).length === 0 ? (
                            <div className="p-6 text-center text-xs text-slate-400">Sé el primero en comentar este Reel.</div>
                          ) : (
                            (currentReel.comentarios || []).map(c => (
                              <div key={c.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                                <div className="flex items-center gap-2 font-bold text-slate-800 text-[11px] mb-1">
                                  <img src={c.autorAvatar} alt="" className="w-5 h-5 rounded-full object-cover" />
                                  <span>{cleanText(c.autorNombre)}</span>
                                </div>
                                <p className="text-slate-600 pl-7">{cleanText(c.texto)}</p>
                              </div>
                            ))
                          )}
                        </div>

                        {/* Comment Input */}
                        <form onSubmit={handleAddReelComment} className="pt-2 border-t border-slate-200 flex items-center gap-2">
                          <input
                            type="text"
                            value={reelCommentInput}
                            onChange={(e) => setReelCommentInput(e.target.value)}
                            placeholder="Añade un comentario..."
                            className="flex-1 px-3 py-1.5 rounded-full bg-slate-100 text-xs border border-slate-200 focus:outline-hidden focus:border-sky-500"
                          />
                          <button
                            type="submit"
                            disabled={!reelCommentInput.trim()}
                            className="p-1.5 rounded-full bg-sky-600 text-white disabled:opacity-40 hover:bg-sky-700 transition-colors"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>
                        </form>
                      </div>
                    )}
                  </div>

                  {/* Desktop Prev / Next navigation buttons */}
                  <div className="hidden md:flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={handlePrevReel}
                      disabled={activeReelIndex === 0}
                      className="p-2.5 rounded-full bg-white border border-slate-200 shadow-md text-slate-700 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                      title="Anterior Reel"
                    >
                      <ChevronUp className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNextReel}
                      disabled={activeReelIndex === reels.length - 1}
                      className="p-2.5 rounded-full bg-white border border-slate-200 shadow-md text-slate-700 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                      title="Siguiente Reel"
                    >
                      <ChevronDown className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 4: GUARDADOS                                                  */}
        {/* ================================================================= */}
        {activeNavTab === 'guardados' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Bookmark className="w-4 h-4 fill-amber-600" />
                </div>
                <div>
                  <h2 className="font-display font-black text-slate-900 text-lg">Elementos Guardados</h2>
                  <p className="text-[11px] text-slate-500 font-semibold">Tus publicaciones y reels favoritos guardados</p>
                </div>
              </div>
              <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                {totalSavedCount} guardado{totalSavedCount === 1 ? '' : 's'}
              </span>
            </div>

            {totalSavedCount === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center mx-auto">
                  <Bookmark className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-slate-800 text-base">No tienes elementos guardados</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Toca el icono de marcador en cualquier publicación del muro, explorador o reel para consultarla más tarde en esta sección.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* 1. REELS GUARDADOS */}
                {savedReelsList.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-black text-slate-700 uppercase tracking-wider">
                      <Film className="w-4 h-4 text-sky-600" />
                      <span>Reels Guardados ({savedReelsList.length})</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {savedReelsList.map(reel => (
                        <div key={reel.id} className="bg-white rounded-3xl p-3.5 border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex gap-3.5 items-center">
                          <div
                            onClick={() => {
                              const rIdx = reels.findIndex(r => r.id === reel.id);
                              if (rIdx !== -1) {
                                setActiveReelIndex(rIdx);
                                setActiveNavTab('reels');
                              }
                            }}
                            className="relative w-20 h-28 rounded-2xl overflow-hidden bg-black flex-shrink-0 cursor-pointer group shadow-xs"
                          >
                            <img src={reel.posterUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                            <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                              <div className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-slate-900 group-hover:scale-110 transition-transform shadow-md">
                                <Play className="w-4 h-4 fill-slate-900 ml-0.5" />
                              </div>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 mb-1">
                              <img src={reel.autorAvatar} alt="" className="w-5 h-5 rounded-full object-cover" />
                              <span className="font-bold text-slate-900 text-xs truncate">{cleanText(reel.autorNombre)}</span>
                            </div>
                            <p className="text-xs text-slate-600 line-clamp-2 mb-2.5 leading-snug">{cleanText(reel.descripcion)}</p>
                            <div className="flex items-center justify-between pt-1.5 border-t border-slate-100">
                              <button
                                type="button"
                                onClick={() => {
                                  const rIdx = reels.findIndex(r => r.id === reel.id);
                                  if (rIdx !== -1) {
                                    setActiveReelIndex(rIdx);
                                    setActiveNavTab('reels');
                                  }
                                }}
                                className="text-xs font-extrabold text-sky-600 hover:text-sky-700 flex items-center gap-1"
                              >
                                <Play className="w-3 h-3 fill-sky-600" />
                                <span>Ver Reel</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRemoveSavedReel(reel.id)}
                                className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1"
                              >
                                <Bookmark className="w-3.5 h-3.5 fill-rose-600" />
                                <span>Quitar</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. PUBLICACIONES GUARDADAS */}
                {savedPostsList.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-black text-slate-700 uppercase tracking-wider">
                      <Grid className="w-4 h-4 text-primary" />
                      <span>Publicaciones Guardadas ({savedPostsList.length})</span>
                    </div>
                    <div className="space-y-4">
                      {savedPostsList.map(p => (
                        <div key={p.id} className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs hover:border-slate-300 transition-all space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                              <img src={p.autorAvatar} alt="" className="w-9 h-9 rounded-full object-cover" />
                              <div>
                                <div className="font-bold text-slate-900 text-xs">{cleanText(p.autorNombre)}</div>
                                <div className="text-[11px] text-slate-500">{p.autorRol} • {p.tiempo}</div>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => toggleSavePost(p.id)}
                              className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1"
                            >
                              <Bookmark className="w-3.5 h-3.5 fill-rose-600" />
                              <span>Quitar</span>
                            </button>
                          </div>
                          <p className="text-xs text-slate-800 whitespace-pre-wrap">{cleanText(p.contenido)}</p>
                          {p.multimediaUrl && (
                            <div className="rounded-2xl overflow-hidden max-h-72 border border-slate-100">
                              <img src={p.multimediaUrl} alt="" className="w-full h-full object-cover" />
                            </div>
                          )}
                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                            <span>{p.reacciones?.likes || 0} reacciones</span>
                            <span>{(p.comentarios || []).length} comentarios</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

      </div>

      {/* =================================================================== */}
      {/* SIDE DRAWER: ACTIVITY & INTERACTIONS (INSTAGRAM STYLE)             */}
      {/* =================================================================== */}
      {showActivityModal && createPortal(
        <div 
          className="fixed inset-0 w-screen h-screen bg-slate-950/40 backdrop-blur-xs select-none transition-opacity duration-300 animate-fadeIn"
          style={{ zIndex: 99999, isolation: 'isolate' }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowActivityModal(false);
          }}
        >
          <div 
            className="fixed top-0 bottom-0 right-0 h-full w-full sm:w-[420px] md:w-[460px] max-w-full bg-white shadow-2xl flex flex-col border-l border-slate-200/90 animate-slideInRight z-10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header (Instagram Style) */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-white sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center flex-shrink-0">
                  <Heart className="w-5 h-5 fill-rose-600 text-rose-600" />
                </div>
                <div>
                  <h3 className="font-display font-black text-lg text-slate-900 leading-tight">
                    Actividad
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold">
                    Reacciones y comentarios en tus publicaciones
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowActivityModal(false)}
                className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
                title="Cerrar ventana lateral"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Activity List */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-2.5 scrollbar-thin">
              {activities.length === 0 ? (
                <div className="py-16 text-center text-slate-400 space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-400 flex items-center justify-center mx-auto">
                    <Heart className="w-7 h-7" />
                  </div>
                  <p className="text-sm font-bold text-slate-700">No tienes actividad reciente aún.</p>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto">
                    Las reacciones y comentarios en tus publicaciones institucionales aparecerán aquí.
                  </p>
                </div>
              ) : (
                activities.map((act) => {
                  const isLike = act.tipo === 'LIKE' || act.tipo === 'REACCION';
                  return (
                    <div
                      key={act.id}
                      className={`flex items-start gap-3.5 p-3.5 rounded-2xl border transition-all ${
                        !act.leido ? 'bg-rose-50/60 border-rose-100' : 'bg-slate-50/70 border-slate-100 hover:bg-slate-50'
                      }`}
                    >
                      <img
                        src={act.autorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                        alt=""
                        className="w-11 h-11 rounded-full object-cover border border-slate-200 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-slate-800 leading-snug">
                          <span className="font-bold text-slate-900">{cleanText(act.autorNombre)}</span>{' '}
                          {isLike ? (
                            <span>reaccionó a tu publicación</span>
                          ) : (
                            <span>comentó: <span className="italic text-slate-600">"{cleanText(act.detalle || '')}"</span></span>
                          )}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-[10px] font-semibold text-slate-400">{act.tiempo}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-md font-bold bg-white border border-slate-200 text-slate-600">
                            {act.autorRol}
                          </span>
                        </div>
                      </div>
                      <div className="pt-1 flex-shrink-0">
                        {isLike ? (
                          <div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center text-rose-500">
                            <Heart className="w-4 h-4 fill-rose-500" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-sky-50 flex items-center justify-center text-sky-500">
                            <MessageCircle className="w-4 h-4 text-sky-500" />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">
                {activities.length} interaccion{activities.length === 1 ? '' : 'es'}
              </span>
              <button
                type="button"
                onClick={() => setShowActivityModal(false)}
                className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* =================================================================== */}
      {/* MODAL: EXPLORE POST LIGHTBOX                                        */}
      {/* =================================================================== */}
      {selectedExplorePost && createPortal(
        <div 
          className="fixed inset-0 w-screen h-screen bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 select-none animate-fadeIn"
          style={{ zIndex: 99999, isolation: 'isolate' }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedExplorePost(null);
          }}
        >
          <div 
            className="bg-white rounded-3xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl space-y-4 max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <img
                  src={selectedExplorePost.autorAvatar}
                  alt=""
                  className="w-10 h-10 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <h3 className="font-display font-black text-sm text-slate-900">
                    {cleanText(selectedExplorePost.autorNombre)}
                  </h3>
                  <span className="text-[11px] text-slate-500 font-semibold block">
                    {selectedExplorePost.autorRol} • {selectedExplorePost.tiempo}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedExplorePost(null)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {selectedExplorePost.multimediaUrl && (
                <div className="rounded-2xl overflow-hidden border border-slate-100">
                  <img
                    src={selectedExplorePost.multimediaUrl}
                    alt=""
                    className="w-full max-h-80 object-cover"
                  />
                </div>
              )}
              <p className="text-xs text-slate-800 leading-relaxed whitespace-pre-wrap">
                {cleanText(selectedExplorePost.contenido)}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => toggleSavePost(selectedExplorePost.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                  savedPostIds.includes(selectedExplorePost.id)
                    ? 'bg-amber-50 border-amber-200 text-amber-700'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${savedPostIds.includes(selectedExplorePost.id) ? 'fill-amber-600' : ''}`} />
                <span>{savedPostIds.includes(selectedExplorePost.id) ? 'Guardado' : 'Guardar'}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveNavTab('muro');
                  setSelectedExplorePost(null);
                }}
                className="px-4 py-1.5 rounded-xl bg-primary text-white font-bold text-xs hover:bg-primary-dark transition-colors"
              >
                Ver en Muro
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* =================================================================== */}
      {showProfileActionsModal && createPortal(
        <div 
          className="fixed inset-0 w-screen h-screen bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 select-none animate-fadeIn"
          style={{ zIndex: 99999, isolation: 'isolate' }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowProfileActionsModal(false);
          }}
        >
          <div 
            className="bg-white rounded-3xl max-w-sm w-full p-6 border border-slate-200 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* User Profile Header */}
            <div className="flex items-center gap-3.5 pb-3 border-b border-slate-100">
              <img
                src={user.avatarUrl || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80'}
                alt=""
                className="w-12 h-12 rounded-2xl object-cover border border-slate-200 shadow-xs"
              />
              <div className="min-w-0 flex-1">
                <h3 className="font-display font-black text-base text-slate-900 truncate">
                  {user.nombre}
                </h3>
                <span className="text-xs text-slate-500 font-semibold block">
                  {user.rol} • {user.grado || 'Institucional'}
                </span>
              </div>
              <button 
                onClick={() => setShowProfileActionsModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Action Options (Instagram Style) */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => {
                  setShowProfileActionsModal(false);
                  setShowCreateStoryModal(true);
                }}
                className="w-full p-3.5 rounded-2xl bg-amber-50 hover:bg-amber-100/80 border border-amber-200 text-amber-950 font-bold text-xs sm:text-sm flex items-center gap-3 transition-colors text-left"
              >
                <div className="w-9 h-9 rounded-xl bg-amber-200 text-amber-800 flex items-center justify-center">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <span className="block font-bold">Subir Historia</span>
                  <span className="text-[11px] font-normal text-amber-800">Comparte fotos y momentos en el carrusel</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowProfileActionsModal(false);
                  setShowCreatePostModal(true);
                }}
                className="w-full p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-900 font-bold text-xs sm:text-sm flex items-center gap-3 transition-colors text-left"
              >
                <div className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center">
                  <PlusSquare className="w-5 h-5" />
                </div>
                <div>
                  <span className="block font-bold">Nueva Publicación</span>
                  <span className="text-[11px] font-normal text-slate-500">Publica en el muro general del colegio</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowProfileActionsModal(false);
                  setChatPanelOpen(true);
                }}
                className="w-full p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-900 font-bold text-xs sm:text-sm flex items-center gap-3 transition-colors text-left"
              >
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <span className="block font-bold">Abrir Chat Escolar</span>
                  <span className="text-[11px] font-normal text-slate-500">Mensajería en tiempo real con docentes y compañeros</span>
                </div>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowProfileActionsModal(false)}
              className="w-full py-2.5 rounded-xl text-slate-500 hover:text-slate-800 text-xs font-semibold text-center"
            >
              Cerrar
            </button>
          </div>
        </div>,
        document.body
      )}

      {/* =================================================================== */}
      {/* 2. DEDICATED NEW POST MODAL (INSTAGRAM POPUP STYLE)                */}
      {/* =================================================================== */}
      {showCreatePostModal && createPortal(
        <div 
          className="fixed inset-0 w-screen h-screen bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 select-none animate-fadeIn"
          style={{ zIndex: 99999, isolation: 'isolate' }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowCreatePostModal(false);
          }}
        >
          <div 
            className="bg-white rounded-3xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-display font-black text-lg text-slate-900 flex items-center gap-2">
                <PlusSquare className="w-5 h-5 text-primary" />
                <span>Crear Nueva Publicación</span>
              </h3>
              <button onClick={() => setShowCreatePostModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePublishPost} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Categoría o Etiqueta
                </label>
                <select
                  value={newPostCategory}
                  onChange={(e) => setNewPostCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800"
                >
                  <option value="ACADEMICO">#Académico</option>
                  <option value="EVENTO">#EventoEscolar</option>
                  <option value="CIENCIA_3D">#Ciencia3D</option>
                  <option value="DEPORTES">#Deportes</option>
                  <option value="INSTITUCIONAL">#Institucional</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Contenido de la Publicación *
                </label>
                <textarea
                  rows={4}
                  required
                  value={newPostText}
                  onChange={(e) => setNewPostText(e.target.value)}
                  placeholder="Escribe sobre eventos académicos, proyectos del colegio, olimpiadas o avisos..."
                  className="w-full p-3.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Photo selector / presets */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Foto de la Publicación (Opcional)
                </label>

                {newPostImage ? (
                  <div className="relative rounded-2xl overflow-hidden border border-slate-200 max-h-48 group">
                    <img src={newPostImage} alt="" className="w-full h-auto object-cover max-h-48" />
                    <button
                      type="button"
                      onClick={() => setNewPostImage('')}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/80 text-white hover:bg-rose-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="block p-3 rounded-xl border-2 border-dashed border-slate-300 hover:border-primary text-center cursor-pointer bg-slate-50 transition-colors">
                      <Image className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                      <span className="text-xs font-semibold text-slate-600">Subir foto desde tu dispositivo</span>
                      <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, setNewPostImage)} className="hidden" />
                    </label>

                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                      {presetPhotos.map((preset, pIdx) => (
                        <div
                          key={pIdx}
                          onClick={() => setNewPostImage(preset.url)}
                          className="relative rounded-xl overflow-hidden border border-slate-200 cursor-pointer h-12 w-20 flex-shrink-0"
                          title={preset.label}
                        >
                          <img src={preset.url} alt="" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreatePostModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isPublishingPost || !newPostText.trim()}
                  className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isPublishingPost ? 'Compartiendo...' : 'Compartir Publicación'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* =================================================================== */}
      {/* 3. DEDICATED NEW STORY MODAL (INSTAGRAM STYLE)                      */}
      {/* =================================================================== */}
      {showCreateStoryModal && createPortal(
        <div 
          className="fixed inset-0 w-screen h-screen bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 select-none animate-fadeIn"
          style={{ zIndex: 99999, isolation: 'isolate' }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowCreateStoryModal(false);
          }}
        >
          <div 
            className="bg-white rounded-3xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-display font-black text-lg text-slate-900 flex items-center gap-2">
                <Camera className="w-5 h-5 text-amber-700" />
                <span>Subir Historia Escolar</span>
              </h3>
              <button onClick={() => setShowCreateStoryModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePublishStory} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Título de la Historia *</label>
                <input
                  type="text"
                  required
                  value={storyTitle}
                  onChange={(e) => setStoryTitle(e.target.value)}
                  placeholder="Ej. Proyecto de Ciencias Terminado"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Texto o Mensaje Corto</label>
                <textarea
                  rows={2}
                  value={storyText}
                  onChange={(e) => setStoryText(e.target.value)}
                  placeholder="Comparte una reflexión o momento con el colegio..."
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Fondo / Gradiente de Color</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { label: 'Oro EduCol', val: 'from-amber-700 to-amber-950' },
                    { label: 'Ciencia Azul', val: 'from-blue-700 to-indigo-950' },
                    { label: 'Esmeralda', val: 'from-emerald-700 to-teal-950' },
                    { label: 'Carmesí', val: 'from-rose-700 to-rose-950' }
                  ].map((grad, gIdx) => (
                    <div
                      key={gIdx}
                      onClick={() => setStoryGradient(grad.val)}
                      className={`h-9 rounded-xl bg-gradient-to-r ${grad.val} cursor-pointer border-2 transition-all flex items-center justify-center text-[10px] text-white font-bold text-center px-1 ${
                        storyGradient === grad.val ? 'border-primary scale-105 shadow-xs' : 'border-transparent'
                      }`}
                    >
                      {grad.label}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Foto o Imagen (Opcional)</label>
                <label className="block p-3 rounded-xl border-2 border-dashed border-slate-300 hover:border-primary text-center cursor-pointer bg-slate-50 transition-colors">
                  <Camera className="w-4 h-4 text-slate-400 mx-auto mb-1" />
                  <span className="text-xs font-semibold text-slate-600">
                    {storyImage ? 'Foto cargada con éxito' : 'Cargar foto de historia'}
                  </span>
                  <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, setStoryImage)} className="hidden" />
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateStoryModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isPublishingStory || !storyTitle.trim()}
                  className="px-6 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isPublishingStory ? 'Subiendo...' : 'Publicar en Tu Historia'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* =================================================================== */}
      {/* 4. INSTAGRAM-STYLE FULLSCREEN STORY VIEWER (PORTALED OUTSIDE DOM)   */}
      {/*    Renders into document.body at z-[99999] so header and drawer are   */}
      {/*    COMPLETELY HIDDEN beneath it!                                     */}
      {/* =================================================================== */}
      {activeStoryIndex !== null && stories[activeStoryIndex] && createPortal(
        <div className="fixed inset-0 w-screen h-screen bg-slate-950 flex items-center justify-center p-0 sm:p-4 select-none animate-fadeIn" style={{ zIndex: 99999, isolation: 'isolate' }}>
          {(() => {
            const curStory = stories[activeStoryIndex];
            const roleBadge = getRoleBadge(curStory.autorRol);

            return (
              <div className="relative w-full sm:max-w-md h-full sm:h-[92vh] sm:max-h-[750px] bg-black sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between border-0 sm:border sm:border-slate-800">
                
                {/* Background (Image or Gradient) */}
                {curStory.imagenUrl ? (
                  <img
                    src={curStory.imagenUrl}
                    alt={curStory.titulo}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div className={`absolute inset-0 bg-gradient-to-br ${curStory.gradiente || 'from-primary to-amber-950'}`} />
                )}
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/90" />

                {/* Top Progress Bar & Header */}
                <div className="relative z-30 p-4 sm:p-5 space-y-3">
                  <div className="flex items-center gap-1.5 w-full">
                    {stories.map((_, sIdx) => {
                      const isPast = sIdx < activeStoryIndex;
                      const isCurrent = sIdx === activeStoryIndex;
                      const widthPercent = isPast ? 100 : isCurrent ? storyProgress : 0;
                      return (
                        <div key={sIdx} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-white transition-all duration-75 ease-linear"
                            style={{ width: `${widthPercent}%` }}
                          />
                        </div>
                      );
                    })}
                  </div>

                  {/* Header Author Info & Close Button */}
                  <div className="flex items-center justify-between text-white pt-1">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={curStory.autorAvatar}
                        alt=""
                        className="w-9 h-9 rounded-full object-cover border-2 border-white/80"
                      />
                      <div>
                        <h4 className="font-bold text-xs sm:text-sm leading-tight text-white">
                          {cleanText(curStory.autorNombre)}
                        </h4>
                        <span className="text-[10px] text-slate-300">
                          {roleBadge.label} • Historia Escolar
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setIsStoryPaused(!isStoryPaused)}
                        className="p-1.5 rounded-full bg-black/50 text-white hover:bg-black/80 transition-colors"
                        title={isStoryPaused ? "Reanudar" : "Pausar"}
                      >
                        {isStoryPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => setActiveStoryIndex(null)}
                        className="p-1.5 rounded-full bg-black/50 text-white hover:bg-rose-600 transition-colors"
                        title="Cerrar historia"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Touch navigation zones */}
                <div className="absolute inset-0 z-10 flex">
                  <div onClick={handlePrevStory} className="w-1/3 h-full cursor-pointer" />
                  <div onClick={() => setIsStoryPaused(!isStoryPaused)} className="w-1/3 h-full cursor-pointer" />
                  <div onClick={handleNextStory} className="w-1/3 h-full cursor-pointer" />
                </div>

                {/* Left/Right Arrow buttons on desktop */}
                <button
                  onClick={handlePrevStory}
                  className="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full bg-black/50 text-white items-center justify-center hover:bg-black/80 transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={handleNextStory}
                  className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full bg-black/50 text-white items-center justify-center hover:bg-black/80 transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>

                {/* Story Footer Text & Reply */}
                <div className="relative z-30 p-5 space-y-3 pb-8 sm:pb-6">
                  <div className="space-y-1">
                    <h3 className="font-display font-black text-lg sm:text-xl text-white">
                      {cleanText(curStory.titulo)}
                    </h3>
                    {curStory.texto && (
                      <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                        {cleanText(curStory.texto)}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="text"
                      placeholder={`Responder a ${curStory.autorNombre.split(' ')[0]}...`}
                      className="flex-1 px-4 py-2.5 rounded-full bg-white/20 backdrop-blur-md text-white placeholder-slate-300 text-xs border border-white/30 focus:outline-none"
                    />
                    <button
                      onClick={() => {
                        if (addNotification) {
                          addNotification({
                            title: 'Reacción a Historia',
                            text: `A ${user.nombre} le gustó la historia de ${curStory.autorNombre}.`,
                            icon: 'favorite',
                            color: 'text-rose-600',
                            targetRole: 'ESTUDIANTE'
                          });
                        }
                      }}
                      className="p-2.5 rounded-full bg-rose-600 text-white hover:scale-105 transition-transform"
                    >
                      <Heart className="w-4 h-4 fill-white" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })()}
        </div>,
        document.body
      )}

      {/* =================================================================== */}
      {/* LINKEDIN-STYLE FLOATING CHAT WIDGET (Portal to body)                */}
      {/* =================================================================== */}
      {createPortal(
        <div className="fixed bottom-0 right-4 sm:right-6 flex items-end gap-2 z-[9990] pointer-events-none" style={{ maxWidth: 'calc(100vw - 2rem)' }}>

          {/* Minimized Chat Bubbles */}
          {minimizedChats.map(convId => {
            const conv = chatConversations.find(c => c.id === convId);
            if (!conv) return null;
            return (
              <div key={`min-${convId}`} className="pointer-events-auto relative group">
                <button
                  onClick={() => restoreChatWindow(convId)}
                  className="w-12 h-12 rounded-full shadow-lg border-2 border-white overflow-hidden hover:scale-110 transition-transform"
                  title={cleanText(conv.nombre)}
                >
                  <img src={conv.avatar} alt="" className="w-full h-full object-cover" />
                </button>
                <button
                  onClick={() => closeChatWindow(convId)}
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-slate-700 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
                {conv.noLeidos > 0 && (
                  <span className="absolute -top-1 -left-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] font-extrabold flex items-center justify-center">
                    {conv.noLeidos}
                  </span>
                )}
              </div>
            );
          })}

          {/* Open Chat Windows (LinkedIn Style) */}
          {openChatWindows.map(convId => {
            const conv = chatConversations.find(c => c.id === convId);
            if (!conv) return null;
            const msgs = chatMessages[convId] || [];

            return (
              <div key={`chat-${convId}`} className="pointer-events-auto w-[340px] h-[420px] bg-white rounded-t-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-fadeIn">
                {/* Chat Window Header */}
                <div className="flex items-center justify-between px-3 py-2.5 bg-white border-b border-slate-200 gap-2 flex-shrink-0">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="relative flex-shrink-0">
                      <img src={conv.avatar} alt="" className="w-8 h-8 rounded-full object-cover border border-slate-200" />
                      {conv.enLinea && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-xs text-slate-900 truncate">{cleanText(conv.nombre)}</h4>
                      <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                        <Circle className="w-1.5 h-1.5 fill-emerald-500 text-emerald-500" />
                        <span>En l&iacute;nea</span>
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5 flex-shrink-0">
                    <button onClick={() => minimizeChatWindow(convId)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-500">
                      <Minimize2 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => closeChatWindow(convId)} className="p-1 rounded-lg hover:bg-rose-100 text-slate-500 hover:text-rose-600">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Chat Messages Body */}
                <div className="flex-1 overflow-y-auto p-3 space-y-2.5 bg-slate-50/60">
                  {msgs.length === 0 ? (
                    <div className="text-center text-xs text-slate-400 py-8">No hay mensajes a&uacute;n.</div>
                  ) : (
                    msgs.map(msg => {
                      const isMe = msg.emisorId === (user.id || 1) || msg.emisorNombre === user.nombre;
                      return (
                        <div key={msg.id} className={`flex gap-1.5 max-w-[85%] ${isMe ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}>
                          {!isMe && (
                            <img
                              src={msg.emisorAvatar || conv.avatar}
                              alt=""
                              className="w-6 h-6 rounded-full object-cover flex-shrink-0 mt-0.5"
                            />
                          )}
                          <div>
                            <div className={`px-3 py-2 rounded-2xl text-xs leading-relaxed ${
                              isMe
                                ? 'bg-primary text-white rounded-tr-sm'
                                : 'bg-white text-slate-900 border border-slate-200 rounded-tl-sm'
                            }`}>
                              <p className="whitespace-pre-wrap">{cleanText(msg.texto)}</p>
                            </div>
                            <div className={`text-[9px] text-slate-400 mt-0.5 px-1 flex items-center gap-1 ${isMe ? 'justify-end' : ''}`}>
                              <span>{new Date(msg.fecha).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              {isMe && <CheckCheck className="w-2.5 h-2.5 text-primary" />}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={el => { chatMessagesEndRefs.current[convId] = el; }} />
                </div>

                {/* Chat Input */}
                <div className="p-2 border-t border-slate-200 bg-white flex items-center gap-1.5 flex-shrink-0">
                  <input
                    type="text"
                    value={chatInputs[convId] || ''}
                    onChange={e => setChatInputs(prev => ({ ...prev, [convId]: e.target.value }))}
                    onKeyDown={e => { if (e.key === 'Enter') handleSendChatMessage(convId); }}
                    placeholder="Escribe un mensaje..."
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <button
                    onClick={() => handleSendChatMessage(convId)}
                    disabled={!chatInputs[convId]?.trim()}
                    className="p-2 rounded-xl bg-primary hover:bg-primary-dark disabled:opacity-40 text-white transition-colors active:scale-95"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}

          {/* Conversations List Panel (LinkedIn Messaging Panel) */}
          {chatPanelOpen && (
            <div className="pointer-events-auto w-[340px] h-[480px] bg-white rounded-t-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-fadeIn">
              {/* Panel Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-white flex-shrink-0">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-primary" />
                  <h3 className="font-bold text-sm text-slate-900">Chat Institucional</h3>
                  {totalUnreadChat > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-extrabold">
                      {totalUnreadChat}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5">
                  {totalUnreadChat > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      className="text-[10px] text-primary hover:underline font-bold px-1.5 py-0.5 rounded-md hover:bg-primary/5"
                      title="Marcar todos como leídos"
                    >
                      Leídos
                    </button>
                  )}
                  <button onClick={() => setChatPanelOpen(false)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-500">
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Search */}
              <div className="px-3 py-2 border-b border-slate-100 bg-slate-50/50 flex-shrink-0">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={chatSearchFilter}
                    onChange={e => setChatSearchFilter(e.target.value)}
                    placeholder="Buscar contacto..."
                    className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-white border border-slate-200 text-[11px] focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Conversations List */}
              <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
                {filteredChatConversations.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400">No se encontraron contactos.</div>
                ) : (
                  filteredChatConversations.map(conv => (
                    <button
                      key={conv.id}
                      onClick={() => openChatWindow(conv.id)}
                      className="w-full p-3 flex items-center gap-2.5 hover:bg-slate-50 transition-colors text-left"
                    >
                      <div className="relative flex-shrink-0">
                        <img src={conv.avatar} alt="" className="w-10 h-10 rounded-full object-cover border border-slate-200" />
                        {conv.enLinea && (
                          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <h4 className="font-bold text-xs text-slate-900 truncate">{cleanText(conv.nombre)}</h4>
                          <span className="text-[10px] text-slate-400 whitespace-nowrap">
                            {conv.ultimaFecha ? new Date(conv.ultimaFecha).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-[11px] text-slate-500 truncate">{cleanText(conv.ultimoMensaje || 'Sin mensajes')}</p>
                          {conv.noLeidos > 0 && (
                            <span className="w-4 h-4 rounded-full bg-primary text-white font-extrabold text-[9px] flex items-center justify-center flex-shrink-0">
                              {conv.noLeidos}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Docked Collapsed LinkedIn Chat Bar when chatPanelOpen is false */}
          {!chatPanelOpen && (
            <div className="pointer-events-auto">
              <button
                onClick={() => setChatPanelOpen(true)}
                className="bg-white hover:bg-slate-50 border border-slate-200/90 shadow-xl rounded-t-2xl px-4 py-2.5 flex items-center gap-2.5 text-slate-800 transition-all hover:-translate-y-0.5 active:translate-y-0"
              >
                <div className="relative">
                  <MessageSquare className="w-4 h-4 text-primary" />
                  {totalUnreadChat > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-rose-600 text-white text-[8px] font-extrabold flex items-center justify-center animate-pulse">
                      {totalUnreadChat}
                    </span>
                  )}
                </div>
                <span className="font-bold text-xs text-slate-900">Mensajes</span>
                {totalUnreadChat > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-rose-100 text-rose-700 text-[10px] font-bold">
                    {totalUnreadChat}
                  </span>
                )}
                <ChevronUp className="w-3.5 h-3.5 text-slate-500 ml-1" />
              </button>
            </div>
          )}

        </div>,
        document.body
      )}

    </div>
  );
}
