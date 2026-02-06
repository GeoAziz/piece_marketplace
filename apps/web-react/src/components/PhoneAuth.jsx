import React, {useState} from 'react'
import { startPhoneSignIn, confirmPhoneCode } from '../firebase'

export default function PhoneAuth(){
  const [phone,setPhone]=useState('')
  const [code,setCode]=useState('')
  const [step,setStep]=useState(0)
  const [status,setStatus]=useState('')

  async function sendCode(e){
    e.preventDefault()
    setStatus('Sending code...')
    try{
      await startPhoneSignIn(phone)
      setStep(1)
      setStatus('Code sent')
    }catch(err){
      setStatus('Error: '+err.message)
    }
  }

  async function confirm(e){
    e.preventDefault()
    setStatus('Confirming...')
    try{
      await confirmPhoneCode(code)
      setStatus('Signed in')
    }catch(err){
      setStatus('Error: '+err.message)
    }
  }

  return (
    <div style={{marginBottom:12}}>
      <div id="recaptcha-container" />
      {step===0 ? (
        <form onSubmit={sendCode}>
          <label>Phone (+254...):<br/><input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="+2547xxxxxxxx" required /></label>
          <div style={{marginTop:8}}><button type="submit">Send code</button></div>
        </form>
      ) : (
        <form onSubmit={confirm}>
          <label>Code:<br/><input value={code} onChange={e=>setCode(e.target.value)} required /></label>
          <div style={{marginTop:8}}><button type="submit">Verify</button></div>
        </form>
      )}
      <div style={{fontSize:12,color:'#6b7280'}}>{status}</div>
    </div>
  )
}
