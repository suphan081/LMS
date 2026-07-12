import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { ORGANIZATIONS, COURSES_BY_ORG } from './mockData';
import { Course, Lesson, UserProgress, ChatMessage } from './types';
import ZaloMiniApp from './components/ZaloMiniApp';
import { ZaloService, ZaloUserProfile } from './lib/zalo';
import './index.css';

function App() {
  const [activeOrg, setActiveOrg] = useState(ORGANIZATIONS[0]);
  const activeCourses = COURSES_BY_ORG[activeOrg.id] || [];

  // Zalo integration states
  const [zaloUser, setZaloUser] = useState<ZaloUserProfile | null>(null);

  // Shared reactive student progress
  const [userProgress, setUserProgress] = useState<UserProgress>({
    courseId: '',
    completedLessonIds: [],
    quizScores: {},
    quizAnswers: {}
  });

  // Shared AI Chat history
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  // Load user profile on mount
  useEffect(() => {
    const loadZaloInfo = async () => {
      try {
        const user = await ZaloService.getUserInfo();
        setZaloUser(user);
      } catch (e) {
        console.warn('[Zalo Integration] Failed to get user profile', e);
      }
    };
    loadZaloInfo();
  }, []);

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

  return (
    <div className="w-full h-[100dvh] min-h-[100dvh] max-h-[100dvh] bg-slate-50 flex flex-col antialiased overflow-hidden">
      <style>{`
        body, html {
          margin: 0 !important;
          padding: 0 !important;
          background-color: #f8fafc !important;
          overflow: hidden !important;
          height: 100% !important;
          width: 100% !important;
        }
        #zalo-app-container {
          width: 100% !important;
          height: 100% !important;
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
        onToggleZaloMode={() => {}}
        onSelectOrganization={(orgId) => {
          const org = ORGANIZATIONS.find(o => o.id === orgId);
          if (org) {
            setActiveOrg(org);
            setUserProgress({
              courseId: '',
              completedLessonIds: [],
              quizScores: {},
              quizAnswers: {}
            });
            setChatMessages([]);
          }
        }}
      />
    </div>
  );
}

const container = document.getElementById('app');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
