import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from '@/components/layout/Layout'
import Dashboard from '@/pages/Dashboard'
import SignIn from '@/pages/auth/SignIn'
import SignUp from '@/pages/auth/SignUp'

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/auth/sign-in" element={<SignIn />} />
      <Route path="/auth/sign-up" element={<SignUp />} />
      
      {/* Protected Routes */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/content" element={<div className="p-8 text-center">Content Library - Coming Soon</div>} />
        <Route path="/ai-tools" element={<div className="p-8 text-center">AI Tools - Coming Soon</div>} />
        <Route path="/exams" element={<div className="p-8 text-center">Exams - Coming Soon</div>} />
        <Route path="/learning-paths" element={<div className="p-8 text-center">Learning Paths - Coming Soon</div>} />
        <Route path="/subscription" element={<div className="p-8 text-center">Subscription - Coming Soon</div>} />
      </Route>

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default App