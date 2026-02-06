import React from 'react'
import { Link } from 'react-router-dom'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

export default function NotFound(){
  return (
    <Card className="p-12 max-w-md mx-auto text-center">
      <div className="mb-4 inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-lg">
        <span className="text-3xl">🤔</span>
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mt-4">Page Not Found</h1>
      <p className="text-gray-600 mt-2">The page you're looking for doesn't exist or has been moved.</p>
      <div className="mt-6">
        <Link to="/">
          <Button variant="primary" className="w-full">
            Back to Home
          </Button>
        </Link>
      </div>
    </Card>
  )
}
