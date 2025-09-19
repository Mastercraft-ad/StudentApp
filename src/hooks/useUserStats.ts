import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/services/api'
import { UserStats as ApiUserStats } from '@/types/models'

// UI-specific interfaces for dashboard features
export interface DashboardStats extends ApiUserStats {
  goalsCompleted: number
  totalGoals: number
  recentActivity: ActivityItem[]
  todaySchedule: ScheduleItem[]
}

export interface ActivityItem {
  id: string
  type: 'quiz' | 'upload' | 'flashcards' | 'exam' | 'study'
  title: string
  description: string
  timestamp: Date
  score?: number
}

export interface ScheduleItem {
  id: string
  title: string
  time: string
  type: 'study' | 'practice' | 'quiz' | 'review'
}

const DEFAULT_STATS: DashboardStats = {
  // API stats
  total_uploads: 0,
  total_downloads: 0,
  exams_taken: 0,
  average_exam_score: 0,
  study_streak: 0,
  total_study_hours: 0,
  flashcards_reviewed: 0,
  learning_paths_completed: 0,
  // UI-specific stats
  goalsCompleted: 0,
  totalGoals: 0,
  recentActivity: [],
  todaySchedule: [],
}

export function useUserStats() {
  const queryClient = useQueryClient()
  
  // Fetch user stats from API
  const { data: apiStats = DEFAULT_STATS, isLoading } = useQuery({
    queryKey: ['userStats'],
    queryFn: async () => {
      try {
        const stats = await apiClient.getUserStats()
        return {
          ...DEFAULT_STATS,
          ...stats,
          // Keep existing UI state
          goalsCompleted: DEFAULT_STATS.goalsCompleted,
          totalGoals: DEFAULT_STATS.totalGoals,
          recentActivity: DEFAULT_STATS.recentActivity,
          todaySchedule: DEFAULT_STATS.todaySchedule,
        }
      } catch (error) {
        console.warn('Failed to fetch user stats, using defaults:', error)
        return DEFAULT_STATS
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  })

  // Combine API stats with local UI state
  const stats = apiStats

  // Mutations for updating stats
  const updateStatsMutation = useMutation({
    mutationFn: async (updates: Partial<DashboardStats>) => {
      // For now, optimistically update - in real app, you'd have specific endpoints
      return { ...stats, ...updates }
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['userStats'], data)
    },
  })

  const addActivity = (activity: Omit<ActivityItem, 'id' | 'timestamp'>) => {
    const newActivity: ActivityItem = {
      ...activity,
      id: Date.now().toString(),
      timestamp: new Date(),
    }

    const updatedActivity = [newActivity, ...stats.recentActivity].slice(0, 10) // Keep only latest 10
    updateStatsMutation.mutate({ recentActivity: updatedActivity })
  }

  const addScheduleItem = (item: Omit<ScheduleItem, 'id'>) => {
    const newItem: ScheduleItem = {
      ...item,
      id: Date.now().toString(),
    }

    const updatedSchedule = [...stats.todaySchedule, newItem]
    updateStatsMutation.mutate({ todaySchedule: updatedSchedule })
  }

  const incrementStudyTime = (hours: number) => {
    updateStatsMutation.mutate({ 
      total_study_hours: stats.total_study_hours + hours,
      study_streak: stats.study_streak + 1
    })
  }

  const updateExamScore = (score: number) => {
    // Simple average calculation - in real app you'd want more sophisticated tracking
    const newAverage = stats.average_exam_score === 0 
      ? score 
      : Math.round((stats.average_exam_score + score) / 2)
    
    updateStatsMutation.mutate({ 
      average_exam_score: newAverage,
      exams_taken: stats.exams_taken + 1
    })
  }

  const completeGoal = () => {
    updateStatsMutation.mutate({ 
      goalsCompleted: stats.goalsCompleted + 1 
    })
  }

  const addGoal = () => {
    updateStatsMutation.mutate({ 
      totalGoals: stats.totalGoals + 1 
    })
  }

  const updateStats = (updates: Partial<DashboardStats>) => {
    updateStatsMutation.mutate(updates)
  }

  return {
    stats,
    isLoading,
    addActivity,
    addScheduleItem,
    incrementStudyTime,
    updateExamScore,
    completeGoal,
    addGoal,
    updateStats,
  }
}