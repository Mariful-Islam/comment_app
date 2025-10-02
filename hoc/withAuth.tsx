// hoc/withAuth.tsx
"use client"
import { useRouter } from 'next/navigation'
import { useAuth } from '../hooks/useAuth'
import { useEffect } from 'react'

export function withAuth(Component: React.FC) {
  return function ProtectedPage() {
    const { isAuthenticated, isLoading } = useAuth()
    const router = useRouter()

    useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        router.replace('/login')
      }
    }, [isLoading, isAuthenticated, router])

    if (isLoading || !isAuthenticated) return null

    return <Component />
  }
}
