import React from 'react'
import Card from '../components/ui/Card'
import { Link } from 'react-router-dom'
import { mockListings } from '../data/mockListings'

export default function Home(){
  return (
    <div>
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Kenya Land Marketplace</h1>
        <p className="text-xl text-gray-600">Find and verify trusted land listings across Kenya with verified seller credentials.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-transparent">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Browse Listings</h2>
          <p className="text-gray-600 mb-4">Discover verified land properties with complete documentation and verification badges.</p>
          <Link to="/browse" className="inline-flex items-center text-blue-600 font-medium hover:text-blue-700">
            Start browsing →
          </Link>
        </Card>
        <Card className="p-6 bg-gradient-to-br from-green-50 to-transparent">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Sell Your Land</h2>
          <p className="text-gray-600 mb-4">Create a listing and upload evidence to get verified by our trusted admins.</p>
          <Link to="/create" className="inline-flex items-center text-green-600 font-medium hover:text-green-700">
            Create a listing →
          </Link>
        </Card>
      </div>
      {mockListings.length > 0 && (
        <div className="mt-12">
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">Featured Listings</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {mockListings.slice(0,3).map(l => (
              <Card key={l.id} className="p-4 hover:shadow-md transition-shadow">
                <Link to={`/listing/${l.id}`} className="text-gray-900 hover:text-blue-600 font-semibold text-sm block mb-1">{l.title}</Link>
                <p className="text-xs text-gray-500">KES {l.price?.toLocaleString()}</p>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
