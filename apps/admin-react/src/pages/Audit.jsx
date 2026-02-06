import React, { useEffect, useState } from 'react'
import Card from '../components/ui/Card'
import { getToken } from '../firebase'

function formatDate(timestamp) {
  if (!timestamp) return 'N/A'
  try {
    const date = new Date(timestamp.seconds ? timestamp.seconds * 1000 : timestamp)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  } catch {
    return 'N/A'
  }
}

export default function Audit(){
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    loadAuditLogs()
  }, [])

  async function loadAuditLogs(){
    setLoading(true)
    setError('')
    try{
      const token = await getToken()
      const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:4300'
      const res = await fetch(`${apiBase}/api/v1/audit-logs`, {
        headers: {Authorization: 'Bearer '+token}
      })
      const data = await res.json()
      if(!res.ok) throw new Error(data.error || 'Failed to load audit logs')
      setLogs(data.items || [])
    }catch(err){
      setError(err.message)
    }finally{
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Audit Logs</h1>
      <p className="text-gray-600 mb-6">Track all administrative actions and decisions</p>
      
      {error && (
        <Card className="p-4 bg-red-50 border-red-200 mb-4">
          <p className="text-red-700">{error}</p>
        </Card>
      )}

      {loading && (
        <Card className="p-6 text-center">
          <p className="text-gray-600">Loading audit logs...</p>
        </Card>
      )}

      {!loading && logs.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-gray-600">No audit entries yet</p>
          <p className="text-gray-500 text-sm mt-1">Administrative actions will be logged here</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {logs.map(log => (
            <Card key={log.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {log.action.charAt(0).toUpperCase() + log.action.slice(1)} — {log.targetType}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    By: {log.actorUid} | Target: {log.targetId}
                  </p>
                  {log.decision && (
                    <p className="text-sm text-gray-600 mt-1">
                      Decision: <span className="font-medium">{log.decision}</span>
                    </p>
                  )}
                  {log.rationale && (
                    <p className="text-sm text-gray-600 mt-1 italic">"{log.rationale}"</p>
                  )}
                </div>
                <div className="text-right text-xs text-gray-500">
                  {formatDate(log.createdAt)}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
