import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import rateLimit from 'express-rate-limit'
import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'

// Import routes
import authRoutes from './routes/auth'
import userRoutes from './routes/users'
import institutionRoutes from './routes/institutions'
import courseRoutes from './routes/courses'
import contentRoutes from './routes/contents'
import aiRoutes from './routes/ai'
import examRoutes from './routes/exams'
import learningPathRoutes from './routes/learningPaths'
import spacedRepetitionRoutes from './routes/spacedRepetition'
import subscriptionRoutes from './routes/subscriptions'
import dashboardRoutes from './routes/dashboard'
import uploadRoutes from './routes/upload'
import searchRoutes from './routes/search'

// Import middleware
import { errorHandler } from './middleware/errorHandler'
import { notFound } from './middleware/notFound'

dotenv.config()

const app = express()
const port = process.env.PORT || 8000

// Initialize Prisma client
export const prisma = new PrismaClient()

// Security middleware
app.use(helmet())
app.use(compression())

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
})
app.use('/api/', limiter)

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}))

// Body parsing middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// API routes
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/institutions', institutionRoutes)
app.use('/api/courses', courseRoutes)
app.use('/api/contents', contentRoutes)
app.use('/api/ai', aiRoutes)
app.use('/api/exams', examRoutes)
app.use('/api/learning-paths', learningPathRoutes)
app.use('/api/spaced-repetition', spacedRepetitionRoutes)
app.use('/api/subscriptions', subscriptionRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/search', searchRoutes)

// Static file serving for uploads
app.use('/uploads', express.static('uploads'))

// Error handling middleware
app.use(notFound)
app.use(errorHandler)

// Database connection and server startup
async function startServer() {
  try {
    // Test database connection
    await prisma.$connect()
    console.log('✅ Database connected successfully')

    app.listen(port, '0.0.0.0', () => {
      console.log(`🚀 Server running on http://localhost:${port}`)
      console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`)
    })
  } catch (error) {
    console.error('❌ Failed to start server:', error)
    process.exit(1)
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('🛑 Shutting down gracefully...')
  await prisma.$disconnect()
  process.exit(0)
})

startServer()