import express from 'express'
import { prisma } from '../index'

const router = express.Router()

// Get all institutions
router.get('/', async (req, res, next) => {
  try {
    const institutions = await prisma.institution.findMany({
      select: {
        id: true,
        name: true,
        code: true,
        country: true,
        type: true,
        isVerified: true
      },
      orderBy: { name: 'asc' }
    })
    
    res.json({
      success: true,
      data: institutions
    })
  } catch (error) {
    next(error)
  }
})

// Get single institution
router.get('/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id)
    
    const institution = await prisma.institution.findUnique({
      where: { id },
      include: {
        courses: {
          select: {
            id: true,
            name: true,
            code: true,
            description: true
          }
        }
      }
    })
    
    if (!institution) {
      return res.status(404).json({
        success: false,
        message: 'Institution not found'
      })
    }
    
    res.json({
      success: true,
      data: institution
    })
  } catch (error) {
    next(error)
  }
})

export default router