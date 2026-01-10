// hooks/useAuth.ts
"use client"
import { useEffect, useState } from 'react'
import { onAuthStateChanged, User } from "firebase/auth"
import { auth } from "../lib/firebase"
import Cookies from "js-cookie";

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





  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const userId = Cookies.get("userId");



    return {
      user,
      isAuthenticated: (!!user && !!userId) || (!!token && !!userId),
      isLoading,
    }
  }