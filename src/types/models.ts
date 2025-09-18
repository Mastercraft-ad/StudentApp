// StudentDrive MVP - TypeScript Interfaces for Laravel Backend Integration

export interface User {
  id: number
  name: string
  email: string
  email_verified_at?: string
  role: 'student' | 'institution' | 'admin'
  avatar?: string
  created_at: string
  updated_at: string
  
  // Onboarding fields
  program?: string
  institution_id?: number
  level?: 'undergraduate' | 'graduate' | 'professional'
  discovered_via?: string
  goals?: string[]
  onboarding_completed_at?: string
}

export interface Institution {
  id: number
  name: string
  slug: string
  country: string
  city?: string
  logo?: string
  website?: string
  created_at: string
  updated_at: string
}

export interface Course {
  id: number
  name: string
  code?: string
  description?: string
  institution_id: number
  institution?: Institution
  cover_image?: string
  created_at: string
  updated_at: string
  contents_count?: number
}

export interface Content {
  id: number
  title: string
  type: 'notes' | 'past-exams' | 'questions' | 'video' | 'document'
  description?: string
  file_path: string
  file_url?: string
  file_size?: number
  file_type?: string
  thumbnail?: string
  course_id: number
  course?: Course
  uploader_id: number
  uploader?: User
  downloads_count: number
  average_rating: number
  ratings_count: number
  is_verified: boolean
  metadata?: Record<string, any>
  created_at: string
  updated_at: string
}

export interface ContentRating {
  id: number
  content_id: number
  user_id: number
  rating: number
  feedback?: string
  created_at: string
  updated_at: string
}

export interface Flashcard {
  id: number
  question: string
  answer: string
  explanation?: string
  difficulty: 'easy' | 'medium' | 'hard'
  tags?: string[]
  content_id?: number
  user_id: number
  created_at: string
  updated_at: string
}

export interface Quiz {
  id: number
  title: string
  description?: string
  questions: QuizQuestion[]
  time_limit?: number
  user_id: number
  created_at: string
  updated_at: string
}

export interface QuizQuestion {
  id: number
  question: string
  type: 'multiple-choice' | 'true-false' | 'short-answer'
  options?: string[]
  correct_answer: string | number
  explanation?: string
  points: number
}

export interface Exam {
  id: number
  title: string
  description?: string
  duration: number // in minutes
  question_count: number
  topics?: string[]
  difficulty: 'easy' | 'medium' | 'hard' | 'mixed'
  settings: ExamSettings
  questions: ExamQuestion[]
  user_id: number
  created_at: string
  updated_at: string
}

export interface ExamSettings {
  shuffle_questions: boolean
  shuffle_options: boolean
  show_results_immediately: boolean
  allow_review: boolean
  auto_submit: boolean
}

export interface ExamQuestion {
  id: number
  question: string
  type: 'multiple-choice' | 'true-false' | 'essay'
  options?: string[]
  correct_answer: string | number
  explanation?: string
  points: number
  topic?: string
}

export interface ExamAttempt {
  id: number
  exam_id: number
  exam?: Exam
  user_id: number
  user?: User
  answers: ExamAnswer[]
  score: number
  max_score: number
  percentage: number
  time_taken: number // in seconds
  started_at: string
  completed_at?: string
  status: 'in-progress' | 'completed' | 'abandoned'
}

export interface ExamAnswer {
  question_id: number
  answer: string | number | string[]
  is_correct: boolean
  points_earned: number
}

export interface ExamResult {
  attempt: ExamAttempt
  score: number
  max_score: number
  percentage: number
  time_taken: number
  breakdown: {
    correct_answers: number
    incorrect_answers: number
    unanswered: number
    by_topic: Record<string, {
      correct: number
      total: number
      percentage: number
    }>
  }
  weak_topics: string[]
  recommendations: string[]
}

export interface LearningPath {
  id: number
  title: string
  description?: string
  target_date: string
  daily_hours: number
  topics: string[]
  schedule: LearningPathTask[]
  progress: number // 0-100
  user_id: number
  created_at: string
  updated_at: string
}

export interface LearningPathTask {
  id: number
  title: string
  description?: string
  type: 'study' | 'practice' | 'review' | 'exam'
  estimated_duration: number // in minutes
  due_date: string
  completed_at?: string
  content_ids?: number[]
  status: 'pending' | 'in-progress' | 'completed' | 'overdue'
}

