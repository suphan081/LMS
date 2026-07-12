import React, { useState, useRef, useEffect } from 'react';
import { 
  Home, BookOpen, MessageSquare, User, Play, FileText, 
  CheckCircle, Award, ChevronRight, Send, Sparkles, Brain, 
  ChevronLeft, X, AlertTriangle, Check, Video, Info, RefreshCw,
  LogOut, Phone, ShieldCheck, HelpCircle
} from 'lucide-react';
import { Course, Lesson, Quiz, QuizQuestion, ChatMessage, UserProgress } from '../types';
import { mockSummary, mockExplain, mockWeakness, mockChatResponse, delay } from '../mockAI';
import { ZaloUserProfile, ZaloService } from '../lib/zalo';
import { ORGANIZATIONS } from '../mockData';

interface ZaloMiniAppProps {
  organization: { id: string; name: string; logo: string; themeColor: string };
  courses: Course[];
  progress: UserProgress;
  updateProgress: (completedLessonId?: string, quizId?: string, score?: number, answers?: number[]) => void;
  chatMessages: ChatMessage[];
  addChatMessage: (msg: ChatMessage) => void;
  resetChat: () => void;
  zaloUser: ZaloUserProfile | null;
  onZaloLogin: (user: ZaloUserProfile) => void;
  onZaloLogout: () => void;
  isZaloMode: boolean;
  onToggleZaloMode: (val: boolean) => void;
  onSelectOrganization?: (orgId: string) => void;
}

