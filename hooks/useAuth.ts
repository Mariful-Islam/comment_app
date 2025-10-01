// hooks/useAuth.ts
import { useEffect, useState } from 'react'

export function useAuth() {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token') // or use cookies
    setIsAuthenticated(!!token)
    setIsLoading(false)
  }, [])

  return { isAuthenticated, isLoading }
}
