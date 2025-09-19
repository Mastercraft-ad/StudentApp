import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Brain, 
  FileText, 
  HelpCircle, 
  Zap, 
  GitBranch,
  Upload,
  Loader2,
  Sparkles,
  BookOpen,
  PenTool,
  Target
} from 'lucide-react'

const aiTools = [
  {
    id: 'flashcards',
    title: 'AI Flashcards',
    description: 'Generate interactive flashcards from your study materials',
    icon: Zap,
    color: 'bg-blue-500',
    features: ['Auto-generate from PDFs', 'Difficulty levels', 'Spaced repetition'],
  },
  {
    id: 'quiz',
    title: 'Smart Quiz Generator',
    description: 'Create practice quizzes from your content or YouTube videos',
    icon: HelpCircle,
    color: 'bg-green-500',
    features: ['Multiple choice', 'True/False', 'Short answer'],
  },
  {
    id: 'summary',
    title: 'Study Summarizer',
    description: 'Get concise summaries of long documents and lectures',
    icon: FileText,
    color: 'bg-purple-500',
    features: ['Key points extraction', 'Custom length', 'Bullet points'],
  },
  {
    id: 'mindmap',
    title: 'Mind Map Creator',
    description: 'Visualize concepts and relationships in your study materials',
    icon: GitBranch,
    color: 'bg-orange-500',
    features: ['Interactive diagrams', 'Concept linking', 'Export options'],
  },
]

export default function AITools() {
  const [selectedTool, setSelectedTool] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [input, setInput] = useState('')

  const handleToolSelect = (toolId: string) => {
    setSelectedTool(toolId)
    setInput('')
  }

  const handleGenerate = async () => {
    setIsProcessing(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsProcessing(false)
    // TODO: Process with actual AI service
  }

  const renderToolInterface = () => {
    const tool = aiTools.find(t => t.id === selectedTool)
    if (!tool) return null

    return (
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${tool.color}`}>
              <tool.icon className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle>{tool.title}</CardTitle>
              <CardDescription>{tool.description}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Input Options */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border-dashed">
                <CardContent className="p-6 text-center">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <h3 className="font-medium mb-1">Upload Document</h3>
                  <p className="text-sm text-muted-foreground">
                    PDF, DOCX, or TXT files
                  </p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Choose File
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-dashed">
                <CardContent className="p-6 text-center">
                  <BookOpen className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <h3 className="font-medium mb-1">From Library</h3>
                  <p className="text-sm text-muted-foreground">
                    Use existing content
                  </p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Browse Library
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Text Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Or enter text directly:</label>
              <textarea
                placeholder={`Paste your content here to generate ${tool.title.toLowerCase()}...`}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full min-h-32 p-3 border rounded-md resize-none"
              />
            </div>

            {/* Tool-specific options */}
            {selectedTool === 'flashcards' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Number of Cards</label>
                  <Input type="number" placeholder="20" min="5" max="100" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Difficulty Level</label>
                  <select className="w-full p-2 border rounded-md">
                    <option value="mixed">Mixed</option>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>
            )}

            {selectedTool === 'quiz' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Question Count</label>
                  <Input type="number" placeholder="10" min="5" max="50" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Question Type</label>
                  <select className="w-full p-2 border rounded-md">
                    <option value="mixed">Mixed</option>
                    <option value="multiple-choice">Multiple Choice</option>
                    <option value="true-false">True/False</option>
                    <option value="short-answer">Short Answer</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Difficulty</label>
                  <select className="w-full p-2 border rounded-md">
                    <option value="medium">Medium</option>
                    <option value="easy">Easy</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>
            )}

            {selectedTool === 'summary' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Summary Length</label>
                  <select className="w-full p-2 border rounded-md">
                    <option value="medium">Medium (200-300 words)</option>
                    <option value="short">Short (100-200 words)</option>
                    <option value="long">Long (400-500 words)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Format</label>
                  <select className="w-full p-2 border rounded-md">
                    <option value="paragraph">Paragraph</option>
                    <option value="bullets">Bullet Points</option>
                    <option value="outline">Outline</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Generate Button */}
          <div className="flex justify-center">
            <Button 
              onClick={handleGenerate}
              disabled={isProcessing || !input.trim()}
              className="px-8"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate {tool.title}
                </>
              )}
            </Button>
          </div>

          {/* Results placeholder */}
          {isProcessing && (
            <Card className="border-dashed">
              <CardContent className="p-8 text-center">
                <Brain className="h-12 w-12 mx-auto mb-4 text-primary-green animate-pulse" />
                <h3 className="font-medium mb-2">AI is working on your content...</h3>
                <p className="text-sm text-muted-foreground">
                  This usually takes 30-60 seconds depending on content length
                </p>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-dark-navy">AI Study Tools</h1>
        <p className="text-muted-foreground">
          Transform your study materials with AI-powered tools
        </p>
      </div>

      {!selectedTool ? (
        /* Tool Selection Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {aiTools.map((tool) => {
            const Icon = tool.icon
            return (
              <Card 
                key={tool.id} 
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleToolSelect(tool.id)}
              >
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className={`p-3 rounded-lg ${tool.color}`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle>{tool.title}</CardTitle>
                      <CardDescription>{tool.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm">Key Features:</h4>
                    <ul className="space-y-1">
                      {tool.features.map((feature, index) => (
                        <li key={index} className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Target className="h-3 w-3 text-primary-green" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full mt-4">
                      Try {tool.title}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        /* Selected Tool Interface */
        <div className="space-y-4">
          <Button 
            variant="outline" 
            onClick={() => setSelectedTool(null)}
            className="mb-4"
          >
            ← Back to Tools
          </Button>
          {renderToolInterface()}
        </div>
      )}
    </div>
  )
}