export interface SpacedRepetitionItem {
  id: number
  content_id: number
  content?: Content
  user_id: number
  ease_factor: number
  interval: number // in days
  repetitions: number
  quality: number // last quality rating (0-5)
  next_review_date: string
  last_reviewed_at?: string
  created_at: string
  updated_at: string
}

export interface Subscription {
  id: number
  user_id: number
  plan_id: string
  status: 'active' | 'inactive' | 'cancelled' | 'expired'
  current_period_start: string
  current_period_end: string
  stripe_subscription_id?: string
  stripe_customer_id?: string
  created_at: string
  updated_at: string
}

export interface SubscriptionPlan {
  id: string
  name: string
  description: string
  price: number
  currency: string
  interval: 'month' | 'year'
  features: string[]
  limits: {
    uploads_per_month?: number
    ai_requests_per_month?: number
    storage_gb?: number
  }
  is_popular?: boolean
  stripe_price_id?: string
}

export interface MindMapNode {
  id: string
  label: string
  type: 'root' | 'branch' | 'leaf'
  position: { x: number; y: number }
  data: {
    content?: string
    color?: string
    size?: number
  }
  children?: string[] // IDs of child nodes
}

export interface MindMap {
  id: number
  title: string
  description?: string
  nodes: MindMapNode[]
  edges: MindMapEdge[]
  user_id: number
  content_ids?: number[]
  created_at: string
  updated_at: string
}

export interface MindMapEdge {
  id: string
  source: string
  target: string
  type?: string
  animated?: boolean
}

export interface PerformanceSummary {
  strengths: string[]
  weaknesses: string[]
  time_spent: {
    total_hours: number
    this_week: number
    daily_average: number
  }
  readiness: {
    overall: number // 0-100
    by_topic: Record<string, number>
  }
  recent_activity: ActivityItem[]
  recommendations: string[]
}

export interface ActivityItem {
  id: number
  type: 'upload' | 'download' | 'study' | 'exam' | 'flashcard' | 'quiz'
  title: string
  description?: string
  score?: number
  duration?: number
  created_at: string
}

export interface Summary {
  id: number
  title: string
  content: string
  key_points: string[]
  word_count: number
  reading_time: number // in minutes
  source_content_id?: number
  user_id: number
  created_at: string
  updated_at: string
}

// API Response Types
export interface ApiResponse<T> {
  data: T
  message?: string
  status: number
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
  links: {
    first?: string
    last?: string
    prev?: string
    next?: string
  }
}

export interface AuthResponse {
  user: User
  token: string
  expires_at: string
}

export interface LoginCredentials {
  email: string
  password: string
  remember_me?: boolean
}

export interface RegisterData {
  name: string
  email: string
  password: string
  password_confirmation: string
}

export interface OnboardingData {
  program: string
  institution_id: number
  level: 'undergraduate' | 'graduate' | 'professional'
  discovered_via: string
  goals: string[]
}

export interface UploadContentData {
  title: string
  type: 'notes' | 'past-exams' | 'questions' | 'video' | 'document'
  description?: string
  course_id: number
  file: File
  metadata?: Record<string, any>
}

export interface CreateExamData {
  title: string
  description?: string
  duration: number
  question_count: number
  topics?: string[]
  difficulty: 'easy' | 'medium' | 'hard' | 'mixed'
  settings: ExamSettings
}

export interface CreateLearningPathData {
  title: string
  description?: string
  target_date: string
  daily_hours: number
  topics: string[]
}

// Filter and Search Types
export interface ContentFilters {
  type?: string
  institution_id?: number
  course_id?: number
  rating_min?: number
  verified_only?: boolean
  search?: string
  sort_by?: 'recent' | 'popular' | 'rating'
  page?: number
  per_page?: number
}

export interface ExamFilters {
  difficulty?: string
  topic?: string
  duration_min?: number
  duration_max?: number
  search?: string
  page?: number
  per_page?: number
}

export interface UserStats {
  total_uploads: number
  total_downloads: number
  exams_taken: number
  average_exam_score: number
  study_streak: number
  total_study_hours: number
  flashcards_reviewed: number
  learning_paths_completed: number
}