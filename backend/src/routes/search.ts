import express from 'express'
import { prisma } from '../index'

const router = express.Router()

// Search contents
router.get('/contents', async (req, res, next) => {
  try {
    const query = req.query.q as string
    
    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      })
    }
    
    const contents = await prisma.content.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } }
        ]
      },
      include: {
        uploader: {
          select: { id: true, firstName: true, lastName: true }
        },
        course: {
          select: { id: true, name: true, code: true }
        }
      },
      take: 20
    })
    
    res.json({
      success: true,
      data: contents
    })
  } catch (error) {
    next(error)
  }
})

// Search institutions
router.get('/institutions', async (req, res, next) => {
  try {
    const query = req.query.q as string
    
    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      })
    }
    
    const institutions = await prisma.institution.findMany({
      where: {
        name: { contains: query, mode: 'insensitive' }
      },
      take: 10
    })
    
    res.json({
      success: true,
      data: institutions
    })
  } catch (error) {
    next(error)
  }
})

export default router