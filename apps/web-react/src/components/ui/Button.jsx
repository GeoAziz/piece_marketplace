import React from 'react'

export default function Button({children, variant = 'primary', size = 'md', className = '', disabled = false, ...props}){
  const baseClass = 'font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
  const sizeClass = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  }[size] || 'px-4 py-2'
  const variantClass = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500',
    outline: 'border border-gray-300 text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500'
  }[variant] || 'bg-blue-600 text-white hover:bg-blue-700'
  return (
    <button className={`${baseClass} ${sizeClass} ${variantClass} ${className}`} disabled={disabled} {...props}>
      {children}
    </button>
  )
}
