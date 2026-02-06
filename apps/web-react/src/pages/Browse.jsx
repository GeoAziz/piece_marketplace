import React, { useEffect, useMemo, useState } from 'react'
import ListingCard from '../components/ListingCard'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import PageHeader from '../components/PageHeader'
import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'
import { MapPin, Search } from 'lucide-react'

export default function Browse(){
  const [role, setRole] = useState('buyer')
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [query, setQuery] = useState('')

  useEffect(() => {
    const storedRole = localStorage.getItem('userRole') || 'buyer'
    setRole(storedRole)
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

  const filteredListings = useMemo(() => {
    if (!query.trim()) return listings
    const normalizedQuery = query.trim().toLowerCase()
    return listings.filter((listing) => {
      const haystack = `${listing.title} ${listing.location}`.toLowerCase()
      return haystack.includes(normalizedQuery)
    })
  }, [listings, query])

  return (
    <div>
      <PageHeader
        title="Browse Listings"
        subtitle="Find land across counties and filter listings by location or title."
        actions={(
          <Link to="/create">
            <Button variant="primary">Create Listing</Button>
          </Link>
        )}
      />

      <Card className="p-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex-1">
            <Input
              name="search"
              placeholder="Search by title or location"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Search className="w-4 h-4" />
            <span>{filteredListings.length} results</span>
          </div>
        </div>
      </Card>

      {loading && <div className="mt-4 text-gray-600">Loading listings…</div>}
      {error && <div className="mt-4 text-red-600">{error}</div>}

      {!loading && !error && filteredListings.length === 0 ? (
        <Card className="p-10 text-center">
          <MapPin className="w-8 h-8 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-900">No listings match your search</h3>
          <p className="text-sm text-gray-600 mt-2">Try adjusting your keywords or create a new listing.</p>
          <div className="mt-4">
            <Link to="/create">
              <Button variant="outline">Create a listing</Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {filteredListings.map(l => <ListingCard key={l.id} listing={l} />)}
        </div>
      )}
    </div>
  )
}