export default function ZaloMiniApp({
  organization,
  courses,
  progress,
  updateProgress,
  chatMessages,
  addChatMessage,
  resetChat,
  zaloUser,
  onZaloLogin,
  onZaloLogout,
  isZaloMode,
  onToggleZaloMode,
  onSelectOrganization
}: ZaloMiniAppProps) {

  // Navigation states
  // 'home' | 'courses' | 'chat' | 'profile'
  const [activeTab, setActiveTab] = useState<'home' | 'courses' | 'chat' | 'profile'>('home');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);

  // Video/PDF play simulation state
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const videoInterval = useRef<NodeJS.Timeout | null>(null);

  // Interactive Quiz states
  const [quizSelectedAnswers, setQuizSelectedAnswers] = useState<{ [qId: string]: number }>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

  // Bottom Sheet for AI Response
  const [aiSheetOpen, setAiSheetOpen] = useState(false);
  const [aiSheetTitle, setAiSheetTitle] = useState('');
  const [aiSheetContent, setAiSheetContent] = useState('');
  const [aiSheetLoading, setAiSheetLoading] = useState(false);
  const [aiSheetType, setAiSheetType] = useState<'summary' | 'explanation' | 'quiz'>('summary');

  // Local chat input
  const [chatInput, setChatInput] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Real Zalo client detection
  const [isZaloBrowser, setIsZaloBrowser] = useState(false);

  useEffect(() => {
    const isZalo = /Zalo/i.test(navigator.userAgent);
    setIsZaloBrowser(isZalo);
    if (isZalo) {
      console.log('[Zalo WebView Detected] Môi trường Zalo đã được thiết lập thành công!');
      // Wait for a second and trigger native-like responses
      setTimeout(() => {
        try {
          ZaloService.showToast('Đã kết nối Zalo WebView!');
          ZaloService.vibrate();
        } catch (e) {
          console.warn('[Zalo Service] Could not show toast', e);
        }
      }, 1000);
    }
  }, []);

  // Reset Sub-views when organization switches
  useEffect(() => {
    setSelectedCourse(null);
    setSelectedLesson(null);
    setActiveQuiz(null);
    setAiSheetOpen(false);
    setActiveTab('home');
  }, [organization.id]);

  // Synchronize Zalo Native Navigation Bar Title
  useEffect(() => {
    let title = organization.name;
    if (activeQuiz) {
      title = "Kiểm Tra Nhanh AI";
    } else if (selectedLesson) {
      title = selectedLesson.title;
    } else if (selectedCourse) {
      title = selectedCourse.title;
    } else {
      switch (activeTab) {
        case 'home':
          title = organization.name;
          break;
        case 'courses':
          title = "Khóa Học";
          break;
        case 'chat':
          title = "Trợ Lý AI";
          break;
        case 'profile':
          title = "Cá Nhân";
          break;
      }
    }
    ZaloService.setNavigationBarTitle(title);
  }, [selectedCourse, selectedLesson, activeQuiz, activeTab, organization]);

  // Scroll to bottom of chat
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isAiTyping]);

  // Handle video playback simulation
  useEffect(() => {
    if (videoPlaying) {
      videoInterval.current = setInterval(() => {
        setVideoProgress(prev => {
          if (prev >= 100) {
            setVideoPlaying(false);
            if (videoInterval.current) clearInterval(videoInterval.current);
            // Auto complete lesson
            if (selectedLesson && selectedCourse) {
              updateProgress(selectedLesson.id);
            }
            return 100;
          }
          return prev + 5;
        });
      }, 500);
    } else {
      if (videoInterval.current) clearInterval(videoInterval.current);
    }
    return () => {
      if (videoInterval.current) clearInterval(videoInterval.current);
    };
  }, [videoPlaying, selectedLesson, selectedCourse]);

  // Start a lesson
  const handleStartLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setVideoPlaying(false);
    setVideoProgress(0);
    // Mark reading text as immediately complete
    if (lesson.contentType === 'text' || lesson.contentType === 'pdf') {
      updateProgress(lesson.id);
    }
  };

  // Get completed status
  const isLessonCompleted = (lessonId: string) => {
    return progress.completedLessonIds.includes(lessonId);
  };

  // AI Summary button handler
  const handleShowSummary = async (lesson: Lesson) => {
    setAiSheetType('summary');
    setAiSheetTitle('Tóm Tắt Bài Học Thông Minh');
    setAiSheetLoading(true);
    setAiSheetOpen(true);
    
    await delay(1200); // Simulate network
    
    const summary = mockSummary(lesson);
    setAiSheetContent(summary);
    setAiSheetLoading(false);
  };

  // AI Custom Quiz request from lesson screen
  const handleGenerateCustomQuiz = async (lesson: Lesson) => {
    setAiSheetType('quiz');
    setAiSheetTitle('Tạo Đề Luyện Tập Bằng AI');
    setAiSheetLoading(true);
    setAiSheetOpen(true);
    
    await delay(1500);
    
    // Find pre-made quiz for this lesson
    const course = courses.find(c => c.lessons.some(l => l.id === lesson.id));
    const matchedQuiz = course?.quizzes.find(q => q.lessonId === lesson.id);

    if (matchedQuiz) {
      setAiSheetContent(`### ⚡ Đã Tạo Thành Công Đề Thi Thử!
AI đã phân tích kỹ lý thuyết của bài **"${lesson.title}"** và thiết kế một đề thi trắc nghiệm gồm **${matchedQuiz.questions.length} câu hỏi** bám sát bẫy đề thi TOEIC/JLPT thực tế.

#### Chi tiết đề:
*   **Chủ đề:** Trọng tâm kiến thức ${lesson.title}
*   **Số lượng:** ${matchedQuiz.questions.length} câu hỏi trắc nghiệm.
*   **Mức độ:** Sát với đề thi thật.
*   **Phản hồi:** AI chấm điểm và giải thích chi tiết ngay khi nộp bài.`);
      
      // Save matched quiz for CTA
      setAiSheetLoading(false);
    } else {
      setAiSheetContent(`### ❌ Lỗi Tạo Đề
AI không tìm thấy tài liệu ngân hàng câu hỏi phù hợp cho bài học này. Hãy thử bài học khác!`);
      setAiSheetLoading(false);
    }
  };

  const handleStartQuizFromSheet = (lesson: Lesson) => {
    const course = courses.find(c => c.lessons.some(l => l.id === lesson.id));
    const matchedQuiz = course?.quizzes.find(q => q.lessonId === lesson.id);
    if (matchedQuiz) {
      setActiveQuiz(matchedQuiz);
      setQuizSelectedAnswers({});
      setQuizSubmitted(false);
      setQuizScore(null);
      setActiveQuestionIndex(0);
      setAiSheetOpen(false);
    }
  };

  // Submit Quiz
  const handleSubmitQuiz = () => {
    if (!activeQuiz) return;
    
    // Calculate score
    let correctCount = 0;
    const answerIndices: number[] = [];
    activeQuiz.questions.forEach((q, idx) => {
      const selected = quizSelectedAnswers[q.id];
      answerIndices.push(selected !== undefined ? selected : -1);
      if (selected === q.correctIndex) {
        correctCount++;
      }
    });

    const score = Math.round((correctCount / activeQuiz.questions.length) * 100);
    setQuizScore(score);
    setQuizSubmitted(true);
    
    // Save to global progress
    updateProgress(undefined, activeQuiz.id, score, answerIndices);
  };

  // Get AI detailed explanation for a single question
  const handleShowQuestionExplanation = (question: QuizQuestion, selectedIdx: number) => {
    setAiSheetType('explanation');
    setAiSheetTitle('Giải thích đáp án bằng AI');
    setAiSheetContent(mockExplain(question, selectedIdx));
    setAiSheetOpen(true);
  };

  // Handle chat submission
  const handleSendChatMessage = async () => {
    if (!chatInput.trim()) return;

    const userMsg: ChatMessage = {
      id: `chat-${Date.now()}-u`,
      sender: 'user',
      text: chatInput,
      timestamp: new Date(),
    };

    addChatMessage(userMsg);
    setChatInput('');
    setIsAiTyping(true);

    await delay(1200); // AI Thinking

    const aiText = mockChatResponse(userMsg.text, chatMessages, {
      orgId: organization.id,
      activeCourse: selectedCourse || undefined,
      activeLesson: selectedLesson || undefined,
      quizScores: progress.quizScores,
    });

    const aiMsg: ChatMessage = {
      id: `chat-${Date.now()}-ai`,
      sender: 'ai',
      text: aiText,
      timestamp: new Date(),
    };

    addChatMessage(aiMsg);
    setIsAiTyping(false);
  };

  // Generate radar values and weaknesses
  const report = mockWeakness(progress.quizScores, organization.id);

  // Return to course list or main screens
  const handleBackToCourseDetail = () => {
    setSelectedLesson(null);
    setActiveQuiz(null);
  };

  const handleBackToCourseList = () => {
    setSelectedCourse(null);
    setSelectedLesson(null);
    setActiveQuiz(null);
  };

  // Switch to Chat with custom initial context question
  const handleAskAIAboutLesson = (lesson: Lesson) => {
    setActiveTab('chat');
    const introMsg: ChatMessage = {
      id: `chat-auto-${Date.now()}`,
      sender: 'user',
      text: `Giải thích cho mình phần kiến thức trọng tâm của bài học "${lesson.title}"`,
      timestamp: new Date()
    };
    addChatMessage(introMsg);
    
    // Trigger auto reply
    setIsAiTyping(true);
    setTimeout(() => {
      const resp = mockChatResponse(introMsg.text, [], {
        orgId: organization.id,
        activeCourse: selectedCourse || undefined,
        activeLesson: lesson,
        quizScores: progress.quizScores
      });
      addChatMessage({
        id: `chat-auto-reply-${Date.now()}`,
        sender: 'ai',
        text: resp,
        timestamp: new Date()
      });
      setIsAiTyping(false);
    }, 1000);
  };

  // Simulated organization theme colors
  const themeBgColor = organization.themeColor === 'indigo' ? 'bg-indigo-600' : 'bg-rose-600';
  const themeTextClass = organization.themeColor === 'indigo' ? 'text-indigo-600' : 'text-rose-600';
  const themeBorderClass = organization.themeColor === 'indigo' ? 'border-indigo-600' : 'border-rose-600';

  const isInRealZalo = ZaloService.isRealZaloContainer() || isZaloBrowser;

  const wrapperClass = "relative flex flex-col w-full h-full min-h-0 bg-slate-50 overflow-hidden select-none";

  return (
    <div 
      id="zalo-app-container" 
      className={wrapperClass}
      style={{
        paddingTop: isInRealZalo ? 'calc(56px + env(safe-area-inset-top, 0px))' : undefined
      }}
    >

      {/* 1. ZALO MINI APP HEADER */}
      {!isInRealZalo && (
        <div className={`flex items-center justify-between px-4 h-12 ${themeBgColor} text-white font-medium shadow-sm shrink-0 z-20`}>
          <div className="flex items-center space-x-2">
            {(selectedCourse || activeTab !== 'home') ? (
              <button 
                id="zalo-back-btn"
                onClick={() => {
                  if (activeQuiz) {
                    setActiveQuiz(null);
                  } else if (selectedLesson) {
                    setSelectedLesson(null);
                  } else if (selectedCourse) {
                    setSelectedCourse(null);
                  } else {
                    setActiveTab('home');
                  }
                }} 
                className="p-1 hover:bg-black/15 rounded-full transition"
              >
                <ChevronLeft size={20} />
              </button>
            ) : (
              <span className="text-lg">{organization.logo}</span>
            )}
            <div className="leading-tight">
              <h4 className="text-xs font-semibold tracking-wider opacity-80 uppercase">ZALO MINI APP</h4>
              <h3 className="text-sm font-bold truncate max-w-[160px]">
                {selectedCourse ? selectedCourse.title : organization.name}
              </h3>
            </div>
          </div>

          {/* Traditional Zalo Capsule Controls */}
          <div className="flex items-center bg-black/20 border border-white/10 rounded-full py-1 px-3 space-x-3 text-xs">
            <button onClick={() => {}} className="opacity-85 hover:opacity-100">
              <span className="font-extrabold tracking-tight">•••</span>
            </button>
            <div className="w-[1px] h-3 bg-white/20"></div>
            <button 
              onClick={() => {
                setSelectedCourse(null);
                setSelectedLesson(null);
                setActiveQuiz(null);
                setAiSheetOpen(false);
                setActiveTab('home');
              }} 
              className="opacity-85 hover:opacity-100"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* NEW: FIXED ACADEMY SWITCHER ROW */}
      {!activeQuiz && !selectedLesson && !selectedCourse && (
        <div className="px-4 py-3 bg-white border-b border-gray-100 flex items-center justify-between shrink-0 z-10 select-none">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-800">HỌC VIỆN:</span>
          <div className="flex gap-2">
            {ORGANIZATIONS.map(org => {
              const isActive = org.id === organization.id;
              return (
                <button
                  key={org.id}
                  onClick={() => {
                    if (onSelectOrganization) {
                      onSelectOrganization(org.id);
                    }
                  }}
                  className={`px-3 py-1.5 rounded-full text-[10px] font-black tracking-wide transition flex items-center gap-1.5 cursor-pointer shadow-sm ${
                    isActive 
                      ? org.themeColor === 'indigo'
                        ? 'bg-blue-600 text-white'
                        : 'bg-rose-600 text-white'
                      : 'bg-slate-700 text-slate-100 hover:bg-slate-600 hover:text-white'
                  }`}
                >
                  <span className="text-xs">{org.logo}</span>
                  <span>{org.id === 'TOEIC_CENTER' ? 'TOEIC' : 'JLPT'}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. MAIN SCROLLABLE APP CONTENT AREA */}
      <div className="flex-1 overflow-y-auto relative scrollbar-none flex flex-col pb-4">
        
        {/* VIEW 1: ACTIVE QUIZ SCREEN */}
        {activeQuiz && (
          <div id="quiz-view" className="p-4 flex-1 flex flex-col bg-white">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
              <div>
                <h3 className="font-bold text-gray-800 text-sm">Kiểm Tra Nhanh AI</h3>
                <p className="text-xs text-gray-500">Bài: {selectedLesson?.title}</p>
              </div>
              <span className="bg-orange-50 text-orange-600 text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
                <Brain size={10} /> AI Powered
              </span>
            </div>

            {!quizSubmitted ? (
              <div className="flex-1 flex flex-col">
                {/* Progress Indicators */}
                <div className="flex gap-1 mb-4">
                  {activeQuiz.questions.map((_, idx) => (
                    <div 
                      key={idx} 
                      className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                        idx === activeQuestionIndex 
                          ? 'bg-blue-600' 
                          : idx < activeQuestionIndex 
                            ? 'bg-emerald-500' 
                            : 'bg-gray-100'
                      }`}
                    ></div>
                  ))}
                </div>

                {/* Active Question Box */}
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 mb-4">
                  <span className="text-[10px] font-bold text-blue-600 tracking-wider uppercase">Câu hỏi {activeQuestionIndex + 1}/{activeQuiz.questions.length}</span>
                  <p className="font-medium text-gray-800 text-sm mt-1 leading-relaxed">
                    {activeQuiz.questions[activeQuestionIndex].question}
                  </p>
                </div>

                {/* Multiple Choice Options */}
                <div className="space-y-2.5 flex-1">
                  {activeQuiz.questions[activeQuestionIndex].options.map((opt, oIdx) => {
                    const isSelected = quizSelectedAnswers[activeQuiz.questions[activeQuestionIndex].id] === oIdx;
                    return (
                      <button
                        key={oIdx}
                        onClick={() => {
                          setQuizSelectedAnswers(prev => ({
                            ...prev,
                            [activeQuiz.questions[activeQuestionIndex].id]: oIdx
                          }));
                        }}
                        className={`w-full text-left p-3.5 rounded-xl border text-xs font-medium transition-all flex items-start space-x-2 ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50/50 text-blue-700 font-semibold shadow-sm'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 ${
                          isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300 text-gray-500 bg-gray-50'
                        }`}>
                          {String.fromCharCode(65 + oIdx)}
                        </span>
                        <span className="leading-tight">{opt}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Navigation Buttons */}
                <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between gap-3">
                  {activeQuestionIndex > 0 ? (
                    <button
                      onClick={() => setActiveQuestionIndex(prev => prev - 1)}
                      className="px-4 py-2 text-xs font-semibold border border-gray-200 text-gray-600 rounded-lg bg-gray-50 hover:bg-gray-100"
                    >
                      Quay lại
                    </button>
                  ) : (
                    <div></div>
                  )}

                  {activeQuestionIndex < activeQuiz.questions.length - 1 ? (
                    <button
                      onClick={() => setActiveQuestionIndex(prev => prev + 1)}
                      disabled={quizSelectedAnswers[activeQuiz.questions[activeQuestionIndex].id] === undefined}
                      className="px-5 py-2.5 text-xs font-semibold bg-gray-800 hover:bg-gray-900 disabled:opacity-50 text-white rounded-lg ml-auto transition"
                    >
                      Câu tiếp theo
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmitQuiz}
                      disabled={Object.keys(quizSelectedAnswers).length < activeQuiz.questions.length}
                      className="px-6 py-2.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-lg flex items-center gap-1.5 ml-auto shadow-md transition"
                    >
                      <CheckCircle size={14} /> Nộp bài cho AI
                    </button>
                  )}
                </div>
              </div>
            ) : (
              // Quiz Completed & AI Score Screen
              <div className="flex-1 flex flex-col justify-between">
                <div className="text-center py-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 text-blue-600 rounded-full mb-3 shadow-inner">
                    <Award size={36} />
                  </div>
                  <h3 className="font-extrabold text-gray-800 text-lg">Hoàn Thành Quiz!</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Kết quả phân tích đã gửi đến dashboard</p>

                  {/* Circular Score display */}
                  <div className="my-5 inline-block relative">
                    <div className="text-4xl font-extrabold text-blue-600 leading-none">
                      {quizScore}%
                    </div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">ĐIỂM SỐ</div>
                  </div>

                  <div className="text-xs bg-gray-50 border border-gray-100 rounded-xl p-3 text-left leading-relaxed text-gray-700 mb-4">
                    <span className="font-bold text-blue-600">💡 Đánh giá của AI:</span>{' '}
                    {quizScore && quizScore >= 80 
                      ? 'Tuyệt vời! Bạn đã nắm bắt rất tốt các bẫy ngữ pháp của bài học này. Chú ý giữ vững phong độ.' 
                      : 'Có vẻ bạn vẫn hơi nhầm lẫn các phương án bẫy mà AI đưa ra. Hãy xem chi tiết giải thích phía dưới.'}
                  </div>

                  {/* Review Questions with custom AI Explanation triggers */}
                  <div className="text-left space-y-3 max-h-[220px] overflow-y-auto pr-1">
                    <h4 className="font-bold text-xs text-gray-800 border-b pb-1">Xem lại câu hỏi:</h4>
                    {activeQuiz.questions.map((q, idx) => {
                      const selectedIdx = quizSelectedAnswers[q.id];
                      const isCorrect = selectedIdx === q.correctIndex;
                      return (
                        <div key={q.id} className={`p-2.5 rounded-lg border text-xs ${isCorrect ? 'border-emerald-100 bg-emerald-50/20' : 'border-rose-100 bg-rose-50/20'}`}>
                          <div className="flex items-start justify-between gap-1">
                            <span className="font-semibold text-gray-800">Câu {idx + 1}: {q.question.substring(0, 50)}...</span>
                            <span className={`text-[10px] font-bold uppercase shrink-0 px-1.5 py-0.5 rounded-full ${isCorrect ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                              {isCorrect ? 'Đúng' : 'Sai'}
                            </span>
                          </div>
                          <button
                            onClick={() => handleShowQuestionExplanation(q, selectedIdx)}
                            className="mt-2 text-[10px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 bg-white border border-blue-100 px-2 py-1 rounded"
                          >
                            <Sparkles size={10} /> Xem giải thích chi tiết của AI
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex gap-2">
                  <button
                    onClick={() => {
                      setQuizSelectedAnswers({});
                      setQuizSubmitted(false);
                      setQuizScore(null);
                      setActiveQuestionIndex(0);
                    }}
                    className="flex-1 py-2 text-xs font-semibold border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 bg-white"
                  >
                    Thử lại
                  </button>
                  <button
                    onClick={() => {
                      setActiveQuiz(null);
                      // Return to lesson or details
                    }}
                    className="flex-1 py-2 text-xs font-bold bg-blue-600 text-white rounded-xl hover:bg-blue-700"
                  >
                    Xong
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: ACTIVE LESSON SCREEN */}
        {selectedLesson && !activeQuiz && (
          <div id="lesson-view" className="flex-1 flex flex-col bg-white">
            {/* Header */}
            <div className="p-3 border-b border-gray-100 flex items-center space-x-2 shrink-0">
              <button onClick={handleBackToCourseDetail} className="p-1 text-gray-500 hover:bg-gray-100 rounded-full">
                <ChevronLeft size={18} />
              </button>
              <div className="overflow-hidden">
                <h4 className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">BÀI HỌC CHI TIẾT</h4>
                <h3 className="text-xs font-bold text-gray-800 truncate">{selectedLesson.title}</h3>
              </div>
            </div>

            {/* Simulated Media Player */}
            <div className="bg-slate-900 aspect-video relative flex flex-col items-center justify-center text-white select-none overflow-hidden shrink-0">
              {selectedLesson.contentType === 'video' ? (
                <>
                  <div className="absolute inset-0 bg-slate-950/70 flex flex-col items-center justify-center p-4">
                    <Video size={36} className="text-blue-400 mb-2 animate-pulse" />
                    <p className="text-xs text-center text-gray-300 font-medium px-4">{selectedLesson.title}</p>
                    <p className="text-[10px] text-gray-400 mt-1">Video Stream Simulator ({selectedLesson.duration})</p>
                  </div>
                  
                  {/* Playback Simulation Bar */}
                  <div className="absolute bottom-0 inset-x-0 h-1 bg-gray-800">
                    <div 
                      className="h-full bg-blue-500 transition-all duration-300" 
                      style={{ width: `${videoProgress}%` }}
                    ></div>
                  </div>

                  {/* Controller Button */}
                  <button 
                    onClick={() => setVideoPlaying(!videoPlaying)}
                    className="absolute z-10 p-3 bg-blue-600/90 hover:bg-blue-600 rounded-full shadow-lg hover:scale-105 transition"
                  >
                    {videoPlaying ? (
                      <span className="block w-4 h-4 border-l-4 border-r-4 border-white"></span>
                    ) : (
                      <Play size={16} fill="white" className="ml-0.5" />
                    )}
                  </button>

                  {videoProgress > 0 && (
                    <span className="absolute bottom-2 right-2 text-[9px] bg-black/60 px-1.5 py-0.5 rounded font-mono text-gray-300">
                      {videoProgress}%
                    </span>
                  )}
                </>
              ) : (
                <div className="p-4 flex flex-col items-center justify-center text-center">
                  <FileText size={36} className="text-blue-400 mb-2" />
                  <p className="text-xs font-semibold px-4">{selectedLesson.title}</p>
                  <p className="text-[10px] text-slate-400 mt-1">E-Doc/PDF Simulator ({selectedLesson.duration})</p>
                  <span className="mt-3 bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <Check size={10} /> Đã Đọc Xong
                  </span>
                </div>
              )}
            </div>

            {/* Quick Summary Section */}
            <div className="p-4 flex-1 overflow-y-auto space-y-4">
              <div>
                <h4 className="font-bold text-gray-800 text-xs mb-1">Giới thiệu bài học:</h4>
                <p className="text-xs text-gray-600 leading-relaxed bg-slate-50 border border-slate-100 rounded-xl p-3.5">
                  {selectedLesson.summary}
                </p>
              </div>

              {/* CORE AI ACTIONS PANEL */}
              <div className="bg-gradient-to-br from-indigo-50/60 to-purple-50/60 border border-indigo-100 rounded-2xl p-4 space-y-3">
                <div className="flex items-center space-x-1.5">
                  <Sparkles size={16} className="text-indigo-600 animate-pulse" />
                  <h4 className="font-extrabold text-xs text-indigo-950 uppercase tracking-wider">CÔNG CỤ HỌC TẬP AI</h4>
                </div>

                <p className="text-[11px] text-indigo-800 leading-relaxed font-medium">
                  Trợ lý AI giúp tối ưu hóa việc học thông qua tóm tắt lý thuyết bẫy đề thi và tạo đề thi thử cá nhân hóa.
                </p>

                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  <button
                    onClick={() => handleShowSummary(selectedLesson)}
                    className="flex flex-col items-center justify-center p-3 bg-white border border-indigo-200 hover:border-indigo-400 rounded-xl hover:shadow-sm text-center transition"
                  >
                    <Sparkles className="text-indigo-600 mb-1" size={16} />
                    <span className="text-[10px] font-extrabold text-indigo-950">AI Summary</span>
                    <span className="text-[8px] text-gray-400">Tóm tắt bẫy đề</span>
                  </button>
                  <button
                    onClick={() => handleGenerateCustomQuiz(selectedLesson)}
                    className="flex flex-col items-center justify-center p-3 bg-white border border-indigo-200 hover:border-indigo-400 rounded-xl hover:shadow-sm text-center transition"
                  >
                    <Brain className="text-purple-600 mb-1" size={16} />
                    <span className="text-[10px] font-extrabold text-purple-950">Generate Quiz</span>
                    <span className="text-[8px] text-gray-400">Luyện tập nhanh</span>
                  </button>
                </div>

                <button
                  onClick={() => handleAskAIAboutLesson(selectedLesson)}
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold rounded-xl flex items-center justify-center gap-1 shadow-sm transition"
                >
                  <MessageSquare size={13} /> Ask AI (Hỏi Trợ Lý AI Về Bài)
                </button>
              </div>

              {/* Progress Indicator */}
              <div className="flex items-center justify-between border-t border-gray-100 pt-4 text-xs">
                <span className="text-gray-500 font-medium">Trạng thái hoàn thành:</span>
                {isLessonCompleted(selectedLesson.id) ? (
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle size={14} /> Hoàn Thành
                  </span>
                ) : (
                  <span className="text-amber-600 font-semibold flex items-center gap-1">
                    <AlertTriangle size={14} /> Chưa Hoàn Thành {selectedLesson.contentType === 'video' && '(Xem hết video)'}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: COURSE DETAIL VIEW */}
        {selectedCourse && !selectedLesson && !activeQuiz && (
          <div id="course-detail-view" className="p-4 space-y-4">
            <button 
              onClick={handleBackToCourseList}
              className="inline-flex items-center text-xs font-bold text-gray-500 hover:text-gray-800 transition"
            >
              <ChevronLeft size={16} /> Quay lại danh sách
            </button>

            {/* Course Banner */}
            <div className={`p-4 rounded-2xl bg-gradient-to-r from-slate-800 to-slate-900 text-white flex items-center justify-between relative overflow-hidden shadow-md`}>
              <div className="z-10 max-w-[70%]">
                <span className="bg-white/20 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-widest">{selectedCourse.level}</span>
                <h2 className="font-extrabold text-sm mt-1 leading-snug">{selectedCourse.title}</h2>
                <p className="text-[10px] text-gray-300 mt-1">{selectedCourse.lessons.length} bài học • {selectedCourse.quizzes.length} đề thi thử</p>
              </div>
              <span className="text-4xl filter drop-shadow opacity-95 shrink-0 z-10">{selectedCourse.thumbnail}</span>
              <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
            </div>

            {/* Progress Gauge */}
            {(() => {
              const totalLessons = selectedCourse.lessons.length;
              const completedCount = selectedCourse.lessons.filter(l => isLessonCompleted(l.id)).length;
              const completionPercentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
              return (
                <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600 font-semibold">Tiến độ khóa học:</span>
                    <span className="text-blue-600 font-extrabold">{completionPercentage}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full transition-all duration-500"
                      style={{ width: `${completionPercentage}%` }}
                    ></div>
                  </div>
                  <p className="text-[10px] text-gray-400">Đã học xong: {completedCount}/{totalLessons} bài học</p>
                </div>
              );
            })()}

            {/* Lesson List */}
            <div className="space-y-2.5">
              <h3 className="font-bold text-xs text-gray-800 uppercase tracking-wider pl-1">Danh sách bài học</h3>
              {selectedCourse.lessons.map((lesson, idx) => {
                const completed = isLessonCompleted(lesson.id);
                return (
                  <div 
                    key={lesson.id}
                    onClick={() => handleStartLesson(lesson)}
                    className={`p-3 rounded-xl border text-left bg-white hover:border-blue-400 transition cursor-pointer flex items-center justify-between group shadow-sm ${completed ? 'border-emerald-100' : 'border-gray-200'}`}
                  >
                    <div className="flex items-start space-x-2.5 overflow-hidden">
                      <span className={`w-6 h-6 rounded-lg font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5 ${
                        completed ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {completed ? <Check size={12} strokeWidth={3} /> : idx + 1}
                      </span>
                      <div className="overflow-hidden">
                        <h4 className="font-bold text-xs text-gray-800 truncate leading-snug group-hover:text-blue-600 transition">{lesson.title}</h4>
                        <div className="flex items-center space-x-2 text-[10px] text-gray-400 mt-1">
                          <span className="capitalize flex items-center gap-0.5">
                            {lesson.contentType === 'video' ? <Play size={10} /> : <FileText size={10} />}
                            {lesson.contentType}
                          </span>
                          <span>•</span>
                          <span>{lesson.duration}</span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight size={14} className="text-gray-400 group-hover:translate-x-0.5 transition shrink-0" />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 1: HOME TAB */}
        {activeTab === 'home' && !selectedCourse && (
          <div id="home-view" className="p-4 space-y-4">
            {isZaloBrowser && (
              <div className="bg-emerald-600 text-white rounded-2xl p-3.5 flex items-center gap-3 shadow-md animate-fade-in border border-emerald-500">
                <span className="text-xl">📱</span>
                <div className="overflow-hidden text-left">
                  <h4 className="text-[9px] font-extrabold tracking-wider uppercase opacity-90 leading-none">Zalo WebView Connected</h4>
                  <p className="text-[10px] font-semibold mt-1 leading-normal text-emerald-100">
                    Đã kết nối thành công thiết bị thật qua Zalo WebView!
                  </p>
                </div>
              </div>
            )}

            {/* Student ID Card */}
            <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-sm flex items-center justify-between">
              <div className="flex items-center space-x-3 overflow-hidden">
                {zaloUser && zaloUser.avatar && zaloUser.avatar.startsWith('http') ? (
                  <img 
                    src={zaloUser.avatar} 
                    alt={zaloUser.name} 
                    className="w-12 h-12 rounded-full object-cover shrink-0 border border-blue-100"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-xl shrink-0 border border-blue-100">
                    {zaloUser ? zaloUser.avatar : '👩‍🎓'}
                  </div>
                )}
                <div className="overflow-hidden">
                  <span className="bg-blue-50 text-blue-700 text-[8px] font-extrabold px-1.5 py-0.5 rounded-full border border-blue-100">
                    {zaloUser?.isMock ? 'SIMULATED MEMBER' : 'ZALO MEMBER'}
                  </span>
                  <h3 className="font-bold text-sm text-gray-800 mt-1 leading-none">{zaloUser ? zaloUser.name : 'Nhoxnaruto12'}</h3>
                  <p className="text-[10px] text-gray-400 truncate mt-1">{zaloUser ? (zaloUser.email || 'Nhoxnaruto12@gmail.com') : 'Nhoxnaruto12@gmail.com'}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                <span className="text-[8px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                  ● Trực tuyến
                </span>
                {isZaloMode && (
                  <span className="text-[7px] text-gray-400 font-mono">zmp-sdk active</span>
                )}
              </div>
            </div>

            {/* Continued Study Recommendation Banner */}
            {courses.length > 0 && (
              <div 
                onClick={() => setSelectedCourse(courses[0])}
                className="p-5 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white relative overflow-hidden shadow-md cursor-pointer hover:shadow-lg transition-all duration-300"
              >
                <div className="z-10 max-w-[75%] relative">
                  <span className="bg-white/20 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Gợi ý học tiếp</span>
                  <h3 className="font-extrabold text-sm mt-1.5 leading-snug">{courses[0].title}</h3>
                  <p className="text-[10px] text-blue-100 mt-2 flex items-center gap-1 font-semibold">
                    Tiếp tục học • Bấm để vào ngay <ChevronRight size={10} />
                  </p>
                </div>
                <span className="text-5xl absolute -right-3 -bottom-3 opacity-25 filter blur-[1px]">⚡</span>
              </div>
            )}

            {/* Smart AI Recommendations Card */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50/70 border border-amber-200 rounded-3xl p-5 space-y-2.5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-amber-800 text-[10px] font-bold tracking-wider uppercase flex items-center gap-1">
                  <Sparkles size={12} className="text-amber-500" /> ĐỀ XUẤT THÔNG MINH TỪ AI
                </span>
                <span className="bg-amber-100 text-amber-800 text-[8px] font-extrabold px-1.5 py-0.5 rounded-full uppercase">HOT</span>
              </div>
              <p className="text-xs text-amber-950 font-medium leading-relaxed">
                Hệ thống AI nhận thấy bạn đang làm quen với cấu trúc câu hỏi Wh-questions. Đừng bỏ lỡ bài ôn luyện <span className="font-bold">"Part 2 Wh-Questions"</span> để củng cố phản xạ!
              </p>
              <button 
                onClick={() => {
                  const targetC = courses.find(c => c.id === 'toeic-listening-master');
                  if (targetC) {
                    setSelectedCourse(targetC);
                    const targetL = targetC.lessons.find(l => l.id === 'toeic-l2');
                    if (targetL) handleStartLesson(targetL);
                  }
                }}
                className="w-full bg-white border border-amber-200 hover:bg-amber-50 text-amber-900 text-[10px] font-bold py-2 rounded-xl text-center shadow-sm transition"
              >
                Vào học ngay bài gợi ý
              </button>
            </div>

            {/* Courses Overview list */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between px-1">
                <h3 className="font-bold text-xs text-gray-800 uppercase tracking-wider">Khóa học của bạn</h3>
                <button onClick={() => setActiveTab('courses')} className="text-xs font-bold text-blue-600 hover:text-blue-800">Tất cả</button>
              </div>

              <div className="space-y-2">
                {courses.map(course => {
                  // Calculate completed percentage
                  const completedCount = course.lessons.filter(l => isLessonCompleted(l.id)).length;
                  const pct = Math.round((completedCount / course.lessons.length) * 100);
                  return (
                    <div 
                      key={course.id}
                      onClick={() => setSelectedCourse(course)}
                      className="p-3.5 bg-white border border-slate-200 rounded-2xl hover:border-blue-500 cursor-pointer shadow-sm flex items-center justify-between group transition-all duration-300 hover:shadow-sm"
                    >
                      <div className="flex items-center space-x-3 overflow-hidden">
                        <span className="text-3xl shrink-0">{course.thumbnail}</span>
                        <div className="overflow-hidden">
                          <h4 className="font-bold text-xs text-gray-800 truncate leading-snug group-hover:text-blue-600 transition">{course.title}</h4>
                          <div className="flex items-center space-x-2 text-[10px] text-gray-400 mt-1">
                            <span>{course.level}</span>
                            <span>•</span>
                            <span>{course.lessons.length} bài học</span>
                          </div>
                          {/* Progress micro-bar */}
                          <div className="w-24 mt-1.5 flex items-center gap-1.5">
                            <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                              <div className="h-full bg-blue-500" style={{ width: `${pct}%` }}></div>
                            </div>
                            <span className="text-[8px] font-bold text-gray-500">{pct}%</span>
                          </div>
                        </div>
                      </div>
                      <ChevronRight size={14} className="text-gray-400 group-hover:translate-x-0.5 transition shrink-0" />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ALL COURSES LIST */}
        {activeTab === 'courses' && !selectedCourse && (
          <div id="all-courses-view" className="p-4 space-y-4">
            <h3 className="font-bold text-sm text-gray-800">Danh Sách Khóa Học ({courses.length})</h3>
            
            <div className="space-y-3">
              {courses.map(course => {
                const completedCount = course.lessons.filter(l => isLessonCompleted(l.id)).length;
                const pct = Math.round((completedCount / course.lessons.length) * 100);
                return (
                  <div 
                    key={course.id}
                    onClick={() => setSelectedCourse(course)}
                    className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:border-blue-500 transition-all duration-300 cursor-pointer flex flex-col group hover:shadow-md"
                  >
                    <div className="p-4 flex items-start space-x-3">
                      <span className="text-4xl p-2 bg-slate-50 rounded-2xl shrink-0">{course.thumbnail}</span>
                      <div className="overflow-hidden">
                        <span className="bg-slate-100 text-slate-600 text-[8px] font-bold px-1.5 py-0.5 rounded uppercase">{course.level}</span>
                        <h4 className="font-bold text-xs text-gray-800 group-hover:text-blue-600 transition mt-1 line-clamp-1">{course.title}</h4>
                        <p className="text-[10px] text-gray-400 mt-0.5">{course.lessons.length} bài học lý thuyết • {course.quizzes.length} bài thi thử</p>
                      </div>
                    </div>
                    {/* Progress bottom footer */}
                    <div className="px-4 py-2.5 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-[10px]">
                      <div className="flex items-center gap-1.5 flex-1 max-w-[70%]">
                        <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500" style={{ width: `${pct}%` }}></div>
                        </div>
                        <span className="font-bold text-gray-500">{pct}%</span>
                      </div>
                      <span className="font-bold text-blue-600 text-[9px] flex items-center">
                        Vào học <ChevronRight size={10} />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: CONTEXT-AWARE AI CHAT */}
        {activeTab === 'chat' && (
          <div id="ai-chat-view" className="flex-1 flex flex-col bg-white overflow-hidden h-full">
            {/* Header / Context indicator */}
            <div className="p-3 bg-slate-50 border-b border-gray-100 flex items-center justify-between shrink-0">
              <div className="flex items-center space-x-2">
                <span className="p-1 bg-blue-100 text-blue-600 rounded-lg animate-pulse"><Sparkles size={14} /></span>
                <div>
                  <h4 className="text-xs font-bold text-gray-800">Trợ Lý Học Tập AI</h4>
                  <p className="text-[9px] text-gray-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> 
                    Context-aware (biết bài đang học)
                  </p>
                </div>
              </div>
              <button 
                onClick={resetChat}
                className="text-[10px] font-bold text-gray-400 hover:text-rose-600 flex items-center gap-0.5 border border-gray-200 hover:border-rose-100 bg-white px-2 py-0.5 rounded-md transition"
              >
                <RefreshCw size={8} /> Xóa Chat
              </button>
            </div>

            {/* Chat Bubble Container */}
            <div className="flex-1 p-3 overflow-y-auto space-y-3 scrollbar-none flex flex-col">
              {chatMessages.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-2">
                    <Brain size={24} />
                  </div>
                  <h4 className="font-bold text-xs text-gray-800">Bắt đầu hỏi AI ngay!</h4>
                  <p className="text-[10px] text-gray-400 leading-relaxed max-w-[200px] mt-1">
                    AI biết bạn đang học bài nào để đưa ra câu trả lời chính xác, giải nghĩa từ vựng hoặc tạo ví dụ.
                  </p>
                  
                  {/* Suggestion Bubbles */}
                  <div className="mt-4 w-full space-y-1.5">
                    {organization.id === 'TOEIC_CENTER' ? (
                      <>
                        <button
                          onClick={() => {
                            setChatInput('Cho mình hỏi mẹo tránh bẫy ngữ pháp Subject-Verb Agreement?');
                          }}
                          className="w-full text-left p-2 border border-gray-200 hover:border-blue-300 rounded-lg text-[10px] text-gray-600 hover:bg-blue-50/20 text-center transition font-medium"
                        >
                          "Mẹo tránh bẫy Subject-Verb Agreement?"
                        </button>
                        <button
                          onClick={() => {
                            setChatInput('Cách bắt từ khóa trong câu hỏi trắc nghiệm ảnh Part 1?');
                          }}
                          className="w-full text-left p-2 border border-gray-200 hover:border-blue-300 rounded-lg text-[10px] text-gray-600 hover:bg-blue-50/20 text-center transition font-medium"
                        >
                          "Cách bắt từ khóa tranh ảnh Part 1?"
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setChatInput('Giải thích cấu trúc つもり và 予定 khác nhau thế nào?');
                          }}
                          className="w-full text-left p-2 border border-gray-200 hover:border-blue-300 rounded-lg text-[10px] text-gray-600 hover:bg-blue-50/20 text-center transition font-medium"
                        >
                          "Phân biệt つもり (tsumori) và 予定 (yotei)?"
                        </button>
                        <button
                          onClick={() => {
                            setChatInput('Dùng わけがない trong câu tiếng Nhật thế nào?');
                          }}
                          className="w-full text-left p-2 border border-gray-200 hover:border-blue-300 rounded-lg text-[10px] text-gray-600 hover:bg-blue-50/20 text-center transition font-medium"
                        >
                          "Cú pháp sử dụng わけがない?"
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                chatMessages.map(msg => {
                  const isUser = msg.sender === 'user';
                  return (
                    <div 
                      key={msg.id} 
                      className={`flex flex-col max-w-[80%] ${
                        isUser ? 'self-end items-end' : 'self-start items-start'
                      }`}
                    >
                      <div className={`p-3 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap select-text ${
                        isUser 
                          ? 'bg-blue-600 text-white rounded-tr-none' 
                          : 'bg-gray-100 text-gray-800 rounded-tl-none border border-gray-200'
                      }`}>
                        {msg.text}
                      </div>
                      <span className="text-[8px] text-gray-400 mt-1 font-mono">
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  );
                })
              )}

              {/* AI Typing state */}
              {isAiTyping && (
                <div className="self-start flex items-center space-x-1.5 p-3 rounded-2xl bg-gray-100 border border-gray-200 rounded-tl-none max-w-[80%]">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce [animation-delay:0.4s]"></span>
                </div>
              )}
              
              <div ref={chatEndRef} />
            </div>

            {/* Chat bottom input bar */}
            <div className="p-2 border-t border-gray-100 flex items-center bg-white space-x-1 shrink-0 z-10">
              <input
                type="text"
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') handleSendChatMessage();
                }}
                placeholder="Hỏi AI về ngữ pháp, bài học..."
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500 focus:bg-white"
              />
              <button
                onClick={handleSendChatMessage}
                className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        )}

        {/* TAB 4: STUDENT PROFILE / COGNITIVE ANALYSIS */}
        {activeTab === 'profile' && (
          <div id="profile-view" className="p-4 space-y-4">
            {/* Student ID Card */}
            <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-sm flex items-center justify-between">
              <div className="flex items-center space-x-3 overflow-hidden">
                {zaloUser && zaloUser.avatar && zaloUser.avatar.startsWith('http') ? (
                  <img 
                    src={zaloUser.avatar} 
                    alt={zaloUser.name} 
                    className="w-12 h-12 rounded-full object-cover shrink-0 border border-indigo-100"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center text-xl shrink-0 border border-indigo-100">
                    {zaloUser ? zaloUser.avatar : '👩‍🎓'}
                  </div>
                )}
                <div className="overflow-hidden">
                  <span className="bg-indigo-50 text-indigo-700 text-[8px] font-extrabold px-1.5 py-0.5 rounded-full border border-indigo-100">
                    {zaloUser?.isMock ? 'SIMULATED MEMBER' : 'ZALO MEMBER'}
                  </span>
                  <h3 className="font-bold text-sm text-gray-800 mt-1 leading-none">{zaloUser ? zaloUser.name : 'Nhoxnaruto12'}</h3>
                  <p className="text-[10px] text-gray-400 truncate mt-1">{zaloUser ? (zaloUser.email || 'Nhoxnaruto12@gmail.com') : 'Nhoxnaruto12@gmail.com'}</p>
                </div>
              </div>
              
              {/* Logout/Action Button */}
              {zaloUser ? (
                <button 
                  onClick={() => {
                    onZaloLogout();
                    ZaloService.showToast('Đã đăng xuất tài khoản Zalo');
                    ZaloService.vibrate();
                  }}
                  className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition border border-rose-100 shrink-0"
                  title="Đăng xuất Zalo"
                >
                  <LogOut size={14} />
                </button>
              ) : (
                <button 
                  onClick={async () => {
                    try {
                      const res = await ZaloService.getUserInfo();
                      onZaloLogin(res);
                      ZaloService.showToast('Đăng nhập Zalo thành công');
                      ZaloService.vibrate();
                    } catch (e) {
                      ZaloService.showToast('Không thể kết nối Zalo API', 'fail');
                    }
                  }}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold rounded-xl transition shadow-sm shrink-0"
                >
                  Đăng nhập
                </button>
              )}
            </div>

            {/* Zalo Interactive Tools Card */}
            <div className="bg-gradient-to-br from-slate-50 to-blue-50/30 border border-slate-200 rounded-3xl p-4 space-y-2.5 shadow-sm">
              <h4 className="text-slate-800 text-[10px] font-extrabold tracking-wider uppercase flex items-center gap-1">
                <ShieldCheck size={12} className="text-blue-500" /> TÍCH HỢP HỆ THỐNG ZALO
              </h4>
              <p className="text-[9px] text-slate-500 leading-normal">
                Kiểm tra các quyền truy cập của ứng dụng và kiểm nghiệm hành vi tương tác phần cứng thực tế.
              </p>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={async () => {
                    ZaloService.vibrate();
                    try {
                      const token = await ZaloService.getPhoneNumber();
                      ZaloService.showToast('Đã lấy mã SĐT thành công!');
                      alert(`[Zalo SDK Token] ${token}\n(Mã bảo mật OTP đã được mã hóa theo chính sách Zalo Mini App)`);
                    } catch (err) {
                      ZaloService.showToast('Lấy SĐT thất bại', 'fail');
                    }
                  }}
                  className="py-1.5 px-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-[9px] font-bold rounded-xl text-center flex items-center justify-center gap-1 shadow-xs transition"
                >
                  <Phone size={10} className="text-slate-500" /> Quyền SĐT
                </button>
                <button
                  onClick={() => {
                    ZaloService.vibrate();
                    ZaloService.showToast('Thiết bị rung bzzz!');
                  }}
                  className="py-1.5 px-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-[9px] font-bold rounded-xl text-center flex items-center justify-center gap-1 shadow-xs transition"
                >
                  <RefreshCw size={10} className="text-slate-500" /> Rung thiết bị
                </button>
              </div>
            </div>

            {/* Completed Tracker */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white border border-slate-200 p-4 rounded-3xl text-center shadow-sm">
                <div className="text-xl font-black text-blue-600">{progress.completedLessonIds.length}</div>
                <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">BÀI ĐÃ HOÀN THÀNH</div>
              </div>
              <div className="bg-white border border-slate-200 p-4 rounded-3xl text-center shadow-sm">
                <div className="text-xl font-black text-emerald-600">
                  {Object.keys(progress.quizScores).length}
                </div>
                <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">QUIZ ĐÃ HOÀN THÀNH</div>
              </div>
            </div>

            {/* Smart Cognitive Skill Map */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-3">
              <div className="flex items-center space-x-1">
                <Brain size={16} className="text-blue-600" />
                <h3 className="font-extrabold text-xs text-gray-800 uppercase tracking-wider">Phân Tích Kỹ Năng Kỹ Thuật (AI Radar)</h3>
              </div>
              
              <div className="space-y-2.5 pt-1">
                {report.skills.map(s => (
                  <div key={s.name} className="space-y-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-gray-600 font-semibold">{s.name}</span>
                      <span className={`font-bold ${s.score >= 80 ? 'text-emerald-600' : s.score >= 50 ? 'text-amber-600' : 'text-rose-600'}`}>{s.score}/100</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          s.score >= 80 ? 'bg-emerald-500' : s.score >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                        }`}
                        style={{ width: `${s.score}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Weakness & Remedial Suggestions */}
            <div className="bg-slate-900 text-white rounded-3xl p-5 space-y-4 shadow-xl relative overflow-hidden">
              <div className="flex items-center space-x-1.5 relative z-10">
                <Sparkles size={16} className="text-amber-400 animate-pulse" />
                <h4 className="font-extrabold text-xs tracking-wider uppercase">BÁO CÁO ĐIỂM YẾU VÀ ĐỀ XUẤT (AI)</h4>
              </div>

              <p className="text-xs text-indigo-100 leading-relaxed font-medium bg-white/5 border border-white/10 rounded-2xl p-3.5 relative z-10">
                {report.summary}
              </p>

              <div className="space-y-2 relative z-10">
                <h5 className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Hành động AI đề xuất:</h5>
                <ul className="space-y-1.5">
                  {report.recommendations.map((rec, rIdx) => (
                    <li key={rIdx} className="text-[10px] text-gray-200 flex items-start space-x-1.5 leading-relaxed">
                      <span className="text-amber-400 font-bold shrink-0 mt-0.5">✔</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
              {/* Decorative glow */}
              <div className="absolute -right-16 -bottom-16 w-32 h-32 bg-indigo-500/30 blur-[40px] rounded-full"></div>
            </div>
          </div>
        )}
      </div>

      {/* 3. FIXED BOTTOM TAB NAVIGATION */}
      <div className="bg-white border-t border-gray-100 flex items-center justify-around z-20 shrink-0 shadow-lg h-16">
        <button 
          onClick={() => {
            setActiveTab('home');
            setSelectedCourse(null);
            setSelectedLesson(null);
            setActiveQuiz(null);
          }}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition ${
            activeTab === 'home' ? themeTextClass : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <Home size={18} className={activeTab === 'home' ? 'scale-110 transition' : ''} />
          <span className="text-[9px] font-bold mt-1">Home</span>
        </button>

        <button 
          onClick={() => {
            setActiveTab('courses');
            setSelectedCourse(null);
            setSelectedLesson(null);
            setActiveQuiz(null);
          }}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition ${
            activeTab === 'courses' ? themeTextClass : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <BookOpen size={18} className={activeTab === 'courses' ? 'scale-110 transition' : ''} />
          <span className="text-[9px] font-bold mt-1">Courses</span>
        </button>

        <button 
          onClick={() => {
            setActiveTab('chat');
            setSelectedCourse(null);
            setSelectedLesson(null);
            setActiveQuiz(null);
          }}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition relative ${
            activeTab === 'chat' ? themeTextClass : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <MessageSquare size={18} className={activeTab === 'chat' ? 'scale-110 transition' : ''} />
          <span className="text-[9px] font-bold mt-1">AI Chat</span>
          <span className="absolute top-1 right-6 w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
          <span className="absolute top-1 right-6 w-2 h-2 rounded-full bg-red-500"></span>
        </button>

        <button 
          onClick={() => {
            setActiveTab('profile');
            setSelectedCourse(null);
            setSelectedLesson(null);
            setActiveQuiz(null);
          }}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition ${
            activeTab === 'profile' ? themeTextClass : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <User size={18} className={activeTab === 'profile' ? 'scale-110 transition' : ''} />
          <span className="text-[9px] font-bold mt-1">Profile</span>
        </button>
      </div>

      {/* 4. HIGH-FIDELITY SLIDE-UP BOTTOM SHEET FOR AI */}
      {aiSheetOpen && (
        <div className="absolute inset-0 bg-black/40 z-50 flex flex-col justify-end">
          {/* Backdrop Touch Close */}
          <div className="flex-1" onClick={() => setAiSheetOpen(false)}></div>
          
          {/* Sheet Body Container */}
          <div className="bg-white rounded-t-2xl max-h-[80%] flex flex-col shadow-2xl relative border-t border-gray-100 overflow-hidden animate-slide-up">
            {/* Grabber Indicator */}
            <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto my-2 shrink-0"></div>

            {/* Header */}
            <div className="px-4 pb-3 border-b border-gray-100 flex items-center justify-between shrink-0">
              <div className="flex items-center space-x-1.5">
                <Sparkles size={16} className="text-blue-600 animate-spin-slow" />
                <h3 className="font-extrabold text-sm text-gray-800 leading-tight">{aiSheetTitle}</h3>
              </div>
              <button 
                onClick={() => setAiSheetOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            </div>

            {/* Sheet Scrollable Area */}
            <div className="p-4 flex-1 overflow-y-auto select-text text-xs leading-relaxed text-gray-700 min-h-[150px] max-h-[350px]">
              {aiSheetLoading ? (
                <div className="py-12 flex flex-col items-center justify-center space-y-3">
                  {/* Rotating elegant custom spinner */}
                  <div className="w-8 h-8 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
                  <p className="text-xs text-gray-400 font-medium tracking-wide">Trí Tuệ Nhân Tạo (AI) đang xử lý dữ liệu...</p>
                </div>
              ) : (
                <div className="space-y-3 prose max-w-none">
                  {aiSheetContent.split('\n\n').map((paragraph, pIdx) => {
                    // Primitive rendering for markdown headers
                    if (paragraph.startsWith('### ')) {
                      return <h3 key={pIdx} className="font-extrabold text-sm text-blue-950 mt-4 mb-2">{paragraph.replace('### ', '')}</h3>;
                    }
                    if (paragraph.startsWith('#### ')) {
                      return <h4 key={pIdx} className="font-extrabold text-xs text-gray-800 mt-3 mb-1 uppercase tracking-wider">{paragraph.replace('#### ', '')}</h4>;
                    }
                    if (paragraph.startsWith('* ')) {
                      return (
                        <ul key={pIdx} className="list-disc pl-4 space-y-1 my-2">
                          {paragraph.split('\n').map((li, lIdx) => (
                            <li key={lIdx} className="text-xs text-gray-600">{li.replace('* ', '').replace('- ', '')}</li>
                          ))}
                        </ul>
                      );
                    }
                    return <p key={pIdx} className="text-xs text-gray-600 mb-2 leading-relaxed">{paragraph}</p>;
                  })}
                </div>
              )}
            </div>

            {/* Bottom Actions if custom Quiz generating */}
            {aiSheetType === 'quiz' && !aiSheetLoading && (
              <div className="p-3 bg-slate-50 border-t border-gray-100 flex items-center justify-end">
                <button
                  onClick={() => handleStartQuizFromSheet(selectedLesson!)}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow transition"
                >
                  Bắt đầu làm bài thi thử ngay
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
