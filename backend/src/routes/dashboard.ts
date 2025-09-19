import express from 'express'
import { prisma } from '../index'
import { authenticate, AuthenticatedRequest } from '../middleware/auth'

const router = express.Router()

// Get dashboard summary
router.get('/summary', authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.user!.id
    
    // Get comprehensive dashboard data
    const [
      recentExamAttempts,
      contentCount,
      averageScore,
      weakTopics,
      upcomingTasks,
      learningPaths
    ] = await Promise.all([
      // Recent exam attempts
      prisma.examAttempt.findMany({
        where: { userId },
        take: 5,
        orderBy: { startedAt: 'desc' },
        include: {
          exam: {
            select: { title: true }
          },
          quiz: {
            select: { title: true }
          }
        }
      }),
      
      // Content uploaded by user
      prisma.content.count({ where: { uploaderId: userId } }),
      
      // Average score
      prisma.examAttempt.aggregate({
        where: { userId, score: { not: null } },
        _avg: { score: true }
      }),
      
      // Weak topics (simplified - would need more sophisticated analysis)
      prisma.examAttempt.findMany({
        where: {
          userId,
          score: { lt: 70 } // Below 70% considered weak
        },
        take: 3,
        orderBy: { startedAt: 'desc' },
        include: {
          exam: {
            select: { title: true }
          }
        }
      }),
      
      // Upcoming learning path tasks
      prisma.learningPathTask.findMany({
        where: {
          learningPath: { userId },
          status: 'PENDING',
          dueDate: { gte: new Date() }
        },
        take: 5,
        orderBy: { dueDate: 'asc' },
        include: {
          learningPath: {
            select: { title: true }
          }
        }
      }),
      
      // Active learning paths
      prisma.learningPath.findMany({
        where: { userId, isActive: true },
        include: {
          tasks: {
            select: {
              status: true
            }
          }
        }
      })
    ])
    
    // Calculate progress for learning paths
    const learningPathsWithProgress = learningPaths.map(path => {
      const totalTasks = path.tasks.length
      const completedTasks = path.tasks.filter(task => task.status === 'COMPLETED').length
      const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0
      
      return {
        ...path,
        progress,
        tasks: undefined // Remove detailed tasks from response
      }
    })
    
    res.json({
      success: true,
      data: {
        recentScores: recentExamAttempts.map(attempt => ({
          id: attempt.id,
          title: attempt.exam?.title || attempt.quiz?.title || 'Untitled',
          score: attempt.score,
          date: attempt.startedAt
        })),
        contentUploaded: contentCount,
        averageScore: Math.round(averageScore._avg.score || 0),
        weakTopics: weakTopics.map(attempt => attempt.exam?.title || 'Unknown Topic'),
        upcomingTasks: upcomingTasks.map(task => ({
          id: task.id,
          title: task.title,
          dueDate: task.dueDate,
          learningPath: task.learningPath.title
        })),
        learningPaths: learningPathsWithProgress.map(path => ({
          id: path.id,
          title: path.title,
          progress: path.progress,
          targetExamDate: path.targetExamDate
        })),
        studyStreak: recentExamAttempts.length // Simplified streak calculation
      }
    })
  } catch (error) {
    next(error)
  }
})

export default router