import express from 'express'
import { prisma } from '../index'
import { authenticate } from '../middleware/auth'

const router = express.Router()

// Get all courses
router.get('/', async (req, res, next) => {
  try {
    const courses = await prisma.course.findMany({
      include: {
        institution: {
          select: { id: true, name: true, code: true }
        }
      },
      orderBy: { name: 'asc' }
    })
    
    res.json({
      success: true,
      data: courses
    })
  } catch (error) {
    next(error)
  }
})

// Get single course
router.get('/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id)
    
    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        institution: {
          select: { id: true, name: true, code: true }
        },
        contents: {
          take: 10,
          orderBy: { createdAt: 'desc' }
        }
      }
    })
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      })
    }
    
    res.json({
      success: true,
      data: course
    })
  } catch (error) {
    next(error)
  }
})

export default router