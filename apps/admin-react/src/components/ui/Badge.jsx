import React from 'react'

export default function Badge({children, variant = 'default'}){
  const base = 'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap'
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    primary: 'bg-blue-100 text-blue-800',
    muted: 'bg-gray-200 text-gray-700'
  }
  return <span className={`${base} ${variants[variant] || variants.default}`}>{children}</span>
}
