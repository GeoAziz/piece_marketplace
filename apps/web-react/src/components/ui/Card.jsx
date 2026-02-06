import React from 'react'

export default function Card({children, className = ''}){
  return (
    <div className={`bg-white border rounded-lg shadow-sm ${className}`}>
      {children}
    </div>
  )
}
