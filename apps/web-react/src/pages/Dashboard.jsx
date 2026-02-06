import React from 'react'
import { Link } from 'react-router-dom'
import { mockListings } from '../data/mockListings'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import PageHeader from '../components/PageHeader'
import { Edit, MessageSquare, CheckCircle, Clock } from 'lucide-react'

export default function Dashboard(){
  const verifiedCount = mockListings.filter(l => l.badges?.length > 0).length
  const pendingCount = mockListings.filter(l => !l.badges?.length > 0).length

  return (
    <div className="max-w-4xl">
      <PageHeader
        title="Seller Dashboard"
        subtitle="Manage your listings, view messages, and track verification status."
        actions={(
          <>
            <Link to="/dashboard/messages">
              <Button variant="outline">View Messages</Button>
            </Link>
            <Link to="/create">
              <Button variant="primary">Create New</Button>
            </Link>
          </>
        )}
      />

      {pendingCount > 0 && (
        <Card className="p-5 mb-6 border border-yellow-200 bg-yellow-50">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-yellow-900">Verification needed</p>
              <p className="text-sm text-yellow-800 mt-1">
                {pendingCount} listing{pendingCount === 1 ? '' : 's'} still need documentation for approval.
              </p>
            </div>
            <Link to="/create">
              <Button variant="outline">Upload documents</Button>
            </Link>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-transparent">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Listings</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{mockListings.length}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-lg">📋</span>
            </div>
          </div>
        </Card>
        <Card className="p-6 bg-gradient-to-br from-green-50 to-transparent">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Verified</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{verifiedCount}</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>
        <Card className="p-6 bg-gradient-to-br from-yellow-50 to-transparent">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Pending Review</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{pendingCount}</p>
            </div>
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </Card>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Your Listings</h2>
        <Link to="/create">
          <Button variant="secondary">Add Listing</Button>
        </Link>
      </div>

      <div className="space-y-3">
        {mockListings.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-gray-600">No listings yet</p>
            <Link to="/create" className="text-blue-600 font-medium hover:text-blue-700">Create your first listing →</Link>
          </Card>
        ) : (
          mockListings.map(l => (
            <Card key={l.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{l.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{l.location} • KES {l.price?.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {l.badges && l.badges.length > 0 ? (
                    <Badge variant="success"><CheckCircle className="w-4 h-4 inline mr-1"/>Verified</Badge>
                  ) : (
                    <Badge variant="warning">Pending</Badge>
                  )}
                  <div className="flex gap-2">
                    <Link to={`/dashboard/edit/${l.id}`}>
                      <Button size="sm" variant="outline" className="flex items-center gap-2">
                        <Edit className="w-4 h-4" />
                        Edit
                      </Button>
                    </Link>
                    <Link to="/dashboard/messages">
                      <Button size="sm" variant="outline" className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" />
                        Messages
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
