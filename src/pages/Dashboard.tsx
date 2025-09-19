import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useUserStats } from '@/hooks/useUserStats'
import { 
  BookOpen, 
  Brain, 
  FileText, 
  TrendingUp, 
  Clock,
  Trophy,
  Target,
  Calendar,
  Plus,
  BookMarked
} from 'lucide-react'

export default function Dashboard() {
  const { stats, isLoading, addActivity, addScheduleItem } = useUserStats()

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'content':
        addActivity({
          type: 'study',
          title: 'Browsed Content Library',
          description: 'Explored available study materials'
        })
        break
      case 'ai-tools':
        addActivity({
          type: 'study',
          title: 'Used AI Study Tools',
          description: 'Generated study materials with AI'
        })
        break
      case 'exams':
        addActivity({
          type: 'exam',
          title: 'Started Practice Exam',
          description: 'Began working on practice questions'
        })
        break
      default:
        break
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-dark-navy">Loading Dashboard...</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-6 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-dark-navy">Welcome back, Student!</h1>
        <p className="text-muted-foreground">Ready to accelerate your learning journey?</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Study Streak</CardTitle>
            <Trophy className="h-4 w-4 text-primary-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.studyStreak} days</div>
            <p className="text-xs text-muted-foreground">
              {stats.studyStreak > 0 ? 'Keep it up!' : 'Start your streak today!'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Study Time</CardTitle>
            <Clock className="h-4 w-4 text-teal" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudyTime}h</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalStudyTime > 0 ? 'Great progress!' : 'Start studying to track time'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Exam Average</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.examAverage}%</div>
            <p className="text-xs text-muted-foreground">
              {stats.examAverage > 0 ? 'Keep improving!' : 'Take an exam to see your average'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Goals Completed</CardTitle>
            <Target className="h-4 w-4 text-teal" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.goalsCompleted}/{stats.totalGoals}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalGoals > 0 ? `${Math.round((stats.goalsCompleted / stats.totalGoals) * 100)}% complete` : 'Set your first goal!'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Get started with your study session</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              className="h-16 flex flex-col space-y-2" 
              asChild
              onClick={() => handleQuickAction('content')}
            >
              <a href="/content">
                <BookOpen className="h-6 w-6" />
                <span>Browse Content</span>
              </a>
            </Button>
            <Button 
              className="h-16 flex flex-col space-y-2" 
              variant="secondary" 
              asChild
              onClick={() => handleQuickAction('ai-tools')}
            >
              <a href="/ai-tools">
                <Brain className="h-6 w-6" />
                <span>AI Study Tools</span>
              </a>
            </Button>
            <Button 
              className="h-16 flex flex-col space-y-2" 
              variant="outline" 
              asChild
              onClick={() => handleQuickAction('exams')}
            >
              <a href="/exams">
                <FileText className="h-6 w-6" />
                <span>Practice Exams</span>
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity & Upcoming Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats.recentActivity.length === 0 ? (
              <div className="text-center py-6">
                <BookMarked className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">No recent activity</p>
                <p className="text-xs text-muted-foreground">Start studying to see your activity here</p>
              </div>
            ) : (
              stats.recentActivity.slice(0, 5).map((activity) => {
                const getActivityColor = (type: string) => {
                  switch (type) {
                    case 'quiz': return 'bg-green-500'
                    case 'exam': return 'bg-blue-500'
                    case 'flashcards': return 'bg-purple-500'
                    case 'upload': return 'bg-orange-500'
                    default: return 'bg-primary-green'
                  }
                }

                const timeAgo = (date: Date) => {
                  const now = new Date()
                  const diffMs = now.getTime() - date.getTime()
                  const diffMins = Math.floor(diffMs / 60000)
                  
                  if (diffMins < 60) return `${diffMins} min ago`
                  if (diffMins < 1440) return `${Math.floor(diffMins / 60)} hours ago`
                  return `${Math.floor(diffMins / 1440)} days ago`
                }

                return (
                  <div key={activity.id} className="flex items-center space-x-3">
                    <div className={`h-2 w-2 rounded-full ${getActivityColor(activity.type)}`}></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {activity.description} • {timeAgo(activity.timestamp)}
                        {activity.score && ` • Score: ${activity.score}%`}
                      </p>
                    </div>
                  </div>
                )
              })
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Today's Schedule</CardTitle>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => {
                const time = prompt('Enter time (e.g., 2:00 PM - 3:00 PM):')
                const title = prompt('Enter task title:')
                if (time && title) {
                  addScheduleItem({ title, time, type: 'study' })
                }
              }}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats.todaySchedule.length === 0 ? (
              <div className="text-center py-6">
                <Calendar className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">No scheduled tasks</p>
                <p className="text-xs text-muted-foreground">Click the + button to add tasks</p>
              </div>
            ) : (
              stats.todaySchedule.map((task) => {
                const getTaskColor = (type: string) => {
                  switch (type) {
                    case 'practice': return 'text-purple-600'
                    case 'quiz': return 'text-green-600'
                    case 'review': return 'text-orange-600'
                    default: return 'text-primary-green'
                  }
                }

                return (
                  <div key={task.id} className="flex items-center space-x-3">
                    <Calendar className={`h-4 w-4 ${getTaskColor(task.type)}`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{task.title}</p>
                      <p className="text-xs text-muted-foreground">{task.time}</p>
                    </div>
                  </div>
                )
              })
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}