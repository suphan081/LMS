import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Users, Brain, LayoutDashboard, Sparkles, 
  ChevronRight, ArrowRight, Play, FileText, CheckCircle, 
  Activity, Award, AlertCircle, RefreshCw, Smartphone,
  Terminal, Wifi, Globe, HelpCircle
} from 'lucide-react';
import { Course, Lesson, StudentProfile, UserProgress } from '../types';
import { MOCK_STUDENTS } from '../mockData';
import { simulateQuizGenerationLogs, mockWeakness } from '../mockAI';

interface WebDashboardProps {
  organization: { id: string; name: string; logo: string; themeColor: string };
  courses: Course[];
  userProgress: UserProgress;
  onSelectCourseInZalo: (course: Course) => void;
  onSelectLessonInZalo: (lesson: Lesson) => void;
}

export default function WebDashboard({
  organization,
  courses,
  userProgress,
  onSelectCourseInZalo,
  onSelectLessonInZalo
}: WebDashboardProps) {
  // Navigation inside the Dashboard: 'overview' | 'courses' | 'students' | 'ai-tools' | 'real-device'
  const [activeMenu, setActiveMenu] = useState<'overview' | 'courses' | 'students' | 'ai-tools' | 'real-device'>('overview');

  // AI Quiz Generator states
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [selectedLessonId, setSelectedLessonId] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationLogs, setGenerationLogs] = useState<string[]>([]);
  const [generatedSuccess, setGeneratedSuccess] = useState(false);

  // Student details focus state
  const [focusedStudentId, setFocusedStudentId] = useState<string>('student-active');
  const [focusedStudentReport, setFocusedStudentReport] = useState<any>(null);

  // Sync initial dropdown selections when courses change
  useEffect(() => {
    if (courses.length > 0) {
      setSelectedCourseId(courses[0].id);
      if (courses[0].lessons.length > 0) {
        setSelectedLessonId(courses[0].lessons[0].id);
      }
    }
    setGeneratedSuccess(false);
    setGenerationLogs([]);
  }, [courses]);

  // Sync selected lesson selection
  useEffect(() => {
    const course = courses.find(c => c.id === selectedCourseId);
    if (course && course.lessons.length > 0) {
      setSelectedLessonId(course.lessons[0].id);
    }
  }, [selectedCourseId, courses]);

  // Aggregate student progress
  // Let's build a student list that includes the active Zalo App student "Nhoxnaruto12"
  const activeStudentLessonsCompleted = userProgress.completedLessonIds.length;
  const activeStudentQuizzesCompleted = Object.keys(userProgress.quizScores).length;

  // Compute a live-updating profile for the active user
  const activeStudentProfile: StudentProfile = {
    id: 'student-active',
    name: 'Nhoxnaruto12 (You)',
    avatar: '👩‍🎓',
    email: 'Nhoxnaruto12@gmail.com',
    progress: courses.reduce((acc, c) => {
      const totalLessons = c.lessons.length;
      const completed = c.lessons.filter(l => userProgress.completedLessonIds.includes(l.id)).length;
      acc[c.id] = totalLessons > 0 ? Math.round((completed / totalLessons) * 100) : 0;
      return acc;
    }, {} as { [courseId: string]: number }),
    weaknesses: courses.reduce((acc, c) => {
      const rep = mockWeakness(userProgress.quizScores, organization.id);
      acc[c.id] = rep.recommendations.map(r => r.substring(0, 30));
      return acc;
    }, {} as { [courseId: string]: string[] }),
    activityLog: [
      { date: 'Vừa xong', action: 'Hoạt động trên Zalo Mini App' }
    ]
  };

  const allStudents = [activeStudentProfile, ...MOCK_STUDENTS];

  // Quick stat cards aggregates
  const totalStudents = allStudents.length;
  const totalCourses = courses.length;
  
  // Calculate average score of quizzes
  const allScores: number[] = [];
  // Include mock students high scores
  allScores.push(85, 90, 75, 60, 95);
  // Include user live scores
  Object.values(userProgress.quizScores).forEach(score => allScores.push(score));
  const averageScore = Math.round(allScores.reduce((sum, s) => sum + s, 0) / allScores.length);

  // Trigger simulated AI Quiz Generation
  const handleTriggerAIQuizGen = async () => {
    const lesson = courses.flatMap(c => c.lessons).find(l => l.id === selectedLessonId);
    if (!lesson) return;

    setIsGenerating(true);
    setGeneratedSuccess(false);
    setGenerationLogs([]);

    await simulateQuizGenerationLogs(lesson.title, (newLog) => {
      setGenerationLogs(prev => [...prev, newLog]);
    });

    setIsGenerating(false);
    setGeneratedSuccess(true);
  };

  // Run AI analysis on selected student
  const handleTriggerAIAnalysis = (studentId: string) => {
    setFocusedStudentId(studentId);
    const student = allStudents.find(s => s.id === studentId);
    if (!student) return;

    // Simulate generating report based on scores
    const quizScores = studentId === 'student-active' 
      ? userProgress.quizScores 
      : { 'q-toeic-l1': 90, 'q-toeic-g1': 50 }; // default mock scores

    const analysis = mockWeakness(quizScores, organization.id);
    setFocusedStudentReport(analysis);
  };

  // Run initial analysis for focused student
  useEffect(() => {
    handleTriggerAIAnalysis(focusedStudentId);
  }, [focusedStudentId, userProgress, organization.id]);

  const themeTextClass = organization.themeColor === 'indigo' ? 'text-indigo-600' : 'text-rose-600';
  const themeBgClass = organization.themeColor === 'indigo' ? 'bg-indigo-600' : 'bg-rose-600';
  const themeBgLight = organization.themeColor === 'indigo' ? 'bg-indigo-50/50' : 'bg-rose-50/50';
  const themeBorderClass = organization.themeColor === 'indigo' ? 'border-indigo-100' : 'border-rose-100';

  return (
    <div id="web-dashboard" className="flex flex-col h-[730px] bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-xl font-sans text-slate-800">
      
      {/* 1. TOP HEADER / BRAND BAR */}
      <div className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 z-10">
        <div className="flex items-center space-x-3">
          <span className="p-2 bg-slate-100 rounded-xl text-lg font-bold">💻</span>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-slate-900 uppercase">AI LMS WEB DASHBOARD</h1>
            <p className="text-[10px] text-slate-500 font-medium">Bảng quản trị giáo viên & Đánh giá năng lực AI</p>
          </div>
        </div>

        {/* Current Organization Info badge */}
        <div className="flex items-center space-x-2 bg-slate-100/80 px-3 py-1.5 rounded-full border border-slate-200">
          <span className="text-xs">{organization.logo}</span>
          <span className="text-xs font-bold text-slate-700">{organization.name}</span>
          <span className="text-[9px] bg-slate-700 text-white font-extrabold px-1.5 py-0.2 rounded-full uppercase">Tenant</span>
        </div>
      </div>

      {/* 2. SPLIT CONTAINER: SIDEBAR + CONTENT BODY */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT SIDEBAR */}
        <div className="w-56 bg-white border-r border-slate-100 p-4 flex flex-col justify-between shrink-0">
          <div className="space-y-1.5">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-2.5 mb-2">Quản trị viên</h3>
            
            <button
              onClick={() => setActiveMenu('overview')}
              className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition ${
                activeMenu === 'overview' 
                  ? `${themeBgClass} text-white shadow-sm` 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <LayoutDashboard size={15} />
              <span>Tổng quan & Số liệu</span>
            </button>

            <button
              onClick={() => setActiveMenu('courses')}
              className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition ${
                activeMenu === 'courses' 
                  ? `${themeBgClass} text-white shadow-sm` 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <BookOpen size={15} />
              <span>Quản lý Khóa học</span>
            </button>

            <button
              onClick={() => setActiveMenu('students')}
              className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition ${
                activeMenu === 'students' 
                  ? `${themeBgClass} text-white shadow-sm` 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Users size={15} />
              <span>Học viên học tập</span>
            </button>

            <button
              onClick={() => setActiveMenu('ai-tools')}
              className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition ${
                activeMenu === 'ai-tools' 
                  ? `${themeBgClass} text-white shadow-sm` 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Brain size={15} />
              <span className="flex items-center gap-1.5">
                AI Sandbox Tools 
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>
              </span>
            </button>

            <button
              onClick={() => setActiveMenu('real-device')}
              className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition ${
                activeMenu === 'real-device' 
                  ? `${themeBgClass} text-white shadow-sm` 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Smartphone size={15} />
              <span className="flex items-center gap-1.5">
                Thiết bị thật (Test)
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              </span>
            </button>
          </div>

          {/* Quick Informative Info Box */}
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3">
            <span className="text-[9px] font-bold text-slate-400 block uppercase tracking-wide">💡 Demo Guide:</span>
            <p className="text-[10px] text-slate-500 leading-relaxed mt-1">
              Thực hiện các thao tác học bài hoặc làm Quiz bên Zalo Mini App để quan sát số liệu biến động ngay lập tức tại đây!
            </p>
          </div>
        </div>

        {/* RIGHT CONTENT DISPLAY WINDOW */}
        <div className="flex-1 overflow-y-auto p-5 relative bg-slate-50">
          
          {/* MENU 1: OVERVIEW SCREEN */}
          {activeMenu === 'overview' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-950">Tổng Quan Hoạt Động</h2>
                  <p className="text-[11px] text-slate-500 font-medium">Báo cáo phân tích tự động từ hệ thống AI LMS</p>
                </div>
                <span className="text-xs text-slate-400 font-mono">Cập nhật: Realtime</span>
              </div>

              {/* Aggregated Stat Cards */}
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-blue-50/70 border border-blue-100 rounded-3xl p-5 shadow-sm flex items-center space-x-3 hover:shadow-md transition-shadow">
                  <div className="p-3 rounded-2xl bg-white text-blue-600 shadow-sm shrink-0">
                    <Users size={18} />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Tổng Học Viên</span>
                    <span className="text-lg font-black text-slate-900">{totalStudents}</span>
                  </div>
                </div>

                <div className="bg-indigo-50/70 border border-indigo-100 rounded-3xl p-5 shadow-sm flex items-center space-x-3 hover:shadow-md transition-shadow">
                  <div className="p-3 rounded-2xl bg-white text-indigo-600 shadow-sm shrink-0">
                    <BookOpen size={18} />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Khóa Đang Chạy</span>
                    <span className="text-lg font-black text-slate-900">{totalCourses}</span>
                  </div>
                </div>

                <div className="bg-purple-50/70 border border-purple-100 rounded-3xl p-5 shadow-sm flex items-center space-x-3 hover:shadow-md transition-shadow">
                  <div className="p-3 rounded-2xl bg-white text-purple-600 shadow-sm shrink-0">
                    <Award size={18} />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Điểm Trung Bình</span>
                    <span className="text-lg font-black text-slate-900">{averageScore}%</span>
                  </div>
                </div>

                <div className="bg-emerald-50/70 border border-emerald-100 rounded-3xl p-5 shadow-sm flex items-center space-x-3 hover:shadow-md transition-shadow">
                  <div className="p-3 rounded-2xl bg-white text-emerald-600 shadow-sm shrink-0">
                    <Activity size={18} />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Trạng Thái</span>
                    <span className="text-[11px] font-bold text-emerald-600 uppercase flex items-center gap-1 mt-1">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> Hoạt động
                    </span>
                  </div>
                </div>
              </div>

              {/* Active Student Realtime Spotlight Card */}
              <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl flex items-center justify-between relative overflow-hidden">
                <div className="space-y-1 relative z-10">
                  <span className="bg-indigo-500/30 text-indigo-300 text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">Học Viên Zalo Live Sync</span>
                  <h3 className="font-extrabold text-sm mt-2">Học viên active: "Nhoxnaruto12"</h3>
                  <p className="text-[11px] text-slate-300">
                    Tiến độ: <span className="text-emerald-400 font-bold">{activeStudentLessonsCompleted} bài học đã học</span> • <span className="text-blue-300 font-bold">{activeStudentQuizzesCompleted} quiz đã hoàn thành</span>
                  </p>
                </div>
                
                <div className="bg-white/5 border border-white/10 px-4 py-2.5 rounded-2xl text-center relative z-10">
                  <div className="text-xs font-bold text-indigo-300">Hoạt động mới nhất</div>
                  <div className="text-xs font-black text-white mt-1">
                    {userProgress.completedLessonIds.length > 0 
                      ? 'Đang tiến hành học tập' 
                      : 'Đang mở Zalo App'}
                  </div>
                </div>
                {/* Decorative AI light */}
                <div className="absolute -right-16 -bottom-16 w-48 h-48 bg-indigo-500/30 blur-[60px] rounded-full"></div>
              </div>

              {/* Two Column Layout: Student Progress Status vs Live Activity */}
              <div className="grid grid-cols-5 gap-4">
                {/* Cohort status tracker */}
                <div className="col-span-3 bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-3">
                  <h3 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">Đánh giá rủi ro học viên (AI)</h3>
                  
                  <div className="space-y-3.5 pt-1">
                    {allStudents.map(student => {
                      const isUser = student.id === 'student-active';
                      const rep = mockWeakness(isUser ? userProgress.quizScores : {}, organization.id);
                      const isStruggling = isUser ? Object.keys(userProgress.quizScores).some(k => userProgress.quizScores[k] < 60) : student.id === 'student-1';
                      return (
                        <div key={student.id} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2.5">
                            <span className="text-lg">{student.avatar}</span>
                            <div>
                              <h4 className="font-bold text-xs text-slate-800">{student.name}</h4>
                              <p className="text-[10px] text-slate-400 truncate max-w-[150px]">{student.email}</p>
                            </div>
                          </div>
                          
                          {/* AI Status tag */}
                          <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase ${
                            isStruggling 
                              ? 'bg-rose-50 text-rose-600 border border-rose-100' 
                              : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                          }`}>
                            {isStruggling ? 'Cần củng cố' : 'Đạt tiêu chuẩn'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Simulated Notification / Stream with integrated Bento Heatmap! */}
                <div className="col-span-2 bg-slate-50 border border-slate-200 rounded-3xl p-5 shadow-sm flex flex-col justify-between">
                  <div className="space-y-3">
                    <h3 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">Lịch Sử & Hoạt Động</h3>
                    
                    <div className="space-y-2.5">
                      <div className="p-2 border-l-2 border-indigo-500 bg-white border border-slate-200 rounded-xl text-[10px] space-y-0.5 shadow-sm">
                        <span className="font-bold text-slate-500 font-mono block">Mới Nhất</span>
                        <p className="text-slate-800 font-medium">Học viên **Nhoxnaruto12** truy cập qua Zalo Mini App.</p>
                      </div>
                      
                      <div className="p-2 border-l-2 border-slate-300 bg-white border border-slate-200 rounded-xl text-[10px] space-y-0.5 shadow-sm">
                        <span className="font-bold text-slate-400 font-mono block">10 phút trước</span>
                        <p className="text-slate-600">Trần Thị Bình hoàn thành JLPT N3 Grammar.</p>
                      </div>
                    </div>
                  </div>

                  {/* Aesthetic Bento Heatmap Integration */}
                  <div className="mt-4 pt-3 border-t border-slate-200 flex flex-col">
                    <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-2">Biểu Đồ Tần Suất Học</h4>
                    <div className="flex items-end gap-1.5 h-16">
                      <div className="w-full bg-blue-100 rounded-t-md h-[25%]"></div>
                      <div className="w-full bg-blue-200 rounded-t-md h-[45%]"></div>
                      <div className="w-full bg-blue-300 rounded-t-md h-[80%]"></div>
                      <div className="w-full bg-blue-600 rounded-t-md h-[100%]"></div>
                      <div className="w-full bg-blue-400 rounded-t-md h-[60%]"></div>
                      <div className="w-full bg-blue-200 rounded-t-md h-[30%]"></div>
                      <div className="w-full bg-blue-100 rounded-t-md h-[15%]"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MENU 2: CURRICULUM MANAGEMENT */}
          {activeMenu === 'courses' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-3 mb-4">
                <div>
                  <h2 className="text-base font-bold text-slate-950">Quản Lý Chương Trình & Khóa Học</h2>
                  <p className="text-[11px] text-slate-500 font-medium">Danh sách bài giảng tích hợp trợ lý AI thông minh</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {courses.map(course => (
                  <div key={course.id} className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm flex flex-col hover:shadow-md transition-all duration-300">
                    <div className="p-4 flex items-start space-x-3">
                      <span className="text-3xl p-1 bg-slate-50 rounded-xl">{course.thumbnail}</span>
                      <div>
                        <span className="bg-slate-100 text-slate-600 text-[8px] font-bold px-1.5 py-0.5 rounded uppercase">{course.level}</span>
                        <h4 className="font-bold text-xs text-slate-900 mt-1">{course.title}</h4>
                        <p className="text-[10px] text-slate-500 mt-0.5">{course.lessons.length} bài học • {course.enrollments} đăng ký</p>
                      </div>
                    </div>

                    {/* Lesson lists in Course */}
                    <div className="flex-1 bg-slate-50/50 border-t border-slate-100 p-3 space-y-2">
                      <h5 className="text-[9px] font-bold text-slate-400 uppercase tracking-wider pl-1">Bài giảng ({course.lessons.length}):</h5>
                      
                      <div className="space-y-1.5 max-h-[120px] overflow-y-auto pr-1">
                        {course.lessons.map((lesson, lIdx) => (
                          <div key={lesson.id} className="p-2 bg-white rounded-xl border border-slate-100 text-[10px] flex items-center justify-between hover:border-indigo-300 transition shadow-sm">
                            <span className="font-semibold text-slate-700 truncate max-w-[140px]">
                              {lIdx + 1}. {lesson.title}
                            </span>
                            <div className="flex items-center space-x-2 shrink-0">
                              <button 
                                onClick={() => {
                                  onSelectCourseInZalo(course);
                                  onSelectLessonInZalo(lesson);
                                }}
                                className="px-1.5 py-0.5 bg-blue-50 text-blue-600 border border-blue-100 rounded text-[8px] font-bold flex items-center gap-0.5"
                                title="Xem thử trên Zalo Mini App"
                              >
                                Test Zalo <ArrowRight size={8} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MENU 3: STUDENTS DIRECTORY & DIAGNOSTIC */}
          {activeMenu === 'students' && (
            <div className="grid grid-cols-5 gap-5">
              
              {/* Left column student list table */}
              <div className="col-span-3 bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-3">
                <h3 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">Danh Sách Học Viên Đang Học</h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b text-slate-400 font-bold text-[9px] uppercase tracking-wider">
                        <th className="py-2">Học Viên</th>
                        <th className="py-2">Tiến độ</th>
                        <th className="py-2">Hành Động</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {allStudents.map(st => {
                        const isSelected = focusedStudentId === st.id;
                        const totalCompleted = st.id === 'student-active' 
                          ? activeStudentLessonsCompleted 
                          : st.id === 'student-1' ? 4 : 3;
                        return (
                          <tr 
                            key={st.id}
                            onClick={() => handleTriggerAIAnalysis(st.id)}
                            className={`hover:bg-slate-50 cursor-pointer transition ${isSelected ? 'bg-indigo-50/35' : ''}`}
                          >
                            <td className="py-2.5 flex items-center space-x-2">
                              <span className="text-xl">{st.avatar}</span>
                              <div>
                                <h4 className="font-bold text-xs text-slate-800">{st.name}</h4>
                                <p className="text-[9px] text-slate-400">{st.email}</p>
                              </div>
                            </td>
                            <td className="py-2.5">
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold font-mono text-[10px] text-slate-700">{totalCompleted} bài</span>
                              </div>
                            </td>
                            <td className="py-2.5">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleTriggerAIAnalysis(st.id);
                                }}
                                className={`text-[9px] font-bold px-2 py-1 rounded-xl border border-slate-200 transition ${
                                  isSelected 
                                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' 
                                    : 'bg-white text-indigo-600 border-indigo-200 hover:border-indigo-400 hover:bg-slate-50'
                                }`}
                              >
                                Đánh giá AI
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Right column: Dynamic AI Diagnostic Profile Report */}
              <div className="col-span-2 bg-slate-900 text-white rounded-3xl p-6 shadow-xl space-y-4 flex flex-col justify-between relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="text-[9px] text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1">
                      <Sparkles size={11} className="text-amber-400 animate-pulse" /> BÁO CÁO CÁ NHÂN HÓA (AI COHORT)
                    </span>
                    <span className="bg-white/10 border border-white/15 text-[8px] font-bold px-1.5 py-0.2 rounded-full uppercase">Realtime</span>
                  </div>

                  {/* Focused Student info */}
                  {(() => {
                    const stObj = allStudents.find(s => s.id === focusedStudentId);
                    if (!stObj) return null;
                    return (
                      <div className="mt-3 flex items-center space-x-2.5">
                        <span className="text-3xl p-1 bg-white/10 rounded-full">{stObj.avatar}</span>
                        <div>
                          <h4 className="font-black text-xs text-white">{stObj.name}</h4>
                          <p className="text-[10px] text-slate-400 font-mono">{stObj.email}</p>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Diagnostics output */}
                  {focusedStudentReport && (
                    <div className="mt-4 space-y-3">
                      <div>
                        <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Chuẩn Đoán Động Từ AI:</h5>
                        <p className="text-[11px] text-slate-200 leading-relaxed bg-white/5 border border-white/10 rounded-2xl p-3.5">
                          {focusedStudentReport.summary}
                        </p>
                      </div>

                      {/* Diagnostic Skills radar simulated values */}
                      <div className="space-y-1.5">
                        <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Biểu đồ lực học:</h5>
                        {focusedStudentReport.skills.map((s: any) => (
                          <div key={s.name} className="flex items-center justify-between text-[10px]">
                            <span className="text-slate-300 font-medium">{s.name}</span>
                            <span className="text-white font-bold">{s.score}/100</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-white/10 text-[9px] text-slate-400 italic relative z-10">
                  *Báo cáo được AI sinh tự động dựa trên lịch sử tương tác, kết quả trắc nghiệm và câu hỏi tại Zalo Mini App.
                </div>
                {/* Decorative AI light */}
                <div className="absolute -right-16 -bottom-16 w-48 h-48 bg-blue-600/20 blur-[50px] rounded-full"></div>
              </div>
            </div>
          )}

          {/* MENU 4: INTERACTIVE AI SANDBOX TOOLS */}
          {activeMenu === 'ai-tools' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <h2 className="text-base font-bold text-slate-950">AI Sandbox Control</h2>
                  <p className="text-[11px] text-slate-500 font-medium">Bản thử nghiệm các tính năng cốt lõi của Trí tuệ nhân tạo (AI LMS Validation)</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5">
                
                {/* TOOL 1: GENERATE QUIZ FROM LESSON */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-3 hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-1.5">
                    <span className="p-1.5 bg-indigo-50 text-indigo-600 rounded-xl shrink-0"><Brain size={14} /></span>
                    <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider">Tạo Đề Kiểm Tra Tự Động (AI Quiz Generator)</h3>
                  </div>
                  
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Chọn bài học lý thuyết hiện có dưới đây. AI sẽ tự động phân tích văn bản để thiết kế trắc nghiệm bám sát bẫy đề thi.
                  </p>

                  <div className="space-y-3 pt-1">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Khóa học:</label>
                      <select 
                        value={selectedCourseId}
                        onChange={(e) => setSelectedCourseId(e.target.value)}
                        className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:bg-white focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400"
                      >
                        {courses.map(c => (
                          <option key={c.id} value={c.id}>{c.title}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Bài giảng nguồn:</label>
                      <select 
                        value={selectedLessonId}
                        onChange={(e) => setSelectedLessonId(e.target.value)}
                        className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:bg-white focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400"
                      >
                        {courses.find(c => c.id === selectedCourseId)?.lessons.map(l => (
                          <option key={l.id} value={l.id}>{l.title}</option>
                        )) || <option>Không có bài giảng</option>}
                      </select>
                    </div>

                    <button
                      onClick={handleTriggerAIQuizGen}
                      disabled={isGenerating}
                      className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 disabled:opacity-55 shadow-sm transition"
                    >
                      {isGenerating ? (
                        <>
                          <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Đang sinh câu hỏi...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles size={13} />
                          <span>Sinh Đề Trắc Nghiệm Tự Động</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* LOGS DISPLAY PANEL */}
                <div className="bg-slate-950 text-emerald-400 border border-slate-800 rounded-3xl p-6 shadow-xl font-mono text-[10px] flex flex-col justify-between overflow-hidden relative">
                  <div className="space-y-1 relative z-10">
                    <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-2 font-sans flex items-center gap-1.5 border-b border-slate-800 pb-2">
                      <Activity size={12} className="text-emerald-400" /> Trình trạng thực thi của AI
                    </h4>
                    
                    <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                      {generationLogs.length === 0 && !isGenerating && (
                        <p className="text-slate-500 italic">Nhấn nút "Sinh Đề Trắc Nghiệm" để quan sát quy trình phân tích và biên dịch của AI tại đây...</p>
                      )}
                      {generationLogs.map((log, idx) => (
                        <div key={idx} className="flex items-start gap-1">
                          <span className="text-emerald-500 font-extrabold shrink-0">{'>'}</span>
                          <span className="text-emerald-300 leading-normal">{log}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {generatedSuccess && (
                    <div className="mt-4 p-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl flex items-center space-x-2 font-sans animate-fade-in relative z-10">
                      <CheckCircle size={16} />
                      <div>
                        <div className="font-bold text-xs">Cấu Trúc Đề Luyện Tập Sẵn Sàng!</div>
                        <p className="text-[9px] text-emerald-500/80 mt-0.5">Học viên có thể trải nghiệm ngay bài thi thử trên Zalo Mini App.</p>
                      </div>
                    </div>
                  )}
                  {/* Decorative AI light */}
                  <div className="absolute -right-16 -bottom-16 w-48 h-48 bg-emerald-500/10 blur-[50px] rounded-full"></div>
                </div>
              </div>
            </div>
          )}

          {/* MENU 5: REAL DEVICE TESTING GUIDE */}
          {activeMenu === 'real-device' && (
            <div className="space-y-6 animate-fade-in max-w-4xl mx-auto pb-10 text-left">
              <div className="bg-gradient-to-tr from-slate-900 via-slate-800 to-indigo-950 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-base md:text-lg font-bold tracking-tight flex items-center gap-2 text-white">
                      <Smartphone className="text-emerald-400 animate-pulse" size={18} />
                      HƯỚNG DẪN KẾT NỐI THIẾT BỊ THẬT
                    </h2>
                    <p className="text-xs text-slate-300 mt-1 max-w-xl">
                      Mở và kiểm thử ứng dụng Zalo Mini App trực tiếp trên điện thoại của bạn mà không còn phụ thuộc vào AI Studio preview!
                    </p>
                  </div>
                  <a
                    href="/mini-app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 self-start md:self-auto shrink-0 shadow-lg"
                  >
                    <Globe size={14} />
                    <span>Mở /mini-app trực tiếp</span>
                  </a>
                </div>
                {/* Decorative glow */}
                <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-500/10 blur-[80px] rounded-full"></div>
              </div>

              {/* Grid sections */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Step 1: Chạy local & Lấy IP */}
                <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 font-extrabold flex items-center justify-center text-xs">
                        1
                      </div>
                      <h3 className="font-bold text-xs text-slate-800 uppercase tracking-wide">CHẠY LOCAL & LẤY IP</h3>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed mb-4">
                      Tải mã nguồn về máy tính, sau đó cài đặt và khởi động máy chủ thử nghiệm LAN:
                    </p>
                    
                    <div className="space-y-3 font-mono text-[10px]">
                      <div className="bg-slate-900 text-slate-200 rounded-xl p-3 border border-slate-800">
                        <span className="text-slate-500 block"># Bước 1: Khởi chạy dự án</span>
                        <code className="text-indigo-300 block mt-1">npm install</code>
                        <code className="text-indigo-300 block">npm run dev</code>
                      </div>
                      
                      <div className="bg-slate-900 text-slate-200 rounded-xl p-3 border border-slate-800">
                        <span className="text-slate-500 block"># Bước 2: Xem IPv4 của máy tính</span>
                        <span className="text-slate-400 block mt-1">• Windows (CMD / Powershell):</span>
                        <code className="text-emerald-300 block pl-2">ipconfig</code>
                        <span className="text-slate-400 block mt-1">• macOS / Linux (Terminal):</span>
                        <code className="text-emerald-300 block pl-2">ifconfig</code>
                        <span className="text-slate-400 block mt-1">• Tìm địa chỉ IPv4 hiển thị tại WiFi adapter.</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 2: Kết nối thiết bị mạng nội bộ */}
                <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 font-extrabold flex items-center justify-center text-xs">
                        2
                      </div>
                      <h3 className="font-bold text-xs text-slate-800 uppercase tracking-wide">KẾT NỐI QUA WIFI LAN</h3>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed mb-4">
                      Đảm bảo điện thoại và máy tính của bạn cùng kết nối vào một mạng WiFi, sau đó mở link:
                    </p>

                    <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 mb-4">
                      <span className="text-[9px] font-bold text-emerald-800 uppercase tracking-wide flex items-center gap-1.5">
                        <Wifi size={12} /> URL TRUY CẬP ĐIỆN THOẠI:
                      </span>
                      <div className="bg-white border border-emerald-100 rounded-xl px-2 py-2 mt-2 font-mono text-[11px] text-emerald-700 font-bold select-all text-center break-all">
                        http://&lt;local-ip&gt;:3000/mini-app
                      </div>
                      <p className="text-[9px] text-emerald-600 mt-2 leading-relaxed">
                        * Thay thế <code className="bg-emerald-100/50 px-1 rounded">&lt;local-ip&gt;</code> bằng IP máy tính của bạn (ví dụ: <code className="bg-emerald-100/50 px-1 rounded">192.168.1.15</code>).
                      </p>
                    </div>

                    <div className="text-[10px] text-slate-500 space-y-1 bg-slate-50 border border-slate-100 rounded-xl p-3">
                      <p className="font-semibold text-slate-700">💡 Tip tiện lợi:</p>
                      <p>Bạn có thể chuyển liên kết này thành mã QR trực tuyến rồi dùng camera điện thoại quét để mở ngay lập tức mà không cần gõ phím.</p>
                    </div>
                  </div>
                </div>

                {/* Step 3: Kiểm thử qua Zalo WebView */}
                <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 font-extrabold flex items-center justify-center text-xs">
                      3
                    </div>
                    <h3 className="font-bold text-xs text-slate-800 uppercase tracking-wide">KÈM INTERNET & ZALO WEBVIEW</h3>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed mb-4">
                    Zalo WebView yêu cầu kết nối bảo mật <strong>HTTPS</strong> để mở được nội dung trong ứng dụng. Hãy tunnel dự án qua internet với ngrok:
                  </p>

                  <div className="space-y-3 font-mono text-[10px] mb-3">
                    <div className="bg-slate-900 text-slate-200 rounded-xl p-3 border border-slate-800">
                      <span className="text-slate-500 block"># Tạo đường truyền HTTPS công khai</span>
                      <code className="text-indigo-300 block mt-1">npx ngrok http 3000</code>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-[11px] text-slate-600 leading-relaxed bg-slate-50 border border-slate-100 rounded-2xl p-4">
                    <p className="font-bold text-slate-700">Các bước mở link trong Zalo:</p>
                    <p>1. Copy đường dẫn <code className="bg-indigo-50 text-indigo-600 px-1 py-0.5 rounded font-mono font-bold">https://xxxx.ngrok-free.app</code> trong cửa sổ ngrok.</p>
                    <p>2. Thêm phần <code className="bg-indigo-50 text-indigo-600 px-1 py-0.5 rounded font-mono font-bold">/mini-app</code> vào sau link.</p>
                    <p>3. Gửi link này vào tin nhắn Zalo (ví dụ "Cloud của tôi") rồi nhấp để mở trực tiếp trong Zalo WebView!</p>
                  </div>
                </div>

                {/* Step 4: Chẩn đoán lỗi (Debug) */}
                <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 font-extrabold flex items-center justify-center text-xs">
                        <HelpCircle size={14} />
                      </div>
                      <h3 className="font-bold text-xs text-slate-800 uppercase tracking-wide">CHẨN ĐOÁN LỖI (DEBUG)</h3>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed mb-4">
                      Giải quyết các vấn đề thường gặp trong quá trình kết nối thiết bị thật:
                    </p>

                    <div className="space-y-3 text-[10px] leading-relaxed">
                      <div className="border-l-2 border-rose-500 pl-3">
                        <h4 className="font-bold text-slate-800">1. Không kết nối được bằng WiFi?</h4>
                        <p className="text-slate-500 mt-0.5">Kiểm tra Firewall trên máy tính có đang chặn cổng 3000 hay không, hoặc thiết bị đã bật chế độ cô lập mạng (AP isolation) trong Router WiFi.</p>
                      </div>

                      <div className="border-l-2 border-amber-500 pl-3">
                        <h4 className="font-bold text-slate-800">2. Giao diện bị vỡ, hiển thị sai kích thước?</h4>
                        <p className="text-slate-500 mt-0.5">Đảm bảo truy cập đúng đường dẫn <code className="bg-slate-100 px-1 rounded font-mono">/mini-app</code> để hiển thị trọn vẹn màn hình dạng Mobile-First thay vì bản Web Dashboard.</p>
                      </div>

                      <div className="border-l-2 border-blue-500 pl-3">
                        <h4 className="font-bold text-slate-800">3. Zalo báo lỗi không mở được link?</h4>
                        <p className="text-slate-500 mt-0.5">Zalo WebView chặn các đường link không phải <strong>HTTPS</strong>. Đảm bảo bạn đang sử dụng link HTTPS sinh ra từ ngrok hoặc công cụ tunnel tương tự.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
