import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import { MapPin, DollarSign, CheckCircle, AlertCircle } from 'lucide-react'

export default function ListingView(){
  const { id } = useParams()
  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) return
    const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:4100'
    setLoading(true)
    fetch(`${apiBase}/api/v1/listings/${id}`)
      .then(r => {
        if (!r.ok) throw new Error('Listing not found')
        return r.json()
      })
      .then(data => {
        setListing(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message || 'Failed to fetch listing')
        setLoading(false)
      })
  }, [id])

  if (loading) return (
    <div className="text-center py-12">
      <p className="text-gray-600">Loading listing...</p>
    </div>
  )
  
  if (error) return (
    <Card className="p-6 bg-red-50 border-red-200">
      <div className="flex items-center gap-3">
        <AlertCircle className="w-6 h-6 text-red-600" />
        <div>
          <h3 className="font-semibold text-red-900">Error</h3>
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      </div>
    </Card>
  )
  
  if (!listing) return (
    <Card className="p-6 text-center">
      <p className="text-gray-600">No listing found</p>
    </Card>
  )

  const verified = listing.badges && listing.badges.length > 0
  const propertyFacts = [
    { label: 'Acreage', value: listing.size || listing.acreage || 'Not specified' },
    { label: 'Title type', value: listing.titleType || 'Not specified' },
    { label: 'Utilities', value: listing.utilities || 'Not specified' },
    { label: 'Road access', value: listing.accessRoad || 'Not specified' }
  ]

  return (
    <div className="max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <Link to="/browse" className="text-sm text-blue-600 hover:text-blue-700">
          ← Back to browse
        </Link>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline">Save Listing</Button>
          <Button variant="secondary">Share</Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="p-6">
            <div className="mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{listing.title}</h1>
                  <div className="flex items-center gap-2 mt-2 text-gray-600">
                    <MapPin className="w-5 h-5" />
                    <span>{listing.location}</span>
                  </div>
                </div>
                <div className="text-right">
                  {verified && <Badge variant="success"><CheckCircle className="w-4 h-4 inline mr-1"/>Verified</Badge>}
                </div>
              </div>

              <div className="text-3xl font-bold text-gray-900 mb-6">
                KES {listing.price?.toLocaleString()}
              </div>

              {listing.description && (
                <div className="prose prose-sm max-w-none mb-6">
                  <p className="text-gray-700 whitespace-pre-wrap">{listing.description}</p>
                </div>
              )}
            </div>

            <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg h-96 flex items-center justify-center">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-gray-600">Property image placeholder</p>
              </div>
            </div>

            {listing.badges && listing.badges.length > 0 && (
              <div className="mt-6 pt-6 border-t">
                <h3 className="font-semibold text-gray-900 mb-3">Verification Badges</h3>
                <div className="flex flex-wrap gap-2">
                  {listing.badges.map(badge => (
                    <Badge key={badge.id} variant="success">{badge.name}</Badge>
                  ))}
                </div>
              </div>
            )}
          </Card>
          <Card className="p-6 mt-6">
            <h3 className="font-semibold text-gray-900 mb-4">Property facts</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {propertyFacts.map((fact) => (
                <div key={fact.label} className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs uppercase tracking-wide text-gray-500">{fact.label}</p>
                  <p className="text-sm font-semibold text-gray-900 mt-1">{fact.value}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="md:col-span-1">
          <Card className="p-6 sticky top-20">
            <h3 className="font-bold text-gray-900 mb-4">Contact Seller</h3>
            <div className="space-y-3">
              <Button className="w-full" variant="primary">Send Message</Button>
              <Button className="w-full" variant="outline">Call Seller</Button>
            </div>
            
            <div className="mt-6 pt-6 border-t space-y-3">
              <div>
                <p className="text-xs text-gray-600 uppercase tracking-wide">Status</p>
                <p className="font-semibold text-gray-900 mt-1">
                  {listing.status === 'published' ? 'Available' : listing.status}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600 uppercase tracking-wide">Verification</p>
                <p className="font-semibold text-gray-900 mt-1">
                  {verified ? '✓ Verified' : 'Pending'}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
