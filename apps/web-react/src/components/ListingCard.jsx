import React from 'react'
import { Link } from 'react-router-dom'
import Card from './ui/Card'
import Badge from './ui/Badge'
import { CheckCircle } from 'lucide-react'

export default function ListingCard({listing}){
  const verified = listing.badges && listing.badges.length > 0
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="h-40 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center"> 
        <span className="text-gray-400">Image</span>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-base flex-1"><Link to={`/listing/${listing.id}`} className="text-gray-900 hover:text-blue-600 transition-colors">{listing.title}</Link></h3>
          {verified ? (<Badge variant="success"><CheckCircle className="w-3.5 h-3.5 inline-block mr-1"/>Verified</Badge>) : (<Badge variant="muted">Unverified</Badge>)}
        </div>
        <div className="text-sm text-gray-600 mt-2">{listing.location} • KES {listing.price?.toLocaleString()}</div>
      </div>
    </Card>
  )
}
