import React, {useState} from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { mockListings } from '../data/mockListings'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import Textarea from '../components/ui/Textarea'
import Button from '../components/ui/Button'
import PageHeader from '../components/PageHeader'

export default function DashboardListingEdit(){
  const { id } = useParams()
  const navigate = useNavigate()
  const listing = mockListings.find(l => l.id === id) || { id }
  const [formData, setFormData] = useState({
    title: listing.title || '',
    location: listing.location || '',
    price: listing.price || '',
    description: listing.description || ''
  })
  const [saving, setSaving] = useState(false)

  const handleChange = (e) => {
    const {name, value} = e.target
    setFormData(prev => ({...prev, [name]: value}))
  }

  const handleSave = () => {
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      navigate('/dashboard')
    }, 500)
  }

  return (
    <div className="max-w-2xl">
      <PageHeader
        title="Edit Listing"
        subtitle="Update your listing details and keep buyers informed."
        actions={(
          <Button variant="outline" onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        )}
      />
      
      <Card className="p-6">
        <div className="space-y-4">
          <Input
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., 2 acres in Nairobi"
          />
          <Input
            label="Location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g., Karen, Nairobi"
          />
          <Input
            label="Price (KES)"
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="500000"
          />
          <Textarea
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your land property..."
            rows="5"
          />
          <div className="flex gap-2 pt-4">
            <Button variant="primary" disabled={saving} onClick={handleSave}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              Cancel
            </Button>
          </div>
        </div>
      </Card>
      <Card className="p-5 mt-6 bg-gray-50">
        <h3 className="font-semibold text-gray-900">Listing tips</h3>
        <ul className="mt-3 text-sm text-gray-600 space-y-2">
          <li>• Keep your title descriptive so buyers can find it faster.</li>
          <li>• Add nearby landmarks, roads, or utilities in the description.</li>
          <li>• Update the price if the market shifts.</li>
        </ul>
      </Card>
    </div>
  )
}
