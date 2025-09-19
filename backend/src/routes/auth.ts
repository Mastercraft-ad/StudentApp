import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import { prisma } from '../index'
import { authenticate, AuthenticatedRequest } from '../middleware/auth'

const router = express.Router()

// Validation schemas
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  role: z.enum(['STUDENT', 'INSTITUTION', 'ADMIN']).default('STUDENT')
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
})

const onboardingSchema = z.object({
  program: z.string().optional(),
  institutionId: z.number().optional(),
  currentLevel: z.string().optional(),
  discoverySource: z.string().optional(),
  goals: z.array(z.string()).optional()
})

// Helper function to generate JWT
const generateToken = (user: { id: number; email: string; role: string }) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET not configured')
  }
  
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  )
}

// Register endpoint
router.post('/register', async (req, res, next) => {
  try {
    const validatedData = registerSchema.parse(req.body)
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    })
    
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists'
      })
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 12)
    
    // Create user
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        password: hashedPassword,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        role: validatedData.role as any
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        subscriptionTier: true,
        createdAt: true
      }
    })
    
    // Generate JWT token
    const token = generateToken(user)
    
    res.status(201).json({
      success: true,
      data: {
        user,
        token
      }
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

// Login endpoint
router.post('/login', async (req, res, next) => {
  try {
    const validatedData = loginSchema.parse(req.body)
    
    // Find user
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email }
    })
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      })
    }
    
    // Verify password
    const isPasswordValid = await bcrypt.compare(validatedData.password, user.password)
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      })
    }
    
    // Generate JWT token
    const token = generateToken(user)
    
    // Return user data (without password)
    const { password, ...userWithoutPassword } = user
    
    res.json({
      success: true,
      data: {
        user: userWithoutPassword,
        token
      }
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

// Get current user
router.get('/me', authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
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
        },
        createdAt: true,
        updatedAt: true
      }
    })
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }
    
    res.json({
      success: true,
      data: user
    })
  } catch (error) {
    next(error)
  }
})

// Logout endpoint
router.post('/logout', authenticate, (req: AuthenticatedRequest, res) => {
  // In a JWT implementation, logout is handled client-side by removing the token
  // However, we can add token blacklisting here if needed in the future
  res.json({
    success: true,
    message: 'Logged out successfully'
  })
})

export default router