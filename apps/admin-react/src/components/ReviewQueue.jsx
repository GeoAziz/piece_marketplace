import React, {useState} from 'react'
import { getToken, signInWithGoogle } from '../firebase'
import Card from './ui/Card'
import Avatar from './ui/Avatar'
import Button from './ui/Button'
import Badge from './ui/Badge'
import Textarea from './ui/Textarea'
import { AlertCircle, CheckCircle, XCircle, Flag } from 'lucide-react'

export default function ReviewQueue(){
  const [items, setItems] = useState([])
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [selectedId, setSelectedId] = useState(null)
  const [rationale, setRationale] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [loaded, setLoaded] = useState(false)

  async function ensureSignedIn(){
    setStatus('Signing in...')
    setError('')
    try{
      await signInWithGoogle()
      setStatus('')
      loadQueue()
    }catch(err){
      setError('Sign-in failed: ' + err.message)
      setStatus('')
    }
  }

  async function loadQueue(){
    setStatus('Loading queue...')
    setError('')
    try{
      const token = await getToken()
      if (!token) throw new Error('Not authenticated')
      const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:4300'
      const res = await fetch(`${apiBase}/api/v1/reviews/queue`, {
        headers: {Authorization: 'Bearer '+token}
      })
      const j = await res.json()
      if(!res.ok) throw new Error(j.error || 'Failed to load queue')
      setItems(j.items || [])
      setLoaded(true)
      setStatus('')
    }catch(err){
      setError('Error: ' + err.message)
      setStatus('')
    }
  }

  async function decide(evidenceId, decision){
    if (decision === 'reject' || decision === 'flag') {
      if (!rationale.trim()) {
        setError('Rationale is required for rejections and flags')
        return
      }
    }
    
    setSubmitting(true)
    setError('')
    try{
      const token = await getToken()
      const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:4300'
      const res = await fetch(`${apiBase}/api/v1/reviews/${evidenceId}`, {
        method:'POST',
        headers: {'Content-Type':'application/json', Authorization: 'Bearer '+token},
        body: JSON.stringify({decision, rationale})
      })
      const j = await res.json()
      if(!res.ok) throw new Error(j.error || 'Failed to submit review')
      setSelectedId(null)
      setRationale('')
      setStatus(`✓ Evidence ${decision === 'accept' ? 'accepted' : decision === 'reject' ? 'rejected' : 'flagged'}`)
      setTimeout(() => loadQueue(), 800)
    }catch(err){
      setError('Error: ' + err.message)
    }finally{
      setSubmitting(false)
    }
  }

  const selected = items.find(it => it.id === selectedId)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Review Queue</h1>
          <p className="text-gray-600 mt-1">Verify uploaded evidence and issue badges</p>
        </div>
        {!loaded && (
          <Button onClick={ensureSignedIn} size="lg">
            Sign In & Load
          </Button>
        )}
      </div>

      {error && (
        <Card className="p-4 bg-red-50 border-red-200 mb-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-red-700">{error}</p>
          </div>
        </Card>
      )}

      {status && (
        <Card className="p-4 bg-green-50 border-green-200 mb-4">
          <p className="text-green-700">{status}</p>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card className="p-4">
            <h3 className="font-semibold text-gray-900 mb-3">
              Pending ({items.length})
            </h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {items.length === 0 && (
                <p className="text-sm text-gray-500 py-4 text-center">No items to review</p>
              )}
              {items.map(it => (
                <button
                  key={it.id}
                  onClick={() => {
                    setSelectedId(it.id)
                    setRationale('')
                    setError('')
                  }}
                  className={`w-full text-left p-3 rounded-lg border-2 transition ${
                    selectedId === it.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="font-medium text-sm text-gray-900 truncate">{it.listingTitle || 'Evidence'}</p>
                  <p className="text-xs text-gray-500 truncate">{it.id}</p>
                </button>
              ))}
            </div>
          </Card>
        </div>

        <div className="lg:col-span-2">
          {selected ? (
            <Card className="p-6">
              <div className="mb-6">
                <div className="flex items-start gap-4">
                  <Avatar name={selected.uploaderUid || 'User'} />
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{selected.listingTitle || 'Evidence'}</h2>
                    <p className="text-sm text-gray-600 mt-1">ID: {selected.id}</p>
                    <p className="text-sm text-gray-600">Uploader: {selected.uploaderUid}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center mb-6">
                <div className="text-center">
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-gray-600">Document Preview</p>
                </div>
              </div>

              <Textarea
                label="Review Notes (required for reject/flag)"
                value={rationale}
                onChange={(e) => setRationale(e.target.value)}
                placeholder="Provide detailed feedback for the decision..."
                rows="4"
              />

              <div className="mt-6 flex gap-3">
                <Button
                  onClick={() => decide(selected.id, 'accept')}
                  disabled={submitting}
                  variant="primary"
                  className="flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Accept & Badge
                </Button>
                <Button
                  onClick={() => decide(selected.id, 'reject')}
                  disabled={submitting}
                  variant="danger"
                  className="flex items-center gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  Reject
                </Button>
                <Button
                  onClick={() => decide(selected.id, 'flag')}
                  disabled={submitting}
                  variant="secondary"
                  className="flex items-center gap-2"
                >
                  <Flag className="w-4 h-4" />
                  Flag
                </Button>
              </div>
            </Card>
          ) : (
            <Card className="p-12 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-lg mb-4">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="text-gray-600 text-center">Select an item from the queue to review</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
