import express from 'express'
import { prisma } from '../index'
import { authenticate } from '../middleware/auth'

const router = express.Router()

// Get all contents with pagination
router.get('/', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    const skip = (page - 1) * limit
    
    const [contents, total] = await Promise.all([
      prisma.content.findMany({
        skip,
        take: limit,
        include: {
          uploader: {
            select: { id: true, firstName: true, lastName: true }
          },
          course: {
            select: { id: true, name: true, code: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.content.count()
    ])
    
    res.json({
      success: true,
      data: contents,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    next(error)
  }
})

export default router