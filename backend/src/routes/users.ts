import express from 'express'
import { z } from 'zod'
import { prisma } from '../index'
import { authenticate, AuthenticatedRequest } from '../middleware/auth'

const router = express.Router()

const onboardingSchema = z.object({
  program: z.string().optional(),
  institutionId: z.number().optional(),
  currentLevel: z.string().optional(),
  discoverySource: z.string().optional(),
  goals: z.array(z.string()).optional()
})

// Update user onboarding
router.put('/:id/onboarding', authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = parseInt(req.params.id)
    const validatedData = onboardingSchema.parse(req.body)
    
    // Ensure user can only update their own onboarding
    if (req.user!.id !== userId && req.user!.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Cannot update another user\'s onboarding'
      })
    }
    
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        program: validatedData.program,
        institutionId: validatedData.institutionId,
        currentLevel: validatedData.currentLevel,
        discoverySource: validatedData.discoverySource,
        goals: validatedData.goals
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        subscriptionTier: true,
        program: true,
        currentLevel: true,
        discoverySource: true,
        goals: true,
        institutionId: true,
        institution: {
          select: {
            id: true,
            name: true,
            code: true
          }
        }
      }
    })
    
    res.json({
      success: true,
      data: user
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.errors
      })
    }
    next(error)
  }
})

// Get user stats
router.get('/stats', authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.user!.id
    
    // Get user statistics
    const [
      contentCount,
      examAttempts,
      averageScore,
      studyStreak
    ] = await Promise.all([
      prisma.content.count({ where: { uploaderId: userId } }),
      prisma.examAttempt.count({ where: { userId } }),
      prisma.examAttempt.aggregate({
        where: { userId, score: { not: null } },
        _avg: { score: true }
      }),
      // Simple streak calculation - this could be more sophisticated
      prisma.examAttempt.count({
        where: {
          userId,
          startedAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
          }
        }
      })
    ])
    
    res.json({
      success: true,
      data: {
        contentUploaded: contentCount,
        totalAttempts: examAttempts,
        averageScore: averageScore._avg.score || 0,
        studyStreak,
        monthlyActivity: studyStreak // Simplified for now
      }
    })
  } catch (error) {
    next(error)
  }
})

export default router