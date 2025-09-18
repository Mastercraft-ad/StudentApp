import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

function App() {
  const [count, setCount] = useState(0)
  const [inputValue, setInputValue] = useState('')

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-dark-navy mb-4">
            StudentDrive MVP
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            AI-Powered Study Platform
          </p>
        </div>

        <div className="grid gap-6 max-w-4xl mx-auto">
          {/* Component Testing Cards */}
          <Card>
            <CardHeader>
              <CardTitle className="text-primary">shadcn/ui Components Test</CardTitle>
              <CardDescription>
                Testing shadcn/ui components with StudentDrive brand colors
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4 items-center">
                <Button onClick={() => setCount(count + 1)}>
                  Primary Button (Count: {count})
                </Button>
                <Button variant="secondary">
                  Secondary Button
                </Button>
                <Button variant="outline" className="border-teal text-teal">
                  Teal Outline
                </Button>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Test Input</label>
                <Input
                  placeholder="Type something..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
                {inputValue && (
                  <p className="text-sm text-muted-foreground">
                    You typed: {inputValue}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Brand Colors Preview */}
          <Card>
            <CardHeader>
              <CardTitle>StudentDrive Brand Colors</CardTitle>
              <CardDescription>
                Preview of the brand color palette
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div className="w-full h-12 bg-primary-green rounded-md"></div>
                  <p className="text-sm font-medium">Primary Green</p>
                  <p className="text-xs text-muted-foreground">#1DB954</p>
                </div>
                <div className="space-y-2">
                  <div className="w-full h-12 bg-dark-navy rounded-md"></div>
                  <p className="text-sm font-medium text-white">Dark Navy</p>
                  <p className="text-xs text-muted-foreground">#0B1B3C</p>
                </div>
                <div className="space-y-2">
                  <div className="w-full h-12 bg-teal rounded-md"></div>
                  <p className="text-sm font-medium">Teal</p>
                  <p className="text-xs text-muted-foreground">#A6D5D5</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default App