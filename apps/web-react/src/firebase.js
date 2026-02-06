import { initializeApp } from 'firebase/app'
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signInWithPhoneNumber, RecaptchaVerifier } from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const provider = new GoogleAuthProvider()

let _confirmationResult = null

export async function signInWithGoogle(){
  return signInWithPopup(auth, provider)
}

export function onAuth(cb){
  return onAuthStateChanged(auth, cb)
}

export async function getIdToken(){
  const user = auth.currentUser
  if(!user) return null
  return await user.getIdToken()
}

export function setupRecaptcha(containerId = 'recaptcha-container'){
  if(window.recaptchaVerifier) return window.recaptchaVerifier
  window.recaptchaVerifier = new RecaptchaVerifier(containerId, {size: 'invisible'}, auth)
  return window.recaptchaVerifier
}

export async function startPhoneSignIn(phone){
  const appVerifier = setupRecaptcha()
  _confirmationResult = await signInWithPhoneNumber(auth, phone, appVerifier)
  return _confirmationResult
}

export async function confirmPhoneCode(code){
  if(!_confirmationResult) throw new Error('No confirmationResult present')
  const result = await _confirmationResult.confirm(code)
  return result
}
