import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { 
  Menu, 
  X, 
  Home, 
  BookOpen, 
  Brain, 
  FileText, 
  Clock, 
  CreditCard, 
  User,
  LogOut
} from 'lucide-react'

export default function Layout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Content Library', href: '/content', icon: BookOpen },
    { name: 'AI Tools', href: '/ai-tools', icon: Brain },
    { name: 'Exams', href: '/exams', icon: FileText },
    { name: 'Learning Paths', href: '/learning-paths', icon: Clock },
    { name: 'Subscription', href: '/subscription', icon: CreditCard },
  ]

  const isCurrentPath = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-primary-green flex items-center justify-center">
                <span className="text-white font-bold text-sm">SD</span>
              </div>
              <span className="text-xl font-bold text-dark-navy">StudentDrive</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <Button
                    key={item.name}
                    variant={isCurrentPath(item.href) ? "default" : "ghost"}
                    className="flex items-center space-x-2"
                    asChild
                  >
                    <a href={item.href}>
                      <Icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </a>
                  </Button>
                )
              })}
            </nav>

            {/* User Menu & Mobile Toggle */}
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" className="hidden md:flex">
                <User className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="hidden md:flex">
                <LogOut className="h-4 w-4" />
              </Button>
              
              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t">
            <div className="container mx-auto px-4 py-4">
              <nav className="space-y-2">
                {navigation.map((item) => {
                  const Icon = item.icon
                  return (
                    <Button
                      key={item.name}
                      variant={isCurrentPath(item.href) ? "default" : "ghost"}
                      className="w-full justify-start space-x-2"
                      asChild
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <a href={item.href}>
                        <Icon className="h-4 w-4" />
                        <span>{item.name}</span>
                      </a>
                    </Button>
                  )
                })}
                <div className="border-t pt-2 mt-2">
                  <Button variant="ghost" className="w-full justify-start space-x-2">
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start space-x-2">
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </Button>
                </div>
              </nav>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}