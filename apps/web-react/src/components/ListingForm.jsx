import React, {useState} from 'react'
import Input from './ui/Input'
import Textarea from './ui/Textarea'
import Button from './ui/Button'
import Card from './ui/Card'
import PageHeader from './PageHeader'
import { Upload, AlertCircle } from 'lucide-react'

export default function ListingForm(){
  const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:4100'
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    price: ''
  })
  const [file, setFile] = useState(null)
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleChange = (e) => {
    const {name, value} = e.target
    setFormData(prev => ({...prev, [name]: value}))
    setError('')
  }

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('Title is required')
      return false
    }
    if (!formData.location.trim()) {
      setError('Location is required')
      return false
    }
    if (!formData.price || Number(formData.price) <= 0) {
      setError('Valid price is required')
      return false
    }
    if (file && file.size > 10 * 1024 * 1024) {
      setError('File must be less than 10MB')
      return false
    }
    return true
  }

  async function handleSubmit(e){
    e.preventDefault()
    setError('')
    setStatus('')
    
    if (!validateForm()) return

    setLoading(true)
    try{
      setStatus('Creating listing...')
      const res = await fetch(`${apiBase}/api/v1/listings`, {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({
          title: formData.title.trim(),
          description: formData.description.trim(),
          location: formData.location.trim(),
          price: Number(formData.price)
        })
      })
      const listing = await res.json()
      if(!res.ok) throw new Error(listing.error || 'Failed to create listing')
      
      if(file){
        setStatus('Preparing file upload...')
        const authToken = localStorage.getItem('ID_TOKEN')
        const headers = {'Content-Type':'application/json'}
        if(authToken) headers['Authorization'] = 'Bearer '+authToken
        
        setStatus('Getting upload URL...')
        const upRes = await fetch(`${apiBase}/api/v1/listings/${listing.id}/upload-url`, {
          method:'POST',
          headers,
          body:JSON.stringify({
            filename: file.name,
            contentType: file.type,
            type: 'title_deed'
          })
        })
        const upData = await upRes.json()
        if(!upRes.ok) throw new Error(upData.error || 'Failed to get upload URL')
        
        setStatus('Uploading file...')
        const uploadRes = await fetch(upData.uploadUrl, {
          method:'PUT',
          headers:{'Content-Type': file.type},
          body: file
        })
        if(!uploadRes.ok) throw new Error('Upload failed')
        
        setStatus('Confirming upload...')
        const confirmRes = await fetch(`${apiBase}/api/v1/listings/${listing.id}/confirm`, {
          method:'POST',
          headers: {...headers, 'Content-Type':'application/json'},
          body:JSON.stringify({evidenceId: upData.evidenceId})
        })
        if(!confirmRes.ok) throw new Error('Failed to confirm upload')
      }
      
      setStatus('✓ Listing created successfully!')
      setFormData({title: '', description: '', location: '', price: ''})
      setFile(null)
      setProgress(0)
    }catch(err){
      setError(err.message || 'An error occurred')
      setStatus('')
    }finally{
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <PageHeader
        title="Create Listing"
        subtitle="List your land and upload evidence documents for verification."
      />
      
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., 2 acres in Nairobi"
            error={error && !formData.title ? 'Title is required' : ''}
          />
          
          <Input
            label="Location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g., Karen, Nairobi"
            error={error && !formData.location ? 'Location is required' : ''}
          />
          
          <Input
            label="Price (KES)"
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="500000"
            min="0"
            error={error && (!formData.price || Number(formData.price) <= 0) ? 'Valid price required' : ''}
          />
          
          <Textarea
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the land, features, access roads, utilities, etc."
            rows="4"
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Evidence Document (optional)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 hover:bg-blue-50 transition">
              <input
                type="file"
                onChange={(e) => {
                  setFile(e.target.files[0])
                  setError('')
                }}
                className="hidden"
                id="file-input"
              />
              <label htmlFor="file-input" className="cursor-pointer block">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="font-medium text-gray-700">Click to upload</p>
                <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG • Max 10MB</p>
              </label>
            </div>
            {file && <p className="text-sm text-gray-600 mt-2">Selected: {file.name}</p>}
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {status && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700">{status}</p>
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Creating...' : 'Create Listing'}
          </Button>
        </form>
      </Card>
      <Card className="p-5 mt-6 bg-blue-50 border border-blue-100">
        <h3 className="font-semibold text-gray-900">Verification checklist</h3>
        <ul className="mt-3 text-sm text-gray-600 space-y-2">
          <li>• Provide a clear title that includes acreage and county.</li>
          <li>• Upload legible documents (PDF or JPG) to speed approval.</li>
          <li>• Add contact details in the description for faster follow-up.</li>
        </ul>
      </Card>
    </div>
  )
}
