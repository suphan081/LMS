export type OrganizationId = 'TOEIC_CENTER' | 'JLPT_CENTER';

export interface Organization {
  id: OrganizationId;
  name: string;
  logo: string;
  description: string;
  themeColor: string;
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  contentType: 'video' | 'pdf' | 'text';
  contentUrl: string;
  summary: string;
  contentBody: string; // Used by AI to generate summary and quiz
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  lessonId: string;
  title: string;
  questions: QuizQuestion[];
}

export interface Course {
  id: string;
  title: string;
  thumbnail: string;
  level: string;
  lessonsCount: number;
  enrollments: number;
  lessons: Lesson[];
  quizzes: Quiz[];
}

export interface UserProgress {
  courseId: string;
  completedLessonIds: string[];
  quizScores: { [quizId: string]: number }; // quizId -> score (e.g. 80%)
  quizAnswers: { [quizId: string]: number[] }; // quizId -> indices of selected options
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
  context?: {
    courseId?: string;
    lessonId?: string;
    quizId?: string;
  };
}

export interface AIWeaknessReport {
  skills: { name: string; score: number }[]; // e.g., Grammar: 45, Vocab: 80
  summary: string;
  recommendations: string[];
}

export interface StudentProfile {
  id: string;
  name: string;
  avatar: string;
  email: string;
  progress: { [courseId: string]: number }; // percentage
  weaknesses: { [courseId: string]: string[] };
  activityLog: { date: string; action: string }[];
}
