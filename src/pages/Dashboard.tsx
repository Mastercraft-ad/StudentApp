import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  BookOpen, 
  Brain, 
  FileText, 
  TrendingUp, 
  Clock,
  Trophy,
  Target,
  Calendar
} from 'lucide-react'

export default function Dashboard() {
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
            <div className="text-2xl font-bold">7 days</div>
            <p className="text-xs text-muted-foreground">Keep it up!</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Study Time</CardTitle>
            <Clock className="h-4 w-4 text-teal" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42h</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Exam Average</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-muted-foreground">+5% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Goals Completed</CardTitle>
            <Target className="h-4 w-4 text-teal" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12/15</div>
            <p className="text-xs text-muted-foreground">This week</p>
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
            <Button className="h-16 flex flex-col space-y-2" asChild>
              <a href="/content">
                <BookOpen className="h-6 w-6" />
                <span>Browse Content</span>
              </a>
            </Button>
            <Button className="h-16 flex flex-col space-y-2" variant="secondary" asChild>
              <a href="/ai-tools">
                <Brain className="h-6 w-6" />
                <span>AI Study Tools</span>
              </a>
            </Button>
            <Button className="h-16 flex flex-col space-y-2" variant="outline" asChild>
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
            <div className="flex items-center space-x-3">
              <div className="h-2 w-2 rounded-full bg-primary-green"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Completed Biology Quiz</p>
                <p className="text-xs text-muted-foreground">Score: 94% • 2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="h-2 w-2 rounded-full bg-teal"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Generated flashcards for Chemistry</p>
                <p className="text-xs text-muted-foreground">25 cards created • 4 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="h-2 w-2 rounded-full bg-primary-green"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Uploaded study notes</p>
                <p className="text-xs text-muted-foreground">Mathematics Chapter 5 • Yesterday</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Today's Schedule</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <Calendar className="h-4 w-4 text-primary-green" />
              <div className="flex-1">
                <p className="text-sm font-medium">Review Biology Notes</p>
                <p className="text-xs text-muted-foreground">2:00 PM - 3:00 PM</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Calendar className="h-4 w-4 text-teal" />
              <div className="flex-1">
                <p className="text-sm font-medium">Chemistry Practice Quiz</p>
                <p className="text-xs text-muted-foreground">4:00 PM - 4:30 PM</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Calendar className="h-4 w-4 text-primary-green" />
              <div className="flex-1">
                <p className="text-sm font-medium">Math Problem Set</p>
                <p className="text-xs text-muted-foreground">7:00 PM - 8:30 PM</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}