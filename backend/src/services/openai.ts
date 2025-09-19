import OpenAI from 'openai'

class OpenAIService {
  private client: OpenAI | null = null
  private isConfigured: boolean = false

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY
    
    if (apiKey && apiKey.trim() !== '') {
      this.client = new OpenAI({
        apiKey: apiKey
      })
      this.isConfigured = true
      console.log('✅ OpenAI service initialized')
    } else {
      console.log('⚠️ OpenAI API key not found. AI features will not be available.')
    }
  }

  isAvailable(): boolean {
    return this.isConfigured && this.client !== null
  }

  async generateFlashcards(content: string, count: number = 10): Promise<any[]> {
    if (!this.isAvailable()) {
      throw new Error('OpenAI API key not configured. Please add your OpenAI API key to enable AI features.')
    }

    try {
      const response = await this.client!.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an expert educator. Create flashcards from the given content. Return a JSON array of flashcard objects with 'front' and 'back' properties. Focus on key concepts, definitions, and important facts."
          },
          {
            role: "user",
            content: `Create ${count} flashcards from this content:\n\n${content}`
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })

      const result = response.choices[0]?.message?.content
      if (!result) {
        throw new Error('No response from OpenAI')
      }

      // Try to parse the JSON response
      try {
        const flashcards = JSON.parse(result)
        return Array.isArray(flashcards) ? flashcards : []
      } catch (parseError) {
        // If JSON parsing fails, create a simple response
        return [{
          front: "Generated Content",
          back: result
        }]
      }
    } catch (error) {
      console.error('OpenAI flashcard generation error:', error)
      throw new Error('Failed to generate flashcards. Please try again.')
    }
  }

  async generateQuiz(content: string, questionCount: number = 5): Promise<any> {
    if (!this.isAvailable()) {
      throw new Error('OpenAI API key not configured. Please add your OpenAI API key to enable AI features.')
    }

    try {
      const response = await this.client!.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an expert quiz creator. Create a quiz from the given content. Return a JSON object with 'title', 'description', and 'questions' array. Each question should have 'question', 'type' ('multiple_choice' or 'true_false'), 'options' (array), 'correct_answer', and 'explanation' properties."
          },
          {
            role: "user",
            content: `Create a ${questionCount}-question quiz from this content:\n\n${content}`
          }
        ],
        temperature: 0.7,
        max_tokens: 3000
      })

      const result = response.choices[0]?.message?.content
      if (!result) {
        throw new Error('No response from OpenAI')
      }

      try {
        return JSON.parse(result)
      } catch (parseError) {
        return {
          title: "Generated Quiz",
          description: "Quiz generated from provided content",
          questions: [{
            question: "What is the main topic of the provided content?",
            type: "multiple_choice",
            options: ["A", "B", "C", "D"],
            correct_answer: "A",
            explanation: result
          }]
        }
      }
    } catch (error) {
      console.error('OpenAI quiz generation error:', error)
      throw new Error('Failed to generate quiz. Please try again.')
    }
  }

  async generateSummary(content: string): Promise<any> {
    if (!this.isAvailable()) {
      throw new Error('OpenAI API key not configured. Please add your OpenAI API key to enable AI features.')
    }

    try {
      const response = await this.client!.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an expert summarizer. Create a comprehensive summary of the given content. Return a JSON object with 'title', 'content' (the summary), and 'keyPoints' (array of key points) properties."
          },
          {
            role: "user",
            content: `Summarize this content:\n\n${content}`
          }
        ],
        temperature: 0.5,
        max_tokens: 1500
      })

      const result = response.choices[0]?.message?.content
      if (!result) {
        throw new Error('No response from OpenAI')
      }

      try {
        return JSON.parse(result)
      } catch (parseError) {
        return {
          title: "Generated Summary",
          content: result,
          keyPoints: [
            "Summary generated from provided content",
            "Content processed using AI analysis"
          ]
        }
      }
    } catch (error) {
      console.error('OpenAI summary generation error:', error)
      throw new Error('Failed to generate summary. Please try again.')
    }
  }

  async generateMindMap(content: string): Promise<any> {
    if (!this.isAvailable()) {
      throw new Error('OpenAI API key not configured. Please add your OpenAI API key to enable AI features.')
    }

    try {
      const response = await this.client!.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an expert at creating mind maps. Create a mind map structure from the given content. Return a JSON object with 'title', 'nodes' array (each with id, label, type, position {x, y}), and 'edges' array (each with id, source, target) properties. Create a hierarchical structure with a central topic and related subtopics."
          },
          {
            role: "user",
            content: `Create a mind map from this content:\n\n${content}`
          }
        ],
        temperature: 0.7,
        max_tokens: 2500
      })

      const result = response.choices[0]?.message?.content
      if (!result) {
        throw new Error('No response from OpenAI')
      }

      try {
        return JSON.parse(result)
      } catch (parseError) {
        // Create a simple mind map structure if JSON parsing fails
        return {
          title: "Generated Mind Map",
          nodes: [
            { id: '1', label: 'Main Topic', type: 'topic', position: { x: 0, y: 0 } },
            { id: '2', label: 'Subtopic 1', type: 'subtopic', position: { x: -200, y: 100 } },
            { id: '3', label: 'Subtopic 2', type: 'subtopic', position: { x: 200, y: 100 } }
          ],
          edges: [
            { id: 'e1', source: '1', target: '2' },
            { id: 'e2', source: '1', target: '3' }
          ]
        }
      }
    } catch (error) {
      console.error('OpenAI mind map generation error:', error)
      throw new Error('Failed to generate mind map. Please try again.')
    }
  }
}

// Export singleton instance
export const openaiService = new OpenAIService()
export default openaiService