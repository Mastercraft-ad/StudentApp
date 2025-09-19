import express from 'express'
import { z } from 'zod'
import { prisma } from '../index'
import { authenticate, AuthenticatedRequest } from '../middleware/auth'
import { openaiService } from '../services/openai'

const router = express.Router()

// Validation schemas
const flashcardsSchema = z.object({
  content_ids: z.array(z.number()).optional(),
  text_content: z.string().optional(),
  count: z.number().min(1).max(20).default(10)
})

const quizSchema = z.object({
  content_ids: z.array(z.number()).optional(),
  youtube_url: z.string().url().optional(),
  text_content: z.string().optional(),
  question_count: z.number().min(1).max(15).default(5)
})

const summarySchema = z.object({
  content_id: z.number().optional(),
  text: z.string().optional()
})

const mindmapSchema = z.object({
  content_ids: z.array(z.number())
})

// Helper function to extract text from content
async function extractContentText(contentIds: number[]): Promise<string> {
  const contents = await prisma.content.findMany({
    where: { id: { in: contentIds } },
    select: { title: true, description: true }
  })
  
  return contents.map(c => `${c.title}\n${c.description || ''}`).join('\n\n')
}

// Generate flashcards from content
router.post('/flashcards', authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    const validatedData = flashcardsSchema.parse(req.body)
    
    let contentText = validatedData.text_content || ''
    
    // If content IDs provided, extract text from database
    if (validatedData.content_ids && validatedData.content_ids.length > 0) {
      const extractedText = await extractContentText(validatedData.content_ids)
      contentText = extractedText || contentText
    }
    
    if (!contentText.trim()) {
      return res.status(400).json({
        success: false,
        message: 'No content provided for flashcard generation'
      })
    }
    
    // Generate flashcards using OpenAI
    const flashcards = await openaiService.generateFlashcards(contentText, validatedData.count)
    
    // Save flashcards to database
    const savedFlashcards = await Promise.all(
      flashcards.map(async (card: any) => {
        return await prisma.flashcard.create({
          data: {
            front: card.front || 'Question',
            back: card.back || 'Answer',
            difficulty: 1,
            contentId: validatedData.content_ids?.[0] || null
          }
        })
      })
    )
    
    res.json({
      success: true,
      data: {
        flashcards: savedFlashcards
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

// Generate quiz from content
router.post('/quiz', authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    const validatedData = quizSchema.parse(req.body)
    
    let contentText = validatedData.text_content || ''
    
    // If content IDs provided, extract text from database
    if (validatedData.content_ids && validatedData.content_ids.length > 0) {
      const extractedText = await extractContentText(validatedData.content_ids)
      contentText = extractedText || contentText
    }
    
    // TODO: Handle YouTube URL content extraction
    if (validatedData.youtube_url) {
      contentText += `\nYouTube Video: ${validatedData.youtube_url}`
    }
    
    if (!contentText.trim()) {
      return res.status(400).json({
        success: false,
        message: 'No content provided for quiz generation'
      })
    }
    
    // Generate quiz using OpenAI
    const quizData = await openaiService.generateQuiz(contentText, validatedData.question_count)
    
    // Save quiz to database
    const savedQuiz = await prisma.quiz.create({
      data: {
        title: quizData.title || 'Generated Quiz',
        description: quizData.description || 'AI-generated quiz',
        questions: quizData.questions || [],
        contentId: validatedData.content_ids?.[0] || null
      }
    })
    
    res.json({
      success: true,
      data: {
        quiz: savedQuiz
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

// Generate summary
router.post('/summarize', authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    const validatedData = summarySchema.parse(req.body)
    
    let contentText = validatedData.text || ''
    
    // If content ID provided, extract from database
    if (validatedData.content_id) {
      const content = await prisma.content.findUnique({
        where: { id: validatedData.content_id },
        select: { title: true, description: true }
      })
      
      if (content) {
        contentText = `${content.title}\n${content.description || ''}`
      }
    }
    
    if (!contentText.trim()) {
      return res.status(400).json({
        success: false,
        message: 'No content provided for summarization'
      })
    }
    
    // Generate summary using OpenAI
    const summaryData = await openaiService.generateSummary(contentText)
    
    // Save summary to database
    const savedSummary = await prisma.summary.create({
      data: {
        title: summaryData.title || 'Generated Summary',
        content: summaryData.content || 'Summary content',
        keyPoints: summaryData.keyPoints || [],
        contentId: validatedData.content_id || null
      }
    })
    
    res.json({
      success: true,
      data: {
        summary: savedSummary
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

// Generate mindmap
router.post('/mindmap', authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    const validatedData = mindmapSchema.parse(req.body)
    
    // Extract content text from database
    const contentText = await extractContentText(validatedData.content_ids)
    
    if (!contentText.trim()) {
      return res.status(400).json({
        success: false,
        message: 'No content found for the provided IDs'
      })
    }
    
    // Generate mindmap using OpenAI
    const mindmapData = await openaiService.generateMindMap(contentText)
    
    // Save mindmap to database
    const savedMindmap = await prisma.mindMap.create({
      data: {
        title: mindmapData.title || 'Generated Mind Map',
        nodes: mindmapData.nodes || [],
        edges: mindmapData.edges || [],
        contentId: validatedData.content_ids[0] || null
      }
    })
    
    res.json({
      success: true,
      data: {
        mindmap: savedMindmap
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

export default router