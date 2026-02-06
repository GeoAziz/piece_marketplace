import React, { useEffect, useState } from 'react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import PageHeader from '../components/PageHeader'
import { Link } from 'react-router-dom'
import { mockListings } from '../data/mockListings'

export default function Home(){
  const [role, setRole] = useState('buyer')

  useEffect(() => {
    const storedRole = localStorage.getItem('userRole') || 'buyer'
    setRole(storedRole)
  }, [])

  const handleRoleChange = (nextRole) => {
    setRole(nextRole)
    localStorage.setItem('userRole', nextRole)
  }

  return (
    <div>
      <PageHeader
        title="Kenya Land Marketplace"
        subtitle="Find and verify trusted land listings across Kenya with verified seller credentials."
        actions={(
          <>
            <Link to="/browse">
              <Button variant="secondary">Browse Listings</Button>
            </Link>
            {role === 'seller' && (
              <Link to="/create">
                <Button variant="primary">Create Listing</Button>
              </Link>
            )}
          </>
        )}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <Card className="p-6 border border-blue-100">
          <h2 className="text-xl font-semibold text-gray-900">Buying land?</h2>
          <p className="text-sm text-gray-600 mt-2">Explore verified listings with documented ownership and transparent pricing.</p>
          <div className="mt-4 flex items-center gap-3">
            <Button variant="primary" onClick={() => handleRoleChange('buyer')}>Set as Buyer</Button>
            <Link to="/browse" className="text-sm text-blue-600 font-medium">View listings →</Link>
          </div>
        </Card>
        <Card className="p-6 border border-green-100">
          <h2 className="text-xl font-semibold text-gray-900">Selling land?</h2>
          <p className="text-sm text-gray-600 mt-2">Upload your documents, get verified, and manage inquiries in one place.</p>
          <div className="mt-4 flex items-center gap-3">
            <Button variant="secondary" onClick={() => handleRoleChange('seller')}>Set as Seller</Button>
            <Link to="/create" className="text-sm text-green-600 font-medium">Create listing →</Link>
          </div>
        </Card>
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
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5">
          <p className="text-sm text-gray-500 uppercase tracking-wide">Step 1</p>
          <h3 className="text-lg font-semibold text-gray-900 mt-2">Upload evidence</h3>
          <p className="text-sm text-gray-600 mt-2">Submit title deeds or ownership documents to begin verification.</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-gray-500 uppercase tracking-wide">Step 2</p>
          <h3 className="text-lg font-semibold text-gray-900 mt-2">Get verified</h3>
          <p className="text-sm text-gray-600 mt-2">Our team reviews listings and marks trusted properties.</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-gray-500 uppercase tracking-wide">Step 3</p>
          <h3 className="text-lg font-semibold text-gray-900 mt-2">Close confidently</h3>
          <p className="text-sm text-gray-600 mt-2">Buyers can contact you knowing the details are vetted.</p>
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
