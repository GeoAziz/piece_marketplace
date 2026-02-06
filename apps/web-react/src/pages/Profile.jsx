import React from 'react'
import Card from '../components/ui/Card'
import Avatar from '../components/ui/Avatar'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

export default function Profile(){
  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
      <p className="text-gray-600 mb-6">Manage your seller information and preferences</p>
      
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
    </div>
  )
}
