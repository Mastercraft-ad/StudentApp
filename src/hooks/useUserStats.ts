import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/services/api'

export interface UserStats {
  studyStreak: number
  totalStudyTime: number // in hours
  examAverage: number // percentage
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

const DEFAULT_STATS: UserStats = {
  studyStreak: 0,
  totalStudyTime: 0,
  examAverage: 0,
  goalsCompleted: 0,
  totalGoals: 0,
  recentActivity: [],
  todaySchedule: [],
}

export function useUserStats() {
  const queryClient = useQueryClient()
  
  // Fetch user stats from API
  const { data: stats = DEFAULT_STATS, isLoading, error } = useQuery({
    queryKey: ['userStats'],
    queryFn: async () => {
      try {
        return await apiClient.getUserStats()
      } catch (error) {
        console.warn('Failed to fetch user stats, using defaults:', error)
        return DEFAULT_STATS
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  })

  // Mutations for updating stats
  const updateStatsMutation = useMutation({
    mutationFn: async (updates: Partial<UserStats>) => {
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
      totalStudyTime: stats.totalStudyTime + hours,
      studyStreak: stats.studyStreak + 1
    })
  }

  const updateExamScore = (score: number) => {
    // Simple average calculation - in real app you'd want more sophisticated tracking
    const newAverage = stats.examAverage === 0 
      ? score 
      : Math.round((stats.examAverage + score) / 2)
    
    updateStatsMutation.mutate({ examAverage: newAverage })
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

  const updateStats = (updates: Partial<UserStats>) => {
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