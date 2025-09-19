import express from 'express'
import { prisma } from '../index'
import { authenticate } from '../middleware/auth'

const router = express.Router()

// Get all exams with pagination
router.get('/', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    const skip = (page - 1) * limit
    
    const [exams, total] = await Promise.all([
      prisma.exam.findMany({
        skip,
        take: limit,
        where: { status: 'PUBLISHED' },
        include: {
          creator: {
            select: { id: true, firstName: true, lastName: true }
          },
          course: {
            select: { id: true, name: true, code: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.exam.count({ where: { status: 'PUBLISHED' } })
    ])
    
    res.json({
      success: true,
      data: exams,
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

// Get single exam
router.get('/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id)
    
    const exam = await prisma.exam.findUnique({
      where: { id },
      include: {
        creator: {
          select: { id: true, firstName: true, lastName: true }
        },
        course: {
          select: { id: true, name: true, code: true }
        }
      }
    })
    
    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'Exam not found'
      })
    }
    
    res.json({
      success: true,
      data: exam
    })
  } catch (error) {
    next(error)
  }
})

export default router