import express from 'express'
import { prisma } from '../index'
import { authenticate, AuthenticatedRequest } from '../middleware/auth'

const router = express.Router()

// Get subscription plans
router.get('/plans', async (req, res, next) => {
  try {
    const plans = await prisma.subscriptionPlan.findMany({
      where: { isActive: true },
      orderBy: { price: 'asc' }
    })
    
    res.json({
      success: true,
      data: plans
    })
  } catch (error) {
    next(error)
  }
})

// Get current subscription
router.get('/current', authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.user!.id
    
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId,
        status: 'active'
      },
      include: {
        plan: true
      }
    })
    
    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'No active subscription found'
      })
    }
    
    res.json({
      success: true,
      data: subscription
    })
  } catch (error) {
    next(error)
  }
})

export default router