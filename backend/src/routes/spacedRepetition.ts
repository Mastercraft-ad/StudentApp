import express from 'express'
import { prisma } from '../index'
import { authenticate, AuthenticatedRequest } from '../middleware/auth'

const router = express.Router()

// Get review queue
router.get('/queue', authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.user!.id
    
    const reviewItems = await prisma.spacedRepetitionItem.findMany({
      where: {
        userId,
        nextReview: { lte: new Date() }
      },
      include: {
        flashcard: true
      },
      orderBy: { nextReview: 'asc' }
    })
    
    res.json({
      success: true,
      data: reviewItems
    })
  } catch (error) {
    next(error)
  }
})

export default router