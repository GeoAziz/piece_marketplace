import React, { useEffect, useState } from 'react'
import ListingCard from '../components/ListingCard'
import { MapPin } from 'lucide-react'

export default function Browse(){
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:4100'
    setLoading(true)
    fetch(`${apiBase}/api/v1/listings`)
      .then(r => r.json())
      .then(data => {
        setListings(data.items || [])
        setLoading(false)
      })
      .catch(err => {
        setError(err.message || 'Failed to fetch listings')
        setLoading(false)
      })
  }, [])

  return (
    <div>
      <div className="flex items-center gap-3">
        <MapPin className="w-5 h-5 text-gray-500" />
        <h2 className="text-xl font-semibold">Browse Listings</h2>
      </div>
      <p className="text-gray-600 mt-2">Find land across counties.</p>

      {loading && <div className="mt-4 text-gray-600">Loading listings…</div>}
      {error && <div className="mt-4 text-red-600">{error}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {listings.map(l => <ListingCard key={l.id} listing={l} />)}
      </div>
    </div>
  )
}
