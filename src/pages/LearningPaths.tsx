import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Plus, 
  Calendar, 
  Clock, 
  Target, 
  CheckCircle, 
  Circle, 
  TrendingUp,
  Book,
  Brain,
  FileText,
  Award,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react'

const samplePaths = [
  {
    id: 1,
    title: 'Biology Midterm Preparation',
    description: 'Complete study plan for Biology midterm covering chapters 1-8',
    targetDate: '2024-11-15',
    dailyHours: 2,
    progress: 68,
    totalTasks: 12,
    completedTasks: 8,
    topics: ['Cell Biology', 'Genetics', 'Evolution', 'Ecology'],
    status: 'active',
    tasks: [
      { id: 1, title: 'Review Cell Structure', type: 'study', duration: 60, completed: true, dueDate: '2024-10-20' },
      { id: 2, title: 'Practice Genetics Problems', type: 'practice', duration: 90, completed: true, dueDate: '2024-10-21' },
      { id: 3, title: 'Take Evolution Quiz', type: 'quiz', duration: 30, completed: false, dueDate: '2024-10-22' },
      { id: 4, title: 'Study Ecology Notes', type: 'study', duration: 75, completed: false, dueDate: '2024-10-23' },
    ]
  },
  {
    id: 2,
    title: 'Calculus Final Exam Prep',
    description: 'Comprehensive review for Calculus II final examination',
    targetDate: '2024-12-10',
    dailyHours: 3,
    progress: 25,
    totalTasks: 20,
    completedTasks: 5,
    topics: ['Integration', 'Series', 'Differential Equations'],
    status: 'active',
    tasks: []
  },
  {
    id: 3,
    title: 'Chemistry Chapter Review',
    description: 'Review completed - Organic Chemistry fundamentals',
    targetDate: '2024-10-15',
    dailyHours: 1.5,
    progress: 100,
    totalTasks: 8,
    completedTasks: 8,
    topics: ['Organic Reactions', 'Mechanisms', 'Stereochemistry'],
    status: 'completed',
    tasks: []
  }
]

const taskTypes = {
  study: { icon: Book, color: 'bg-blue-500', label: 'Study' },
  practice: { icon: Brain, color: 'bg-purple-500', label: 'Practice' },
  quiz: { icon: FileText, color: 'bg-green-500', label: 'Quiz' },
  review: { icon: RotateCcw, color: 'bg-orange-500', label: 'Review' },
}

