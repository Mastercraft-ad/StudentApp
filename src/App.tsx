import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from '@/components/layout/Layout'
import Dashboard from '@/pages/Dashboard'
import SignIn from '@/pages/auth/SignIn'
import SignUp from '@/pages/auth/SignUp'
import Onboarding from '@/pages/auth/Onboarding'
import ContentLibrary from '@/pages/ContentLibrary'
import AITools from '@/pages/AITools'
import ExamEngine from '@/pages/ExamEngine'
import LearningPaths from '@/pages/LearningPaths'
import Subscription from '@/pages/Subscription'

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/auth/sign-in" element={<SignIn />} />
      <Route path="/auth/sign-up" element={<SignUp />} />
      <Route path="/auth/onboarding" element={<Onboarding />} />
      
      {/* Protected Routes */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/content" element={<ContentLibrary />} />
        <Route path="/ai-tools" element={<AITools />} />
        <Route path="/exams" element={<ExamEngine />} />
        <Route path="/learning-paths" element={<LearningPaths />} />
        <Route path="/subscription" element={<Subscription />} />
      </Route>

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default App