"use client"

import { useAuth } from "@/components/auth-provider"
import { useEffect } from "react"

export default function Page() {
  const { user, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        window.location.href = "/dashboard"
      } else {
        window.location.href = "/login"
      }
    }
  }, [user, isLoading])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  )
}
