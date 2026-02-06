import React from 'react'

export default function Avatar({name, size = 32}){
  const initials = (name||'U').split(' ').map(s=>s[0]).slice(0,2).join('').toUpperCase()
  return (
    <div style={{width:size,height:size,borderRadius:9999,background:'#e5e7eb',display:'inline-flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:600}} aria-hidden>
      {initials}
    </div>
  )
}
