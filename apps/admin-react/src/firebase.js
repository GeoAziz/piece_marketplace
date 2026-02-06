import { initializeApp } from 'firebase/app'
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, getIdToken } from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const provider = new GoogleAuthProvider()

export async function signInWithGoogle(){
  return signInWithPopup(auth, provider)
}

export function onAuth(cb){
  return onAuthStateChanged(auth, cb)
}

export async function getToken(){
  const user = auth.currentUser
  if(!user) return null
  return await user.getIdToken()
}
