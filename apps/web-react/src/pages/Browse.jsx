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
  const [county, setCounty] = useState('all')
  const [verification, setVerification] = useState('all')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')

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

  const countyOptions = useMemo(() => {
    const locations = listings
      .map((listing) => listing.location)
      .filter(Boolean)
      .map((location) => location.split(',').pop().trim())
    return Array.from(new Set(locations)).filter(Boolean)
  }, [listings])

  const filteredListings = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    const minValue = minPrice ? Number(minPrice) : null
    const maxValue = maxPrice ? Number(maxPrice) : null

    return listings.filter((listing) => {
      const haystack = `${listing.title} ${listing.location}`.toLowerCase()
      const matchesQuery = !normalizedQuery || haystack.includes(normalizedQuery)
      const listingCounty = listing.location ? listing.location.split(',').pop().trim() : ''
      const matchesCounty = county === 'all' || listingCounty === county
      const isVerified = listing.badges && listing.badges.length > 0
      const matchesVerification = verification === 'all' || (verification === 'verified' && isVerified) || (verification === 'unverified' && !isVerified)
      const priceValue = Number(listing.price)
      const matchesMin = minValue === null || priceValue >= minValue
      const matchesMax = maxValue === null || priceValue <= maxValue

      return matchesQuery && matchesCounty && matchesVerification && matchesMin && matchesMax
    })
  }, [listings, query, county, verification, minPrice, maxPrice])

  return (
    <div>
      <PageHeader
        title="Browse Listings"
        subtitle="Find land across counties and filter listings by location or title."
        actions={(
          role === 'seller' && (
            <Link to="/create">
              <Button variant="primary">Create Listing</Button>
            </Link>
          )
        )}
      />

      <Card className="p-4 mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">
          <div className="lg:col-span-2">
            <Input
              name="search"
              placeholder="Search by title or location"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="lg:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">County</label>
            <select
              className="w-full px-3 py-2 border rounded-lg text-gray-900 border-gray-300"
              value={county}
              onChange={(e) => setCounty(e.target.value)}
            >
              <option value="all">All counties</option>
              {countyOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className="lg:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Verification</label>
            <select
              className="w-full px-3 py-2 border rounded-lg text-gray-900 border-gray-300"
              value={verification}
              onChange={(e) => setVerification(e.target.value)}
            >
              <option value="all">All listings</option>
              <option value="verified">Verified only</option>
              <option value="unverified">Unverified</option>
            </select>
          </div>
          <div className="lg:col-span-1 grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min (KES)</label>
              <Input
                name="minPrice"
                type="number"
                min="0"
                placeholder="0"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max (KES)</label>
              <Input
                name="maxPrice"
                type="number"
                min="0"
                placeholder="Any"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600 mt-3">
          <Search className="w-4 h-4" />
          <span>{filteredListings.length} results</span>
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
