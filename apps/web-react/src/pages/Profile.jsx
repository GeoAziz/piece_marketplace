import React from 'react'
import Card from '../components/ui/Card'
import Avatar from '../components/ui/Avatar'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import PageHeader from '../components/PageHeader'
import { Link } from 'react-router-dom'

export default function Profile(){
  return (
    <div className="max-w-2xl">
      <PageHeader
        title="My Profile"
        subtitle="Manage your seller information and preferences."
        actions={(
          <Link to="/dashboard">
            <Button variant="outline">View Dashboard</Button>
          </Link>
        )}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 md:col-span-1">
          <div className="text-center">
            <Avatar name="You" />
            <h3 className="font-semibold text-gray-900 mt-4">Seller</h3>
            <p className="text-sm text-gray-600 mt-1">Active member</p>
            <Button variant="outline" className="w-full mt-4">Edit Avatar</Button>
          </div>
        </Card>
        <Card className="p-6 md:col-span-2">
          <h3 className="font-semibold text-gray-900 mb-4">Account Information</h3>
          <div className="space-y-4">
            <Input label="Full Name" placeholder="Your name" />
            <Input label="Email" type="email" placeholder="your@email.com" />
            <Input label="Phone" type="tel" placeholder="+254 7XX XXX XXX" />
            <Button variant="primary">Save Changes</Button>
          </div>
        </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Card className="p-5">
          <h3 className="font-semibold text-gray-900">Verification status</h3>
          <p className="text-sm text-gray-600 mt-2">Upload documents to unlock trusted seller badges.</p>
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Progress</span>
              <span>1 of 3 completed</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full mt-2">
              <div className="h-2 bg-blue-600 rounded-full w-1/3" />
            </div>
          </div>
          <Button variant="secondary" className="mt-4">Upload documents</Button>
        </Card>
        <Card className="p-5">
          <h3 className="font-semibold text-gray-900">Notification preferences</h3>
          <p className="text-sm text-gray-600 mt-2">Get updates when buyers message you or listings are approved.</p>
          <Button variant="outline" className="mt-4">Manage notifications</Button>
        </Card>
      </div>
    </div>
  )
}
