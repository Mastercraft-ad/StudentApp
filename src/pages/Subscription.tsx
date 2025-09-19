import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Check, 
  Crown, 
  Zap, 
  Shield, 
  Users, 
  Infinity,
  CreditCard,
  Star,
  Gift,
  TrendingUp
} from 'lucide-react'

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    interval: 'forever',
    description: 'Get started with basic features',
    features: [
      '5 AI requests per month',
      '10 flashcard sets',
      'Basic content upload (100MB)',
      'Community content access',
      'Basic analytics',
    ],
    limitations: [
      'Limited AI tools usage',
      'No advanced features',
      'Standard support',
    ],
    buttonText: 'Current Plan',
    popular: false,
    color: 'border-gray-200',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 9.99,
    interval: 'month',
    description: 'Perfect for serious students',
    features: [
      'Unlimited AI requests',
      'Unlimited flashcard sets',
      'Premium content upload (5GB)',
      'Advanced analytics & insights',
      'Priority customer support',
      'Exam scheduling & reminders',
      'Learning path optimization',
      'Collaboration tools',
    ],
    limitations: [],
    buttonText: 'Upgrade to Pro',
    popular: true,
    color: 'border-primary-green',
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 19.99,
    interval: 'month',
    description: 'For students who want everything',
    features: [
      'Everything in Pro',
      'AI tutoring sessions',
      'Unlimited storage (50GB)',
      'Advanced mind mapping',
      'Group study rooms',
      'Institution partnerships',
      'Personal study coach',
      'Early access to new features',
    ],
    limitations: [],
    buttonText: 'Upgrade to Premium',
    popular: false,
    color: 'border-purple-500',
  },
]

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Computer Science Student',
    content: 'StudentDrive helped me increase my GPA from 3.2 to 3.8 in just one semester!',
    rating: 5,
  },
  {
    name: 'Michael Rodriguez',
    role: 'Pre-Med Student',
    content: 'The AI flashcards feature is incredible. It saves me hours of study time.',
    rating: 5,
  },
  {
    name: 'Emma Thompson',
    role: 'Business Student',
    content: 'Best investment I made for my education. The learning paths keep me organized.',
    rating: 5,
  },
]

