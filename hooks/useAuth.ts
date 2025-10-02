// hooks/useAuth.ts
import { useEffect, useState } from 'react'
import { onAuthStateChanged, User } from "firebase/auth"
import { auth } from "../lib/firebase"

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
      setIsLoading(false)
    })

    return () => unsubscribe()


  }, [])


  const token = localStorage.getItem('token') 

  return {
    user,
    isAuthenticated: !!user || !!token,
    isLoading,
  }
}
      