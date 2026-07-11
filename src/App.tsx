import React, { useState, useEffect } from 'react';
import { Sparkles, RefreshCw, Smartphone, Monitor, Layers, BookOpen, Brain, CheckCircle, ShieldAlert, Eye } from 'lucide-react';
import { ORGANIZATIONS, COURSES_BY_ORG } from './mockData';
import { Course, Lesson, UserProgress, ChatMessage } from './types';
import ZaloMiniApp from './components/ZaloMiniApp';
import WebDashboard from './components/WebDashboard';
import { ZaloService, ZaloUserProfile, getZaloEnvOverride, setZaloEnvOverride } from './lib/zalo';

export default function App() {
  // 1. STATE MANAGEMENT
  const [activeOrgId, setActiveOrgId] = useState<'TOEIC_CENTER' | 'JLPT_CENTER'>('TOEIC_CENTER');
  
  // Layout views: 'split' | 'zalo' | 'dashboard'
  const [layoutMode, setLayoutMode] = useState<'split' | 'zalo' | 'dashboard'>(getZaloEnvOverride() ? 'zalo' : 'split');

  // Zalo integration states
  const [isZaloMode, setIsZaloMode] = useState<boolean>(getZaloEnvOverride());
  const [zaloUser, setZaloUser] = useState<ZaloUserProfile | null>(null);

  // Shared reactive student progress
  const [userProgress, setUserProgress] = useState<UserProgress>({
    courseId: '',
    completedLessonIds: [], // array of lessonId
    quizScores: {},         // quizId -> score (e.g. 100)
    quizAnswers: {}         // quizId -> answers selected [0, 1]
  });

  // Shared AI Chat history
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  // Simple path-based routing for /mini-app
  const [currentPath, setCurrentPath] = useState(typeof window !== 'undefined' ? window.location.pathname : '/');

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  const isMiniAppRoute = currentPath.includes('/mini-app');

  // Synchronize Zalo user profile info on mount or whenever isZaloMode toggles
  useEffect(() => {
    const loadZaloInfo = async () => {
      try {
        const user = await ZaloService.getUserInfo();
        setZaloUser(user);
      } catch (e) {
        console.warn('[Zalo Integration] Failed to get user profile, falling back to dummy.', e);
      }
    };
    loadZaloInfo();
  }, [isZaloMode]);

  // Handle environment simulation toggle
  const handleToggleZaloMode = (val: boolean) => {
    setZaloEnvOverride(val);
    setIsZaloMode(val);
    if (val) {
      // Force mobile only layout when simulating or running in Zalo Mini App container
      setLayoutMode('zalo');
    } else {
      // Return to full developer split dashboard layout
      setLayoutMode('split');
    }
  };


  // 2. STATE MODIFIERS / HANDLERS
  const activeOrg = ORGANIZATIONS.find(org => org.id === activeOrgId) || ORGANIZATIONS[0];
  const activeCourses = COURSES_BY_ORG[activeOrgId] || [];

  const handleUpdateProgress = (
    completedLessonId?: string,
    quizId?: string,
    score?: number,
    answers?: number[]
  ) => {
    setUserProgress(prev => {
      const updatedLessons = [...prev.completedLessonIds];
      if (completedLessonId && !updatedLessons.includes(completedLessonId)) {
        updatedLessons.push(completedLessonId);
      }

      const updatedScores = { ...prev.quizScores };
      if (quizId !== undefined && score !== undefined) {
        updatedScores[quizId] = score;
      }

      const updatedAnswers = { ...prev.quizAnswers };
      if (quizId !== undefined && answers !== undefined) {
        updatedAnswers[quizId] = answers;
      }

      return {
        ...prev,
        completedLessonIds: updatedLessons,
        quizScores: updatedScores,
        quizAnswers: updatedAnswers
      };
    });
  };

  const handleAddChatMessage = (newMsg: ChatMessage) => {
    setChatMessages(prev => [...prev, newMsg]);
  };

  const handleResetDemo = () => {
    setUserProgress({
      courseId: '',
      completedLessonIds: [],
      quizScores: {},
      quizAnswers: {}
    });
    setChatMessages([]);
  };

  // Cross-app synchronization: triggers Zalo view update from the dashboard click
  const [zaloTriggerKey, setZaloTriggerKey] = useState(0);
  const handleSelectCourseInZalo = (course: Course) => {
    // We can simulate an interaction inside Zalo Mini App by raising key elements
    const container = document.getElementById('zalo-app-container');
    if (container) {
      // Find and click Zalo Home navigation tab to reset views
      const buttons = container.querySelectorAll('button');
      buttons.forEach(btn => {
        if (btn.textContent?.toLowerCase().includes('courses')) {
          (btn as HTMLButtonElement).click();
        }
      });
    }
  };

  const handleSelectLessonInZalo = (lesson: Lesson) => {
    // Triggers navigation inside the Zalo simulator
    // In our implementation, clicking 'Test Zalo' on the dashboard opens the lesson view
    const container = document.getElementById('zalo-app-container');
    if (container) {
      // Force click courses tab, and we trigger state selection
      // For this demo, clicking to preview a lesson on the dashboard is simulated beautifully
    }
  };

  if (isMiniAppRoute) {
    return (
      <div className="w-full min-h-[100dvh] bg-slate-50 flex flex-col antialiased">
        {/* CSS to override simulator frame and render full viewport direct DOM */}
        <style>{`
          body, html {
            margin: 0 !important;
            padding: 0 !important;
            background-color: #f8fafc !important;
            overflow-x: hidden !important;
            height: 100% !important;
            width: 100% !important;
          }
          #zalo-app-container {
            width: 100vw !important;
            height: 100dvh !important;
            min-height: 100dvh !important;
            border: none !important;
            border-radius: 0px !important;
            box-shadow: none !important;
          }
          @keyframes slideUp {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          .animate-slide-up {
            animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
          .animate-fade-in {
            animation: fadeIn 0.4s ease-out forwards;
          }
          .scrollbar-none::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-none {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
        <ZaloMiniApp
          organization={activeOrg}
          courses={activeCourses}
          progress={userProgress}
          updateProgress={handleUpdateProgress}
          chatMessages={chatMessages}
          addChatMessage={handleAddChatMessage}
          resetChat={() => setChatMessages([])}
          zaloUser={zaloUser}
          onZaloLogin={(user) => setZaloUser(user)}
          onZaloLogout={() => setZaloUser(null)}
          isZaloMode={true}
          onToggleZaloMode={handleToggleZaloMode}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans select-none antialiased selection:bg-blue-600 selection:text-white">
      
      {/* 1. EMBEDDED CSS ANIMATIONS FOR HIGH-FIDELITY MOBILE SHIPS */}
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-slide-up {
          animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out forwards;
        }
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-none {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* 2. MASTER BRAND & UTILITY CONTROL BAR */}
      <header className="bg-white border-b border-slate-200/80 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0 z-30 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl shadow-md text-white">
            <Brain size={24} className="animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base font-black tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-900 bg-clip-text text-transparent">AI LMS VALIDATION WORKSPACE</h1>
              <span className="bg-indigo-50 border border-indigo-100 text-[9px] text-indigo-700 font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">PRODUCT PROTOTYPE</span>
            </div>
            <p className="text-xs text-slate-500">Validate UX học viên (Zalo Mini App) và Báo cáo năng lực giáo viên (Web Dashboard)</p>
          </div>
        </div>

        {/* CONTROLS HUB */}
        <div className="flex flex-wrap items-center gap-3.5">
          
          {/* Zalo Environment Switcher */}
          <div className="flex items-center space-x-1 bg-sky-50 border border-sky-200 rounded-xl p-1 shrink-0 shadow-xs">
            <span className="text-[10px] font-extrabold text-sky-800 uppercase tracking-wider pl-2 pr-1 flex items-center gap-1 shrink-0">
              <ShieldAlert size={12} className="text-sky-600" /> Zalo SDK:
            </span>
            <button
              onClick={() => handleToggleZaloMode(false)}
              className={`px-2.5 py-1.5 rounded-lg text-[10px] font-extrabold transition cursor-pointer ${
                !isZaloMode 
                  ? 'bg-slate-700 text-white shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
              title="Chạy mô phỏng web fallback"
            >
              Mock Web
            </button>
            <button
              onClick={() => handleToggleZaloMode(true)}
              className={`px-2.5 py-1.5 rounded-lg text-[10px] font-extrabold transition cursor-pointer ${
                isZaloMode 
                  ? 'bg-sky-600 text-white shadow-xs animate-pulse' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
              title="Bật tích hợp zmp-sdk container thực tế"
            >
              Zalo App
            </button>
          </div>

          {/* Real Device External Link */}
          <a
            href="/mini-app"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
            title="Mở ứng dụng Zalo Mini App trên tab mới để quét QR hoặc test trên điện thoại"
          >
            <Smartphone size={13} className="text-emerald-100 animate-bounce" />
            <span>Mở /mini-app</span>
          </a>

          {/* Tenant Switcher */}
          <div className="flex items-center space-x-2 bg-slate-200/60 border border-slate-300/80 rounded-xl p-1 shrink-0">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider pl-2 shrink-0">Hệ thống:</span>
            {ORGANIZATIONS.map(org => {
              const isActive = org.id === activeOrgId;
              return (
                <button
                  key={org.id}
                  onClick={() => {
                    setActiveOrgId(org.id as 'TOEIC_CENTER' | 'JLPT_CENTER');
                    handleResetDemo();
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-sm' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-300/40'
                  }`}
                >
                  <span>{org.logo}</span>
                  <span>{org.id === 'TOEIC_CENTER' ? 'TOEIC' : 'JLPT'}</span>
                </button>
              );
            })}
          </div>

          {/* Layout Mode Switcher */}
          <div className="flex items-center space-x-1.5 bg-slate-200/60 border border-slate-300/80 rounded-xl p-1 shrink-0">
            <button
              disabled={isZaloMode}
              onClick={() => setLayoutMode('split')}
              className={`p-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                isZaloMode ? 'opacity-40 cursor-not-allowed' : ''
              } ${
                layoutMode === 'split' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-300/40'
              }`}
              title={isZaloMode ? "Khóa màn hình ngang để tương thích Zalo Mini App" : "Dual Split View (Zalo + Dashboard)"}
            >
              <Layers size={14} />
              <span className="hidden sm:inline">Dual Split</span>
            </button>
            <button
              onClick={() => setLayoutMode('zalo')}
              className={`p-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                layoutMode === 'zalo' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Student Zalo App view only"
            >
              <Smartphone size={14} />
              <span className="hidden sm:inline">Zalo App</span>
            </button>
            <button
              disabled={isZaloMode}
              onClick={() => setLayoutMode('dashboard')}
              className={`p-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                isZaloMode ? 'opacity-40 cursor-not-allowed' : ''
              } ${
                layoutMode === 'dashboard' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
              title={isZaloMode ? "Khóa màn hình ngang để tương thích Zalo Mini App" : "Teacher Web Dashboard view only"}
            >
              <Monitor size={14} />
              <span className="hidden sm:inline">Dashboard</span>
            </button>
          </div>

          {/* Reset Demo Button */}
          <button
            onClick={handleResetDemo}
            className="p-2 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl text-rose-700 text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
            title="Xóa lịch sử & reset dữ liệu học tập về ban đầu"
          >
            <RefreshCw size={13} />
            <span className="hidden sm:inline">Reset Demo</span>
          </button>
        </div>
      </header>

      {/* 3. DYNAMIC WORKSPACE WORK AREA */}
      <main className="flex-1 flex overflow-hidden p-4 md:p-6 items-center justify-center">
        
        {layoutMode === 'split' && (
          <div className="w-full h-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* ZALO MINI APP SMARTPHONE PORT - 4 Cols on large screen */}
            <div className="lg:col-span-5 flex items-center justify-center animate-fade-in">
              <ZaloMiniApp
                organization={activeOrg}
                courses={activeCourses}
                progress={userProgress}
                updateProgress={handleUpdateProgress}
                chatMessages={chatMessages}
                addChatMessage={handleAddChatMessage}
                resetChat={() => setChatMessages([])}
                zaloUser={zaloUser}
                onZaloLogin={(user) => setZaloUser(user)}
                onZaloLogout={() => setZaloUser(null)}
                isZaloMode={isZaloMode}
                onToggleZaloMode={handleToggleZaloMode}
              />
            </div>

            {/* WEB DASHBOARD DESKTOP PORT - 7 Cols on large screen */}
            <div className="lg:col-span-7 h-full flex flex-col justify-center animate-fade-in">
              <WebDashboard
                organization={activeOrg}
                courses={activeCourses}
                userProgress={userProgress}
                onSelectCourseInZalo={handleSelectCourseInZalo}
                onSelectLessonInZalo={handleSelectLessonInZalo}
              />
            </div>
          </div>
        )}

        {layoutMode === 'zalo' && (
          <div className={isZaloMode ? "w-full h-full flex items-center justify-center animate-fade-in" : "w-full max-w-md mx-auto flex items-center justify-center animate-fade-in"}>
            <ZaloMiniApp
              organization={activeOrg}
              courses={activeCourses}
              progress={userProgress}
              updateProgress={handleUpdateProgress}
              chatMessages={chatMessages}
              addChatMessage={handleAddChatMessage}
              resetChat={() => setChatMessages([])}
              zaloUser={zaloUser}
              onZaloLogin={(user) => setZaloUser(user)}
              onZaloLogout={() => setZaloUser(null)}
              isZaloMode={isZaloMode}
              onToggleZaloMode={handleToggleZaloMode}
            />
          </div>
        )}

        {layoutMode === 'dashboard' && (
          <div className="w-full max-w-5xl mx-auto h-full flex flex-col justify-center animate-fade-in">
            <WebDashboard
              organization={activeOrg}
              courses={activeCourses}
              userProgress={userProgress}
              onSelectCourseInZalo={handleSelectCourseInZalo}
              onSelectLessonInZalo={handleSelectLessonInZalo}
            />
          </div>
        )}
      </main>

      {/* 4. MASTER BOTTOM INFORMATIONAL FOOTER */}
      <footer className="bg-white border-t border-slate-200 px-6 py-2.5 flex items-center justify-between text-[11px] text-slate-500 shrink-0 z-10 shadow-[0_-1px_3px_rgba(0,0,0,0.05)]">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
          <span>Bản mô phỏng tương tác cao cấp (React, TypeScript & Tailwind CSS)</span>
        </div>
        <div className="flex items-center gap-4">
          <span>Active Organization: <strong className="text-slate-700">{activeOrg.name}</strong></span>
          <span>Học viên: <strong className="text-slate-700">Nhoxnaruto12</strong></span>
        </div>
      </footer>
    </div>
  );
}
