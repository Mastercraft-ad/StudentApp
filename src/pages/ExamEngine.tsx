import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Play, 
  Pause, 
  SkipForward,
  Flag,
  FileText,
  Trophy,
  Target,
  BookOpen
} from 'lucide-react'

const sampleExam = {
  id: 1,
  title: 'Biology Midterm Practice',
  description: 'Comprehensive test covering chapters 1-8',
  duration: 60, // minutes
  totalQuestions: 25,
  questions: [
    {
      id: 1,
      question: 'What is the primary function of mitochondria in a cell?',
      type: 'multiple-choice',
      options: [
        'Protein synthesis',
        'Energy production (ATP synthesis)',
        'DNA replication',
        'Waste removal'
      ],
      correctAnswer: 1,
      explanation: 'Mitochondria are known as the powerhouse of the cell because they produce ATP through cellular respiration.'
    },
    {
      id: 2,
      question: 'The process of photosynthesis occurs in which part of the plant cell?',
      type: 'multiple-choice',
      options: [
        'Nucleus',
        'Mitochondria',
        'Chloroplasts',
        'Ribosomes'
      ],
      correctAnswer: 2,
      explanation: 'Chloroplasts contain chlorophyll and are the sites where photosynthesis takes place.'
    },
    {
      id: 3,
      question: 'DNA replication is semi-conservative.',
      type: 'true-false',
      options: ['True', 'False'],
      correctAnswer: 0,
      explanation: 'DNA replication is semi-conservative, meaning each new strand contains one original and one newly synthesized strand.'
    }
  ]
}

