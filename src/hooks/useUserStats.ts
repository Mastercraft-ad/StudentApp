import { useState, useEffect } from 'react'

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

const STORAGE_KEYS = {
  USER_STATS: 'studentdrive_user_stats',
  RECENT_ACTIVITY: 'studentdrive_recent_activity',
  TODAY_SCHEDULE: 'studentdrive_today_schedule',
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
  const [stats, setStats] = useState<UserStats>(DEFAULT_STATS)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = () => {
    try {
      const savedStats = localStorage.getItem(STORAGE_KEYS.USER_STATS)
      const savedActivity = localStorage.getItem(STORAGE_KEYS.RECENT_ACTIVITY)
      const savedSchedule = localStorage.getItem(STORAGE_KEYS.TODAY_SCHEDULE)

      const loadedStats = savedStats ? JSON.parse(savedStats) : DEFAULT_STATS
      const loadedActivity = savedActivity ? JSON.parse(savedActivity) : []
      const loadedSchedule = savedSchedule ? JSON.parse(savedSchedule) : []

      setStats({
        ...loadedStats,
        recentActivity: loadedActivity.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp)
        })),
        todaySchedule: loadedSchedule,
      })
    } catch (error) {
      console.error('Error loading user stats:', error)
      setStats(DEFAULT_STATS)
    } finally {
      setIsLoading(false)
    }
  }

  const updateStats = (newStats: Partial<UserStats>) => {
    const updatedStats = { ...stats, ...newStats }
    setStats(updatedStats)
    
    try {
      localStorage.setItem(STORAGE_KEYS.USER_STATS, JSON.stringify({
        studyStreak: updatedStats.studyStreak,
        totalStudyTime: updatedStats.totalStudyTime,
        examAverage: updatedStats.examAverage,
        goalsCompleted: updatedStats.goalsCompleted,
        totalGoals: updatedStats.totalGoals,
      }))
      
      localStorage.setItem(STORAGE_KEYS.RECENT_ACTIVITY, JSON.stringify(updatedStats.recentActivity))
      localStorage.setItem(STORAGE_KEYS.TODAY_SCHEDULE, JSON.stringify(updatedStats.todaySchedule))
    } catch (error) {
      console.error('Error saving user stats:', error)
    }
  }

  const addActivity = (activity: Omit<ActivityItem, 'id' | 'timestamp'>) => {
    const newActivity: ActivityItem = {
      ...activity,
      id: Date.now().toString(),
      timestamp: new Date(),
    }

    const updatedActivity = [newActivity, ...stats.recentActivity].slice(0, 10) // Keep only latest 10
    updateStats({ recentActivity: updatedActivity })
  }

  const addScheduleItem = (item: Omit<ScheduleItem, 'id'>) => {
    const newItem: ScheduleItem = {
      ...item,
      id: Date.now().toString(),
    }

    const updatedSchedule = [...stats.todaySchedule, newItem]
    updateStats({ todaySchedule: updatedSchedule })
  }

  const incrementStudyTime = (hours: number) => {
    updateStats({ 
      totalStudyTime: stats.totalStudyTime + hours,
      studyStreak: stats.studyStreak + 1
    })
  }

  const updateExamScore = (score: number) => {
    // Simple average calculation - in real app you'd want more sophisticated tracking
    const newAverage = stats.examAverage === 0 
      ? score 
      : Math.round((stats.examAverage + score) / 2)
    
    updateStats({ examAverage: newAverage })
  }

  const completeGoal = () => {
    updateStats({ 
      goalsCompleted: stats.goalsCompleted + 1 
    })
  }

  const addGoal = () => {
    updateStats({ 
      totalGoals: stats.totalGoals + 1 
    })
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