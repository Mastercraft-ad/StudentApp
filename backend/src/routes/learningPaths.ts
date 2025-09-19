import express from 'express'
import { prisma } from '../index'
import { authenticate, AuthenticatedRequest } from '../middleware/auth'

const router = express.Router()

// Get user's learning paths
router.get('/', authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.user!.id
    
    const learningPaths = await prisma.learningPath.findMany({
      where: { userId },
      include: {
        course: {
          select: { id: true, name: true, code: true }
        },
        tasks: {
          select: {
            id: true,
            title: true,
            status: true,
            dueDate: true
          },
          orderBy: { createdAt: 'asc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    
    res.json({
      success: true,
      data: learningPaths
    })
  } catch (error) {
    next(error)
  }
})

// Get single learning path
router.get('/:id', authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    const id = parseInt(req.params.id)
    const userId = req.user!.id
    
    const learningPath = await prisma.learningPath.findFirst({
      where: { id, userId },
      include: {
        course: {
          select: { id: true, name: true, code: true }
        },
        tasks: {
          orderBy: { createdAt: 'asc' }
        }
      }
    })
    
    if (!learningPath) {
      return res.status(404).json({
        success: false,
        message: 'Learning path not found'
      })
    }
    
    res.json({
      success: true,
      data: learningPath
    })
  } catch (error) {
    next(error)
  }
})

export default router