export default function ExamEngine() {
  const [examState, setExamState] = useState<'setup' | 'active' | 'completed'>('setup')
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [timeRemaining, setTimeRemaining] = useState(sampleExam.duration * 60) // in seconds
  const [isPaused, setIsPaused] = useState(false)
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set())
  const [showResults, setShowResults] = useState(false)

  // Timer effect
  useEffect(() => {
    if (examState === 'active' && !isPaused && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setExamState('completed')
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [examState, isPaused, timeRemaining])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const startExam = () => {
    setExamState('active')
  }

  const submitExam = () => {
    setExamState('completed')
    setShowResults(true)
  }

  const handleAnswerSelect = (questionId: number, answerIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }))
  }

  const toggleFlag = (questionId: number) => {
    setFlaggedQuestions(prev => {
      const newSet = new Set(prev)
      if (newSet.has(questionId)) {
        newSet.delete(questionId)
      } else {
        newSet.add(questionId)
      }
      return newSet
    })
  }

  const calculateScore = () => {
    let correct = 0
    sampleExam.questions.forEach(q => {
      if (answers[q.id] === q.correctAnswer) {
        correct++
      }
    })
    return {
      correct,
      total: sampleExam.questions.length,
      percentage: Math.round((correct / sampleExam.questions.length) * 100)
    }
  }

  if (examState === 'setup') {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">{sampleExam.title}</CardTitle>
            <CardDescription>{sampleExam.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="space-y-2">
                <Clock className="h-8 w-8 mx-auto text-primary-green" />
                <div>
                  <p className="font-medium">Duration</p>
                  <p className="text-muted-foreground">{sampleExam.duration} minutes</p>
                </div>
              </div>
              <div className="space-y-2">
                <FileText className="h-8 w-8 mx-auto text-primary-green" />
                <div>
                  <p className="font-medium">Questions</p>
                  <p className="text-muted-foreground">{sampleExam.totalQuestions} questions</p>
                </div>
              </div>
              <div className="space-y-2">
                <Target className="h-8 w-8 mx-auto text-primary-green" />
                <div>
                  <p className="font-medium">Passing Score</p>
                  <p className="text-muted-foreground">70%</p>
                </div>
              </div>
            </div>

            <div className="bg-accent/50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Instructions:</h3>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• You have {sampleExam.duration} minutes to complete this exam</li>
                <li>• You can navigate between questions using the next/previous buttons</li>
                <li>• Flag questions to review them later</li>
                <li>• Make sure to submit your exam before time runs out</li>
                <li>• Once submitted, you cannot change your answers</li>
              </ul>
            </div>

            <div className="text-center">
              <Button onClick={startExam} size="lg">
                <Play className="h-5 w-5 mr-2" />
                Start Exam
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (examState === 'completed' && showResults) {
    const score = calculateScore()
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader className="text-center">
            <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${
              score.percentage >= 70 ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {score.percentage >= 70 ? (
                <Trophy className="h-8 w-8 text-green-600" />
              ) : (
                <AlertCircle className="h-8 w-8 text-red-600" />
              )}
            </div>
            <CardTitle className="text-2xl">Exam Complete!</CardTitle>
            <CardDescription>
              {score.percentage >= 70 ? 'Congratulations! You passed!' : 'Keep studying and try again!'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-green mb-2">
                {score.percentage}%
              </div>
              <p className="text-muted-foreground">
                {score.correct} out of {score.total} questions correct
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <CheckCircle className="h-6 w-6 mx-auto text-green-600 mb-2" />
                <p className="font-medium">Correct</p>
                <p className="text-2xl font-bold text-green-600">{score.correct}</p>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <AlertCircle className="h-6 w-6 mx-auto text-red-600 mb-2" />
                <p className="font-medium">Incorrect</p>
                <p className="text-2xl font-bold text-red-600">{score.total - score.correct}</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Clock className="h-6 w-6 mx-auto text-blue-600 mb-2" />
                <p className="font-medium">Time Used</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatTime((sampleExam.duration * 60) - timeRemaining)}
                </p>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <Button variant="outline">
                <BookOpen className="h-4 w-4 mr-2" />
                Review Answers
              </Button>
              <Button>
                <Play className="h-4 w-4 mr-2" />
                Retake Exam
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const currentQ = sampleExam.questions[currentQuestion]
  const progress = ((currentQuestion + 1) / sampleExam.questions.length) * 100

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header with timer and progress */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-2xl font-bold text-primary-green">
                {formatTime(timeRemaining)}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPaused(!isPaused)}
              >
                {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
              </Button>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Question</p>
              <p className="font-medium">{currentQuestion + 1} of {sampleExam.questions.length}</p>
            </div>

            <Button onClick={submitExam} variant="outline">
              Submit Exam
            </Button>
          </div>
          
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary-green h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Question */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <CardTitle className="text-lg">
              Question {currentQuestion + 1}
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleFlag(currentQ.id)}
              className={flaggedQuestions.has(currentQ.id) ? 'text-yellow-600' : ''}
            >
              <Flag className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription className="text-base">
            {currentQ.question}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentQ.options.map((option, index) => (
            <label
              key={index}
              className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                answers[currentQ.id] === index
                  ? 'border-primary-green bg-primary-green/10'
                  : 'hover:bg-accent'
              }`}
            >
              <input
                type="radio"
                name={`question-${currentQ.id}`}
                checked={answers[currentQ.id] === index}
                onChange={() => handleAnswerSelect(currentQ.id, index)}
                className="text-primary-green"
              />
              <span>{option}</span>
            </label>
          ))}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
          disabled={currentQuestion === 0}
        >
          Previous
        </Button>

        <Button
          onClick={() => setCurrentQuestion(Math.min(sampleExam.questions.length - 1, currentQuestion + 1))}
          disabled={currentQuestion === sampleExam.questions.length - 1}
        >
          Next
          <SkipForward className="h-4 w-4 ml-2" />
        </Button>
      </div>

      {/* Question Navigator */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Question Navigator</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-10 gap-2">
            {sampleExam.questions.map((_, index) => (
              <Button
                key={index}
                variant={currentQuestion === index ? "default" : "outline"}
                size="sm"
                className={`relative ${
                  answers[sampleExam.questions[index].id] !== undefined
                    ? 'bg-green-100 border-green-300'
                    : ''
                } ${
                  flaggedQuestions.has(sampleExam.questions[index].id)
                    ? 'after:content-["🚩"] after:absolute after:-top-1 after:-right-1 after:text-xs'
                    : ''
                }`}
                onClick={() => setCurrentQuestion(index)}
              >
                {index + 1}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}