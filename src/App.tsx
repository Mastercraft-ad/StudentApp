import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-light-gray">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-dark-navy mb-4">
            StudentDrive MVP
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            AI-Powered Study Platform
          </p>
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
            <button
              className="bg-primary-green hover:bg-primary-green/90 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
              onClick={() => setCount((count) => count + 1)}
            >
              Count is {count}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App