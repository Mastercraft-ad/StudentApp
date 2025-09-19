import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ChevronLeft, ChevronRight, GraduationCap } from 'lucide-react'

const onboardingSchema = z.object({
  program: z.string().min(2, 'Program name is required'),
  institution: z.string().min(2, 'Institution is required'),
  level: z.enum(['undergraduate', 'graduate', 'professional']),
  discoveredVia: z.string().min(1, 'Please tell us how you discovered StudentDrive'),
  goals: z.array(z.string()).min(1, 'Please select at least one goal'),
})

type OnboardingData = z.infer<typeof onboardingSchema>

const steps = [
  { id: 'academic', title: 'Academic Info', description: 'Tell us about your studies' },
  { id: 'goals', title: 'Learning Goals', description: 'What do you want to achieve?' },
  { id: 'discovery', title: 'About You', description: 'Help us understand your needs' },
]

const levelOptions = [
  { value: 'undergraduate', label: 'Undergraduate' },
  { value: 'graduate', label: 'Graduate/Masters' },
  { value: 'professional', label: 'Professional/PhD' },
]

const goalOptions = [
  'Improve exam performance',
  'Better study organization',
  'Create effective flashcards',
  'Generate study summaries',
  'Track learning progress',
  'Collaborate with peers',
  'Time management',
  'Research assistance',
]

const discoveryOptions = [
  'Social media',
  'University website',
  'Friend recommendation',
  'Search engine',
  'Academic advisor',
  'Student forum',
  'Conference/Event',
  'Other',
]

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedGoals, setSelectedGoals] = useState<string[]>([])

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    trigger,
  } = useForm<OnboardingData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      goals: [],
    },
  })

  const handleGoalToggle = (goal: string) => {
    const newGoals = selectedGoals.includes(goal)
      ? selectedGoals.filter(g => g !== goal)
      : [...selectedGoals, goal]
    
    setSelectedGoals(newGoals)
    setValue('goals', newGoals)
  }

  const nextStep = async () => {
    let fieldsToValidate: (keyof OnboardingData)[] = []
    
    if (currentStep === 0) fieldsToValidate = ['program', 'institution', 'level']
    if (currentStep === 1) fieldsToValidate = ['goals']
    if (currentStep === 2) fieldsToValidate = ['discoveredVia']

    const isValid = await trigger(fieldsToValidate)
    if (isValid && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const onSubmit = (data: OnboardingData) => {
    console.log('Onboarding data:', data)
    // TODO: Submit to API and redirect to dashboard
    window.location.href = '/dashboard'
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto h-12 w-12 rounded-lg bg-primary-green flex items-center justify-center">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-dark-navy">Welcome to StudentDrive!</h1>
          <p className="text-muted-foreground">Let's personalize your learning experience</p>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center justify-center space-x-2">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                index <= currentStep 
                  ? 'bg-primary-green text-white' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {index + 1}
              </div>
              {index < steps.length - 1 && (
                <div className={`w-8 h-1 mx-2 ${
                  index < currentStep ? 'bg-primary-green' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>{steps[currentStep].title}</CardTitle>
            <CardDescription>{steps[currentStep].description}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Step 1: Academic Info */}
              {currentStep === 0 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Program/Major</label>
                    <Input
                      placeholder="e.g., Computer Science, Biology, Business"
                      {...register('program')}
                    />
                    {errors.program && (
                      <p className="text-sm text-destructive">{errors.program.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Institution</label>
                    <Input
                      placeholder="Your university or college name"
                      {...register('institution')}
                    />
                    {errors.institution && (
                      <p className="text-sm text-destructive">{errors.institution.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Academic Level</label>
                    <div className="grid grid-cols-1 gap-2">
                      {levelOptions.map((option) => (
                        <label key={option.value} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-accent cursor-pointer">
                          <input
                            type="radio"
                            value={option.value}
                            {...register('level')}
                            className="text-primary-green"
                          />
                          <span>{option.label}</span>
                        </label>
                      ))}
                    </div>
                    {errors.level && (
                      <p className="text-sm text-destructive">{errors.level.message}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Step 2: Goals */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">What are your learning goals?</label>
                    <p className="text-sm text-muted-foreground">Select all that apply</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {goalOptions.map((goal) => (
                        <label
                          key={goal}
                          className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                            selectedGoals.includes(goal)
                              ? 'border-primary-green bg-primary-green/10'
                              : 'hover:bg-accent'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={selectedGoals.includes(goal)}
                            onChange={() => handleGoalToggle(goal)}
                            className="text-primary-green"
                          />
                          <span className="text-sm">{goal}</span>
                        </label>
                      ))}
                    </div>
                    {errors.goals && (
                      <p className="text-sm text-destructive">{errors.goals.message}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Step 3: Discovery */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">How did you discover StudentDrive?</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {discoveryOptions.map((option) => (
                        <label key={option} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-accent cursor-pointer">
                          <input
                            type="radio"
                            value={option}
                            {...register('discoveredVia')}
                            className="text-primary-green"
                          />
                          <span>{option}</span>
                        </label>
                      ))}
                    </div>
                    {errors.discoveredVia && (
                      <p className="text-sm text-destructive">{errors.discoveredVia.message}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 0}
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>

                {currentStep === steps.length - 1 ? (
                  <Button type="submit">
                    Complete Setup
                  </Button>
                ) : (
                  <Button type="button" onClick={nextStep}>
                    Next
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}