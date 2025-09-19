// StudentDrive MVP - API Client Service for Laravel Backend Integration

import axios, { AxiosInstance, AxiosError } from 'axios'
import {
  User,
  Institution,
  Course,
  Content,
  ContentFilters,
  UploadContentData,
  ContentRating,
  Flashcard,
  Quiz,
  Summary,
  MindMap,
  Exam,
  CreateExamData,
  ExamAttempt,
  ExamResult,
  LearningPath,
  CreateLearningPathData,
  LearningPathTask,
  SpacedRepetitionItem,
  SubscriptionPlan,
  Subscription,
  PerformanceSummary,
  AuthResponse,
  LoginCredentials,
  RegisterData,
  OnboardingData,
  ApiResponse,
  PaginatedResponse,
  ExamFilters,
  UserStats
} from '@/types/models'

// API Configuration  
const getApiBaseUrl = () => {
  // Check if we have an environment variable
  if (import.meta.env?.VITE_API_URL) {
    return import.meta.env.VITE_API_URL
  }
  
  // In Replit environment, construct API URL from current domain
  if (typeof window !== 'undefined' && window.location.hostname.includes('replit.dev')) {
    const currentHost = window.location.hostname
    return `https://${currentHost}:8000`
  }
  
  // Fallback to localhost for local development
  return 'http://localhost:8000'
}

const API_BASE_URL = getApiBaseUrl()
const API_TIMEOUT = 30000 // 30 seconds

class ApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: API_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      }
    })

    // Request interceptor for adding auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getAuthToken()
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // Response interceptor for handling common responses and errors
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        // Handle common error scenarios
        if (error.response?.status === 401) {
          this.clearAuthToken()
          // Redirect to login or emit auth error event
          window.location.href = '/auth/login'
        }
        
        if (error.response?.status === 422) {
          // Validation errors - pass them through
          return Promise.reject(error)
        }

        if (error.response && error.response.status >= 500) {
          console.error('Server error:', error.response.data)
        }

        return Promise.reject(error)
      }
    )
  }

  // Auth Token Management
  private getAuthToken(): string | null {
    return localStorage.getItem('studentdrive_auth_token')
  }

  private setAuthToken(token: string): void {
    localStorage.setItem('studentdrive_auth_token', token)
  }

  private clearAuthToken(): void {
    localStorage.removeItem('studentdrive_auth_token')
    localStorage.removeItem('studentdrive_user')
  }

  // Authentication Endpoints
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await this.client.post<ApiResponse<AuthResponse>>('/api/auth/register', data)
    const authData = response.data.data
    this.setAuthToken(authData.token)
    localStorage.setItem('studentdrive_user', JSON.stringify(authData.user))
    return authData
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await this.client.post<ApiResponse<AuthResponse>>('/api/auth/login', credentials)
    const authData = response.data.data
    this.setAuthToken(authData.token)
    localStorage.setItem('studentdrive_user', JSON.stringify(authData.user))
    return authData
  }

  async logout(): Promise<void> {
    try {
      await this.client.post('/api/auth/logout')
    } finally {
      this.clearAuthToken()
    }
  }

  async getCurrentUser(): Promise<User> {
    const response = await this.client.get<ApiResponse<User>>('/api/auth/me')
    return response.data.data
  }

  async updateOnboarding(userId: number, data: OnboardingData): Promise<User> {
    const response = await this.client.put<ApiResponse<User>>(`/api/users/${userId}/onboarding`, data)
    return response.data.data
  }

  // Institution Endpoints
  async getInstitutions(): Promise<Institution[]> {
    const response = await this.client.get<ApiResponse<Institution[]>>('/api/institutions')
    return response.data.data
  }

  async getInstitution(id: number): Promise<Institution> {
    const response = await this.client.get<ApiResponse<Institution>>(`/api/institutions/${id}`)
    return response.data.data
  }

  // Course Endpoints
  async getCourses(): Promise<Course[]> {
    const response = await this.client.get<ApiResponse<Course[]>>('/api/courses')
    return response.data.data
  }

  async getCourse(id: number): Promise<Course> {
    const response = await this.client.get<ApiResponse<Course>>(`/api/courses/${id}`)
    return response.data.data
  }

  async createCourse(data: FormData): Promise<Course> {
    const response = await this.client.post<ApiResponse<Course>>('/api/courses', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data.data
  }

  // Content Endpoints
  async getContents(filters?: ContentFilters): Promise<PaginatedResponse<Content>> {
    const response = await this.client.get<PaginatedResponse<Content>>('/api/contents', {
      params: filters
    })
    return response.data
  }

  async uploadContent(data: UploadContentData): Promise<Content> {
    const formData = new FormData()
    formData.append('title', data.title)
    formData.append('type', data.type)
    formData.append('course_id', data.course_id.toString())
    formData.append('file', data.file)
    
    if (data.description) {
      formData.append('description', data.description)
    }
    
    if (data.metadata) {
      formData.append('metadata', JSON.stringify(data.metadata))
    }

    const response = await this.client.post<ApiResponse<Content>>('/api/contents', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data.data
  }

  async getContentDownloadUrl(id: number): Promise<string> {
    const response = await this.client.get<ApiResponse<{ url: string }>>(`/api/contents/${id}/download`)
    return response.data.data.url
  }

  async rateContent(id: number, rating: number, feedback?: string): Promise<ContentRating> {
    const response = await this.client.post<ApiResponse<ContentRating>>(`/api/contents/${id}/rate`, {
      rating,
      feedback
    })
    return response.data.data
  }

  // AI Tools Endpoints
  async generateFlashcards(contentIds: number[]): Promise<Flashcard[]> {
    const response = await this.client.post<ApiResponse<{ flashcards: Flashcard[] }>>('/api/ai/flashcards', {
      content_ids: contentIds
    })
    return response.data.data.flashcards
  }

  async generateQuiz(params: { content_ids?: number[], youtube_url?: string }): Promise<Quiz> {
    const response = await this.client.post<ApiResponse<{ quiz: Quiz }>>('/api/ai/quiz', params)
    return response.data.data.quiz
  }

  async generateSummary(params: { content_id?: number, text?: string }): Promise<Summary> {
    const response = await this.client.post<ApiResponse<{ summary: Summary }>>('/api/ai/summarize', params)
    return response.data.data.summary
  }

  async generateMindmap(contentIds: number[]): Promise<MindMap> {
    const response = await this.client.post<ApiResponse<{ mindmap: MindMap }>>('/api/ai/mindmap', {
      content_ids: contentIds
    })
    return response.data.data.mindmap
  }

  // Exam Endpoints
  async createExam(data: CreateExamData): Promise<{ exam_id: number }> {
    const response = await this.client.post<ApiResponse<{ exam_id: number }>>('/api/exams', data)
    return response.data.data
  }

  async getExam(id: number): Promise<Exam> {
    const response = await this.client.get<ApiResponse<Exam>>(`/api/exams/${id}`)
    return response.data.data
  }

  async getExams(filters?: ExamFilters): Promise<PaginatedResponse<Exam>> {
    const response = await this.client.get<PaginatedResponse<Exam>>('/api/exams', {
      params: filters
    })
    return response.data
  }

  async submitExam(examId: number, answers: any[]): Promise<ExamResult> {
    const response = await this.client.post<ApiResponse<ExamResult>>(`/api/exams/${examId}/submit`, {
      answers
    })
    return response.data.data
  }

  async getExamAttempts(examId?: number): Promise<ExamAttempt[]> {
    const url = examId ? `/api/exams/${examId}/attempts` : '/api/exam-attempts'
    const response = await this.client.get<ApiResponse<ExamAttempt[]>>(url)
    return response.data.data
  }

  // Learning Path & Scheduling Endpoints
  async createLearningPath(data: CreateLearningPathData): Promise<LearningPath> {
    const response = await this.client.post<ApiResponse<{ schedule: LearningPath }>>('/api/learning-paths', data)
    return response.data.data.schedule
  }

  async getLearningPath(id: number): Promise<LearningPath> {
    const response = await this.client.get<ApiResponse<LearningPath>>(`/api/learning-paths/${id}`)
    return response.data.data
  }

  async getLearningPaths(): Promise<LearningPath[]> {
    const response = await this.client.get<ApiResponse<LearningPath[]>>('/api/learning-paths')
    return response.data.data
  }

  async updateTaskStatus(taskId: number, status: string): Promise<LearningPathTask> {
    const response = await this.client.patch<ApiResponse<LearningPathTask>>(`/api/learning-path-tasks/${taskId}`, {
      status
    })
    return response.data.data
  }

  // Spaced Repetition Endpoints
  async getReviewQueue(): Promise<SpacedRepetitionItem[]> {
    const response = await this.client.get<ApiResponse<SpacedRepetitionItem[]>>('/api/spaced-repetition/queue')
    return response.data.data
  }

  async reviewItem(itemId: number, quality: number): Promise<SpacedRepetitionItem> {
    const response = await this.client.post<ApiResponse<SpacedRepetitionItem>>(`/api/spaced-repetition/${itemId}/review`, {
      quality
    })
    return response.data.data
  }

  // Subscription Endpoints
  async getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    const response = await this.client.get<ApiResponse<SubscriptionPlan[]>>('/api/subscriptions/plans')
    return response.data.data
  }

  async createSubscription(planId: string, paymentToken: string): Promise<Subscription> {
    const response = await this.client.post<ApiResponse<Subscription>>('/api/subscriptions', {
      plan_id: planId,
      payment_token: paymentToken
    })
    return response.data.data
  }

  async getCurrentSubscription(): Promise<Subscription | null> {
    try {
      const response = await this.client.get<ApiResponse<Subscription>>('/api/subscriptions/current')
      return response.data.data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null
      }
      throw error
    }
  }

  async cancelSubscription(): Promise<void> {
    await this.client.delete('/api/subscriptions/current')
  }

  // Dashboard & Analytics Endpoints
  async getDashboardSummary(): Promise<PerformanceSummary> {
    const response = await this.client.get<ApiResponse<PerformanceSummary>>('/api/dashboard/summary')
    return response.data.data
  }

  async getUserStats(): Promise<UserStats> {
    const response = await this.client.get<ApiResponse<UserStats>>('/api/users/stats')
    return response.data.data
  }

  // File Upload Helper
  async uploadFile(file: File, type: 'avatar' | 'content' | 'document' = 'content'): Promise<string> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', type)

    const response = await this.client.post<ApiResponse<{ url: string }>>('/api/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data.data.url
  }

  // Search Endpoints
  async searchContent(query: string, filters?: ContentFilters): Promise<Content[]> {
    const response = await this.client.get<ApiResponse<Content[]>>('/api/search/contents', {
      params: { q: query, ...filters }
    })
    return response.data.data
  }

  async searchInstitutions(query: string): Promise<Institution[]> {
    const response = await this.client.get<ApiResponse<Institution[]>>('/api/search/institutions', {
      params: { q: query }
    })
    return response.data.data
  }

  // Health Check
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.client.get('/api/health')
      return response.status === 200
    } catch (error) {
      console.error('Health check failed:', error)
      return false
    }
  }
}

// Create and export singleton instance
export const apiClient = new ApiClient()

// Export individual API methods for easier importing
export const {
  // Auth
  register,
  login,
  logout,
  getCurrentUser,
  updateOnboarding,
  
  // Institutions & Courses
  getInstitutions,
  getInstitution,
  getCourses,
  getCourse,
  createCourse,
  
  // Content
  getContents,
  uploadContent,
  getContentDownloadUrl,
  rateContent,
  
  // AI Tools
  generateFlashcards,
  generateQuiz,
  generateSummary,
  generateMindmap,
  
  // Exams
  createExam,
  getExam,
  getExams,
  submitExam,
  getExamAttempts,
  
  // Learning Paths
  createLearningPath,
  getLearningPath,
  getLearningPaths,
  updateTaskStatus,
  
  // Spaced Repetition
  getReviewQueue,
  reviewItem,
  
  // Subscriptions
  getSubscriptionPlans,
  createSubscription,
  getCurrentSubscription,
  cancelSubscription,
  
  // Dashboard
  getDashboardSummary,
  getUserStats,
  
  // Utilities
  uploadFile,
  searchContent,
  searchInstitutions,
  healthCheck
} = apiClient

export default apiClient