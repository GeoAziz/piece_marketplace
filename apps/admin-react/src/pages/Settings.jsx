import React, {useState} from 'react'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'

export default function Settings(){
  const [settings, setSettings] = useState({
    reviewQueueLimit: '50',
    autoArchiveAfterDays: '90',
    enableNotifications: true
  })

  const handleChange = (e) => {
    const {name, type, checked, value} = e.target
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
      <p className="text-gray-600 mb-6">Configure admin console and system behavior</p>
      
      <Card className="p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Review Queue</h2>
        <div className="space-y-4">
          <Input
            label="Items per queue page"
            type="number"
            name="reviewQueueLimit"
            value={settings.reviewQueueLimit}
            onChange={handleChange}
            min="10"
            max="100"
          />
          <div className="flex items-center">
            <input
              id="notifications"
              type="checkbox"
              name="enableNotifications"
              checked={settings.enableNotifications}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600 rounded"
            />
            <label htmlFor="notifications" className="ml-3 text-sm font-medium text-gray-700">
              Enable notifications for new submissions
            </label>
          </div>
        </div>
      </Card>

      <Card className="p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Data Retention</h2>
        <div className="space-y-4">
          <Input
            label="Auto-archive evidence after (days)"
            type="number"
            name="autoArchiveAfterDays"
            value={settings.autoArchiveAfterDays}
            onChange={handleChange}
            min="1"
          />
          <p className="text-sm text-gray-600">Evidence older than this will be moved to archive storage</p>
        </div>
      </Card>

      <Card className="p-6 bg-blue-50 border-blue-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">System Information</h2>
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Version</span>
            <Badge variant="primary">1.0.0</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Environment</span>
            <Badge>Production</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">API Status</span>
            <Badge variant="success">✓ Connected</Badge>
          </div>
        </div>
      </Card>

      <div className="mt-6 flex gap-2">
        <Button variant="primary">Save Settings</Button>
        <Button variant="outline">Reset to Defaults</Button>
      </div>
    </div>
  )
}
