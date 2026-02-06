import React from 'react'
import Card from '../components/ui/Card'
import PageHeader from '../components/PageHeader'
import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'

export default function Messages(){
  const messages = []
  
  return (
    <div className="max-w-4xl">
      <PageHeader
        title="Messages"
        subtitle="Communication from buyers interested in your listings."
        actions={(
          <Link to="/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        )}
      />
      
      {messages.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-lg mb-4">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-gray-600 text-lg">No messages yet</p>
          <p className="text-gray-500 text-sm mt-1">When buyers inquire about your listings, messages will appear here</p>
          <div className="mt-4">
            <Link to="/browse">
              <Button variant="secondary">Browse Listings</Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {messages.map(msg => (
            <Card key={msg.id} className="p-4 hover:shadow-md transition-shadow">
              <div>
                <h3 className="font-semibold text-gray-900">{msg.from}</h3>
                <p className="text-sm text-gray-600 mt-1">{msg.message}</p>
                <p className="text-xs text-gray-500 mt-2">{msg.date}</p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