export default function LearningPaths() {
  const [selectedPath, setSelectedPath] = useState<number | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)

  const selectedPathData = selectedPath ? samplePaths.find(p => p.id === selectedPath) : null

  const getDaysUntilTarget = (targetDate: string) => {
    const today = new Date()
    const target = new Date(targetDate)
    const diffTime = target.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  if (showCreateForm) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-dark-navy">Create Learning Path</h1>
          <Button variant="outline" onClick={() => setShowCreateForm(false)}>
            Cancel
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>New Learning Path</CardTitle>
            <CardDescription>Create a personalized study schedule to reach your goals</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Path Title</label>
                <Input placeholder="e.g., Biology Midterm Prep" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Target Date</label>
                <Input type="date" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <textarea 
                className="w-full p-3 border rounded-md"
                placeholder="Describe your learning goals..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Daily Study Hours</label>
                <Input type="number" placeholder="2" min="0.5" max="12" step="0.5" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Difficulty Level</label>
                <select className="w-full p-2 border rounded-md">
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Topics to Cover</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {['Cell Biology', 'Genetics', 'Evolution', 'Ecology', 'Biochemistry', 'Physiology'].map(topic => (
                  <label key={topic} className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">{topic}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <Button className="flex-1">
                <Target className="h-4 w-4 mr-2" />
                Create Learning Path
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (selectedPath) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => setSelectedPath(null)}>
            ← Back to Learning Paths
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Pause className="h-4 w-4 mr-2" />
              Pause
            </Button>
            <Button size="sm">
              <Play className="h-4 w-4 mr-2" />
              Continue
            </Button>
          </div>
        </div>

        {selectedPathData && (
          <>
            {/* Path Overview */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl">{selectedPathData.title}</CardTitle>
                    <CardDescription className="mt-2">{selectedPathData.description}</CardDescription>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    selectedPathData.status === 'completed' ? 'bg-green-100 text-green-800' :
                    selectedPathData.status === 'active' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {selectedPathData.status}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <Target className="h-6 w-6 mx-auto mb-2 text-primary-green" />
                    <p className="text-sm text-muted-foreground">Progress</p>
                    <p className="text-xl font-bold">{selectedPathData.progress}%</p>
                  </div>
                  <div className="text-center">
                    <Calendar className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                    <p className="text-sm text-muted-foreground">Days Left</p>
                    <p className="text-xl font-bold">{getDaysUntilTarget(selectedPathData.targetDate)}</p>
                  </div>
                  <div className="text-center">
                    <Clock className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                    <p className="text-sm text-muted-foreground">Daily Hours</p>
                    <p className="text-xl font-bold">{selectedPathData.dailyHours}h</p>
                  </div>
                  <div className="text-center">
                    <CheckCircle className="h-6 w-6 mx-auto mb-2 text-green-600" />
                    <p className="text-sm text-muted-foreground">Tasks Done</p>
                    <p className="text-xl font-bold">{selectedPathData.completedTasks}/{selectedPathData.totalTasks}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Overall Progress</span>
                    <span>{selectedPathData.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-primary-green h-3 rounded-full transition-all duration-300"
                      style={{ width: `${selectedPathData.progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {selectedPathData.topics.map(topic => (
                    <span key={topic} className="px-3 py-1 bg-accent rounded-full text-sm">
                      {topic}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Today's Tasks */}
            <Card>
              <CardHeader>
                <CardTitle>Today's Tasks</CardTitle>
                <CardDescription>Focus on these tasks to stay on track</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedPathData.tasks.map((task) => {
                    const TaskIcon = taskTypes[task.type as keyof typeof taskTypes]?.icon || Book
                    const taskColor = taskTypes[task.type as keyof typeof taskTypes]?.color || 'bg-gray-500'
                    
                    return (
                      <div key={task.id} className={`flex items-center space-x-4 p-4 border rounded-lg ${
                        task.completed ? 'bg-green-50 border-green-200' : 'hover:bg-accent'
                      }`}>
                        <div className={`p-2 rounded-lg ${taskColor}`}>
                          <TaskIcon className="h-4 w-4 text-white" />
                        </div>
                        
                        <div className="flex-1">
                          <h4 className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                            {task.title}
                          </h4>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {task.duration} min
                            </span>
                            <span className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              Due {task.dueDate}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          {task.completed ? (
                            <CheckCircle className="h-6 w-6 text-green-600" />
                          ) : (
                            <Button size="sm">
                              Start Task
                            </Button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-dark-navy">Learning Paths</h1>
          <p className="text-muted-foreground">Structured study plans to achieve your academic goals</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Path
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <TrendingUp className="h-8 w-8 mx-auto mb-2 text-primary-green" />
            <p className="text-sm text-muted-foreground">Active Paths</p>
            <p className="text-2xl font-bold">2</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Award className="h-8 w-8 mx-auto mb-2 text-yellow-600" />
            <p className="text-sm text-muted-foreground">Completed</p>
            <p className="text-2xl font-bold">1</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Target className="h-8 w-8 mx-auto mb-2 text-blue-600" />
            <p className="text-sm text-muted-foreground">Avg. Progress</p>
            <p className="text-2xl font-bold">64%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Clock className="h-8 w-8 mx-auto mb-2 text-purple-600" />
            <p className="text-sm text-muted-foreground">Study Hours</p>
            <p className="text-2xl font-bold">45h</p>
          </CardContent>
        </Card>
      </div>

      {/* Learning Paths Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {samplePaths.map((path) => (
          <Card 
            key={path.id} 
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => setSelectedPath(path.id)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">{path.title}</CardTitle>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  path.status === 'completed' ? 'bg-green-100 text-green-800' :
                  path.status === 'active' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {path.status}
                </div>
              </div>
              <CardDescription>{path.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progress</span>
                    <span>{path.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        path.status === 'completed' ? 'bg-green-500' : 'bg-primary-green'
                      }`}
                      style={{ width: `${path.progress}%` }}
                    />
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Tasks</p>
                    <p className="font-medium">{path.completedTasks}/{path.totalTasks}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Daily Hours</p>
                    <p className="font-medium">{path.dailyHours}h</p>
                  </div>
                </div>

                {/* Topics */}
                <div className="flex flex-wrap gap-1">
                  {path.topics.slice(0, 3).map(topic => (
                    <span key={topic} className="px-2 py-1 bg-accent rounded text-xs">
                      {topic}
                    </span>
                  ))}
                  {path.topics.length > 3 && (
                    <span className="px-2 py-1 bg-accent rounded text-xs">
                      +{path.topics.length - 3} more
                    </span>
                  )}
                </div>

                {/* Target Date */}
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Target: {new Date(path.targetDate).toLocaleDateString()}</span>
                  <span>{getDaysUntilTarget(path.targetDate)} days left</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}