export default function Subscription() {
  const [selectedPlan, setSelectedPlan] = useState('free')
  const [billingInterval, setBillingInterval] = useState<'month' | 'year'>('month')
  const [showPayment, setShowPayment] = useState(false)

  const handleUpgrade = (planId: string) => {
    setSelectedPlan(planId)
    if (planId !== 'free') {
      setShowPayment(true)
    }
  }

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-dark-navy">Choose Your Plan</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Unlock your full potential with premium features designed to accelerate your academic success
        </p>
        
        {/* Billing Toggle */}
        <div className="flex items-center justify-center space-x-4">
          <span className={`text-sm ${billingInterval === 'month' ? 'font-medium' : 'text-muted-foreground'}`}>
            Monthly
          </span>
          <button
            onClick={() => setBillingInterval(billingInterval === 'month' ? 'year' : 'month')}
            className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors hover:bg-gray-300"
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-primary-green transition-transform ${
                billingInterval === 'year' ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
          <span className={`text-sm ${billingInterval === 'year' ? 'font-medium' : 'text-muted-foreground'}`}>
            Yearly
          </span>
          {billingInterval === 'year' && (
            <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
              Save 20%
            </span>
          )}
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {plans.map((plan) => {
          const monthlyPrice = billingInterval === 'year' ? plan.price * 0.8 : plan.price
          const yearlyPrice = monthlyPrice * 12
          
          return (
            <Card
              key={plan.id}
              className={`relative ${plan.color} ${
                plan.popular ? 'border-2 shadow-lg scale-105' : ''
              } transition-all hover:shadow-lg`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary-green text-white px-3 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              
              <CardHeader className="text-center pb-6">
                <div className="mx-auto mb-4">
                  {plan.id === 'free' && <Gift className="h-8 w-8 text-gray-600" />}
                  {plan.id === 'pro' && <Zap className="h-8 w-8 text-primary-green" />}
                  {plan.id === 'premium' && <Crown className="h-8 w-8 text-purple-600" />}
                </div>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription className="text-base">{plan.description}</CardDescription>
                
                <div className="mt-4">
                  {plan.price === 0 ? (
                    <div className="text-3xl font-bold">Free</div>
                  ) : (
                    <div className="text-center">
                      <div className="text-4xl font-bold">
                        ${billingInterval === 'year' ? yearlyPrice.toFixed(0) : monthlyPrice.toFixed(2)}
                      </div>
                      <div className="text-muted-foreground">
                        per {billingInterval === 'year' ? 'year' : 'month'}
                      </div>
                      {billingInterval === 'year' && (
                        <div className="text-sm text-green-600 font-medium">
                          Save ${(plan.price * 12 - yearlyPrice).toFixed(0)} annually
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button
                  className="w-full"
                  variant={plan.id === selectedPlan ? 'secondary' : 'default'}
                  onClick={() => handleUpgrade(plan.id)}
                  disabled={plan.id === selectedPlan}
                >
                  {plan.id === selectedPlan ? 'Current Plan' : plan.buttonText}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Features Comparison */}
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">Feature Comparison</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4 font-medium">Features</th>
                <th className="text-center p-4 font-medium">Free</th>
                <th className="text-center p-4 font-medium">Pro</th>
                <th className="text-center p-4 font-medium">Premium</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {[
                { feature: 'AI Requests', free: '5/month', pro: 'Unlimited', premium: 'Unlimited' },
                { feature: 'Storage', free: '100MB', pro: '5GB', premium: '50GB' },
                { feature: 'Flashcard Sets', free: '10', pro: 'Unlimited', premium: 'Unlimited' },
                { feature: 'Learning Paths', free: '❌', pro: '✅', premium: '✅' },
                { feature: 'AI Tutoring', free: '❌', pro: '❌', premium: '✅' },
                { feature: 'Group Study Rooms', free: '❌', pro: '❌', premium: '✅' },
                { feature: 'Priority Support', free: '❌', pro: '✅', premium: '✅' },
              ].map((row, index) => (
                <tr key={index}>
                  <td className="p-4 font-medium">{row.feature}</td>
                  <td className="p-4 text-center">{row.free}</td>
                  <td className="p-4 text-center">{row.pro}</td>
                  <td className="p-4 text-center">{row.premium}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Testimonials */}
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">What Students Are Saying</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">"{testimonial.content}"</p>
                <div>
                  <p className="font-medium">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Payment Modal */}
      {showPayment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Complete Your Upgrade</CardTitle>
              <CardDescription>
                Upgrade to {plans.find(p => p.id === selectedPlan)?.name} plan
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-accent p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium">
                    {plans.find(p => p.id === selectedPlan)?.name} Plan
                  </span>
                  <span className="font-bold">
                    ${plans.find(p => p.id === selectedPlan)?.price}/{billingInterval === 'year' ? 'year' : 'month'}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Card Number</label>
                  <div className="flex items-center space-x-2 p-3 border rounded-md">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <input 
                      type="text" 
                      placeholder="1234 5678 9012 3456" 
                      className="flex-1 bg-transparent outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Expiry</label>
                    <input 
                      type="text" 
                      placeholder="MM/YY" 
                      className="w-full p-3 border rounded-md"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">CVC</label>
                    <input 
                      type="text" 
                      placeholder="123" 
                      className="w-full p-3 border rounded-md"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Cardholder Name</label>
                  <input 
                    type="text" 
                    placeholder="John Doe" 
                    className="w-full p-3 border rounded-md"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button 
                  onClick={() => setShowPayment(false)} 
                  variant="outline" 
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button className="flex-1">
                  <Shield className="h-4 w-4 mr-2" />
                  Pay Securely
                </Button>
              </div>

              <div className="text-xs text-center text-muted-foreground">
                🔒 Your payment information is secure and encrypted
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}